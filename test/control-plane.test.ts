// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Annotations, Match, Template, Capture } from 'aws-cdk-lib/assertions';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Construct } from 'constructs';
import { CognitoAuth, ControlPlane } from '../src/control-plane';

describe('No unsuppressed cdk-nag Warnings or Errors', () => {
  const app = new cdk.App();
  class ControlPlaneStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const systemAdminEmail = 'test@example.com';
      const idpName = 'COGNITO';
      const systemAdminRoleName = 'SystemAdmin';
      const applicationPlaneEventSource = 'testApplicationPlaneEventSource';
      const provisioningDetailType = 'testProvisioningDetailType';
      const controlPlaneEventSource = 'testControlPlaneEventSource';
      const onboardingDetailType = 'testOnboarding';
      const offboardingDetailType = 'testOffboarding';

      const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
        idpName: idpName,
        systemAdminRoleName: systemAdminRoleName,
        systemAdminEmail: systemAdminEmail,
      });

      new ControlPlane(this, 'ControlPlane', {
        auth: cognitoAuth,
        applicationPlaneEventSource: applicationPlaneEventSource,
        provisioningDetailType: provisioningDetailType,
        controlPlaneEventSource: controlPlaneEventSource,
        onboardingDetailType: onboardingDetailType,
        offboardingDetailType: offboardingDetailType,
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

describe('ControlPlane without Description', () => {
  const app = new cdk.App();
  interface TestStackProps extends cdk.StackProps {
    systemAdminEmail: string;
  }
  class TestStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: TestStackProps) {
      super(scope, id, props);

      // for event bridge communication
      const idpName = 'COGNITO';
      const systemAdminRoleName = 'SystemAdmin';
      const applicationPlaneEventSource = 'testApplicationPlaneEventSource';
      const provisioningDetailType = 'testProvisioningDetailType';
      const controlPlaneEventSource = 'testControlPlaneEventSource';
      const onboardingDetailType = 'testOnboarding';
      const offboardingDetailType = 'testOffboarding';

      const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
        idpName: idpName,
        systemAdminRoleName: systemAdminRoleName,
        systemAdminEmail: props.systemAdminEmail,
        // optional parameter possibly populated by another construct or an argument
        // controlPlaneCallbackURL: 'https://example.com',
      });

      new ControlPlane(this, 'ControlPlane', {
        auth: cognitoAuth,
        applicationPlaneEventSource: applicationPlaneEventSource,
        provisioningDetailType: provisioningDetailType,
        controlPlaneEventSource: controlPlaneEventSource,
        onboardingDetailType: onboardingDetailType,
        offboardingDetailType: offboardingDetailType,
      });
    }
  }

  const controlPlaneTestStack = new TestStack(app, 'appPlaneStack', {
    systemAdminEmail: 'test@example.com',
  });
  const template = Template.fromStack(controlPlaneTestStack);

  it('should have exactly 1 target for every Event Rule', () => {
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

  it('should have a fixed template description, when the containing stack does not have description', () => {
    const actual = controlPlaneTestStack.templateOptions.description;
    const expected = 'SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)';
    expect(actual).toStrictEqual(expected);
  });

  it('should have a concatenated template description, when the containing stack has an existing desc', () => {
    const stackWithDescription = new TestStack(app, 'stackWithDescription', {
      systemAdminEmail: 'test@example.com',
      description: 'ABC',
    });
    const actual = stackWithDescription.templateOptions.description;
    const expected = 'ABC - SaaS Builder Toolkit - CoreApplicationPlane (uksb-1tupboc57)';
    expect(expected).toStrictEqual(actual);
  });
});
