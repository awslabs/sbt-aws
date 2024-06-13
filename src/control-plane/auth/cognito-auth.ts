// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import * as cdk from 'aws-cdk-lib';
import { CustomResource, Duration, SecretValue, Stack } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  Effect,
} from 'aws-cdk-lib/aws-iam';
import { Runtime, IFunction, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { IAuth } from './auth-interface';
import { addTemplateTag } from '../../utils';

/**
 * Properties for the CognitoAuth construct.
 */
export interface CognitoAuthProps {
  /**
   * The email address of the system admin.
   */
  readonly systemAdminEmail: string;

  /**
   * The callback URL for the control plane.
   * @default 'http://localhost'
   */
  readonly controlPlaneCallbackURL?: string;

  /**
   * The name of the system admin role.
   * @default 'SystemAdmin'
   */
  readonly systemAdminRoleName?: string;
}

/**
 * Constructs for setting up Cognito authentication and user management.
 */
export class CognitoAuth extends Construct implements IAuth {
  /**
   * The JWT issuer domain for the identity provider.
   */
  readonly jwtIssuer: string;

  /**
   * The list of recipients of the JWT.
   */
  readonly jwtAudience: string[];

  /**
   * The endpoint for granting OAuth tokens.
   */
  readonly tokenEndpoint: string;

  /**
   * The authorization server for the control plane IdP.
   */
  public readonly authorizationServer: string;

  readonly userClientId: string;
  readonly machineClientId: string;
  readonly machineClientSecret: SecretValue;
  readonly fetchTenantScope?: string;
  readonly fetchAllTenantsScope?: string;
  readonly deleteTenantScope?: string;
  readonly createTenantScope?: string;
  readonly updateTenantScope?: string;
  readonly activateTenantScope?: string;
  readonly deactivateTenantScope?: string;
  readonly fetchUserScope?: string;
  readonly fetchAllUsersScope?: string;
  readonly deleteUserScope?: string;
  readonly createUserScope?: string;
  readonly updateUserScope?: string;
  readonly disableUserScope?: string;
  readonly enableUserScope?: string;
  /**
   * The well-known endpoint URL for the control plane IdP.
   */
  public readonly wellKnownEndpointUrl: string;

  /**
   * The Lambda function for creating a user.
   */
  public readonly createUserFunction: IFunction;

  /**
   * The Lambda function for fetching all users.
   */
  public readonly fetchAllUsersFunction: IFunction;

  /**
   * The Lambda function for fetching a user.
   */
  public readonly fetchUserFunction: IFunction;

  /**
   * The Lambda function for updating a user.
   */
  public readonly updateUserFunction: IFunction;

  /**
   * The Lambda function for deleting a user.
   */
  public readonly deleteUserFunction: IFunction;

  /**
   * The Lambda function for disabling a user.
   */
  public readonly disableUserFunction: IFunction;

  /**
   * The Lambda function for enabling a user.
   */
  public readonly enableUserFunction: IFunction;

  constructor(scope: Construct, id: string, props: CognitoAuthProps) {
    super(scope, id);
    addTemplateTag(this, 'CognitoAuth');

    const idpName = 'COGNITO';
    const systemAdminRoleName = props.systemAdminRoleName ?? 'SystemAdmin';
    const defaultControlPlaneCallbackURL = 'http://localhost';

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer
    const lambdaPowertoolsLayer = LayerVersion.fromLayerVersionArn(
      this,
      'LambdaPowerTools',
      `arn:aws:lambda:${Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`
    );

    const lambdaIdpExecRole = new Role(this, 'lambdaIdpExecRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaIdpExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    lambdaIdpExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );
    lambdaIdpExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess')
    );

    lambdaIdpExecRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'cognito-idp:AdminCreateUser',
          'cognito-idp:CreateGroup',
          'cognito-idp:AdminAddUserToGroup',
          'cognito-idp:GetGroup',
          'cognito-idp:DescribeUserPool',
        ],
        effect: Effect.ALLOW,
        resources: ['*'],
      })
    );

    NagSuppressions.addResourceSuppressions(
      lambdaIdpExecRole,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Auth resource name(s) not known beforehand.',
        },
        {
          id: 'AwsSolutions-IAM4',
          reason:
            'Suppress usage of AWSLambdaBasicExecutionRole, CloudWatchLambdaInsightsExecutionRolePolicy, and AWSXrayWriteOnlyAccess.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/AWSXrayWriteOnlyAccess',
          ],
        },
      ],
      true // applyToChildren = true, so that it applies to policies created for the role.
    );

    const userPool = new cognito.UserPool(this, 'UserPool', {
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      userInvitation: {
        emailSubject: 'Your temporary password for control plane UI',
        emailBody: `Login into control plane UI at ${props.controlPlaneCallbackURL} with username {username} and temporary password {####}`,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: { required: true, mutable: true },
      },
      customAttributes: {
        userRole: new cognito.StringAttribute({ mutable: true, minLen: 1, maxLen: 256 }),
      },
      advancedSecurityMode: cognito.AdvancedSecurityMode.ENFORCED,
    });

    NagSuppressions.addResourceSuppressions(userPool, [
      {
        id: 'AwsSolutions-COG2',
        reason: 'Not requiring MFA at this phase.',
      },
    ]);

    const readUserScope = new cognito.ResourceServerScope({
      scopeName: 'user_read',
      scopeDescription: 'Read access to users.',
    });
    const writeUserScope = new cognito.ResourceServerScope({
      scopeName: 'user_write',
      scopeDescription: 'Write access to users.',
    });
    const userResourceServer = userPool.addResourceServer('UserResourceServer', {
      identifier: 'user',
      scopes: [readUserScope, writeUserScope],
    });
    const userResourceServerReadScope = cognito.OAuthScope.resourceServer(
      userResourceServer,
      readUserScope
    );
    const userResourceServerWriteScope = cognito.OAuthScope.resourceServer(
      userResourceServer,
      writeUserScope
    );

    // this.fetchUserScope = userResourceServerReadScope.scopeName;
    // this.fetchAllUsersScope = userResourceServerReadScope.scopeName;
    // this.deleteUserScope = userResourceServerWriteScope.scopeName;
    // this.createUserScope = userResourceServerWriteScope.scopeName;
    // this.updateUserScope = userResourceServerWriteScope.scopeName;
    // this.disableUserScope = userResourceServerWriteScope.scopeName;
    // this.enableUserScope = userResourceServerWriteScope.scopeName;

    const readTenantScope = new cognito.ResourceServerScope({
      scopeName: 'tenant_read',
      scopeDescription: 'Read access to tenants.',
    });
    const writeTenantScope = new cognito.ResourceServerScope({
      scopeName: 'tenant_write',
      scopeDescription: 'Write access to tenants.',
    });
    const tenantResourceServer = userPool.addResourceServer('TenantResourceServer', {
      identifier: 'tenant',
      scopes: [readTenantScope, writeTenantScope],
    });
    const tenantResourceServerReadScope = cognito.OAuthScope.resourceServer(
      tenantResourceServer,
      readTenantScope
    );
    const tenantResourceServerWriteScope = cognito.OAuthScope.resourceServer(
      tenantResourceServer,
      writeTenantScope
    );

    // this.fetchTenantScope = tenantResourceServerReadScope.scopeName;
    // this.fetchAllTenantsScope = tenantResourceServerReadScope.scopeName;
    // this.deleteTenantScope = tenantResourceServerWriteScope.scopeName;
    // this.createTenantScope = tenantResourceServerWriteScope.scopeName;
    // this.updateTenantScope = tenantResourceServerWriteScope.scopeName;
    // this.activateTenantScope = tenantResourceServerWriteScope.scopeName;
    // this.deactivateTenantScope = tenantResourceServerWriteScope.scopeName;

    // Create a Cognito User Pool Domain
    const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
      userPool: userPool,
      cognitoDomain: {
        domainPrefix: `saascontrolplane-${this.node.addr}`,
      },
    });

    const userPoolMachineClient = new cognito.UserPoolClient(this, 'UserPoolMachineClient', {
      userPool: userPool,
      generateSecret: true,
      authFlows: {
        userPassword: false,
        userSrp: false,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: false,
          implicitCodeGrant: false,
          clientCredentials: true,
        },
        scopes: [tenantResourceServerWriteScope],
      },
    });

    const userPoolUserClient = new cognito.UserPoolClient(this, 'UserPoolUserClient', {
      userPool: userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
      oAuth: {
        callbackUrls: [props.controlPlaneCallbackURL || defaultControlPlaneCallbackURL],
        logoutUrls: [props.controlPlaneCallbackURL || defaultControlPlaneCallbackURL],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
          tenantResourceServerReadScope,
          tenantResourceServerWriteScope,
          userResourceServerReadScope,
          userResourceServerWriteScope,
        ],
      },
      writeAttributes: new cognito.ClientAttributes()
        .withStandardAttributes({ email: true })
        .withCustomAttributes('userRole'),
    });

    const createAdminUserFunction = new PythonFunction(this, 'createAdminUserFunction', {
      entry: path.join(__dirname, '../../../resources/functions/auth-custom-resource'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'handler',
      timeout: Duration.seconds(60),
      role: lambdaIdpExecRole,
      layers: [lambdaPowertoolsLayer],
      environment: {
        IDP_NAME: idpName,
      },
    });

    new CustomResource(this, 'createAdminUserCustomResource', {
      serviceToken: createAdminUserFunction.functionArn,
      properties: {
        UserPoolId: userPool.userPoolId,
        SystemAdminRoleName: systemAdminRoleName,
        SystemAdminEmail: props.systemAdminEmail,
      },
    });

    const region = cdk.Stack.of(this).region;
    this.authorizationServer = `https://${userPoolDomain.domainName}.auth.${region}.amazoncognito.com`;
    this.userClientId = userPoolUserClient.userPoolClientId;
    this.machineClientId = userPoolMachineClient.userPoolClientId;
    this.machineClientSecret = userPoolMachineClient.userPoolClientSecret;
    this.wellKnownEndpointUrl = `https://cognito-idp.${region}.amazonaws.com/${userPool.userPoolId}/.well-known/openid-configuration`;
    this.jwtIssuer = `https://cognito-idp.${region}.amazonaws.com/${userPool.userPoolId}`;
    this.jwtAudience = [
      userPoolUserClient.userPoolClientId,
      userPoolMachineClient.userPoolClientId,
    ];
    this.tokenEndpoint = `https://${userPoolDomain.domainName}.auth.${region}.amazoncognito.com/oauth2/token`;

    new cdk.CfnOutput(this, 'ControlPlaneIdpUserPoolId', {
      value: userPool.userPoolId,
      key: 'ControlPlaneIdpUserPoolId',
    });

    new cdk.CfnOutput(this, 'ControlPlaneIdpClientId', {
      value: userPoolUserClient.userPoolClientId,
      key: 'ControlPlaneIdpClientId',
    });

    const userManagementExecRole = new Role(this, 'userManagementExecRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });
    userManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    userManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
    );
    userManagementExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('AWSXrayWriteOnlyAccess')
    );
    userManagementExecRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'cognito-idp:AdminDeleteUser',
          'cognito-idp:AdminEnableUser',
          'cognito-idp:AdminCreateUser',
          'cognito-idp:CreateGroup',
          'cognito-idp:AdminDisableUser',
          'cognito-idp:AdminAddUserToGroup',
          'cognito-idp:GetGroup',
          'cognito-idp:AdminUpdateUserAttributes',
          'cognito-idp:AdminGetUser',
          'cognito-idp:ListUsers',
        ],
        effect: Effect.ALLOW,
        resources: ['*'],
      })
    );

    NagSuppressions.addResourceSuppressions(
      userManagementExecRole,
      [
        {
          id: 'AwsSolutions-IAM5',
          reason: 'Auth user resource name(s) not known beforehand.',
        },
        {
          id: 'AwsSolutions-IAM4',
          reason:
            'Suppress usage of AWSLambdaBasicExecutionRole, CloudWatchLambdaInsightsExecutionRolePolicy, and AWSXrayWriteOnlyAccess.',
          appliesTo: [
            'Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
            'Policy::arn:<AWS::Partition>:iam::aws:policy/AWSXrayWriteOnlyAccess',
          ],
        },
      ],
      true
    );

    const userManagementServices = new PythonFunction(this, 'UserManagementServices', {
      entry: path.join(__dirname, '../../../resources/functions/user-management'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: userManagementExecRole,
      layers: [lambdaPowertoolsLayer],
      environment: {
        IDP_NAME: idpName,
        IDP_DETAILS: JSON.stringify({
          idp: {
            name: idpName,
            userPoolId: userPool.userPoolId,
            clientId: userPoolUserClient.userPoolClientId,
            authorizationServer: this.authorizationServer,
            wellKnownEndpointUrl: this.wellKnownEndpointUrl,
          },
        }),
      },
    });

    this.createUserFunction = userManagementServices;
    this.fetchAllUsersFunction = userManagementServices;
    this.fetchUserFunction = userManagementServices;
    this.updateUserFunction = userManagementServices;
    this.deleteUserFunction = userManagementServices;
    this.disableUserFunction = userManagementServices;
    this.enableUserFunction = userManagementServices;

    // https://github.com/aws/aws-cdk/issues/23204
    NagSuppressions.addResourceSuppressionsByPath(
      cdk.Stack.of(this),
      [
        `/${cdk.Stack.of(this).stackName}/AWS679f53fac002430cb0da5b7982bd2287/ServiceRole/Resource`,
        `/${cdk.Stack.of(this).stackName}/AWS679f53fac002430cb0da5b7982bd2287/Resource`,
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
          id: 'AwsSolutions-L1',
          reason: 'NODEJS 18 is the version used in the official quickstart CFN template.',
        },
      ]
    );
  }
}
