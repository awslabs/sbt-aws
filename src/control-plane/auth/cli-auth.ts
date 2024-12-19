// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
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
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

/**
 * Parameters for CLI authentication setup
 */
interface cognitoAuthCLIProps {
  /**
   * The ID of the hosted zone in Route 53 where the domain is registered.
   */
  readonly hostedZoneId: string;

  /**
   * The fully qualified domain name (FQDN) for the ALB
   */
  readonly fqdn: string;

  /**
   */
  readonly zoneName: string;

  /**
   * The domain prefix for the Cognito User Pool domain.
   */
  readonly cognitoDomain: string;

  readonly userPool: cognito.UserPool;

  readonly jwtAudience: string[];
}

export class cognitoAuthCLI extends Construct {
  constructor(scope: Construct, id: string, props: cognitoAuthCLIProps) {
    super(scope, id);
    addTemplateTag(this, 'CognitoAuthCLI');
    const { hostedZoneId, fqdn, zoneName, cognitoDomain, userPool, jwtAudience } = props;

    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: zoneName,
    });

    const albCertificate = new Certificate(scope, 'AlbCertificate', {
      domainName: fqdn,
      validation: CertificateValidation.fromDns(hostedZone),
    });

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
      partitionKey: { name: 'Device_code', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 20,
      writeCapacity: 20,
      pointInTimeRecovery: true,
    });

    deviceGrantDynamoDbTable.addGlobalSecondaryIndex({
      indexName: 'AuthZ_state-index',
      partitionKey: { name: 'AuthZ_State', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
      readCapacity: 20,
      writeCapacity: 20,
    });

    deviceGrantDynamoDbTable.addGlobalSecondaryIndex({
      indexName: 'User_code-index',
      partitionKey: { name: 'User_code', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
      readCapacity: 20,
      writeCapacity: 20,
    });

    const deviceGrantVpc = new ec2.Vpc(scope, 'DeviceGrantVPC', {
      cidr: '10.192.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
      enableDnsSupport: true,
      enableDnsHostnames: true,
    });

    new ec2.FlowLog(scope, 'FlowLog', {
      resourceType: ec2.FlowLogResourceType.fromVpc(deviceGrantVpc),
      destination: ec2.FlowLogDestination.toCloudWatchLogs(
        new logs.LogGroup(scope, 'FlowLogGroup')
      ),
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

    const retrieveCognitoSecretsLambda = new lambda.Function(
      scope,
      'RetrieveCognitoSecretsLambda',
      {
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
      }
    );

    const retrieveCognitoSecrets = new cdk.CustomResource(scope, 'RetrieveCognitoSecrets', {
      serviceToken: retrieveCognitoSecretsLambda.functionArn,
      properties: {
        cupid: userPool.userPoolId,
        albauthorizerid: grantDeviceAlbCognitoClient.userPoolClientId,
        DeviceCognitoClientid: deviceCognitoClient.userPoolClientId,
      },
    });

    new cdk.CfnOutput(scope, 'CfnOutputDeviceCognitoClientClientSecret', {
      description: 'Device Client Secret for CLI',
      value: retrieveCognitoSecrets.getAttString('DeviceCognitoClientSecret'),
    });

    const deviceGrantToken = new lambda.Function(scope, 'DeviceGrantToken', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../resources/functions/auth-device-grant-token')
      ),
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
        DYNAMODB_TABLE: deviceGrantDynamoDbTable.tableName,
        DYNAMODB_USERCODE_INDEX: 'User_code-index',
        POLLING_INTERVAL: '5',
        USER_CODE_FORMAT: '#B',
        USER_CODE_LENGTH: '8',
      },
      role: deviceGrantTokenIamRole,
      timeout: Duration.seconds(30),
    });

    const deviceGrantTokenCleaning = new lambda.Function(scope, 'DeviceGrantTokenCleaning', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../../resources/functions/auth-token-cleaning')
      ),
      environment: {
        DYNAMODB_TABLE: deviceGrantDynamoDbTable.tableName,
      },
      role: deviceGrantCleaningIamRole,
      timeout: Duration.seconds(30),
    });

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
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      }
    );

    NagSuppressions.addResourceSuppressions(deviceGrantAlb, [
      {
        id: 'AwsSolutions-ELB2',
        reason: 'Access logging is not required for this demo ALB',
      },
    ]);

    new route53.ARecord(scope, 'ALBRecordSet', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(deviceGrantAlb)),
      recordName: fqdn,
    });

    const devicegrantAlb443 = new elasticloadbalancingv2.ApplicationListener(
      scope,
      'DevicegrantALB443',
      {
        port: 443,
        protocol: elasticloadbalancingv2.ApplicationProtocol.HTTPS,
        certificates: [
          elasticloadbalancingv2.ListenerCertificate.fromArn(albCertificate.certificateArn),
        ],
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
      description: 'CNAME of the ALB Endpoint to point your DNS to',
      value: deviceGrantAlb.loadBalancerDnsName,
    });

    new cdk.CfnOutput(scope, 'CfnOutputTestEndPointForDevice', {
      description: 'HTTPS Endpoint for the simulated DEVICE to make their requests',
      value: `https://${fqdn}/token`,
    });

    new cdk.CfnOutput(scope, 'CfnOutputTestEndPointForUser', {
      description: 'HTTPS Endpoint for the USER to make their requests',
      value: `https://${fqdn}/device`,
    });

    new cdk.CfnOutput(scope, 'CfnOutputDeviceCognitoClientClientID', {
      description: 'Device Client ID for CLI',
      value: deviceCognitoClient.userPoolClientId,
    });

    new cdk.CfnOutput(scope, 'CognitoDomain', {
      value: `${cognitoDomain}.auth.${cdk.Stack.of(scope).region}.amazoncognito.com`,
      description: 'Cognito Domain',
    });

    new cdk.CfnOutput(scope, 'ControlPlaneFQDN', {
      value: fqdn || '',
    });

    jwtAudience.push(deviceCognitoClient.userPoolClientId);
  }
}
