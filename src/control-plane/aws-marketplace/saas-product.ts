// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
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
import { SubscriptionLogic } from './subscription-logic';
import { DetailType, IEventManager, addTemplateTag, generateAWSManagedRuleSet } from '../../utils';

/**
 * Enum representing the pricing models for an AWS Marketplace SaaS product.
 * @enum {string}
 */
export enum AWSMarketplaceSaaSPricingModel {
  /** Contracts pricing model */
  CONTRACTS = 'contracts',

  /** Subscriptions pricing model */
  SUBSCRIPTIONS = 'subscriptions',

  /** Contracts with subscription pricing model */
  CONTRACTS_WITH_SUBSCRIPTION = 'contracts_with_subscription',
}

/**
 * Properties for configuring an AWS Marketplace SaaS product.
 * @interface
 */
export interface AWSMarketplaceSaaSProductProps {
  /** Product code provided from AWS Marketplace */
  readonly productCode: string;

  /** The pricing model for the AWS Marketplace SaaS product. */
  readonly pricingModel: AWSMarketplaceSaaSPricingModel;

  /** Email to be notified on changes requiring action */
  readonly marketplaceTechAdminEmail: string;

  /** Seller email address, verified in SES and in 'Production' mode */
  readonly marketplaceSellerEmail?: string;

  /** SNS topic ARN provided from AWS Marketplace. Must exist. */
  readonly entitlementSNSTopic: string;

  /** SNS topic ARN provided from AWS Marketplace. Must exist. */
  readonly subscriptionSNSTopic: string;

  /**
   * The EventManager for the AWS Marketplace SaaS product.
   * This is used to enable integration with sbt-aws.
   */
  readonly eventManager?: IEventManager;

  /** Flag to disable API logging. */
  readonly disableAPILogging?: boolean;

  /**
   * List of required fields for registration. The existence of these
   * fields is checked when a new customer is registered.
   */
  readonly requiredFieldsForRegistration?: string[];
}

/**
 * Construct for creating an AWS Marketplace SaaS product.
 * @class
 */
export class AWSMarketplaceSaaSProduct extends Construct {
  /** The API Gateway REST API for registering customers. */
  readonly registerCustomerAPI: apigateway.RestApi;

  /** The DynamoDB table for storing subscriber information. */
  readonly subscribersTable: dynamodb.Table;

  /**
   * The list of required user-provided fields for registration.
   * This contains the set of fields that must be provided by the user
   * when registering a new customer.
   */
  readonly userProvidedRequiredFieldsForRegistration: string[];

  /**
   * Creates an instance of the AWSMarketplaceSaaSProduct construct.
   * @param {Construct} scope - The scope in which to define this construct.
   * @param {string} id - The unique identifier for this construct.
   * @param {AWSMarketplaceSaaSProductProps} props - The properties for configuring the AWS Marketplace SaaS product.
   */
  constructor(scope: Construct, id: string, props: AWSMarketplaceSaaSProductProps) {
    super(scope, id);
    addTemplateTag(this, 'AWSMarketplaceSaaSProduct');

    const region = cdk.Stack.of(this).region;
    if (cdk.Token.isUnresolved(region) || region != 'us-east-1') {
      // must use us-east-1 as quickstartBucket is located in us-east-1 region.
      throw new Error(
        'Region not specified. Use "env" to specify region. Note that region must be set to us-east-1 in order to use this construct.'
      );
    }

    const quickstartBucket = s3.Bucket.fromBucketName(this, 'CodeBucket', 'aws-quickstart');

    const createEntitlementLogic =
      props.pricingModel === AWSMarketplaceSaaSPricingModel.CONTRACTS_WITH_SUBSCRIPTION ||
      props.pricingModel === AWSMarketplaceSaaSPricingModel.CONTRACTS;

    const createSubscriptionLogic =
      props.pricingModel === AWSMarketplaceSaaSPricingModel.CONTRACTS_WITH_SUBSCRIPTION ||
      props.pricingModel === AWSMarketplaceSaaSPricingModel.SUBSCRIPTIONS;

    this.subscribersTable = new dynamodb.Table(this, 'AWSMarketplaceSubscribers', {
      partitionKey: { name: 'customerIdentifier', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
    });

    if (createSubscriptionLogic) {
      new SubscriptionLogic(this, 'SubscriptionLogic', {
        productCode: props.productCode,
        assetBucket: quickstartBucket,
      });
    }

    const supportTopicMasterKey = new cdk.aws_kms.Key(this, 'SupportTopicMasterKey', {
      enableKeyRotation: true,
    });
    const supportTopic = new sns.Topic(this, 'SupportSNSTopic', {
      masterKey: supportTopicMasterKey,
    });

    supportTopic.addSubscription(
      new subscriptions.EmailSubscription(props.marketplaceTechAdminEmail)
    );

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer
    const lambdaPowerToolsLayerARN = `arn:aws:lambda:${
      cdk.Stack.of(this).region
    }:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`;

    const powerToolsLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'LambdaPowerTools',
      lambdaPowerToolsLayerARN
    );

    const grantOrRevokeAccessFunctionPython = new PythonFunction(
      this,
      'GrantOrRevokeAccessFunctionPython',
      {
        entry: path.join(
          __dirname,
          '../../../resources/aws-marketplace/functions/grant-revoke-access-to-product'
        ),
        runtime: lambda.Runtime.PYTHON_3_12,
        index: 'index.py',
        handler: 'lambda_handler',
        timeout: cdk.Duration.seconds(60),
        layers: [powerToolsLayer],
        environment: {
          SupportSNSArn: supportTopic.topicArn,
        },
        events: [
          new DynamoEventSource(this.subscribersTable, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            batchSize: 1,
          }),
        ],
      }
    );

    if (props.eventManager) {
      grantOrRevokeAccessFunctionPython.addEnvironment('EVENTBUS_NAME', props.eventManager.busName);
      grantOrRevokeAccessFunctionPython.addEnvironment(
        'EVENT_SOURCE',
        props.eventManager.controlPlaneEventSource
      );
      grantOrRevokeAccessFunctionPython.addEnvironment(
        'OFFBOARDING_DETAIL_TYPE',
        DetailType.OFFBOARDING_REQUEST
      );

      props.eventManager.grantPutEventsTo(grantOrRevokeAccessFunctionPython);
    }

    const baseRequiredFieldsForRegistration = ['regToken'];
    this.userProvidedRequiredFieldsForRegistration = ['contactEmail'];
    const requiredFields = [
      ...baseRequiredFieldsForRegistration,
      ...this.userProvidedRequiredFieldsForRegistration,
      ...(props.requiredFieldsForRegistration || []),
    ];
    this.userProvidedRequiredFieldsForRegistration.push(
      ...(props.requiredFieldsForRegistration || [])
    );

    const registerNewMarketplaceCustomerPython = new PythonFunction(
      this,
      'RegisterNewMarketplaceCustomerPython',
      {
        entry: path.join(
          __dirname,
          '../../../resources/aws-marketplace/functions/register-new-subscriber'
        ),
        runtime: lambda.Runtime.PYTHON_3_12,
        index: 'index.py',
        handler: 'lambda_handler',
        timeout: cdk.Duration.seconds(60),
        layers: [powerToolsLayer],
        environment: {
          NEW_SUBSCRIBERS_TABLE_NAME: this.subscribersTable.tableName,
          REQUIRED_FIELDS: requiredFields.join(','),
        },
      }
    );

    if (props.eventManager) {
      registerNewMarketplaceCustomerPython.addEnvironment(
        'EVENTBUS_NAME',
        props.eventManager.busName
      );
      registerNewMarketplaceCustomerPython.addEnvironment(
        'EVENT_SOURCE',
        props.eventManager.controlPlaneEventSource
      );
      registerNewMarketplaceCustomerPython.addEnvironment(
        'ONBOARDING_DETAIL_TYPE',
        DetailType.ONBOARDING_REQUEST
      );
      props.eventManager.grantPutEventsTo(registerNewMarketplaceCustomerPython);
    }

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
        logGroupName: `/aws/vendedlogs/api/${this.node.id}-${this.node.addr}`,
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

    this.registerCustomerAPI = new apigateway.RestApi(this, 'RegisterCustomerAPI', options);
    this.registerCustomerAPI.addRequestValidator('request-validator', {
      requestValidatorName: 'register-customer-validator',
      validateRequestBody: true,
      validateRequestParameters: true,
    });

    const redirectHandler = new lambda.Function(this, 'RedirectHandler', {
      code: lambda.Code.fromInline(`
exports.redirecthandler = async(event, context, callback) => {

  const redirectUrl = "/?" + event['body'];
  const response = {
      statusCode: 302,
      headers: {
          Location: redirectUrl
      },
  };

  return response;

};`),
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.redirecthandler',
    });
    const redirectResource = this.registerCustomerAPI.root.addResource('redirectmarketplacetoken');
    redirectResource.addMethod('POST', new apigateway.LambdaIntegration(redirectHandler));
    new cdk.CfnOutput(this, 'APIGWMarketplaceFulfillmentURL', {
      value: this.registerCustomerAPI.urlForPath(redirectResource.path),
      description: 'URL to access your landing page',
    });

    const subscriberResource = this.registerCustomerAPI.root.addResource('subscriber');
    subscriberResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(registerNewMarketplaceCustomerPython)
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
        `${this.registerCustomerAPI.root}/OPTIONS/Resource`,
        `${subscriberResource}/OPTIONS/Resource`,
        `${subscriberResource}/POST/Resource`,
        `${redirectResource}/OPTIONS/Resource`,
        `${redirectResource}/POST/Resource`,
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
      resourceArn: this.registerCustomerAPI.deploymentStage.stageArn,
    });

    new cdk.CfnOutput(this, 'APIUrl', {
      value: this.registerCustomerAPI.url,
      description: 'API gateway URL to replace baseUrl value in web/script.js',
    });

    if (props.marketplaceSellerEmail) {
      registerNewMarketplaceCustomerPython.addEnvironment(
        'MARKETPLACE_SELLER_EMAIL',
        props.marketplaceSellerEmail
      );
    }

    this.subscribersTable.grantWriteData(registerNewMarketplaceCustomerPython);
    registerNewMarketplaceCustomerPython.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'aws-marketplace:GetEntitlements',
          'aws-marketplace:ResolveCustomer',
          'ses:SendEmail',
        ],
        resources: ['*'],
      })
    );

    if (createEntitlementLogic) {
      new EntitlementLogic(this, 'EntitlementLogic', {
        assetBucket: quickstartBucket,
        subscribersTable: this.subscribersTable,
        registerNewMarketplaceCustomer: registerNewMarketplaceCustomerPython,
        entitlementSNSTopic: props.entitlementSNSTopic,
      });
    }

    NagSuppressions.addResourceSuppressions(
      [registerNewMarketplaceCustomerPython, redirectHandler],
      [
        {
          id: 'AwsSolutions-IAM4',
          reason: 'Suppress usage of AWSLambdaBasicExecutionRole.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

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
        NewSubscribersTableName: this.subscribersTable.tableName,
        SupportSNSArn: supportTopic.topicArn,
      },
      events: [new SqsEventSource(subscriptionSQSQueue, { batchSize: 1 })],
    });

    this.subscribersTable.grantWriteData(subscriptionSQSHandler);
    supportTopicMasterKey.grantEncrypt(subscriptionSQSHandler);
    supportTopic.grantPublish(subscriptionSQSHandler);

    supportTopicMasterKey.grantEncryptDecrypt(grantOrRevokeAccessFunctionPython);
    supportTopic.grantPublish(grantOrRevokeAccessFunctionPython);

    NagSuppressions.addResourceSuppressions(
      [grantOrRevokeAccessFunctionPython, subscriptionSQSHandler],
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
          reason: 'Index name(s) not known beforehand and multiple permissions required.',
          appliesTo: [
            `Resource::<MarketplaceAWSMarketplaceMeteringRecords3B0F9D94.Arn>/index/*`,
            `Action::kms:ReEncrypt*`,
            `Action::kms:GenerateDataKey*`,
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
    NagSuppressions.addResourceSuppressions(
      [grantOrRevokeAccessFunctionPython],
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Used as part of the policy that allows dynamodb:ListStreams.',
          appliesTo: ['Resource::*'],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
  }
}
