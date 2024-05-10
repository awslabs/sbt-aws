// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource, SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { EntitlementLogic } from './entitlement-logic';
import { RegistrationWebPage } from './registration-web-page';
import { SubscriptionLogic } from './subscription-logic';
import { generateAWSManagedRuleSet } from '../../utils';

export interface MarketplaceProps {
  readonly artifactBucketName?: string;
  readonly newSubscribersTableName: string;
  readonly awsMarketplaceMeteringRecordsTableName: string;
  readonly typeOfSaaSListing: string;
  readonly productCode: string;
  readonly marketplaceTechAdminEmail: string;
  readonly marketplaceSellerEmail?: string;
  readonly entitlementSNSTopic: string;
  readonly subscriptionSNSTopic: string;
  readonly createRegistrationWebPage: boolean;
  readonly disableAPILogging?: boolean;
}

export class Marketplace extends Construct {
  constructor(scope: Construct, id: string, props: MarketplaceProps) {
    super(scope, id);

    const quickstartBucket = s3.Bucket.fromBucketName(
      this,
      'CodeBucket',
      props.artifactBucketName ?? 'aws-quickstart'
    );

    const createEntitlementLogic =
      props.typeOfSaaSListing === 'contracts_with_subscription' ||
      props.typeOfSaaSListing === 'contracts';

    const createSubscriptionLogic =
      props.typeOfSaaSListing === 'contracts_with_subscription' ||
      props.typeOfSaaSListing === 'subscriptions';

    // DynamoDB Tables
    const subscribersTable = new dynamodb.Table(this, 'AWSMarketplaceSubscribers', {
      partitionKey: { name: 'customerIdentifier', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
      // tableName: props.newSubscribersTableName, // todo: test if this is required
    });

    if (createSubscriptionLogic) {
      new SubscriptionLogic(this, 'SubscriptionLogic', {
        productCode: props.productCode,
        assetBucket: quickstartBucket,
      });
    }

    // SQS Queues and SNS Topics
    const supportTopicMasterKey = new cdk.aws_kms.Key(this, 'SupportTopicMasterKey', {
      enableKeyRotation: true,
    });
    const supportTopic = new sns.Topic(this, 'SupportSNSTopic', {
      masterKey: supportTopicMasterKey,
    });

    supportTopic.addSubscription(
      new subscriptions.EmailSubscription(props.marketplaceTechAdminEmail)
    );

    // Lambda Functions
    const registerNewMarketplaceCustomer = new lambda.Function(
      this,
      'RegisterNewMarketplaceCustomer',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'register-new-subscriber.registerNewSubscriber',
        code: lambda.Code.fromBucket(
          quickstartBucket,
          'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
        ),
        environment: {
          NewSubscribersTableName: subscribersTable.tableName,
          EntitlementQueueUrl: '',
        },
      }
    );

    NagSuppressions.addResourceSuppressions(
      [registerNewMarketplaceCustomer],
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
          appliesTo: [`Resource::<MarketplaceAWSMarketplaceMeteringRecords3B0F9D94.Arn>/index/*`],
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'TBD: FIX! This is Resource::* being used to output logs and x-ray traces and nothing else.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
    let options: any = {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    };

    if (props.disableAPILogging) {
      options.cloudWatchRole = false;
      NagSuppressions.addStackSuppressions(cdk.Stack.of(this), [
        {
          id: 'AwsSolutions-APIG1',
          reason: 'Customer has explicitly opted out of logging',
        },
      ]);
    } else {
      const registerCustomerAPILogGroup = new LogGroup(this, 'RegisterCustomerAPILogGroup', {
        retention: RetentionDays.ONE_WEEK,
      });
      options.cloudWatchRole = true;
      options.deployOptions = {
        accessLogDestination: new apigateway.LogGroupLogDestination(registerCustomerAPILogGroup),
        methodOptions: {
          '/*/*': {
            dataTraceEnabled: true,
            loggingLevel: apigateway.MethodLoggingLevel.ERROR,
          },
        },
      };
    }

    const registerCustomerAPI = new apigateway.RestApi(this, 'RegisterCustomerAPI', options);
    registerCustomerAPI.addRequestValidator('request-validator', {
      requestValidatorName: 'register-customer-validator',
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    const subscriberResource = registerCustomerAPI.root.addResource('subscriber');
    subscriberResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(registerNewMarketplaceCustomer)
    );

    NagSuppressions.addResourceSuppressions(
      [this],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Role used to simplify pushing logs to CloudWatch.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to the APIGW role created by cdk
    );

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${registerCustomerAPI.root}/OPTIONS/Resource`,
        `${subscriberResource}/OPTIONS/Resource`,
        `${subscriberResource}/POST/Resource`,
      ],
      [
        {
          id: 'AwsSolutions-APIG4',
          reason: 'Authorization not needed for OPTION method.',
        },
        {
          id: 'AwsSolutions-COG4',
          reason: 'Cognito Authorization not needed for OPTION method.',
        },
      ]
    );

    const cfnWAF = new cdk.aws_wafv2.CfnWebACL(this, 'WAF', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'WAF-RegisterCustomerAPI',
      },
      rules: [
        // generateAWSManagedRuleSet('AWSManagedRulesBotControlRuleSet', 0), // enable to block curl requests
        generateAWSManagedRuleSet('AWSManagedRulesKnownBadInputsRuleSet', 1),
        generateAWSManagedRuleSet('AWSManagedRulesCommonRuleSet', 2),
        generateAWSManagedRuleSet('AWSManagedRulesAnonymousIpList', 3),
        generateAWSManagedRuleSet('AWSManagedRulesAmazonIpReputationList', 4),
        generateAWSManagedRuleSet('AWSManagedRulesAdminProtectionRuleSet', 5),
        generateAWSManagedRuleSet('AWSManagedRulesSQLiRuleSet', 6),
      ],
    });

    new cdk.aws_wafv2.CfnWebACLAssociation(this, 'WAFAssociation', {
      webAclArn: cfnWAF.attrArn,
      resourceArn: registerCustomerAPI.deploymentStage.stageArn,
    });

    new cdk.CfnOutput(this, 'APIUrl', {
      value: registerCustomerAPI.url,
      description: 'API gateway URL to replace baseUrl value in web/script.js',
    });

    if (props.createRegistrationWebPage) {
      new RegistrationWebPage(this, 'RegistrationWebPage', {
        assetBucket: quickstartBucket,
        baseUrl: registerCustomerAPI.url,
      });
    }

    if (props.marketplaceSellerEmail) {
      registerNewMarketplaceCustomer.addEnvironment(
        'MarketplaceSellerEmail',
        props.marketplaceSellerEmail
      );
    }

    subscribersTable.grantWriteData(registerNewMarketplaceCustomer);
    registerNewMarketplaceCustomer.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['aws-marketplace:ResolveCustomer'],
        resources: ['*'],
      })
    );

    registerNewMarketplaceCustomer.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail'],
        resources: ['*'],
      })
    );

    if (createEntitlementLogic) {
      new EntitlementLogic(this, 'EntitlementLogic', {
        assetBucket: quickstartBucket,
        subscribersTable: subscribersTable,
        registerNewMarketplaceCustomer: registerNewMarketplaceCustomer,
        entitlementSNSTopic: props.entitlementSNSTopic,
      });
    }

    const subscriptionSQSQueueEncryptionKey = new cdk.aws_kms.Key(
      this,
      'SubscriptionSQSQueueEncryptionKey',
      {
        enableKeyRotation: true,
      }
    );

    const subscriptionSQSQueue = new sqs.Queue(this, 'SubscriptionSQSQueue', {
      encryption: sqs.QueueEncryption.KMS,
      encryptionMasterKey: subscriptionSQSQueueEncryptionKey,
      enforceSSL: true,
      deadLetterQueue: {
        maxReceiveCount: 5,
        queue: new sqs.Queue(this, 'SubscriptionSQSQueueDLQ', {
          enforceSSL: true,
          retentionPeriod: cdk.Duration.seconds(3000),
        }),
      },
    });

    const subscriptionSNSTopic = sns.Topic.fromTopicArn(
      this,
      'SubscriptionSNSTopic',
      props.subscriptionSNSTopic
    );
    subscriptionSNSTopic.addSubscription(new subscriptions.SqsSubscription(subscriptionSQSQueue));

    const subscriptionSQSHandler = new lambda.Function(this, 'SubscriptionSQSHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'subscription-sqs.SQSHandler',
      code: lambda.Code.fromBucket(
        quickstartBucket,
        'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
      ),
      environment: {
        NewSubscribersTableName: subscribersTable.tableName,
        SupportSNSArn: supportTopic.topicArn,
      },
      events: [new SqsEventSource(subscriptionSQSQueue, { batchSize: 1 })],
    });

    subscribersTable.grantWriteData(subscriptionSQSHandler);
    supportTopicMasterKey.grantEncrypt(subscriptionSQSHandler);
    supportTopic.grantPublish(subscriptionSQSHandler);

    const grantOrRevokeAccessFunction = new lambda.Function(this, 'GrantOrRevokeAccess', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'grant-revoke-access-to-product.dynamodbStreamHandler',
      code: lambda.Code.fromBucket(
        quickstartBucket,
        'cloudformation-aws-marketplace-saas/9c1e36f06f022c95bcc9129bbacfa195'
      ),
      environment: {
        SupportSNSArn: supportTopic.topicArn,
        LOG_LEVEL: 'info',
      },
      events: [
        new DynamoEventSource(subscribersTable, {
          startingPosition: lambda.StartingPosition.TRIM_HORIZON,
          batchSize: 1,
        }),
      ],
    });
    supportTopicMasterKey.grantEncryptDecrypt(grantOrRevokeAccessFunction);
    supportTopic.grantPublish(grantOrRevokeAccessFunction);
    subscribersTable.grantStreamRead(grantOrRevokeAccessFunction);

    NagSuppressions.addResourceSuppressions(
      [grantOrRevokeAccessFunction, subscriptionSQSHandler],
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
          reason:
            'TBD: FIX! This is Resource::* being used to output logs and x-ray traces and nothing else.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
  }
}
