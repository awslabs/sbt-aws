/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Construct } from 'constructs';
import { ScriptJob } from './script-job';
import { IEventManager, addTemplateTag } from '../utils';

/**
 * Encapsulates the list of properties for a CoreApplicationPlane.
 */
export interface CoreApplicationPlaneProps {
  /**
   * The event manager instance. This is used to trigger scriptJobs.
   */
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
      this.eventManager.addTargetToEvent(this, {
        eventType: scriptJob.incomingEvent,
        target: scriptJob.eventTarget,
      });
    });
  }
}
