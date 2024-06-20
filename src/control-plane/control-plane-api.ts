// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as apigatewayV2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth/auth-interface';
import { Services } from './services';
import { addTemplateTag, conditionallyAddScope } from '../utils';

export interface ControlPlaneAPIProps {
  readonly services: Services;
  readonly auth: IAuth;
  readonly tenantConfigServiceLambda: Function;
  readonly disableAPILogging?: boolean;
}

export class ControlPlaneAPI extends Construct {
  apiUrl: any;
  public readonly api: apigatewayV2.HttpApi;
  public readonly tenantUpdateServiceTarget: events.IRuleTarget;
  constructor(scope: Construct, id: string, props: ControlPlaneAPIProps) {
    super(scope, id);
    addTemplateTag(this, 'ControlPlaneAPI');
    this.api = new apigatewayV2.HttpApi(this, 'controlPlaneAPI', {
      corsPreflight: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    if (props.disableAPILogging) {
      NagSuppressions.addResourceSuppressionsByPath(
        cdk.Stack.of(this),
        [this.api.defaultStage?.node.path!],
        [
          {
            id: 'AwsSolutions-APIG1',
            reason: 'Customer has explicitly opted out of logging',
          },
        ]
      );
    } else {
      const controlPlaneAPILogGroup = new LogGroup(this, 'controlPlaneAPILogGroup', {
        retention: RetentionDays.ONE_WEEK,
        logGroupName: `/aws/vendedlogs/api/${this.node.id}-${this.node.addr}`,
      });
      const accessLogSettings = {
        destinationArn: controlPlaneAPILogGroup.logGroupArn,
        format: JSON.stringify({
          requestId: '$context.requestId',
          ip: '$context.identity.sourceIp',
          requestTime: '$context.requestTime',
          httpMethod: '$context.httpMethod',
          routeKey: '$context.routeKey',
          status: '$context.status',
          protocol: '$context.protocol',
          responseLength: '$context.responseLength',
        }),
      };

      const stage = this.api.defaultStage?.node.defaultChild as apigatewayV2.CfnStage;
      stage.accessLogSettings = accessLogSettings;
    }

    this.apiUrl = this.api.url;
    new cdk.CfnOutput(this, 'controlPlaneAPIEndpoint', {
      value: this.apiUrl,
      key: 'controlPlaneAPIEndpoint',
    });

    const jwtAuthorizer = new apigatewayV2Authorizers.HttpJwtAuthorizer(
      'tenantsAuthorizer',
      props.auth.jwtIssuer,
      {
        jwtAudience: props.auth.jwtAudience,
      }
    );

    const tenantsHttpLambdaIntegration = new apigatewayV2Integrations.HttpLambdaIntegration(
      'tenantsHttpLambdaIntegration',
      props.services.tenantManagementServices
    );
    const tenantsPath = '/tenants';
    this.api.addRoutes({
      path: tenantsPath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.fetchAllTenantsScope),
    });
    this.api.addRoutes({
      path: tenantsPath,
      methods: [apigatewayV2.HttpMethod.POST],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.createTenantScope),
    });

    const tenantIdPath = `${tenantsPath}/{tenantId}`;
    this.api.addRoutes({
      path: tenantIdPath,
      methods: [apigatewayV2.HttpMethod.DELETE],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.deleteTenantScope),
    });
    this.api.addRoutes({
      path: tenantIdPath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.fetchTenantScope),
    });

    this.api.addRoutes({
      path: tenantIdPath,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.updateTenantScope),
    });

    const connection = new events.Connection(this, 'connection', {
      authorization: events.Authorization.oauth({
        authorizationEndpoint: props.auth.tokenEndpoint,
        clientId: props.auth.machineClientId,
        clientSecret: props.auth.machineClientSecret,
        httpMethod: events.HttpMethod.POST,
        bodyParameters: {
          grant_type: events.HttpParameter.fromString('client_credentials'),
          ...(props.auth.updateTenantScope && {
            scope: events.HttpParameter.fromString(props.auth.updateTenantScope),
          }),
        },
      }),
    });

    const putTenantAPIDestination = new events.ApiDestination(this, 'destination', {
      connection: connection,
      httpMethod: events.HttpMethod.PUT,
      endpoint: `${this.api.url}${tenantsPath.substring(1)}/*`, // skip the first '/' in tenantIdPath
    });

    this.tenantUpdateServiceTarget = new targets.ApiDestination(putTenantAPIDestination, {
      pathParameterValues: ['$.detail.tenantId'],
      event: events.RuleTargetInput.fromEventPath('$.detail.tenantOutput'),
    });

    this.api.addRoutes({
      path: `${tenantIdPath}/deactivate`,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.deactivateTenantScope),
    });
    this.api.addRoutes({
      path: `${tenantIdPath}/activate`,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: tenantsHttpLambdaIntegration,
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.activateTenantScope),
    });

    const usersPath = '/users';
    this.api.addRoutes({
      path: usersPath,
      methods: [apigatewayV2.HttpMethod.POST],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.createUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.createUserScope),
    });
    this.api.addRoutes({
      path: usersPath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.fetchAllUsersFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.fetchAllUsersScope),
    });

    const userIdPath = `${usersPath}/{userId}`;
    this.api.addRoutes({
      path: userIdPath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.fetchUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.fetchUserScope),
    });
    this.api.addRoutes({
      path: userIdPath,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.updateUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.updateUserScope),
    });

    this.api.addRoutes({
      path: userIdPath,
      methods: [apigatewayV2.HttpMethod.DELETE],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.deleteUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.deleteUserScope),
    });

    this.api.addRoutes({
      path: `${tenantIdPath}/disable`,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.disableUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.disableUserScope),
    });
    this.api.addRoutes({
      path: `${tenantIdPath}/enable`,
      methods: [apigatewayV2.HttpMethod.PUT],
      integration: new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantsHttpLambdaIntegration',
        props.auth.enableUserFunction
      ),
      authorizer: jwtAuthorizer,
      authorizationScopes: conditionallyAddScope(props.auth.enableUserScope),
    });

    const tenantConfigPath = '/tenant-config';
    const tenantConfigServiceHttpLambdaIntegration =
      new apigatewayV2Integrations.HttpLambdaIntegration(
        'tenantConfigServiceHttpLambdaIntegration',
        props.tenantConfigServiceLambda
      );
    const [tenantConfigRoute] = this.api.addRoutes({
      path: tenantConfigPath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: tenantConfigServiceHttpLambdaIntegration,
    });

    const tenantConfigNameResourcePath = `${tenantConfigPath}/{tenantName}`;
    const [tenantConfigNameResourceRoute] = this.api.addRoutes({
      path: tenantConfigNameResourcePath,
      methods: [apigatewayV2.HttpMethod.GET],
      integration: tenantConfigServiceHttpLambdaIntegration,
    });

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [tenantConfigNameResourceRoute.node.path, tenantConfigRoute.node.path],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'The /tenant-config endpoint is a publicly available endpoint.',
        },
      ]
    );
  }
}
