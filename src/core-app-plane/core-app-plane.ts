// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Construct } from 'constructs';
import { ScriptJob } from './script-job';
import { IEventManager, addTemplateTag } from '../utils';

/**
 * Encapsulates the list of properties for a CoreApplicationPlane.
 */
export interface CoreApplicationPlaneProps {
  readonly eventManager: IEventManager;

  /**
   * The list of JobRunners
   */
  readonly scriptJobs?: ScriptJob[];
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
    this.eventManager = props.eventManager;

    props.scriptJobs?.forEach((scriptJob) => {
      this.eventManager.addTargetToEvent(this, scriptJob.incomingEvent, scriptJob.eventTarget);
    });
  }
}
