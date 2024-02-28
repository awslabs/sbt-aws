// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IEventBus, Rule, IRuleTarget } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

/**
 * Encapsulates the list of properties for an eventManager.
 */
export interface EventManagerProps {
  /**
   * The event bus to register new rules with.
   */
  readonly eventBus: IEventBus;
}

/**
 * Provides an EventManager to help interact with the EventBus shared with the SBT control plane.
 */
export class EventManager extends Construct {
  /**
   * The event bus to register new rules with.
   * @attribute
   */
  private readonly eventBus: IEventBus;
  constructor(scope: Construct, id: string, props: EventManagerProps) {
    super(scope, id);
    this.eventBus = props.eventBus;
  }

  /**
   * Function to add a new rule and register a target for the newly added rule.
   */
  addRuleWithTarget(
    ruleName: string,
    eventDetailType: string[],
    eventSource: string[],
    target: IRuleTarget
  ) {
    const rule = new Rule(this, ruleName, {
      eventBus: this.eventBus,
      enabled: true,
      eventPattern: {
        source: eventDetailType,
        detailType: eventSource,
      },
    });
    rule.addTarget(target);
  }
}
