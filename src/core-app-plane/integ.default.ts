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
import { ComputeType, LinuxArmLambdaBuildImage, ProjectProps } from 'aws-cdk-lib/aws-codebuild';
import { CfnRule, EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { Effect, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import * as sbt from '.';
import { DestroyPolicySetter } from '../cdk-aspect/destroy-policy-setter';
import { EventManager } from '../utils';

export interface IntegStackProps extends cdk.StackProps {
  eventBusArn?: string;
}

export class IntegStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: IntegStackProps) {
    super(scope, id, props);

    let eventBus;
    let eventManager;
    if (props?.eventBusArn) {
      eventBus = EventBus.fromEventBusArn(this, 'EventBus', props.eventBusArn);
      eventManager = new EventManager(this, 'EventManager', {
        eventBus: eventBus,
      });
    } else {
      eventManager = new EventManager(this, 'EventManager');
    }

    const projectProps: ProjectProps = {
      environment: {
        environmentVariables: {
          VARIABLE_NAME: {
            value: 'someValue',
          },
        },
        buildImage: LinuxArmLambdaBuildImage.AMAZON_LINUX_2023_NODE_20,
        computeType: ComputeType.LAMBDA_2GB,
      },
    };

    const provisioningScriptJobProps: sbt.TenantLifecycleScriptJobProps = {
      permissions: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: [
              'cloudformation:CreateStack',
              'cloudformation:DescribeStacks',
              's3:CreateBucket',
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
          }),
        ],
      }),
      script: `
echo "starting..."

# note that this template.yaml is being created here, but
# it could just as easily be pulled in from an S3 bucket.
cat > template.yaml << EndOfMessage
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "MyBucket": {
      "Type": "AWS::S3::Bucket"
    }
  },
  "Outputs": {
    "S3Bucket": {
      "Value": {
        "Ref": "MyBucket"
      }
    }
  }
}
EndOfMessage

echo "tenantId: $tenantId"
echo "tier: $tier"

aws cloudformation create-stack --stack-name "tenantTemplateStack-\${tenantId}"  --template-body "file://template.yaml"
aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"
export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket

export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')

echo $tenantConfig
export registrationStatus="created"

echo "done!"
`,
      environmentStringVariablesFromIncomingEvent: ['tenantId', 'tier', 'tenantName', 'email'],
      environmentJSONVariablesFromIncomingEvent: ['prices'],
      environmentVariablesToOutgoingEvent: {
        tenantData: [
          'tenantS3Bucket',
          'tenantConfig',
          'prices', // added so we don't lose it for targets beyond provisioning (ex. billing)
          'tenantName', // added so we don't lose it for targets beyond provisioning (ex. billing)
          'email', // added so we don't lose it for targets beyond provisioning (ex. billing)
        ],
        tenantRegistrationData: ['registrationStatus'],
      },
      scriptEnvironmentVariables: {
        TEST: 'test',
      },
      eventManager: eventManager,
      projectProps: projectProps,
    };

    const deprovisioningScriptJobProps: sbt.TenantLifecycleScriptJobProps = {
      permissions: new PolicyDocument({
        statements: [
          new PolicyStatement({
            actions: [
              'cloudformation:DeleteStack',
              'cloudformation:DescribeStacks',
              's3:DeleteBucket',
            ],
            resources: ['*'],
            effect: Effect.ALLOW,
          }),
        ],
      }),
      script: `
echo "starting..."

echo "tenantId: $tenantId"

aws cloudformation delete-stack --stack-name "tenantTemplateStack-\${tenantId}"
aws cloudformation wait stack-delete-complete --stack-name "tenantTemplateStack-\${tenantId}"
export status="deleted stack: tenantTemplateStack-\${tenantId}"
export registrationStatus="deleted"
echo "done!"
`,
      environmentStringVariablesFromIncomingEvent: ['tenantId'],
      environmentVariablesToOutgoingEvent: {
        tenantRegistrationData: ['registrationStatus'],
      },
      eventManager: eventManager,
      projectProps: projectProps,
    };

    const provisioningJobScript: sbt.ProvisioningScriptJob = new sbt.ProvisioningScriptJob(
      this,
      'provisioningJobScript',
      provisioningScriptJobProps
    );
    const deprovisioningJobScript: sbt.DeprovisioningScriptJob = new sbt.DeprovisioningScriptJob(
      this,
      'deprovisioningJobScript',
      deprovisioningScriptJobProps
    );

    new sbt.CoreApplicationPlane(this, 'CoreApplicationPlane', {
      eventManager: eventManager,
      scriptJobs: [provisioningJobScript, deprovisioningJobScript],
    });

    const eventBusWatcherRule = new Rule(this, 'EventBusWatcherRule', {
      eventBus: eventBus,
      eventPattern: {
        source: [eventManager.controlPlaneEventSource, eventManager.applicationPlaneEventSource],
      },
    });

    const eventBusWatcherLogGroup = new LogGroup(this, 'EventBusWatcherLogGroup', {
      logGroupName: `/aws/events/EventBusWatcher-${this.node.addr}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: RetentionDays.ONE_WEEK,
    });

    // use escape-hatch instead of native addTarget functionality to avoid
    // unpredictable resource names that emit cdk-nag errors
    // https://github.com/aws/aws-cdk/issues/17002#issuecomment-1144066244
    const cfnRule = eventBusWatcherRule.node.defaultChild as CfnRule;
    cfnRule.targets = [
      {
        arn: eventBusWatcherLogGroup.logGroupArn,
        id: this.node.addr,
      },
    ];
  }
}

if (!process.env.CDK_PARAM_EVENT_BUS_ARN) {
  console.log(
    'No CDK_PARAM_EVENT_BUS_ARN found. Stack will create separate event bus for testing.'
  );
} else {
  console.log('Stack will use event bus passed in for testing.');
}

const app = new cdk.App();
const integStack = new IntegStack(app, process.env.CDK_PARAM_STACK_ID ?? 'CoreAppPlane-integ', {
  eventBusArn: process.env.CDK_PARAM_EVENT_BUS_ARN,
});

NagSuppressions.addResourceSuppressionsByPath(
  integStack,
  `/${integStack.artifactId}/provisioningJobScript/codeBuildProvisionProjectRole/Resource`,
  [
    {
      id: 'AwsSolutions-IAM5',
      reason: 'Suppress Resource::* used for testing.',
      appliesTo: ['Resource::*'],
    },
  ]
);

NagSuppressions.addResourceSuppressionsByPath(
  integStack,
  `/${integStack.artifactId}/deprovisioningJobScript/codeBuildProvisionProjectRole/Resource`,
  [
    {
      id: 'AwsSolutions-IAM5',
      reason: 'Suppress Resource::* used for testing.',
      appliesTo: ['Resource::*'],
    },
  ]
);

cdk.Aspects.of(integStack).add(new DestroyPolicySetter());
cdk.Aspects.of(integStack).add(new AwsSolutionsChecks({ verbose: true }));
