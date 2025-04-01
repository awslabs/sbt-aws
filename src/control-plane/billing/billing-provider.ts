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

import * as cdk from 'aws-cdk-lib';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IBilling } from './billing-interface';
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

    [
      {
        defaultFunctionTrigger: DetailType.ONBOARDING_REQUEST,
        functionDefinition: props.billing.createCustomerFunction,
      },
      {
        defaultFunctionTrigger: DetailType.OFFBOARDING_REQUEST,
        functionDefinition: props.billing.deleteCustomerFunction,
      },
      {
        defaultFunctionTrigger: DetailType.TENANT_USER_CREATED,
        functionDefinition: props.billing.createUserFunction,
      },
      {
        defaultFunctionTrigger: DetailType.TENANT_USER_DELETED,
        functionDefinition: props.billing.deleteUserFunction,
      },
    ].forEach((target) => {
      if (target.functionDefinition?.handler) {
        props.eventManager.addTargetToEvent(this, {
          eventType: target.functionDefinition?.trigger || target.defaultFunctionTrigger,
          target: new targets.LambdaFunction(target.functionDefinition?.handler),
        });
      }
    });

    if (props.billing.putUsageFunction) {
      new events.Rule(this, 'BillingPutUsageRule', {
        schedule:
          props.billing.putUsageFunction.schedule || events.Schedule.rate(cdk.Duration.hours(24)),
        targets: [new targets.LambdaFunction(props.billing.putUsageFunction.handler)],
      });
    }

    if (props.billing.ingestor) {
      new cdk.CfnOutput(this, 'DataIngestorName', {
        value: props.billing.ingestor.dataIngestorName,
        key: 'dataIngestorName',
      });
    }

    if (props.billing.webhookFunction) {
      this.controlPlaneAPIBillingWebhookResourcePath = `/billing/${props.billing.webhookFunction.path}`;

      const [controlPlaneAPIBillingWebhookResourceRoute] = props.controlPlaneAPI.addRoutes({
        path: this.controlPlaneAPIBillingWebhookResourcePath,
        methods: [apigatewayV2.HttpMethod.POST],
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'billingWebhookHttpLambdaIntegration',
          props.billing.webhookFunction.handler
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
}
