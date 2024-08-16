// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { IMetering } from './metering-interface';
import * as utils from '../../utils';

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
   * An API Gateway Resource for the BillingProvider to use
   * when setting up API endpoints.
   */
  readonly controlPlaneAPI: apigatewayV2.HttpApi;
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

    props.controlPlaneAPI.addRoutes({
      path: `${usagePath}/meterId`,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'fetchUsageHttpLambdaIntegration',
        props.metering.fetchUsageFunction
      ),
    });

    if (props.metering.cancelUsageEventsFunction) {
      props.controlPlaneAPI.addRoutes({
        path: usagePath,
        methods: [apigatewayV2.HttpMethod.DELETE],
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'deleteUsageHttpLambdaIntegration',
          props.metering.cancelUsageEventsFunction
        ),
      });
    }

    props.controlPlaneAPI.addRoutes({
      path: metersPath,
      methods: [apigatewayV2.HttpMethod.POST],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'createMeterHttpLambdaIntegration',
        props.metering.createMeterFunction
      ),
    });

    if (props.metering.updateMeterFunction) {
      props.controlPlaneAPI.addRoutes({
        path: `${metersPath}/meterId`,
        methods: [apigatewayV2.HttpMethod.PUT],
        integration: new apigatewayV2Integrations.HttpLambdaIntegration(
          'updateMeterHttpLambdaIntegration',
          props.metering.updateMeterFunction
        ),
      });
    }
  }
}
