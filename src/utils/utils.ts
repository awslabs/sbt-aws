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

import { Stack } from 'aws-cdk-lib';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { EventDefinition } from './event-manager';

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
  readonly authorizer?: apigatewayV2.IHttpRouteAuthorizer;
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
        authorizer: route.authorizer || authorizer,
        authorizationScopes: conditionallyAddScope(route.scope),
      }),
      ...allRoutes,
    ];
  });
  return allRoutes;
};

/**
 * Represents a function that is triggered synchronously via an API Gateway.
 */
export interface ISyncFunction {
  /**
   * The function definition.
   */
  readonly handler: IFunction;

  /**
   * The scope required to authorize access to this function.
   * This is set in the API Gateway.
   * If it is not provided, the API Gateway will not check for any scopes on the token.
   */
  readonly scope?: string;
}

/**
 * Represents a function that is triggered asynchronously via an event.
 */
export interface IASyncFunction {
  /**
   * The function definition.
   */
  readonly handler: IFunction;

  /**
   * The event definition that will trigger the handler function.
   */
  readonly trigger?: EventDefinition;
}
