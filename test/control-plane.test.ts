// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Annotations, Capture, Match, Template } from 'aws-cdk-lib/assertions';
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
      const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
        idpName: idpName,
        systemAdminRoleName: systemAdminRoleName,
        systemAdminEmail: systemAdminEmail,
      });

      new ControlPlane(this, 'ControlPlane', {
        auth: cognitoAuth,
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

    // for event bridge communication
    const idpName = 'COGNITO';
    const systemAdminRoleName = 'SystemAdmin';

    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
      idpName: idpName,
      systemAdminRoleName: systemAdminRoleName,
      systemAdminEmail: props.systemAdminEmail,
      // optional parameter possibly populated by another construct or an argument
      // controlPlaneCallbackURL: 'https://example.com',
    });

    new ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
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

describe('ControlPlane description', () => {
  it('should have a fixed template description, when the containing stack does not have description', () => {
    const stackWithoutDescription = new TestStack(app, 'stackWithoutDescription', {
      systemAdminEmail: 'test@example.com',
    });
    const actual = stackWithoutDescription.templateOptions.description;
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

describe('ControlPlane cloudwatch roles', () => {
  it('should create the cloudwatch IAM apigw push to cw role by default', () => {
    const stackWithLogging = new TestStack(new cdk.App(), 'stackWithLogging', {
      systemAdminEmail: 'test@example.com',
    });
    const template = Template.fromStack(stackWithLogging);
    template.hasResourceProperties(
      'AWS::IAM::Role',
      Match.objectLike({
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'apigateway.amazonaws.com',
              },
            },
          ],
          Version: '2012-10-17',
        },
        ManagedPolicyArns: [
          {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs',
              ],
            ],
          },
        ],
      })
    );
  });

  it('should not create the cloudwatch IAM publishing role if the disable logging flag is true', () => {
    const stackWithoutLogging = new TestStack(new cdk.App(), 'stackWithoutLogging', {
      systemAdminEmail: 'test@example.com',
      disableAPILogging: true,
    });
    const templateWithoutLogging = Template.fromStack(stackWithoutLogging);
    templateWithoutLogging.resourcePropertiesCountIs(
      'AWS::IAM::Role',
      {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'apigateway.amazonaws.com',
              },
            },
          ],
          Version: '2012-10-17',
        },
      },
      0
    );
  });
});
