// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth/auth-interface';
import { IBilling, BillingProvider } from './billing';
import { ControlPlaneAPI } from './control-plane-api';
import { Services } from './services';
import { Tables } from './tables';
import { TenantConfigService } from './tenant-config/tenant-config-service';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { setTemplateDesc, DetailType, EventManager, IEventManager } from '../utils';

export interface ControlPlaneProps {
  /**
   * The authentication provider for the control plane.
   */
  readonly auth: IAuth;

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

  /**
   * The Tables instance containing the DynamoDB tables for tenant data and configurations.
   */
  readonly tables: Tables;

  /**
   * The EventManager instance that allows connecting to events flowing between
   * the Control Plane and other components.
   */
  readonly eventManager: IEventManager;

  constructor(scope: Construct, id: string, props: ControlPlaneProps) {
    super(scope, id);
    setTemplateDesc(this, 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)');

    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    // todo: decompose 'Tables' into purpose-specific constructs (ex. TenantManagement)
    this.tables = new Tables(this, 'tables-stack');

    this.eventManager = props.eventManager ?? new EventManager(this, 'EventManager');

    // todo: decompose 'Services' into purpose-specific constructs (ex. TenantManagement)
    const services = new Services(this, 'services-stack', {
      tables: this.tables,
      eventManager: this.eventManager,
    });

    const tenantConfigService = new TenantConfigService(this, 'auth-info-service-stack', {
      tenantDetails: this.tables.tenantDetails,
      tenantDetailsTenantNameColumn: this.tables.tenantNameColumn,
      tenantConfigIndexName: this.tables.tenantConfigIndexName,
      tenantDetailsTenantConfigColumn: this.tables.tenantConfigColumn,
    });

    // todo: decompose 'ControlPlaneAPI' into purpose-specific constructs (ex. TenantManagement)
    const controlPlaneAPI = new ControlPlaneAPI(this, 'controlplane-api-stack', {
      auth: props.auth,
      disableAPILogging: props.disableAPILogging,
      services: services,
      tenantConfigServiceLambda: tenantConfigService.tenantConfigServiceLambda,
    });

    this.controlPlaneAPIGatewayUrl = controlPlaneAPI.apiUrl;

    this.eventManager.addTargetToEvent(
      DetailType.PROVISION_SUCCESS,
      controlPlaneAPI.tenantUpdateServiceTarget
    );

    this.eventManager.addTargetToEvent(
      DetailType.DEPROVISION_SUCCESS,
      controlPlaneAPI.tenantUpdateServiceTarget
    );

    new cdk.CfnOutput(this, 'controlPlaneAPIGatewayUrl', {
      value: controlPlaneAPI.apiUrl,
      key: 'controlPlaneAPIGatewayUrl',
    });

    new cdk.CfnOutput(this, 'eventBridgeArn', {
      value: this.eventManager.busArn,
      key: 'eventBridgeArn',
    });

    if (props.billing) {
      const billingTemplate = new BillingProvider(this, 'Billing', {
        billing: props.billing,
        eventManager: this.eventManager,
        controlPlaneAPIBillingResource: controlPlaneAPI.billingResource,
      });

      if (billingTemplate.controlPlaneAPIBillingWebhookResource) {
        new cdk.CfnOutput(this, 'billingWebhookURL', {
          value: `${
            controlPlaneAPI.apiUrl
          }${billingTemplate.controlPlaneAPIBillingWebhookResource.path.substring(1)}`,
          key: 'billingWebhookURL',
        });
      }
    }

    // defined suppression here to suppress EventsRole Default policy
    // which gets updated in EventManager construct, but is part of ControlPlane API
    NagSuppressions.addResourceSuppressions(
      controlPlaneAPI,
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
