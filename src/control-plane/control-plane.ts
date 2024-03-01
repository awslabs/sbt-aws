// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth';
import { IBilling } from './billing/billing-interface';
import { BillingTemplate } from './billing/billing-template';
import { ControlPlaneAPI } from './control-plane-api';
import { FirehoseIngestorAggregator } from './ingestor-aggregator/firehose-ingestor-aggregator';
import { LambdaLayers } from './lambda-layers';
import { Messaging } from './messaging';
import { Services } from './services';
import { Tables } from './tables';
import { TenantConfigService } from './tenant-config/tenant-config-service';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager, setTemplateDesc, EventMetadata, EventManagerEvent } from '../utils';

export interface ControlPlaneProps {
  readonly auth: IAuth;
  readonly billing?: IBilling;
  readonly eventMetadata?: EventMetadata;
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
    const lambdaLayers = new LambdaLayers(this, 'controlplane-lambda-layers');

    this.tables = new Tables(this, 'tables-stack');

    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', messaging.eventBus.eventBusArn);
    this.eventManager = new EventManager(this, 'EventManager', {
      eventBus: eventBus,
    });

    const services = new Services(this, 'services-stack', {
      lambdaLayer: lambdaLayers.controlPlaneLambdaLayer,
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
      EventManagerEvent.PROVISION_SUCCESS,
      controlPlaneAPI.tenantUpdateServiceTarget
    );

    this.eventManager.addTargetToEvent(
      EventManagerEvent.DEPROVISION_SUCCESS,
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

    const firehoseIngestorAggregator = new FirehoseIngestorAggregator(
      this,
      'firehoseIngestorAggregator',
      {
        primaryKeyColumn: this.tables.tenantIdColumn,
        primaryKeyPath: 'tenantId',
        aggregateKeyPath: 'metric.name',
        aggregateValuePath: 'metric.value',
      }
    );

    new cdk.CfnOutput(this, 'dataIngestorName', {
      value: firehoseIngestorAggregator.dataIngestorName,
      key: 'dataIngestorName',
    });

    if (props.billing) {
      const billingTemplate = new BillingTemplate(this, 'Billing', {
        billing: props.billing,
        eventManager: this.eventManager,
        controlPlaneAPIBillingResource: controlPlaneAPI.billingResource,
        tenantDetailsTable: this.tables.tenantDetails,
        tenantIdColumn: this.tables.tenantIdColumn,
      });
      new cdk.CfnOutput(this, 'billingWebhookURL', {
        value: `${
          controlPlaneAPI.apiUrl
        }${billingTemplate.controlPlaneAPIBillingWebhookResource.path.substring(1)}`,
        key: 'billingWebhookURL',
      });
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
