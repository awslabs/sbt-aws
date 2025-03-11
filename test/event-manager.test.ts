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
import { Capture, Template } from 'aws-cdk-lib/assertions';
import { Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsSolutionsChecks } from 'cdk-nag';
import { CognitoAuth, ControlPlane } from '../src/control-plane';
import { CoreApplicationPlane, ProvisioningScriptJob } from '../src/core-app-plane';
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

  // because there are rules in this stack, check if
  // the existing rules are for the onboarding-request
  // detail type which is defined in a separate stack
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
    const firstProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'firstProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: controlPlane.eventManager,
      }
    );
    const secondProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'secondProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: controlPlane.eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: controlPlane.eventManager,
      scriptJobs: [firstProvisioningScriptJob, secondProvisioningScriptJob],
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
    const firstProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'firstProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    const secondProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'secondProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: eventManager,
      scriptJobs: [firstProvisioningScriptJob, secondProvisioningScriptJob],
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
    const firstProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'firstProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    const secondProvisioningScriptJob: ProvisioningScriptJob = new ProvisioningScriptJob(
      coreAppPlaneStack,
      'secondProvisioningScriptJob',
      {
        permissions: samplePolicyDocument,
        script: '',
        eventManager: eventManager,
      }
    );
    new CoreApplicationPlane(coreAppPlaneStack, 'CoreApplicationPlane', {
      eventManager: eventManager,
      scriptJobs: [firstProvisioningScriptJob, secondProvisioningScriptJob],
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
    // (ex. "source: eventTypes.map((eventType) => this.supportedEvents[eventType]),")
    it('should have values for all DetailType enum entries', () => {
      Object.values(DetailType).forEach((detailTypeValues) => {
        expect(eventManager.supportedEvents[detailTypeValues]).toBeDefined();
      });
    });
  });
});
