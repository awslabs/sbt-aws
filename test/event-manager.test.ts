// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsSolutionsChecks } from 'cdk-nag';
import { CognitoAuth, ControlPlane } from '../src/control-plane';
import { CoreApplicationPlane, BashJobRunner } from '../src/core-app-plane';
import { DetailType, EventManager } from '../src/utils';

function testForDuplicateRulesInCoreAppPlaneStack(stack: cdk.Stack) {
  const template = Template.fromStack(stack);
  const eventRuleCapture = new Capture();

  template.allResourcesProperties('AWS::Events::Rule', eventRuleCapture);
  const eventRules: { [key: string]: any } = [];
  do {
    eventRules.push(eventRuleCapture.asObject());
  } while (eventRuleCapture.next());

  const onboardingRequestEventRules = eventRules.filter(
    (eventRule: { EventPattern: { 'detail-type': string[] } }) => {
      return eventRule.EventPattern['detail-type'][0] === DetailType.ONBOARDING_REQUEST;
    }
  );

  it('should not have duplicate rules for the same event detail type', () => {
    expect(onboardingRequestEventRules).toHaveLength(1);
  });

  it('should reuse the same rules for targets triggered by the same event detail type', () => {
    expect(onboardingRequestEventRules[0].Targets).toHaveLength(2);
  });
}

function testForRulesInOtherStack(stack: cdk.Stack) {
  const template = Template.fromStack(stack);
  const eventRuleCapture = new Capture();

  const rules = template.findResources('AWS::Events::Rule', eventRuleCapture);
  if (Object.keys(rules).length === 0) {
    it('should not have rules for triggering runners in stacks that do not define them', () => {
      expect(true).toBe(true);
    });
    // return as there are no rules in this stack
    return;
  }

  // template.allResourcesProperties('AWS::Events::Rule', eventRuleCapture);
  const eventRules: { [key: string]: any } = [];
  do {
    eventRules.push(eventRuleCapture.asObject());
  } while (eventRuleCapture.next());

  const onboardingRequestEventRules = eventRules.filter(
    (eventRule: { EventPattern?: { 'detail-type': string[] } }) => {
      return (
        eventRule.EventPattern &&
        eventRule.EventPattern['detail-type'][0] === DetailType.ONBOARDING_REQUEST
      );
    }
  );

  it('should not have rules for triggering runners in stacks that do not define them', () => {
    expect(onboardingRequestEventRules).toHaveLength(0);
  });
}

const samplePolicyDocument = new PolicyDocument({
  statements: [
    new PolicyStatement({
      actions: ['cloudformation:CreateStack'],
      resources: ['arn:aws:cloudformation:*:*:stack/MyStack/ExampleStack'],
      effect: Effect.ALLOW,
    }),
  ],
});

describe('EventManager', () => {
  describe('using default event-manager created by control plane', () => {
    const app = new cdk.App();
    const controlPlaneStack = new cdk.Stack(app, 'ControlPlaneStack');

    const cognitoAuth = new CognitoAuth(controlPlaneStack, 'CognitoAuth');

    const controlPlane = new ControlPlane(controlPlaneStack, 'ControlPlane', {
      systemAdminEmail: 'test@example.com',
      auth: cognitoAuth,
    });

    const coreAppPlaneStack = new cdk.Stack(app, 'CoreApplicationPlaneStack');
    const firstProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'firstProvisioningJobRunner',
      {
        name: 'provisioning-1',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: controlPlane.eventManager,
      }
    );
    const secondProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'secondProvisioningJobRunner',
      {
        name: 'provisioning-2',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: controlPlane.eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: controlPlane.eventManager,
      jobRunnersList: [firstProvisioningJobRunner, secondProvisioningJobRunner],
    });

    cdk.Aspects.of(controlPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));
    cdk.Aspects.of(coreAppPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));

    it('should synth without errors', () => {
      const assembly = app.synth();
      expect(assembly).toBeTruthy();
    });

    testForDuplicateRulesInCoreAppPlaneStack(coreAppPlaneStack);
    testForRulesInOtherStack(controlPlaneStack);
  });

  describe('using event-manager created outside of control plane', () => {
    const app = new cdk.App();
    const controlPlaneStack = new cdk.Stack(app, 'ControlPlaneStack');

    const eventManager = new EventManager(controlPlaneStack, 'EventManager');

    const cognitoAuth = new CognitoAuth(controlPlaneStack, 'CognitoAuth');

    new ControlPlane(controlPlaneStack, 'ControlPlane', {
      systemAdminEmail: 'test@example.com',
      auth: cognitoAuth,
      eventManager: eventManager,
    });

    const coreAppPlaneStack = new cdk.Stack(app, 'CoreApplicationPlaneStack');
    const firstProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'firstProvisioningJobRunner',
      {
        name: 'provisioning-1',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    const secondProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'secondProvisioningJobRunner',
      {
        name: 'provisioning-2',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: eventManager,
      jobRunnersList: [firstProvisioningJobRunner, secondProvisioningJobRunner],
    });

    cdk.Aspects.of(controlPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));
    cdk.Aspects.of(coreAppPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));

    it('should synth without errors', () => {
      const assembly = app.synth();
      expect(assembly).toBeTruthy();
    });

    testForDuplicateRulesInCoreAppPlaneStack(coreAppPlaneStack);
    testForRulesInOtherStack(controlPlaneStack);
  });

  describe('using an event-manager created in a separate stack', () => {
    const app = new cdk.App();
    const eventManagerStack = new cdk.Stack(app, 'EventManagerStack');
    const eventManager = new EventManager(eventManagerStack, 'EventManager');

    const controlPlaneStack = new cdk.Stack(app, 'ControlPlaneStack');
    const cognitoAuth = new CognitoAuth(controlPlaneStack, 'CognitoAuth');

    new ControlPlane(controlPlaneStack, 'ControlPlane', {
      systemAdminEmail: 'test@example.com',
      auth: cognitoAuth,
      eventManager: eventManager,
    });

    const coreAppPlaneStack = new cdk.Stack(app, 'CoreApplicationPlaneStack');
    const firstProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'firstProvisioningJobRunner',
      {
        name: 'provisioning-1',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    const secondProvisioningJobRunner: BashJobRunner = new BashJobRunner(
      coreAppPlaneStack,
      'secondProvisioningJobRunner',
      {
        name: 'provisioning-2',
        outgoingEvent: DetailType.PROVISION_SUCCESS,
        incomingEvent: DetailType.ONBOARDING_REQUEST,
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: eventManager,
      jobRunnersList: [firstProvisioningJobRunner, secondProvisioningJobRunner],
    });
    cdk.Aspects.of(controlPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));
    cdk.Aspects.of(coreAppPlaneStack).add(new AwsSolutionsChecks({ verbose: true }));

    it('should synth without errors', () => {
      const assembly = app.synth();
      expect(assembly).toBeTruthy();
    });

    testForDuplicateRulesInCoreAppPlaneStack(coreAppPlaneStack);
    testForRulesInOtherStack(controlPlaneStack);
    testForRulesInOtherStack(eventManagerStack);
  });

  describe('supportedEvents in event-manager', () => {
    const app = new cdk.App();
    const eventManagerStack = new cdk.Stack(app, 'EventManagerStack');
    const eventManager = new EventManager(eventManagerStack, 'EventManager');

    // This ensures that when we try and use supportedEvents to create a rule,
    // and key-in using a DetailType, a value exists for the source,
    // which is used in the getOrCreateRule(...) function to create
    // a new event-manager rule.
    // (ex. "source: [this.supportedEvents[eventType]]")
    it('should have values for all DetailType enum entries', () => {
      Object.values(DetailType).forEach((detailTypeValues) => {
        expect(eventManager.supportedEvents[detailTypeValues]).toBeDefined();
      });
    });
  });
});
