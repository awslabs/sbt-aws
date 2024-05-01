// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { BashJobOrchestrator } from './bash-job-orchestrator';
import { BashJobRunner } from './bash-job-runner';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager, EventMetadata, DetailType, setTemplateDesc } from '../utils';

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
export interface CoreApplicationPlaneJobRunnerProps {
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
  readonly eventBusArn: string;

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
  readonly jobRunnerPropsList?: CoreApplicationPlaneJobRunnerProps[];

  readonly eventMetadata?: EventMetadata;
}

/**
 * Provides a CoreApplicationPlane.
 * This construct will help create resources to accelerate building an SBT-compliant Application Plane.
 * It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
 * and respond to events created by the control plane.
 */
export class CoreApplicationPlane extends Construct {
  readonly eventManager: EventManager;
  readonly jobRunnerRoleArnMap: { [key: string]: string } = {};

  constructor(scope: Construct, id: string, props: CoreApplicationPlaneProps) {
    super(scope, id);

    setTemplateDesc(this, 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)');

    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', props.eventBusArn);

    this.eventManager = new EventManager(this, 'EventManager', {
      eventBus: eventBus,
      eventMetadata: props.eventMetadata,
      applicationPlaneEventSource: props.applicationPlaneEventSource,
      controlPlaneEventSource: props.controlPlaneEventSource,
    });

    props.jobRunnerPropsList?.forEach((jobRunnerProps) => {
      // Only BashJobOrchestrator requires differentiating between
      // strings and JSON variables pulled from the incoming event.
      let envVarsFromIncomingEvent: string[] = [];
      if (jobRunnerProps.environmentStringVariablesFromIncomingEvent) {
        envVarsFromIncomingEvent.concat(jobRunnerProps.environmentStringVariablesFromIncomingEvent);
      }

      if (jobRunnerProps.environmentJSONVariablesFromIncomingEvent) {
        envVarsFromIncomingEvent.concat(jobRunnerProps.environmentJSONVariablesFromIncomingEvent);
      }

      let job = new BashJobRunner(this, jobRunnerProps.name, {
        name: jobRunnerProps.name,
        permissions: jobRunnerProps.permissions,
        script: jobRunnerProps.script,
        postScript: jobRunnerProps.postScript,
        environmentVariablesFromIncomingEvent: envVarsFromIncomingEvent,
        environmentVariablesToOutgoingEvent: jobRunnerProps.environmentVariablesToOutgoingEvent,
        scriptEnvironmentVariables: jobRunnerProps.scriptEnvironmentVariables,
      });

      this.jobRunnerRoleArnMap[jobRunnerProps.name] = job.codebuildProject.role?.roleArn || '';

      let jobOrchestrator = new BashJobOrchestrator(this, `${jobRunnerProps.name}-orchestrator`, {
        targetEventBus: eventBus,
        detailType: jobRunnerProps.outgoingEvent,
        eventSource: this.eventManager.supportedEvents[jobRunnerProps.outgoingEvent],
        environmentVariablesToOutgoingEvent: jobRunnerProps.environmentVariablesToOutgoingEvent,
        environmentStringVariablesFromIncomingEvent:
          jobRunnerProps.environmentStringVariablesFromIncomingEvent,
        environmentJSONVariablesFromIncomingEvent:
          jobRunnerProps.environmentJSONVariablesFromIncomingEvent,
        bashJobRunner: job,
      });

      this.eventManager.addTargetToEvent(jobRunnerProps.incomingEvent, jobOrchestrator.eventTarget);
    });
  }
}
