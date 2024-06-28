// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import { ApiDestination } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { TenantManagementLambda } from './tenant-management-funcs';
import { TenantManagementTable } from './tenant-management.table';
import { DetailType, IEventManager, IRoute, generateRoutes } from '../../utils';
import { IAuth } from '../auth/auth-interface';

export interface TenantManagementServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly auth: IAuth;
  readonly authorizer: apigatewayV2.IHttpRouteAuthorizer;
  readonly eventManager: IEventManager;
}

export class TenantManagementService extends Construct {
  table: TenantManagementTable;
  constructor(scope: Construct, id: string, props: TenantManagementServiceProps) {
    super(scope, id);

    const table = new TenantManagementTable(this, 'tenantManagementTable');
    const lambda = new TenantManagementLambda(this, 'tenantManagementLambda', {
      eventManager: props.eventManager,
      table,
    });

    const tenantsHttpLambdaIntegration = new HttpLambdaIntegration(
      'tenantsHttpLambdaIntegration',
      lambda.tenantManagementFunc
    );
    const tenantsPath = '/tenants';
    const tenantIdPath = `${tenantsPath}/{tenantId}`;

    const routes: IRoute[] = [
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchAllTenantsScope,
        path: tenantsPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.POST,
        scope: props.auth.createTenantScope,
        path: tenantsPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.DELETE,
        scope: props.auth.deleteTenantScope,
        path: tenantIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchTenantScope,
        path: tenantIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.PUT,
        scope: props.auth.updateTenantScope,
        path: tenantIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.PUT,
        scope: props.auth.deactivateTenantScope,
        path: `${tenantIdPath}/deactivate`,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.PUT,
        scope: props.auth.activateTenantScope,
        path: `${tenantIdPath}/activate`,
        integration: tenantsHttpLambdaIntegration,
      },
    ];
    generateRoutes(props.api, routes, props.authorizer);

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
      endpoint: `${props.api.url}${tenantsPath.substring(1)}/*`, // skip the first '/' in tenantIdPath
    });

    const tenantUpdateServiceTarget = new ApiDestination(putTenantAPIDestination, {
      pathParameterValues: ['$.detail.tenantId'],
      event: events.RuleTargetInput.fromEventPath('$.detail.tenantOutput'),
    });

    props.eventManager.addTargetToEvent(
      this,
      DetailType.PROVISION_SUCCESS,
      tenantUpdateServiceTarget
    );

    props.eventManager.addTargetToEvent(
      this,
      DetailType.DEPROVISION_SUCCESS,
      tenantUpdateServiceTarget
    );

    // new cdk.CfnOutput(this, 'controlPlaneAPIGatewayUrl', {
    //   value: controlPlaneAPI.apiUrl,
    //   key: 'controlPlaneAPIGatewayUrl',
    // });
    this.table = table;
  }
}
