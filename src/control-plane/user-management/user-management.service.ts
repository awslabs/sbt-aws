// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { IAuth } from '..';
import { IRoute, generateRoutes } from '../../utils';

export interface UserManagementServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly auth: IAuth;
  readonly jwtAuthorizer: apigatewayV2.IHttpRouteAuthorizer;
}

export class UserManagementService extends Construct {
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
