// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { TenantConfigLambdas } from './tenant-config-funcs';
import { IRoute, generateRoutes } from '../../utils';
import { TenantManagementTable } from '../tenant-management/tenant-management.table';

/**

Represents the properties required for the Tenant Config Service.

@interface TenantConfigServiceProps

@property {apigatewayV2.HttpApi} api - The HTTP API used by the Tenant Config Service.

@property {TenantManagementTable} tenantManagementTable - The table used for Tenant Management. */
export interface TenantConfigServiceProps {
  readonly api: apigatewayV2.HttpApi;
  readonly tenantManagementTable: TenantManagementTable;
}

/**

Represents the Tenant Config Service construct.

@class TenantConfigService

@extends {Construct}

@param {Construct} scope - The scope in which this construct is defined.

@param {string} id - The construct's identifier.

@param {TenantConfigServiceProps} props - The properties required for the Tenant Config Service.

*/
export class TenantConfigService extends Construct {
  constructor(scope: Construct, id: string, props: TenantConfigServiceProps) {
    super(scope, id);

    const tenantConfigPath = '/tenant-config';
    const tenantConfigNameResourcePath = `${tenantConfigPath}/{tenantName}`;
    const tenantConfigLambda = new TenantConfigLambdas(this, 'tenantConfigLambda', {
      tenantConfigIndexName: props.tenantManagementTable.tenantConfigIndexName,
      tenantDetails: props.tenantManagementTable.tenantDetails,
      tenantDetailsTenantConfigColumn: props.tenantManagementTable.tenantConfigColumn,
      tenantDetailsTenantNameColumn: props.tenantManagementTable.tenantNameColumn,
    });
    const tenantConfigServiceHttpLambdaIntegration = new HttpLambdaIntegration(
      'tenantConfigServiceHttpLambdaIntegration',
      tenantConfigLambda.tenantConfigFunction
    );
    const routes: IRoute[] = [
      {
        path: tenantConfigPath,
        integration: tenantConfigServiceHttpLambdaIntegration,
        method: apigatewayV2.HttpMethod.GET,
      },
      {
        path: tenantConfigNameResourcePath,
        integration: tenantConfigServiceHttpLambdaIntegration,
        method: apigatewayV2.HttpMethod.GET,
      },
    ];
    const tenantConfigRoutes = generateRoutes(props.api, routes);
    const paths = tenantConfigRoutes.map((r) => r.node.path);
    NagSuppressions.addResourceSuppressionsByPath(cdk.Stack.of(this), paths, [
      {
        id: 'AwsSolutions-APIG4',
        reason: 'The /tenant-config endpoint is a publicly available endpoint.',
      },
    ]);
  }
}
