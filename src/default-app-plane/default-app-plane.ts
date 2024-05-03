// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';
import { BashJobOrchestrator } from './bash-job-orchestrator';
import { CodebuildRunner } from './codebuild-runner';
import { JobRunnerProps, JobRunner } from './job-runner';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager, setTemplateDesc, IEventManager, SUPPORTED_EVENTS } from '../utils';

/**
 * Provides metadata for outgoing events.
 */
export interface OutgoingEventMetadata {
  /**
   * The detailType to set in the outgoing event.
   */
  readonly detailType: string;

  /**
   * The source to set in the outgoing event.
   *
   * @default CoreApplicationPlaneProps.applicationPlaneEventSource
   */
  readonly source?: string;
}

/**
 * Provides metadata for incoming events.
 */
export interface IncomingEventMetadata {
  /**
   * The list of detailTypes to listen for in the incoming event.
   */
  readonly detailType: string[];

  /**
   * The list of sources to listen for in the incoming event.
   *
   * @default CoreApplicationPlaneProps.controlPlaneEventSource
   */
  readonly source?: string[];
}

/**
 * Encapsulates the list of properties for a CoreApplicationPlane.
 */
export interface DefaultApplicationPlaneProps {
  /**
   * The EventBus to listen for incoming messages. Note that this property is only used when
   * an IEventManager is not provided.
   *
   * This is also the EventBus on which the DefaultApplicaitonPlane places outgoing messages on.
   */
  readonly eventBus?: IEventBus;

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

  /**
   * The list of JobRunner definitions to create.
   */
  readonly jobRunners?: JobRunnerProps[];

  /**
   * The EventManager to use.
   *
   * If not provided, a new one will be created, and the @see IEventBus property must be provided
   *
   * @default - a new EventManager will be created
   */
  readonly eventManger?: IEventManager;

  /**
   * Adds another job runner to this application plane. Can be use in lieu of, or in addition to,
   * the @see jobRunners property.
   *
   * @param runner The job runner to add
   */
  addRunner(runner: JobRunnerProps): void;
}

/**
 * Provides a default implemenation of an SBT Application Plane.
 *
 * This construct will help create resources to accelerate building an SBT-compliant Application Plane.
 * It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
 * and respond to events created by the control plane.
 */
export class DefaultApplicationPlane extends Construct {
  readonly eventManager: IEventManager;
  jobRunners: JobRunner[] = [];

  constructor(scope: Construct, id: string, props: DefaultApplicationPlaneProps) {
    super(scope, id);
    setTemplateDesc(this, 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)');
    cdk.Aspects.of(this).add(new DestroyPolicySetter());
    this.eventManager = !!props.eventManger
      ? props.eventManger!
      : new EventManager(this, 'event-manager', {
          controlPlaneEventSource: props.controlPlaneEventSource,
          applicationPlaneEventSource: props.applicationPlaneEventSource,
          eventBus: props.eventBus!,
        });
  }
}
