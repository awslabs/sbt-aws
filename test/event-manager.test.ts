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
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';
import { IRuleTarget, RuleTargetConfig, IRule, RuleTargetInput } from 'aws-cdk-lib/aws-events';
import { Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { AwsSolutionsChecks } from 'cdk-nag';
import { Construct } from 'constructs';
import { CognitoAuth, ControlPlane } from '../src/control-plane';
import { CoreApplicationPlane, ProvisioningScriptJob } from '../src/core-app-plane';
import { EventDefinition, EventManager } from '../src/utils';

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
      return eventRule.EventPattern['detail-type'][0] === 'sbt_aws_onboardingRequest';
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
        eventRule.EventPattern['detail-type'][0] === 'sbt_aws_onboardingRequest'
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

    const eventManager = new EventManager(controlPlaneStack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });

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
    const eventManager = new EventManager(eventManagerStack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });

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

  describe('standard events in event-manager', () => {
    const app = new cdk.App();
    const eventManagerStack = new cdk.Stack(app, 'EventManagerStack');
    const eventManager = new EventManager(eventManagerStack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });

    // Now we check that standard events are properly initialized with prefix
    it('should have standard events initialized with sbt_aws_ prefix', () => {
      expect(eventManager.events.onboardingRequest).toBeDefined();
      expect(eventManager.events.onboardingSuccess).toBeDefined();
      expect(eventManager.events.onboardingFailure).toBeDefined();

      // Check a specific event in detail
      const onboardingRequestEvent = eventManager.events.onboardingRequest;
      expect(onboardingRequestEvent.detailType).toBe('sbt_aws_onboardingRequest');
      expect(onboardingRequestEvent.source).toBe('test.control.plane');
    });
  });

  describe('creating custom events', () => {
    const app = new cdk.App();
    const eventManagerStack = new cdk.Stack(app, 'EventManagerStack');
    const eventManager = new EventManager(eventManagerStack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });

    it('should allow creating custom events', () => {
      // Create a custom control plane event
      const customControlEvent = eventManager.createControlPlaneEvent('customControl');
      expect(customControlEvent.detailType).toBe('customControl');
      expect(customControlEvent.source).toBe('test.control.plane');

      // Create a custom application plane event
      const customAppEvent = eventManager.createApplicationPlaneEvent('customApp');
      expect(customAppEvent.detailType).toBe('customApp');
      expect(customAppEvent.source).toBe('test.app.plane');

      // Create a fully custom event
      const fullyCustomEvent = eventManager.createCustomEvent('customEvent', 'custom.source');
      expect(fullyCustomEvent.detailType).toBe('customEvent');
      expect(fullyCustomEvent.source).toBe('custom.source');
    });
  });

  describe('EventDefinition class', () => {
    it('should create event definition with specified detailType and source', () => {
      const eventDef = new EventDefinition('testEvent', 'test.source');
      expect(eventDef.detailType).toBe('testEvent');
      expect(eventDef.source).toBe('test.source');
    });
  });

  // The getEventDefinition method has been removed as part of the changes to support events
  // with the same detailType but different sources

  describe('duplicate event creation', () => {
    const app = new cdk.App();
    const eventManagerStack = new cdk.Stack(app, 'EventManagerStack');
    const eventManager = new EventManager(eventManagerStack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
    });

    it('should throw error when creating duplicate event', () => {
      // Attempt to create an event with an existing name
      expect(() => {
        eventManager.createControlPlaneEvent('sbt_aws_onboardingRequest');
      }).toThrow(
        "Event with detail type 'sbt_aws_onboardingRequest' and source 'test.control.plane' already exists"
      );
    });
  });

  describe('adding targets to events with EventDefinition', () => {
    // Create a new app and stack for each test to avoid the multiple synthesis issue
    it('should add target to event using EventDefinition', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack1');

      const eventManager = new EventManager(stack, 'EventManager', {
        controlPlaneEventSource: 'test.control.plane',
        applicationPlaneEventSource: 'test.app.plane',
      });

      // Create a test target implementation
      class TestTarget implements IRuleTarget {
        bind(_rule: IRule, _id?: string): RuleTargetConfig {
          return {
            arn: 'arn:aws:test:us-east-1:123456789012:target/test',
            input: RuleTargetInput.fromObject({ id: 'TestTarget' }),
          };
        }
      }

      const testScope = new Construct(stack, 'TestScope');
      const testTarget = new TestTarget();

      // Add target to event using EventDefinition
      const eventDef = eventManager.events.onboardingRequest;
      eventManager.addTargetToEvent(testScope, {
        eventDefinition: eventDef,
        target: testTarget,
      });

      // Verify the rule was created with correct configuration
      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::Events::Rule', {
        EventPattern: {
          source: ['test.control.plane'],
          'detail-type': ['sbt_aws_onboardingRequest'],
        },
        Targets: Match.arrayWith([
          Match.objectLike({
            Id: Match.anyValue(),
            Arn: 'arn:aws:test:us-east-1:123456789012:target/test',
            Input: '{"id":"TestTarget"}',
          }),
        ]),
      });
    });

    it('should reuse rule for multiple targets with the same event definition', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'TestStack2');

      const eventManager = new EventManager(stack, 'EventManager', {
        controlPlaneEventSource: 'test.control.plane',
        applicationPlaneEventSource: 'test.app.plane',
      });

      // Create test targets implementation
      class TestTarget implements IRuleTarget {
        private readonly targetId: string;

        constructor(targetId: string) {
          this.targetId = targetId;
        }

        bind(_rule: IRule, _id?: string): RuleTargetConfig {
          return {
            arn: 'arn:aws:test:us-east-1:123456789012:target/test',
            input: RuleTargetInput.fromObject({ id: this.targetId }),
          };
        }
      }

      const testScope = new Construct(stack, 'TestScope');
      const eventDef = eventManager.events.onboardingSuccess;

      // Add first target
      eventManager.addTargetToEvent(testScope, {
        eventDefinition: eventDef,
        target: new TestTarget('Target1'),
      });

      // Add second target
      eventManager.addTargetToEvent(testScope, {
        eventDefinition: eventDef,
        target: new TestTarget('Target2'),
      });

      // Verify only one rule is created with both targets
      const template = Template.fromStack(stack);
      const rules = template.findResources('AWS::Events::Rule', {
        Properties: {
          EventPattern: {
            'detail-type': ['sbt_aws_onboardingSuccess'],
          },
        },
      });

      expect(Object.keys(rules).length).toBe(1);

      // Get the targets from the rule
      const ruleKey = Object.keys(rules)[0];
      const rule = rules[ruleKey];

      // The rule should have two targets
      expect(rule.Properties.Targets.length).toBe(2);
    });
  });

  describe('source overrides with EventDefinition', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'TestStack');

    const sourceOverrides = {
      onboardingRequest: 'custom.source.override',
    };

    const eventManager = new EventManager(stack, 'EventManager', {
      controlPlaneEventSource: 'test.control.plane',
      applicationPlaneEventSource: 'test.app.plane',
      sourceOverrides: sourceOverrides,
    });

    it('should apply source overrides correctly', () => {
      // This event has a source override
      const overriddenEvent = eventManager.events.onboardingRequest;
      expect(overriddenEvent.detailType).toBe('sbt_aws_onboardingRequest');
      expect(overriddenEvent.source).toBe('custom.source.override');

      // This event has no source override
      const normalEvent = eventManager.events.onboardingSuccess;
      expect(normalEvent.detailType).toBe('sbt_aws_onboardingSuccess');
      expect(normalEvent.source).toBe('test.app.plane');
    });
  });
});
