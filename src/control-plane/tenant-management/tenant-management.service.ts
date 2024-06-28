import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { IEventManager, Route, generateRoutes } from '../../utils';
import { TenantManagementLambda } from './tenant-management.lambda';
import { TenantManagementTable } from './tenant-management.table';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IAuth } from '../auth/auth-interface';

export interface TenantManagementServiceProps {
  api: apigatewayV2.HttpApi;
  auth: IAuth;
  authorizer: apigatewayV2.IHttpRouteAuthorizer;
  eventManager: IEventManager;
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
      lambda.tenantManagementFunction
    );
    const tenantsPath = '/tenants';
    const tenantIdPath = `${tenantsPath}/{tenantId}`;

    const routes: Route[] = [
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
    this.table = table;
  }
}
