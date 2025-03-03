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
import { CfnTable, Table } from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

/**
 * Represents the properties required to initialize the TenantConfigLambdas.
 *
 * @interface TenantConfigLambdasProps
 * @property {Table} tenantDetails - The table that stores the tenant details.
 * @property {string} tenantConfigIndexName - The name of the global secondary index for the tenant configuration.
 * @property {string} tenantDetailsTenantNameColumn - The name of the column that stores the tenant name.
 * @property {string} tenantDetailsTenantConfigColumn - The name of the column that stores the tenant configuration.
 */
export interface TenantConfigLambdasProps {
  readonly tenantDetails: Table;
  readonly tenantConfigIndexName: string;
  readonly tenantDetailsTenantNameColumn: string;
  readonly tenantDetailsTenantConfigColumn: string;
}

/**
 * Represents a set of Lambda functions for managing tenant configurations.
 *
 * @class TenantConfigLambdas
 * @extends Construct
 */
export class TenantConfigLambdas extends Construct {
  /**
   * The Lambda function responsible for managing tenant configurations.
   *
   * @type {lambda.Function}
   */
  public readonly tenantConfigFunction: lambda.Function;

  /**
   * Constructs a new instance of the TenantConfigLambdas.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   * @param {TenantConfigLambdasProps} props - The properties required to initialize the TenantConfigLambdas.
   */
  constructor(scope: Construct, id: string, props: TenantConfigLambdasProps) {
    super(scope, id);
    addTemplateTag(this, 'TenantConfigService');

    // https://docs.powertools.aws.dev/lambda/python/3.6.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${cdk.Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV3-python313-x86_64:7`;

    this.tenantConfigFunction = new lambda_python.PythonFunction(
      this,
      'TenantConfigServiceLambda',
      {
        entry: path.join(__dirname, '../../../resources/functions/tenant-config/'),
        runtime: lambda.Runtime.PYTHON_3_13,
        index: 'index.py',
        handler: 'handler',
        tracing: lambda.Tracing.ACTIVE,
        environment: {
          TENANT_DETAILS_TABLE: props.tenantDetails.tableName,
          TENANT_CONFIG_INDEX_NAME: props.tenantConfigIndexName,
          TENANT_NAME_COLUMN: props.tenantDetailsTenantNameColumn,
          TENANT_CONFIG_COLUMN: props.tenantDetailsTenantConfigColumn,
        },
        logGroup: new cdk.aws_logs.LogGroup(this, 'BillingIngestorLogGroup', {
          retention: cdk.aws_logs.RetentionDays.FIVE_DAYS,
        }),
        layers: [
          lambda.LayerVersion.fromLayerVersionArn(
            this,
            'LambdaPowerTools',
            lambdaPowerToolsLayerARN
          ),
        ],
      }
    );

    props.tenantDetails.grantReadData(this.tenantConfigFunction);

    NagSuppressions.addResourceSuppressions(
      this.tenantConfigFunction.role!,
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress usage of AWSLambdaBasicExecutionRole.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'This is Resource::* being used to output logs and x-ray traces and nothing else.',
          appliesTo: ['Resource::*'],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Index name(s) not known beforehand.',
          appliesTo: [
            `Resource::<${cdk.Stack.of(this).getLogicalId(props.tenantDetails.node.defaultChild as CfnTable)}.Arn>/index/*`,
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
  }
}
