// resources/functions/auth-device-grant/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const cognito = new CognitoIdentityProviderClient({});
const ddbClient = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(ddbClient);

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    // Handle device authorization endpoint
    if (path === '/device' && method === 'GET') {
      return await handleDeviceAuth();
    }

    // Handle token endpoint
    if (path === '/token' && method === 'POST') {
      return await handleToken(event);
    }

    // Handle callback endpoint
    if (path === '/callback' && method === 'GET') {
      return await handleCallback(event);
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Not Found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}

async function handleDeviceAuth(): Promise<APIGatewayProxyResultV2> {
  // Generate device and user codes
  const deviceCode = generateRandomString(64);
  const userCode = generateRandomString(8).toUpperCase();

  // Store codes in DynamoDB
  await dynamodb.send(new PutCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Item: {
      Device_code: deviceCode,
      User_code: userCode,
      AuthZ_State: 'pending',
      Creation_date: new Date().toISOString(),
      Expiration_date: new Date(Date.now() + 600000).toISOString(), // 10 minutes
    },
  }));

  // Return verification URI and codes
  return {
    statusCode: 200,
    body: JSON.stringify({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: `https://${process.env.COGNITO_OAUTH_DOMAIN}/oauth2/authorize?response_type=code&client_id=${process.env.APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.VERIFICATION_URI!)}&state=${deviceCode}`,
      expires_in: 600,
      interval: 5,
    }),
  };
}

async function handleToken(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = JSON.parse(event.body || '{}');
  const deviceCode = body.device_code;

  // Check device code in DynamoDB
  const result = await dynamodb.send(new GetCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: { Device_code: deviceCode },
  }));

  if (!result.Item || result.Item.AuthZ_State !== 'authorized') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'authorization_pending' }),
    };
  }

  // Exchange authorization code for tokens
  try {
    const tokens = await cognito.send(new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.APP_CLIENT_ID!,
      AuthParameters: {
        REFRESH_TOKEN: result.Item.refresh_token,
      },
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(tokens.AuthenticationResult),
    };
  } catch (error) {
    console.error('Error exchanging token:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'invalid_grant' }),
    };
  }
}

async function handleCallback(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const queryParams = event.queryStringParameters || {};
  const code = queryParams.code;
  const state = queryParams.state;

  if (!code || !state) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid callback parameters' }),
    };
  }

  // Update device grant status in DynamoDB
  await dynamodb.send(new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: { Device_code: state },
    UpdateExpression: 'SET AuthZ_State = :state, authorization_code = :code',
    ExpressionAttributeValues: {
      ':state': 'authorized',
      ':code': code,
    },
  }));

  return {
    statusCode: 200,
    body: 'Device authorized successfully. You can close this window.',
  };
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
