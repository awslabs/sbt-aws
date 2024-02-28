// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { Duration } from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Runtime, LayerVersion, Function } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { Tables } from './tables';

export interface ServicesProps {
  readonly eventBus: EventBus;
  readonly idpDetails: string;
  readonly lambdaLayer: LayerVersion;
  readonly tables: Tables;
  readonly onboardingDetailType: string;
  readonly controlPlaneEventSource: string;
}

export class Services extends Construct {
  tenantManagementServices: Function;

  constructor(scope: Construct, id: string, props: ServicesProps) {
    super(scope, id);

    const tenantManagementExecRole = new Role(this, 'tenantManagementExecRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    props.tables.tenantDetails.grantReadWriteData(tenantManagementExecRole);
    props.eventBus.grantPutEventsTo(tenantManagementExecRole);

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

    const tenantManagementServices = new PythonFunction(this, 'TenantManagementServices', {
      entry: path.join(__dirname, '../../resources/functions/'),
      runtime: Runtime.PYTHON_3_12,
      index: 'tenant_management.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: tenantManagementExecRole,
      layers: [props.lambdaLayer],
      environment: {
        EVENTBUS_NAME: props.eventBus.eventBusName,
        EVENT_SOURCE: props.controlPlaneEventSource,
        TENANT_DETAILS_TABLE: props.tables.tenantDetails.tableName,
      },
    });

    this.tenantManagementServices = tenantManagementServices;
  }
}
