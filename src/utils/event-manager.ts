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

import { IEventBus, Rule, IRuleTarget, EventBus } from 'aws-cdk-lib/aws-events';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { addTemplateTag } from './utils';

/**
 * Represents an event definition with its detail type and source.
 */
export class EventDefinition {
  #detailType: string;
  #source: string;

  constructor(detailType: string, source: string) {
    this.#detailType = detailType;
    this.#source = source;
  }

  /**
   * The detail type of this event
   */
  get detailType(): string {
    return this.#detailType;
  }

  /**
   * The source of this event
   */
  get source(): string {
    return this.#source;
  }
}

/**
 * Props for adding a target to an event.
 */
export interface AddTargetToEventProps {
  /**
   * The event definition to add a target to.
   */
  readonly eventDefinition: EventDefinition;

  /**
   * The target that will be added to the event.
   */
  readonly target: IRuleTarget;
}

/**
 * Encapsulates the properties for an EventManager.
 */
export interface EventManagerProps {
  /**
   * The event bus to register new rules with. One will be created if not provided.
   */
  readonly eventBus?: IEventBus;

  /**
   * Source overrides for specific event detail types.
   */
  readonly sourceOverrides?: Record<string, string>;

  /**
   * The name of the event source for events coming from the SBT control plane.
   * @default sbt.control.plane
   */
  readonly controlPlaneEventSource?: string;

  /**
   * The name of the event source for events coming from the SBT application plane.
   * @default sbt.application.plane
   */
  readonly applicationPlaneEventSource?: string;
}

export interface IEventManager {
  /**
   * The event source used for events emitted by the application plane.
   */
  readonly applicationPlaneEventSource: string;

  /**
   * The event source used for events emitted by the control plane.
   */
  readonly controlPlaneEventSource: string;

  /**
   * The name of the bus that will be used to send and receive events.
   */
  readonly busName: string;

  /**
   * The ARN/ID of the bus that will be used to send and receive events.
   */
  readonly busArn: string;

  /**
   * Standard events definitions
   */
  readonly events: Record<string, EventDefinition>;

  /**
   * Adds an IRuleTarget to an event.
   */
  addTargetToEvent(scope: Construct, props: AddTargetToEventProps): void;

  /**
   * Creates a control plane event with the specified detail type
   */
  createControlPlaneEvent(detailType: string): EventDefinition;

  /**
   * Creates an application plane event with the specified detail type
   */
  createApplicationPlaneEvent(detailType: string): EventDefinition;

  /**
   * Creates a custom event with the specified detail type and source
   */
  createCustomEvent(detailType: string, source: string): EventDefinition;

  /**
   * Provides grantee the permissions to place events on the EventManager bus.
   */
  grantPutEventsTo(grantee: IGrantable): void;
}

/**
 * Provides an EventManager to interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct implements IEventManager {
  /**
   * The event source used for events emitted by the application plane.
   */
  public readonly applicationPlaneEventSource: string;

  /**
   * The event source used for events emitted by the control plane.
   */
  public readonly controlPlaneEventSource: string;

  /**
   * The eventBus resource that will be used to send and receive events.
   */
  public readonly eventBus: IEventBus;

  /**
   * The name of the bus that will be used to send and receive events.
   */
  public readonly busName: string;

  /**
   * The ARN/ID of the bus that will be used to send and receive events.
   */
  public readonly busArn: string;

  /**
   * Map of all event definitions by composite key of source:detailType
   */
  private readonly eventDefinitions: Map<string, EventDefinition> = new Map();

  /**
   * Standard event definitions
   */
  public readonly events: Record<string, EventDefinition> = {};

  constructor(scope: Construct, id: string, props?: EventManagerProps) {
    super(scope, id);
    addTemplateTag(this, 'EventManager');

    this.eventBus = props?.eventBus ?? new EventBus(this, 'SbtEventBus');
    this.busName = this.eventBus.eventBusName;
    this.busArn = this.eventBus.eventBusArn;

    this.applicationPlaneEventSource =
      props?.applicationPlaneEventSource || 'sbt.application.plane';
    this.controlPlaneEventSource = props?.controlPlaneEventSource || 'sbt.control.plane';

    const sourceOverrides = props?.sourceOverrides || {};

    // Define standard events by name and source
    // To add a new event, simply add its name to the appropriate array

    // Control plane events
    const controlPlaneEvents = [
      'onboardingRequest',
      'offboardingRequest',
      'billingSuccess',
      'billingFailure',
      'activateRequest',
      'deactivateRequest',
      'tenantUserCreated',
      'tenantUserDeleted',
    ];

    // Application plane events
    const applicationPlaneEvents = [
      'onboardingSuccess',
      'onboardingFailure',
      'offboardingSuccess',
      'offboardingFailure',
      'provisionSuccess',
      'provisionFailure',
      'deprovisionSuccess',
      'deprovisionFailure',
      'activateSuccess',
      'activateFailure',
      'deactivateSuccess',
      'deactivateFailure',
      'ingestUsage',
    ];

    // Register all control plane events with sbt_aws_ prefix
    for (const eventName of controlPlaneEvents) {
      // Create prefixed detail type for standard events
      const prefixedDetailType = `sbt_aws_${eventName}`;
      this.events[eventName] = this.createEventDefinition(
        prefixedDetailType,
        this.controlPlaneEventSource,
        sourceOverrides,
        eventName // Pass the original eventName for source override lookup
      );
    }

    // Register all application plane events with sbt_aws_ prefix
    for (const eventName of applicationPlaneEvents) {
      // Create prefixed detail type for standard events
      const prefixedDetailType = `sbt_aws_${eventName}`;
      this.events[eventName] = this.createEventDefinition(
        prefixedDetailType,
        this.applicationPlaneEventSource,
        sourceOverrides,
        eventName // Pass the original eventName for source override lookup
      );
    }
  }

  /**
   * Create an event definition with the given detail type and source
   */
  private createEventDefinition(
    detailType: string,
    defaultSource: string,
    sourceOverrides?: Record<string, string>,
    overrideKey?: string
  ): EventDefinition {
    // Use override source if specified, otherwise use default
    // For standard events, use the original event name (without prefix) for source overrides lookup
    const source = sourceOverrides?.[overrideKey || detailType] || defaultSource;

    // Create a composite key using source and detailType
    const key = `${source}:${detailType}`;

    // Check if this combination already exists
    if (this.eventDefinitions.has(key)) {
      throw new Error(
        `Event with detail type '${detailType}' and source '${source}' already exists`
      );
    }

    const eventDef = new EventDefinition(detailType, source);
    this.eventDefinitions.set(key, eventDef);
    return eventDef;
  }

  /**
   * Creates a control plane event with the specified detail type
   */
  public createControlPlaneEvent(detailType: string): EventDefinition {
    // Use the composite key to check uniqueness
    const key = `${this.controlPlaneEventSource}:${detailType}`;
    if (this.eventDefinitions.has(key)) {
      throw new Error(
        `Event with detail type '${detailType}' and source '${this.controlPlaneEventSource}' already exists`
      );
    }
    return this.createEventDefinition(detailType, this.controlPlaneEventSource);
  }

  /**
   * Creates an application plane event with the specified detail type
   */
  public createApplicationPlaneEvent(detailType: string): EventDefinition {
    // Use the composite key to check uniqueness
    const key = `${this.applicationPlaneEventSource}:${detailType}`;
    if (this.eventDefinitions.has(key)) {
      throw new Error(
        `Event with detail type '${detailType}' and source '${this.applicationPlaneEventSource}' already exists`
      );
    }
    return this.createEventDefinition(detailType, this.applicationPlaneEventSource);
  }

  /**
   * Creates a custom event with the specified detail type and source
   */
  public createCustomEvent(detailType: string, source: string): EventDefinition {
    // Use the composite key to check uniqueness
    const key = `${source}:${detailType}`;
    if (this.eventDefinitions.has(key)) {
      throw new Error(
        `Event with detail type '${detailType}' and source '${source}' already exists`
      );
    }
    return this.createEventDefinition(detailType, source);
  }

  /**
   * Adds an IRuleTarget to an event.
   */
  public addTargetToEvent(scope: Construct, props: AddTargetToEventProps): void {
    this.getOrCreateRule(scope, props.eventDefinition).addTarget(props.target);
  }

  /**
   * Sanitizes a string for use as part of a CloudFormation logical ID.
   * CloudFormation logical IDs can only contain alphanumeric characters and
   * must be unique within a template. Since our rule IDs are derived from
   * both source and detailType, which may contain special characters like
   * periods, colons, or hyphens, we need to replace those characters with
   * something valid.
   *
   * @param id The string to sanitize
   * @returns A sanitized string valid for use in a CloudFormation logical ID
   */
  private sanitizeRuleId(id: string): string {
    return id.replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * Returns a Rule for the given eventDefinition in the context of a scope.
   */
  private getOrCreateRule(scope: Construct, eventDefinition: EventDefinition): Rule {
    const detailType = eventDefinition.detailType;
    const source = eventDefinition.source;

    // Create a unique ID for the rule that includes both source and detailType
    const ruleId = `${this.sanitizeRuleId(source)}_${this.sanitizeRuleId(detailType)}Rule`;

    let rule = scope.node.tryFindChild(ruleId) as Rule;
    if (!rule) {
      rule = new Rule(scope, ruleId, {
        eventBus: this.eventBus,
        eventPattern: {
          source: [source],
          detailType: [detailType],
        },
      });
    }

    return rule;
  }

  /**
   * Provides grantee the permissions to place events on the EventManager bus.
   */
  public grantPutEventsTo(grantee: IGrantable): void {
    this.eventBus.grantPutEventsTo(grantee);
  }
}
