// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
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
      functionDefinition?: IFunction | utils.IFunctionTrigger;
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
      utils.createEventTarget(
        this,
        props.eventManager,
        target.defaultFunctionTrigger,
        target.functionDefinition
      );
    });

    const routes: utils.IRoute[] = [
      {
        path: `${usagePath}/meterId`,
        method: apigatewayV2.HttpMethod.GET,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'fetchUsageHttpLambdaIntegration',
          props.metering.fetchUsageFunction
        ),
        scope: props.metering.fetchUsageScope,
      },
      {
        path: metersPath,
        method: apigatewayV2.HttpMethod.POST,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'createMeterHttpLambdaIntegration',
          props.metering.createMeterFunction
        ),
        scope: props.metering.createMeterScope,
      },
    ];

    if (props.metering.cancelUsageEventsFunction) {
      routes.push({
        path: usagePath,
        method: apigatewayV2.HttpMethod.DELETE,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'deleteUsageHttpLambdaIntegration',
          props.metering.cancelUsageEventsFunction
        ),
        scope: props.metering.cancelUsageEventsScope,
      });
    }

    if (props.metering.updateMeterFunction) {
      routes.push({
        path: `${metersPath}/meterId`,
        method: apigatewayV2.HttpMethod.PUT,
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'updateMeterHttpLambdaIntegration',
          props.metering.updateMeterFunction
        ),
        scope: props.metering.updateMeterScope,
      });
    }

    utils.generateRoutes(props.api.api, routes, props.api.jwtAuthorizer);
  }
}
