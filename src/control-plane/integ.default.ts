// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { CfnRule, EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsSolutionsChecks } from 'cdk-nag';
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

    const eventBusWatcherLogGroup = new LogGroup(this, 'EventBusWatcherLogGroup', {
      logGroupName: `/aws/events/EventBusWatcher-${this.node.addr}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_WEEK,
    });

    // use escape-hatch instead of native addTarget functionality to avoid
    // unpredictable resource names that emit cdk-nag errors
    // https://github.com/aws/aws-cdk/issues/17002#issuecomment-1144066244
    const cfnRule = eventBusWatcherRule.node.defaultChild as CfnRule;
    cfnRule.targets = [
      {
        arn: eventBusWatcherLogGroup.logGroupArn,
        id: this.node.addr,
      },
    ];
  }
}

if (!process.env.CDK_PARAM_SYSTEM_ADMIN_EMAIL) {
  throw new Error('Please provide system admin email');
}

const app = new cdk.App();
const integStack = new IntegStack(app, process.env.CDK_PARAM_STACK_ID ?? 'ControlPlane-integ', {
  systemAdminEmail: process.env.CDK_PARAM_SYSTEM_ADMIN_EMAIL,
  stackName: process.env.CDK_PARAM_STACK_NAME,
});

// Ensure that we remove all resources (like DDB tables, s3 buckets) when deleting the stack.
cdk.Aspects.of(integStack).add(new DestroyPolicySetter());
cdk.Aspects.of(integStack).add(new AwsSolutionsChecks({ verbose: true }));
