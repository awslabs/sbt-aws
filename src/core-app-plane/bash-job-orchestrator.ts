// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as events from 'aws-cdk-lib/aws-events';
import { IRuleTarget } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { BashJobRunner } from './bash-job-runner';

/**
 * Encapsulates the list of properties for a BashJobOrchestrator.
 */
export interface BashJobOrchestratorProps extends cdk.StackProps {
  /**
   * The event bus to publish the outgoing event to.
   */
  readonly targetEventBus: events.IEventBus;

  /**
   * The detail type to use when publishing event bridge events.
   */
  readonly detailType: string;

  /**
   * The event source to use when publishing event bridge events.
   */
  readonly eventSource: string;

  /**
   * Environment variables to import into the bash job from event details field.
   */
  readonly environmentStringVariablesFromIncomingEvent?: string[];
  readonly environmentJSONVariablesFromIncomingEvent?: string[];

  /**
   * Environment variables to export into the outgoing event once the bash job has finished.
   */
  readonly environmentVariablesToOutgoingEvent?: string[];

  /**
   * The BashJobRunner to execute as part of this BashJobOrchestrator.
   */
  readonly bashJobRunner: BashJobRunner;
}

/**
 * Provides a BashJobOrchestrator to execute a BashJobRunner.
 */
export class BashJobOrchestrator extends Construct {
  /**
   * The eventTarget to use when triggering this BashJobOrchestrator.
   * @attribute
   */
  public readonly eventTarget: IRuleTarget;

  /**
   * The StateMachine used to implement this BashJobOrchestrator.
   * @attribute
   */
  public readonly provisioningStateMachine: sfn.StateMachine;

  constructor(scope: Construct, id: string, props: BashJobOrchestratorProps) {
    super(scope, id);

    const eventSource = props.eventSource;
    const detailType = props.detailType;
    const environmentVariablesOverride: {
      [name: string]: codebuild.BuildEnvironmentVariable;
    } = {};

    props.environmentStringVariablesFromIncomingEvent?.forEach((importedVar: string) => {
      environmentVariablesOverride[importedVar] = {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: sfn.JsonPath.stringAt(`$.detail.${importedVar}`),
      };
    });

    props.environmentJSONVariablesFromIncomingEvent?.forEach((importedVar: string) => {
      environmentVariablesOverride[importedVar] = {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: sfn.JsonPath.jsonToString(sfn.JsonPath.objectAt(`$.detail.${importedVar}`)),
      };
    });

    const stateMachineLogGroup = new logs.LogGroup(this, 'stateMachineLogGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.THREE_DAYS,
      logGroupName: `/aws/vendedlogs/states/${this.node.id}-${this.node.addr}`,
    });

    const startProvisioningCodeBuild = new tasks.CodeBuildStartBuild(
      this,
      'startProvisioningCodeBuild',
      {
        project: props.bashJobRunner.codebuildProject,
        integrationPattern: sfn.IntegrationPattern.RUN_JOB,
        environmentVariablesOverride: environmentVariablesOverride,
        resultPath: '$.startProvisioningCodeBuild',
      }
    );

    const exportedVarObj: { [key: string]: any } = {
      tenantId: sfn.JsonPath.stringAt(`$.detail.tenantId`),
      tenantOutput: {},
    };
    props.environmentVariablesToOutgoingEvent?.forEach((exportedVar: string) => {
      exportedVarObj.tenantOutput[exportedVar] = sfn.JsonPath.arrayGetItem(
        sfn.JsonPath.listAt(
          `$.startProvisioningCodeBuild.Build.ExportedEnvironmentVariables[?(@.Name==${exportedVar})].Value`
        ),
        0
      );
    });

    const notifyEventBridgeTask = new tasks.EventBridgePutEvents(this, 'notifyEventBridgeTask', {
      entries: [
        {
          detailType: detailType,
          detail: sfn.TaskInput.fromObject(exportedVarObj),
          source: eventSource,
          eventBus: props.targetEventBus,
        },
      ],
      resultPath: '$.notifyEventBridgeTask',
    });

    const definitionBody = sfn.DefinitionBody.fromChainable(
      startProvisioningCodeBuild.next(notifyEventBridgeTask)
    );

    this.provisioningStateMachine = new sfn.StateMachine(this, 'provisioningStateMachine', {
      definitionBody: definitionBody,
      timeout: cdk.Duration.hours(1),
      logs: {
        destination: stateMachineLogGroup,
        level: sfn.LogLevel.ALL,
      },
      tracingEnabled: true,
    });

    NagSuppressions.addResourceSuppressions(
      this.provisioningStateMachine,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress Resource::* created by cdk-managed StepFunction role.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to the IAM resources created for the step function.
    );

    props.targetEventBus.grantPutEventsTo(this.provisioningStateMachine);

    this.eventTarget = new targets.SfnStateMachine(this.provisioningStateMachine);
  }
}
