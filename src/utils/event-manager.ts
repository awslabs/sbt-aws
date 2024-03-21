// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IEventBus, Rule, IRuleTarget } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

/**
 * Provides an easy way of accessing event DetailTypes.
 * Note that the string represents the detailTypes used in
 * events sent across the EventBus.
 */
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

/**
 * Represents mapping between 'detailType' as key,
 * and 'source' as value.
 */
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

export interface IEventManager {
  /**
   * Registers a new rule that will be triggered when the given event is received.
   * @param detailType The event to listen for.
   * @param target The target to invoke when the event is received.
   */
  registerRule(detailType: DetailType, target: IRuleTarget): void;
}

/**
 * Provides an EventManager to help interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct implements IEventManager {
  public static readonly APP_PLANE_SOURCE: string = 'applicationPlaneEventSource';
  public static readonly CONTROL_PLANE_SOURCE: string = 'controlPlaneEventSource';

  // sensible defaults so they are not required when instantiating control plane
  public readonly supportedEvents: EventMetadata = {
    onboardingRequest: EventManager.CONTROL_PLANE_SOURCE,
    onboardingSuccess: EventManager.APP_PLANE_SOURCE,
    onboardingFailure: EventManager.APP_PLANE_SOURCE,
    offboardingRequest: EventManager.CONTROL_PLANE_SOURCE,
    offboardingSuccess: EventManager.APP_PLANE_SOURCE,
    offboardingFailure: EventManager.APP_PLANE_SOURCE,
    provisionSuccess: EventManager.APP_PLANE_SOURCE,
    provisionFailure: EventManager.APP_PLANE_SOURCE,
    deprovisionSuccess: EventManager.APP_PLANE_SOURCE,
    deprovisionFailure: EventManager.APP_PLANE_SOURCE,
    billingSuccess: EventManager.CONTROL_PLANE_SOURCE,
    billingFailure: EventManager.CONTROL_PLANE_SOURCE,
    activateRequest: EventManager.CONTROL_PLANE_SOURCE,
    activateSuccess: EventManager.APP_PLANE_SOURCE,
    activateFailure: EventManager.APP_PLANE_SOURCE,
    deactivateRequest: EventManager.CONTROL_PLANE_SOURCE,
    deactivateSuccess: EventManager.APP_PLANE_SOURCE,
    deactivateFailure: EventManager.APP_PLANE_SOURCE,
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

    // this.applicationPlaneEventSource = props.applicationPlaneEventSource || this.applicationPlaneEventSource;
    // this.controlPlaneEventSource = props.controlPlaneEventSource || this.controlPlaneEventSource;

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
   * @param eventType The name of the event to add a target to.
   * @param target The target that will be added to the event.
   */
  public registerRule(eventType: DetailType, target: IRuleTarget): void {
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
