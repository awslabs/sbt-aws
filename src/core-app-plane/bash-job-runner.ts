// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import { IRuleTarget, EventBus, IEventBus } from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag, DetailType, IEventManager } from '../utils';

/**
 * Encapsulates the list of properties for a BashJobRunner.
 */
export interface BashJobRunnerProps {
  /**
   * The key where the tenant identifier is to be extracted from in
   * the incoming event.
   * @default 'tenantId'
   */
  readonly tenantIdentifierKeyInIncomingEvent?: string;

  /**
   * The IAM permission document for the BashJobRunner.
   */
  readonly permissions: iam.PolicyDocument;

  /**
   * The bash script to run as part of the BashJobRunner.
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
   * The environment variables to import into the BashJobRunner from event details field.
   * This argument consists of the names of only string type variables. Ex. 'test'
   */
  readonly environmentStringVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to import into the BashJobRunner from event details field.
   * This argument consists of the names of only JSON-formatted string type variables.
   * Ex. '{"test": 2}'
   */
  readonly environmentJSONVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to export into the outgoing event once the BashJobRunner has finished.
   */
  readonly environmentVariablesToOutgoingEvent?: string[];

  /**
   * The variables to pass into the codebuild BashJobRunner.
   */
  readonly scriptEnvironmentVariables?: {
    [key: string]: string;
  };

  /**
   * The EventManager instance that allows connecting to events flowing between
   * the Control Plane and other components.
   */

  readonly eventManager: IEventManager;
}

/**
 * Provides a BashJobRunner to execute arbitrary bash code.
 */
export class BashJobRunner extends Construct {
  /**
   * The codebuildProject used to implement this BashJobRunner.
   * @attribute
   */
  public readonly codebuildProject: codebuild.Project;

  /**
   * The StateMachine used to implement this BashJobRunner orchestration.
   * @attribute
   */
  public readonly provisioningStateMachine: stepfunctions.StateMachine;

  /**
   * The eventTarget to use when triggering this BashJobRunner.
   * @attribute
   */
  public readonly eventTarget: IRuleTarget;

  /**
   * The environment variables to export into the outgoing event once the BashJobRunner has finished.
   * @attribute
   */
  public readonly environmentVariablesToOutgoingEvent?: string[];

  /**
   * The incoming event DetailType that triggers this job.
   */
  readonly incomingEvent: DetailType;

  constructor(scope: Construct, id: string, props: BashJobRunnerProps) {
    super(scope, id);
    addTemplateTag(this, 'BashJobRunner');

    const eventBus = EventBus.fromEventBusArn(this, 'EventBus', props.eventManager.busArn);
    this.environmentVariablesToOutgoingEvent = props.environmentVariablesToOutgoingEvent;
    this.incomingEvent = props.incomingEvent;

    this.codebuildProject = this.createCodeBuildProject(props);

    this.provisioningStateMachine = this.createProvisioningStateMachine(
      props,
      this.codebuildProject,
      eventBus
    );

    eventBus.grantPutEventsTo(this.provisioningStateMachine);

    this.eventTarget = new targets.SfnStateMachine(this.provisioningStateMachine);
  }

  private createCodeBuildProject(props: BashJobRunnerProps): codebuild.Project {
    const environmentVariables: {
      [key: string]: codebuild.BuildEnvironmentVariable;
    } = {};

    if (props.scriptEnvironmentVariables) {
      for (const key in props.scriptEnvironmentVariables) {
        environmentVariables[key] = {
          value: props.scriptEnvironmentVariables[key],
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        };
      }
    }

    const codeBuildProjectEncryptionKey = new kms.Key(this, `codeBuildProjectEncryptionKey`, {
      enableKeyRotation: true,
    });

    const codebuildProject = new codebuild.Project(this, `codebuildProject`, {
      encryptionKey: codeBuildProjectEncryptionKey,
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
        privileged: true,
        environmentVariables: environmentVariables,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        env: {
          shell: 'bash',
          ...(props.environmentVariablesToOutgoingEvent && {
            'exported-variables': props.environmentVariablesToOutgoingEvent,
          }),
        },
        phases: {
          build: {
            commands: props.script,
          },
          post_build: {
            ...(props.postScript && { commands: props.postScript }),
          },
        },
      }),
    });

    NagSuppressions.addResourceSuppressions(codebuildProject, [
      {
        id: 'AwsSolutions-CB3',
        reason: 'Privileged mode grants access to docker daemon.',
      },
    ]);

    NagSuppressions.addResourceSuppressions(
      codebuildProject,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress errors generated by updates to cdk-managed CodeBuild Project role.',
          appliesTo: [
            'Action::kms:GenerateDataKey*',
            'Action::kms:ReEncrypt*',
            {
              regex: 'Resource::arn:aws:codebuild:(.*):(.*):report-group/(.*)$/g',
            },
            {
              regex: 'Resource::arn:aws:logs:(.*):(.*):log-group:/aws/codebuild/(.*):(.*)$/g',
            },
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to the IAM resources created for the codebuild project.
    );

    codebuildProject.role?.addManagedPolicy(
      new iam.ManagedPolicy(this, `codeBuildProvisionProjectRole`, {
        document: props.permissions,
      })
    );

    return codebuildProject;
  }

  private createProvisioningStateMachine(
    props: BashJobRunnerProps,
    jobRunnerCodeBuildProject: codebuild.Project,
    eventBus: IEventBus
  ): stepfunctions.StateMachine {
    const eventSource = props.eventManager.supportedEvents[props.outgoingEvent];
    const detailType = props.outgoingEvent;

    const environmentVariablesOverride: {
      [name: string]: codebuild.BuildEnvironmentVariable;
    } = {};

    const tenantIdentifierKeyInIncomingEvent =
      props.tenantIdentifierKeyInIncomingEvent ?? 'tenantId';

    props.environmentStringVariablesFromIncomingEvent?.forEach((importedVar: string) => {
      environmentVariablesOverride[importedVar] = {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: stepfunctions.JsonPath.stringAt(`$.detail.${importedVar}`),
      };
    });

    props.environmentJSONVariablesFromIncomingEvent?.forEach((importedVar: string) => {
      environmentVariablesOverride[importedVar] = {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: stepfunctions.JsonPath.jsonToString(
          stepfunctions.JsonPath.objectAt(`$.detail.${importedVar}`)
        ),
      };
    });

    const stateMachineLogGroup = new LogGroup(this, 'stateMachineLogGroup', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: RetentionDays.THREE_DAYS,
      logGroupName: `/aws/vendedlogs/states/${this.node.id}-${this.node.addr}`,
    });

    const startProvisioningCodeBuild = new tasks.CodeBuildStartBuild(
      this,
      'startProvisioningCodeBuild',
      {
        project: jobRunnerCodeBuildProject,
        integrationPattern: stepfunctions.IntegrationPattern.RUN_JOB,
        environmentVariablesOverride: environmentVariablesOverride,
        resultPath: '$.startProvisioningCodeBuild',
      }
    );

    const exportedVarObj: { [key: string]: any } = {
      tenantId: stepfunctions.JsonPath.stringAt(`$.detail.${tenantIdentifierKeyInIncomingEvent}`),
      tenantOutput: {},
    };
    props.environmentVariablesToOutgoingEvent?.forEach((exportedVar: string) => {
      exportedVarObj.tenantOutput[exportedVar] = stepfunctions.JsonPath.arrayGetItem(
        stepfunctions.JsonPath.listAt(
          `$.startProvisioningCodeBuild.Build.ExportedEnvironmentVariables[?(@.Name==${exportedVar})].Value`
        ),
        0
      );
    });

    const notifyEventBridgeTask = new tasks.EventBridgePutEvents(this, 'notifyEventBridgeTask', {
      entries: [
        {
          detailType: detailType,
          detail: stepfunctions.TaskInput.fromObject(exportedVarObj),
          source: eventSource,
          eventBus: eventBus,
        },
      ],
      resultPath: '$.notifyEventBridgeTask',
    });

    const definitionBody = stepfunctions.DefinitionBody.fromChainable(
      startProvisioningCodeBuild.next(notifyEventBridgeTask)
    );

    const provisioningStateMachine = new stepfunctions.StateMachine(
      this,
      'provisioningStateMachine',
      {
        definitionBody: definitionBody,
        timeout: cdk.Duration.hours(1),
        logs: {
          destination: stateMachineLogGroup,
          level: stepfunctions.LogLevel.ALL,
        },
        tracingEnabled: true,
      }
    );

    NagSuppressions.addResourceSuppressions(
      provisioningStateMachine,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Suppress Resource::* created by cdk-managed StepFunction role.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to the IAM resources created for the step function.
    );

    return provisioningStateMachine;
  }
}
