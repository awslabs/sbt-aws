// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth';
import { ControlPlaneAPI } from './control-plane-api';
import { LambdaLayers } from './lambda-layers';
import { Messaging } from './messaging';
import { Services } from './services';
import { Tables } from './tables';
import { TenantConfigService } from './tenant-config/tenant-config-service';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager } from '../utils';

export interface ControlPlaneProps {
  readonly applicationPlaneEventSource: string;
  readonly provisioningDetailType: string;
  readonly controlPlaneEventSource: string;
  readonly onboardingDetailType: string;
  readonly offboardingDetailType: string;
  readonly auth: IAuth;
}

export class ControlPlane extends Construct {
  readonly eventBusArn: string;
  readonly controlPlaneSource: string;
  readonly onboardingDetailType: string;
  readonly offboardingDetailType: string;
  readonly controlPlaneAPIGatewayUrl: string;

  constructor(scope: Construct, id: string, props: ControlPlaneProps) {
    super(scope, id);
    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    const messaging = new Messaging(this, 'messaging-stack');
    const lambdaLayers = new LambdaLayers(this, 'controlplane-lambda-layers');

    const tables = new Tables(this, 'tables-stack');

    const services = new Services(this, 'services-stack', {
      eventBus: messaging.eventBus,
      idpDetails: props.auth.controlPlaneIdpDetails,
      lambdaLayer: lambdaLayers.controlPlaneLambdaLayer,
      tables: tables,
      onboardingDetailType: props.onboardingDetailType,
      controlPlaneEventSource: props.controlPlaneEventSource,
    });

    const tenantConfigService = new TenantConfigService(this, 'auth-info-service-stack', {
      tenantDetails: tables.tenantDetails,
      tenantDetailsTenantNameColumn: tables.tenantNameColumn,
      tenantConfigIndexName: tables.tenantConfigIndexName,
      tenantDetailsTenantConfigColumn: tables.tenantConfigColumn,
    });

    const controlPlaneAPI = new ControlPlaneAPI(this, 'controlplane-api-stack', {
      services: services,
      auth: props.auth,
      tenantConfigServiceLambda: tenantConfigService.tenantConfigServiceLambda,
    });

    this.eventBusArn = messaging.eventBus.eventBusArn;
    this.controlPlaneSource = props.controlPlaneEventSource;
    this.onboardingDetailType = props.onboardingDetailType;
    this.offboardingDetailType = props.offboardingDetailType;
    this.controlPlaneAPIGatewayUrl = controlPlaneAPI.apiUrl;

    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', messaging.eventBus.eventBusArn);
    const eventManager = new EventManager(this, 'EventManager', {
      eventBus: eventBus,
    });

    eventManager.addRuleWithTarget(
      'ProvisioningServiceRule',
      [props.onboardingDetailType],
      [props.applicationPlaneEventSource],
      controlPlaneAPI.tenantUpdateServiceTarget
    );
    eventManager.addRuleWithTarget(
      'DeprovisioningServiceRule',
      [props.offboardingDetailType],
      [props.applicationPlaneEventSource],
      controlPlaneAPI.tenantUpdateServiceTarget
    );

    new cdk.CfnOutput(this, 'controlPlaneAPIGatewayUrl', {
      value: controlPlaneAPI.apiUrl,
      key: 'controlPlaneAPIGatewayUrl',
    });

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

    // defined here as these log retention resources are not
    // created as part of a lower-level construct
    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${
          cdk.Stack.of(this).stackName
        }/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource`,
        `${
          cdk.Stack.of(this).stackName
        }/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress error from resource created for setting log retention.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress error from resource created for setting log retention.',
          appliesTo: ['Resource::*'],
        },
      ]
    );
  }
}
