// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { IAuth } from '..';
import { IRoute, generateRoutes } from '../../utils';

/**
 * Represents the properties required to initialize the UserManagementService.
 *
 * @interface UserManagementServiceProps
 * @property {apigatewayV2.HttpApi} api - The HTTP API Gateway instance.
 * @property {IAuth} auth - The authentication mechanism for the service.
 * @property {apigatewayV2.IHttpRouteAuthorizer} jwtAuthorizer - The JWT authorizer for the service.
 */
export interface UserManagementServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly auth: IAuth;
  readonly jwtAuthorizer: apigatewayV2.IHttpRouteAuthorizer;
}

/**
 * Represents a service for managing users in the application.
 *
 * @class UserManagementService
 * @extends Construct
 */
export class UserManagementService extends Construct {
  /**
   * Constructs a new instance of the UserManagementService.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   * @param {UserManagementServiceProps} props - The properties required to initialize the service.
   */
  constructor(scope: Construct, id: string, props: UserManagementServiceProps) {
    super(scope, id);

    const usersPath = '/users';
    const userIdPath = `${usersPath}/{userId}`;
    const routes: IRoute[] = [
      {
        method: apigatewayV2.HttpMethod.POST,
        scope: props.auth.createUserScope,
        path: usersPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.createUserFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchAllUsersScope,
        path: usersPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.fetchAllUsersFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchUserScope,
        path: userIdPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.fetchUserFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.PUT,
        scope: props.auth.updateUserScope,
        path: userIdPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.updateUserFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.DELETE,
        scope: props.auth.deleteUserScope,
        path: userIdPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.deleteUserFunction
        ),
      },
    ];

    generateRoutes(props.api, routes, props.jwtAuthorizer);
  }
}
