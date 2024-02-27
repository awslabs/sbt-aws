// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonFunction } from '@aws-cdk/aws-lambda-python-alpha';
import { CfnOutput, CustomResource, Duration } from 'aws-cdk-lib';
import { IAuthorizer, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  Effect,
} from 'aws-cdk-lib/aws-iam';
import { Runtime, IFunction } from 'aws-cdk-lib/aws-lambda';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { LambdaLayers } from './lambda-layers';

export interface IAuth {
  authorizer: IAuthorizer;
  controlPlaneIdpDetails: string;
  authorizationServer: string;
  clientId: string;
  wellKnownEndpointUrl: string;
  createUserFunction: IFunction;
  fetchAllUsersFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000
  fetchUserFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000
  updateUserFunction: IFunction;
  deleteUserFunction: IFunction;
  disableUserFunction: IFunction;
  enableUserFunction: IFunction;
}

export interface CognitoAuthProps {
  readonly idpName: string;
  readonly controlPlaneCallbackURL?: string;
  readonly systemAdminRoleName: string;
  readonly systemAdminEmail: string;
}

export class CognitoAuth extends Construct implements IAuth {
  authorizer: IAuthorizer;
  controlPlaneIdpDetails: string;
  authorizationServer: string;
  clientId: string;
  wellKnownEndpointUrl: string;
  createUserFunction: IFunction;
  fetchAllUsersFunction: IFunction;
  fetchUserFunction: IFunction;
  updateUserFunction: IFunction;
  deleteUserFunction: IFunction;
  disableUserFunction: IFunction;
  enableUserFunction: IFunction;

  constructor(scope: Construct, id: string, props: CognitoAuthProps) {
    super(scope, id);
    const defaultControlPlaneCallbackURL = 'http://localhost';

    const lambdaLayers = new LambdaLayers(this, 'controlplane-lambda-layers');
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
        entry: path.join(__dirname, '../../resources/custom-resources/'),
        runtime: Runtime.PYTHON_3_12,
        index: 'create_control_plane_idp.py',
        handler: 'handler',
        timeout: Duration.seconds(60),
        role: lambdaIdpExecRole,
        layers: [lambdaLayers.controlPlaneLambdaLayer],
        environment: {
          IDP_NAME: props.idpName,
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
          SystemAdminRoleName: props.systemAdminRoleName,
          SystemAdminEmail: props.systemAdminEmail,
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
      exportName: 'ControlPlaneIdpDetails',
    });
    const customAuthorizerFunction = new PythonFunction(this, 'CustomAuthorizerFunction', {
      entry: path.join(__dirname, '../../resources/functions/'),
      runtime: Runtime.PYTHON_3_12,
      index: 'custom_authorizer.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: lambdaIdpExecRole,
      layers: [lambdaLayers.controlPlaneLambdaLayer],
      environment: {
        IDP_NAME: props.idpName,
        IDP_DETAILS: this.controlPlaneIdpDetails,
        SYS_ADMIN_ROLE_NAME: props.systemAdminRoleName,
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
      entry: path.join(__dirname, '../../resources/functions/'),
      runtime: Runtime.PYTHON_3_12,
      index: 'user_management.py',
      handler: 'lambda_handler',
      timeout: Duration.seconds(60),
      role: userManagementExecRole,
      layers: [lambdaLayers.controlPlaneLambdaLayer],
      environment: {
        IDP_NAME: props.idpName,
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
