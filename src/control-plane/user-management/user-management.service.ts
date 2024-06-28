import { Construct } from 'constructs';
import { IAuth } from '..';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { Route, generateRoutes } from '../../utils';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export interface UserManagementServiceProps {
  api: apigatewayV2.HttpApi;
  auth: IAuth;
  jwtAuthorizer: apigatewayV2.IHttpRouteAuthorizer;
}

export class UserManagementService extends Construct {
  constructor(scope: Construct, id: string, props: UserManagementServiceProps) {
    super(scope, id);

    const usersPath = '/users';
    const userIdPath = `${usersPath}/{userId}`;
    const routes: Route[] = [
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
        method: apigatewayV2.HttpMethod.POST,
        scope: props.auth.fetchUserScope,
        path: userIdPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.fetchUserFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.POST,
        scope: props.auth.updateUserScope,
        path: userIdPath,
        integration: new HttpLambdaIntegration(
          'tenantsHttpLambdaIntegration',
          props.auth.updateUserFunction
        ),
      },
      {
        method: apigatewayV2.HttpMethod.POST,
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
