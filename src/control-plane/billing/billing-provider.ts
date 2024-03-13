// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { IResource, Resource } from 'aws-cdk-lib/aws-apigateway';
import * as aws_events from 'aws-cdk-lib/aws-events';
import * as event_targets from 'aws-cdk-lib/aws-events-targets';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IBilling } from './billing-interface';
import { EventManager, DetailType } from '../../utils';

/**
 * Encapsulates the list of properties for a BillingProvider.
 */
export interface BillingProviderProps {
  /**
   * An implementation of the IBilling interface.
   */
  readonly billing: IBilling;

  /**
   * An EventManager object to help coordinate events.
   */
  readonly eventManager: EventManager;

  /**
   * An API Gateway Resource for the BillingProvider to use
   * when setting up API endpoints.
   */
  readonly controlPlaneAPIBillingResource: Resource;
}

export class BillingProvider extends Construct {
  /**
   * The API Gateway resource containing the billing webhook resource.
   * Only set when the IBilling webhookFunction is defined.
   */
  public readonly controlPlaneAPIBillingWebhookResource?: IResource;
  constructor(scope: Construct, id: string, props: BillingProviderProps) {
    super(scope, id);

    props.eventManager.addTargetToEvent(
      DetailType.PROVISION_SUCCESS,
      new event_targets.LambdaFunction(props.billing.createUserFunction)
    );

    props.eventManager.addTargetToEvent(
      DetailType.DEPROVISION_SUCCESS,
      new event_targets.LambdaFunction(props.billing.deleteUserFunction)
    );

    new aws_events.Rule(this, 'BillingPutUsageRule', {
      schedule: aws_events.Schedule.rate(cdk.Duration.hours(24)),
      targets: [new event_targets.LambdaFunction(props.billing.putUsageFunction)],
    });

    if (props.billing.webhookFunction && props.billing.webhookPath) {
      this.controlPlaneAPIBillingWebhookResource = props.controlPlaneAPIBillingResource.addResource(
        props.billing.webhookPath
      );

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
}
