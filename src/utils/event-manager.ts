// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IEventBus, Rule, IRuleTarget } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export enum DetailType {
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

export type EventMetadata = {
  // key: Event 'detailType' -> val: Event 'source'
  [key: string]: string;
  // [key in DetailType]: string; // Causes this error: Only string-indexed map types are supported
};

/**
 * Encapsulates the list of properties for an eventManager.
 */
export interface EventManagerProps {
  /**
   * The event bus to register new rules with.
   */
  readonly eventBus: IEventBus;

  readonly eventMetadata?: EventMetadata;
  readonly applicationPlaneEventSource?: string;
  readonly controlPlaneEventSource?: string;
}

/**
 * Provides an EventManager to help interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct {
  public readonly applicationPlaneEventSource: string = 'applicationPlaneEventSource';
  public readonly controlPlaneEventSource: string = 'controlPlaneEventSource';
  // sensible defaults so they are not required when instantiating control plane

  public readonly supportedEvents: EventMetadata = {
    onboardingRequest: this.controlPlaneEventSource,
    onboardingSuccess: this.applicationPlaneEventSource,
    onboardingFailure: this.applicationPlaneEventSource,
    offboardingRequest: this.controlPlaneEventSource,
    offboardingSuccess: this.applicationPlaneEventSource,
    offboardingFailure: this.applicationPlaneEventSource,
    provisionSuccess: this.applicationPlaneEventSource,
    provisionFailure: this.applicationPlaneEventSource,
    deprovisionSuccess: this.applicationPlaneEventSource,
    deprovisionFailure: this.applicationPlaneEventSource,
    billingSuccess: this.controlPlaneEventSource,
    billingFailure: this.controlPlaneEventSource,
    activateRequest: this.controlPlaneEventSource,
    activateSuccess: this.applicationPlaneEventSource,
    activateFailure: this.applicationPlaneEventSource,
    deactivateRequest: this.controlPlaneEventSource,
    deactivateSuccess: this.applicationPlaneEventSource,
    deactivateFailure: this.applicationPlaneEventSource,
  };

  /**
   * The event bus to register new rules with.
   * @attribute
   */
  public readonly eventBus: IEventBus;

  private readonly connectedRules: Map<DetailType, Rule> = new Map<DetailType, Rule>();

  constructor(scope: Construct, id: string, props: EventManagerProps) {
    super(scope, id);
    this.eventBus = props.eventBus;

    this.applicationPlaneEventSource =
      props.applicationPlaneEventSource || this.applicationPlaneEventSource;
    this.controlPlaneEventSource = props.controlPlaneEventSource || this.controlPlaneEventSource;

    for (const key in this.supportedEvents) {
      // update this.eventMetadata with any values passed in via props
      if (props.eventMetadata && props.eventMetadata[key]) {
        this.supportedEvents[key] = props.eventMetadata[key];
      }
    }
  }

  public addTargetToEvent(eventType: DetailType, target: IRuleTarget): void {
    this.getOrCreateRule(eventType).addTarget(target);
  }

  private getOrCreateRule(eventType: DetailType): Rule {
    let rule = this.connectedRules.get(eventType);

    if (!rule) {
      rule = new Rule(this, `${eventType}Rule`, {
        eventBus: this.eventBus,
        eventPattern: {
          source: [this.supportedEvents[eventType]],
          detailType: [eventType],
        },
      });
      this.connectedRules.set(eventType, rule);
    }

    return rule;
  }
}
