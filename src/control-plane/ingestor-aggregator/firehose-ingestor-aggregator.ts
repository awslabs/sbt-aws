// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as firehose from '@aws-cdk/aws-kinesisfirehose-alpha';
import * as destinations from '@aws-cdk/aws-kinesisfirehose-destinations-alpha';
import * as lambda_python from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IDataIngestorAggregator } from './ingestor-aggregator-interface';
import { addTemplateTag } from '../../utils';

/**
 * Encapsulates the list of properties for a FirehoseAggregator construct.
 */
export interface FirehoseAggregatorProps {
  /**
   * The name to use for the primary key column for the dynamoDB database.
   */
  readonly primaryKeyColumn: string;

  /**
   * The JMESPath to find the primary key value in the incoming data stream.
   */
  readonly primaryKeyPath: string;

  /**
   * The JMESPath to find the key value in the incoming data stream that will be aggregated.
   */
  readonly aggregateKeyPath: string;

  /**
   * The JMESPath to find the numeric value of key in the incoming data stream that will be aggregated.
   */
  readonly aggregateValuePath: string;

  /**
   * Flag to delete objects in the firehoseDestinationBucket when deleting the bucket.
   */
  readonly autoDeleteObjects?: boolean;
}

/**
 * Creates a Kinesis Firehose to accept high-volume data, which it then routes to an s3 bucket.
 * The s3 bucket triggers a lambda which processes the data and stores it in a DynamoDB table
 * containing the aggregated data.
 */
export class FirehoseAggregator extends Construct implements IDataIngestorAggregator {
  /**
   * The DynamoDB table containing the aggregated data.
   */
  public readonly dataRepository: dynamodb.ITable;

  /**
   * The Python Lambda function responsible for aggregating the raw data coming in
   * via the dataIngestor.
   */
  public readonly dataAggregator: lambda.IFunction;

  /**
   * The Firehose DeliveryStream ingestor responsible for accepting the incoming data.
   */
  public readonly dataIngestor: firehose.DeliveryStream;

  /**
   * The name of the dataIngestor. This is used for visibility.
   */
  public readonly dataIngestorName: string;

  constructor(scope: Construct, id: string, props: FirehoseAggregatorProps) {
    super(scope, id);
    addTemplateTag(this, 'FirehoseAggregator');

    const serviceName = 'FirehoseAggregator';

    const firehoseDestinationBucket = new s3.Bucket(this, 'FirehoseDestinationBucket', {
      enforceSSL: true,
      autoDeleteObjects: props.autoDeleteObjects,
      ...(props.autoDeleteObjects && { removalPolicy: cdk.RemovalPolicy.DESTROY }),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    NagSuppressions.addResourceSuppressions(
      firehoseDestinationBucket,
      [
        {
          id: 'AwsSolutions-S1',
          reason: 'Server access logs not required.',
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    this.dataIngestor = new firehose.DeliveryStream(this, 'Firehose', {
      encryption: firehose.StreamEncryption.AWS_OWNED,
      destinations: [new destinations.S3Bucket(firehoseDestinationBucket)],
    });

    this.dataIngestorName = this.dataIngestor.deliveryStreamName;

    NagSuppressions.addResourceSuppressions(
      this.dataIngestor,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'S3 object resource name(s) not known beforehand.',
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    this.dataRepository = new dynamodb.Table(this, 'Data', {
      partitionKey: { name: props.primaryKeyColumn, type: dynamodb.AttributeType.STRING },
      pointInTimeRecovery: true,
    });

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${
      cdk.Stack.of(this).region
    }:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`;

    this.dataAggregator = new lambda_python.PythonFunction(this, 'DataAggregatorLambda', {
      entry: path.join(__dirname, '../../../resources/functions/data-aggregator'),
      runtime: lambda.Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'handler',
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(30),
      environment: {
        SERVICE_NAME: serviceName,
        DATA_TABLE: this.dataRepository.tableName,
        PRIMARY_KEY_COLUMN: props.primaryKeyColumn,
        PRIMARY_KEY_PATH: props.primaryKeyPath,
        AGGREGATE_KEY_PATH: props.aggregateKeyPath,
        AGGREGATE_VALUE_PATH: props.aggregateValuePath,
      },
      logGroup: new cdk.aws_logs.LogGroup(this, 'DataAggregatorLambdaLogGroup', {
        retention: cdk.aws_logs.RetentionDays.FIVE_DAYS,
      }),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(this, 'LambdaPowerTools', lambdaPowerToolsLayerARN),
      ],
    });

    NagSuppressions.addResourceSuppressions(
      [this.dataAggregator.role!],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress usage of AWSLambdaBasicExecutionRole.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'This is Resource::* being used to output logs and x-ray traces and nothing else.',
          appliesTo: [
            'Resource::*',
            'Action::s3:GetBucket*',
            'Action::s3:GetObject*',
            'Action::s3:List*',
            `Resource::<${cdk.Stack.of(this).getLogicalId(
              firehoseDestinationBucket.node.defaultChild as s3.CfnBucket
            )}.Arn>/*`,
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    this.dataRepository.grantReadWriteData(this.dataAggregator);
    firehoseDestinationBucket.grantRead(this.dataAggregator);

    firehoseDestinationBucket.addObjectCreatedNotification(
      new s3n.LambdaDestination(this.dataAggregator)
    );

    NagSuppressions.addResourceSuppressions(
      [
        cdk.Stack.of(scope).node.findChild(
          // logicalId for cdk-managed resource:
          // https://github.com/aws/aws-cdk/blob/6a7a24afcc1ebebf71c267b890732a455e865cc8/packages/aws-cdk-lib/aws-s3/lib/notifications-resource/notifications-resource-handler.ts#L39
          'BucketNotificationsHandler050a0587b7544547bf325f094a3db834'
        ),
      ],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason:
            'Where required, the Control Plane API uses a custom authorizer. It does not use a cognito authorizer.',
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'Where required, the Control Plane API uses a custom authorizer. It does not use a cognito authorizer.',
        },
      ],
      true // applyToChildren = true, so that it applies to the APIGW role created by cdk in the controlPlaneAPI construct
    );
  }
}
