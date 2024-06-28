// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as lambda_python from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

export interface TenantConfigLambdasProps {
  readonly tenantDetails: Table;
  readonly tenantConfigIndexName: string;
  readonly tenantDetailsTenantNameColumn: string;
  readonly tenantDetailsTenantConfigColumn: string;
}

export class TenantConfigLambdas extends Construct {
  public readonly tenantConfigFunction: lambda.Function;
  constructor(scope: Construct, id: string, props: TenantConfigLambdasProps) {
    super(scope, id);
    addTemplateTag(this, 'TenantConfigService');

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${
      cdk.Stack.of(this).region
    }:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`;

    this.tenantConfigFunction = new lambda_python.PythonFunction(
      this,
      'TenantConfigServiceLambda',
      {
        entry: path.join(__dirname, '../../../resources/functions/tenant-config/'),
        runtime: lambda.Runtime.PYTHON_3_12,
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
            `Resource::<ControlPlanetenantManagementServicvestenantManagementTableTenantDetails974E95B8.Arn>/index/*`,
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
  }
}
