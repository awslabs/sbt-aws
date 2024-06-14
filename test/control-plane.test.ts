// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Annotations, Capture, Match, Template } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Construct } from 'constructs';
import { CognitoAuth, ControlPlane } from '../src/control-plane';
import { EventManager } from '../src/utils';

describe('No unsuppressed cdk-nag Warnings or Errors', () => {
  const app = new cdk.App();
  class ControlPlaneStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const systemAdminEmail = 'test@example.com';
      const eventManager = new EventManager(this, 'EventManager');
      const cognitoAuth = new CognitoAuth(this, 'CognitoAuth');

      new ControlPlane(this, 'ControlPlane', {
        systemAdminEmail: systemAdminEmail,
        auth: cognitoAuth,
        eventManager: eventManager,
      });
    }
  }

  const stack = new ControlPlaneStack(app, 'ControlPlaneStack');

  cdk.Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));

  it('should have no unsuppressed Warnings', () => {
    const warnings = Annotations.fromStack(stack).findWarning(
      '*',
      Match.stringLikeRegexp('AwsSolutions-.*')
    );
    expect(warnings).toHaveLength(0);
  });

  it('should have no unsuppressed Errors', () => {
    const errors = Annotations.fromStack(stack).findError(
      '*',
      Match.stringLikeRegexp('AwsSolutions-.*')
    );
    expect(errors).toHaveLength(0);
  });
});

const app = new cdk.App();
interface TestStackProps extends cdk.StackProps {
  systemAdminEmail: string;
  disableAPILogging?: boolean;
}
class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: TestStackProps) {
    super(scope, id, props);

    const eventManager = new EventManager(this, 'EventManager');
    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth');

    new ControlPlane(this, 'ControlPlane', {
      systemAdminEmail: props.systemAdminEmail,
      auth: cognitoAuth,
      eventManager: eventManager,
      disableAPILogging: props.disableAPILogging,
    });
  }
}

describe('ControlPlane Targets', () => {
  const controlPlaneTestStack = new TestStack(app, 'appPlaneStack', {
    systemAdminEmail: 'test@example.com',
  });
  const template = Template.fromStack(controlPlaneTestStack);

  it('should have at least 1 target for every Event Rule', () => {
    const targetsCapture = new Capture();
    template.allResourcesProperties('AWS::Events::Rule', {
      Targets: targetsCapture,
    });

    // check all 'captures' for Targets to make sure all resources
    // have exactly 1 target
    do {
      expect(targetsCapture.asArray()).toHaveLength(1);
    } while (targetsCapture.next());
  });
});
