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
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { CfnTable } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Function, LayerVersion, Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { TenantManagementTable } from './tenant-management.table';
import { IEventManager } from '../../utils';

/**
Represents the properties required for the Tenant Management Lambda function.
@interface TenantManagementLambdaProps
@property {TenantManagementTable} table - The table used for Tenant Management.
@property {IEventManager} eventManager - The event manager used for handling events in Tenant Management. */
export interface TenantManagementLambdaProps {
  readonly table: TenantManagementTable;
  readonly eventManager: IEventManager;
}

/**
Represents the Tenant Management Lambda construct.
@class TenantManagementLambda
@extends {Construct}
@property {Function} tenantManagementFunc - The Tenant Management Lambda function.
@param {Construct} scope - The scope in which this construct is defined.
@param {string} id - The construct's identifier.
@param {TenantManagementLambdaProps} props - The properties required for the Tenant Management Lambda.
*/
export class TenantManagementLambda extends Construct {
  tenantManagementFunc: Function;

  constructor(scope: Construct, id: string, props: TenantManagementLambdaProps) {
    super(scope, id);

    /**
     * Creates an IAM role for the Tenant Management Lambda function.
     * The role is granted read and write access to the Tenant Details table,
     * and the ability to put events to the Event Manager.
     * The role is also assigned the AWSLambdaBasicExecutionRole,
     * CloudWatchLambdaInsightsExecutionRolePolicy, and AWSXrayWriteOnlyAccess
     * managed policies.
     */
    const tenantManagementExecRole = new Role(this, 'tenantManagementExecRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    props.table.tenantDetails.grantReadWriteData(tenantManagementExecRole);
    props.eventManager.grantPutEventsTo(tenantManagementExecRole);

    tenantManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    tenantManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );
    tenantManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess')
    );

    NagSuppressions.addResourceSuppressions(
      tenantManagementExecRole,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Index name(s) not known beforehand.',
          appliesTo: [
            `Resource::<${Stack.of(this).getLogicalId(props.table.tenantDetails.node.defaultChild as CfnTable)}.Arn>/index/*`,
          ],
        },
        {
          id: 'AwsSolutions-IAM4',
          reason:
            'Suppress usage of AWSLambdaBasicExecutionRole, CloudWatchLambdaInsightsExecutionRolePolicy, and AWSXrayWriteOnlyAccess.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/AWSXrayWriteOnlyAccess',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    // https://docs.powertools.aws.dev/lambda/python/3.6.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV3-python313-arm64:7`;

    /**
     * Creates the Tenant Management Lambda function.
     * The function is configured with the necessary environment variables,
     * the Tenant Management execution role, and the AWS Lambda Powertools layer.
     */
    const tenantManagementFunc = new PythonFunction(this, 'TenantManagementServices', {
      entry: path.join(__dirname, '../../../resources/functions/tenant-management'),
      runtime: Runtime.PYTHON_3_13,
      index: 'index.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: tenantManagementExecRole,
      layers: [
        LayerVersion.fromLayerVersionArn(this, 'LambdaPowerTools', lambdaPowerToolsLayerARN),
      ],
      environment: {
        TENANT_DETAILS_TABLE: props.table.tenantDetails.tableName,
      },
      architecture: Architecture.X86_64,
    });

    this.tenantManagementFunc = tenantManagementFunc;
  }
}
