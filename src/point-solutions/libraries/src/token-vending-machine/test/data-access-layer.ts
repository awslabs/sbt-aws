// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { AwsCredentialIdentity } from "@smithy/types";
import { v4 as uuidv4 } from "uuid";
import { TokenVendingMachine } from "../src/token-vending-machine";

exports.handler = async (event: any, context: any) => {
  try {
    console.log(event);
    console.log(context);
    const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

    // 1. create tenant1 and tenant2 users
    const tenant1TenantId: string = uuidv4();
    const tenant2TenantId: string = uuidv4();

    const tenant1User: string = `tenantuser-${tenant1TenantId}`;
    const tenant2User: string = `tenantuser-${tenant2TenantId}`;
    await createTenantUser(tenant1User, client);
    await createTenantUser(tenant2User, client);
    const tenant1JWT: string = await getJWT(client, tenant1User);
    const tenant2JWT: string = await getJWT(client, tenant2User);

    const tvm: TokenVendingMachine = new TokenVendingMachine(true);

    const responses: string[] = [];

    // 2. insert data for tenant1 and tenant2
    responses.push(await insertData(tenant1TenantId, tenant1JWT, tvm));
    responses.push(await insertData(tenant2TenantId, tenant2JWT, tvm));

    // 3. access tenant1 data using tenant2 JWT token
    responses.push(
      await accessCrossTenantData(tenant1JWT, tenant2TenantId, tvm),
    );
    return { statusCode: 200, body: JSON.stringify(responses) };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify(error.message) };
  }
};

async function createTenantUser(
  username: string,
  client: CognitoIdentityProviderClient,
) {
  const index: number = username.indexOf("-");
  const tenantUUID = username.substring(index + 1);
  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.USERPOOL_ID,
    Username: username,
    MessageAction: "SUPPRESS",
    UserAttributes: [
      {
        Name: "email",
        Value: "test@example.com",
      },
      {
        Name: "custom:tenantId",
        Value: tenantUUID,
      },
    ],
  });

  await client.send(command);
  const setPasswordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: process.env.USERPOOL_ID,
    Username: username,
    Password: "Test$1234!",
    Permanent: true,
  });
  await client.send(setPasswordCommand);

  return username;
}

async function getJWT(client: CognitoIdentityProviderClient, username: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: username,
      PASSWORD: "Test$1234!",
    },
    ClientId: process.env.APPCLIENT_ID,
  });

  const response = await client.send(command);
  const idToken = response.AuthenticationResult?.IdToken;
  if (idToken === undefined) {
    throw new Error("idToken is undefined");
  }
  return idToken;
}

async function insertData(
  tenantId: string,
  jwt: string,
  tvm: TokenVendingMachine,
): Promise<string> {
  const response = await tvm
    .assumeRole(jwt, 900)
    .then(async (creds: string) => {
      const credsJson = JSON.parse(creds);

      const dynamodbCreds: AwsCredentialIdentity = {
        accessKeyId: credsJson.AccessKeyId,
        secretAccessKey: credsJson.SecretAccessKey,
        sessionToken: credsJson.SessionToken,
      };

      const client = new DynamoDBClient({
        region: "us-east-1",
        credentials: dynamodbCreds,
      });
      const command = new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          tenantId: { S: tenantId },
          name: { S: "test" },
          description: { S: "test description" },
        },
      });

      await client.send(command);

      return `Successfully inserted data for tenantId:${tenantId}`;
    })
    .catch((error: any) => {
      console.log(error);
      throw error;
    });

  return response;
}

async function accessCrossTenantData(
  jwt1: string,
  tenantId2: string,
  tvm: TokenVendingMachine,
): Promise<string> {
  const tvmResponse = await tvm
    .assumeRole(jwt1, 900)
    .then(async (creds: string) => {
      const credsJson = JSON.parse(creds);

      const dynamodbCreds: AwsCredentialIdentity = {
        accessKeyId: credsJson.AccessKeyId,
        secretAccessKey: credsJson.SecretAccessKey,
        sessionToken: credsJson.SessionToken,
      };

      const client = new DynamoDBClient({
        region: "us-east-1",
        credentials: dynamodbCreds,
      });
      const command = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "tenantId = :id",
        ExpressionAttributeValues: {
          ":id": { S: tenantId2 },
        },
      });

      const response = await client
        .send(command)
        .then((data: any) => {
          console.log(data);
          throw new Error(
            "Error: Successfully executed cross tenant data access",
          );
        })
        .catch((error: any) => {
          console.log(error);
          if (error.name === "AccessDeniedException") {
            return "Got expected AccessDeniedException";
          }
          throw error;
        });

      return response;
    })
    .catch((error: any) => {
      console.log(error);
      throw error;
    });

  return tvmResponse;
}
