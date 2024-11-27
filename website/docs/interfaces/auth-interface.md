---
sidebar_position: 1
sidebar_label: "IAuth Interface"
---
# IAuth Interface

## Overview

The IAuth interface encapsulates the properties and methods required for authentication and authorization in the application. It provides various configurations and endpoints related to JSON Web Tokens (JWT), OAuth, client IDs, client secrets, and scopes for different operations. Additionally, it includes Lambda functions for managing users.

## Properties

### jwtIssuer

* Type: string
* Description: The JWT issuer domain for the identity provider. This is the domain where the JSON Web Tokens (JWTs) are issued from.

### jwtAudience

* Type: string[]
* Description: The list of recipients (audience) for which the JWT is intended. This will be checked by the API Gateway to ensure only authorized clients are provided access.

### tokenEndpoint

* Type: string
* Description: The endpoint URL for granting OAuth tokens. This is the URL where OAuth tokens can be obtained from the authorization server.

### userClientId

* Type: string
* Description: The client ID enabled for user-centric authentication flows, such as Authorization Code flow. This client ID is used for authenticating end-users.

### machineClientId

* Type: string
* Description: The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow. This client ID is used for authenticating applications or services.

### machineClientSecret

* Type: SecretValue
* Description: The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow. This secret is used in combination with the machine client ID for authenticating applications or services.

### machineClientAudience

* Type: string | undefined
* Description: The audience for the machine client. If provided, this value will be used in the call to generate the access token for the Client Credentials flow.

### fetchTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for fetching a single tenant registration. This scope grants permission to fetch the details of a specific tenant registration.

### fetchAllTenantRegistrationsScope

* Type: string | undefined
* Description: The scope required to authorize requests for fetching all tenants. This scope grants permission to fetch the details of all tenants.

### deleteTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for deleting a tenant registration. This scope grants permission to delete a specific tenant registration.

### createTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for creating a tenant registration. This scope grants permission to create a new tenant registration.

### updateTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for updating a tenant registration. This scope grants permission to update the details of a specific tenant registration.

### activateTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for activating a tenant via the tenant registration endpoint. This scope grants permission to activate a specific tenant.

### deactivateTenantRegistrationScope

* Type: string | undefined
* Description: The scope required to authorize requests for deactivating a tenant via the tenant registration endpoint. This scope grants permission to deactivate a specific tenant.

### fetchUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for fetching a single user. This scope grants permission to fetch the details of a specific user.

### fetchAllUsersScope

* Type: string | undefined
* Description: The scope required to authorize requests for fetching all users. This scope grants permission to fetch the details of all users.

### deleteUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for deleting a user. This scope grants permission to delete a specific user.

### createUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for creating a user. This scope grants permission to create a new user.

### updateUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for updating a user. This scope grants permission to update the details of a specific user.

### disableUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for disabling a user. This scope grants permission to disable a specific user.

### enableUserScope

* Type: string | undefined
* Description: The scope required to authorize requests for enabling a user. This scope grants permission to enable a specific user.

### wellKnownEndpointUrl

* Type: string
* Description: The well-known endpoint URL for the control plane identity provider. This URL provides configuration information about the identity provider, such as issuer, authorization endpoint, and token endpoint.

### createUserFunction

* Type: IFunction
* Description: The Lambda function for creating a user. (POST /users)

### fetchAllUsersFunction

* Type: IFunction
* Description: The Lambda function for fetching all users. (GET /users)

### fetchUserFunction

* Type: IFunction
* Description: The Lambda function for fetching a user. (GET /user/\{userId})

### updateUserFunction

* Type: IFunction
* Description: The Lambda function for updating a user. (PUT /user/\{userId})

### deleteUserFunction

* Type: IFunction
* Description: The Lambda function for deleting a user. (DELETE /user/\{userId})

### disableUserFunction

* Type: IFunction
* Description: The Lambda function for disabling a user. (PUT /user/\{userId}/disable)

### enableUserFunction

* Type: IFunction
* Description: The Lambda function for enabling a user. (PUT /user/\{userId}/enable)

## Methods

### createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void

* Description: Function to create an admin user.
* Parameters:
  * scope (Construct): The scope in which the admin user should be created.
  * id (string): The unique identifier for the admin user.
  * props (CreateAdminUserProps): An object containing the properties for creating the admin user.

The CreateAdminUserProps interface has the following properties:

* name (string): The name of the new admin user.
* email (string): The email address of the new admin user.
* role (string): The name of the role of the new admin user.

## Usage

To use the IAuth interface, you'll need to implement it and provide the required configurations and Lambda functions. Here's an example of how you might use it:

```typescript
import { IAuth, CreateAdminUserProps } from './auth-interface';

class MyAuth implements IAuth {
  // Implement the properties and methods of the IAuth interface
  // ...

  createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void {
    // Implement the logic to create an admin user
    // ...
  }
}

const myAuth = new MyAuth();

// Use the properties and methods of the IAuth interface
const jwtIssuer = myAuth.jwtIssuer;
const tokenEndpoint = myAuth.tokenEndpoint;

// Create an admin user
const adminUserProps: CreateAdminUserProps = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Admin',
};
myAuth.createAdminUser(this, 'AdminUser', adminUserProps);
