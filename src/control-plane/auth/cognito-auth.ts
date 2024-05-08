// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { CfnOutput, CustomResource, Duration, Stack } from 'aws-cdk-lib';
import { IAuthorizer, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
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
   * The API Gateway authorizer for authenticating requests.
   */
  public readonly authorizer: IAuthorizer;

  /**
   * The details of the control plane Identity Provider (IdP).
   */
  public readonly controlPlaneIdpDetails: any;

  /**
   * The authorization server for the control plane IdP.
   */
  public readonly authorizationServer: string;

  /**
   * The client ID for the control plane IdP.
   */
  public readonly clientId: string;

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
          'cognito-idp:CreateUserPoolDomain',
          'cognito-idp:AdminCreateUser',
          'cognito-idp:CreateUserPoolClient',
          'cognito-idp:CreateGroup',
          'cognito-idp:CreateUserPool',
          'cognito-idp:AdminAddUserToGroup',
          'cognito-idp:GetGroup',
          'cognito-idp:DeleteUserPool',
          'cognito-idp:DescribeUserPool',
          'cognito-idp:DeleteUserPoolDomain',
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

    const createControlPlaneIdpFunction = new PythonFunction(
      this,
      'createControlPlaneIdpFunction',
      {
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
      }
    );

    const createControlPlaneIdpCustomResource = new CustomResource(
      this,
      'createControlPlaneIdpCustomResource',
      {
        serviceToken: createControlPlaneIdpFunction.functionArn,
        properties: {
          ControlPlaneCallbackURL: props.controlPlaneCallbackURL || defaultControlPlaneCallbackURL,
          SystemAdminRoleName: systemAdminRoleName,
          SystemAdminEmail: props.systemAdminEmail,
          UserPoolName: `SaaSControlPlaneUserPool-${this.node.addr}`,
        },
      }
    );

    this.controlPlaneIdpDetails = createControlPlaneIdpCustomResource.getAttString('IdpDetails');
    this.authorizationServer =
      createControlPlaneIdpCustomResource.getAttString('AuthorizationServer');
    this.clientId = createControlPlaneIdpCustomResource.getAttString('ClientId');
    this.wellKnownEndpointUrl =
      createControlPlaneIdpCustomResource.getAttString('WellKnownEndpointUrl');

    new CfnOutput(this, 'ControlPlaneIdpDetails', {
      value: this.controlPlaneIdpDetails,
      key: 'ControlPlaneIdpDetails',
    });

    const customAuthorizerFunction = new PythonFunction(this, 'CustomAuthorizerFunction', {
      entry: path.join(__dirname, '../../../resources/functions/authorizer'),
      runtime: Runtime.PYTHON_3_12,
      index: 'index.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: lambdaIdpExecRole,
      layers: [lambdaPowertoolsLayer],
      environment: {
        IDP_NAME: idpName,
        IDP_DETAILS: this.controlPlaneIdpDetails,
        SYS_ADMIN_ROLE_NAME: systemAdminRoleName,
      },
    });
    customAuthorizerFunction.node.addDependency(createControlPlaneIdpCustomResource);
    this.authorizer = new TokenAuthorizer(this, 'CustomAuthorizer', {
      handler: customAuthorizerFunction,
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
        IDP_DETAILS: this.controlPlaneIdpDetails,
      },
    });

    this.createUserFunction = userManagementServices;
    this.fetchAllUsersFunction = userManagementServices;
    this.fetchUserFunction = userManagementServices;
    this.updateUserFunction = userManagementServices;
    this.deleteUserFunction = userManagementServices;
    this.disableUserFunction = userManagementServices;
    this.enableUserFunction = userManagementServices;
  }
}
