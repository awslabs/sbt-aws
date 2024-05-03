// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CodebuildRunner } from './codebuild-runner';
import { JobOrchestrator as JobOrchestrator } from './job-orchestrator';
import { DetailType, IEventManager, SUPPORTED_EVENTS } from '../utils';

/**
 * Encapsulates the list of properties for a CoreApplicationPlaneJobRunner.
 */
export interface JobRunnerOptions {
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

export interface JobRunnerProps extends JobRunnerOptions {
  readonly eventManager: IEventManager;
}

export class JobRunner extends Construct {
  constructor(scope: Construct, id: string, props: JobRunnerProps) {
    super(scope, id);
    let envVarsFromIncomingEvent: string[] = [];
    if (props.environmentStringVariablesFromIncomingEvent) {
      envVarsFromIncomingEvent.concat(props.environmentStringVariablesFromIncomingEvent);
    }
    if (props.environmentJSONVariablesFromIncomingEvent) {
      envVarsFromIncomingEvent.concat(props.environmentJSONVariablesFromIncomingEvent);
    }
    const job = new CodebuildRunner(this, props.name, {
      name: props.name,
      permissions: props.permissions,
      script: props.script,
      postScript: props.postScript,
      environmentVariablesFromIncomingEvent: envVarsFromIncomingEvent,
      environmentVariablesToOutgoingEvent: props.environmentVariablesToOutgoingEvent,
      scriptEnvironmentVariables: props.scriptEnvironmentVariables,
    });

    const orchestrator = new JobOrchestrator(this, `${props.name}-orchestrator`, {
      targetEventBus: props.eventManager.eventBus,
      detailType: props.outgoingEvent,
      eventSource: SUPPORTED_EVENTS[props.outgoingEvent],
      environmentVariablesToOutgoingEvent: props.environmentVariablesToOutgoingEvent,
      environmentStringVariablesFromIncomingEvent:
        props.environmentStringVariablesFromIncomingEvent,
      environmentJSONVariablesFromIncomingEvent: props.environmentJSONVariablesFromIncomingEvent,
      codeBuildRunner: job,
    });

    props.eventManager.addTargetToEvent(props.incomingEvent, orchestrator.eventTarget);
  }
}
