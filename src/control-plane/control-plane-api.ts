// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { RuleTargetInput } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth';
import { Services } from './services';

export interface ControlPlaneAPIProps {
  readonly services: Services;
  readonly auth: IAuth;
  readonly tenantConfigServiceLambda: Function;
}

export class ControlPlaneAPI extends Construct {
  apiUrl: any;
  public readonly tenantUpdateServiceTarget: targets.ApiGateway;
  constructor(scope: Construct, id: string, props: ControlPlaneAPIProps) {
    super(scope, id);

    const controlPlaneAPILogGroup = new LogGroup(this, 'PrdLogs', {
      retention: RetentionDays.ONE_WEEK,
    });
    const controlPlaneAPI = new apigateway.RestApi(this, 'controlPlaneAPI', {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(controlPlaneAPILogGroup),
        methodOptions: {
          '/*/*': {
            dataTraceEnabled: true,
            loggingLevel: apigateway.MethodLoggingLevel.ERROR,
          },
        },
      },
    });
    controlPlaneAPI.addRequestValidator('request-validator', {
      requestValidatorName: 'control-plane-validator',
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    function generateAWSManagedRuleSet(managedGroupName: string, priority: number) {
      const vendorName = 'AWS';
      return {
        name: `${vendorName}-${managedGroupName}`,
        priority,
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            name: managedGroupName,
            vendorName: vendorName,
          },
        },
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          metricName: managedGroupName,
          sampledRequestsEnabled: true,
        },
      };
    }

    const cfnWAF = new wafv2.CfnWebACL(this, 'WAF', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'WAF-ControlPlane',
      },
      rules: [
        // generateAWSManagedRuleSet('AWSManagedRulesBotControlRuleSet', 0), // enable to block curl requests
        generateAWSManagedRuleSet('AWSManagedRulesKnownBadInputsRuleSet', 1),
        generateAWSManagedRuleSet('AWSManagedRulesCommonRuleSet', 2),
        generateAWSManagedRuleSet('AWSManagedRulesAnonymousIpList', 3),
        generateAWSManagedRuleSet('AWSManagedRulesAmazonIpReputationList', 4),
        generateAWSManagedRuleSet('AWSManagedRulesAdminProtectionRuleSet', 5),
        generateAWSManagedRuleSet('AWSManagedRulesSQLiRuleSet', 6),
      ],
    });

    new wafv2.CfnWebACLAssociation(this, 'WAFAssociation', {
      webAclArn: cfnWAF.attrArn,
      resourceArn: controlPlaneAPI.deploymentStage.stageArn,
    });

    this.apiUrl = controlPlaneAPI.url;

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      `${controlPlaneAPI.root}/OPTIONS/Resource`,
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for OPTION method.',
        },
        {
          id: 'AwsSolutions-COG4',
          reason: 'Cognito Authorization not needed for OPTION method.',
        },
      ]
    );

    const tenants = controlPlaneAPI.root.addResource('tenants');
    tenants.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );
    tenants.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    const tenantIdResource = tenants.addResource('{tenantId}');
    tenantIdResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );
    tenantIdResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );
    const tenantUpdateServiceEndpoint = tenantIdResource.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.IAM,
      }
    );
    this.tenantUpdateServiceTarget = new targets.ApiGateway(controlPlaneAPI, {
      path: tenantIdResource.path.replace('{tenantId}', '*'),
      method: tenantUpdateServiceEndpoint.httpMethod,
      stage: controlPlaneAPI.deploymentStage.stageName,
      pathParameterValues: ['$.detail.tenantId'],
      postBody: RuleTargetInput.fromEventPath('$.detail.tenantOutput'),
    });

    NagSuppressions.addResourceSuppressions(
      [this],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Role used to simplify pushing logs to CloudWatch.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to the APIGW role created by cdk
    );

    const deactivateTenantResource = tenantIdResource.addResource('deactivate');
    deactivateTenantResource.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    const activateTenantResource = tenantIdResource.addResource('activate');
    activateTenantResource.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(props.services.tenantManagementServices),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${tenants}/OPTIONS/Resource`,
        `${tenants}/GET/Resource`,
        `${tenants}/POST/Resource`,
        `${tenantIdResource}/OPTIONS/Resource`,
        `${tenantIdResource}/DELETE/Resource`,
        `${tenantIdResource}/GET/Resource`,
        `${tenantIdResource}/PUT/Resource`,
        `${deactivateTenantResource}/OPTIONS/Resource`,
        `${deactivateTenantResource}/PUT/Resource`,
        `${activateTenantResource}/OPTIONS/Resource`,
        `${activateTenantResource}/PUT/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-COG4',
          reason:
            'Where required, the Control Plane API uses a custom authorizer. It does not use a cognito authorizer.',
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${tenants}/OPTIONS/Resource`,
        `${tenantIdResource}/OPTIONS/Resource`,
        `${deactivateTenantResource}/OPTIONS/Resource`,
        `${activateTenantResource}/OPTIONS/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for OPTION method.',
        },
      ]
    );

    const users = controlPlaneAPI.root.addResource('users');
    users.addMethod('POST', new apigateway.LambdaIntegration(props.auth.createUserFunction), {
      authorizationType: apigateway.AuthorizationType.CUSTOM,
      authorizer: props.auth.authorizer,
    });
    users.addMethod('GET', new apigateway.LambdaIntegration(props.auth.fetchAllUsersFunction), {
      authorizationType: apigateway.AuthorizationType.CUSTOM,
      authorizer: props.auth.authorizer,
    });

    const userNameResource = users.addResource('{username}');
    userNameResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.auth.fetchUserFunction),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );
    userNameResource.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(props.auth.updateUserFunction),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );
    userNameResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(props.auth.deleteUserFunction),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    const disableUserResource = userNameResource.addResource('disable');
    disableUserResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(props.auth.disableUserFunction),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    const enableUserResource = userNameResource.addResource('enable');
    enableUserResource.addMethod(
      'PUT',
      new apigateway.LambdaIntegration(props.auth.enableUserFunction),
      {
        authorizationType: apigateway.AuthorizationType.CUSTOM,
        authorizer: props.auth.authorizer,
      }
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${users}/OPTIONS/Resource`,
        `${users}/GET/Resource`,
        `${users}/POST/Resource`,
        `${userNameResource}/OPTIONS/Resource`,
        `${userNameResource}/DELETE/Resource`,
        `${userNameResource}/GET/Resource`,
        `${userNameResource}/PUT/Resource`,
        `${disableUserResource}/OPTIONS/Resource`,
        `${disableUserResource}/DELETE/Resource`,
        `${enableUserResource}/OPTIONS/Resource`,
        `${enableUserResource}/PUT/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-COG4',
          reason:
            'Where required, the Control Plane API uses a custom authorizer. It does not use a cognito authorizer.',
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${users}/OPTIONS/Resource`,
        `${userNameResource}/OPTIONS/Resource`,
        `${disableUserResource}/OPTIONS/Resource`,
        `${enableUserResource}/OPTIONS/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for OPTION method.',
        },
      ]
    );

    const tenantConfig = controlPlaneAPI.root.addResource('tenant-config');
    tenantConfig.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.tenantConfigServiceLambda)
    );

    const tenantConfigNameResource = tenantConfig.addResource('{tenantName}');
    tenantConfigNameResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.tenantConfigServiceLambda)
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${tenantConfig}/OPTIONS/Resource`,
        `${tenantConfig}/GET/Resource`,
        `${tenantConfigNameResource}/OPTIONS/Resource`,
        `${tenantConfigNameResource}/GET/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-COG4',
          reason: 'The /tenant-config endpoint is a publicly available endpoint.',
        },
        {
          id: 'AwsSolutions-APIG4',
          reason: 'The /tenant-config endpoint is a publicly available endpoint.',
        },
      ]
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [`${tenantConfig}/OPTIONS/Resource`, `${tenantConfigNameResource}/OPTIONS/Resource`],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for OPTION method.',
        },
      ]
    );
  }
}
