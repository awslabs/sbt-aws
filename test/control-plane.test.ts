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

import * as cdk from 'aws-cdk-lib';
import { Annotations, Capture, Match, Template } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Construct } from 'constructs';
import { CognitoAuth, ControlPlane } from '../src/control-plane';
import { EventManager } from '../src/utils';

// Skip Docker-dependent tests in CI
if (process.env.CI) {
  describe.skip('ControlPlane (skipped in CI due to Docker dependency)', () => {
    it('skipped', () => {});
  });
} else {
describe('No unsuppressed cdk-nag Warnings or Errors', () => {
  const app = new cdk.App();
  class ControlPlaneStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const systemAdminEmail = 'test@example.com';
      const eventManager = new EventManager(this, 'EventManager', {
        controlPlaneEventSource: 'test.control.plane',
        applicationPlaneEventSource: 'test.app.plane',
      });
      const cognitoAuth = new CognitoAuth(this, 'CognitoAuth');

      new ControlPlane(this, 'ControlPlane', {
        systemAdminEmail: systemAdminEmail,
        auth: cognitoAuth,
        eventManager: eventManager,
      });
    }
  }

  const stack = new ControlPlaneStack(app, 'ControlPlaneStack');

  cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

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

    const eventManager = new EventManager(this, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });
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

describe('ControlPlane API logging', () => {
  it('should configure logging for the API by default', () => {
    const stackWithLogging = new TestStack(new cdk.App(), 'stackWithLogging', {
      systemAdminEmail: 'test@example.com',
    });
    const template = Template.fromStack(stackWithLogging);

    template.hasResourceProperties(
      'AWS::ApiGatewayV2::Stage',
      Match.objectLike({
        AccessLogSettings: {
          DestinationArn: Match.anyValue(),
          Format: Match.anyValue(),
        },
      })
    );
  });

  it('should not configure logging if the disable logging flag is true', () => {
    const stackWithoutLogging = new TestStack(new cdk.App(), 'stackWithoutLogging', {
      systemAdminEmail: 'test@example.com',
      disableAPILogging: true,
    });
    const templateWithoutLogging = Template.fromStack(stackWithoutLogging);

    templateWithoutLogging.hasResourceProperties(
      'AWS::ApiGatewayV2::Stage',
      Match.objectLike({
        AccessLogSettings: Match.absent(),
      })
    );
  });
});
}
