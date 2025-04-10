#!/usr/bin/env node

/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from "aws-cdk-lib";
import {
  UserPool,
  StringAttribute,
  UserPoolClient,
  ClientAttributes,
  OAuthScope,
} from "aws-cdk-lib/aws-cognito";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import {
  Role,
  ServicePrincipal,
  ManagedPolicy,
  PolicyStatement,
  ArnPrincipal,
  Effect,
} from "aws-cdk-lib/aws-iam";
//import { Runtime, LayerVersion, Code } from 'aws-cdk-lib/aws-lambda';
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
// import { DestroyPolicySetter } from "../../../cdk-aspect/destroy-policy-setter";

export interface IntegStackProps extends cdk.StackProps {
  email: string;
}

export class IntegStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: IntegStackProps) {
    super(scope, id, props);

    const region = this.region;

    // const layer = new LayerVersion(this, 'Layer', {
    //   code: Code.fromAsset(path.join(__dirname, 'src'), {
    //     bundling: {
    //       image: Runtime.NODEJS_18_X.bundlingImage,
    //       command: [
    //         'bash',
    //         '-c',
    //         [
    //           'pwd',
    //           'cd ..',
    //           'npm install -g npm@latest',
    //           'npm install',
    //           'chmod -R 755 ./node_modules',
    //         ].join(' && '),
    //       ],
    //     },
    //   }),
    //   compatibleRuntimes: [Runtime.NODEJS_18_X],
    // });

    const testFunctionExecRole = new Role(this, "tenantManagementExecRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    testFunctionExecRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaBasicExecutionRole",
      ),
    );

    const abacRole = new Role(this, "abacRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    abacRole.assumeRolePolicy?.addStatements(
      new PolicyStatement({
        actions: ["sts:AssumeRole", "sts:TagSession"],
        effect: Effect.ALLOW,
        principals: [new ArnPrincipal(testFunctionExecRole.roleArn)],
        conditions: {
          StringLike: {
            "aws:RequestTag/TenantId": "*",
          },
        },
      }),
    );

    const table = new Table(this, "Table", {
      billingMode: BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      partitionKey: {
        name: "tenantId",
        type: AttributeType.STRING,
      },
    });

    abacRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
        ],
        resources: [table.tableArn],
        conditions: {
          "ForAllValues:StringEquals": {
            "dynamodb:LeadingKeys": ["${aws:PrincipalTag/TenantId}"],
          },
        },
      }),
    );

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: "TestUserPool",
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
        },
      },
      customAttributes: {
        tenantId: new StringAttribute({ mutable: false }),
      },
    });
    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool: userPool,
      userPoolClientName: "TestUserPoolClient",
      generateSecret: false,
      authFlows: {
        userPassword: true,
        userSrp: true,
        adminUserPassword: true,
        custom: true,
      },
      writeAttributes: new ClientAttributes()
        .withStandardAttributes({
          email: true,
        })
        .withCustomAttributes("custom:tenantId"),
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.OPENID, OAuthScope.PROFILE],
      },
    });

    testFunctionExecRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:InitiateAuth",
        ],
        resources: [userPool.userPoolArn],
      }),
    );

    const idp_details = {
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPool.userPoolId}/`,
      audience: userPoolClient.userPoolClientId,
    };

    new NodejsFunction(this, "TestFunction", {
      entry:
        "point-solutions/libraries/token-vending-machine/test/data-access-layer.ts",
      handler: "handler",
      runtime: Runtime.NODEJS_LATEST,
      role: testFunctionExecRole,
      timeout: cdk.Duration.minutes(1),
      environment: {
        IAM_ROLE_ARN: abacRole.roleArn,
        IDP_DETAILS: JSON.stringify(idp_details),
        REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES: '{"TenantId":"custom:tenantId"}',
        USERPOOL_ID: userPool.userPoolId,
        APPCLIENT_ID: userPoolClient.userPoolClientId,
        TABLE_NAME: table.tableName,
      },
    });
  }
}

if (!process.env.CDK_PARAM_EMAIL) {
  throw new Error("Please provide email");
}

const app = new cdk.App();
// const integStack =
new IntegStack(app, "token-vending-machine-integ", {
  email: process.env.CDK_PARAM_EMAIL,
});

// Ensure that we remove all resources (like DDB tables, s3 buckets) when deleting the stack.
// cdk.Aspects.of(integStack).add(new DestroyPolicySetter());
