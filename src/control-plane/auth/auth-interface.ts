// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { SecretValue } from 'aws-cdk-lib';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/**
 * Encapsulates the list of properties expected as outputs of Auth plugins
 */
export interface IAuth {
  /**
   * Authorization server Url
   */
  readonly authorizationServer: string;

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
   * OpenID configuration Url
   */
  readonly wellKnownEndpointUrl: string;

  /**
   * Function referenced by the ControlPlaneAPI -- POST /users
   */
  readonly createUserFunction: IFunction;

  /**
   * Function referenced by the ControlPlaneAPI -- GET /users
   */
  readonly fetchAllUsersFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * Function referenced by the ControlPlaneAPI -- GET /user/{username}
   */
  readonly fetchUserFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * Function referenced by the ControlPlaneAPI -- PUT /user/{username}
   */
  readonly updateUserFunction: IFunction;

  /**
   * Function referenced by the ControlPlaneAPI -- DELETE /user/{username}
   */
  readonly deleteUserFunction: IFunction;

  /**
   * Function referenced by the ControlPlaneAPI -- PUT /user/{username}/disable
   */
  readonly disableUserFunction: IFunction;

  /**
   * Function referenced by the ControlPlaneAPI -- PUT /user/{username}/enable
   */
  readonly enableUserFunction: IFunction;
}
