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
import { CreateAdminUserProps, IAuth } from './auth-interface';
import { setupCognitoAuthCLI } from './cli-auth';
import { addTemplateTag } from '../../utils';

/**
 * Properties for the CognitoAuth construct.
 */
export interface CognitoAuthProps {
  /**
   * The callback URL for the control plane.
   * @default 'http://localhost'
   */
  readonly controlPlaneCallbackURL?: string;

  /**
   * Whether or not to specify scopes for validation at the API GW.
   * Can be used for testing purposes.
   * @default true
   */
  readonly setAPIGWScopes?: boolean;

  /**
   * Parameters for CLI authentication setup
   */
  readonly cliProps?: {
    /**
     * The ID of the hosted zone in Route 53 where the domain is registered.
     */
    hostedZoneId: string;

    /**
     * The fully qualified domain name (FQDN)
     */
    fqdn: string;

    /**
     * The ARN of the SSL/TLS certificate
     */
    certificateArn: string;

    /**
     * The domain prefix for the Cognito User Pool domain.
     */
    cognitoDomain: string;

    /**
     * Initalize as a string-indexed map for properties
     */
    [key: string]: string;
  };
}

/**
 * Constructs for setting up Cognito authentication and user management.
 */
export class CognitoAuth extends Construct implements IAuth {
  /**
   * The JWT issuer domain for the identity provider.
   * This is the domain where the JSON Web Tokens (JWTs) are issued from.
   */
  readonly jwtIssuer: string;

  /**
   * The list of recipients (audience) for which the JWT is intended.
   * This will be checked by the API GW to ensure only authorized
   * clients are provided access.
   */
  readonly jwtAudience: string[];

  /**
   * The endpoint URL for granting OAuth tokens.
   * This is the URL where OAuth tokens can be obtained from the authorization server.
   */
  readonly tokenEndpoint: string;

  /**
   * The client ID enabled for user-centric authentication flows, such as Authorization Code flow.
   * This client ID is used for authenticating end-users.
   */
  readonly userClientId: string;

  /**
   * The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow.
   * This client ID is used for authenticating applications or services.
   */
  readonly machineClientId: string;

  /**
   * The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow.
   * This secret is used in combination with the machine client ID for authenticating applications or services.
   */
  readonly machineClientSecret: SecretValue;

  /**
   * The scope required to authorize requests for fetching a single tenant.
   * This scope grants permission to fetch the details of a specific tenant.
   */
  readonly fetchTenantScope?: string;

  /**
   * The scope required to authorize requests for fetching all tenants.
   * This scope grants permission to fetch the details of all tenants.
   */
  readonly fetchAllTenantsScope?: string;

  /**
   * The scope required to authorize requests for deleting a tenant.
   * This scope grants permission to delete a specific tenant.
   */
  readonly deleteTenantScope?: string;

  /**
   * The scope required to authorize requests for creating a tenant.
   * This scope grants permission to create a new tenant.
   */
  readonly createTenantScope?: string;

  /**
   * The scope required to authorize requests for updating a tenant.
   * This scope grants permission to update the details of a specific tenant.
   */
  readonly updateTenantScope?: string;

  /**
   * The scope required to authorize requests for activating a tenant.
   * This scope grants permission to activate a specific tenant.
   */
  readonly activateTenantScope?: string;

  /**
   * The scope required to authorize requests for deactivating a tenant.
   * This scope grants permission to deactivate a specific tenant.
   */
  readonly deactivateTenantScope?: string;

  /**
   * The scope required to authorize requests for fetching a single user.
   * This scope grants permission to fetch the details of a specific user.
   */
  readonly fetchUserScope?: string;

  /**
   * The scope required to authorize requests for fetching all users.
   * This scope grants permission to fetch the details of all users.
   */
  readonly fetchAllUsersScope?: string;

  /**
   * The scope required to authorize requests for deleting a user.
   * This scope grants permission to delete a specific user.
   */
  readonly deleteUserScope?: string;

  /**
   * The scope required to authorize requests for creating a user.
   * This scope grants permission to create a new user.
   */
  readonly createUserScope?: string;

  /**
   * The scope required to authorize requests for updating a user.
   * This scope grants permission to update the details of a specific user.
   */
  readonly updateUserScope?: string;

  /**
   * The scope required to authorize requests for disabling a user.
   * This scope grants permission to disable a specific user.
   */
  readonly disableUserScope?: string;

  /**
   * The scope required to authorize requests for enabling a user.
   * This scope grants permission to enable a specific user.
   */
  readonly enableUserScope?: string;

  /**
   * The well-known endpoint URL for the control plane identity provider.
   * This URL provides configuration information about the identity provider, such as issuer, authorization endpoint, and token endpoint.
   */
  readonly wellKnownEndpointUrl: string;

  /**
   * The Lambda function for creating a user. -- POST /users
   */
  readonly createUserFunction: IFunction;

  /**
   * The Lambda function for fetching all users -- GET /users
   */
  readonly fetchAllUsersFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * The Lambda function for fetching a user. -- GET /user/{userId}
   */
  readonly fetchUserFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * The Lambda function for updating a user. -- PUT /user/{userId}
   */
  readonly updateUserFunction: IFunction;

  /**
   * The Lambda function for deleting a user. -- DELETE /user/{userId}
   */
  readonly deleteUserFunction: IFunction;

  /**
   * The Lambda function for disabling a user. -- PUT /user/{userId}/disable
   */
  readonly disableUserFunction: IFunction;

  /**
   * The Lambda function for enabling a user. -- PUT /user/{userId}/enable
   */
  readonly enableUserFunction: IFunction;

  /**
   * UserPool created as part of this construct.
   */
  readonly userPool: cognito.UserPool;

  /**
   * The Lambda function for creating a new Admin User. This is used as part of a
   * custom resource in CloudFormation to create an admin user.
   */
  private readonly createAdminUserFunction: IFunction;

  constructor(scope: Construct, id: string, props?: CognitoAuthProps) {
    super(scope, id);
    addTemplateTag(this, 'CognitoAuth');

    // https://docs.powertools.aws.dev/lambda/python/2.31.0/#lambda-layer

    this.jwtAudience = [];

    const lambdaPowertoolsLayer = LayerVersion.fromLayerVersionArn(
      this,
      'LambdaPowerTools',
      `arn:aws:lambda:${Stack.of(this).region}:017000801446:layer:AWSLambdaPowertoolsPythonV2:59`
    );
    const defaultControlPlaneCallbackURL = 'http://localhost';
    const controlPlaneCallbackURL =
      props?.controlPlaneCallbackURL || defaultControlPlaneCallbackURL;

    this.userPool = new cognito.UserPool(this, 'UserPool', {
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
        emailBody: `Login into control plane UI at ${controlPlaneCallbackURL} with username {username} and temporary password {####}`,
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

    if (props?.cliProps) {
      setupCognitoAuthCLI(this, props.cliProps, this.userPool, this.jwtAudience);
      this.tokenEndpoint = `https://${props.cliProps.cognitoDomain}.auth.${Stack.of(this).region}.amazoncognito.com/oauth2/token`;
    } else {
      const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', {
        userPool: this.userPool,
        cognitoDomain: {
          domainPrefix: `${cdk.Stack.of(this).account}-${this.node.addr}`,
        },
      });
      this.tokenEndpoint = `https://${userPoolDomain.domainName}.auth.${Stack.of(this).region}.amazoncognito.com/oauth2/token`;
    }

    NagSuppressions.addResourceSuppressions(this.userPool, [
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

    const userResourceServer = this.userPool.addResourceServer('UserResourceServer', {
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

    if (props?.setAPIGWScopes != false) {
      this.fetchUserScope = userResourceServerReadScope.scopeName;
      this.fetchAllUsersScope = userResourceServerReadScope.scopeName;
      this.deleteUserScope = userResourceServerWriteScope.scopeName;
      this.createUserScope = userResourceServerWriteScope.scopeName;
      this.updateUserScope = userResourceServerWriteScope.scopeName;
      this.disableUserScope = userResourceServerWriteScope.scopeName;
      this.enableUserScope = userResourceServerWriteScope.scopeName;
    }

    const readTenantScope = new cognito.ResourceServerScope({
      scopeName: 'tenant_read',
      scopeDescription: 'Read access to tenants.',
    });

    const writeTenantScope = new cognito.ResourceServerScope({
      scopeName: 'tenant_write',
      scopeDescription: 'Write access to tenants.',
    });

    const tenantResourceServer = this.userPool.addResourceServer('TenantResourceServer', {
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

    if (props?.setAPIGWScopes != false) {
      this.fetchTenantScope = tenantResourceServerReadScope.scopeName;
      this.fetchAllTenantsScope = tenantResourceServerReadScope.scopeName;
      this.deleteTenantScope = tenantResourceServerWriteScope.scopeName;
      this.createTenantScope = tenantResourceServerWriteScope.scopeName;
      this.updateTenantScope = tenantResourceServerWriteScope.scopeName;
      this.activateTenantScope = tenantResourceServerWriteScope.scopeName;
      this.deactivateTenantScope = tenantResourceServerWriteScope.scopeName;
    }

    const userPoolMachineClient = new cognito.UserPoolClient(this, 'UserPoolMachineClient', {
      userPool: this.userPool,
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
      userPool: this.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
      oAuth: {
        callbackUrls: [controlPlaneCallbackURL],
        logoutUrls: [controlPlaneCallbackURL],
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

    const region = cdk.Stack.of(this).region;
    this.userClientId = userPoolUserClient.userPoolClientId;
    this.machineClientId = userPoolMachineClient.userPoolClientId;
    this.machineClientSecret = userPoolMachineClient.userPoolClientSecret;
    this.wellKnownEndpointUrl = `https://cognito-idp.${region}.amazonaws.com/${this.userPool.userPoolId}/.well-known/openid-configuration`;
    this.jwtIssuer = `https://cognito-idp.${region}.amazonaws.com/${this.userPool.userPoolId}`;
    this.jwtAudience.push(userPoolUserClient.userPoolClientId);
    this.jwtAudience.push(userPoolMachineClient.userPoolClientId);

    // TODO: The caller should be surfacing these, not the implementor
    new cdk.CfnOutput(this, 'ControlPlaneIdpUserPoolId', {
      value: this.userPool.userPoolId,
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
          'cognito-idp:AdminDisableUser',
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
        USER_POOL_ID: this.userPool.userPoolId,
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

    this.createAdminUserFunction = new PythonFunction(this, 'createAdminUserFunction', {
      entry: path.join(__dirname, '../../../resources/functions/auth-custom-resource'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'handler',
      timeout: Duration.seconds(60),
      layers: [lambdaPowertoolsLayer],
    });
    this.userPool.grant(
      this.createAdminUserFunction,
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminDeleteUser'
    );

    NagSuppressions.addResourceSuppressions(
      this.createAdminUserFunction.role!,
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
      true // applyToChildren = true, so that it applies to policies created for the role.
    );
  }

  createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps) {
    new CustomResource(scope, `createAdminUserCustomResource-${id}`, {
      serviceToken: this.createAdminUserFunction.functionArn,
      properties: {
        UserPoolId: this.userPool.userPoolId,
        Name: props.name,
        Email: props.email,
        Role: props.role,
      },
    });
  }
}
