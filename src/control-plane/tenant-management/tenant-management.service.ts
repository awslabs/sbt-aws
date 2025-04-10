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

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpIamAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Construct } from 'constructs';
import { TenantManagementLambda } from './tenant-management-funcs';
import { TenantManagementTable } from './tenant-management.table';
import { IEventManager, IRoute, generateRoutes } from '../../utils';
import { IAuth } from '../auth/auth-interface';

/**
 * Represents the properties required to initialize the TenantManagementService.
 *
 * @interface TenantManagementServiceProps
 * @property {apigatewayV2.HttpApi} api - The HTTP API Gateway instance.
 * @property {IAuth} auth - The authentication mechanism for the service.
 * @property {apigatewayV2.IHttpRouteAuthorizer} authorizer - The HTTP route authorizer for the service.
 * @property {IEventManager} eventManager - The event manager for handling tenant-related events.
 */
export interface TenantManagementServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly auth: IAuth;
  readonly authorizer: apigatewayV2.IHttpRouteAuthorizer;
  readonly eventManager: IEventManager;
}

/**
 * Represents a service for managing tenants in the application.
 *
 * @class TenantManagementService
 * @extends Construct
 */
export class TenantManagementService extends Construct {
  /**
   * The tenant management table instance.
   *
   * @type {TenantManagementTable}
   */
  table: TenantManagementTable;

  /**
   * The path for the tenant registration endpoint.
   *
   * @type {string}
   */
  public readonly tenantsPath: string = '/tenants';

  /**
   * The path for the tenant registration endpoint with the tenant registration id.
   *
   * @type {string}
   */
  public readonly tenantIdPath: string;

  /**
   * Constructs a new instance of the TenantManagementService.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   * @param {TenantManagementServiceProps} props - The properties required to initialize the service.
   */
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
    this.tenantIdPath = `${this.tenantsPath}/{${table.tenantIdColumn}}`;

    const routes: IRoute[] = [
      {
        method: apigatewayV2.HttpMethod.GET,
        path: this.tenantsPath,
        authorizer: props.authorizer,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.POST,
        path: this.tenantsPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.DELETE,
        path: this.tenantIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.GET,
        path: this.tenantIdPath,
        authorizer: props.authorizer,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.PUT,
        path: this.tenantIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
    ];
    generateRoutes(props.api, routes, new HttpIamAuthorizer());

    this.table = table;
  }
}
