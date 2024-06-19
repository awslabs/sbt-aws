// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { RestApiBase } from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, DeployTimeSubstitutedFile, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag, generateAWSManagedRuleSet } from '../../utils';

/**
 * Properties for the SampleRegistrationWebPage construct.
 */
export interface SampleRegistrationWebPageProps {
  /**
   * The API Gateway that serves the following endpoints:
   *
   * POST /redirectmarketplacetoken: redirects to a registration page.
   *
   * POST /subscriber: creates a new subscriber.
   */
  readonly registrationAPI: RestApiBase;

  /**
   * The list of required user-provided fields for registration.
   * This contains the set of fields that must be provided by the user
   * when registering a new customer.
   *
   * This is used to dynamically update the registration page to create a
   * form that accepts each of the fields present in this list.
   *
   * ex. ['name', 'phone']
   */
  readonly userProvidedRequiredFieldsForRegistration: string[];

  /**
   * Whether to automatically delete objects from the S3 bucket when the stack is deleted.
   * @default - false
   */
  readonly autoDeleteBucketObjects?: boolean;

  /**
   * The URL of the image logo to display on the registration page.
   * @default - Amazon logo
   */
  readonly imageLogoUrl?: string;
}

/**
 * Constructs a sample registration web page hosted on Amazon S3 and fronted by Amazon CloudFront.
 * The web page includes a form for users to register for the SaaS product.
 */
export class SampleRegistrationWebPage extends Construct {
  constructor(scope: Construct, id: string, props: SampleRegistrationWebPageProps) {
    super(scope, id);
    addTemplateTag(this, 'SampleRegistrationWebPage');

    const region = cdk.Stack.of(this).region;
    if (cdk.Token.isUnresolved(region)) {
      // region info helps to decide whether to create CloudFront WAF
      // or NagSuppression for the result cdk-nag finding.
      throw new Error('Region not specified. Use "env" to specify region.');
    }

    const websiteBucket = new s3.Bucket(this, 'WebsiteS3Bucket', {
      enforceSSL: true,
      autoDeleteObjects: props.autoDeleteBucketObjects,
      ...(props.autoDeleteBucketObjects && { removalPolicy: cdk.RemovalPolicy.DESTROY }),
    });

    const staticFiles = new BucketDeployment(this, 'StaticFiles', {
      sources: [Source.asset(path.join(__dirname, '../../../resources/aws-marketplace/static'))],
      destinationBucket: websiteBucket,
    });

    const defaultImageLogoUrl =
      'https://m.media-amazon.com/images/G/01/AdProductsWebsite/images/AUX/02_amazon_logo_RGB_SQUID._TTW_.png';

    const dynamicFile = new DeployTimeSubstitutedFile(this, 'DynamicFileScript', {
      source: path.join(__dirname, '../../../resources/aws-marketplace/dynamic/script.js'),
      destinationBucket: websiteBucket,
      destinationKey: 'script.js',
      substitutions: {
        requiredFields: props.userProvidedRequiredFieldsForRegistration.join(','),
        imageLogoUrl: props.imageLogoUrl ?? defaultImageLogoUrl,
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
            `Resource::arn:<AWS::Partition>:s3:::cdk-${cdk.DefaultStackSynthesizer.DEFAULT_QUALIFIER}-assets-<AWS::AccountId>-${region}/*`,
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
      autoDeleteObjects: props.autoDeleteBucketObjects,
      ...(props.autoDeleteBucketObjects && { removalPolicy: cdk.RemovalPolicy.DESTROY }),
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

    let cfnWAF;
    if (cdk.Token.isUnresolved(region) == false && region == 'us-east-1') {
      cfnWAF = new cdk.aws_wafv2.CfnWebACL(this, 'WAF', {
        defaultAction: { allow: {} },
        scope: 'CLOUDFRONT',
        visibilityConfig: {
          cloudWatchMetricsEnabled: true,
          sampledRequestsEnabled: true,
          metricName: 'WAF-WebsiteS3CloudfrontDistribution',
        },
        rules: [
          generateAWSManagedRuleSet('AWSManagedRulesBotControlRuleSet', 0), // enable to block curl requests
          generateAWSManagedRuleSet('AWSManagedRulesKnownBadInputsRuleSet', 1),
          generateAWSManagedRuleSet('AWSManagedRulesCommonRuleSet', 2),
          generateAWSManagedRuleSet('AWSManagedRulesAnonymousIpList', 3),
          generateAWSManagedRuleSet('AWSManagedRulesAmazonIpReputationList', 4),
          generateAWSManagedRuleSet('AWSManagedRulesAdminProtectionRuleSet', 5),
          generateAWSManagedRuleSet('AWSManagedRulesSQLiRuleSet', 6),
        ],
      });
    } else {
      console.log('Only able to create CloudFront WAF in us-east-1 region.');
    }

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
      ...(cfnWAF != undefined ? { webAclId: cfnWAF.attrArn } : {}),
      defaultBehavior: {
        origin: new origins.S3Origin(websiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        compress: true,
      },
      additionalBehaviors: {
        '/redirectmarketplacetoken': {
          compress: true,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new origins.RestApiOrigin(props.registrationAPI),
        },
        '/subscriber': {
          compress: true,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          origin: new origins.RestApiOrigin(props.registrationAPI),
        },
      },
    });

    if (cdk.Token.isUnresolved(region) == false && region != 'us-east-1') {
      NagSuppressions.addResourceSuppressions(distribution, [
        {
          id: 'AwsSolutions-CFR2',
          reason: 'Can only create WAFv2 for CloudFront distribution in us-east-1 region.',
        },
      ]);
    }

    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: 'AwsSolutions-CFR4',
        reason: 'Uses default certificate.',
      },
    ]);

    new cdk.CfnOutput(this, 'CloudfrontMarketplaceFulfillmentURL', {
      value: `https://${distribution.distributionDomainName}/redirectmarketplacetoken`,
      description: 'CDN-fronted URL to access your landing page',
    });
  }
}
