// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import * as path from 'path';
import { DetailType, IEventManager } from '../../utils';
import { TenantManagementTable } from './tenant-management.table';

export interface ServicesProps {
  readonly table: TenantManagementTable;
  readonly eventManager: IEventManager;
}

export class TenantManagementLambda extends Construct {
  tenantManagementFunc: Function;

  constructor(scope: Construct, id: string, props: ServicesProps) {
    super(scope, id);

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
            `Resource::<ControlPlanetenantManagementServicvestenantManagementTableTenantDetails974E95B8.Arn>/index/*`,
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

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${
      Stack.of(this).region
    }:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`;

    const tenantManagementFunc = new PythonFunction(this, 'TenantManagementServices', {
      entry: path.join(__dirname, '../../../resources/functions/tenant-management'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: tenantManagementExecRole,
      layers: [
        LayerVersion.fromLayerVersionArn(this, 'LambdaPowerTools', lambdaPowerToolsLayerARN),
      ],
      environment: {
        EVENTBUS_NAME: props.eventManager.busName,
        EVENT_SOURCE: props.eventManager.controlPlaneEventSource,
        TENANT_DETAILS_TABLE: props.table.tenantDetails.tableName,
        ONBOARDING_DETAIL_TYPE: DetailType.ONBOARDING_REQUEST,
        OFFBOARDING_DETAIL_TYPE: DetailType.OFFBOARDING_REQUEST,
        ACTIVATE_DETAIL_TYPE: DetailType.ACTIVATE_REQUEST,
        DEACTIVATE_DETAIL_TYPE: DetailType.DEACTIVATE_SUCCESS,
      },
    });

    this.tenantManagementFunc = tenantManagementFunc;
  }
}
