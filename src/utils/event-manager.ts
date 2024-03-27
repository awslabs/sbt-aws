// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IEventBus, Rule, IRuleTarget } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

/**
 * Provides an easy way of accessing event detail types.
 * The string values represent the "detail-type" used in
 * events sent across the EventBus.
 */
export enum DetailType {
  /**
   * Event detail type for onboarding request.
   */
  ONBOARDING_REQUEST = 'onboardingRequest',
  /**
   * Event detail type for successful onboarding.
   */
  ONBOARDING_SUCCESS = 'onboardingSuccess',
  /**
   * Event detail type for failed onboarding.
   */
  ONBOARDING_FAILURE = 'onboardingFailure',

  /**
   * Event detail type for offboarding request.
   */
  OFFBOARDING_REQUEST = 'offboardingRequest',
  /**
   * Event detail type for successful offboarding.
   */
  OFFBOARDING_SUCCESS = 'offboardingSuccess',
  /**
   * Event detail type for failed offboarding.
   */
  OFFBOARDING_FAILURE = 'offboardingFailure',

  /**
   * Event detail type for successful provisioning.
   */
  PROVISION_SUCCESS = 'provisionSuccess',
  /**
   * Event detail type for failed provisioning.
   */
  PROVISION_FAILURE = 'provisionFailure',

  /**
   * Event detail type for successful deprovisioning.
   */
  DEPROVISION_SUCCESS = 'deprovisionSuccess',
  /**
   * Event detail type for failed deprovisioning.
   */
  DEPROVISION_FAILURE = 'deprovisionFailure',

  /**
   * Event detail type for successful billing configuration.
   */
  BILLING_SUCCESS = 'billingSuccess',
  /**
   * Event detail type for failure to configure billing.
   */
  BILLING_FAILURE = 'billingFailure',

  /**
   * Event detail type for activation request.
   */
  ACTIVATE_REQUEST = 'activateRequest',
  /**
   * Event detail type for successful activation.
   */
  ACTIVATE_SUCCESS = 'activateSuccess',
  /**
   * Event detail type for failed activation.
   */
  ACTIVATE_FAILURE = 'activateFailure',

  /**
   * Event detail type for deactivation request.
   */
  DEACTIVATE_REQUEST = 'deactivateRequest',
  /**
   * Event detail type for successful deactivation.
   */
  DEACTIVATE_SUCCESS = 'deactivateSuccess',
  /**
   * Event detail type for failed deactivation.
   */
  DEACTIVATE_FAILURE = 'deactivateFailure',

  /**
   * Event detail type for user creation on the app-plane side.
   * Note that sbt-aws components do not emit this event. This event
   * should be emitted by the application plane.
   */
  TENANT_USER_CREATED = 'tenantUserCreated',
  /**
   * Event detail type for user deletion on the app-plane side.
   * Note that sbt-aws components do not emit this event. This event
   * should be emitted by the application plane.
   */
  TENANT_USER_DELETED = 'tenantUserDeleted',
}

/**
 * Represents a mapping between 'detailType' as the key and 'source' as the value.
 */
export type EventMetadata = {
  // key: Event 'detailType' -> value: Event 'source'
  [key: string]: string;
  // [key in DetailType]: string; // Causes this error: Only string-indexed map types are supported
};

/**
 * Encapsulates the properties for an EventManager.
 */
export interface EventManagerProps {
  /**
   * The event bus to register new rules with.
   */
  readonly eventBus: IEventBus;

  /**
   * The EventMetadata to use to update the event defaults.
   */
  readonly eventMetadata?: EventMetadata;

  /**
   * The source to use when listening for events coming from the SBT control plane.
   */
  readonly controlPlaneEventSource?: string;

  /**
   * The source to use for outgoing events that will be placed on the EventBus.
   */
  readonly applicationPlaneEventSource?: string;
}

/**
 * Provides an EventManager to interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct {
  /**
   * The event source used for events emitted by the application plane.
   * @default
   */
  public readonly applicationPlaneEventSource: string = 'applicationPlaneEventSource';

  /**
   * The event source used for events emitted by the control plane.
   * @default
   */
  public readonly controlPlaneEventSource: string = 'controlPlaneEventSource';

  /**
   * List of recognized events that are available as triggers.
   */
  public readonly supportedEvents: EventMetadata;

  /**
   * The event bus to register new rules with.
   */
  public readonly eventBus: IEventBus;

  private readonly connectedRules: Map<DetailType, Rule> = new Map<DetailType, Rule>();

  constructor(scope: Construct, id: string, props: EventManagerProps) {
    super(scope, id);
    this.eventBus = props.eventBus;

    this.applicationPlaneEventSource =
      props.applicationPlaneEventSource || this.applicationPlaneEventSource;
    this.controlPlaneEventSource = props.controlPlaneEventSource || this.controlPlaneEventSource;

    this.supportedEvents = {
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

    for (const key in this.supportedEvents) {
      // update this.eventMetadata with any values passed in via props
      if (props.eventMetadata && props.eventMetadata[key]) {
        this.supportedEvents[key] = props.eventMetadata[key];
      }
    }
  }

  /**
   * Adds an IRuleTarget to an event.
   *
   * @param eventType The detail type of the event to add a target to.
   * @param target The target that will be added to the event.
   */
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
