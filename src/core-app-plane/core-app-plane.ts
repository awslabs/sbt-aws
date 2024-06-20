// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { EventBus } from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { BashJobOrchestrator } from './bash-job-orchestrator';
import { BashJobRunner } from './bash-job-runner';
import { EventManager, IEventManager, DetailType, addTemplateTag } from '../utils';

/**
 * Encapsulates the list of properties for a CoreApplicationPlaneJobRunner.
 */
export interface CoreApplicationPlaneJobRunnerProps {
  /**
   * The key where the tenant identifier is to be extracted from in
   * the incoming event.
   * @default 'tenantId'
   */
  readonly tenantIdentifierKeyInIncomingEvent?: string;

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
  readonly eventManager?: IEventManager;

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
  /**
   * The EventManager instance that allows connecting to events flowing between
   * the Control Plane and other components.
   */
  readonly eventManager: IEventManager;

  constructor(scope: Construct, id: string, props: CoreApplicationPlaneProps) {
    super(scope, id);
    addTemplateTag(this, 'CoreApplicationPlane');
    this.eventManager = props.eventManager ?? new EventManager(this, 'EventManager');
    const eventBus = EventBus.fromEventBusArn(this, 'EventBus', this.eventManager.busArn);

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
        tenantIdentifierKeyInIncomingEvent: jobRunnerProps.tenantIdentifierKeyInIncomingEvent,
      });

      this.eventManager.addTargetToEvent(
        this,
        jobRunnerProps.incomingEvent,
        jobOrchestrator.eventTarget
      );
    });
  }
}
