// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { IResource, Resource } from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as aws_events from 'aws-cdk-lib/aws-events';
import * as event_targets from 'aws-cdk-lib/aws-events-targets';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IBilling } from './billing-interface';
import { EventManager, EventManagerEvent } from '../../utils';

export interface BillingProps {
  readonly billing: IBilling;
  readonly eventManager: EventManager;
  readonly tenantDetailsTable: dynamodb.Table;
  readonly controlPlaneAPIBillingResource: Resource;
  readonly tenantIdColumn: string;
}

export class BillingTemplate extends Construct {
  public readonly controlPlaneAPIBillingWebhookResource: IResource;
  constructor(scope: Construct, id: string, props: BillingProps) {
    super(scope, id);
    this.controlPlaneAPIBillingWebhookResource = props.controlPlaneAPIBillingResource.addResource(
      props.billing.webhookPath
    );

    props.eventManager.addTargetToEvent(
      EventManagerEvent.PROVISION_SUCCESS,
      new event_targets.LambdaFunction(props.billing.createUserFunction)
    );

    props.eventManager.addTargetToEvent(
      EventManagerEvent.DEPROVISION_SUCCESS,
      new event_targets.LambdaFunction(props.billing.deleteUserFunction)
    );

    // trigger this.billingPutUsage every 24 hours
    new aws_events.Rule(this, 'BillingPutUsageRule', {
      schedule: aws_events.Schedule.rate(cdk.Duration.hours(24)),
      targets: [new event_targets.LambdaFunction(props.billing.putUsageFunction)],
    });

    this.controlPlaneAPIBillingWebhookResource.addMethod(
      'POST',
      new cdk.aws_apigateway.LambdaIntegration(props.billing.webhookFunction)
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${this.controlPlaneAPIBillingWebhookResource}/OPTIONS/Resource`,
        `${this.controlPlaneAPIBillingWebhookResource}/POST/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for webhook function or OPTIONS method.',
        },
        {
          id: 'AwsSolutions-COG4',
          reason: 'These methods do not require a cognito authorizer.',
        },
      ]
    );
  }
}
