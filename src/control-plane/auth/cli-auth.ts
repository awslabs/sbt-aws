// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticloadbalancingv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as elbv2Targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';

/**
 * Parameters for CLI authentication setup
 */
interface setupCognitoAuthCLIProps {
    /**
     * The ID of the hosted zone in Route 53 where the domain is registered.
     */
    readonly hostedZoneId: string;

    /**
     * The fully qualified domain name (FQDN)
     */
    readonly fqdn: string;

    /**
     * The ARN of the SSL/TLS certificate
     */
    readonly certificateArn: string;

    /**
     * The domain prefix for the Cognito User Pool domain.
     */
    readonly cognitoDomain: string;
}

export function setupCognitoAuthCLI(
    scope: Construct,
    props: setupCognitoAuthCLIProps,
    userPool: cognito.UserPool,
    jwtAudience: string[]
) {
    const { hostedZoneId, fqdn, certificateArn, cognitoDomain } = props;

    // Device Authorization Resources
    const cognitoUserPoolDomain = new cognito.UserPoolDomain(scope, 'CognitoUserPoolDomain', {
        cognitoDomain: {
            domainPrefix: cognitoDomain,
        },
        userPool: userPool,
    });

    const deviceCognitoClient = new cognito.UserPoolClient(scope, 'DeviceCognitoClient', {
        userPool: userPool,
        authFlows: {
            adminUserPassword: true,
            custom: true,
            userSrp: true,
            userPassword: false,
        },
        oAuth: {
            flows: {
                authorizationCodeGrant: true,
            },
            scopes: [cognito.OAuthScope.OPENID],
            callbackUrls: [`https://${fqdn}/callback`],
        },
        generateSecret: true,
        supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
    });

    const deviceGrantDynamoDbTable = new dynamodb.Table(scope, 'DeviceGrantDynamoDBTable', {
        tableName: 'DeviceGrant',
        partitionKey: { name: 'Device_code', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 5,
        writeCapacity: 5,
        pointInTimeRecovery: true,
    });

    deviceGrantDynamoDbTable.addGlobalSecondaryIndex({
        indexName: 'AuthZ_state-index',
        partitionKey: { name: 'AuthZ_State', type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL,
        readCapacity: 5,
        writeCapacity: 5,
    });

    deviceGrantDynamoDbTable.addGlobalSecondaryIndex({
        indexName: 'User_code-index',
        partitionKey: { name: 'User_code', type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL,
        readCapacity: 5,
        writeCapacity: 5,
    });

    const deviceGrantVpc = new ec2.Vpc(scope, 'DeviceGrantVPC', {
        ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
        maxAzs: 2,
        subnetConfiguration: [
            {
                cidrMask: 24,
                name: 'Public',
                subnetType: ec2.SubnetType.PUBLIC,
            },
            {
                cidrMask: 24,
                name: 'Private',
                subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
            },
        ],
    });

    new ec2.FlowLog(scope, 'FlowLog', {
        resourceType: ec2.FlowLogResourceType.fromVpc(deviceGrantVpc),
        destination: ec2.FlowLogDestination.toCloudWatchLogs(new logs.LogGroup(scope, 'FlowLogGroup')),
    });

    const grantDeviceAlbCognitoClient = new cognito.UserPoolClient(
        scope,
        'GrantDeviceALBCognitoClient',
        {
            userPool: userPool,
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userSrp: true,
                userPassword: false,
            },
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
                scopes: [cognito.OAuthScope.OPENID],
                callbackUrls: [`https://${fqdn}/oauth2/idpresponse`],
            },
            generateSecret: true,
            supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
        }
    );

    const retrieveCognitoSecretsPolicy = new iam.ManagedPolicy(
        scope,
        'RetrieveCognitoSecretsPolicy',
        {
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['cognito-idp:ListUserPoolClients', 'cognito-idp:DescribeUserPoolClient'],
                    resources: [
                        `arn:aws:cognito-idp:${cdk.Stack.of(scope).region}:${cdk.Stack.of(scope).account}:userpool/${userPool.userPoolId}`,
                    ],
                }),
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                    resources: ['*'],
                }),
            ],
        }
    );

    const retrieveCognitoSecretsIamRole = new iam.Role(scope, 'RetrieveCognitoSecretsIAMRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [retrieveCognitoSecretsPolicy],
    });

    NagSuppressions.addResourceSuppressions(
        retrieveCognitoSecretsPolicy,
        [
            {
                id: 'AwsSolutions-IAM5',
                reason: 'Lambda function needs permission to create and write logs to CloudWatch Logs.',
                appliesTo: ['Resource::*'],
            },
        ],
        true
    );

    const s3Bucket = new s3.Bucket(scope, 'S3B4NNNP', {
        encryption: s3.BucketEncryption.S3_MANAGED,
        enforceSSL: true,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Add NagSuppression for s3Bucket
    NagSuppressions.addResourceSuppressions(s3Bucket, [
        {
            id: 'AwsSolutions-S1',
            reason: 'Access logging is not required for this bucket in this context.',
        },
    ]);

    const deviceGrantAlbsg = new ec2.SecurityGroup(scope, 'DeviceGrantALBSG', {
        vpc: deviceGrantVpc,
        description: 'SG for Device grant ALB',
        allowAllOutbound: false,
    });
    deviceGrantAlbsg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');
    deviceGrantAlbsg.addEgressRule(
        ec2.Peer.anyIpv4(),
        ec2.Port.tcp(443),
        'Allow HTTPS outbound traffic'
    );

    NagSuppressions.addResourceSuppressions(deviceGrantAlbsg, [
        {
            id: 'AwsSolutions-EC23',
            reason: 'ALB needs to be accessible from the internet for the device grant flow',
        },
    ]);

    const deviceGrantCleaningIamRole = new iam.Role(scope, 'DeviceGrantCleaningIAMRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            new iam.ManagedPolicy(scope, 'CleaningTablePolicy', {
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: [
                            'dynamodb:PutItem',
                            'dynamodb:DeleteItem',
                            'dynamodb:GetItem',
                            'dynamodb:Scan',
                            'dynamodb:Query',
                            'dynamodb:UpdateItem',
                        ],
                        resources: [deviceGrantDynamoDbTable.tableArn],
                    }),
                ],
            }),
        ],
    });

    const deviceGrantTokenIamRole = new iam.Role(scope, 'DeviceGrantTokenIAMRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            new iam.ManagedPolicy(scope, 'DeviceGrantTokenTablePolicy', {
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: [
                            'dynamodb:PutItem',
                            'dynamodb:DeleteItem',
                            'dynamodb:GetItem',
                            'dynamodb:Scan',
                            'dynamodb:Query',
                            'dynamodb:UpdateItem',
                        ],
                        resources: [
                            deviceGrantDynamoDbTable.tableArn,
                            `${deviceGrantDynamoDbTable.tableArn}/index/User_code-index`,
                            `${deviceGrantDynamoDbTable.tableArn}/index/AuthZ_state-index`,
                        ],
                    }),
                ],
            }),
            new iam.ManagedPolicy(scope, 'DevicegrantTokenRetrieveSecretsPolicy', {
                statements: [
                    new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ['cognito-idp:ListUserPoolClients', 'cognito-idp:DescribeUserPoolClient'],
                        resources: [
                            `arn:aws:cognito-idp:${cdk.Stack.of(scope).region}:${cdk.Stack.of(scope).account}:userpool/${userPool.userPoolId!}`,
                        ],
                    }),
                ],
            }),
        ],
    });

    const grantDeviceS3BucketPolicy = new iam.ManagedPolicy(scope, 'GrantDeviceS3BucketPolicy', {
        statements: [
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    's3:PutObject',
                    's3:GetObject',
                    's3:ListBucket',
                    's3:DeleteObject',
                    's3:DeleteBucket',
                ],
                resources: [s3Bucket.bucketArn, `${s3Bucket.bucketArn}/*`],
            }),
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
                resources: ['*'],
            }),
        ],
    });

    NagSuppressions.addResourceSuppressions(grantDeviceS3BucketPolicy, [
        {
            id: 'AwsSolutions-IAM5',
            reason:
                'Lambda function needs access to all objects in the S3 bucket for device grant flow and to create and write logs',
            appliesTo: [
                'Resource::<CognitoAuthS3B4NNNP892500FC.Arn>/*',
                'Action::s3:PutObject',
                'Action::s3:GetObject',
                'Action::s3:ListBucket',
                'Action::s3:DeleteObject',
                'Action::s3:DeleteBucket',
                'Resource::*',
            ],
        },
    ]);

    const loadS3iamRole = new iam.Role(scope, 'LoadS3IAMRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [grantDeviceS3BucketPolicy],
    });

    const retrieveCognitoSecretsLambda = new lambda.Function(scope, 'RetrieveCognitoSecretsLambda', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.lambda_handler',
        code: lambda.Code.fromInline(`
import cfnresponse
import boto3
import json

def lambda_handler(event, context):
  print("start")
  print(json.dumps(event))

  if event['RequestType'] == 'Create':
      client = boto3.client('cognito-idp')
      ALBClientID = event['ResourceProperties']['albauthorizerid']
      DeviceCognitoClientID = event['ResourceProperties']['DeviceCognitoClientid']
      userPoolId = event['ResourceProperties']['cupid']

      responseData = {}

      try:
          response = client.describe_user_pool_client(
              UserPoolId=userPoolId,
              ClientId=ALBClientID
          )
          responseData['ALBAuthorizerSecret'] = response['UserPoolClient']['ClientSecret']
      except:
          print('Cannot retrive Cognito User Pool Client information for ALB')
          cfnresponse.send(event, context, cfnresponse.FAILED, {})

      try:
          response = client.describe_user_pool_client(
              UserPoolId=userPoolId,
              ClientId=DeviceCognitoClientID
          )
          responseData['DeviceCognitoClientSecret'] = response['UserPoolClient']['ClientSecret']
      except:
          print('Cannot retrive Cognito User Pool Client information for Device')
          cfnresponse.send(event, context, cfnresponse.FAILED, {})

      cfnresponse.send(event, context, cfnresponse.SUCCESS, responseData)
  else:
      cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
`),
        role: retrieveCognitoSecretsIamRole,
        timeout: Duration.seconds(30),
    });

    const loadS3 = new lambda.Function(scope, 'LoadS3', {
        runtime: lambda.Runtime.PYTHON_3_12,
        handler: 'index.lambda_handler',
        code: lambda.Code.fromInline(`
import cfnresponse
from urllib.request import urlopen
from http.client import HTTPResponse
import boto3
import json

def lambda_handler(event, context):
  print("start")
  print(json.dumps(event))
  myBucket = event['ResourceProperties']['bucketname']
  packageName = event['ResourceProperties']['packageName']
  packageURL = event['ResourceProperties']['packageURL']
  print("bucketname: " + myBucket + ", path: " + packageURL + ", package: " + packageName)
  if event['RequestType'] == 'Create':
      print("in Create")
      with urlopen(packageURL) as response:
          print("Reponse:")
          print(response)
          headers = response.getheaders()
          print("Headers:")
          print(headers)
          putS3Object(myBucket, packageName, response.read())
          cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
  elif event['RequestType'] == 'Delete':
      print("in Delete")
      s3 = boto3.client('s3')
      try:
          bucket = s3.list_objects_v2(Bucket=myBucket)
          if 'Contents' in bucket:
              for obj in bucket['Contents']:
                  s3.delete_object(Bucket=myBucket, Key=obj['Key'])
                  print("deleted: " + obj['Key'])
      except:
          print('Bucket already deleted')
      cfnresponse.send(event, context, cfnresponse.SUCCESS, {})
  else:
      print(event)
      print(context)
      cfnresponse.send(event, context, cfnresponse.SUCCESS, {})

def putS3Object(bucketName, objectName, objectData):
  s3 = boto3.client('s3')
  return s3.put_object(Bucket=bucketName, Key=objectName, Body=objectData)

def deleteBucket(bucketName):
  s3 = boto3.client('s3')
  return s3.delete_bucket(Bucket=bucketName)
`),
        role: loadS3iamRole,
        timeout: Duration.seconds(30),
        reservedConcurrentExecutions: 5,
        environment: {
            S3_BUCKET_NAME: s3Bucket.bucketName,
        },
    });
    loadS3.node.addDependency(s3Bucket);

    const deployTokenCodeToS3 = new cdk.CustomResource(scope, 'DeployTokenCodeToS3', {
        serviceToken: loadS3.functionArn,
        properties: {
            bucketname: s3Bucket.bucketName,
            packageURL:
                'https://github.com/aws-samples/cognito-device-grant-flow/releases/download/v1.1.0/cognito-device-grant-flow.zip',
            packageName: 'DeviceGrant-token.zip',
        },
    });

    new cdk.CustomResource(scope, 'DeployCleaningCodeToS3', {
        serviceToken: loadS3.functionArn,
        properties: {
            bucketname: s3Bucket.bucketName,
            packageURL:
                'https://github.com/aws-samples/cognito-device-grant-flow-cleaning/releases/download/v1.0.0/cognito-device-grant-flow-cleaning.zip',
            packageName: 'DeviceGrant-cleaning.zip',
        },
    });

    const retrieveCognitoSecrets = new cdk.CustomResource(scope, 'RetrieveCognitoSecrets', {
        serviceToken: retrieveCognitoSecretsLambda.functionArn,
        properties: {
            cupid: userPool.userPoolId,
            albauthorizerid: grantDeviceAlbCognitoClient.userPoolClientId,
            DeviceCognitoClientid: deviceCognitoClient.userPoolClientId,
        },
    });

    new cdk.CfnOutput(scope, 'CfnOutputDeviceCognitoClientClientSecret', {
        key: 'DeviceCognitoClientClientSecret',
        description: 'Device Client Secret for CLI',
        value: retrieveCognitoSecrets.getAttString('DeviceCognitoClientSecret'),
        exportName: 'DeviceCognitoClientClientSecretOutput',
    });

    const deviceGrantToken = new lambda.Function(scope, 'DeviceGrantToken', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromBucket(s3Bucket, 'DeviceGrant-token.zip'),
        environment: {
            APP_CLIENT_ID: grantDeviceAlbCognitoClient.userPoolClientId,
            APP_CLIENT_SECRET: retrieveCognitoSecrets.getAttString('ALBAuthorizerSecret'),
            CODE_EXPIRATION: '1800',
            CODE_VERIFICATION_URI: fqdn,
            CUP_DOMAIN: cognitoDomain,
            CUP_ID: userPool.userPoolId!,
            CUP_REGION: cdk.Fn.select(0, cdk.Fn.split('_', userPool.userPoolId!)),
            DEVICE_CODE_FORMAT: '#aA',
            DEVICE_CODE_LENGTH: '64',
            DYNAMODB_AUTHZ_STATE_INDEX: 'AuthZ_state-index',
            DYNAMODB_TABLE: 'DeviceGrant',
            DYNAMODB_USERCODE_INDEX: 'User_code-index',
            POLLING_INTERVAL: '5',
            USER_CODE_FORMAT: '#B',
            USER_CODE_LENGTH: '8',
        },
        role: deviceGrantTokenIamRole,
    });
    deviceGrantToken.node.addDependency(deployTokenCodeToS3.node.defaultChild as cdk.CfnResource);

    const deviceGrantTokenCleaning = new lambda.Function(scope, 'DeviceGrantTokenCleaning', {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromBucket(s3Bucket, 'DeviceGrant-cleaning.zip'),
        environment: {
            DYNAMODB_TABLE: 'DeviceGrant',
        },
        role: deviceGrantCleaningIamRole,
    });
    deviceGrantTokenCleaning.node.addDependency(
        deployTokenCodeToS3.node.defaultChild as cdk.CfnResource
    );

    deviceGrantToken.addPermission('ALBToLambdaPerms', {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('elasticloadbalancing.amazonaws.com'),
    });

    const cwRuleForCleaning = new events.Rule(scope, 'CWRuleForCleaning', {
        description: 'Invoke Cleaning Lambda',
        schedule: events.Schedule.rate(cdk.Duration.hours(1)),
        targets: [new targets.LambdaFunction(deviceGrantTokenCleaning)],
    });

    cwRuleForCleaning.addTarget(new targets.LambdaFunction(deviceGrantTokenCleaning));

    const deviceGrantAlbTarget = new elasticloadbalancingv2.ApplicationTargetGroup(
        scope,
        'DeviceGrantALBTarget',
        {
            vpc: deviceGrantVpc,
            targetType: elasticloadbalancingv2.TargetType.LAMBDA,
            targets: [new elbv2Targets.LambdaTarget(deviceGrantToken)],
        }
    );

    const deviceGrantAlb = new elasticloadbalancingv2.ApplicationLoadBalancer(
        scope,
        'DeviceGrantALB',
        {
            vpc: deviceGrantVpc,
            internetFacing: true,
            securityGroup: deviceGrantAlbsg,
        }
    );

    NagSuppressions.addResourceSuppressions(deviceGrantAlb, [
        {
            id: 'AwsSolutions-ELB2',
            reason: 'Access logging is not required for this demo ALB',
        },
    ]);

    new route53.ARecord(scope, 'ALBRecordSet', {
        zone: route53.HostedZone.fromHostedZoneAttributes(scope, 'HostedZone', {
            hostedZoneId: hostedZoneId,
            zoneName: fqdn,
        }),
        target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(deviceGrantAlb)),
    });

    const devicegrantAlb443 = new elasticloadbalancingv2.ApplicationListener(
        scope,
        'DevicegrantALB443',
        {
            port: 443,
            protocol: elasticloadbalancingv2.ApplicationProtocol.HTTPS,
            certificates: [elasticloadbalancingv2.ListenerCertificate.fromArn(certificateArn)],
            loadBalancer: deviceGrantAlb,
            sslPolicy: elasticloadbalancingv2.SslPolicy.TLS12,
            defaultAction: elasticloadbalancingv2.ListenerAction.fixedResponse(503, {
                contentType: 'text/html',
                messageBody: '',
            }),
        }
    );

    new elasticloadbalancingv2.ApplicationListenerRule(scope, 'DevicegrantALB443Device', {
        listener: devicegrantAlb443,
        priority: 1,
        conditions: [elasticloadbalancingv2.ListenerCondition.pathPatterns(['/device'])],
        action: elasticloadbalancingv2.ListenerAction.authenticateOidc({
            authorizationEndpoint: `https://${cognitoUserPoolDomain.domainName}.auth.${cdk.Stack.of(scope).region}.amazoncognito.com/oauth2/authorize`,
            tokenEndpoint: `https://${cognitoUserPoolDomain.domainName}.auth.${cdk.Stack.of(scope).region}.amazoncognito.com/oauth2/token`,
            userInfoEndpoint: `https://${cognitoUserPoolDomain.domainName}.auth.${cdk.Stack.of(scope).region}.amazoncognito.com/oauth2/userInfo`,
            clientId: grantDeviceAlbCognitoClient.userPoolClientId,
            clientSecret: grantDeviceAlbCognitoClient.userPoolClientSecret,
            issuer: `https://cognito-idp.${cdk.Stack.of(scope).region}.amazonaws.com/${userPool.userPoolId}`,
            next: elasticloadbalancingv2.ListenerAction.forward([deviceGrantAlbTarget]),
        }),
    });

    new elasticloadbalancingv2.ApplicationListenerRule(scope, 'DevicegrantALB443TokenOrCallback', {
        listener: devicegrantAlb443,
        priority: 2,
        conditions: [elasticloadbalancingv2.ListenerCondition.pathPatterns(['/token', '/callback'])],
        action: elasticloadbalancingv2.ListenerAction.forward([deviceGrantAlbTarget]),
    });

    new cdk.CfnOutput(scope, 'CfnOutputALBCNAMEForDNSConfiguration', {
        key: 'ALBCNAMEForDNSConfiguration',
        description: 'CNAME of the ALB Endpoint to point your DNS to',
        value: deviceGrantAlb.loadBalancerDnsName,
        exportName: 'DeviceGrantALBDNSNameOutput',
    });

    new cdk.CfnOutput(scope, 'CfnOutputTestEndPointForDevice', {
        key: 'TestEndPointForDevice',
        description: 'HTTPS Endpoint for the simulated DEVICE to make their requests',
        value: `https://${fqdn}/token`,
        exportName: 'TestEndPointForDeviceOutput',
    });

    new cdk.CfnOutput(scope, 'CfnOutputTestEndPointForUser', {
        key: 'TestEndPointForUser',
        description: 'HTTPS Endpoint for the USER to make their requests',
        value: `https://${fqdn}/device`,
        exportName: 'TestEndPointForUserOutput',
    });

    new cdk.CfnOutput(scope, 'CfnOutputDeviceCognitoClientClientID', {
        key: 'DeviceCognitoClientClientID',
        description: 'Device Client ID for CLI',
        value: deviceCognitoClient.userPoolClientId,
        exportName: 'DeviceCognitoClientClientIDOutput',
    });

    new cdk.CfnOutput(scope, 'CognitoDomain', {
        key: 'CognitoDomain',
        value: `${cognitoDomain}.auth.${cdk.Stack.of(scope).region}.amazoncognito.com`,
        description: 'Cognito Domain',
        exportName: 'CognitoDomainOutput',
    });

    new cdk.CfnOutput(scope, 'ControlPlaneFQDN', {
        value: fqdn || '',
        key: 'ControlPlaneFQDN',
        exportName: 'ControlPlaneFQDNOutput',
    });

    jwtAudience.push(deviceCognitoClient.userPoolClientId);
}
