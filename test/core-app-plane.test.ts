// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import { PolicyDocument } from 'aws-cdk-lib/aws-iam';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { Construct, IConstruct } from 'constructs';
import { CoreApplicationPlane } from '../src/core-app-plane';
import { DetailType, EventManager } from '../src/utils';

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
      const eventManager = new EventManager(this, 'EventManager');
      new CoreApplicationPlane(this, 'CoreApplicationPlane', {
        eventManager: eventManager,
        jobRunnerPropsList: [
          {
            name: 'provisioning',
            outgoingEvent: DetailType.PROVISION_SUCCESS,
            incomingEvent: DetailType.ONBOARDING_REQUEST,
            permissions: PolicyDocument.fromJson(
              JSON.parse(`{
  "Version":"2012-10-17",
  "Statement":[
      {
        "Action":[
            "cloudformation:CreateStack"
        ],
        "Resource":"arn:aws:cloudformation:*:*:stack/MyStack/*",
        "Effect":"Allow"
      }
  ]
}
`)
            ),
            script: '',
          },
        ],
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
        const eventManager = new EventManager(this, 'EventManager');
        new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          jobRunnerPropsList: [
            {
              name: 'provisioning',
              outgoingEvent: DetailType.PROVISION_SUCCESS,
              incomingEvent: DetailType.ONBOARDING_REQUEST,
              permissions: PolicyDocument.fromJson(
                JSON.parse(`{
  "Version":"2012-10-17",
  "Statement":[
      {
        "Action":[
            "cloudformation:CreateStack"
        ],
        "Resource":"*",
        "Effect":"Allow"
      }
  ]
}
`)
              ),
              script: '',
            },
          ],
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
        const eventManager = new EventManager(this, 'EventManager');
        const coreApplicationPlane = new CoreApplicationPlane(this, 'CoreApplicationPlane', {
          eventManager: eventManager,
          jobRunnerPropsList: [
            {
              name: 'provisioning',
              outgoingEvent: DetailType.PROVISION_SUCCESS,
              incomingEvent: DetailType.ONBOARDING_REQUEST,
              permissions: PolicyDocument.fromJson(
                JSON.parse(`{
  "Version":"2012-10-17",
  "Statement":[
      {
        "Action":[
            "cloudformation:CreateStack"
        ],
        "Resource":"*",
        "Effect":"Allow"
      }
  ]
}
`)
              ),
              script: '',
              scriptEnvironmentVariables: {
                MY_TEST_ENV_VAR: 'test env var',
              },
            },
          ],
        });
        cdk.Aspects.of(coreApplicationPlane).add(new DestroyPolicySetter());
      }
    }

    const coreApplicationPlaneStack = new CoreApplicationPlaneStack(app, 'appPlaneStack');
    const template = Template.fromStack(coreApplicationPlaneStack);

    template.hasResourceProperties('AWS::CodeBuild::Project', {
      // check that codebuild has the MY_TEST_ENV_VAR environment variable defined
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
});
