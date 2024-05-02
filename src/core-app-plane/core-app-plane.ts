// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { IEventBus } from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { BashJobOrchestrator } from './bash-job-orchestrator';
import { BashJobRunner } from './bash-job-runner';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager, EventMetadata, DetailType, setTemplateDesc, IEventManager } from '../utils';

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
 * Encapsulates the list of properties for a CoreApplicationPlaneJobRunner.
 */
export interface IJobRunner {
  /**
   * The name of the CoreApplicationPlaneJobRunner. Note that this value must be unique.
   */
  readonly name: string;

  /**
   * The IAM permission document for the CoreApplicationPlaneJobRunner.
   */
  readonly permissions: iam.PolicyDocument;

  /**
   * The bash script to run as part of the CoreApplicationPlaneJobRunner.
   */
  readonly script: string;

  /**
   * The incoming event DetailType that triggers this job.
   */
  readonly incomingEvent: DetailType;

  /**
   * The outgoing event DetailType that is emitted upon job completion.
   */
  readonly outgoingEvent: DetailType;

  /**
   * The bash script to run after the main script has completed.
   */
  readonly postScript?: string;

  /**
   * The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.
   * This argument consists of the names of only string type variables. Ex. 'test'
   */
  readonly environmentStringVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.
   * This argument consists of the names of only JSON-formatted string type variables.
   * Ex. '{"test": 2}'
   */
  readonly environmentJSONVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished.
   */
  readonly environmentVariablesToOutgoingEvent?: string[];

  /**
   * The variables to pass into the codebuild CoreApplicationPlaneJobRunner.
   */
  readonly scriptEnvironmentVariables?: {
    [key: string]: string;
  };
}

/**
 * Encapsulates the list of properties for a CoreApplicationPlane.
 */
export interface CoreApplicationPlaneProps {
  /**
   * The arn belonging to the EventBus to listen for incoming messages.
   * This is also the EventBus on which the CoreApplicationPlane places outgoing messages on.
   */
  // readonly eventBusArn: string;

  readonly eventBus: IEventBus;

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
  readonly jobRunners?: IJobRunner[];

  readonly eventMetadata?: EventMetadata;

  readonly eventManger?: IEventManager;
}

/**
 * Provides a CoreApplicationPlane.
 * This construct will help create resources to accelerate building an SBT-compliant Application Plane.
 * It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
 * and respond to events created by the control plane.
 */
export class CoreApplicationPlane extends Construct {
  readonly eventManager: EventManager;

  constructor(scope: Construct, id: string, props: CoreApplicationPlaneProps) {
    super(scope, id);
    setTemplateDesc(this, 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)');

    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    this.eventManager = new EventManager(this, 'EventManager', {
      eventBus: props.eventBus,
      eventMetadata: props.eventMetadata,
      applicationPlaneEventSource: props.applicationPlaneEventSource,
      controlPlaneEventSource: props.controlPlaneEventSource,
    });

    props.jobRunners?.forEach((runner) => {
      let envVarsFromIncomingEvent: string[] = [];
      if (runner.environmentStringVariablesFromIncomingEvent) {
        envVarsFromIncomingEvent.concat(runner.environmentStringVariablesFromIncomingEvent);
      }
      if (runner.environmentJSONVariablesFromIncomingEvent) {
        envVarsFromIncomingEvent.concat(runner.environmentJSONVariablesFromIncomingEvent);
      }

      let job = new BashJobRunner(this, runner.name, {
        name: runner.name,
        permissions: runner.permissions,
        script: runner.script,
        postScript: runner.postScript,
        environmentVariablesFromIncomingEvent: envVarsFromIncomingEvent,
        environmentVariablesToOutgoingEvent: runner.environmentVariablesToOutgoingEvent,
        scriptEnvironmentVariables: runner.scriptEnvironmentVariables,
      });

      let jobOrchestrator = new BashJobOrchestrator(this, `${runner.name}-orchestrator`, {
        targetEventBus: props.eventBus,
        detailType: runner.outgoingEvent,
        eventSource: this.eventManager.supportedEvents[runner.outgoingEvent],
        environmentVariablesToOutgoingEvent: runner.environmentVariablesToOutgoingEvent,
        environmentStringVariablesFromIncomingEvent:
          runner.environmentStringVariablesFromIncomingEvent,
        environmentJSONVariablesFromIncomingEvent: runner.environmentJSONVariablesFromIncomingEvent,
        bashJobRunner: job,
      });

      this.eventManager.addTargetToEvent(runner.incomingEvent, jobOrchestrator.eventTarget);
    });
  }
}
