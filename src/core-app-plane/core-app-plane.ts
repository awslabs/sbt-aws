// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { EventBus } from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { BashJobOrchestrator } from './bash-job-orchestrator';
import { BashJobRunner } from './bash-job-runner';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager } from '../utils';

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
   * @default CoreApplicationPlaneProps.applicationNamePlaneSource
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
   * @default CoreApplicationPlaneProps.controlPlaneSource
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
   * The IncomingEventMetadata to use when listening for the event that will trigger this CoreApplicationPlaneJobRunner.
   */
  readonly incomingEvent: IncomingEventMetadata;

  /**
   * The OutgoingEventMetadata to use when submitting a new event after this CoreApplicationPlaneJobRunner has executed.
   */
  readonly outgoingEvent: OutgoingEventMetadata;

  /**
   * The bash script to run after the main script has completed.
   */
  readonly postScript?: string;

  /**
   * The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.
   */
  readonly importedVariables?: string[];

  /**
   * The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished.
   */
  readonly exportedVariables?: string[];

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
  readonly controlPlaneSource: string;

  /**
   * The source to use for outgoing events that will be placed on the EventBus.
   * This is used as the default if the OutgoingEventMetadata source field is not set.
   */
  readonly applicationNamePlaneSource: string;

  /**
   * The list of JobRunner definitions to create.
   */
  readonly jobRunnerPropsList?: CoreApplicationPlaneJobRunnerProps[];
}

/**
 * Provides a CoreApplicationPlane.
 * This construct will help create resources to accelerate building an SBT-compliant Application Plane.
 * It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
 * and respond to events created by the control plane.
 */
export class CoreApplicationPlane extends Construct {
  constructor(scope: Construct, id: string, props: CoreApplicationPlaneProps) {
    super(scope, id);
    cdk.Aspects.of(this).add(new DestroyPolicySetter());

    const eventBus = EventBus.fromEventBusArn(this, 'eventBus', props.eventBusArn);

    const eventManager = new EventManager(this, 'EventManager', {
      eventBus: eventBus,
    });

    props.jobRunnerPropsList?.forEach((jobRunnerProps) => {
      let job = new BashJobRunner(this, jobRunnerProps.name, {
        name: jobRunnerProps.name,
        permissions: jobRunnerProps.permissions,
        script: jobRunnerProps.script,
        postScript: jobRunnerProps.postScript,
        importedVariables: jobRunnerProps.importedVariables,
        exportedVariables: jobRunnerProps.exportedVariables,
        scriptEnvironmentVariables: jobRunnerProps.scriptEnvironmentVariables,
        eventBus: eventBus,
        outgoingEventDetailType: jobRunnerProps.outgoingEvent.detailType,
        outgoingEventSource:
          jobRunnerProps.outgoingEvent.source || props.applicationNamePlaneSource,
      });

      let jobOrchestrator = new BashJobOrchestrator(this, `${jobRunnerProps.name}-orchestrator`, {
        targetEventBus: eventBus,
        detailType: jobRunnerProps.outgoingEvent.detailType,
        eventSource: jobRunnerProps.outgoingEvent.source || props.applicationNamePlaneSource,
        exportedVariables: jobRunnerProps.exportedVariables,
        importedVariables: jobRunnerProps.importedVariables,
        bashJobRunner: job,
      });

      eventManager.addRuleWithTarget(
        jobRunnerProps.name,
        jobRunnerProps.incomingEvent.source || [props.controlPlaneSource],
        jobRunnerProps.incomingEvent.detailType,
        jobOrchestrator.eventTarget
      );
    });
  }
}
