// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SecretValue } from 'aws-cdk-lib';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/**
 * Encapsulates the list of properties expected as inputs for creating
 * new admin users.
 */
export interface CreateAdminUserProps {
  /**
   * The email address of the new admin user.
   */
  readonly name: string;

  /**
   * The email address of the new admin user.
   */
  readonly email: string;

  /**
   * The name of the role of the new admin user.
   */
  readonly role: string;
}

/**
 * Encapsulates the list of properties expected as outputs of Auth plugins
 */
export interface IAuth {
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
   * The audience for the machine client.
   * If provided, this value will be used in the call to generate the access token
   * for the Client Credentials flow.
   */
  readonly machineClientAudience?: string;

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
   * Function to create an admin user.
   */
  createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void;
}
