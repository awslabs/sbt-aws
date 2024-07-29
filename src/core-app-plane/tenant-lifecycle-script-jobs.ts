// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ScriptJob, ScriptJobProps } from './script-job';
import { DetailType, IEventManager } from '../utils';

/**
 * Encapsulates the list of properties for a ScriptJobs that
 * handle lifecycle management for tenants.
 */
export interface TenantLifecycleScriptJobProps {
  /**
   * The IAM permission document for the ScriptJob.
   */
  readonly permissions: iam.PolicyDocument;

  /**
   * The bash script to run as part of the ScriptJob.
   */
  readonly script: string;

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
  readonly environmentVariablesToOutgoingEvent?: string[];

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
 * Provides a ProvisioningScriptJob to execute arbitrary bash code.
 * This is a simple wrapper around ScriptJob that reduces some of the parameters
 * that need to be configured.
 */
export class ProvisioningScriptJob extends ScriptJob {
  constructor(scope: Construct, id: string, props: TenantLifecycleScriptJobProps) {
    const scriptJobProps: ScriptJobProps = {
      ...props,
      jobIdentifierKey: 'tenantId',
      jobFailureStatus: {
        tenantStatus: 'Failed to provision tenant.',
      },
      incomingEvent: DetailType.ONBOARDING_REQUEST,
      outgoingEvent: {
        success: DetailType.PROVISION_SUCCESS,
        failure: DetailType.PROVISION_FAILURE,
      },
    };
    super(scope, id, scriptJobProps);
  }
}

/**
 * Provides a DeprovisioningScriptJob to execute arbitrary bash code.
 * This is a simple wrapper around ScriptJob that reduces some of the parameters
 * that need to be configured.
 */
export class DeprovisioningScriptJob extends ScriptJob {
  constructor(scope: Construct, id: string, props: TenantLifecycleScriptJobProps) {
    const scriptJobProps: ScriptJobProps = {
      ...props,
      jobIdentifierKey: 'tenantId',
      jobFailureStatus: {
        tenantStatus: 'Failed to deprovision tenant.',
      },
      incomingEvent: DetailType.OFFBOARDING_REQUEST,
      outgoingEvent: {
        success: DetailType.DEPROVISION_SUCCESS,
        failure: DetailType.DEPROVISION_FAILURE,
      },
    };
    super(scope, id, scriptJobProps);
  }
}
