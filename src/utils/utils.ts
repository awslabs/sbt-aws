// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Stack } from 'aws-cdk-lib';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DetailType, IEventManager } from './event-manager';

export const addTemplateTag = (construct: Construct, tag: string) => {
  const stackDesc = Stack.of(construct).templateOptions.description;
  const baseTelemetry = 'sbt-aws (uksb-1tupboc57)';
  let description = stackDesc;
  // There is no description, just make it telemetry + tags
  if (stackDesc === undefined) {
    description = appendTagToDescription(baseTelemetry, tag);
  }
  // There is a description, and it doesn't contain telemetry. We need to append telemetry + tags to it
  else if (!stackDesc.includes(baseTelemetry)) {
    description = appendTagToDescription(`${stackDesc} - ${baseTelemetry}`, tag);
  }
  // There is a telemetry description already
  else {
    description = appendTagToDescription(stackDesc, tag);
  }
  Stack.of(construct).templateOptions.description = description;
};

const appendTagToDescription = (existingDescription: string, newTag: string): string => {
  // Check if the existing description already has tags
  if (existingDescription.includes('(tag:')) {
    // Extract the existing tags
    const startIndex = existingDescription.indexOf('(tag:') + 6;
    const endIndex = existingDescription.lastIndexOf(')');
    const existingTags = existingDescription.substring(startIndex, endIndex).split(', ');

    // Check if the new tag already exists
    if (!existingTags.includes(newTag)) {
      // Append the new tag to the existing tags
      existingTags.push(newTag);
      const newDescription = `${existingDescription.substring(0, startIndex)}${existingTags.join(', ')})`;
      return newDescription;
    } else {
      // The new tag already exists, return the original description
      return existingDescription;
    }
  } else {
    // Append the new tag to the description
    return `${existingDescription} (tag: ${newTag})`;
  }
};

export const generateAWSManagedRuleSet = (managedGroupName: string, priority: number) => {
  const vendorName = 'AWS';
  return {
    name: `${vendorName}-${managedGroupName}`,
    priority,
    overrideAction: { none: {} },
    statement: {
      managedRuleGroupStatement: {
        name: managedGroupName,
        vendorName: vendorName,
      },
    },
    visibilityConfig: {
      cloudWatchMetricsEnabled: true,
      metricName: managedGroupName,
      sampledRequestsEnabled: true,
    },
  };
};

export const conditionallyAddScope = (unknownScope?: string) => {
  if (unknownScope) {
    return [unknownScope];
  }
  return [];
};

export interface IRoute {
  readonly method: apigatewayV2.HttpMethod;
  readonly scope?: string;
  readonly path: string;
  readonly integration: apigatewayV2.HttpRouteIntegration;
}
export const generateRoutes = (
  api: apigatewayV2.HttpApi,
  routes: IRoute[],
  authorizer?: apigatewayV2.IHttpRouteAuthorizer
) => {
  let allRoutes: apigatewayV2.HttpRoute[] = [];
  routes.forEach((route) => {
    allRoutes = [
      ...api.addRoutes({
        path: route.path,
        methods: [route.method],
        integration: route.integration,
        authorizer: authorizer,
        authorizationScopes: conditionallyAddScope(route.scope),
      }),
      ...allRoutes,
    ];
  });
  return allRoutes;
};

/**
 * Optional interface that allows specifying both
 * the function to trigger and the event that will trigger it.
 */
export interface IFunctionTrigger {
  /**
   * The function definition.
   */
  readonly handler: IFunction;

  /**
   * The detail-type that will trigger the handler function.
   */
  readonly trigger: DetailType;
}

/**
 * Helper function for attaching functions to events.
 * If an IFunction is passed in as the argument for functionOrFunctionTrigger, then
 * the defaultEvent is used as the trigger for the IFunction.
 *
 * If an IFunctionTrigger is passed in as the argument for functionOrFunctionTrigger, then
 * the trigger property of the IFunctionTrigger is used as the trigger for the IFunction.
 *
 * If the functionOrFunctionTrigger is not passed in, no event is created.
 */
export const createEventTarget = (
  scope: Construct,
  eventManager: IEventManager,
  defaultEvent: DetailType,
  functionOrFunctionTrigger?: IFunction | IFunctionTrigger
) => {
  if (!functionOrFunctionTrigger) {
    return;
  }

  let handler: IFunction, trigger: DetailType;
  if ('handler' in functionOrFunctionTrigger) {
    handler = functionOrFunctionTrigger.handler;
    trigger = functionOrFunctionTrigger.trigger;
  } else {
    handler = functionOrFunctionTrigger;
    trigger = defaultEvent;
  }

  eventManager.addTargetToEvent(scope, trigger, new targets.LambdaFunction(handler));
};
