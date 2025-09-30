/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as path from 'path';
import * as lambda_python from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Architecture } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IBilling, IFunctionSchedule } from './billing-interface';
import { IASyncFunction } from '../../utils';
import { FirehoseAggregator, IDataIngestorAggregator } from '../ingestor-aggregator';

export class MockBillingProvider extends Construct implements IBilling {
  public createCustomerFunction: IASyncFunction;
  public deleteCustomerFunction: IASyncFunction;
  public ingestor?: IDataIngestorAggregator;
  public putUsageFunction?: IFunctionSchedule;
  private billingTable: dynamodb.Table;
  private customersTable: dynamodb.Table;
  private lambdaPowertoolsLayer: lambda.ILayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create DynamoDB table for billing records
    this.billingTable = new dynamodb.Table(this, 'BillingTable', {
      partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'billingPeriod', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    new cdk.CfnOutput(this, 'BillingTableName', {
      value: this.billingTable.tableName,
    });

    // Create DynamoDB table for customer records
    this.customersTable = new dynamodb.Table(this, 'CustomersTable', {
      partitionKey: { name: 'customerId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    new cdk.CfnOutput(this, 'CustomersTableName', {
      value: this.customersTable.tableName,
    });

    // Add a global secondary index on the tenantId field
    const tenantIndexName = 'TenantIndex';
    this.customersTable.addGlobalSecondaryIndex({
      indexName: tenantIndexName,
      partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    });

    // Create FirehoseAggregator
    this.ingestor = new FirehoseAggregator(this, 'BillingIngestor', {
      primaryKeyColumn: 'tenantId',
      primaryKeyPath: 'tenantId',
      aggregateKeyPath: 'metric.name',
      aggregateValuePath: 'metric.value',
      autoDeleteObjects: true,
    });

    new cdk.CfnOutput(this, 'IngestorTableName', {
      value: this.ingestor.dataRepository.tableName,
    });

    // https://docs.powertools.aws.dev/lambda/python/3.6.0/#lambda-layer
    this.lambdaPowertoolsLayer = lambda_python.PythonLayerVersion.fromLayerVersionArn(
      this,
      'LambdaPowerTools',
      `arn:aws:lambda:${cdk.Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV3-python313-arm64:7`
    );

    // Create Lambda functions
    this.createCustomerFunction = {
      handler: this.createPythonFunction('CreateCustomer', 'create-customer'),
    };

    this.deleteCustomerFunction = {
      handler: this.createPythonFunction('DeleteCustomer', 'delete-customer', {
        TENANT_INDEX_NAME: tenantIndexName,
      }),
    };

    // Create PutUsage function
    const putUsageHandler = this.createPythonFunction('PutUsage', 'put-usage');

    new cdk.CfnOutput(this, 'PutUsageFunctionName', {
      value: putUsageHandler.functionName,
    });

    this.putUsageFunction = {
      handler: putUsageHandler,
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.hours(24)),
    };

    // Grant permissions
    this.customersTable.grantReadWriteData(this.createCustomerFunction.handler);
    this.customersTable.grantReadWriteData(this.deleteCustomerFunction.handler);

    NagSuppressions.addResourceSuppressions(
      [this.createCustomerFunction.handler, this.deleteCustomerFunction.handler],
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'grantReadWriteData grants access to all indices for table.',
          appliesTo: [
            `Resource::<${cdk.Stack.of(this).getLogicalId(this.customersTable.node.defaultChild as dynamodb.CfnTable)}.Arn>/index/*`,
          ],
        },
      ],
      true
    );

    this.billingTable.grantReadWriteData(putUsageHandler);
    this.ingestor.dataRepository.grantReadWriteData(putUsageHandler);
  }

  private createPythonFunction(
    id: string,
    entry: string,
    additionalEnv: Record<string, string> = {}
  ): lambda_python.PythonFunction {
    const handler = new lambda_python.PythonFunction(this, id, {
      entry: path.join(__dirname, `../../../resources/functions/mock-billing/${entry}`),
      runtime: lambda.Runtime.PYTHON_3_13,
      timeout: cdk.Duration.minutes(5),
      index: 'index.py',
      handler: 'handler',
      environment: {
        CUSTOMERS_TABLE: this.customersTable.tableName,
        BILLING_TABLE: this.billingTable.tableName,
        DATA_REPOSITORY: this.ingestor!.dataRepository.tableName,
        ...additionalEnv,
      },
      layers: [this.lambdaPowertoolsLayer],
      architecture: Architecture.X86_64,
    });

    NagSuppressions.addResourceSuppressions(
      handler,
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress usage of AWSLambdaBasicExecutionRole',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
      ],
      true
    );

    return handler;
  }
}
