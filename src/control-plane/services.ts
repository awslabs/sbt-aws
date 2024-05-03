// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration, Stack } from 'aws-cdk-lib';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Runtime, LayerVersion, Function } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { Tables } from './tables';
import { DetailType, EventManager } from '../utils';

export interface ServicesProps {
  readonly tables: Tables;
  readonly eventManager: EventManager;
}

export class Services extends Construct {
  tenantManagementServices: Function;

  constructor(scope: Construct, id: string, props: ServicesProps) {
    super(scope, id);

    const tenantManagementExecRole = new Role(this, 'tenantManagementExecRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    props.tables.tenantDetails.grantReadWriteData(tenantManagementExecRole);
    props.eventManager.eventBus.grantPutEventsTo(tenantManagementExecRole);

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
          appliesTo: [`Resource::<ControlPlanetablesstackTenantDetails78527218.Arn>/index/*`],
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

    const tenantManagementServices = new PythonFunction(this, 'TenantManagementServices', {
      entry: path.join(__dirname, '../../resources/functions/tenant-management'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: tenantManagementExecRole,
      layers: [
        LayerVersion.fromLayerVersionArn(this, 'LambdaPowerTools', lambdaPowerToolsLayerARN),
      ],
      environment: {
        EVENTBUS_NAME: props.eventManager.eventBus.eventBusName,
        EVENT_SOURCE: EventManager.CONTROL_PLANE_SOURCE,
        TENANT_DETAILS_TABLE: props.tables.tenantDetails.tableName,
        ONBOARDING_DETAIL_TYPE: DetailType.ONBOARDING_REQUEST,
        OFFBOARDING_DETAIL_TYPE: DetailType.OFFBOARDING_REQUEST,
        ACTIVATE_DETAIL_TYPE: DetailType.ACTIVATE_REQUEST,
        DEACTIVATE_DETAIL_TYPE: DetailType.DEACTIVATE_SUCCESS,
      },
    });

    this.tenantManagementServices = tenantManagementServices;
  }
}
