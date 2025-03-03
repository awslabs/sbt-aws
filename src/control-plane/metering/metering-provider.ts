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

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { IMetering } from './metering-interface';
import * as utils from '../../utils';
import { ControlPlaneAPI } from '../control-plane-api';

/**
 * Encapsulates the list of properties for a MeteringProvider.
 */
export interface MeteringProviderProps {
  /**
   * An implementation of the IMetering interface.
   */
  readonly metering: IMetering;

  /**
   * An IEventManager object to help coordinate events.
   */
  readonly eventManager: utils.IEventManager;

  /**
   * An API resource to use when setting up API endpoints.
   */
  readonly api: ControlPlaneAPI;
}

/**
 * Represents a Metering Provider that handles metering-related operations and
 * connects the concrete IMetering implementation (provided via props.metering)
 * to the control plane.
 *
 * This construct sets up event targets for various metering-related events
 * and adds API routes for 'usage' and 'meters'.
 */
export class MeteringProvider extends Construct {
  constructor(scope: Construct, id: string, props: MeteringProviderProps) {
    super(scope, id);
    utils.addTemplateTag(this, 'MeteringProvider');

    const usagePath = '/usage';
    const metersPath = '/meters';
    const functionTriggerMappings: {
      defaultFunctionTrigger: utils.DetailType;
      functionDefinition?: utils.IASyncFunction;
    }[] = [
      {
        defaultFunctionTrigger: utils.DetailType.ONBOARDING_REQUEST,
        functionDefinition: props.metering.createCustomerFunction,
      },
      {
        defaultFunctionTrigger: utils.DetailType.OFFBOARDING_REQUEST,
        functionDefinition: props.metering.deleteCustomerFunction,
      },
      {
        defaultFunctionTrigger: utils.DetailType.INGEST_USAGE,
        functionDefinition: props.metering.ingestUsageEventFunction,
      },
    ];

    functionTriggerMappings.forEach((target) => {
      if (target.functionDefinition?.handler) {
        props.eventManager.addTargetToEvent(this, {
          eventType: target.functionDefinition?.trigger || target.defaultFunctionTrigger,
          target: new targets.LambdaFunction(target.functionDefinition?.handler),
        });
      }
    });

    const routes: utils.IRoute[] = [
      {
        path: `${usagePath}/{meterId}`,
        method: apigatewayV2.HttpMethod.GET,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'fetchUsageHttpLambdaIntegration',
          props.metering.fetchUsageFunction.handler
        ),
        scope: props.metering.fetchUsageFunction.scope,
      },
      {
        path: `${metersPath}/{meterId}`,
        method: apigatewayV2.HttpMethod.GET,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'fetchMeterHttpLambdaIntegration',
          props.metering.fetchMeterFunction.handler
        ),
        scope: props.metering.fetchMeterFunction.scope,
      },
      {
        path: metersPath,
        method: apigatewayV2.HttpMethod.GET,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'fetchAllMetersHttpLambdaIntegration',
          props.metering.fetchAllMetersFunction.handler
        ),
        scope: props.metering.fetchAllMetersFunction.scope,
      },
      {
        path: metersPath,
        method: apigatewayV2.HttpMethod.POST,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'createMeterHttpLambdaIntegration',
          props.metering.createMeterFunction.handler
        ),
        scope: props.metering.createMeterFunction.scope,
      },
    ];

    if (props.metering.cancelUsageEventsFunction) {
      routes.push({
        path: usagePath,
        method: apigatewayV2.HttpMethod.DELETE,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'deleteUsageHttpLambdaIntegration',
          props.metering.cancelUsageEventsFunction.handler
        ),
        scope: props.metering.cancelUsageEventsFunction.scope,
      });
    }

    if (props.metering.updateMeterFunction) {
      routes.push({
        path: `${metersPath}/{meterId}`,
        method: apigatewayV2.HttpMethod.PUT,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'updateMeterHttpLambdaIntegration',
          props.metering.updateMeterFunction.handler
        ),
        scope: props.metering.updateMeterFunction.scope,
      });
    }

    if (props.metering.deleteMeterFunction) {
      routes.push({
        path: `${metersPath}/{meterId}`,
        method: apigatewayV2.HttpMethod.DELETE,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'deleteMeterHttpLambdaIntegration',
          props.metering.deleteMeterFunction.handler
        ),
        scope: props.metering.deleteMeterFunction.scope,
      });
    }

    utils.generateRoutes(props.api.api, routes, props.api.jwtAuthorizer);
  }
}
