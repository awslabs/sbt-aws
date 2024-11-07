// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

export interface EntitlementLogicProps {
  readonly assetBucket: s3.IBucket;
  readonly subscribersTable: dynamodb.Table;
  readonly registerNewMarketplaceCustomer: lambda.Function;
  readonly entitlementSNSTopic: string;
}

export class EntitlementLogic extends Construct {
  constructor(scope: Construct, id: string, props: EntitlementLogicProps) {
    super(scope, id);
    addTemplateTag(this, 'EntitlementLogic');

    const entitlementSQSQueueEncryptionKey = new cdk.aws_kms.Key(
      this,
      'EntitlementSQSQueueEncryptionKey',
      {
        enableKeyRotation: true,
      }
    );

    const entitlementQueue = new sqs.Queue(this, 'EntitlementSQSQueue', {
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: entitlementSQSQueueEncryptionKey,
      enforceSSL: true,
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: new sqs.Queue(this, 'EntitlementSQSQueueDLQ', {
          enforceSSL: true,
          retentionPeriod: cdk.Duration.seconds(3000),
        }),
      },
    });

    const entitlementSNSTopic = sns.Topic.fromTopicArn(
      this,
      'EntitlementSNSTopic',
      props.entitlementSNSTopic
    );
    entitlementSNSTopic.addSubscription(new subscriptions.SqsSubscription(entitlementQueue));

    const entitlementSQSHandler = new lambda.Function(this, 'EntitlementSQSHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'entitlement-sqs.handler',
      code: lambda.Code.fromBucket(
        props.assetBucket,
        'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
      ),
      environment: {
        NewSubscribersTableName: props.subscribersTable.tableName,
      },
      events: [new SqsEventSource(entitlementQueue, { batchSize: 1 })],
    });

    NagSuppressions.addResourceSuppressions(
      [entitlementSQSHandler],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress usage of AWSLambdaBasicExecutionRole.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
        {
          id: 'AwsSolutions-L1',
          reason: 'NODEJS 18 is the version used in the official quickstart CFN template.',
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Index name(s) not known beforehand.',
          appliesTo: [
            `Resource::<MarketplaceAWSMarketplaceMeteringRecords3B0F9D94.Arn>/index/*`,
            `Action::kms:ReEncrypt*`,
            `Action::kms:GenerateDataKey*`,
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Used as part of IAM policy that allows calling aws-marketplace:GetEntitlements',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    entitlementQueue.grantSendMessages(entitlementSQSHandler);
    props.subscribersTable.grantWriteData(entitlementSQSHandler);
    entitlementSQSHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['aws-marketplace:GetEntitlements'],
        resources: ['*'],
      })
    );

    props.registerNewMarketplaceCustomer.addEnvironment(
      'ENTITLEMENT_QUEUE_URL',
      entitlementQueue.queueUrl
    );
    entitlementSQSQueueEncryptionKey.grantEncrypt(props.registerNewMarketplaceCustomer);

    NagSuppressions.addResourceSuppressions(
      [props.registerNewMarketplaceCustomer],
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Multiple permissions required.',
          appliesTo: [`Action::kms:ReEncrypt*`, `Action::kms:GenerateDataKey*`],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'Used as part of the policy that allows aws-marketplace:GetEntitlements, aws-marketplace:ResolveCustomer, and ses:SendEmail',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
    entitlementSQSQueueEncryptionKey.grantEncryptDecrypt(entitlementSQSHandler);
    entitlementQueue.grantSendMessages(props.registerNewMarketplaceCustomer);
  }
}
