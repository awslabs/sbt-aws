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

import * as cdk from 'aws-cdk-lib';
import { CorsPreflightOptions } from 'aws-cdk-lib/aws-apigatewayv2';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth/auth-interface';
import { CognitoAuth } from './auth/cognito-auth';
import { BillingProvider, IBilling } from './billing';
import { ControlPlaneAPI } from './control-plane-api';
import { IMetering } from './metering';
import { MeteringProvider } from './metering/metering-provider';
import { TenantConfigService } from './tenant-config';
import { TenantManagementService } from './tenant-management/tenant-management.service';
import { TenantRegistrationService } from './tenant-registration';
import { UserManagementService } from './user-management/user-management.service';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { addTemplateTag, EventManager, IEventManager } from '../utils';

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
   * The metering provider configuration.
   */
  readonly metering?: IMetering;

  /**
   * The event manager instance. If not provided, a new instance will be created.
   */
  readonly eventManager?: IEventManager;

  /**
   * If true, the API Gateway will not log requests to the CloudWatch Logs.
   * @default false
   */
  readonly disableAPILogging?: boolean;

  /**
   * Settings for Cors Configuration for the ControlPlane API.
   */
  readonly apiCorsConfig?: CorsPreflightOptions;
}

export class ControlPlane extends Construct {
  /**
   * The URL of the control plane API Gateway.
   */
  readonly controlPlaneAPIGatewayUrl: string;

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
      apiCorsConfig: props.apiCorsConfig,
    });

    const eventManager = props.eventManager ?? new EventManager(this, 'EventManager');
    const tenantManagementService = new TenantManagementService(this, 'tenantManagementService', {
      api: api.api,
      auth,
      authorizer: api.jwtAuthorizer,
      eventManager,
    });

    new TenantRegistrationService(this, 'tenantRegistrationService', {
      api: api.api,
      auth,
      authorizer: api.jwtAuthorizer,
      eventManager,
      tenantManagementService,
    });

    new TenantConfigService(this, 'tenantConfigService', {
      api: api.api,
      tenantManagementTable: tenantManagementService.table,
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

    if (props.metering) {
      new MeteringProvider(this, 'Metering', {
        metering: props.metering,
        api: api,
        eventManager: eventManager,
      });
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
