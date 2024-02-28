// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { EventBus } from 'aws-cdk-lib/aws-events';
import { Construct } from 'constructs';

export class Messaging extends Construct {
  eventBus: EventBus;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.eventBus = new EventBus(this, 'SbtEventBus');
  }
}
