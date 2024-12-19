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
 * Represents the different kinds of environment variables that can
 * be emitted as part of a script job.
 */
export interface EnvironmentVariablesToOutgoingEventProps {
  /**
   * The data from the script job that pertains to the tenant.
   */
  readonly tenantData?: string[];

  /**
   * The data from the script job that pertains to the registration of the tenant.
   */
  readonly tenantRegistrationData?: string[];
}

/**
 * Represents the DetailTypes that can be emitted
 * as part of the outgoing event.
 * @readonly
 */
export interface OutgoingEventDetailTypes {
  /**
   * The detail type for a successful event.
   */
  readonly success: DetailType;

  /**
   * The detail type for a failed event.
   */
  readonly failure: DetailType;
}

/**
 * Encapsulates the list of properties for a ScriptJob.
 */
export interface ScriptJobProps {
  /**
   * The key where the job identifier is to be extracted from in
   * the incoming event.
   *
   * This will be used as the key that will be populated with
   * the job identifier in the outgoing event.
   *
   * Ex: if jobIdentifierKey == 'myKey' then
   * the incoming event should look something like this:
   *   {'myKey': '123', ....}
   * and the outgoing event will look something like this:
   *   {'myKey': '123', 'jobOutput': { ... }}
   */
  readonly jobIdentifierKey: string;

  /**
   * In the case of failure, this is the object that will
   * be included in the outgoing event `jobOutput` field.
   *
   * Ex: If the job fails, the outgoing event will look like this:
   *   {$jobIdentifierKey: 'XXX', 'jobOutput': $jobFailureStatus}
   */
  readonly jobFailureStatus: {
    [key: string]: string;
  };

  /**
   * The IAM permission document for the ScriptJob.
   */
  readonly permissions: iam.PolicyDocument;

  /**
   * The bash script to run as part of the ScriptJob.
   */
  readonly script: string;

  /**
   * The Source to use when executing the ScriptJob.
   *
   * This can be used to pre-populate the ScriptJob environment
   * with files from S3, as an example.
   */
  readonly source?: codebuild.Source;

  /**
   * The incoming event DetailType that triggers this job.
   */
  readonly incomingEvent: DetailType;

  /**
   * The outgoing event DetailTypes that are emitted upon job success or failure.
   */
  readonly outgoingEvent: OutgoingEventDetailTypes;

  /**
   * The bash script to run after the main script has completed.
   */
  readonly postScript?: string;

  /**
   * The environment variables to import into the ScriptJob from event details field.
   * This argument consists of the names of only string type variables. Ex. 'test'
   */
  readonly environmentStringVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to import into the ScriptJob from event details field.
   * This argument consists of the names of only JSON-formatted string type variables.
   * Ex. '{"test": 2}'
   */
  readonly environmentJSONVariablesFromIncomingEvent?: string[];

  /**
   * The environment variables to export into the outgoing event once the ScriptJob has finished.
   */
  readonly environmentVariablesToOutgoingEvent?: EnvironmentVariablesToOutgoingEventProps;

  /**
   * The variables to pass into the codebuild ScriptJob.
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
 * Provides a ScriptJob to execute arbitrary bash code.
 */
export class ScriptJob extends Construct {
  /**
   * The codebuildProject used to implement this ScriptJob.
   * @attribute
   */
  public readonly codebuildProject: codebuild.Project;

  /**
   * The StateMachine used to implement this ScriptJob orchestration.
   * @attribute
   */
  public readonly provisioningStateMachine: stepfunctions.StateMachine;

  /**
   * The eventTarget to use when triggering this ScriptJob.
   * @attribute
   */
  public readonly eventTarget: IRuleTarget;

  /**
   * The environment variables to export into the outgoing event once the ScriptJob has finished.
   * @attribute
   */
  public readonly environmentVariablesToOutgoingEvent?: EnvironmentVariablesToOutgoingEventProps;

  /**
   * The incoming event DetailType that triggers this job.
   */
  readonly incomingEvent: DetailType;

  constructor(scope: Construct, id: string, props: ScriptJobProps) {
    super(scope, id);
    addTemplateTag(this, 'ScriptJob');

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

  private createCodeBuildProject(props: ScriptJobProps): codebuild.Project {
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

    var codeBuildProjectExportedVariables: string[] = [];
    if (props.environmentVariablesToOutgoingEvent?.tenantData) {
      codeBuildProjectExportedVariables.push(
        ...props.environmentVariablesToOutgoingEvent.tenantData
      );
    }

    if (props.environmentVariablesToOutgoingEvent?.tenantRegistrationData) {
      codeBuildProjectExportedVariables.push(
        ...props.environmentVariablesToOutgoingEvent.tenantRegistrationData
      );
    }

    const codebuildProject = new codebuild.Project(this, `codebuildProject`, {
      source: props.source,
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
          'git-credential-helper': 'yes',
          ...(codeBuildProjectExportedVariables.length > 0 && {
            'exported-variables': codeBuildProjectExportedVariables,
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
    props: ScriptJobProps,
    jobRunnerCodeBuildProject: codebuild.Project,
    eventBus: IEventBus
  ): stepfunctions.StateMachine {
    const successEventSource = props.eventManager.supportedEvents[props.outgoingEvent.success];
    const failureEventSource = props.eventManager.supportedEvents[props.outgoingEvent.failure];
    const detailType = props.outgoingEvent;

    const environmentVariablesOverride: {
      [name: string]: codebuild.BuildEnvironmentVariable;
    } = {};

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

    const startCodeBuild = new tasks.CodeBuildStartBuild(this, 'startCodeBuild', {
      project: jobRunnerCodeBuildProject,
      integrationPattern: stepfunctions.IntegrationPattern.RUN_JOB,
      environmentVariablesOverride: environmentVariablesOverride,
      resultPath: '$.startCodeBuild',
    });

    const exportedVarObj: { [key: string]: any } = {
      [props.jobIdentifierKey]: stepfunctions.JsonPath.stringAt(
        `$.detail.${props.jobIdentifierKey}`
      ),
      jobOutput: {
        tenantData: {},
        tenantRegistrationData: {},
      },
    };

    if (props.environmentVariablesToOutgoingEvent?.tenantData) {
      props.environmentVariablesToOutgoingEvent?.tenantData.forEach((exportedVar: string) => {
        exportedVarObj.jobOutput.tenantData[exportedVar] = stepfunctions.JsonPath.arrayGetItem(
          stepfunctions.JsonPath.listAt(
            `$.startCodeBuild.Build.ExportedEnvironmentVariables[?(@.Name==${exportedVar})].Value`
          ),
          0
        );
      });
    }

    if (props.environmentVariablesToOutgoingEvent?.tenantRegistrationData) {
      props.environmentVariablesToOutgoingEvent?.tenantRegistrationData.forEach(
        (exportedVar: string) => {
          exportedVarObj.jobOutput.tenantRegistrationData[exportedVar] =
            stepfunctions.JsonPath.arrayGetItem(
              stepfunctions.JsonPath.listAt(
                `$.startCodeBuild.Build.ExportedEnvironmentVariables[?(@.Name==${exportedVar})].Value`
              ),
              0
            );
        }
      );
    }

    const notifySuccessEventBridgeTask = new tasks.EventBridgePutEvents(
      this,
      'notifySuccessEventBridgeTask',
      {
        entries: [
          {
            detailType: detailType.success,
            detail: stepfunctions.TaskInput.fromObject(exportedVarObj),
            source: successEventSource,
            eventBus: eventBus,
          },
        ],
        resultPath: '$.notifySuccessEventBridgeTask',
      }
    );

    const notifyFailureEventBridgeTask = new tasks.EventBridgePutEvents(
      this,
      'notifyFailureEventBridgeTask',
      {
        entries: [
          {
            detailType: detailType.failure,
            detail: stepfunctions.TaskInput.fromObject({
              [props.jobIdentifierKey]: stepfunctions.JsonPath.stringAt(
                `$.detail.${props.jobIdentifierKey}`
              ),
              jobOutput: props.jobFailureStatus,
            }),
            source: failureEventSource,
            eventBus: eventBus,
          },
        ],
        resultPath: '$.notifyFailureEventBridgeTask',
      }
    );

    startCodeBuild.addCatch(notifyFailureEventBridgeTask, {
      errors: ['States.ALL'],
      resultPath: '$.startCodeBuild.Catch',
    });

    const definitionBody = stepfunctions.DefinitionBody.fromChainable(
      startCodeBuild.next(notifySuccessEventBridgeTask)
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
