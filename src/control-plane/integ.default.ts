// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { CognitoAuth, ControlPlane } from '.';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';

export interface IntegStackProps extends cdk.StackProps {
  systemAdminEmail: string;
}

export class IntegStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: IntegStackProps) {
    super(scope, id, props);

    // for event bridge communication
    const idpName = 'COGNITO';
    const systemAdminRoleName = 'SystemAdmin';

    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
      idpName: idpName,
      systemAdminRoleName: systemAdminRoleName,
      systemAdminEmail: props.systemAdminEmail,
      // optional parameter possibly populated by another construct or an argument
      // controlPlaneCallbackURL: 'https://example.com',
    });

    const controlPlane = new ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
    });

    const eventBus = EventBus.fromEventBusArn(
      this,
      'controlPlaneEventBus',
      controlPlane.eventBusArn
    );

    // for monitoring purposes
    const eventBusWatcherRule = new Rule(this, 'EventBusWatcherRule', {
      eventBus: eventBus,
      enabled: true,
      eventPattern: {
        source: [
          controlPlane.eventManager.controlPlaneEventSource,
          controlPlane.eventManager.applicationPlaneEventSource,
        ],
      },
    });

    eventBusWatcherRule.addTarget(
      new targets.CloudWatchLogGroup(
        new LogGroup(this, 'EventBusWatcherLogGroup', {
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          retention: RetentionDays.ONE_WEEK,
        })
      )
    );
  }
}

if (!process.env.CDK_PARAM_SYSTEM_ADMIN_EMAIL) {
  throw new Error('Please provide system admin email');
}

const app = new cdk.App();
const integStack = new IntegStack(app, 'ControlPlane-integ', {
  systemAdminEmail: process.env.CDK_PARAM_SYSTEM_ADMIN_EMAIL,
  stackName: process.env.CDK_PARAM_STACK_NAME,
});

NagSuppressions.addResourceSuppressionsByPath(
  integStack,
  [
    `/${integStack.artifactId}/AWS679f53fac002430cb0da5b7982bd2287/Resource`,
    `/${integStack.artifactId}/AWS679f53fac002430cb0da5b7982bd2287/ServiceRole/Resource`,
    `/${integStack.artifactId}/EventsLogGroupPolicyControlPlaneintegEventBusWatcherRule79DEBEE7/CustomResourcePolicy/Resource`,
  ],
  [
    {
      id: 'AwsSolutions-IAM4',
      reason: 'Suppress error from resource created for testing.',
      appliesTo: [
        'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      ],
    },
    {
      id: 'AwsSolutions-IAM5',
      reason: 'Suppress error from resource created for testing.',
      appliesTo: ['Resource::*'],
    },
    {
      id: 'AwsSolutions-L1',
      reason: 'Suppress error from resource created for testing.',
    },
  ]
);

// Ensure that we remove all resources (like DDB tables, s3 buckets) when deleting the stack.
cdk.Aspects.of(integStack).add(new DestroyPolicySetter());
cdk.Aspects.of(integStack).add(new AwsSolutionsChecks({ verbose: true }));
