// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IAuthorizer } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/**
 * Encapsulates the list of properties expected as outputs of Auth plugins
 */
export interface IAuth {
  /**
   * Authorizer referenced by the ControlPlaneAPI
   */
  readonly authorizer: IAuthorizer;

  /**
   * Contains any information relevant to the IDP implementation required by the Authorizer and User Function implementations
   */
  readonly controlPlaneIdpDetails: any;

  /**
   * Authorization server Url
   */
  readonly authorizationServer: string;

  /**
   * The OAuth clientId for the identity provider
   */
  readonly clientId: string;

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
