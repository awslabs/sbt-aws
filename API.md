# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### BashJobOrchestrator <a name="BashJobOrchestrator" id="@cdklabs/sbt-aws.BashJobOrchestrator"></a>

Provides a BashJobOrchestrator to execute a BashJobRunner.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.BashJobOrchestrator.Initializer"></a>

```typescript
import { BashJobOrchestrator } from '@cdklabs/sbt-aws'

new BashJobOrchestrator(scope: Construct, id: string, props: BashJobOrchestratorProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps">BashJobOrchestratorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.BashJobOrchestrator.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps">BashJobOrchestratorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.BashJobOrchestrator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.BashJobOrchestrator.isConstruct"></a>

```typescript
import { BashJobOrchestrator } from '@cdklabs/sbt-aws'

BashJobOrchestrator.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.BashJobOrchestrator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.property.eventTarget">eventTarget</a></code> | <code>aws-cdk-lib.aws_events.IRuleTarget</code> | The eventTarget to use when triggering this BashJobOrchestrator. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestrator.property.provisioningStateMachine">provisioningStateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.StateMachine</code> | The StateMachine used to implement this BashJobOrchestrator. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.BashJobOrchestrator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventTarget`<sup>Required</sup> <a name="eventTarget" id="@cdklabs/sbt-aws.BashJobOrchestrator.property.eventTarget"></a>

```typescript
public readonly eventTarget: IRuleTarget;
```

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The eventTarget to use when triggering this BashJobOrchestrator.

---

##### `provisioningStateMachine`<sup>Required</sup> <a name="provisioningStateMachine" id="@cdklabs/sbt-aws.BashJobOrchestrator.property.provisioningStateMachine"></a>

```typescript
public readonly provisioningStateMachine: StateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.StateMachine

The StateMachine used to implement this BashJobOrchestrator.

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

##### `environmentVariablesToOutgoingEvent`<sup>Optional</sup> <a name="environmentVariablesToOutgoingEvent" id="@cdklabs/sbt-aws.BashJobRunner.property.environmentVariablesToOutgoingEvent"></a>

```typescript
public readonly environmentVariablesToOutgoingEvent: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the BashJobRunner has finished.

---


### BillingProvider <a name="BillingProvider" id="@cdklabs/sbt-aws.BillingProvider"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.BillingProvider.Initializer"></a>

```typescript
import { BillingProvider } from '@cdklabs/sbt-aws'

new BillingProvider(scope: Construct, id: string, props: BillingProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.BillingProps">BillingProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.BillingProvider.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.BillingProps">BillingProps</a>

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
| <code><a href="#@cdklabs/sbt-aws.BillingProvider.property.controlPlaneAPIBillingWebhookResource">controlPlaneAPIBillingWebhookResource</a></code> | <code>aws-cdk-lib.aws_apigateway.IResource</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.BillingProvider.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneAPIBillingWebhookResource`<sup>Required</sup> <a name="controlPlaneAPIBillingWebhookResource" id="@cdklabs/sbt-aws.BillingProvider.property.controlPlaneAPIBillingWebhookResource"></a>

```typescript
public readonly controlPlaneAPIBillingWebhookResource: IResource;
```

- *Type:* aws-cdk-lib.aws_apigateway.IResource

---


### CognitoAuth <a name="CognitoAuth" id="@cdklabs/sbt-aws.CognitoAuth"></a>

- *Implements:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.CognitoAuth.Initializer"></a>

```typescript
import { CognitoAuth } from '@cdklabs/sbt-aws'

new CognitoAuth(scope: Construct, id: string, props: CognitoAuthProps)
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

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.CognitoAuth.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.CognitoAuthProps">CognitoAuthProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.CognitoAuth.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

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
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.authorizationServer">authorizationServer</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.authorizer">authorizer</a></code> | <code>aws-cdk-lib.aws_apigateway.IAuthorizer</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.clientId">clientId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.controlPlaneIdpDetails">controlPlaneIdpDetails</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.disableUserFunction">disableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.enableUserFunction">enableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.fetchUserFunction">fetchUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.updateUserFunction">updateUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.CognitoAuth.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `authorizationServer`<sup>Required</sup> <a name="authorizationServer" id="@cdklabs/sbt-aws.CognitoAuth.property.authorizationServer"></a>

```typescript
public readonly authorizationServer: string;
```

- *Type:* string

---

##### `authorizer`<sup>Required</sup> <a name="authorizer" id="@cdklabs/sbt-aws.CognitoAuth.property.authorizer"></a>

```typescript
public readonly authorizer: IAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IAuthorizer

---

##### `clientId`<sup>Required</sup> <a name="clientId" id="@cdklabs/sbt-aws.CognitoAuth.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `controlPlaneIdpDetails`<sup>Required</sup> <a name="controlPlaneIdpDetails" id="@cdklabs/sbt-aws.CognitoAuth.property.controlPlaneIdpDetails"></a>

```typescript
public readonly controlPlaneIdpDetails: string;
```

- *Type:* string

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/sbt-aws.CognitoAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/sbt-aws.CognitoAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

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
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.controlPlaneAPIGatewayUrl">controlPlaneAPIGatewayUrl</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.eventBusArn">eventBusArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.EventManager">EventManager</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlane.property.tables">tables</a></code> | <code><a href="#@cdklabs/sbt-aws.Tables">Tables</a></code> | *No description.* |

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

---

##### `eventBusArn`<sup>Required</sup> <a name="eventBusArn" id="@cdklabs/sbt-aws.ControlPlane.property.eventBusArn"></a>

```typescript
public readonly eventBusArn: string;
```

- *Type:* string

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.ControlPlane.property.eventManager"></a>

```typescript
public readonly eventManager: EventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.EventManager">EventManager</a>

---

##### `tables`<sup>Required</sup> <a name="tables" id="@cdklabs/sbt-aws.ControlPlane.property.tables"></a>

```typescript
public readonly tables: Tables;
```

- *Type:* <a href="#@cdklabs/sbt-aws.Tables">Tables</a>

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
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.billingResource">billingResource</a></code> | <code>aws-cdk-lib.aws_apigateway.Resource</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.tenantUpdateServiceTarget">tenantUpdateServiceTarget</a></code> | <code>aws-cdk-lib.aws_events_targets.ApiGateway</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPI.property.apiUrl">apiUrl</a></code> | <code>any</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `billingResource`<sup>Required</sup> <a name="billingResource" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.billingResource"></a>

```typescript
public readonly billingResource: Resource;
```

- *Type:* aws-cdk-lib.aws_apigateway.Resource

---

##### `tenantUpdateServiceTarget`<sup>Required</sup> <a name="tenantUpdateServiceTarget" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.tenantUpdateServiceTarget"></a>

```typescript
public readonly tenantUpdateServiceTarget: ApiGateway;
```

- *Type:* aws-cdk-lib.aws_events_targets.ApiGateway

---

##### `apiUrl`<sup>Required</sup> <a name="apiUrl" id="@cdklabs/sbt-aws.ControlPlaneAPI.property.apiUrl"></a>

```typescript
public readonly apiUrl: any;
```

- *Type:* any

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
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlane.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.EventManager">EventManager</a></code> | *No description.* |

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
public readonly eventManager: EventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.EventManager">EventManager</a>

---


### EventManager <a name="EventManager" id="@cdklabs/sbt-aws.EventManager"></a>

Provides an EventManager to help interact with the EventBus shared with the SBT control plane.

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.EventManager.Initializer"></a>

```typescript
import { EventManager } from '@cdklabs/sbt-aws'

new EventManager(scope: Construct, id: string, props: EventManagerProps)
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

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.EventManager.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.EventManagerProps">EventManagerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManager.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.addTargetToEvent">addTargetToEvent</a></code> | *No description.* |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.EventManager.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addTargetToEvent` <a name="addTargetToEvent" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent"></a>

```typescript
public addTargetToEvent(eventType: DetailType, target: IRuleTarget): void
```

###### `eventType`<sup>Required</sup> <a name="eventType" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent.parameter.eventType"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

---

###### `target`<sup>Required</sup> <a name="target" id="@cdklabs/sbt-aws.EventManager.addTargetToEvent.parameter.target"></a>

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

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
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The event bus to register new rules with. |
| <code><a href="#@cdklabs/sbt-aws.EventManager.property.supportedEvents">supportedEvents</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

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

---

##### `controlPlaneEventSource`<sup>Required</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.EventManager.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/sbt-aws.EventManager.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to register new rules with.

---

##### `supportedEvents`<sup>Required</sup> <a name="supportedEvents" id="@cdklabs/sbt-aws.EventManager.property.supportedEvents"></a>

```typescript
public readonly supportedEvents: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---


### FirehoseAggregator <a name="FirehoseAggregator" id="@cdklabs/sbt-aws.FirehoseAggregator"></a>

- *Implements:* <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>

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
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataAggregator">dataAggregator</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestor">dataIngestor</a></code> | <code>@aws-cdk/aws-kinesisfirehose-alpha.DeliveryStream</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestorName">dataIngestorName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.FirehoseAggregator.property.dataRepository">dataRepository</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

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

---

##### `dataIngestor`<sup>Required</sup> <a name="dataIngestor" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestor"></a>

```typescript
public readonly dataIngestor: DeliveryStream;
```

- *Type:* @aws-cdk/aws-kinesisfirehose-alpha.DeliveryStream

---

##### `dataIngestorName`<sup>Required</sup> <a name="dataIngestorName" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataIngestorName"></a>

```typescript
public readonly dataIngestorName: string;
```

- *Type:* string

---

##### `dataRepository`<sup>Required</sup> <a name="dataRepository" id="@cdklabs/sbt-aws.FirehoseAggregator.property.dataRepository"></a>

```typescript
public readonly dataRepository: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---


### LambdaLayers <a name="LambdaLayers" id="@cdklabs/sbt-aws.LambdaLayers"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.LambdaLayers.Initializer"></a>

```typescript
import { LambdaLayers } from '@cdklabs/sbt-aws'

new LambdaLayers(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.LambdaLayers.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.LambdaLayers.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.LambdaLayers.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.LambdaLayers.isConstruct"></a>

```typescript
import { LambdaLayers } from '@cdklabs/sbt-aws'

LambdaLayers.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.LambdaLayers.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.LambdaLayers.property.controlPlaneLambdaLayer">controlPlaneLambdaLayer</a></code> | <code>aws-cdk-lib.aws_lambda.LayerVersion</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.LambdaLayers.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneLambdaLayer`<sup>Required</sup> <a name="controlPlaneLambdaLayer" id="@cdklabs/sbt-aws.LambdaLayers.property.controlPlaneLambdaLayer"></a>

```typescript
public readonly controlPlaneLambdaLayer: LayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersion

---


### Messaging <a name="Messaging" id="@cdklabs/sbt-aws.Messaging"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.Messaging.Initializer"></a>

```typescript
import { Messaging } from '@cdklabs/sbt-aws'

new Messaging(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Messaging.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Messaging.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.Messaging.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.Messaging.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Messaging.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.Messaging.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Messaging.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.Messaging.isConstruct"></a>

```typescript
import { Messaging } from '@cdklabs/sbt-aws'

Messaging.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.Messaging.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Messaging.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.Messaging.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.Messaging.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/sbt-aws.Messaging.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

---


### Services <a name="Services" id="@cdklabs/sbt-aws.Services"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.Services.Initializer"></a>

```typescript
import { Services } from '@cdklabs/sbt-aws'

new Services(scope: Construct, id: string, props: ServicesProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Services.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Services.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Services.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/sbt-aws.ServicesProps">ServicesProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.Services.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.Services.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/sbt-aws.Services.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/sbt-aws.ServicesProps">ServicesProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Services.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.Services.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Services.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.Services.isConstruct"></a>

```typescript
import { Services } from '@cdklabs/sbt-aws'

Services.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.Services.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Services.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.Services.property.tenantManagementServices">tenantManagementServices</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.Services.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantManagementServices`<sup>Required</sup> <a name="tenantManagementServices" id="@cdklabs/sbt-aws.Services.property.tenantManagementServices"></a>

```typescript
public readonly tenantManagementServices: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### Tables <a name="Tables" id="@cdklabs/sbt-aws.Tables"></a>

#### Initializers <a name="Initializers" id="@cdklabs/sbt-aws.Tables.Initializer"></a>

```typescript
import { Tables } from '@cdklabs/sbt-aws'

new Tables(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Tables.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tables.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/sbt-aws.Tables.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/sbt-aws.Tables.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Tables.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/sbt-aws.Tables.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Tables.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/sbt-aws.Tables.isConstruct"></a>

```typescript
import { Tables } from '@cdklabs/sbt-aws'

Tables.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/sbt-aws.Tables.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.tenantConfigColumn">tenantConfigColumn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.tenantConfigIndexName">tenantConfigIndexName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.tenantDetails">tenantDetails</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.tenantIdColumn">tenantIdColumn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tables.property.tenantNameColumn">tenantNameColumn</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.Tables.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigColumn`<sup>Required</sup> <a name="tenantConfigColumn" id="@cdklabs/sbt-aws.Tables.property.tenantConfigColumn"></a>

```typescript
public readonly tenantConfigColumn: string;
```

- *Type:* string

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/sbt-aws.Tables.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/sbt-aws.Tables.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantIdColumn`<sup>Required</sup> <a name="tenantIdColumn" id="@cdklabs/sbt-aws.Tables.property.tenantIdColumn"></a>

```typescript
public readonly tenantIdColumn: string;
```

- *Type:* string

---

##### `tenantNameColumn`<sup>Required</sup> <a name="tenantNameColumn" id="@cdklabs/sbt-aws.Tables.property.tenantNameColumn"></a>

```typescript
public readonly tenantNameColumn: string;
```

- *Type:* string

---


### TenantConfigService <a name="TenantConfigService" id="@cdklabs/sbt-aws.TenantConfigService"></a>

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
| <code><a href="#@cdklabs/sbt-aws.TenantConfigService.property.tenantConfigServiceLambda">tenantConfigServiceLambda</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/sbt-aws.TenantConfigService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigServiceLambda`<sup>Required</sup> <a name="tenantConfigServiceLambda" id="@cdklabs/sbt-aws.TenantConfigService.property.tenantConfigServiceLambda"></a>

```typescript
public readonly tenantConfigServiceLambda: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


## Structs <a name="Structs" id="Structs"></a>

### BashJobOrchestratorProps <a name="BashJobOrchestratorProps" id="@cdklabs/sbt-aws.BashJobOrchestratorProps"></a>

Encapsulates the list of properties for a BashJobOrchestrator.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.Initializer"></a>

```typescript
import { BashJobOrchestratorProps } from '@cdklabs/sbt-aws'

const bashJobOrchestratorProps: BashJobOrchestratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.analyticsReporting">analyticsReporting</a></code> | <code>boolean</code> | Include runtime versioning information in this Stack. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.crossRegionReferences">crossRegionReferences</a></code> | <code>boolean</code> | Enable this flag to allow native cross region stack references. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.description">description</a></code> | <code>string</code> | A description of the stack. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | The AWS environment (account/region) where this stack will be deployed. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.PermissionsBoundary</code> | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.stackName">stackName</a></code> | <code>string</code> | Name to deploy the stack with. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.suppressTemplateIndentation">suppressTemplateIndentation</a></code> | <code>boolean</code> | Enable this flag to suppress indentation in generated CloudFormation templates. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method to use while deploying this stack. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Stack tags that will be applied to all the taggable resources and the stack itself. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether to enable termination protection for this stack. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.bashJobRunner">bashJobRunner</a></code> | <code><a href="#@cdklabs/sbt-aws.BashJobRunner">BashJobRunner</a></code> | The BashJobRunner to execute as part of this BashJobOrchestrator. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.detailType">detailType</a></code> | <code>string</code> | The detail type to use when publishing event bridge events. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.eventSource">eventSource</a></code> | <code>string</code> | The event source to use when publishing event bridge events. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.targetEventBus">targetEventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The event bus to publish the outgoing event to. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentJSONVariablesFromIncomingEvent">environmentJSONVariablesFromIncomingEvent</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentStringVariablesFromIncomingEvent">environmentStringVariablesFromIncomingEvent</a></code> | <code>string[]</code> | Environment variables to import into the bash job from event details field. |
| <code><a href="#@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentVariablesToOutgoingEvent">environmentVariablesToOutgoingEvent</a></code> | <code>string[]</code> | Environment variables to export into the outgoing event once the bash job has finished. |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.crossRegionReferences"></a>

```typescript
public readonly crossRegionReferences: boolean;
```

- *Type:* boolean
- *Default:* false

Enable this flag to allow native cross region stack references.

Enabling this will create a CloudFormation custom resource
in both the producing stack and consuming stack in order to perform the export/import

This feature is currently experimental

---

##### `description`<sup>Optional</sup> <a name="description" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment
- *Default:* The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

*Example*

```typescript
// Use a concrete account and region to deploy this stack to:
// `.account` and `.region` will simply return these values.
new Stack(app, 'Stack1', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  },
});

// Use the CLI's current credentials to determine the target environment:
// `.account` and `.region` will reflect the account+region the CLI
// is configured to use (based on the user CLI credentials)
new Stack(app, 'Stack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});

// Define multiple stacks stage associated with an environment
const myStage = new Stage(app, 'MyStage', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  }
});

// both of these stacks will use the stage's account/region:
// `.account` and `.region` will resolve to the concrete values as above
new MyStack(myStage, 'Stack1');
new YourStack(myStage, 'Stack2');

// Define an environment-agnostic stack:
// `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
// which will only resolve to actual values by CloudFormation during deployment.
new MyStack(app, 'Stack1');
```


##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `suppressTemplateIndentation`<sup>Optional</sup> <a name="suppressTemplateIndentation" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.suppressTemplateIndentation"></a>

```typescript
public readonly suppressTemplateIndentation: boolean;
```

- *Type:* boolean
- *Default:* the value of `@aws-cdk/core:suppressTemplateIndentation`, or `false` if that is not set.

Enable this flag to suppress indentation in generated CloudFormation templates.

If not specified, the value of the `@aws-cdk/core:suppressTemplateIndentation`
context key will be used. If that is not specified, then the
default value `false` will be used.

---

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer
- *Default:* The synthesizer specified on `App`, or `DefaultStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

The Stack Synthesizer controls aspects of synthesis and deployment,
like how assets are referenced and what IAM roles to use. For more
information, see the README of the main CDK package.

If not specified, the `defaultStackSynthesizer` from `App` will be used.
If that is not specified, `DefaultStackSynthesizer` is used if
`@aws-cdk/core:newStyleStackSynthesis` is set to `true` or the CDK major
version is v2. In CDK v1 `LegacyStackSynthesizer` is the default if no
other synthesizer is specified.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `bashJobRunner`<sup>Required</sup> <a name="bashJobRunner" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.bashJobRunner"></a>

```typescript
public readonly bashJobRunner: BashJobRunner;
```

- *Type:* <a href="#@cdklabs/sbt-aws.BashJobRunner">BashJobRunner</a>

The BashJobRunner to execute as part of this BashJobOrchestrator.

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.detailType"></a>

```typescript
public readonly detailType: string;
```

- *Type:* string

The detail type to use when publishing event bridge events.

---

##### `eventSource`<sup>Required</sup> <a name="eventSource" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.eventSource"></a>

```typescript
public readonly eventSource: string;
```

- *Type:* string

The event source to use when publishing event bridge events.

---

##### `targetEventBus`<sup>Required</sup> <a name="targetEventBus" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.targetEventBus"></a>

```typescript
public readonly targetEventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to publish the outgoing event to.

---

##### `environmentJSONVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentJSONVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentJSONVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentJSONVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

---

##### `environmentStringVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentStringVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentStringVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentStringVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

Environment variables to import into the bash job from event details field.

---

##### `environmentVariablesToOutgoingEvent`<sup>Optional</sup> <a name="environmentVariablesToOutgoingEvent" id="@cdklabs/sbt-aws.BashJobOrchestratorProps.property.environmentVariablesToOutgoingEvent"></a>

```typescript
public readonly environmentVariablesToOutgoingEvent: string[];
```

- *Type:* string[]

Environment variables to export into the outgoing event once the bash job has finished.

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
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.name">name</a></code> | <code>string</code> | The name of the BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.permissions">permissions</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The IAM permission document for the BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.script">script</a></code> | <code>string</code> | The bash script to run as part of the BashJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentVariablesFromIncomingEvent">environmentVariablesFromIncomingEvent</a></code> | <code>string[]</code> | The environment variables to import into the BashJobRunner from event details field. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentVariablesToOutgoingEvent">environmentVariablesToOutgoingEvent</a></code> | <code>string[]</code> | The environment variables to export into the outgoing event once the BashJobRunner has finished. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.postScript">postScript</a></code> | <code>string</code> | The bash script to run after the main script has completed. |
| <code><a href="#@cdklabs/sbt-aws.BashJobRunnerProps.property.scriptEnvironmentVariables">scriptEnvironmentVariables</a></code> | <code>{[ key: string ]: string}</code> | The variables to pass into the codebuild BashJobRunner. |

---

##### `name`<sup>Required</sup> <a name="name" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the BashJobRunner.

Note that this value must be unique.

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

##### `environmentVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.BashJobRunnerProps.property.environmentVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

The environment variables to import into the BashJobRunner from event details field.

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

### BillingProps <a name="BillingProps" id="@cdklabs/sbt-aws.BillingProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.BillingProps.Initializer"></a>

```typescript
import { BillingProps } from '@cdklabs/sbt-aws'

const billingProps: BillingProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.BillingProps.property.billing">billing</a></code> | <code><a href="#@cdklabs/sbt-aws.IBilling">IBilling</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProps.property.controlPlaneAPIBillingResource">controlPlaneAPIBillingResource</a></code> | <code>aws-cdk-lib.aws_apigateway.Resource</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.EventManager">EventManager</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProps.property.tenantDetailsTable">tenantDetailsTable</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.BillingProps.property.tenantIdColumn">tenantIdColumn</a></code> | <code>string</code> | *No description.* |

---

##### `billing`<sup>Required</sup> <a name="billing" id="@cdklabs/sbt-aws.BillingProps.property.billing"></a>

```typescript
public readonly billing: IBilling;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>

---

##### `controlPlaneAPIBillingResource`<sup>Required</sup> <a name="controlPlaneAPIBillingResource" id="@cdklabs/sbt-aws.BillingProps.property.controlPlaneAPIBillingResource"></a>

```typescript
public readonly controlPlaneAPIBillingResource: Resource;
```

- *Type:* aws-cdk-lib.aws_apigateway.Resource

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.BillingProps.property.eventManager"></a>

```typescript
public readonly eventManager: EventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.EventManager">EventManager</a>

---

##### `tenantDetailsTable`<sup>Required</sup> <a name="tenantDetailsTable" id="@cdklabs/sbt-aws.BillingProps.property.tenantDetailsTable"></a>

```typescript
public readonly tenantDetailsTable: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantIdColumn`<sup>Required</sup> <a name="tenantIdColumn" id="@cdklabs/sbt-aws.BillingProps.property.tenantIdColumn"></a>

```typescript
public readonly tenantIdColumn: string;
```

- *Type:* string

---

### CognitoAuthProps <a name="CognitoAuthProps" id="@cdklabs/sbt-aws.CognitoAuthProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.CognitoAuthProps.Initializer"></a>

```typescript
import { CognitoAuthProps } from '@cdklabs/sbt-aws'

const cognitoAuthProps: CognitoAuthProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.idpName">idpName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.systemAdminEmail">systemAdminEmail</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.systemAdminRoleName">systemAdminRoleName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CognitoAuthProps.property.controlPlaneCallbackURL">controlPlaneCallbackURL</a></code> | <code>string</code> | *No description.* |

---

##### `idpName`<sup>Required</sup> <a name="idpName" id="@cdklabs/sbt-aws.CognitoAuthProps.property.idpName"></a>

```typescript
public readonly idpName: string;
```

- *Type:* string

---

##### `systemAdminEmail`<sup>Required</sup> <a name="systemAdminEmail" id="@cdklabs/sbt-aws.CognitoAuthProps.property.systemAdminEmail"></a>

```typescript
public readonly systemAdminEmail: string;
```

- *Type:* string

---

##### `systemAdminRoleName`<sup>Required</sup> <a name="systemAdminRoleName" id="@cdklabs/sbt-aws.CognitoAuthProps.property.systemAdminRoleName"></a>

```typescript
public readonly systemAdminRoleName: string;
```

- *Type:* string

---

##### `controlPlaneCallbackURL`<sup>Optional</sup> <a name="controlPlaneCallbackURL" id="@cdklabs/sbt-aws.CognitoAuthProps.property.controlPlaneCallbackURL"></a>

```typescript
public readonly controlPlaneCallbackURL: string;
```

- *Type:* string

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
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps.property.services">services</a></code> | <code><a href="#@cdklabs/sbt-aws.Services">Services</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneAPIProps.property.tenantConfigServiceLambda">tenantConfigServiceLambda</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

---

##### `services`<sup>Required</sup> <a name="services" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.services"></a>

```typescript
public readonly services: Services;
```

- *Type:* <a href="#@cdklabs/sbt-aws.Services">Services</a>

---

##### `tenantConfigServiceLambda`<sup>Required</sup> <a name="tenantConfigServiceLambda" id="@cdklabs/sbt-aws.ControlPlaneAPIProps.property.tenantConfigServiceLambda"></a>

```typescript
public readonly tenantConfigServiceLambda: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

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
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.auth">auth</a></code> | <code><a href="#@cdklabs/sbt-aws.IAuth">IAuth</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | The source to use for outgoing events that will be placed on the EventBus. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.billing">billing</a></code> | <code><a href="#@cdklabs/sbt-aws.IBilling">IBilling</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | The source to use when listening for events coming from the SBT control plane. |
| <code><a href="#@cdklabs/sbt-aws.ControlPlaneProps.property.eventMetadata">eventMetadata</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/sbt-aws.ControlPlaneProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>

---

##### `applicationPlaneEventSource`<sup>Optional</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.ControlPlaneProps.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

The source to use for outgoing events that will be placed on the EventBus.

This is used as the default if the OutgoingEventMetadata source field is not set.

---

##### `billing`<sup>Optional</sup> <a name="billing" id="@cdklabs/sbt-aws.ControlPlaneProps.property.billing"></a>

```typescript
public readonly billing: IBilling;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>

---

##### `controlPlaneEventSource`<sup>Optional</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.ControlPlaneProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

The source to use when listening for events coming from the SBT control plane.

This is used as the default if the IncomingEventMetadata source field is not set.

---

##### `eventMetadata`<sup>Optional</sup> <a name="eventMetadata" id="@cdklabs/sbt-aws.ControlPlaneProps.property.eventMetadata"></a>

```typescript
public readonly eventMetadata: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### CoreApplicationPlaneJobRunnerProps <a name="CoreApplicationPlaneJobRunnerProps" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps"></a>

Encapsulates the list of properties for a CoreApplicationPlaneJobRunner.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.Initializer"></a>

```typescript
import { CoreApplicationPlaneJobRunnerProps } from '@cdklabs/sbt-aws'

const coreApplicationPlaneJobRunnerProps: CoreApplicationPlaneJobRunnerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.incomingEvent">incomingEvent</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.name">name</a></code> | <code>string</code> | The name of the CoreApplicationPlaneJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.outgoingEvent">outgoingEvent</a></code> | <code><a href="#@cdklabs/sbt-aws.DetailType">DetailType</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.permissions">permissions</a></code> | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The IAM permission document for the CoreApplicationPlaneJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.script">script</a></code> | <code>string</code> | The bash script to run as part of the CoreApplicationPlaneJobRunner. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentJSONVariablesFromIncomingEvent">environmentJSONVariablesFromIncomingEvent</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentStringVariablesFromIncomingEvent">environmentStringVariablesFromIncomingEvent</a></code> | <code>string[]</code> | The environment variables to import into the CoreApplicationPlaneJobRunner from event details field. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentVariablesToOutgoingEvent">environmentVariablesToOutgoingEvent</a></code> | <code>string[]</code> | The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.postScript">postScript</a></code> | <code>string</code> | The bash script to run after the main script has completed. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.scriptEnvironmentVariables">scriptEnvironmentVariables</a></code> | <code>{[ key: string ]: string}</code> | The variables to pass into the codebuild CoreApplicationPlaneJobRunner. |

---

##### `incomingEvent`<sup>Required</sup> <a name="incomingEvent" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.incomingEvent"></a>

```typescript
public readonly incomingEvent: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

---

##### `name`<sup>Required</sup> <a name="name" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the CoreApplicationPlaneJobRunner.

Note that this value must be unique.

---

##### `outgoingEvent`<sup>Required</sup> <a name="outgoingEvent" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.outgoingEvent"></a>

```typescript
public readonly outgoingEvent: DetailType;
```

- *Type:* <a href="#@cdklabs/sbt-aws.DetailType">DetailType</a>

---

##### `permissions`<sup>Required</sup> <a name="permissions" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.permissions"></a>

```typescript
public readonly permissions: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The IAM permission document for the CoreApplicationPlaneJobRunner.

---

##### `script`<sup>Required</sup> <a name="script" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

The bash script to run as part of the CoreApplicationPlaneJobRunner.

---

##### `environmentJSONVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentJSONVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentJSONVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentJSONVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

---

##### `environmentStringVariablesFromIncomingEvent`<sup>Optional</sup> <a name="environmentStringVariablesFromIncomingEvent" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentStringVariablesFromIncomingEvent"></a>

```typescript
public readonly environmentStringVariablesFromIncomingEvent: string[];
```

- *Type:* string[]

The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.

---

##### `environmentVariablesToOutgoingEvent`<sup>Optional</sup> <a name="environmentVariablesToOutgoingEvent" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.environmentVariablesToOutgoingEvent"></a>

```typescript
public readonly environmentVariablesToOutgoingEvent: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished.

---

##### `postScript`<sup>Optional</sup> <a name="postScript" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.postScript"></a>

```typescript
public readonly postScript: string;
```

- *Type:* string

The bash script to run after the main script has completed.

---

##### `scriptEnvironmentVariables`<sup>Optional</sup> <a name="scriptEnvironmentVariables" id="@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps.property.scriptEnvironmentVariables"></a>

```typescript
public readonly scriptEnvironmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The variables to pass into the codebuild CoreApplicationPlaneJobRunner.

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
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventBusArn">eventBusArn</a></code> | <code>string</code> | The arn belonging to the EventBus to listen for incoming messages. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | The source to use for outgoing events that will be placed on the EventBus. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | The source to use when listening for events coming from the SBT control plane. |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventMetadata">eventMetadata</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.jobRunnerPropsList">jobRunnerPropsList</a></code> | <code><a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps">CoreApplicationPlaneJobRunnerProps</a>[]</code> | The list of JobRunner definitions to create. |

---

##### `eventBusArn`<sup>Required</sup> <a name="eventBusArn" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventBusArn"></a>

```typescript
public readonly eventBusArn: string;
```

- *Type:* string

The arn belonging to the EventBus to listen for incoming messages.

This is also the EventBus on which the CoreApplicationPlane places outgoing messages on.

---

##### `applicationPlaneEventSource`<sup>Optional</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

The source to use for outgoing events that will be placed on the EventBus.

This is used as the default if the OutgoingEventMetadata source field is not set.

---

##### `controlPlaneEventSource`<sup>Optional</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

The source to use when listening for events coming from the SBT control plane.

This is used as the default if the IncomingEventMetadata source field is not set.

---

##### `eventMetadata`<sup>Optional</sup> <a name="eventMetadata" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.eventMetadata"></a>

```typescript
public readonly eventMetadata: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `jobRunnerPropsList`<sup>Optional</sup> <a name="jobRunnerPropsList" id="@cdklabs/sbt-aws.CoreApplicationPlaneProps.property.jobRunnerPropsList"></a>

```typescript
public readonly jobRunnerPropsList: CoreApplicationPlaneJobRunnerProps[];
```

- *Type:* <a href="#@cdklabs/sbt-aws.CoreApplicationPlaneJobRunnerProps">CoreApplicationPlaneJobRunnerProps</a>[]

The list of JobRunner definitions to create.

---

### EventManagerProps <a name="EventManagerProps" id="@cdklabs/sbt-aws.EventManagerProps"></a>

Encapsulates the list of properties for an eventManager.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.EventManagerProps.Initializer"></a>

```typescript
import { EventManagerProps } from '@cdklabs/sbt-aws'

const eventManagerProps: EventManagerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The event bus to register new rules with. |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.EventManagerProps.property.eventMetadata">eventMetadata</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/sbt-aws.EventManagerProps.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to register new rules with.

---

##### `applicationPlaneEventSource`<sup>Optional</sup> <a name="applicationPlaneEventSource" id="@cdklabs/sbt-aws.EventManagerProps.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

---

##### `controlPlaneEventSource`<sup>Optional</sup> <a name="controlPlaneEventSource" id="@cdklabs/sbt-aws.EventManagerProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

---

##### `eventMetadata`<sup>Optional</sup> <a name="eventMetadata" id="@cdklabs/sbt-aws.EventManagerProps.property.eventMetadata"></a>

```typescript
public readonly eventMetadata: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### FirehoseAggregatorProps <a name="FirehoseAggregatorProps" id="@cdklabs/sbt-aws.FirehoseAggregatorProps"></a>

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

### IncomingEventMetadata <a name="IncomingEventMetadata" id="@cdklabs/sbt-aws.IncomingEventMetadata"></a>

Provides metadata for incoming events.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.IncomingEventMetadata.Initializer"></a>

```typescript
import { IncomingEventMetadata } from '@cdklabs/sbt-aws'

const incomingEventMetadata: IncomingEventMetadata = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IncomingEventMetadata.property.detailType">detailType</a></code> | <code>string[]</code> | The list of detailTypes to listen for in the incoming event. |
| <code><a href="#@cdklabs/sbt-aws.IncomingEventMetadata.property.source">source</a></code> | <code>string[]</code> | The list of sources to listen for in the incoming event. |

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/sbt-aws.IncomingEventMetadata.property.detailType"></a>

```typescript
public readonly detailType: string[];
```

- *Type:* string[]

The list of detailTypes to listen for in the incoming event.

---

##### `source`<sup>Optional</sup> <a name="source" id="@cdklabs/sbt-aws.IncomingEventMetadata.property.source"></a>

```typescript
public readonly source: string[];
```

- *Type:* string[]
- *Default:* CoreApplicationPlaneProps.controlPlaneEventSource

The list of sources to listen for in the incoming event.

---

### OutgoingEventMetadata <a name="OutgoingEventMetadata" id="@cdklabs/sbt-aws.OutgoingEventMetadata"></a>

Provides metadata for outgoing events.

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.OutgoingEventMetadata.Initializer"></a>

```typescript
import { OutgoingEventMetadata } from '@cdklabs/sbt-aws'

const outgoingEventMetadata: OutgoingEventMetadata = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.OutgoingEventMetadata.property.detailType">detailType</a></code> | <code>string</code> | The detailType to set in the outgoing event. |
| <code><a href="#@cdklabs/sbt-aws.OutgoingEventMetadata.property.source">source</a></code> | <code>string</code> | The source to set in the outgoing event. |

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/sbt-aws.OutgoingEventMetadata.property.detailType"></a>

```typescript
public readonly detailType: string;
```

- *Type:* string

The detailType to set in the outgoing event.

---

##### `source`<sup>Optional</sup> <a name="source" id="@cdklabs/sbt-aws.OutgoingEventMetadata.property.source"></a>

```typescript
public readonly source: string;
```

- *Type:* string
- *Default:* CoreApplicationPlaneProps.applicationPlaneEventSource

The source to set in the outgoing event.

---

### ServicesProps <a name="ServicesProps" id="@cdklabs/sbt-aws.ServicesProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.ServicesProps.Initializer"></a>

```typescript
import { ServicesProps } from '@cdklabs/sbt-aws'

const servicesProps: ServicesProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.ServicesProps.property.eventManager">eventManager</a></code> | <code><a href="#@cdklabs/sbt-aws.EventManager">EventManager</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ServicesProps.property.lambdaLayer">lambdaLayer</a></code> | <code>aws-cdk-lib.aws_lambda.LayerVersion</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.ServicesProps.property.tables">tables</a></code> | <code><a href="#@cdklabs/sbt-aws.Tables">Tables</a></code> | *No description.* |

---

##### `eventManager`<sup>Required</sup> <a name="eventManager" id="@cdklabs/sbt-aws.ServicesProps.property.eventManager"></a>

```typescript
public readonly eventManager: EventManager;
```

- *Type:* <a href="#@cdklabs/sbt-aws.EventManager">EventManager</a>

---

##### `lambdaLayer`<sup>Required</sup> <a name="lambdaLayer" id="@cdklabs/sbt-aws.ServicesProps.property.lambdaLayer"></a>

```typescript
public readonly lambdaLayer: LayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersion

---

##### `tables`<sup>Required</sup> <a name="tables" id="@cdklabs/sbt-aws.ServicesProps.property.tables"></a>

```typescript
public readonly tables: Tables;
```

- *Type:* <a href="#@cdklabs/sbt-aws.Tables">Tables</a>

---

### Tenant <a name="Tenant" id="@cdklabs/sbt-aws.Tenant"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.Tenant.Initializer"></a>

```typescript
import { Tenant } from '@cdklabs/sbt-aws'

const tenant: Tenant = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.adminEmail">adminEmail</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.adminUserName">adminUserName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.callbackUrls">callbackUrls</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.clientId">clientId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.clientName">clientName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.customDomainName">customDomainName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.groupName">groupName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.idpDetails">idpDetails</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.name">name</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.oidcClientId">oidcClientId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.oidcClientSecret">oidcClientSecret</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.oidcIssuer">oidcIssuer</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.providerName">providerName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.supportedIdentityProviders">supportedIdentityProviders</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.tenantDomain">tenantDomain</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.tier">tier</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.Tenant.property.uniqueName">uniqueName</a></code> | <code>string</code> | *No description.* |

---

##### `adminEmail`<sup>Optional</sup> <a name="adminEmail" id="@cdklabs/sbt-aws.Tenant.property.adminEmail"></a>

```typescript
public readonly adminEmail: string;
```

- *Type:* string

---

##### `adminUserName`<sup>Optional</sup> <a name="adminUserName" id="@cdklabs/sbt-aws.Tenant.property.adminUserName"></a>

```typescript
public readonly adminUserName: string;
```

- *Type:* string

---

##### `callbackUrls`<sup>Optional</sup> <a name="callbackUrls" id="@cdklabs/sbt-aws.Tenant.property.callbackUrls"></a>

```typescript
public readonly callbackUrls: string[];
```

- *Type:* string[]

---

##### `clientId`<sup>Optional</sup> <a name="clientId" id="@cdklabs/sbt-aws.Tenant.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `clientName`<sup>Optional</sup> <a name="clientName" id="@cdklabs/sbt-aws.Tenant.property.clientName"></a>

```typescript
public readonly clientName: string;
```

- *Type:* string

---

##### `customDomainName`<sup>Optional</sup> <a name="customDomainName" id="@cdklabs/sbt-aws.Tenant.property.customDomainName"></a>

```typescript
public readonly customDomainName: string;
```

- *Type:* string

---

##### `groupName`<sup>Optional</sup> <a name="groupName" id="@cdklabs/sbt-aws.Tenant.property.groupName"></a>

```typescript
public readonly groupName: string;
```

- *Type:* string

---

##### `id`<sup>Optional</sup> <a name="id" id="@cdklabs/sbt-aws.Tenant.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `idpDetails`<sup>Optional</sup> <a name="idpDetails" id="@cdklabs/sbt-aws.Tenant.property.idpDetails"></a>

```typescript
public readonly idpDetails: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="@cdklabs/sbt-aws.Tenant.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `oidcClientId`<sup>Optional</sup> <a name="oidcClientId" id="@cdklabs/sbt-aws.Tenant.property.oidcClientId"></a>

```typescript
public readonly oidcClientId: string;
```

- *Type:* string

---

##### `oidcClientSecret`<sup>Optional</sup> <a name="oidcClientSecret" id="@cdklabs/sbt-aws.Tenant.property.oidcClientSecret"></a>

```typescript
public readonly oidcClientSecret: string;
```

- *Type:* string

---

##### `oidcIssuer`<sup>Optional</sup> <a name="oidcIssuer" id="@cdklabs/sbt-aws.Tenant.property.oidcIssuer"></a>

```typescript
public readonly oidcIssuer: string;
```

- *Type:* string

---

##### `providerName`<sup>Optional</sup> <a name="providerName" id="@cdklabs/sbt-aws.Tenant.property.providerName"></a>

```typescript
public readonly providerName: string;
```

- *Type:* string

---

##### `supportedIdentityProviders`<sup>Optional</sup> <a name="supportedIdentityProviders" id="@cdklabs/sbt-aws.Tenant.property.supportedIdentityProviders"></a>

```typescript
public readonly supportedIdentityProviders: string[];
```

- *Type:* string[]

---

##### `tenantDomain`<sup>Optional</sup> <a name="tenantDomain" id="@cdklabs/sbt-aws.Tenant.property.tenantDomain"></a>

```typescript
public readonly tenantDomain: string;
```

- *Type:* string

---

##### `tier`<sup>Optional</sup> <a name="tier" id="@cdklabs/sbt-aws.Tenant.property.tier"></a>

```typescript
public readonly tier: string;
```

- *Type:* string

---

##### `uniqueName`<sup>Optional</sup> <a name="uniqueName" id="@cdklabs/sbt-aws.Tenant.property.uniqueName"></a>

```typescript
public readonly uniqueName: string;
```

- *Type:* string

---

### TenantConfigServiceProps <a name="TenantConfigServiceProps" id="@cdklabs/sbt-aws.TenantConfigServiceProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/sbt-aws.TenantConfigServiceProps.Initializer"></a>

```typescript
import { TenantConfigServiceProps } from '@cdklabs/sbt-aws'

const tenantConfigServiceProps: TenantConfigServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantConfigIndexName">tenantConfigIndexName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetails">tenantDetails</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetailsTenantConfigColumn">tenantDetailsTenantConfigColumn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetailsTenantNameColumn">tenantDetailsTenantNameColumn</a></code> | <code>string</code> | *No description.* |

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantDetailsTenantConfigColumn`<sup>Required</sup> <a name="tenantDetailsTenantConfigColumn" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetailsTenantConfigColumn"></a>

```typescript
public readonly tenantDetailsTenantConfigColumn: string;
```

- *Type:* string

---

##### `tenantDetailsTenantNameColumn`<sup>Required</sup> <a name="tenantDetailsTenantNameColumn" id="@cdklabs/sbt-aws.TenantConfigServiceProps.property.tenantDetailsTenantNameColumn"></a>

```typescript
public readonly tenantDetailsTenantNameColumn: string;
```

- *Type:* string

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IAuth <a name="IAuth" id="@cdklabs/sbt-aws.IAuth"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.CognitoAuth">CognitoAuth</a>, <a href="#@cdklabs/sbt-aws.IAuth">IAuth</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.authorizationServer">authorizationServer</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.authorizer">authorizer</a></code> | <code>aws-cdk-lib.aws_apigateway.IAuthorizer</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.clientId">clientId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.controlPlaneIdpDetails">controlPlaneIdpDetails</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.disableUserFunction">disableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.enableUserFunction">enableUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.fetchUserFunction">fetchUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.updateUserFunction">updateUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code> | <code>string</code> | *No description.* |

---

##### `authorizationServer`<sup>Required</sup> <a name="authorizationServer" id="@cdklabs/sbt-aws.IAuth.property.authorizationServer"></a>

```typescript
public readonly authorizationServer: string;
```

- *Type:* string

---

##### `authorizer`<sup>Required</sup> <a name="authorizer" id="@cdklabs/sbt-aws.IAuth.property.authorizer"></a>

```typescript
public readonly authorizer: IAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IAuthorizer

---

##### `clientId`<sup>Required</sup> <a name="clientId" id="@cdklabs/sbt-aws.IAuth.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `controlPlaneIdpDetails`<sup>Required</sup> <a name="controlPlaneIdpDetails" id="@cdklabs/sbt-aws.IAuth.property.controlPlaneIdpDetails"></a>

```typescript
public readonly controlPlaneIdpDetails: string;
```

- *Type:* string

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.IAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.IAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/sbt-aws.IAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/sbt-aws.IAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/sbt-aws.IAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/sbt-aws.IAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/sbt-aws.IAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/sbt-aws.IAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

---

### IBilling <a name="IBilling" id="@cdklabs/sbt-aws.IBilling"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.IBilling">IBilling</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.createUserFunction">createUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.deleteUserFunction">deleteUserFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.ingestor">ingestor</a></code> | <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.putUsageFunction">putUsageFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.webhookPath">webhookPath</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IBilling.property.webhookFunction">webhookFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/sbt-aws.IBilling.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/sbt-aws.IBilling.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `ingestor`<sup>Required</sup> <a name="ingestor" id="@cdklabs/sbt-aws.IBilling.property.ingestor"></a>

```typescript
public readonly ingestor: IDataIngestorAggregator;
```

- *Type:* <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>

---

##### `putUsageFunction`<sup>Required</sup> <a name="putUsageFunction" id="@cdklabs/sbt-aws.IBilling.property.putUsageFunction"></a>

```typescript
public readonly putUsageFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `webhookPath`<sup>Required</sup> <a name="webhookPath" id="@cdklabs/sbt-aws.IBilling.property.webhookPath"></a>

```typescript
public readonly webhookPath: string;
```

- *Type:* string

---

##### `webhookFunction`<sup>Optional</sup> <a name="webhookFunction" id="@cdklabs/sbt-aws.IBilling.property.webhookFunction"></a>

```typescript
public readonly webhookFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

### IDataIngestorAggregator <a name="IDataIngestorAggregator" id="@cdklabs/sbt-aws.IDataIngestorAggregator"></a>

- *Implemented By:* <a href="#@cdklabs/sbt-aws.FirehoseAggregator">FirehoseAggregator</a>, <a href="#@cdklabs/sbt-aws.IDataIngestorAggregator">IDataIngestorAggregator</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataAggregator">dataAggregator</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataIngestorName">dataIngestorName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataRepository">dataRepository</a></code> | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |

---

##### `dataAggregator`<sup>Required</sup> <a name="dataAggregator" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataAggregator"></a>

```typescript
public readonly dataAggregator: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `dataIngestorName`<sup>Required</sup> <a name="dataIngestorName" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataIngestorName"></a>

```typescript
public readonly dataIngestorName: string;
```

- *Type:* string

---

##### `dataRepository`<sup>Required</sup> <a name="dataRepository" id="@cdklabs/sbt-aws.IDataIngestorAggregator.property.dataRepository"></a>

```typescript
public readonly dataRepository: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

## Enums <a name="Enums" id="Enums"></a>

### DetailType <a name="DetailType" id="@cdklabs/sbt-aws.DetailType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_REQUEST">ONBOARDING_REQUEST</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_SUCCESS">ONBOARDING_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ONBOARDING_FAILURE">ONBOARDING_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_REQUEST">OFFBOARDING_REQUEST</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_SUCCESS">OFFBOARDING_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.OFFBOARDING_FAILURE">OFFBOARDING_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.PROVISION_SUCCESS">PROVISION_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.PROVISION_FAILURE">PROVISION_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEPROVISION_SUCCESS">DEPROVISION_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEPROVISION_FAILURE">DEPROVISION_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.BILLING_SUCCESS">BILLING_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.BILLING_FAILURE">BILLING_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_REQUEST">ACTIVATE_REQUEST</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_SUCCESS">ACTIVATE_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.ACTIVATE_FAILURE">ACTIVATE_FAILURE</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_REQUEST">DEACTIVATE_REQUEST</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_SUCCESS">DEACTIVATE_SUCCESS</a></code> | *No description.* |
| <code><a href="#@cdklabs/sbt-aws.DetailType.DEACTIVATE_FAILURE">DEACTIVATE_FAILURE</a></code> | *No description.* |

---

##### `ONBOARDING_REQUEST` <a name="ONBOARDING_REQUEST" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_REQUEST"></a>

---


##### `ONBOARDING_SUCCESS` <a name="ONBOARDING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_SUCCESS"></a>

---


##### `ONBOARDING_FAILURE` <a name="ONBOARDING_FAILURE" id="@cdklabs/sbt-aws.DetailType.ONBOARDING_FAILURE"></a>

---


##### `OFFBOARDING_REQUEST` <a name="OFFBOARDING_REQUEST" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_REQUEST"></a>

---


##### `OFFBOARDING_SUCCESS` <a name="OFFBOARDING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_SUCCESS"></a>

---


##### `OFFBOARDING_FAILURE` <a name="OFFBOARDING_FAILURE" id="@cdklabs/sbt-aws.DetailType.OFFBOARDING_FAILURE"></a>

---


##### `PROVISION_SUCCESS` <a name="PROVISION_SUCCESS" id="@cdklabs/sbt-aws.DetailType.PROVISION_SUCCESS"></a>

---


##### `PROVISION_FAILURE` <a name="PROVISION_FAILURE" id="@cdklabs/sbt-aws.DetailType.PROVISION_FAILURE"></a>

---


##### `DEPROVISION_SUCCESS` <a name="DEPROVISION_SUCCESS" id="@cdklabs/sbt-aws.DetailType.DEPROVISION_SUCCESS"></a>

---


##### `DEPROVISION_FAILURE` <a name="DEPROVISION_FAILURE" id="@cdklabs/sbt-aws.DetailType.DEPROVISION_FAILURE"></a>

---


##### `BILLING_SUCCESS` <a name="BILLING_SUCCESS" id="@cdklabs/sbt-aws.DetailType.BILLING_SUCCESS"></a>

---


##### `BILLING_FAILURE` <a name="BILLING_FAILURE" id="@cdklabs/sbt-aws.DetailType.BILLING_FAILURE"></a>

---


##### `ACTIVATE_REQUEST` <a name="ACTIVATE_REQUEST" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_REQUEST"></a>

---


##### `ACTIVATE_SUCCESS` <a name="ACTIVATE_SUCCESS" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_SUCCESS"></a>

---


##### `ACTIVATE_FAILURE` <a name="ACTIVATE_FAILURE" id="@cdklabs/sbt-aws.DetailType.ACTIVATE_FAILURE"></a>

---


##### `DEACTIVATE_REQUEST` <a name="DEACTIVATE_REQUEST" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_REQUEST"></a>

---


##### `DEACTIVATE_SUCCESS` <a name="DEACTIVATE_SUCCESS" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_SUCCESS"></a>

---


##### `DEACTIVATE_FAILURE` <a name="DEACTIVATE_FAILURE" id="@cdklabs/sbt-aws.DetailType.DEACTIVATE_FAILURE"></a>

---

