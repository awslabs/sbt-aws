// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { CfnResource, IAspect, RemovalPolicy } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

export class DestroyPolicySetter implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      node.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
  }
}
