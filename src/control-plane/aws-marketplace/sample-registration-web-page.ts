// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, DeployTimeSubstitutedFile, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { generateAWSManagedRuleSet } from '../../utils';

export interface SampleRegistrationWebPageProps {
  readonly baseUrl: string;
}

export class SampleRegistrationWebPage extends Construct {
  constructor(scope: Construct, id: string, props: SampleRegistrationWebPageProps) {
    super(scope, id);
    const websiteBucket = new s3.Bucket(this, 'WebsiteS3Bucket', {
      enforceSSL: true,
    });

    const staticFiles = new BucketDeployment(this, 'StaticFiles', {
      sources: [Source.asset(path.join(__dirname, '../../../resources/aws-marketplace/static'))],
      destinationBucket: websiteBucket,
    });

    const dynamicFile = new DeployTimeSubstitutedFile(this, 'DynamicFileScript', {
      source: path.join(__dirname, '../../../resources/aws-marketplace/dynamic/script.js'),
      destinationBucket: websiteBucket,
      destinationKey: 'script.js',
      substitutions: {
        baseUrl: props.baseUrl,
      },
    });

    dynamicFile.node.addDependency(staticFiles);

    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `${cdk.Stack.of(this).stackName}/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C`,
      ],
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
          reason: 'Allow wildcard access for CDKBucketDeployment.',
          appliesTo: [
            'Action::s3:GetObject*',
            'Action::s3:GetBucket*',
            'Action::s3:List*',
            `Resource::arn:<AWS::Partition>:s3:::cdk-${cdk.DefaultStackSynthesizer.DEFAULT_QUALIFIER}-assets-<AWS::AccountId>-<AWS::Region>/*`,
            'Action::s3:DeleteObject*',
            'Action::s3:Abort*',
            `Resource::<${cdk.Stack.of(this).getLogicalId(websiteBucket.node.defaultChild as s3.CfnBucket)}.Arn>/*`,
          ],
        },
        {
          id: 'AwsSolutions-L1',
          reason: 'NODEJS 18 is the version used cdk maanged custom resource.',
        },
      ],
      true
    );

    const logBucket = new s3.Bucket(this, 'WebsiteS3BucketLog', {
      enforceSSL: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
      intelligentTieringConfigurations: [
        {
          name: 'ArchiveAccessTier',
          archiveAccessTierTime: cdk.Duration.days(90),
        },
      ],
    });

    NagSuppressions.addResourceSuppressions(
      [websiteBucket, logBucket],
      [
        {
          id: 'AwsSolutions-S1',
          reason: 'Server access logs not required.',
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    const quickstartBucket = s3.Bucket.fromBucketName(this, 'CodeBucket', 'aws-quickstart');

    const edgeRedirectLambda = new lambda.Function(this, 'EdgeRedirectLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'edge-redirect.lambdaHandler',
      code: lambda.Code.fromBucket(
        quickstartBucket,
        'cloudformation-aws-marketplace-saas/6c6763ea280ce511fb099fc98397a298'
      ),
    });

    NagSuppressions.addResourceSuppressions(
      [edgeRedirectLambda],
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
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    const edgeRedirectLambdaVersion = new lambda.Version(this, 'EdgeRedirectLambdaVersion', {
      lambda: edgeRedirectLambda,
    });

    const cfnWAF = new cdk.aws_wafv2.CfnWebACL(this, 'WAF', {
      defaultAction: { allow: {} },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: 'WAF-WebsiteS3CloudfrontDistribution',
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

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'CloudFrontOriginAccessIdentity',
      {
        comment: 'Serverless website OA',
      }
    );

    const distribution = new cloudfront.Distribution(this, 'WebsiteS3CloudfrontDistribution', {
      defaultRootObject: 'index.html',
      enableLogging: true,
      logBucket: logBucket,
      geoRestriction: cloudfront.GeoRestriction.allowlist('US', 'CA'),
      logFilePrefix: 'access-logs/',
      httpVersion: cloudfront.HttpVersion.HTTP2,
      webAclId: cfnWAF.attrArn,
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        compress: true,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            functionVersion: edgeRedirectLambdaVersion,
            includeBody: true,
          },
        ],
      },
    });

    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: 'AwsSolutions-CFR4',
        reason: 'Uses default certificate.',
      },
    ]);

    new cdk.CfnOutput(this, 'LandingPageUrl', {
      value: `https://${distribution.distributionDomainName}/index.html`,
      description: 'URL to access your landing page and update SaaS URL field in your listing.',
    });
  }
}
