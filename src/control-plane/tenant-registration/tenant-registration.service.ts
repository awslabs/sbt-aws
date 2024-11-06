// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as events from 'aws-cdk-lib/aws-events';
import { ApiDestination } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { TenantRegistrationLambda } from './tenant-registration-funcs';
import { TenantRegistrationTable } from './tenant-registration.table';
import { DetailType, IEventManager, IRoute, generateRoutes } from '../../utils';
import { IAuth } from '../auth/auth-interface';
import { TenantManagementService } from '../tenant-management';

/**
 * Represents the properties required to initialize the TenantRegistrationService.
 *
 * @interface TenantRegistrationServiceProps
 * @property {apigatewayV2.HttpApi} api - The HTTP API Gateway instance.
 * @property {IAuth} auth - The authentication mechanism for the service.
 * @property {apigatewayV2.IHttpRouteAuthorizer} authorizer - The HTTP route authorizer for the service.
 * @property {IEventManager} eventManager - The event manager for handling tenant-related events.
 */
export interface TenantRegistrationServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly auth: IAuth;
  readonly authorizer: apigatewayV2.IHttpRouteAuthorizer;
  readonly eventManager: IEventManager;
  readonly tenantManagementService: TenantManagementService;
}

/**
 * Represents a service for managing tenants in the application.
 *
 * @class TenantRegistrationService
 * @extends Construct
 */
export class TenantRegistrationService extends Construct {
  /**
   * The tenant registration table instance.
   *
   * @type {TenantRegistrationTable}
   */
  table: TenantRegistrationTable;

  /**
   * The path for the tenant registration endpoint.
   *
   * @type {string}
   */
  public readonly tenantRegistrationsPath: string = '/tenant-registrations';

  /**
   * The path for the tenant registration endpoint with the tenant registration id.
   *
   * @type {string}
   */
  public readonly tenantRegistrationsIdPath: string;

  /**
   * Constructs a new instance of the TenantRegistrationService.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   * @param {TenantRegistrationServiceProps} props - The properties required to initialize the service.
   */
  constructor(scope: Construct, id: string, props: TenantRegistrationServiceProps) {
    super(scope, id);

    const table = new TenantRegistrationTable(this, 'tenantRegistrationTable');
    const lambda = new TenantRegistrationLambda(this, 'tenantRegistrationLambda', {
      eventManager: props.eventManager,
      table,
      api: props.api,
      tenantsPath: props.tenantManagementService.tenantsPath,
      tenantIdPath: props.tenantManagementService.tenantIdPath,
    });
    this.tenantRegistrationsIdPath = `${this.tenantRegistrationsPath}/{${table.tenantRegistrationIdColumn}}`;

    const tenantsHttpLambdaIntegration = new HttpLambdaIntegration(
      'tenantsHttpLambdaIntegration',
      lambda.tenantRegistrationFunc
    );

    const routes: IRoute[] = [
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchAllTenantRegistrationsScope,
        path: this.tenantRegistrationsPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.POST,
        scope: props.auth.createTenantRegistrationScope,
        path: this.tenantRegistrationsPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.DELETE,
        scope: props.auth.deleteTenantRegistrationScope,
        path: this.tenantRegistrationsIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.GET,
        scope: props.auth.fetchTenantRegistrationScope,
        path: this.tenantRegistrationsIdPath,
        integration: tenantsHttpLambdaIntegration,
      },
      {
        method: apigatewayV2.HttpMethod.PATCH,
        scope: props.auth.updateTenantRegistrationScope,
        path: this.tenantRegistrationsIdPath,
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
          ...(props.auth.updateTenantRegistrationScope && {
            scope: events.HttpParameter.fromString(props.auth.updateTenantRegistrationScope),
          }),
          ...(props.auth.machineClientAudience && {
            audience: events.HttpParameter.fromString(props.auth.machineClientAudience),
          }),
        },
      }),
    });

    const putTenantRegistrationAPIDestination = new events.ApiDestination(this, 'destination', {
      connection: connection,
      httpMethod: events.HttpMethod.PATCH,
      endpoint: `${props.api.url}${this.tenantRegistrationsPath.substring(1)}/*`, // skip the first '/' in tenantIdPath
    });

    const tenantRegistrationUpdateServiceTarget = new ApiDestination(
      putTenantRegistrationAPIDestination,
      {
        pathParameterValues: ['$.detail.tenantRegistrationId'],
        event: events.RuleTargetInput.fromEventPath('$.detail.jobOutput'),
      }
    );

    [
      DetailType.PROVISION_SUCCESS,
      DetailType.PROVISION_FAILURE,
      DetailType.DEPROVISION_SUCCESS,
      DetailType.DEPROVISION_FAILURE,
    ].forEach((detailType) => {
      props.eventManager.addTargetToEvent(this, {
        eventType: detailType,
        target: tenantRegistrationUpdateServiceTarget,
      });
    });

    this.table = table;
  }
}
