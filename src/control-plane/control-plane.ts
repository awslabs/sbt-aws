// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth/auth-interface';
import { CognitoAuth } from './auth/cognito-auth';
import { BillingProvider, IBilling } from './billing';
import { ControlPlaneAPI } from './control-plane-api';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { addTemplateTag, EventManager, IEventManager } from '../utils';
import { TenantConfigService } from './tenant-config/tenant-config.service';
import { TenantManagementService } from './tenant-management/tenant-management.service';
import { UserManagementService } from './user-management/user-management.service';

export interface ControlPlaneProps {
  /**
   * The authentication provider for the control plane.
   * If not provided, CognitoAuth will be used.
   */
  readonly auth?: IAuth;

  /**
   * The name of the system admin user.
   * @default 'admin'
   */
  readonly systemAdminName?: string;

  /**
   * The email address of the system admin.
   */
  readonly systemAdminEmail: string;

  /**
   * The name of the system admin role.
   * @default 'SystemAdmin'
   */
  readonly systemAdminRoleName?: string;

  /**
   * The billing provider configuration.
   */
  readonly billing?: IBilling;

  /**
   * The event manager instance. If not provided, a new instance will be created.
   */
  readonly eventManager?: IEventManager;

  /**
   * If true, the API Gateway will not log requests to the CloudWatch Logs.
   * @default false
   */
  readonly disableAPILogging?: boolean;
}

export class ControlPlane extends Construct {
  /**
   * The URL of the control plane API Gateway.
   */
  readonly controlPlaneAPIGatewayUrl: string;

  // /**
  //  * The Tables instance containing the DynamoDB tables for tenant data and configurations.
  //  */
  // readonly tables: Tables;

  /**
   * The EventManager instance that allows connecting to events flowing between
   * the Control Plane and other components.
   */
  readonly eventManager: IEventManager;

  constructor(scope: Construct, id: string, props: ControlPlaneProps) {
    super(scope, id);
    addTemplateTag(this, 'ControlPlane');

    const systemAdminName = props.systemAdminName || 'admin';
    const systemAdminRoleName = props.systemAdminRoleName || 'SystemAdmin';

    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    const auth = props.auth || new CognitoAuth(this, 'CognitoAuth');

    auth.createAdminUser(this, 'adminUser', {
      name: systemAdminName,
      email: props.systemAdminEmail,
      role: systemAdminRoleName,
    });

    const api = new ControlPlaneAPI(this, 'controlPlaneApi', {
      auth,
      disableAPILogging: props.disableAPILogging,
    });

    const eventManager = props.eventManager ?? new EventManager(this, 'EventManager');
    const tenantManagementServices = new TenantManagementService(
      this,
      'tenantManagementServicves',
      {
        api: api.api,
        auth,
        authorizer: api.jwtAuthorizer,
        eventManager,
      }
    );

    new TenantConfigService(this, 'tenantConfigService', {
      api: api.api,
      tenantManagementTable: tenantManagementServices.table,
    });

    new UserManagementService(this, 'userManagementService', {
      api: api.api,
      auth,
      jwtAuthorizer: api.jwtAuthorizer,
    });

    this.controlPlaneAPIGatewayUrl = api.apiUrl;

    new cdk.CfnOutput(this, 'eventBridgeArn', {
      value: eventManager.busArn,
      key: 'eventBridgeArn',
    });

    if (props.billing) {
      const billingTemplate = new BillingProvider(this, 'Billing', {
        billing: props.billing,
        eventManager: eventManager,
        controlPlaneAPI: api.api,
      });

      if (billingTemplate.controlPlaneAPIBillingWebhookResourcePath) {
        new cdk.CfnOutput(this, 'billingWebhookURL', {
          value: `${api.apiUrl}${billingTemplate.controlPlaneAPIBillingWebhookResourcePath}`,
          key: 'billingWebhookURL',
        });
      }
    }
    this.eventManager = eventManager;

    // defined suppression here to suppress EventsRole Default policy
    // which gets updated in EventManager construct, but is part of ControlPlane API
    NagSuppressions.addResourceSuppressions(
      api,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Wildcard required in order pass tenantId in path.',
          appliesTo: [
            'Resource::arn:<AWS::Partition>:execute-api:<AWS::Region>:<AWS::AccountId>:<ControlPlanecontrolplaneapistackcontrolPlaneAPI2616E18C>/<ControlPlanecontrolplaneapistackcontrolPlaneAPIDeploymentStageprodA7CA1040>/PUT/tenants/*',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to the APIGW role created by cdk in the controlPlaneAPI construct
    );
  }
}
