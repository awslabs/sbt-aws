// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth/auth-interface';
import { IBilling, BillingProvider } from './billing';
import { ControlPlaneAPI } from './control-plane-api';
import { Messaging } from './messaging';
import { Services } from './services';
import { Tables } from './tables';
import { TenantConfigService } from './tenant-config/tenant-config-service';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager, setTemplateDesc, EventMetadata, DetailType } from '../utils';

export interface ControlPlaneProps {
  readonly auth: IAuth;
  readonly billing?: IBilling;
  readonly eventMetadata?: EventMetadata;
  /**
   * The source to use when listening for events coming from the SBT control plane.
   * This is used as the default if the IncomingEventMetadata source field is not set.
   */
  readonly controlPlaneEventSource?: string;

  /**
   * The source to use for outgoing events that will be placed on the EventBus.
   * This is used as the default if the OutgoingEventMetadata source field is not set.
   */
  readonly applicationPlaneEventSource?: string;
}

export class ControlPlane extends Construct {
  readonly eventBusArn: string;
  readonly eventManager: EventManager;
  readonly controlPlaneAPIGatewayUrl: string;
  readonly tables: Tables;

  constructor(scope: Construct, id: string, props: ControlPlaneProps) {
    super(scope, id);
    setTemplateDesc(this, 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)');

    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    const messaging = new Messaging(this, 'messaging-stack');
    this.tables = new Tables(this, 'tables-stack');

    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', messaging.eventBus.eventBusArn);
    this.eventManager = new EventManager(this, 'EventManager', {
      eventBus: eventBus,
      eventMetadata: props.eventMetadata,
      applicationPlaneEventSource: props.applicationPlaneEventSource,
      controlPlaneEventSource: props.controlPlaneEventSource,
    });

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

    const controlPlaneAPI = new ControlPlaneAPI(this, 'controlplane-api-stack', {
      services: services,
      auth: props.auth,
      tenantConfigServiceLambda: tenantConfigService.tenantConfigServiceLambda,
    });

    this.eventBusArn = messaging.eventBus.eventBusArn;
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
      value: this.eventManager.eventBus.eventBusArn,
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
