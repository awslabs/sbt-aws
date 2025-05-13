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
import { PythonFunction, PythonLayerVersion } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Function, Runtime, Architecture } from 'aws-cdk-lib/aws-lambda';
import { CfnHttpApi } from 'aws-cdk-lib/aws-sam';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { TenantRegistrationTable } from './tenant-registration.table';
import { IEventManager } from '../../utils';

/**
Represents the properties required for the Tenant Registration Lambda function.
@interface TenantRegistrationLambdaProps
@property {TenantRegistrationTable} table - The table used for Tenant Registration.
@property {IEventManager} eventManager - The event manager used for handling events in Tenant Registration.
@property {HttpApi} api - The API that has serves the /tenants endpoint. This will be the API that the tenant registration lambda makes requests to when managing tenants. */
export interface TenantRegistrationLambdaProps {
  readonly table: TenantRegistrationTable;
  readonly eventManager: IEventManager;
  readonly api: HttpApi;
  readonly tenantsPath: string;
  readonly tenantIdPath: string;
}

/**
Represents the Tenant Registration Lambda construct.
@class TenantRegistrationLambda
@extends {Construct}
@property {Function} tenantRegistrationFunc - The Tenant Registration Lambda function.
@param {Construct} scope - The scope in which this construct is defined.
@param {string} id - The construct's identifier.
@param {TenantRegistrationLambdaProps} props - The properties required for the Tenant Registration Lambda.
*/
export class TenantRegistrationLambda extends Construct {
  tenantRegistrationFunc: Function;

  constructor(scope: Construct, id: string, props: TenantRegistrationLambdaProps) {
    super(scope, id);

    const lambdaPowertoolsLayer = PythonLayerVersion.fromLayerVersionArn(
      this,
      'LambdaPowerTools',
      `arn:aws:lambda:${Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV3-python313-arm64:7`
    );

    const awsRequestsAuthLayer = new PythonLayerVersion(this, 'AwsRequestsAuthLayer', {
      entry: path.join(__dirname, '../../../resources/layers/helper'),
      compatibleRuntimes: [Runtime.PYTHON_3_13],
      compatibleArchitectures: [Architecture.ARM_64],
      bundling: {
        platform: 'linux/arm64',
      },
    });

    // Lambda for Tenant Registration
    this.tenantRegistrationFunc = new PythonFunction(this, 'TenantRegistrationFunc', {
      runtime: Runtime.PYTHON_3_13,
      entry: path.join(__dirname, '../../../resources/functions/tenant-registrations'),
      timeout: Duration.minutes(3),
      environment: {
        TENANT_REGISTRATION_TABLE_NAME: props.table.tenantRegistration.tableName,
        TENANT_API_URL: props.api.url!,
        EVENTBUS_NAME: props.eventManager.busName,
        EVENT_SOURCE: props.eventManager.controlPlaneEventSource,
        ONBOARDING_DETAIL_TYPE: props.eventManager.events.onboardingRequest.detailType,
        OFFBOARDING_DETAIL_TYPE: props.eventManager.events.offboardingRequest.detailType,
      },
      layers: [lambdaPowertoolsLayer, awsRequestsAuthLayer],
      architecture: Architecture.ARM_64,
    });

    props.table.tenantRegistration.grantReadWriteData(this.tenantRegistrationFunc);
    props.eventManager.grantPutEventsTo(this.tenantRegistrationFunc);

    this.tenantRegistrationFunc.role?.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ['execute-api:Invoke'],
        resources: [
          props.api.arnForExecuteApi('POST', props.tenantsPath, props.api.defaultStage?.stageName),
          props.api.arnForExecuteApi(
            'DELETE',
            `${props.tenantsPath}/*`,
            props.api.defaultStage?.stageName
          ),
          props.api.arnForExecuteApi(
            'PUT',
            `${props.tenantsPath}/*`,
            props.api.defaultStage?.stageName
          ),
        ],
      })
    );

    NagSuppressions.addResourceSuppressions(
      this.tenantRegistrationFunc.role!,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Tenant Ids not known beforehand for PUT and DELETE endpoints.',
          appliesTo: [
            `Resource::arn:<AWS::Partition>:execute-api:<AWS::Region>:<AWS::AccountId>:<${Stack.of(this).getLogicalId(props.api.node.defaultChild as CfnHttpApi)}>/${props.api.defaultStage?.stageName}/DELETE/tenants/*`,
            `Resource::arn:<AWS::Partition>:execute-api:<AWS::Region>:<AWS::AccountId>:<${Stack.of(this).getLogicalId(props.api.node.defaultChild as CfnHttpApi)}>/${props.api.defaultStage?.stageName}/PUT/tenants/*`,
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
  }
}
