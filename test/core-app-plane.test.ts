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
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import { PolicyDocument, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { Construct, IConstruct } from 'constructs';
import { CoreApplicationPlane, ProvisioningScriptJob } from '../src/core-app-plane';
import { EventManager } from '../src/utils';

class DestroyPolicySetter implements cdk.IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof cdk.CfnResource) {
      node.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
  }
}

describe('No unsuppressed cdk-nag Warnings or Errors', () => {
  const app = new cdk.App();
  class CoreApplicationPlaneStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);
      const eventManager = new EventManager(this, 'EventManager', {
        controlPlaneEventSource: 'test.control.plane',
        applicationPlaneEventSource: 'test.app.plane',
      });
      const provisioningJobScript: ProvisioningScriptJob = new ProvisioningScriptJob(
        this,
        'provisioningJobScript',
        {
          permissions: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ['cloudformation:CreateStack'],
                resources: ['arn:aws:cloudformation:*:*:stack/MyStack/*'],
                effect: Effect.ALLOW,
              }),
            ],
          }),
          script: '',
          eventManager: eventManager,
        }
      );
      new CoreApplicationPlane(this, 'CoreApplicationPlane', {
        eventManager: eventManager,
        scriptJobs: [provisioningJobScript],
      });
    }
  }

  const stack = new CoreApplicationPlaneStack(app, 'ControlPlaneStack');

  cdk.Aspects.of(stack).add(new AwsSolutionsChecks({ verbose: true }));
  NagSuppressions.addStackSuppressions(stack, [
    {
      id: 'AwsSolutions-IAM5',
      reason: 'Suppress Resource::arn:aws:cloudformation:*:*:stack/MyStack/* used in test policy.',
      appliesTo: ['Resource::arn:aws:cloudformation:*:*:stack/MyStack/*'],
    },
  ]);

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

describe('CoreApplicationPlane', () => {
  test('check that environment variables are not required', () => {
    const app = new cdk.App();
    class CoreApplicationPlaneStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const eventManager = new EventManager(this, 'EventManager', {
          controlPlaneEventSource: 'test.control.plane',
          applicationPlaneEventSource: 'test.app.plane',
        });
        const provisioningJobScript: ProvisioningScriptJob = new ProvisioningScriptJob(
          this,
          'provisioningJobScript',
          {
            permissions: new PolicyDocument({
              statements: [
                new PolicyStatement({
                  actions: ['cloudformation:CreateStack'],
                  resources: ['*'],
                  effect: Effect.ALLOW,
                }),
              ],
            }),
            script: '',
            eventManager: eventManager,
          }
        );
        new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          scriptJobs: [provisioningJobScript],
        });
      }
    }

    const coreApplicationPlaneStack = new CoreApplicationPlaneStack(app, 'appPlaneStack');
    const template = Template.fromStack(coreApplicationPlaneStack);

    template.hasResourceProperties('AWS::CodeBuild::Project', {
      // check that codebuild has no environment variables defined when none are passed in
      Environment: Match.objectLike({
        EnvironmentVariables: Match.absent(),
      }),
    });

    cdk.Aspects.of(app).add(new AwsSolutionsChecks());
    app.synth();
  });

  test('check that environment variables are defined in code build project', () => {
    const app = new cdk.App();
    class CoreApplicationPlaneStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const eventManager = new EventManager(this, 'EventManager', {
          controlPlaneEventSource: 'test.control.plane',
          applicationPlaneEventSource: 'test.app.plane',
        });
        const provisioningJobScript: ProvisioningScriptJob = new ProvisioningScriptJob(
          this,
          'provisioningJobScript',
          {
            permissions: new PolicyDocument({
              statements: [
                new PolicyStatement({
                  actions: ['cloudformation:CreateStack'],
                  resources: ['*'],
                  effect: Effect.ALLOW,
                }),
              ],
            }),
            script: '',
            scriptEnvironmentVariables: {
              MY_TEST_ENV_VAR: 'test env var',
            },
            eventManager: eventManager,
          }
        );
        const coreApplicationPlane = new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          scriptJobs: [provisioningJobScript],
        });
        cdk.Aspects.of(coreApplicationPlane).add(new DestroyPolicySetter());
      }
    }

    const coreApplicationPlaneStack = new CoreApplicationPlaneStack(app, 'appPlaneStack');
    const template = Template.fromStack(coreApplicationPlaneStack);

    template.hasResourceProperties('AWS::CodeBuild::Project', {
      Environment: Match.objectLike({
        EnvironmentVariables: Match.anyValue(),
      }),
    });

    template.hasResourceProperties('AWS::CodeBuild::Project', {
      // check that codebuild has the MY_TEST_ENV_VAR environment variable defined
      Environment: {
        EnvironmentVariables: Match.arrayWith(
          expect.arrayContaining([
            expect.objectContaining({
              Name: 'MY_TEST_ENV_VAR',
              Type: 'PLAINTEXT',
              Value: 'test env var',
            }),
          ])
        ),
      },
    });

    cdk.Aspects.of(app).add(new AwsSolutionsChecks());
  });

  test('should create a new KMS key when encryptionKey is not provided', () => {
    const app = new cdk.App();
    class CoreApplicationPlaneStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const eventManager = new EventManager(this, 'EventManager', {
          controlPlaneEventSource: 'test.control.plane',
          applicationPlaneEventSource: 'test.app.plane',
        });
        const provisioningJobScript: ProvisioningScriptJob = new ProvisioningScriptJob(
          this,
          'provisioningJobScript',
          {
            permissions: new PolicyDocument({
              statements: [
                new PolicyStatement({
                  actions: ['cloudformation:CreateStack'],
                  resources: ['*'],
                  effect: Effect.ALLOW,
                }),
              ],
            }),
            script: '',
            eventManager: eventManager,
          }
        );
        new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          scriptJobs: [provisioningJobScript],
        });
      }
    }

    const coreApplicationPlaneStack = new CoreApplicationPlaneStack(app, 'appPlaneStack');
    const template = Template.fromStack(coreApplicationPlaneStack);

    // check that codebuild has the created key
    template.hasResourceProperties('AWS::CodeBuild::Project', {
      EncryptionKey: Match.anyValue(),
    });

    cdk.Aspects.of(app).add(new AwsSolutionsChecks());
    app.synth();
  });

  test.only('should use provided KMS key and not create a new one', () => {
    const app = new cdk.App();
    class CoreApplicationPlaneStack extends cdk.Stack {
      constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const eventManager = new EventManager(this, 'EventManager', {
          controlPlaneEventSource: 'test.control.plane',
          applicationPlaneEventSource: 'test.app.plane',
        });
        const myCustomKey = new kms.Key(this, 'CustomKey');

        const provisioningJobScript: ProvisioningScriptJob = new ProvisioningScriptJob(
          this,
          'provisioningJobScript',
          {
            permissions: new PolicyDocument({
              statements: [
                new PolicyStatement({
                  actions: ['cloudformation:CreateStack'],
                  resources: ['*'],
                  effect: Effect.ALLOW,
                }),
              ],
            }),
            script: '',
            eventManager: eventManager,
            projectProps: {
              encryptionKey: myCustomKey,
            },
          }
        );
        new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          scriptJobs: [provisioningJobScript],
        });
      }
    }

    const coreApplicationPlaneStack = new CoreApplicationPlaneStack(app, 'appPlaneStack');
    const template = Template.fromStack(coreApplicationPlaneStack);

    // check that no unwanted extra keys have been created
    template.resourceCountIs('AWS::KMS::Key', 1);
    // check that codebuild points to the arn of myCustomKey
    template.hasResourceProperties('AWS::CodeBuild::Project', {
      EncryptionKey: {
        'Fn::GetAtt': [Match.stringLikeRegexp('CustomKey.*'), 'Arn'],
      },
    });

    cdk.Aspects.of(app).add(new AwsSolutionsChecks());
    app.synth();
  });
});
