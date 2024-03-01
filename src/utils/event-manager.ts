// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IEventBus, Rule, IRuleTarget, EventPattern } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export interface EventMetadata {
  readonly onboardingRequest: EventPattern;
  readonly onboardingSuccess: EventPattern;
  readonly onboardingFailure: EventPattern;
  readonly offboardingRequest: EventPattern;
  readonly offboardingSuccess: EventPattern;
  readonly offboardingFailure: EventPattern;
  readonly provisionSuccess: EventPattern;
  readonly provisionFailure: EventPattern;
  readonly billingSuccess: EventPattern;
  readonly billingFailure: EventPattern;
  readonly deprovisionSuccess: EventPattern;
  readonly deprovisionFailure: EventPattern;
  readonly activateRequest: EventPattern;
  readonly activateSuccess: EventPattern;
  readonly activateFailure: EventPattern;
  readonly deactivateRequest: EventPattern;
  readonly deactivateSuccess: EventPattern;
  readonly deactivateFailure: EventPattern;
}

/**
 * Encapsulates the list of properties for an eventManager.
 */
export interface EventManagerProps {
  /**
   * The event bus to register new rules with.
   */
  readonly eventBus: IEventBus;

  readonly eventMetadata?: EventMetadata;
}

export enum EventManagerEvent {
  ONBOARDING_REQUEST = 'onboardingRequest',
  ONBOARDING_SUCCESS = 'onboardingSuccess',
  ONBOARDING_FAILURE = 'onboardingFailure',
  OFFBOARDING_REQUEST = 'offboardingRequest',
  OFFBOARDING_SUCCESS = 'offboardingSuccess',
  OFFBOARDING_FAILURE = 'offboardingFailure',
  PROVISION_SUCCESS = 'provisionSuccess',
  PROVISION_FAILURE = 'provisionFailure',
  DEPROVISION_SUCCESS = 'deprovisionSuccess',
  DEPROVISION_FAILURE = 'deprovisionFailure',
  BILLING_SUCCESS = 'billingSuccess',
  BILLING_FAILURE = 'billingFailure',
  ACTIVATE_REQUEST = 'activateRequest',
  ACTIVATE_SUCCESS = 'activateSuccess',
  ACTIVATE_FAILURE = 'activateFailure',
  DEACTIVATE_REQUEST = 'deactivateRequest',
  DEACTIVATE_SUCCESS = 'deactivateSuccess',
  DEACTIVATE_FAILURE = 'deactivateFailure',
}

/**
 * Provides an EventManager to help interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct {
  /**
   * The event bus to register new rules with.
   * @attribute
   */
  public readonly eventBus: IEventBus;

  public readonly applicationPlaneEventSource: string = 'testApplicationPlaneEventSource';
  public readonly controlPlaneEventSource: string = 'testControlPlaneEventSource';
  // sensible defaults so they are not required when instantiating control plane
  readonly eventMetadata: EventMetadata = {
    onboardingRequest: {
      source: [this.controlPlaneEventSource],
      detailType: ['onboardingRequest'],
    },
    onboardingSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['onboardingSuccess'],
    },
    onboardingFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['onboardingFailure'],
    },
    offboardingRequest: {
      source: [this.controlPlaneEventSource],
      detailType: ['offboardingRequest'],
    },
    offboardingSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['offboardingSuccess'],
    },
    offboardingFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['offboardingFailure'],
    },
    provisionSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['provisionSuccess'],
    },
    provisionFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['provisionFailure'],
    },
    deprovisionSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['deprovisionSuccess'],
    },
    deprovisionFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['deprovisionFailure'],
    },
    billingSuccess: {
      source: [this.controlPlaneEventSource],
      detailType: ['billingSuccess'],
    },
    billingFailure: {
      source: [this.controlPlaneEventSource],
      detailType: ['billingFailure'],
    },
    activateRequest: {
      source: [this.controlPlaneEventSource],
      detailType: ['activateRequest'],
    },
    activateSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['activateSuccess'],
    },
    activateFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['activateFailure'],
    },
    deactivateRequest: {
      source: [this.controlPlaneEventSource],
      detailType: ['deactivateRequest'],
    },
    deactivateSuccess: {
      source: [this.applicationPlaneEventSource],
      detailType: ['deactivateSuccess'],
    },
    deactivateFailure: {
      source: [this.applicationPlaneEventSource],
      detailType: ['deactivateFailure'],
    },
  };

  private readonly rules: { [key: string]: Rule } = {};

  constructor(scope: Construct, id: string, props: EventManagerProps) {
    super(scope, id);
    this.eventBus = props.eventBus;

    for (const [key, value] of Object.entries(this.eventMetadata)) {
      this.rules[key as EventManagerEvent] = new Rule(this, `${key}Rule`, {
        eventBus: this.eventBus,
        eventPattern: value as EventPattern,
      });
    }
  }

  public addTargetToEvent(eventManagerEvent: EventManagerEvent, target: IRuleTarget): void {
    this.rules[eventManagerEvent].addTarget(target);
  }
}
