// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IBilling, IFunctionTrigger } from './billing-interface';
import { DetailType, IEventManager, addTemplateTag } from '../../utils';

/**
 * Encapsulates the list of properties for a BillingProvider.
 */
export interface BillingProviderProps {
  /**
   * An implementation of the IBilling interface.
   */
  readonly billing: IBilling;

  /**
   * An IEventManager object to help coordinate events.
   */
  readonly eventManager: IEventManager;

  /**
   * An API Gateway Resource for the BillingProvider to use
   * when setting up API endpoints.
   */
  readonly controlPlaneAPI: apigatewayV2.HttpApi;
}

/**
 * Represents a Billing Provider that handles billing-related operations.
 *
 * This construct sets up event targets for various billing-related events
 * and optionally creates an API Gateway resource for a webhook function.
 */
export class BillingProvider extends Construct {
  /**
   * The API Gateway resource containing the billing webhook resource.
   * Only set when the IBilling webhookFunction is defined.
   */
  public readonly controlPlaneAPIBillingWebhookResourcePath?: string;

  /**
   * Creates a new instance of the BillingProvider construct.
   *
   * @param scope The scope in which to define this construct.
   * @param id The unique ID of this construct.
   * @param props The properties for the BillingProvider.
   */
  constructor(scope: Construct, id: string, props: BillingProviderProps) {
    super(scope, id);
    addTemplateTag(this, 'BillingProvider');

    this.createEventTarget(
      props.eventManager,
      DetailType.ONBOARDING_REQUEST,
      props.billing.createCustomerFunction
    );

    this.createEventTarget(
      props.eventManager,
      DetailType.OFFBOARDING_REQUEST,
      props.billing.deleteCustomerFunction
    );

    this.createEventTarget(
      props.eventManager,
      DetailType.TENANT_USER_CREATED,
      props.billing.createUserFunction
    );

    this.createEventTarget(
      props.eventManager,
      DetailType.TENANT_USER_DELETED,
      props.billing.deleteUserFunction
    );

    if (props.billing.putUsageFunction) {
      const schedule =
        'handler' in props.billing.putUsageFunction
          ? props.billing.putUsageFunction.schedule
          : events.Schedule.rate(cdk.Duration.hours(24));

      const handler =
        'handler' in props.billing.putUsageFunction
          ? props.billing.putUsageFunction.handler
          : props.billing.putUsageFunction;

      new events.Rule(this, 'BillingPutUsageRule', {
        schedule: schedule,
        targets: [new targets.LambdaFunction(handler)],
      });
    }

    if (props.billing.ingestor) {
      new cdk.CfnOutput(this, 'DataIngestorName', {
        value: props.billing.ingestor.dataIngestorName,
        key: 'dataIngestorName',
      });
    }

    if (props.billing.webhookFunction && props.billing.webhookPath) {
      this.controlPlaneAPIBillingWebhookResourcePath = `/billing/${props.billing.webhookPath}`;

      const [controlPlaneAPIBillingWebhookResourceRoute] = props.controlPlaneAPI.addRoutes({
        path: this.controlPlaneAPIBillingWebhookResourcePath,
        methods: [apigatewayV2.HttpMethod.POST],
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'billingWebhookHttpLambdaIntegration',
          props.billing.webhookFunction
        ),
      });

      NagSuppressions.addResourceSuppressionsByPath(
        cdk.Stack.of(this),
        [controlPlaneAPIBillingWebhookResourceRoute.node.path],
        [
          {
            id: 'AwsSolutions-APIG4',
            reason:
              'Authorization for webhook function not standardized. Will have to be done in API target.',
          },
        ]
      );
    }
  }

  private getFunctionProps(
    fn: IFunction | IFunctionTrigger,
    defaultTrigger: DetailType
  ): IFunctionTrigger {
    return 'handler' in fn
      ? { handler: fn.handler, trigger: fn.trigger }
      : { handler: fn, trigger: defaultTrigger };
  }

  private createEventTarget(
    eventManager: IEventManager,
    defaultEvent: DetailType,
    fn?: IFunction | IFunctionTrigger
  ) {
    if (!fn) {
      return;
    }

    const { handler, trigger } = this.getFunctionProps(fn, defaultEvent);
    eventManager.addTargetToEvent(this, trigger, new targets.LambdaFunction(handler));
  }
}
