# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AWSMarketplaceSaaSProduct <a name="AWSMarketplaceSaaSProduct" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct"></a>

Construct for creating an AWS Marketplace SaaS product.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer"></a>

```typescript
import { AWSMarketplaceSaaSProduct } from '@cdklabs/sbt-aws'

new AWSMarketplaceSaaSProduct(scope: Construct, id: string, props: AWSMarketplaceSaaSProductProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The scope in which to define this construct. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.id">id</a></code> | <code>string</code> | - The unique identifier for this construct. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps">AWSMarketplaceSaaSProductProps</a></code> | - The properties for configuring the AWS Marketplace SaaS product. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.id"></a>

- *Type:* string

The unique identifier for this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps">AWSMarketplaceSaaSProductProps</a>

The properties for configuring the AWS Marketplace SaaS product.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.isConstruct"></a>

```typescript
import { AWSMarketplaceSaaSProduct } from '@cdklabs/sbt-aws'

AWSMarketplaceSaaSProduct.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.registerCustomerAPI">registerCustomerAPI</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApi</code> | The API Gateway REST API for registering customers. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.subscribersTable">subscribersTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | The DynamoDB table for storing subscriber information. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.userProvidedRequiredFieldsForRegistration">userProvidedRequiredFieldsForRegistration</a></code> | <code>string[]</code> | The list of required user-provided fields for registration. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `registerCustomerAPI`<sup>Required</sup> <a name="registerCustomerAPI" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.registerCustomerAPI"></a>

```typescript
public readonly registerCustomerAPI: RestApi;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApi

The API Gateway REST API for registering customers.

---

##### `subscribersTable`<sup>Required</sup> <a name="subscribersTable" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.subscribersTable"></a>

```typescript
public readonly subscribersTable: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

The DynamoDB table for storing subscriber information.

---

##### `userProvidedRequiredFieldsForRegistration`<sup>Required</sup> <a name="userProvidedRequiredFieldsForRegistration" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProduct.property.userProvidedRequiredFieldsForRegistration"></a>

```typescript
public readonly userProvidedRequiredFieldsForRegistration: string[];
```

- *Type:* string[]

The list of required user-provided fields for registration.

This contains the set of fields that must be provided by the user
when registering a new customer.

---


### BashJobRunner <a name="BashJobRunner" id="@cdklabs/sbt-aws.BashJobRunner"></a>

Provides a BashJobRunner to execute arbitrary bash code.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.BashJobRunner.Initializer"></a>

```typescript
import { BashJobRunner } from '@cdklabs/sbt-aws'

new BashJobRunner(scope: Construct, id: string, props: BashJobRunnerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps">BashJobRunnerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.BashJobRunner.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.BashJobRunnerProps">BashJobRunnerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.BashJobRunner.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.BashJobRunner.isConstruct"></a>

```typescript
import { BashJobRunner } from '@cdklabs/sbt-aws'

BashJobRunner.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.BashJobRunner.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.codebuildProject">codebuildProject</a></code> | <code>aws-cdk-lib.aws_codebuild.Project</code> | The codebuildProject used to implement this BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.eventTarget">eventTarget</a></code> | <code>aws-cdk-lib.aws_events.IRuleTarget</code> | The eventTarget to use when triggering this BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.incomingEvent">incomingEvent</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | The incoming event DetailType that triggers this job. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.provisioningStateMachine">provisioningStateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.StateMachine</code> | The StateMachine used to implement this BashJobRunner orchestration. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunner.property.environmentVariablesToOutgoingEvent">environmentVariablesToOutgoingEvent</a></code> | <code>string[]</code> | The environment variables to export into the outgoing event once the BashJobRunner has finished. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.BashJobRunner.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `codebuildProject`<sup>Required</sup> <a name="codebuildProject" id="@cdklabs/sbt-aws.BashJobRunner.property.codebuildProject"></a>

```typescript
public readonly codebuildProject: Project;
```

- *Type:* aws-cdk-lib.aws_codebuild.Project

The codebuildProject used to implement this BashJobRunner.

---

##### `eventTarget`<sup>Required</sup> <a name="eventTarget" id="@cdklabs/sbt-aws.BashJobRunner.property.eventTarget"></a>

```typescript
public readonly eventTarget: IRuleTarget;
```

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The eventTarget to use when triggering this BashJobRunner.

---

##### `incomingEvent`<sup>Required</sup> <a name="incomingEvent" id="@cdklabs/sbt-aws.BashJobRunner.property.incomingEvent"></a>

```typescript
public readonly incomingEvent: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The incoming event DetailType that triggers this job.

---

##### `provisioningStateMachine`<sup>Required</sup> <a name="provisioningStateMachine" id="@cdklabs/sbt-aws.BashJobRunner.property.provisioningStateMachine"></a>

```typescript
public readonly provisioningStateMachine: StateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.StateMachine

The StateMachine used to implement this BashJobRunner orchestration.

---

##### `environmentVariablesToOutgoingEvent`<sup>Optional</sup> <a name="environmentVariablesToOutgoingEvent" id="@cdklabs/sbt-aws.BashJobRunner.property.environmentVariablesToOutgoingEvent"></a>

```typescript
public readonly environmentVariablesToOutgoingEvent: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the BashJobRunner has finished.

---


### BillingProvider <a name="BillingProvider" id="@cdklabs/sbt-aws.BillingProvider"></a>

Represents a Billing Provider that handles billing-related operations.

This construct sets up event targets for various billing-related events
and optionally creates an API Gateway resource for a webhook function.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.BillingProvider.Initializer"></a>

```typescript
import { BillingProvider } from '@cdklabs/sbt-aws'

new BillingProvider(scope: Construct, id: string, props: BillingProviderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The scope in which to define this construct. |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | The unique ID of this construct. |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.BillingProviderProps">BillingProviderProps</a></code> | The properties for the BillingProvider. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to define this construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.id"></a>

- *Type:* string

The unique ID of this construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.BillingProviderProps">BillingProviderProps</a>

The properties for the BillingProvider.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.BillingProvider.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.BillingProvider.isConstruct"></a>

```typescript
import { BillingProvider } from '@cdklabs/sbt-aws'

BillingProvider.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.BillingProvider.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.property.controlPlaneAPIBillingWebhookResourcePath">controlPlaneAPIBillingWebhookResourcePath</a></code> | <code>string</code> | The API Gateway resource containing the billing webhook resource. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.BillingProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneAPIBillingWebhookResourcePath`<sup>Optional</sup> <a name="controlPlaneAPIBillingWebhookResourcePath" id="@cdklabs/sbt-aws.BillingProvider.property.controlPlaneAPIBillingWebhookResourcePath"></a>

```typescript
public readonly controlPlaneAPIBillingWebhookResourcePath: string;
```

- *Type:* string

The API Gateway resource containing the billing webhook resource.

Only set when the IBilling webhookFunction is defined.

---


### CognitoAuth <a name="CognitoAuth" id="@cdklabs/sbt-aws.CognitoAuth"></a>

- *Implements:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

Constructs for setting up Cognito authentication and user management.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.CognitoAuth.Initializer"></a>

```typescript
import { CognitoAuth } from '@cdklabs/sbt-aws'

new CognitoAuth(scope: Construct, id: string, props?: CognitoAuthProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps">CognitoAuthProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.CognitoAuthProps">CognitoAuthProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.createAdminUser">createAdminUser</a></code> | Function to create an admin user. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.CognitoAuth.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `createAdminUser` <a name="createAdminUser" id="@cdklabs/sbt-aws.CognitoAuth.createAdminUser"></a>

```typescript
public createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void
```

Function to create an admin user.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.CognitoAuth.createAdminUser.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.CognitoAuth.createAdminUser.parameter.id"></a>

- *Type:* string

---

###### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.CognitoAuth.createAdminUser.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.CreateAdminUserProps">CreateAdminUserProps</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.CognitoAuth.isConstruct"></a>

```typescript
import { CognitoAuth } from '@cdklabs/sbt-aws'

CognitoAuth.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.CognitoAuth.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for creating a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for deleting a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.disableUserFunction">disableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for disabling a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.enableUserFunction">enableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for enabling a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for fetching all users -- GET /users. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchUserFunction">fetchUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for fetching a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.jwtAudience">jwtAudience</a></code> | <code>string[]</code> | The list of recipients (audience) for which the JWT is intended. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.jwtIssuer">jwtIssuer</a></code> | <code>string</code> | The JWT issuer domain for the identity provider. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.machineClientId">machineClientId</a></code> | <code>string</code> | The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.machineClientSecret">machineClientSecret</a></code> | <code>aws-cdk-lib.SecretValue</code> | The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.tokenEndpoint">tokenEndpoint</a></code> | <code>string</code> | The endpoint URL for granting OAuth tokens. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.updateUserFunction">updateUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for updating a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.userClientId">userClientId</a></code> | <code>string</code> | The client ID enabled for user-centric authentication flows, such as Authorization Code flow. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code> | <code>string</code> | The well-known endpoint URL for the control plane identity provider. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.activateTenantScope">activateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for activating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.createTenantScope">createTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for creating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.createUserScope">createUserScope</a></code> | <code>string</code> | The scope required to authorize requests for creating a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.deactivateTenantScope">deactivateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for deactivating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.deleteTenantScope">deleteTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for deleting a tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.deleteUserScope">deleteUserScope</a></code> | <code>string</code> | The scope required to authorize requests for deleting a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.disableUserScope">disableUserScope</a></code> | <code>string</code> | The scope required to authorize requests for disabling a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.enableUserScope">enableUserScope</a></code> | <code>string</code> | The scope required to authorize requests for enabling a user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchAllTenantsScope">fetchAllTenantsScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching all tenants. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersScope">fetchAllUsersScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching all users. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchTenantScope">fetchTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching a single tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchUserScope">fetchUserScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching a single user. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.updateTenantScope">updateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for updating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.updateUserScope">updateUserScope</a></code> | <code>string</code> | The scope required to authorize requests for updating a user. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.CognitoAuth.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for creating a user.

- POST /users

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for deleting a user.

- DELETE /user/{userId}

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for disabling a user.

- PUT /user/{userId}/disable

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for enabling a user.

- PUT /user/{userId}/enable

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for fetching all users -- GET /users.

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for fetching a user.

- GET /user/{userId}

---

##### `jwtAudience`<sup>Required</sup> <a name="jwtAudience" id="@cdklabs/sbt-aws.CognitoAuth.property.jwtAudience"></a>

```typescript
public readonly jwtAudience: string[];
```

- *Type:* string[]

The list of recipients (audience) for which the JWT is intended.

This will be checked by the API GW to ensure only authorized
clients are provided access.

---

##### `jwtIssuer`<sup>Required</sup> <a name="jwtIssuer" id="@cdklabs/sbt-aws.CognitoAuth.property.jwtIssuer"></a>

```typescript
public readonly jwtIssuer: string;
```

- *Type:* string

The JWT issuer domain for the identity provider.

This is the domain where the JSON Web Tokens (JWTs) are issued from.

---

##### `machineClientId`<sup>Required</sup> <a name="machineClientId" id="@cdklabs/sbt-aws.CognitoAuth.property.machineClientId"></a>

```typescript
public readonly machineClientId: string;
```

- *Type:* string

The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow.

This client ID is used for authenticating applications or services.

---

##### `machineClientSecret`<sup>Required</sup> <a name="machineClientSecret" id="@cdklabs/sbt-aws.CognitoAuth.property.machineClientSecret"></a>

```typescript
public readonly machineClientSecret: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow.

This secret is used in combination with the machine client ID for authenticating applications or services.

---

##### `tokenEndpoint`<sup>Required</sup> <a name="tokenEndpoint" id="@cdklabs/sbt-aws.CognitoAuth.property.tokenEndpoint"></a>

```typescript
public readonly tokenEndpoint: string;
```

- *Type:* string

The endpoint URL for granting OAuth tokens.

This is the URL where OAuth tokens can be obtained from the authorization server.

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for updating a user.

- PUT /user/{userId}

---

##### `userClientId`<sup>Required</sup> <a name="userClientId" id="@cdklabs/sbt-aws.CognitoAuth.property.userClientId"></a>

```typescript
public readonly userClientId: string;
```

- *Type:* string

The client ID enabled for user-centric authentication flows, such as Authorization Code flow.

This client ID is used for authenticating end-users.

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/sbt-aws.CognitoAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

The well-known endpoint URL for the control plane identity provider.

This URL provides configuration information about the identity provider, such as issuer, authorization endpoint, and token endpoint.

---

##### `activateTenantScope`<sup>Optional</sup> <a name="activateTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.activateTenantScope"></a>

```typescript
public readonly activateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for activating a tenant.

This scope grants permission to activate a specific tenant.

---

##### `createTenantScope`<sup>Optional</sup> <a name="createTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.createTenantScope"></a>

```typescript
public readonly createTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for creating a tenant.

This scope grants permission to create a new tenant.

---

##### `createUserScope`<sup>Optional</sup> <a name="createUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.createUserScope"></a>

```typescript
public readonly createUserScope: string;
```

- *Type:* string

The scope required to authorize requests for creating a user.

This scope grants permission to create a new user.

---

##### `deactivateTenantScope`<sup>Optional</sup> <a name="deactivateTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.deactivateTenantScope"></a>

```typescript
public readonly deactivateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for deactivating a tenant.

This scope grants permission to deactivate a specific tenant.

---

##### `deleteTenantScope`<sup>Optional</sup> <a name="deleteTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.deleteTenantScope"></a>

```typescript
public readonly deleteTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for deleting a tenant.

This scope grants permission to delete a specific tenant.

---

##### `deleteUserScope`<sup>Optional</sup> <a name="deleteUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.deleteUserScope"></a>

```typescript
public readonly deleteUserScope: string;
```

- *Type:* string

The scope required to authorize requests for deleting a user.

This scope grants permission to delete a specific user.

---

##### `disableUserScope`<sup>Optional</sup> <a name="disableUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.disableUserScope"></a>

```typescript
public readonly disableUserScope: string;
```

- *Type:* string

The scope required to authorize requests for disabling a user.

This scope grants permission to disable a specific user.

---

##### `enableUserScope`<sup>Optional</sup> <a name="enableUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.enableUserScope"></a>

```typescript
public readonly enableUserScope: string;
```

- *Type:* string

The scope required to authorize requests for enabling a user.

This scope grants permission to enable a specific user.

---

##### `fetchAllTenantsScope`<sup>Optional</sup> <a name="fetchAllTenantsScope" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchAllTenantsScope"></a>

```typescript
public readonly fetchAllTenantsScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching all tenants.

This scope grants permission to fetch the details of all tenants.

---

##### `fetchAllUsersScope`<sup>Optional</sup> <a name="fetchAllUsersScope" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersScope"></a>

```typescript
public readonly fetchAllUsersScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching all users.

This scope grants permission to fetch the details of all users.

---

##### `fetchTenantScope`<sup>Optional</sup> <a name="fetchTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchTenantScope"></a>

```typescript
public readonly fetchTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching a single tenant.

This scope grants permission to fetch the details of a specific tenant.

---

##### `fetchUserScope`<sup>Optional</sup> <a name="fetchUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchUserScope"></a>

```typescript
public readonly fetchUserScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching a single user.

This scope grants permission to fetch the details of a specific user.

---

##### `updateTenantScope`<sup>Optional</sup> <a name="updateTenantScope" id="@cdklabs/sbt-aws.CognitoAuth.property.updateTenantScope"></a>

```typescript
public readonly updateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for updating a tenant.

This scope grants permission to update the details of a specific tenant.

---

##### `updateUserScope`<sup>Optional</sup> <a name="updateUserScope" id="@cdklabs/sbt-aws.CognitoAuth.property.updateUserScope"></a>

```typescript
public readonly updateUserScope: string;
```

- *Type:* string

The scope required to authorize requests for updating a user.

This scope grants permission to update the details of a specific user.

---


### ControlPlane <a name="ControlPlane" id="@cdklabs/sbt-aws.ControlPlane"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.ControlPlane.Initializer"></a>

```typescript
import { ControlPlane } from '@cdklabs/sbt-aws'

new ControlPlane(scope: Construct, id: string, props: ControlPlaneProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps">ControlPlaneProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.ControlPlane.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.ControlPlaneProps">ControlPlaneProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.ControlPlane.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.ControlPlane.isConstruct"></a>

```typescript
import { ControlPlane } from '@cdklabs/sbt-aws'

ControlPlane.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.ControlPlane.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.controlPlaneAPIGatewayUrl">controlPlaneAPIGatewayUrl</a></code> | <code>string</code> | The URL of the control plane API Gateway. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | The EventManager instance that allows connecting to events flowing between the Control Plane and other components. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.ControlPlane.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneAPIGatewayUrl`<sup>Required</sup> <a name="controlPlaneAPIGatewayUrl" id="@cdklabs/sbt-aws.ControlPlane.property.controlPlaneAPIGatewayUrl"></a>

```typescript
public readonly controlPlaneAPIGatewayUrl: string;
```

- *Type:* string

The URL of the control plane API Gateway.

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.ControlPlane.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

The EventManager instance that allows connecting to events flowing between the Control Plane and other components.

---


### ControlPlaneAPI <a name="ControlPlaneAPI" id="@cdklabs/sbt-aws.ControlPlaneAPI"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.ControlPlaneAPI.Initializer"></a>

```typescript
import { ControlPlaneAPI } from '@cdklabs/sbt-aws'

new ControlPlaneAPI(scope: Construct, id: string, props: ControlPlaneAPIProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps">ControlPlaneAPIProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.ControlPlaneAPI.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps">ControlPlaneAPIProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.ControlPlaneAPI.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.ControlPlaneAPI.isConstruct"></a>

```typescript
import { ControlPlaneAPI } from '@cdklabs/sbt-aws'

ControlPlaneAPI.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.ControlPlaneAPI.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpApi</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.apiUrl">apiUrl</a></code> | <code>any</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.jwtAuthorizer">jwtAuthorizer</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `api`<sup>Required</sup> <a name="api" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.api"></a>

```typescript
public readonly api: HttpApi;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpApi

---

##### `apiUrl`<sup>Required</sup> <a name="apiUrl" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.apiUrl"></a>

```typescript
public readonly apiUrl: any;
```

- *Type:* any

---

##### `jwtAuthorizer`<sup>Required</sup> <a name="jwtAuthorizer" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.jwtAuthorizer"></a>

```typescript
public readonly jwtAuthorizer: IHttpRouteAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer

---


### CoreApplicationPlane <a name="CoreApplicationPlane" id="@cdklabs/sbt-aws.CoreApplicationPlane"></a>

Provides a CoreApplicationPlane.

This construct will help create resources to accelerate building an SBT-compliant Application Plane.
It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
and respond to events created by the control plane.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.CoreApplicationPlane.Initializer"></a>

```typescript
import { CoreApplicationPlane } from '@cdklabs/sbt-aws'

new CoreApplicationPlane(scope: Construct, id: string, props: CoreApplicationPlaneProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps">CoreApplicationPlaneProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.CoreApplicationPlane.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps">CoreApplicationPlaneProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.CoreApplicationPlane.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.CoreApplicationPlane.isConstruct"></a>

```typescript
import { CoreApplicationPlane } from '@cdklabs/sbt-aws'

CoreApplicationPlane.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.CoreApplicationPlane.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | The EventManager instance that allows connecting to events flowing between the Control Plane and other components. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.CoreApplicationPlane.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.CoreApplicationPlane.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

The EventManager instance that allows connecting to events flowing between the Control Plane and other components.

---


### EventManager <a name="EventManager" id="@cdklabs/sbt-aws.EventManager"></a>

- *Implements:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

Provides an EventManager to interact with the EventBus shared with the SBT control plane.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.EventManager.Initializer"></a>

```typescript
import { EventManager } from '@cdklabs/sbt-aws'

new EventManager(scope: Construct, id: string, props?: EventManagerProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManager.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManager.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManager.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.EventManagerProps">EventManagerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.EventManager.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.EventManager.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@cdklabs/sbt-aws.EventManager.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.EventManagerProps">EventManagerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManager.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.addTargetToEvent">addTargetToEvent</a></code> | Adds an IRuleTarget to an event. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.grantPutEventsTo">grantPutEventsTo</a></code> | Provides grantee the permissions to place events on the EventManager bus. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.EventManager.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addTargetToEvent` <a name="addTargetToEvent" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent"></a>

```typescript
public addTargetToEvent(scope: Construct, eventType: DetailType, target: IRuleTarget): void
```

Adds an IRuleTarget to an event.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to find (or create) the Rule.

---

###### `eventType`<sup>Required</sup> <a name="eventType" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent.parameter.eventType"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The detail type of the event to add a target to.

---

###### `target`<sup>Required</sup> <a name="target" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent.parameter.target"></a>

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The target that will be added to the event.

---

##### `grantPutEventsTo` <a name="grantPutEventsTo" id="@cdklabs/sbt-aws.EventManager.grantPutEventsTo"></a>

```typescript
public grantPutEventsTo(grantee: IGrantable): void
```

Provides grantee the permissions to place events on the EventManager bus.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/sbt-aws.EventManager.grantPutEventsTo.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The grantee resource that will be granted the permission(s).

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManager.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.EventManager.isConstruct"></a>

```typescript
import { EventManager } from '@cdklabs/sbt-aws'

EventManager.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.EventManager.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | The event source used for events emitted by the application plane. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.busArn">busArn</a></code> | <code>string</code> | The ARN/ID of the bus that will be used to send and receive events. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.busName">busName</a></code> | <code>string</code> | The name of the bus that will be used to send and receive events. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | The event source used for events emitted by the control plane. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The eventBus resource that will be used to send and receive events. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.supportedEvents">supportedEvents</a></code> | <code>{[ key: string ]: string}</code> | List of recognized events that are available as triggers. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.EventManager.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `applicationPlaneEventSource`<sup>Required</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.EventManager.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

The event source used for events emitted by the application plane.

---

##### `busArn`<sup>Required</sup> <a name="busArn" id="@cdklabs/sbt-aws.EventManager.property.busArn"></a>

```typescript
public readonly busArn: string;
```

- *Type:* string

The ARN/ID of the bus that will be used to send and receive events.

---

##### `busName`<sup>Required</sup> <a name="busName" id="@cdklabs/sbt-aws.EventManager.property.busName"></a>

```typescript
public readonly busName: string;
```

- *Type:* string

The name of the bus that will be used to send and receive events.

---

##### `controlPlaneEventSource`<sup>Required</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.EventManager.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

The event source used for events emitted by the control plane.

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/sbt-aws.EventManager.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The eventBus resource that will be used to send and receive events.

---

##### `supportedEvents`<sup>Required</sup> <a name="supportedEvents" id="@cdklabs/sbt-aws.EventManager.property.supportedEvents"></a>

```typescript
public readonly supportedEvents: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

List of recognized events that are available as triggers.

---


### FirehoseAggregator <a name="FirehoseAggregator" id="@cdklabs/sbt-aws.FirehoseAggregator"></a>

- *Implements:* <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>

Creates a Kinesis Firehose to accept high-volume data, which it then routes to an s3 bucket.

The s3 bucket triggers a lambda which processes the data and stores it in a DynamoDB table
containing the aggregated data.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.FirehoseAggregator.Initializer"></a>

```typescript
import { FirehoseAggregator } from '@cdklabs/sbt-aws'

new FirehoseAggregator(scope: Construct, id: string, props: FirehoseAggregatorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps">FirehoseAggregatorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.FirehoseAggregator.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps">FirehoseAggregatorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.FirehoseAggregator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.FirehoseAggregator.isConstruct"></a>

```typescript
import { FirehoseAggregator } from '@cdklabs/sbt-aws'

FirehoseAggregator.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.FirehoseAggregator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataAggregator">dataAggregator</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Python Lambda function responsible for aggregating the raw data coming in via the dataIngestor. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestor">dataIngestor</a></code> | <code>@aws-cdk/aws-kinesisfirehose-alpha.DeliveryStream</code> | The Firehose DeliveryStream ingestor responsible for accepting the incoming data. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestorName">dataIngestorName</a></code> | <code>string</code> | The name of the dataIngestor. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataRepository">dataRepository</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | The DynamoDB table containing the aggregated data. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.FirehoseAggregator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `dataAggregator`<sup>Required</sup> <a name="dataAggregator" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataAggregator"></a>

```typescript
public readonly dataAggregator: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Python Lambda function responsible for aggregating the raw data coming in via the dataIngestor.

---

##### `dataIngestor`<sup>Required</sup> <a name="dataIngestor" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestor"></a>

```typescript
public readonly dataIngestor: DeliveryStream;
```

- *Type:* @aws-cdk/aws-kinesisfirehose-alpha.DeliveryStream

The Firehose DeliveryStream ingestor responsible for accepting the incoming data.

---

##### `dataIngestorName`<sup>Required</sup> <a name="dataIngestorName" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestorName"></a>

```typescript
public readonly dataIngestorName: string;
```

- *Type:* string

The name of the dataIngestor.

This is used for visibility.

---

##### `dataRepository`<sup>Required</sup> <a name="dataRepository" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataRepository"></a>

```typescript
public readonly dataRepository: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

The DynamoDB table containing the aggregated data.

---


### SampleRegistrationWebPage <a name="SampleRegistrationWebPage" id="@cdklabs/sbt-aws.SampleRegistrationWebPage"></a>

Constructs a sample registration web page hosted on Amazon S3 and fronted by Amazon CloudFront.

The web page includes a form for users to register for the SaaS product.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer"></a>

```typescript
import { SampleRegistrationWebPage } from '@cdklabs/sbt-aws'

new SampleRegistrationWebPage(scope: Construct, id: string, props: SampleRegistrationWebPageProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps">SampleRegistrationWebPageProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps">SampleRegistrationWebPageProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.isConstruct"></a>

```typescript
import { SampleRegistrationWebPage } from '@cdklabs/sbt-aws'

SampleRegistrationWebPage.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPage.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.SampleRegistrationWebPage.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### TenantConfigLambdas <a name="TenantConfigLambdas" id="@cdklabs/sbt-aws.TenantConfigLambdas"></a>

Represents a set of Lambda functions for managing tenant configurations.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.TenantConfigLambdas.Initializer"></a>

```typescript
import { TenantConfigLambdas } from '@cdklabs/sbt-aws'

new TenantConfigLambdas(scope: Construct, id: string, props: TenantConfigLambdasProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The parent construct. |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of the construct. |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps">TenantConfigLambdasProps</a></code> | - The properties required to initialize the TenantConfigLambdas. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.id"></a>

- *Type:* string

The ID of the construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.TenantConfigLambdas.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps">TenantConfigLambdasProps</a>

The properties required to initialize the TenantConfigLambdas.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.TenantConfigLambdas.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.TenantConfigLambdas.isConstruct"></a>

```typescript
import { TenantConfigLambdas } from '@cdklabs/sbt-aws'

TenantConfigLambdas.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.TenantConfigLambdas.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdas.property.tenantConfigFunction">tenantConfigFunction</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | The Lambda function responsible for managing tenant configurations. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantConfigLambdas.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigFunction`<sup>Required</sup> <a name="tenantConfigFunction" id="@cdklabs/sbt-aws.TenantConfigLambdas.property.tenantConfigFunction"></a>

```typescript
public readonly tenantConfigFunction: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

The Lambda function responsible for managing tenant configurations.

---


### TenantConfigService <a name="TenantConfigService" id="@cdklabs/sbt-aws.TenantConfigService"></a>

Represents the Tenant Config Service construct.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.TenantConfigService.Initializer"></a>

```typescript
import { TenantConfigService } from '@cdklabs/sbt-aws'

new TenantConfigService(scope: Construct, id: string, props: TenantConfigServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps">TenantConfigServiceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.TenantConfigService.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.TenantConfigServiceProps">TenantConfigServiceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.TenantConfigService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.TenantConfigService.isConstruct"></a>

```typescript
import { TenantConfigService } from '@cdklabs/sbt-aws'

TenantConfigService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.TenantConfigService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantConfigService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### TenantManagementLambda <a name="TenantManagementLambda" id="@cdklabs/sbt-aws.TenantManagementLambda"></a>

Represents the Tenant Management Lambda construct.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.TenantManagementLambda.Initializer"></a>

```typescript
import { TenantManagementLambda } from '@cdklabs/sbt-aws'

new TenantManagementLambda(scope: Construct, id: string, props: TenantManagementLambdaProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantManagementLambdaProps">TenantManagementLambdaProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.TenantManagementLambda.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.TenantManagementLambdaProps">TenantManagementLambdaProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.TenantManagementLambda.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.TenantManagementLambda.isConstruct"></a>

```typescript
import { TenantManagementLambda } from '@cdklabs/sbt-aws'

TenantManagementLambda.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.TenantManagementLambda.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambda.property.tenantManagementFunc">tenantManagementFunc</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantManagementLambda.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantManagementFunc`<sup>Required</sup> <a name="tenantManagementFunc" id="@cdklabs/sbt-aws.TenantManagementLambda.property.tenantManagementFunc"></a>

```typescript
public readonly tenantManagementFunc: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### TenantManagementService <a name="TenantManagementService" id="@cdklabs/sbt-aws.TenantManagementService"></a>

Represents a service for managing tenants in the application.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.TenantManagementService.Initializer"></a>

```typescript
import { TenantManagementService } from '@cdklabs/sbt-aws'

new TenantManagementService(scope: Construct, id: string, props: TenantManagementServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The parent construct. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of the construct. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantManagementServiceProps">TenantManagementServiceProps</a></code> | - The properties required to initialize the service. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.id"></a>

- *Type:* string

The ID of the construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.TenantManagementService.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.TenantManagementServiceProps">TenantManagementServiceProps</a>

The properties required to initialize the service.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.TenantManagementService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.TenantManagementService.isConstruct"></a>

```typescript
import { TenantManagementService } from '@cdklabs/sbt-aws'

TenantManagementService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.TenantManagementService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementService.property.table">table</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a></code> | The tenant management table instance. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantManagementService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/sbt-aws.TenantManagementService.property.table"></a>

```typescript
public readonly table: TenantManagementTable;
```

- *Type:* <a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a>

The tenant management table instance.

---


### TenantManagementTable <a name="TenantManagementTable" id="@cdklabs/sbt-aws.TenantManagementTable"></a>

Represents a table for managing tenant details in the application.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.TenantManagementTable.Initializer"></a>

```typescript
import { TenantManagementTable } from '@cdklabs/sbt-aws'

new TenantManagementTable(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The parent construct. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of the construct. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.TenantManagementTable.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.TenantManagementTable.Initializer.parameter.id"></a>

- *Type:* string

The ID of the construct.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.TenantManagementTable.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.TenantManagementTable.isConstruct"></a>

```typescript
import { TenantManagementTable } from '@cdklabs/sbt-aws'

TenantManagementTable.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.TenantManagementTable.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.tenantConfigColumn">tenantConfigColumn</a></code> | <code>string</code> | The name of the column that stores the tenant configuration. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.tenantConfigIndexName">tenantConfigIndexName</a></code> | <code>string</code> | The name of the global secondary index for the tenant configuration. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.tenantDetails">tenantDetails</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | The table that stores the tenant details. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.tenantIdColumn">tenantIdColumn</a></code> | <code>string</code> | The name of the column that stores the tenant ID. |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementTable.property.tenantNameColumn">tenantNameColumn</a></code> | <code>string</code> | The name of the column that stores the tenant name. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantManagementTable.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigColumn`<sup>Required</sup> <a name="tenantConfigColumn" id="@cdklabs/sbt-aws.TenantManagementTable.property.tenantConfigColumn"></a>

```typescript
public readonly tenantConfigColumn: string;
```

- *Type:* string

The name of the column that stores the tenant configuration.

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/sbt-aws.TenantManagementTable.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

The name of the global secondary index for the tenant configuration.

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/sbt-aws.TenantManagementTable.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

The table that stores the tenant details.

---

##### `tenantIdColumn`<sup>Required</sup> <a name="tenantIdColumn" id="@cdklabs/sbt-aws.TenantManagementTable.property.tenantIdColumn"></a>

```typescript
public readonly tenantIdColumn: string;
```

- *Type:* string

The name of the column that stores the tenant ID.

---

##### `tenantNameColumn`<sup>Required</sup> <a name="tenantNameColumn" id="@cdklabs/sbt-aws.TenantManagementTable.property.tenantNameColumn"></a>

```typescript
public readonly tenantNameColumn: string;
```

- *Type:* string

The name of the column that stores the tenant name.

---


### UserManagementService <a name="UserManagementService" id="@cdklabs/sbt-aws.UserManagementService"></a>

Represents a service for managing users in the application.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.UserManagementService.Initializer"></a>

```typescript
import { UserManagementService } from '@cdklabs/sbt-aws'

new UserManagementService(scope: Construct, id: string, props: UserManagementServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | - The parent construct. |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.id">id</a></code> | <code>string</code> | - The ID of the construct. |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.UserManagementServiceProps">UserManagementServiceProps</a></code> | - The properties required to initialize the service. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.id"></a>

- *Type:* string

The ID of the construct.

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.UserManagementService.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.UserManagementServiceProps">UserManagementServiceProps</a>

The properties required to initialize the service.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.UserManagementService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.UserManagementService.isConstruct"></a>

```typescript
import { UserManagementService } from '@cdklabs/sbt-aws'

UserManagementService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.UserManagementService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.UserManagementService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.UserManagementService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### AWSMarketplaceSaaSProductProps <a name="AWSMarketplaceSaaSProductProps" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps"></a>

Properties for configuring an AWS Marketplace SaaS product.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.Initializer"></a>

```typescript
import { AWSMarketplaceSaaSProductProps } from '@cdklabs/sbt-aws'

const aWSMarketplaceSaaSProductProps: AWSMarketplaceSaaSProductProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.entitlementSNSTopic">entitlementSNSTopic</a></code> | <code>string</code> | SNS topic ARN provided from AWS Marketplace. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.marketplaceTechAdminEmail">marketplaceTechAdminEmail</a></code> | <code>string</code> | Email to be notified on changes requiring action. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.pricingModel">pricingModel</a></code> | <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel">AWSMarketplaceSaaSPricingModel</a></code> | The pricing model for the AWS Marketplace SaaS product. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.productCode">productCode</a></code> | <code>string</code> | Product code provided from AWS Marketplace. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.subscriptionSNSTopic">subscriptionSNSTopic</a></code> | <code>string</code> | SNS topic ARN provided from AWS Marketplace. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.disableAPILogging">disableAPILogging</a></code> | <code>boolean</code> | Flag to disable API logging. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | The EventManager for the AWS Marketplace SaaS product. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.marketplaceSellerEmail">marketplaceSellerEmail</a></code> | <code>string</code> | Seller email address, verified in SES and in 'Production' mode. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.requiredFieldsForRegistration">requiredFieldsForRegistration</a></code> | <code>string[]</code> | List of required fields for registration. |

---

##### `entitlementSNSTopic`<sup>Required</sup> <a name="entitlementSNSTopic" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.entitlementSNSTopic"></a>

```typescript
public readonly entitlementSNSTopic: string;
```

- *Type:* string

SNS topic ARN provided from AWS Marketplace.

Must exist.

---

##### `marketplaceTechAdminEmail`<sup>Required</sup> <a name="marketplaceTechAdminEmail" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.marketplaceTechAdminEmail"></a>

```typescript
public readonly marketplaceTechAdminEmail: string;
```

- *Type:* string

Email to be notified on changes requiring action.

---

##### `pricingModel`<sup>Required</sup> <a name="pricingModel" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.pricingModel"></a>

```typescript
public readonly pricingModel: AWSMarketplaceSaaSPricingModel;
```

- *Type:* <a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel">AWSMarketplaceSaaSPricingModel</a>

The pricing model for the AWS Marketplace SaaS product.

---

##### `productCode`<sup>Required</sup> <a name="productCode" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.productCode"></a>

```typescript
public readonly productCode: string;
```

- *Type:* string

Product code provided from AWS Marketplace.

---

##### `subscriptionSNSTopic`<sup>Required</sup> <a name="subscriptionSNSTopic" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.subscriptionSNSTopic"></a>

```typescript
public readonly subscriptionSNSTopic: string;
```

- *Type:* string

SNS topic ARN provided from AWS Marketplace.

Must exist.

---

##### `disableAPILogging`<sup>Optional</sup> <a name="disableAPILogging" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.disableAPILogging"></a>

```typescript
public readonly disableAPILogging: boolean;
```

- *Type:* boolean

Flag to disable API logging.

---

##### `eventManager`<sup>Optional</sup> <a name="eventManager" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

The EventManager for the AWS Marketplace SaaS product.

This is used to enable integration with sbt-aws.

---

##### `marketplaceSellerEmail`<sup>Optional</sup> <a name="marketplaceSellerEmail" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.marketplaceSellerEmail"></a>

```typescript
public readonly marketplaceSellerEmail: string;
```

- *Type:* string

Seller email address, verified in SES and in 'Production' mode.

---

##### `requiredFieldsForRegistration`<sup>Optional</sup> <a name="requiredFieldsForRegistration" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSProductProps.property.requiredFieldsForRegistration"></a>

```typescript
public readonly requiredFieldsForRegistration: string[];
```

- *Type:* string[]

List of required fields for registration.

The existence of these
fields is checked when a new customer is registered.

---

### BashJobRunnerProps <a name="BashJobRunnerProps" id="@cdklabs/sbt-aws.BashJobRunnerProps"></a>

Encapsulates the list of properties for a BashJobRunner.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.BashJobRunnerProps.Initializer"></a>

```typescript
import { BashJobRunnerProps } from '@cdklabs/sbt-aws'

const bashJobRunnerProps: BashJobRunnerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | The EventManager instance that allows connecting to events flowing between the Control Plane and other components. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.incomingEvent">incomingEvent</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | The incoming event DetailType that triggers this job. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.outgoingEvent">outgoingEvent</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | The outgoing event DetailType that is emitted upon job completion. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.permissions">permissions</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The IAM permission document for the BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.script">script</a></code> | <code>string</code> | The bash script to run as part of the BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentJSONVariablesFromIncomingEvent">environmentJSONVariablesFromIncomingEvent</a></code> | <code>string[]</code> | The environment variables to import into the BashJobRunner from event details field. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentStringVariablesFromIncomingEvent">environmentStringVariablesFromIncomingEvent</a></code> | <code>string[]</code> | The environment variables to import into the BashJobRunner from event details field. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentVariablesToOutgoingEvent">environmentVariablesToOutgoingEvent</a></code> | <code>string[]</code> | The environment variables to export into the outgoing event once the BashJobRunner has finished. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.postScript">postScript</a></code> | <code>string</code> | The bash script to run after the main script has completed. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.scriptEnvironmentVariables">scriptEnvironmentVariables</a></code> | <code>{[ key: string ]: string}</code> | The variables to pass into the codebuild BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.tenantIdentifierKeyInIncomingEvent">tenantIdentifierKeyInIncomingEvent</a></code> | <code>string</code> | The key where the tenant identifier is to be extracted from in the incoming event. |

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

The EventManager instance that allows connecting to events flowing between the Control Plane and other components.

---

##### `incomingEvent`<sup>Required</sup> <a name="incomingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.incomingEvent"></a>

```typescript
public readonly incomingEvent: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The incoming event DetailType that triggers this job.

---

##### `outgoingEvent`<sup>Required</sup> <a name="outgoingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.outgoingEvent"></a>

```typescript
public readonly outgoingEvent: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The outgoing event DetailType that is emitted upon job completion.

---

##### `permissions`<sup>Required</sup> <a name="permissions" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.permissions"></a>

```typescript
public readonly permissions: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The IAM permission document for the BashJobRunner.

---

##### `script`<sup>Required</sup> <a name="script" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

The bash script to run as part of the BashJobRunner.

---

##### `environmentJSONVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentJSONVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentJSONVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentJSONVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

The environment variables to import into the BashJobRunner from event details field.

This argument consists of the names of only JSON-formatted string type variables.
Ex. '{"test": 2}'

---

##### `environmentStringVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentStringVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentStringVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentStringVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

The environment variables to import into the BashJobRunner from event details field.

This argument consists of the names of only string type variables. Ex. 'test'

---

##### `environmentVariablesToOutgoingEvent`<sup>Optional</sup> <a name="environmentVariablesToOutgoingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentVariablesToOutgoingEvent"></a>

```typescript
public readonly environmentVariablesToOutgoingEvent: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the BashJobRunner has finished.

---

##### `postScript`<sup>Optional</sup> <a name="postScript" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.postScript"></a>

```typescript
public readonly postScript: string;
```

- *Type:* string

The bash script to run after the main script has completed.

---

##### `scriptEnvironmentVariables`<sup>Optional</sup> <a name="scriptEnvironmentVariables" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.scriptEnvironmentVariables"></a>

```typescript
public readonly scriptEnvironmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The variables to pass into the codebuild BashJobRunner.

---

##### `tenantIdentifierKeyInIncomingEvent`<sup>Optional</sup> <a name="tenantIdentifierKeyInIncomingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.tenantIdentifierKeyInIncomingEvent"></a>

```typescript
public readonly tenantIdentifierKeyInIncomingEvent: string;
```

- *Type:* string
- *Default:* 'tenantId'

The key where the tenant identifier is to be extracted from in the incoming event.

---

### BillingProviderProps <a name="BillingProviderProps" id="@cdklabs/sbt-aws.BillingProviderProps"></a>

Encapsulates the list of properties for a BillingProvider.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.BillingProviderProps.Initializer"></a>

```typescript
import { BillingProviderProps } from '@cdklabs/sbt-aws'

const billingProviderProps: BillingProviderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProviderProps.property.billing">billing</a></code> | <code><a href="#@cdklabs/sbt-aws.IBilling">IBilling</a></code> | An implementation of the IBilling interface. |
| <code><a href="#@cdklabs/sbt-aws.BillingProviderProps.property.controlPlaneAPI">controlPlaneAPI</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpApi</code> | An API Gateway Resource for the BillingProvider to use when setting up API endpoints. |
| <code><a href="#@cdklabs/sbt-aws.BillingProviderProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | An IEventManager object to help coordinate events. |

---

##### `billing`<sup>Required</sup> <a name="billing" id="@cdklabs/sbt-aws.BillingProviderProps.property.billing"></a>

```typescript
public readonly billing: IBilling;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>

An implementation of the IBilling interface.

---

##### `controlPlaneAPI`<sup>Required</sup> <a name="controlPlaneAPI" id="@cdklabs/sbt-aws.BillingProviderProps.property.controlPlaneAPI"></a>

```typescript
public readonly controlPlaneAPI: HttpApi;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpApi

An API Gateway Resource for the BillingProvider to use when setting up API endpoints.

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.BillingProviderProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

An IEventManager object to help coordinate events.

---

### CognitoAuthProps <a name="CognitoAuthProps" id="@cdklabs/sbt-aws.CognitoAuthProps"></a>

Properties for the CognitoAuth construct.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.CognitoAuthProps.Initializer"></a>

```typescript
import { CognitoAuthProps } from '@cdklabs/sbt-aws'

const cognitoAuthProps: CognitoAuthProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.controlPlaneCallbackURL">controlPlaneCallbackURL</a></code> | <code>string</code> | The callback URL for the control plane. |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.setAPIGWScopes">setAPIGWScopes</a></code> | <code>boolean</code> | Whether or not to specify scopes for validation at the API GW. |

---

##### `controlPlaneCallbackURL`<sup>Optional</sup> <a name="controlPlaneCallbackURL" id="@cdklabs/sbt-aws.CognitoAuthProps.property.controlPlaneCallbackURL"></a>

```typescript
public readonly controlPlaneCallbackURL: string;
```

- *Type:* string
- *Default:* 'http://localhost'

The callback URL for the control plane.

---

##### `setAPIGWScopes`<sup>Optional</sup> <a name="setAPIGWScopes" id="@cdklabs/sbt-aws.CognitoAuthProps.property.setAPIGWScopes"></a>

```typescript
public readonly setAPIGWScopes: boolean;
```

- *Type:* boolean
- *Default:* true

Whether or not to specify scopes for validation at the API GW.

Can be used for testing purposes.

---

### ControlPlaneAPIProps <a name="ControlPlaneAPIProps" id="@cdklabs/sbt-aws.ControlPlaneAPIProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.Initializer"></a>

```typescript
import { ControlPlaneAPIProps } from '@cdklabs/sbt-aws'

const controlPlaneAPIProps: ControlPlaneAPIProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps.property.auth">auth</a></code> | <code><a href="#@cdklabs/sbt-aws.IAuth">IAuth</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps.property.apiCorsConfig">apiCorsConfig</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.CorsPreflightOptions</code> | Settings for Cors Configuration for the ControlPlane API. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps.property.disableAPILogging">disableAPILogging</a></code> | <code>boolean</code> | *No description.* |

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

---

##### `apiCorsConfig`<sup>Optional</sup> <a name="apiCorsConfig" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.apiCorsConfig"></a>

```typescript
public readonly apiCorsConfig: CorsPreflightOptions;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.CorsPreflightOptions

Settings for Cors Configuration for the ControlPlane API.

---

##### `disableAPILogging`<sup>Optional</sup> <a name="disableAPILogging" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.disableAPILogging"></a>

```typescript
public readonly disableAPILogging: boolean;
```

- *Type:* boolean

---

### ControlPlaneProps <a name="ControlPlaneProps" id="@cdklabs/sbt-aws.ControlPlaneProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.ControlPlaneProps.Initializer"></a>

```typescript
import { ControlPlaneProps } from '@cdklabs/sbt-aws'

const controlPlaneProps: ControlPlaneProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminEmail">systemAdminEmail</a></code> | <code>string</code> | The email address of the system admin. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.apiCorsConfig">apiCorsConfig</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.CorsPreflightOptions</code> | Settings for Cors Configuration for the ControlPlane API. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.auth">auth</a></code> | <code><a href="#@cdklabs/sbt-aws.IAuth">IAuth</a></code> | The authentication provider for the control plane. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.billing">billing</a></code> | <code><a href="#@cdklabs/sbt-aws.IBilling">IBilling</a></code> | The billing provider configuration. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.disableAPILogging">disableAPILogging</a></code> | <code>boolean</code> | If true, the API Gateway will not log requests to the CloudWatch Logs. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | The event manager instance. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminName">systemAdminName</a></code> | <code>string</code> | The name of the system admin user. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminRoleName">systemAdminRoleName</a></code> | <code>string</code> | The name of the system admin role. |

---

##### `systemAdminEmail`<sup>Required</sup> <a name="systemAdminEmail" id="@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminEmail"></a>

```typescript
public readonly systemAdminEmail: string;
```

- *Type:* string

The email address of the system admin.

---

##### `apiCorsConfig`<sup>Optional</sup> <a name="apiCorsConfig" id="@cdklabs/sbt-aws.ControlPlaneProps.property.apiCorsConfig"></a>

```typescript
public readonly apiCorsConfig: CorsPreflightOptions;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.CorsPreflightOptions

Settings for Cors Configuration for the ControlPlane API.

---

##### `auth`<sup>Optional</sup> <a name="auth" id="@cdklabs/sbt-aws.ControlPlaneProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

The authentication provider for the control plane.

If not provided, CognitoAuth will be used.

---

##### `billing`<sup>Optional</sup> <a name="billing" id="@cdklabs/sbt-aws.ControlPlaneProps.property.billing"></a>

```typescript
public readonly billing: IBilling;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>

The billing provider configuration.

---

##### `disableAPILogging`<sup>Optional</sup> <a name="disableAPILogging" id="@cdklabs/sbt-aws.ControlPlaneProps.property.disableAPILogging"></a>

```typescript
public readonly disableAPILogging: boolean;
```

- *Type:* boolean
- *Default:* false

If true, the API Gateway will not log requests to the CloudWatch Logs.

---

##### `eventManager`<sup>Optional</sup> <a name="eventManager" id="@cdklabs/sbt-aws.ControlPlaneProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

The event manager instance.

If not provided, a new instance will be created.

---

##### `systemAdminName`<sup>Optional</sup> <a name="systemAdminName" id="@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminName"></a>

```typescript
public readonly systemAdminName: string;
```

- *Type:* string
- *Default:* 'admin'

The name of the system admin user.

---

##### `systemAdminRoleName`<sup>Optional</sup> <a name="systemAdminRoleName" id="@cdklabs/sbt-aws.ControlPlaneProps.property.systemAdminRoleName"></a>

```typescript
public readonly systemAdminRoleName: string;
```

- *Type:* string
- *Default:* 'SystemAdmin'

The name of the system admin role.

---

### CoreApplicationPlaneProps <a name="CoreApplicationPlaneProps" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps"></a>

Encapsulates the list of properties for a CoreApplicationPlane.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.Initializer"></a>

```typescript
import { CoreApplicationPlaneProps } from '@cdklabs/sbt-aws'

const coreApplicationPlaneProps: CoreApplicationPlaneProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.jobRunnersList">jobRunnersList</a></code> | <code><a href="#@cdklabs/sbt-aws.BashJobRunner">BashJobRunner</a>[]</code> | The list of JobRunners. |

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

---

##### `jobRunnersList`<sup>Optional</sup> <a name="jobRunnersList" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.jobRunnersList"></a>

```typescript
public readonly jobRunnersList: BashJobRunner[];
```

- *Type:* <a href="#@cdklabs/sbt-aws.BashJobRunner">BashJobRunner</a>[]

The list of JobRunners.

---

### CreateAdminUserProps <a name="CreateAdminUserProps" id="@cdklabs/sbt-aws.CreateAdminUserProps"></a>

Encapsulates the list of properties expected as inputs for creating new admin users.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.CreateAdminUserProps.Initializer"></a>

```typescript
import { CreateAdminUserProps } from '@cdklabs/sbt-aws'

const createAdminUserProps: CreateAdminUserProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CreateAdminUserProps.property.email">email</a></code> | <code>string</code> | The email address of the new admin user. |
| <code><a href="#@cdklabs/sbt-aws.CreateAdminUserProps.property.name">name</a></code> | <code>string</code> | The email address of the new admin user. |
| <code><a href="#@cdklabs/sbt-aws.CreateAdminUserProps.property.role">role</a></code> | <code>string</code> | The name of the role of the new admin user. |

---

##### `email`<sup>Required</sup> <a name="email" id="@cdklabs/sbt-aws.CreateAdminUserProps.property.email"></a>

```typescript
public readonly email: string;
```

- *Type:* string

The email address of the new admin user.

---

##### `name`<sup>Required</sup> <a name="name" id="@cdklabs/sbt-aws.CreateAdminUserProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The email address of the new admin user.

---

##### `role`<sup>Required</sup> <a name="role" id="@cdklabs/sbt-aws.CreateAdminUserProps.property.role"></a>

```typescript
public readonly role: string;
```

- *Type:* string

The name of the role of the new admin user.

---

### EventManagerProps <a name="EventManagerProps" id="@cdklabs/sbt-aws.EventManagerProps"></a>

Encapsulates the properties for an EventManager.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.EventManagerProps.Initializer"></a>

```typescript
import { EventManagerProps } from '@cdklabs/sbt-aws'

const eventManagerProps: EventManagerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | The name of the event source for events coming from the SBT application plane. |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | The name of the event source for events coming from the SBT control plane. |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The event bus to register new rules with. |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.eventMetadata">eventMetadata</a></code> | <code>{[ key: string ]: string}</code> | The EventMetadata to use to update the event defaults. |

---

##### `applicationPlaneEventSource`<sup>Optional</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.EventManagerProps.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

The name of the event source for events coming from the SBT application plane.

---

##### `controlPlaneEventSource`<sup>Optional</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.EventManagerProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

The name of the event source for events coming from the SBT control plane.

---

##### `eventBus`<sup>Optional</sup> <a name="eventBus" id="@cdklabs/sbt-aws.EventManagerProps.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to register new rules with.

One will be created if not provided.

---

##### `eventMetadata`<sup>Optional</sup> <a name="eventMetadata" id="@cdklabs/sbt-aws.EventManagerProps.property.eventMetadata"></a>

```typescript
public readonly eventMetadata: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The EventMetadata to use to update the event defaults.

---

### FirehoseAggregatorProps <a name="FirehoseAggregatorProps" id="@cdklabs/sbt-aws.FirehoseAggregatorProps"></a>

Encapsulates the list of properties for a FirehoseAggregator construct.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.FirehoseAggregatorProps.Initializer"></a>

```typescript
import { FirehoseAggregatorProps } from '@cdklabs/sbt-aws'

const firehoseAggregatorProps: FirehoseAggregatorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps.property.aggregateKeyPath">aggregateKeyPath</a></code> | <code>string</code> | The JMESPath to find the key value in the incoming data stream that will be aggregated. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps.property.aggregateValuePath">aggregateValuePath</a></code> | <code>string</code> | The JMESPath to find the numeric value of key in the incoming data stream that will be aggregated. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps.property.primaryKeyColumn">primaryKeyColumn</a></code> | <code>string</code> | The name to use for the primary key column for the dynamoDB database. |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregatorProps.property.primaryKeyPath">primaryKeyPath</a></code> | <code>string</code> | The JMESPath to find the primary key value in the incoming data stream. |

---

##### `aggregateKeyPath`<sup>Required</sup> <a name="aggregateKeyPath" id="@cdklabs/sbt-aws.FirehoseAggregatorProps.property.aggregateKeyPath"></a>

```typescript
public readonly aggregateKeyPath: string;
```

- *Type:* string

The JMESPath to find the key value in the incoming data stream that will be aggregated.

---

##### `aggregateValuePath`<sup>Required</sup> <a name="aggregateValuePath" id="@cdklabs/sbt-aws.FirehoseAggregatorProps.property.aggregateValuePath"></a>

```typescript
public readonly aggregateValuePath: string;
```

- *Type:* string

The JMESPath to find the numeric value of key in the incoming data stream that will be aggregated.

---

##### `primaryKeyColumn`<sup>Required</sup> <a name="primaryKeyColumn" id="@cdklabs/sbt-aws.FirehoseAggregatorProps.property.primaryKeyColumn"></a>

```typescript
public readonly primaryKeyColumn: string;
```

- *Type:* string

The name to use for the primary key column for the dynamoDB database.

---

##### `primaryKeyPath`<sup>Required</sup> <a name="primaryKeyPath" id="@cdklabs/sbt-aws.FirehoseAggregatorProps.property.primaryKeyPath"></a>

```typescript
public readonly primaryKeyPath: string;
```

- *Type:* string

The JMESPath to find the primary key value in the incoming data stream.

---

### SampleRegistrationWebPageProps <a name="SampleRegistrationWebPageProps" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps"></a>

Properties for the SampleRegistrationWebPage construct.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps.Initializer"></a>

```typescript
import { SampleRegistrationWebPageProps } from '@cdklabs/sbt-aws'

const sampleRegistrationWebPageProps: SampleRegistrationWebPageProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.registrationAPI">registrationAPI</a></code> | <code>aws-cdk-lib.aws_apigateway.RestApiBase</code> | The API Gateway that serves the following endpoints:. |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.userProvidedRequiredFieldsForRegistration">userProvidedRequiredFieldsForRegistration</a></code> | <code>string[]</code> | The list of required user-provided fields for registration. |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.autoDeleteBucketObjects">autoDeleteBucketObjects</a></code> | <code>boolean</code> | Whether to automatically delete objects from the S3 bucket when the stack is deleted. |
| <code><a href="#@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.imageLogoUrl">imageLogoUrl</a></code> | <code>string</code> | The URL of the image logo to display on the registration page. |

---

##### `registrationAPI`<sup>Required</sup> <a name="registrationAPI" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.registrationAPI"></a>

```typescript
public readonly registrationAPI: RestApiBase;
```

- *Type:* aws-cdk-lib.aws_apigateway.RestApiBase

The API Gateway that serves the following endpoints:.

POST /redirectmarketplacetoken: redirects to a registration page.

POST /subscriber: creates a new subscriber.

---

##### `userProvidedRequiredFieldsForRegistration`<sup>Required</sup> <a name="userProvidedRequiredFieldsForRegistration" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.userProvidedRequiredFieldsForRegistration"></a>

```typescript
public readonly userProvidedRequiredFieldsForRegistration: string[];
```

- *Type:* string[]

The list of required user-provided fields for registration.

This contains the set of fields that must be provided by the user
when registering a new customer.

This is used to dynamically update the registration page to create a
form that accepts each of the fields present in this list.

ex. ['name', 'phone']

---

##### `autoDeleteBucketObjects`<sup>Optional</sup> <a name="autoDeleteBucketObjects" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.autoDeleteBucketObjects"></a>

```typescript
public readonly autoDeleteBucketObjects: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to automatically delete objects from the S3 bucket when the stack is deleted.

---

##### `imageLogoUrl`<sup>Optional</sup> <a name="imageLogoUrl" id="@cdklabs/sbt-aws.SampleRegistrationWebPageProps.property.imageLogoUrl"></a>

```typescript
public readonly imageLogoUrl: string;
```

- *Type:* string
- *Default:* Amazon logo

The URL of the image logo to display on the registration page.

---

### TenantConfigLambdasProps <a name="TenantConfigLambdasProps" id="@cdklabs/sbt-aws.TenantConfigLambdasProps"></a>

Represents the properties required to initialize the TenantConfigLambdas.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.TenantConfigLambdasProps.Initializer"></a>

```typescript
import { TenantConfigLambdasProps } from '@cdklabs/sbt-aws'

const tenantConfigLambdasProps: TenantConfigLambdasProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantConfigIndexName">tenantConfigIndexName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetails">tenantDetails</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetailsTenantConfigColumn">tenantDetailsTenantConfigColumn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetailsTenantNameColumn">tenantDetailsTenantNameColumn</a></code> | <code>string</code> | *No description.* |

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantDetailsTenantConfigColumn`<sup>Required</sup> <a name="tenantDetailsTenantConfigColumn" id="@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetailsTenantConfigColumn"></a>

```typescript
public readonly tenantDetailsTenantConfigColumn: string;
```

- *Type:* string

---

##### `tenantDetailsTenantNameColumn`<sup>Required</sup> <a name="tenantDetailsTenantNameColumn" id="@cdklabs/sbt-aws.TenantConfigLambdasProps.property.tenantDetailsTenantNameColumn"></a>

```typescript
public readonly tenantDetailsTenantNameColumn: string;
```

- *Type:* string

---

### TenantConfigServiceProps <a name="TenantConfigServiceProps" id="@cdklabs/sbt-aws.TenantConfigServiceProps"></a>

Represents the properties required for the Tenant Config Service.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.TenantConfigServiceProps.Initializer"></a>

```typescript
import { TenantConfigServiceProps } from '@cdklabs/sbt-aws'

const tenantConfigServiceProps: TenantConfigServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpApi</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantManagementTable">tenantManagementTable</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a></code> | *No description.* |

---

##### `api`<sup>Required</sup> <a name="api" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.api"></a>

```typescript
public readonly api: HttpApi;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpApi

---

##### `tenantManagementTable`<sup>Required</sup> <a name="tenantManagementTable" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantManagementTable"></a>

```typescript
public readonly tenantManagementTable: TenantManagementTable;
```

- *Type:* <a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a>

---

### TenantManagementLambdaProps <a name="TenantManagementLambdaProps" id="@cdklabs/sbt-aws.TenantManagementLambdaProps"></a>

Represents the properties required for the Tenant Management Lambda function.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.TenantManagementLambdaProps.Initializer"></a>

```typescript
import { TenantManagementLambdaProps } from '@cdklabs/sbt-aws'

const tenantManagementLambdaProps: TenantManagementLambdaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambdaProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementLambdaProps.property.table">table</a></code> | <code><a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a></code> | *No description.* |

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.TenantManagementLambdaProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

---

##### `table`<sup>Required</sup> <a name="table" id="@cdklabs/sbt-aws.TenantManagementLambdaProps.property.table"></a>

```typescript
public readonly table: TenantManagementTable;
```

- *Type:* <a href="#@cdklabs/sbt-aws.TenantManagementTable">TenantManagementTable</a>

---

### TenantManagementServiceProps <a name="TenantManagementServiceProps" id="@cdklabs/sbt-aws.TenantManagementServiceProps"></a>

Represents the properties required to initialize the TenantManagementService.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.TenantManagementServiceProps.Initializer"></a>

```typescript
import { TenantManagementServiceProps } from '@cdklabs/sbt-aws'

const tenantManagementServiceProps: TenantManagementServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementServiceProps.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpApi</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementServiceProps.property.auth">auth</a></code> | <code><a href="#@cdklabs/sbt-aws.IAuth">IAuth</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementServiceProps.property.authorizer">authorizer</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantManagementServiceProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a></code> | *No description.* |

---

##### `api`<sup>Required</sup> <a name="api" id="@cdklabs/sbt-aws.TenantManagementServiceProps.property.api"></a>

```typescript
public readonly api: HttpApi;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpApi

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/sbt-aws.TenantManagementServiceProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

---

##### `authorizer`<sup>Required</sup> <a name="authorizer" id="@cdklabs/sbt-aws.TenantManagementServiceProps.property.authorizer"></a>

```typescript
public readonly authorizer: IHttpRouteAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.TenantManagementServiceProps.property.eventManager"></a>

```typescript
public readonly eventManager: IEventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

---

### UserManagementServiceProps <a name="UserManagementServiceProps" id="@cdklabs/sbt-aws.UserManagementServiceProps"></a>

Represents the properties required to initialize the UserManagementService.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.UserManagementServiceProps.Initializer"></a>

```typescript
import { UserManagementServiceProps } from '@cdklabs/sbt-aws'

const userManagementServiceProps: UserManagementServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.UserManagementServiceProps.property.api">api</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpApi</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.UserManagementServiceProps.property.auth">auth</a></code> | <code><a href="#@cdklabs/sbt-aws.IAuth">IAuth</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.UserManagementServiceProps.property.jwtAuthorizer">jwtAuthorizer</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer</code> | *No description.* |

---

##### `api`<sup>Required</sup> <a name="api" id="@cdklabs/sbt-aws.UserManagementServiceProps.property.api"></a>

```typescript
public readonly api: HttpApi;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpApi

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/sbt-aws.UserManagementServiceProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

---

##### `jwtAuthorizer`<sup>Required</sup> <a name="jwtAuthorizer" id="@cdklabs/sbt-aws.UserManagementServiceProps.property.jwtAuthorizer"></a>

```typescript
public readonly jwtAuthorizer: IHttpRouteAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.IHttpRouteAuthorizer

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IAuth <a name="IAuth" id="@cdklabs/sbt-aws.IAuth"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.CognitoAuth">CognitoAuth</a>, <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

Encapsulates the list of properties expected as outputs of Auth plugins.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IAuth.createAdminUser">createAdminUser</a></code> | Function to create an admin user. |

---

##### `createAdminUser` <a name="createAdminUser" id="@cdklabs/sbt-aws.IAuth.createAdminUser"></a>

```typescript
public createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void
```

Function to create an admin user.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.IAuth.createAdminUser.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.IAuth.createAdminUser.parameter.id"></a>

- *Type:* string

---

###### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.IAuth.createAdminUser.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.CreateAdminUserProps">CreateAdminUserProps</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for creating a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for deleting a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.disableUserFunction">disableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for disabling a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.enableUserFunction">enableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for enabling a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for fetching all users -- GET /users. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchUserFunction">fetchUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for fetching a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.jwtAudience">jwtAudience</a></code> | <code>string[]</code> | The list of recipients (audience) for which the JWT is intended. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.jwtIssuer">jwtIssuer</a></code> | <code>string</code> | The JWT issuer domain for the identity provider. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.machineClientId">machineClientId</a></code> | <code>string</code> | The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.machineClientSecret">machineClientSecret</a></code> | <code>aws-cdk-lib.SecretValue</code> | The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.tokenEndpoint">tokenEndpoint</a></code> | <code>string</code> | The endpoint URL for granting OAuth tokens. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.updateUserFunction">updateUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function for updating a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.userClientId">userClientId</a></code> | <code>string</code> | The client ID enabled for user-centric authentication flows, such as Authorization Code flow. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code> | <code>string</code> | The well-known endpoint URL for the control plane identity provider. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.activateTenantScope">activateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for activating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.createTenantScope">createTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for creating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.createUserScope">createUserScope</a></code> | <code>string</code> | The scope required to authorize requests for creating a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.deactivateTenantScope">deactivateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for deactivating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.deleteTenantScope">deleteTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for deleting a tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.deleteUserScope">deleteUserScope</a></code> | <code>string</code> | The scope required to authorize requests for deleting a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.disableUserScope">disableUserScope</a></code> | <code>string</code> | The scope required to authorize requests for disabling a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.enableUserScope">enableUserScope</a></code> | <code>string</code> | The scope required to authorize requests for enabling a user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchAllTenantsScope">fetchAllTenantsScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching all tenants. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchAllUsersScope">fetchAllUsersScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching all users. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchTenantScope">fetchTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching a single tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchUserScope">fetchUserScope</a></code> | <code>string</code> | The scope required to authorize requests for fetching a single user. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.updateTenantScope">updateTenantScope</a></code> | <code>string</code> | The scope required to authorize requests for updating a tenant. |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.updateUserScope">updateUserScope</a></code> | <code>string</code> | The scope required to authorize requests for updating a user. |

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.IAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for creating a user.

- POST /users

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.IAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for deleting a user.

- DELETE /user/{userId}

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/sbt-aws.IAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for disabling a user.

- PUT /user/{userId}/disable

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/sbt-aws.IAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for enabling a user.

- PUT /user/{userId}/enable

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/sbt-aws.IAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for fetching all users -- GET /users.

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/sbt-aws.IAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for fetching a user.

- GET /user/{userId}

---

##### `jwtAudience`<sup>Required</sup> <a name="jwtAudience" id="@cdklabs/sbt-aws.IAuth.property.jwtAudience"></a>

```typescript
public readonly jwtAudience: string[];
```

- *Type:* string[]

The list of recipients (audience) for which the JWT is intended.

This will be checked by the API GW to ensure only authorized
clients are provided access.

---

##### `jwtIssuer`<sup>Required</sup> <a name="jwtIssuer" id="@cdklabs/sbt-aws.IAuth.property.jwtIssuer"></a>

```typescript
public readonly jwtIssuer: string;
```

- *Type:* string

The JWT issuer domain for the identity provider.

This is the domain where the JSON Web Tokens (JWTs) are issued from.

---

##### `machineClientId`<sup>Required</sup> <a name="machineClientId" id="@cdklabs/sbt-aws.IAuth.property.machineClientId"></a>

```typescript
public readonly machineClientId: string;
```

- *Type:* string

The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow.

This client ID is used for authenticating applications or services.

---

##### `machineClientSecret`<sup>Required</sup> <a name="machineClientSecret" id="@cdklabs/sbt-aws.IAuth.property.machineClientSecret"></a>

```typescript
public readonly machineClientSecret: SecretValue;
```

- *Type:* aws-cdk-lib.SecretValue

The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow.

This secret is used in combination with the machine client ID for authenticating applications or services.

---

##### `tokenEndpoint`<sup>Required</sup> <a name="tokenEndpoint" id="@cdklabs/sbt-aws.IAuth.property.tokenEndpoint"></a>

```typescript
public readonly tokenEndpoint: string;
```

- *Type:* string

The endpoint URL for granting OAuth tokens.

This is the URL where OAuth tokens can be obtained from the authorization server.

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/sbt-aws.IAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function for updating a user.

- PUT /user/{userId}

---

##### `userClientId`<sup>Required</sup> <a name="userClientId" id="@cdklabs/sbt-aws.IAuth.property.userClientId"></a>

```typescript
public readonly userClientId: string;
```

- *Type:* string

The client ID enabled for user-centric authentication flows, such as Authorization Code flow.

This client ID is used for authenticating end-users.

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/sbt-aws.IAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

The well-known endpoint URL for the control plane identity provider.

This URL provides configuration information about the identity provider, such as issuer, authorization endpoint, and token endpoint.

---

##### `activateTenantScope`<sup>Optional</sup> <a name="activateTenantScope" id="@cdklabs/sbt-aws.IAuth.property.activateTenantScope"></a>

```typescript
public readonly activateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for activating a tenant.

This scope grants permission to activate a specific tenant.

---

##### `createTenantScope`<sup>Optional</sup> <a name="createTenantScope" id="@cdklabs/sbt-aws.IAuth.property.createTenantScope"></a>

```typescript
public readonly createTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for creating a tenant.

This scope grants permission to create a new tenant.

---

##### `createUserScope`<sup>Optional</sup> <a name="createUserScope" id="@cdklabs/sbt-aws.IAuth.property.createUserScope"></a>

```typescript
public readonly createUserScope: string;
```

- *Type:* string

The scope required to authorize requests for creating a user.

This scope grants permission to create a new user.

---

##### `deactivateTenantScope`<sup>Optional</sup> <a name="deactivateTenantScope" id="@cdklabs/sbt-aws.IAuth.property.deactivateTenantScope"></a>

```typescript
public readonly deactivateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for deactivating a tenant.

This scope grants permission to deactivate a specific tenant.

---

##### `deleteTenantScope`<sup>Optional</sup> <a name="deleteTenantScope" id="@cdklabs/sbt-aws.IAuth.property.deleteTenantScope"></a>

```typescript
public readonly deleteTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for deleting a tenant.

This scope grants permission to delete a specific tenant.

---

##### `deleteUserScope`<sup>Optional</sup> <a name="deleteUserScope" id="@cdklabs/sbt-aws.IAuth.property.deleteUserScope"></a>

```typescript
public readonly deleteUserScope: string;
```

- *Type:* string

The scope required to authorize requests for deleting a user.

This scope grants permission to delete a specific user.

---

##### `disableUserScope`<sup>Optional</sup> <a name="disableUserScope" id="@cdklabs/sbt-aws.IAuth.property.disableUserScope"></a>

```typescript
public readonly disableUserScope: string;
```

- *Type:* string

The scope required to authorize requests for disabling a user.

This scope grants permission to disable a specific user.

---

##### `enableUserScope`<sup>Optional</sup> <a name="enableUserScope" id="@cdklabs/sbt-aws.IAuth.property.enableUserScope"></a>

```typescript
public readonly enableUserScope: string;
```

- *Type:* string

The scope required to authorize requests for enabling a user.

This scope grants permission to enable a specific user.

---

##### `fetchAllTenantsScope`<sup>Optional</sup> <a name="fetchAllTenantsScope" id="@cdklabs/sbt-aws.IAuth.property.fetchAllTenantsScope"></a>

```typescript
public readonly fetchAllTenantsScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching all tenants.

This scope grants permission to fetch the details of all tenants.

---

##### `fetchAllUsersScope`<sup>Optional</sup> <a name="fetchAllUsersScope" id="@cdklabs/sbt-aws.IAuth.property.fetchAllUsersScope"></a>

```typescript
public readonly fetchAllUsersScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching all users.

This scope grants permission to fetch the details of all users.

---

##### `fetchTenantScope`<sup>Optional</sup> <a name="fetchTenantScope" id="@cdklabs/sbt-aws.IAuth.property.fetchTenantScope"></a>

```typescript
public readonly fetchTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching a single tenant.

This scope grants permission to fetch the details of a specific tenant.

---

##### `fetchUserScope`<sup>Optional</sup> <a name="fetchUserScope" id="@cdklabs/sbt-aws.IAuth.property.fetchUserScope"></a>

```typescript
public readonly fetchUserScope: string;
```

- *Type:* string

The scope required to authorize requests for fetching a single user.

This scope grants permission to fetch the details of a specific user.

---

##### `updateTenantScope`<sup>Optional</sup> <a name="updateTenantScope" id="@cdklabs/sbt-aws.IAuth.property.updateTenantScope"></a>

```typescript
public readonly updateTenantScope: string;
```

- *Type:* string

The scope required to authorize requests for updating a tenant.

This scope grants permission to update the details of a specific tenant.

---

##### `updateUserScope`<sup>Optional</sup> <a name="updateUserScope" id="@cdklabs/sbt-aws.IAuth.property.updateUserScope"></a>

```typescript
public readonly updateUserScope: string;
```

- *Type:* string

The scope required to authorize requests for updating a user.

This scope grants permission to update the details of a specific user.

---

### IBilling <a name="IBilling" id="@cdklabs/sbt-aws.IBilling"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>

Encapsulates the list of properties for an IBilling construct.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.createCustomerFunction">createCustomerFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction \| <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a></code> | The function to trigger to create a new customer. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.deleteCustomerFunction">deleteCustomerFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction \| <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a></code> | The function to trigger to delete a customer. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction \| <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a></code> | The function to trigger to create a new user. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction \| <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a></code> | The function to trigger to delete a user. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.ingestor">ingestor</a></code> | <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a></code> | The IDataIngestorAggregator responsible for accepting and aggregating the raw billing data. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.putUsageFunction">putUsageFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction \| <a href="#@cdklabs/sbt-aws.IFunctionSchedule">IFunctionSchedule</a></code> | The function responsible for taking the aggregated data and pushing that to the billing provider. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.webhookFunction">webhookFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The function to trigger when a webhook request is received. |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.webhookPath">webhookPath</a></code> | <code>string</code> | The path to the webhook resource. |

---

##### `createCustomerFunction`<sup>Required</sup> <a name="createCustomerFunction" id="@cdklabs/sbt-aws.IBilling.property.createCustomerFunction"></a>

```typescript
public readonly createCustomerFunction: IFunction | IFunctionTrigger;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction | <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a>

The function to trigger to create a new customer.

(Customer in this context is an entity that has zero or more Users.)

---

##### `deleteCustomerFunction`<sup>Required</sup> <a name="deleteCustomerFunction" id="@cdklabs/sbt-aws.IBilling.property.deleteCustomerFunction"></a>

```typescript
public readonly deleteCustomerFunction: IFunction | IFunctionTrigger;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction | <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a>

The function to trigger to delete a customer.

(Customer in this context is an entity that has zero or more Users.)

---

##### `createUserFunction`<sup>Optional</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.IBilling.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction | IFunctionTrigger;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction | <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a>

The function to trigger to create a new user.

(User in this context is an entity that belongs to a Customer.)

---

##### `deleteUserFunction`<sup>Optional</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.IBilling.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction | IFunctionTrigger;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction | <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a>

The function to trigger to delete a user.

(User in this context is an entity that belongs to a Customer.)

---

##### `ingestor`<sup>Optional</sup> <a name="ingestor" id="@cdklabs/sbt-aws.IBilling.property.ingestor"></a>

```typescript
public readonly ingestor: IDataIngestorAggregator;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>

The IDataIngestorAggregator responsible for accepting and aggregating the raw billing data.

---

##### `putUsageFunction`<sup>Optional</sup> <a name="putUsageFunction" id="@cdklabs/sbt-aws.IBilling.property.putUsageFunction"></a>

```typescript
public readonly putUsageFunction: IFunction | IFunctionSchedule;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction | <a href="#@cdklabs/sbt-aws.IFunctionSchedule">IFunctionSchedule</a>

The function responsible for taking the aggregated data and pushing that to the billing provider.

---

##### `webhookFunction`<sup>Optional</sup> <a name="webhookFunction" id="@cdklabs/sbt-aws.IBilling.property.webhookFunction"></a>

```typescript
public readonly webhookFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The function to trigger when a webhook request is received.

---

##### `webhookPath`<sup>Optional</sup> <a name="webhookPath" id="@cdklabs/sbt-aws.IBilling.property.webhookPath"></a>

```typescript
public readonly webhookPath: string;
```

- *Type:* string

The path to the webhook resource.

---

### IDataIngestorAggregator <a name="IDataIngestorAggregator" id="@cdklabs/sbt-aws.IDataIngestorAggregator"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.FirehoseAggregator">FirehoseAggregator</a>, <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>

Encapsulates the list of properties for a IDataIngestorAggregator.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataAggregator">dataAggregator</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The function responsible for aggregating the raw data coming in via the dataIngestor. |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataIngestorName">dataIngestorName</a></code> | <code>string</code> | The ingestor responsible for accepting and storing the incoming data. |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataRepository">dataRepository</a></code> | <code>aws-cdk-lib.aws_dynamodb.ITable</code> | The table containing the aggregated data. |

---

##### `dataAggregator`<sup>Required</sup> <a name="dataAggregator" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataAggregator"></a>

```typescript
public readonly dataAggregator: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The function responsible for aggregating the raw data coming in via the dataIngestor.

---

##### `dataIngestorName`<sup>Required</sup> <a name="dataIngestorName" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataIngestorName"></a>

```typescript
public readonly dataIngestorName: string;
```

- *Type:* string

The ingestor responsible for accepting and storing the incoming data.

---

##### `dataRepository`<sup>Required</sup> <a name="dataRepository" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataRepository"></a>

```typescript
public readonly dataRepository: ITable;
```

- *Type:* aws-cdk-lib.aws_dynamodb.ITable

The table containing the aggregated data.

---

### IEventManager <a name="IEventManager" id="@cdklabs/sbt-aws.IEventManager"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.EventManager">EventManager</a>, <a href="#@cdklabs/sbt-aws.IEventManager">IEventManager</a>

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.addTargetToEvent">addTargetToEvent</a></code> | Adds an IRuleTarget to an event. |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.grantPutEventsTo">grantPutEventsTo</a></code> | Provides grantee the permissions to place events on the EventManager bus. |

---

##### `addTargetToEvent` <a name="addTargetToEvent" id="@cdklabs/sbt-aws.IEventManager.addTargetToEvent"></a>

```typescript
public addTargetToEvent(scope: Construct, eventType: DetailType, target: IRuleTarget): void
```

Adds an IRuleTarget to an event.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.IEventManager.addTargetToEvent.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `eventType`<sup>Required</sup> <a name="eventType" id="@cdklabs/sbt-aws.IEventManager.addTargetToEvent.parameter.eventType"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The detail type of the event to add a target to.

---

###### `target`<sup>Required</sup> <a name="target" id="@cdklabs/sbt-aws.IEventManager.addTargetToEvent.parameter.target"></a>

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The target that will be added to the event.

---

##### `grantPutEventsTo` <a name="grantPutEventsTo" id="@cdklabs/sbt-aws.IEventManager.grantPutEventsTo"></a>

```typescript
public grantPutEventsTo(grantee: IGrantable): void
```

Provides grantee the permissions to place events on the EventManager bus.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@cdklabs/sbt-aws.IEventManager.grantPutEventsTo.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The grantee resource that will be granted the permission(s).

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | The event source used for events emitted by the application plane. |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.property.busArn">busArn</a></code> | <code>string</code> | The ARN/ID of the bus that will be used to send and receive events. |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.property.busName">busName</a></code> | <code>string</code> | The name of the bus that will be used to send and receive events. |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | The event source used for events emitted by the control plane. |
| <code><a href="#@cdklabs/sbt-aws.IEventManager.property.supportedEvents">supportedEvents</a></code> | <code>{[ key: string ]: string}</code> | List of recognized events that are available as triggers. |

---

##### `applicationPlaneEventSource`<sup>Required</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.IEventManager.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

The event source used for events emitted by the application plane.

---

##### `busArn`<sup>Required</sup> <a name="busArn" id="@cdklabs/sbt-aws.IEventManager.property.busArn"></a>

```typescript
public readonly busArn: string;
```

- *Type:* string

The ARN/ID of the bus that will be used to send and receive events.

---

##### `busName`<sup>Required</sup> <a name="busName" id="@cdklabs/sbt-aws.IEventManager.property.busName"></a>

```typescript
public readonly busName: string;
```

- *Type:* string

The name of the bus that will be used to send and receive events.

---

##### `controlPlaneEventSource`<sup>Required</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.IEventManager.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

The event source used for events emitted by the control plane.

---

##### `supportedEvents`<sup>Required</sup> <a name="supportedEvents" id="@cdklabs/sbt-aws.IEventManager.property.supportedEvents"></a>

```typescript
public readonly supportedEvents: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

List of recognized events that are available as triggers.

---

### IFunctionSchedule <a name="IFunctionSchedule" id="@cdklabs/sbt-aws.IFunctionSchedule"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.IFunctionSchedule">IFunctionSchedule</a>

Optional interface that allows specifying both the function to trigger and the schedule by which to trigger it.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IFunctionSchedule.property.handler">handler</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The function definition. |
| <code><a href="#@cdklabs/sbt-aws.IFunctionSchedule.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | The schedule that will trigger the handler function. |

---

##### `handler`<sup>Required</sup> <a name="handler" id="@cdklabs/sbt-aws.IFunctionSchedule.property.handler"></a>

```typescript
public readonly handler: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The function definition.

---

##### `schedule`<sup>Required</sup> <a name="schedule" id="@cdklabs/sbt-aws.IFunctionSchedule.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

The schedule that will trigger the handler function.

---

### IFunctionTrigger <a name="IFunctionTrigger" id="@cdklabs/sbt-aws.IFunctionTrigger"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.IFunctionTrigger">IFunctionTrigger</a>

Optional interface that allows specifying both the function to trigger and the event that will trigger it.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IFunctionTrigger.property.handler">handler</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The function definition. |
| <code><a href="#@cdklabs/sbt-aws.IFunctionTrigger.property.trigger">trigger</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | The detail-type that will trigger the handler function. |

---

##### `handler`<sup>Required</sup> <a name="handler" id="@cdklabs/sbt-aws.IFunctionTrigger.property.handler"></a>

```typescript
public readonly handler: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The function definition.

---

##### `trigger`<sup>Required</sup> <a name="trigger" id="@cdklabs/sbt-aws.IFunctionTrigger.property.trigger"></a>

```typescript
public readonly trigger: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

The detail-type that will trigger the handler function.

---

### IRoute <a name="IRoute" id="@cdklabs/sbt-aws.IRoute"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.IRoute">IRoute</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IRoute.property.integration">integration</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpRouteIntegration</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IRoute.property.method">method</a></code> | <code>aws-cdk-lib.aws_apigatewayv2.HttpMethod</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IRoute.property.path">path</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IRoute.property.scope">scope</a></code> | <code>string</code> | *No description.* |

---

##### `integration`<sup>Required</sup> <a name="integration" id="@cdklabs/sbt-aws.IRoute.property.integration"></a>

```typescript
public readonly integration: HttpRouteIntegration;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpRouteIntegration

---

##### `method`<sup>Required</sup> <a name="method" id="@cdklabs/sbt-aws.IRoute.property.method"></a>

```typescript
public readonly method: HttpMethod;
```

- *Type:* aws-cdk-lib.aws_apigatewayv2.HttpMethod

---

##### `path`<sup>Required</sup> <a name="path" id="@cdklabs/sbt-aws.IRoute.property.path"></a>

```typescript
public readonly path: string;
```

- *Type:* string

---

##### `scope`<sup>Optional</sup> <a name="scope" id="@cdklabs/sbt-aws.IRoute.property.scope"></a>

```typescript
public readonly scope: string;
```

- *Type:* string

---

## Enums <a name="Enums" id="Enums"></a>

### AWSMarketplaceSaaSPricingModel <a name="AWSMarketplaceSaaSPricingModel" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel"></a>

Enum representing the pricing models for an AWS Marketplace SaaS product.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.CONTRACTS">CONTRACTS</a></code> | Contracts pricing model. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.SUBSCRIPTIONS">SUBSCRIPTIONS</a></code> | Subscriptions pricing model. |
| <code><a href="#@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.CONTRACTS_WITH_SUBSCRIPTION">CONTRACTS_WITH_SUBSCRIPTION</a></code> | Contracts with subscription pricing model. |

---

##### `CONTRACTS` <a name="CONTRACTS" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.CONTRACTS"></a>

Contracts pricing model.

---


##### `SUBSCRIPTIONS` <a name="SUBSCRIPTIONS" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.SUBSCRIPTIONS"></a>

Subscriptions pricing model.

---


##### `CONTRACTS_WITH_SUBSCRIPTION` <a name="CONTRACTS_WITH_SUBSCRIPTION" id="@cdklabs/sbt-aws.AWSMarketplaceSaaSPricingModel.CONTRACTS_WITH_SUBSCRIPTION"></a>

Contracts with subscription pricing model.

---


### DetailType <a name="DetailType" id="@cdklabs/sbt-aws.DetailType"></a>

Provides an easy way of accessing event detail types.

The string values represent the "detail-type" used in
events sent across the EventBus.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_REQUEST">ONBOARDING_REQUEST</a></code> | Event detail type for onboarding request. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_SUCCESS">ONBOARDING_SUCCESS</a></code> | Event detail type for successful onboarding. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_FAILURE">ONBOARDING_FAILURE</a></code> | Event detail type for failed onboarding. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_REQUEST">OFFBOARDING_REQUEST</a></code> | Event detail type for offboarding request. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_SUCCESS">OFFBOARDING_SUCCESS</a></code> | Event detail type for successful offboarding. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_FAILURE">OFFBOARDING_FAILURE</a></code> | Event detail type for failed offboarding. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.PROVISION_SUCCESS">PROVISION_SUCCESS</a></code> | Event detail type for successful provisioning. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.PROVISION_FAILURE">PROVISION_FAILURE</a></code> | Event detail type for failed provisioning. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEPROVISION_SUCCESS">DEPROVISION_SUCCESS</a></code> | Event detail type for successful deprovisioning. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEPROVISION_FAILURE">DEPROVISION_FAILURE</a></code> | Event detail type for failed deprovisioning. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.BILLING_SUCCESS">BILLING_SUCCESS</a></code> | Event detail type for successful billing configuration. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.BILLING_FAILURE">BILLING_FAILURE</a></code> | Event detail type for failure to configure billing. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_REQUEST">ACTIVATE_REQUEST</a></code> | Event detail type for activation request. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_SUCCESS">ACTIVATE_SUCCESS</a></code> | Event detail type for successful activation. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_FAILURE">ACTIVATE_FAILURE</a></code> | Event detail type for failed activation. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_REQUEST">DEACTIVATE_REQUEST</a></code> | Event detail type for deactivation request. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_SUCCESS">DEACTIVATE_SUCCESS</a></code> | Event detail type for successful deactivation. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_FAILURE">DEACTIVATE_FAILURE</a></code> | Event detail type for failed deactivation. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.TENANT_USER_CREATED">TENANT_USER_CREATED</a></code> | Event detail type for user creation on the app-plane side. |
| <code><a href="#@cdklabs/sbt-aws.DetailType.TENANT_USER_DELETED">TENANT_USER_DELETED</a></code> | Event detail type for user deletion on the app-plane side. |

---

##### `ONBOARDING_REQUEST` <a name="ONBOARDING_REQUEST" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_REQUEST"></a>

Event detail type for onboarding request.

---


##### `ONBOARDING_SUCCESS` <a name="ONBOARDING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_SUCCESS"></a>

Event detail type for successful onboarding.

---


##### `ONBOARDING_FAILURE` <a name="ONBOARDING_FAILURE" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_FAILURE"></a>

Event detail type for failed onboarding.

---


##### `OFFBOARDING_REQUEST` <a name="OFFBOARDING_REQUEST" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_REQUEST"></a>

Event detail type for offboarding request.

---


##### `OFFBOARDING_SUCCESS` <a name="OFFBOARDING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_SUCCESS"></a>

Event detail type for successful offboarding.

---


##### `OFFBOARDING_FAILURE` <a name="OFFBOARDING_FAILURE" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_FAILURE"></a>

Event detail type for failed offboarding.

---


##### `PROVISION_SUCCESS` <a name="PROVISION_SUCCESS" id="@cdklabs/sbt-aws.DetailType.PROVISION_SUCCESS"></a>

Event detail type for successful provisioning.

---


##### `PROVISION_FAILURE` <a name="PROVISION_FAILURE" id="@cdklabs/sbt-aws.DetailType.PROVISION_FAILURE"></a>

Event detail type for failed provisioning.

---


##### `DEPROVISION_SUCCESS` <a name="DEPROVISION_SUCCESS" id="@cdklabs/sbt-aws.DetailType.DEPROVISION_SUCCESS"></a>

Event detail type for successful deprovisioning.

---


##### `DEPROVISION_FAILURE` <a name="DEPROVISION_FAILURE" id="@cdklabs/sbt-aws.DetailType.DEPROVISION_FAILURE"></a>

Event detail type for failed deprovisioning.

---


##### `BILLING_SUCCESS` <a name="BILLING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.BILLING_SUCCESS"></a>

Event detail type for successful billing configuration.

---


##### `BILLING_FAILURE` <a name="BILLING_FAILURE" id="@cdklabs/sbt-aws.DetailType.BILLING_FAILURE"></a>

Event detail type for failure to configure billing.

---


##### `ACTIVATE_REQUEST` <a name="ACTIVATE_REQUEST" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_REQUEST"></a>

Event detail type for activation request.

---


##### `ACTIVATE_SUCCESS` <a name="ACTIVATE_SUCCESS" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_SUCCESS"></a>

Event detail type for successful activation.

---


##### `ACTIVATE_FAILURE` <a name="ACTIVATE_FAILURE" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_FAILURE"></a>

Event detail type for failed activation.

---


##### `DEACTIVATE_REQUEST` <a name="DEACTIVATE_REQUEST" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_REQUEST"></a>

Event detail type for deactivation request.

---


##### `DEACTIVATE_SUCCESS` <a name="DEACTIVATE_SUCCESS" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_SUCCESS"></a>

Event detail type for successful deactivation.

---


##### `DEACTIVATE_FAILURE` <a name="DEACTIVATE_FAILURE" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_FAILURE"></a>

Event detail type for failed deactivation.

---


##### `TENANT_USER_CREATED` <a name="TENANT_USER_CREATED" id="@cdklabs/sbt-aws.DetailType.TENANT_USER_CREATED"></a>

Event detail type for user creation on the app-plane side.

Note that sbt-aws components do not emit this event. This event
should be emitted by the application plane.

---


##### `TENANT_USER_DELETED` <a name="TENANT_USER_DELETED" id="@cdklabs/sbt-aws.DetailType.TENANT_USER_DELETED"></a>

Event detail type for user deletion on the app-plane side.

Note that sbt-aws components do not emit this event. This event
should be emitted by the application plane.

---

