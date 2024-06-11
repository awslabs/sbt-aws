// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

export interface SubscriptionLogicProps {
  readonly productCode: string;
  readonly assetBucket: s3.IBucket;
}

export class SubscriptionLogic extends Construct {
  constructor(scope: Construct, id: string, props: SubscriptionLogicProps) {
    super(scope, id);
    addTemplateTag(this, 'SubscriptionLogic');

    const meteringRecordsTable = new dynamodb.Table(this, 'AWSMarketplaceMeteringRecords', {
      partitionKey: { name: 'customerIdentifier', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'create_timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
    });

    meteringRecordsTable.addGlobalSecondaryIndex({
      indexName: 'PendingMeteringRecordsIndex',
      partitionKey: { name: 'metering_pending', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const sqsMeteringRecordsEncryptionKey = new cdk.aws_kms.Key(
      this,
      'SQSMeteringRecordsEncryptionKey',
      { enableKeyRotation: true }
    );

    const meteringRecordsQueue = new sqs.Queue(this, 'SQSMeteringRecords', {
      encryptionMasterKey: sqsMeteringRecordsEncryptionKey,
      contentBasedDeduplication: true,
      fifo: true,
      retentionPeriod: cdk.Duration.seconds(3000),
      enforceSSL: true,
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: new sqs.Queue(this, 'SQSMeteringRecordsDLQ', {
          enforceSSL: true,
          contentBasedDeduplication: true,
          fifo: true,
          retentionPeriod: cdk.Duration.seconds(3000),
        }),
      },
    });

    const meteringSQSHandler = new lambda.Function(this, 'MeteringSQSHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'metering-sqs.handler',
      code: lambda.Code.fromBucket(
        props.assetBucket,
        'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
      ),
      environment: {
        ProductCode: props.productCode,
        AWSMarketplaceMeteringRecordsTableName: meteringRecordsTable.tableName,
      },
      events: [
        new SqsEventSource(meteringRecordsQueue, {
          batchSize: 1,
        }),
      ],
    });

    sqsMeteringRecordsEncryptionKey.grantDecrypt(meteringSQSHandler);

    NagSuppressions.addResourceSuppressions(
      [meteringSQSHandler],
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
            `Resource::<${cdk.Stack.of(this).getLogicalId(meteringRecordsTable.node.defaultChild as dynamodb.CfnTable)}.Arn>/index/*`,
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Used as part of the policy that allows aws-marketplace:BatchMeterUsage.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    meteringRecordsTable.grantWriteData(meteringSQSHandler);
    meteringSQSHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['aws-marketplace:BatchMeterUsage'],
        resources: ['*'],
      })
    );

    const hourlyMeteringFunction = new lambda.Function(this, 'Hourly', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'metering-hourly-job.job',
      code: lambda.Code.fromBucket(
        props.assetBucket,
        'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
      ),
      environment: {
        SQSMeteringRecordsUrl: meteringRecordsQueue.queueUrl,
        AWSMarketplaceMeteringRecordsTableName: meteringRecordsTable.tableName,
      },
    });

    meteringRecordsTable.grantReadData(hourlyMeteringFunction);
    meteringRecordsQueue.grantSendMessages(hourlyMeteringFunction);
    sqsMeteringRecordsEncryptionKey.grantEncrypt(hourlyMeteringFunction);

    NagSuppressions.addResourceSuppressions(
      [hourlyMeteringFunction],
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
            `Resource::<${cdk.Stack.of(this).getLogicalId(meteringRecordsTable.node.defaultChild as dynamodb.CfnTable)}.Arn>/index/*`,
            `Action::kms:ReEncrypt*`,
            `Action::kms:GenerateDataKey*`,
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'TBD: This is Resource::* being used to output logs and x-ray traces and nothing else.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    const meteringRule = new events.Rule(this, 'MeteringSchedule', {
      schedule: events.Schedule.rate(cdk.Duration.hours(1)),
      enabled: true,
    });

    meteringRule.addTarget(new targets.LambdaFunction(hourlyMeteringFunction));
  }
}
