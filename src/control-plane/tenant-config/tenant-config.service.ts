import { Construct } from 'constructs';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as cdk from 'aws-cdk-lib';
import { Route, generateRoutes } from '../../utils';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { TenantConfigLambdas } from './tenant-config.lambda';
import { TenantManagementTable } from '../tenant-management/tenant-management.table';
import { NagSuppressions } from 'cdk-nag';

export interface TenantConfigServiceProps {
  api: apigatewayV2.HttpApi;
  tenantManagementTable: TenantManagementTable;
}
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
    const routes: Route[] = [
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
