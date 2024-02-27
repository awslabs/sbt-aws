# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### BashJobOrchestrator <a name="BashJobOrchestrator" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator"></a>

Provides a BashJobOrchestrator to execute a BashJobRunner.

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer"></a>

```typescript
import { BashJobOrchestrator } from '@cdklabs/saas-builder-toolkit'

new BashJobOrchestrator(scope: Construct, id: string, props: BashJobOrchestratorProps)
```

| **Name**                                                                                                        | **Type**                                                                                                    | **Description**   |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps">BashJobOrchestratorProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps">BashJobOrchestratorProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                        | **Description**                                    |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                              | **Description**               |
| ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.isConstruct"></a>

```typescript
import { BashJobOrchestrator } from '@cdklabs/saas-builder-toolkit'

BashJobOrchestrator.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                 | **Type**                                                | **Description**                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.node">node</a></code>                                         | <code>constructs.Node</code>                            | The tree node.                                                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.eventTarget">eventTarget</a></code>                           | <code>aws-cdk-lib.aws_events.IRuleTarget</code>         | The eventTarget to use when triggering this BashJobOrchestrator. |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.provisioningStateMachine">provisioningStateMachine</a></code> | <code>aws-cdk-lib.aws_stepfunctions.StateMachine</code> | The StateMachine used to implement this BashJobOrchestrator.     |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventTarget`<sup>Required</sup> <a name="eventTarget" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.eventTarget"></a>

```typescript
public readonly eventTarget: IRuleTarget;
```

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The eventTarget to use when triggering this BashJobOrchestrator.

---

##### `provisioningStateMachine`<sup>Required</sup> <a name="provisioningStateMachine" id="@cdklabs/saas-builder-toolkit.BashJobOrchestrator.property.provisioningStateMachine"></a>

```typescript
public readonly provisioningStateMachine: StateMachine;
```

- *Type:* aws-cdk-lib.aws_stepfunctions.StateMachine

The StateMachine used to implement this BashJobOrchestrator.

---


### BashJobRunner <a name="BashJobRunner" id="@cdklabs/saas-builder-toolkit.BashJobRunner"></a>

Provides a BashJobRunner to execute arbitrary bash code.

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer"></a>

```typescript
import { BashJobRunner } from '@cdklabs/saas-builder-toolkit'

new BashJobRunner(scope: Construct, id: string, props: BashJobRunnerProps)
```

| **Name**                                                                                                  | **Type**                                                                                        | **Description**   |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                               | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                             | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps">BashJobRunnerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.BashJobRunner.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps">BashJobRunnerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                  | **Description**                                    |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.BashJobRunner.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                        | **Description**               |
| ----------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.BashJobRunner.isConstruct"></a>

```typescript
import { BashJobRunner } from '@cdklabs/saas-builder-toolkit'

BashJobRunner.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.BashJobRunner.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                             | **Type**                                        | **Description**                                                                                  |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.property.node">node</a></code>                           | <code>constructs.Node</code>                    | The tree node.                                                                                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.property.codebuildProject">codebuildProject</a></code>   | <code>aws-cdk-lib.aws_codebuild.Project</code>  | The codebuildProject used to implement this BashJobRunner.                                       |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.property.eventTarget">eventTarget</a></code>             | <code>aws-cdk-lib.aws_events.IRuleTarget</code> | The eventTarget to use when triggering this BashJobRunner.                                       |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner.property.exportedVariables">exportedVariables</a></code> | <code>string[]</code>                           | The environment variables to export into the outgoing event once the BashJobRunner has finished. |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.BashJobRunner.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `codebuildProject`<sup>Required</sup> <a name="codebuildProject" id="@cdklabs/saas-builder-toolkit.BashJobRunner.property.codebuildProject"></a>

```typescript
public readonly codebuildProject: Project;
```

- *Type:* aws-cdk-lib.aws_codebuild.Project

The codebuildProject used to implement this BashJobRunner.

---

##### `eventTarget`<sup>Required</sup> <a name="eventTarget" id="@cdklabs/saas-builder-toolkit.BashJobRunner.property.eventTarget"></a>

```typescript
public readonly eventTarget: IRuleTarget;
```

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

The eventTarget to use when triggering this BashJobRunner.

---

##### `exportedVariables`<sup>Optional</sup> <a name="exportedVariables" id="@cdklabs/saas-builder-toolkit.BashJobRunner.property.exportedVariables"></a>

```typescript
public readonly exportedVariables: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the BashJobRunner has finished.

---


### CognitoAuth <a name="CognitoAuth" id="@cdklabs/saas-builder-toolkit.CognitoAuth"></a>

- *Implements:* <a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer"></a>

```typescript
import { CognitoAuth } from '@cdklabs/saas-builder-toolkit'

new CognitoAuth(scope: Construct, id: string, props: CognitoAuthProps)
```

| **Name**                                                                                                | **Type**                                                                                    | **Description**   |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps">CognitoAuthProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.CognitoAuth.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps">CognitoAuthProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                | **Description**                                    |
| --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.CognitoAuth.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                      | **Description**               |
| --------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.CognitoAuth.isConstruct"></a>

```typescript
import { CognitoAuth } from '@cdklabs/saas-builder-toolkit'

CognitoAuth.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.CognitoAuth.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                     | **Type**                                            | **Description**   |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.node">node</a></code>                                     | <code>constructs.Node</code>                        | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.authorizationServer">authorizationServer</a></code>       | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.authorizer">authorizer</a></code>                         | <code>aws-cdk-lib.aws_apigateway.IAuthorizer</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.clientId">clientId</a></code>                             | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.controlPlaneIdpDetails">controlPlaneIdpDetails</a></code> | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.createUserFunction">createUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.deleteUserFunction">deleteUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.disableUserFunction">disableUserFunction</a></code>       | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.enableUserFunction">enableUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code>   | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.fetchUserFunction">fetchUserFunction</a></code>           | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.updateUserFunction">updateUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code>     | <code>string</code>                                 | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `authorizationServer`<sup>Required</sup> <a name="authorizationServer" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.authorizationServer"></a>

```typescript
public readonly authorizationServer: string;
```

- *Type:* string

---

##### `authorizer`<sup>Required</sup> <a name="authorizer" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.authorizer"></a>

```typescript
public readonly authorizer: IAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IAuthorizer

---

##### `clientId`<sup>Required</sup> <a name="clientId" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `controlPlaneIdpDetails`<sup>Required</sup> <a name="controlPlaneIdpDetails" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.controlPlaneIdpDetails"></a>

```typescript
public readonly controlPlaneIdpDetails: string;
```

- *Type:* string

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/saas-builder-toolkit.CognitoAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

---


### ControlPlane <a name="ControlPlane" id="@cdklabs/saas-builder-toolkit.ControlPlane"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.ControlPlane.Initializer"></a>

```typescript
import { ControlPlane } from '@cdklabs/saas-builder-toolkit'

new ControlPlane(scope: Construct, id: string, props: ControlPlaneProps)
```

| **Name**                                                                                                 | **Type**                                                                                      | **Description**   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                             | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps">ControlPlaneProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.ControlPlane.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps">ControlPlaneProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                 | **Description**                                    |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.ControlPlane.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                       | **Description**               |
| ---------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.ControlPlane.isConstruct"></a>

```typescript
import { ControlPlane } from '@cdklabs/saas-builder-toolkit'

ControlPlane.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.ControlPlane.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                            | **Type**                     | **Description**   |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.node">node</a></code>                                           | <code>constructs.Node</code> | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.controlPlaneAPIGatewayUrl">controlPlaneAPIGatewayUrl</a></code> | <code>string</code>          | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.controlPlaneSource">controlPlaneSource</a></code>               | <code>string</code>          | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.eventBusArn">eventBusArn</a></code>                             | <code>string</code>          | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.offboardingDetailType">offboardingDetailType</a></code>         | <code>string</code>          | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlane.property.onboardingDetailType">onboardingDetailType</a></code>           | <code>string</code>          | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneAPIGatewayUrl`<sup>Required</sup> <a name="controlPlaneAPIGatewayUrl" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.controlPlaneAPIGatewayUrl"></a>

```typescript
public readonly controlPlaneAPIGatewayUrl: string;
```

- *Type:* string

---

##### `controlPlaneSource`<sup>Required</sup> <a name="controlPlaneSource" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.controlPlaneSource"></a>

```typescript
public readonly controlPlaneSource: string;
```

- *Type:* string

---

##### `eventBusArn`<sup>Required</sup> <a name="eventBusArn" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.eventBusArn"></a>

```typescript
public readonly eventBusArn: string;
```

- *Type:* string

---

##### `offboardingDetailType`<sup>Required</sup> <a name="offboardingDetailType" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.offboardingDetailType"></a>

```typescript
public readonly offboardingDetailType: string;
```

- *Type:* string

---

##### `onboardingDetailType`<sup>Required</sup> <a name="onboardingDetailType" id="@cdklabs/saas-builder-toolkit.ControlPlane.property.onboardingDetailType"></a>

```typescript
public readonly onboardingDetailType: string;
```

- *Type:* string

---


### ControlPlaneAPI <a name="ControlPlaneAPI" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer"></a>

```typescript
import { ControlPlaneAPI } from '@cdklabs/saas-builder-toolkit'

new ControlPlaneAPI(scope: Construct, id: string, props: ControlPlaneAPIProps)
```

| **Name**                                                                                                    | **Type**                                                                                            | **Description**   |
| ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps">ControlPlaneAPIProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps">ControlPlaneAPIProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                    | **Description**                                    |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                          | **Description**               |
| ------------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.isConstruct"></a>

```typescript
import { ControlPlaneAPI } from '@cdklabs/saas-builder-toolkit'

ControlPlaneAPI.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                               | **Type**                                               | **Description**   |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.node">node</a></code>                                           | <code>constructs.Node</code>                           | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.tenantUpdateServiceTarget">tenantUpdateServiceTarget</a></code> | <code>aws-cdk-lib.aws_events_targets.ApiGateway</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.apiUrl">apiUrl</a></code>                                       | <code>any</code>                                       | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantUpdateServiceTarget`<sup>Required</sup> <a name="tenantUpdateServiceTarget" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.tenantUpdateServiceTarget"></a>

```typescript
public readonly tenantUpdateServiceTarget: ApiGateway;
```

- *Type:* aws-cdk-lib.aws_events_targets.ApiGateway

---

##### `apiUrl`<sup>Required</sup> <a name="apiUrl" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPI.property.apiUrl"></a>

```typescript
public readonly apiUrl: any;
```

- *Type:* any

---


### CoreApplicationPlane <a name="CoreApplicationPlane" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane"></a>

Provides a CoreApplicationPlane.

This construct will help create resources to accelerate building an SBT-compliant Application Plane.
It can be configured to attach itself to the EventBus created by the SBT Control Plane and listen to
and respond to events created by the control plane.

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer"></a>

```typescript
import { CoreApplicationPlane } from '@cdklabs/saas-builder-toolkit'

new CoreApplicationPlane(scope: Construct, id: string, props: CoreApplicationPlaneProps)
```

| **Name**                                                                                                         | **Type**                                                                                                      | **Description**   |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                                             | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps">CoreApplicationPlaneProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps">CoreApplicationPlaneProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                         | **Description**                                    |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                               | **Description**               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.isConstruct"></a>

```typescript
import { CoreApplicationPlane } from '@cdklabs/saas-builder-toolkit'

CoreApplicationPlane.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                          | **Type**                     | **Description** |
| ------------------------------------------------------------------------------------------------- | ---------------------------- | --------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlane.property.node">node</a></code> | <code>constructs.Node</code> | The tree node.  |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlane.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### EventManager <a name="EventManager" id="@cdklabs/saas-builder-toolkit.EventManager"></a>

Provides an EventManager to help interact with the EventBus shared with the SBT control plane.

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.EventManager.Initializer"></a>

```typescript
import { EventManager } from '@cdklabs/saas-builder-toolkit'

new EventManager(scope: Construct, id: string, props: EventManagerProps)
```

| **Name**                                                                                                 | **Type**                                                                                      | **Description**   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                             | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.EventManagerProps">EventManagerProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.EventManager.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.EventManagerProps">EventManagerProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                                   | **Description**                                                            |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.toString">toString</a></code>                   | Returns a string representation of this construct.                         |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget">addRuleWithTarget</a></code> | Function to add a new rule and register a target for the newly added rule. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.EventManager.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `addRuleWithTarget` <a name="addRuleWithTarget" id="@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget"></a>

```typescript
public addRuleWithTarget(ruleName: string, eventDetailType: string[], eventSource: string[], target: IRuleTarget): void
```

Function to add a new rule and register a target for the newly added rule.

###### `ruleName`<sup>Required</sup> <a name="ruleName" id="@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget.parameter.ruleName"></a>

- *Type:* string

---

###### `eventDetailType`<sup>Required</sup> <a name="eventDetailType" id="@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget.parameter.eventDetailType"></a>

- *Type:* string[]

---

###### `eventSource`<sup>Required</sup> <a name="eventSource" id="@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget.parameter.eventSource"></a>

- *Type:* string[]

---

###### `target`<sup>Required</sup> <a name="target" id="@cdklabs/saas-builder-toolkit.EventManager.addRuleWithTarget.parameter.target"></a>

- *Type:* aws-cdk-lib.aws_events.IRuleTarget

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                       | **Description**               |
| ---------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.EventManager.isConstruct"></a>

```typescript
import { EventManager } from '@cdklabs/saas-builder-toolkit'

EventManager.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.EventManager.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                  | **Type**                     | **Description** |
| ----------------------------------------------------------------------------------------- | ---------------------------- | --------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManager.property.node">node</a></code> | <code>constructs.Node</code> | The tree node.  |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.EventManager.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


### LambdaLayers <a name="LambdaLayers" id="@cdklabs/saas-builder-toolkit.LambdaLayers"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.LambdaLayers.Initializer"></a>

```typescript
import { LambdaLayers } from '@cdklabs/saas-builder-toolkit'

new LambdaLayers(scope: Construct, id: string)
```

| **Name**                                                                                                 | **Type**                          | **Description**   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.Initializer.parameter.id">id</a></code>       | <code>string</code>               | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.LambdaLayers.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.LambdaLayers.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                 | **Description**                                    |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.LambdaLayers.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                       | **Description**               |
| ---------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.LambdaLayers.isConstruct"></a>

```typescript
import { LambdaLayers } from '@cdklabs/saas-builder-toolkit'

LambdaLayers.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.LambdaLayers.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                        | **Type**                                         | **Description**   |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.property.node">node</a></code>                                       | <code>constructs.Node</code>                     | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.LambdaLayers.property.controlPlaneLambdaLayer">controlPlaneLambdaLayer</a></code> | <code>aws-cdk-lib.aws_lambda.LayerVersion</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.LambdaLayers.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `controlPlaneLambdaLayer`<sup>Required</sup> <a name="controlPlaneLambdaLayer" id="@cdklabs/saas-builder-toolkit.LambdaLayers.property.controlPlaneLambdaLayer"></a>

```typescript
public readonly controlPlaneLambdaLayer: LayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersion

---


### Messaging <a name="Messaging" id="@cdklabs/saas-builder-toolkit.Messaging"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.Messaging.Initializer"></a>

```typescript
import { Messaging } from '@cdklabs/saas-builder-toolkit'

new Messaging(scope: Construct, id: string)
```

| **Name**                                                                                              | **Type**                          | **Description**   |
| ----------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.Initializer.parameter.id">id</a></code>       | <code>string</code>               | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.Messaging.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.Messaging.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                              | **Description**                                    |
| ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.Messaging.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                    | **Description**               |
| ------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.Messaging.isConstruct"></a>

```typescript
import { Messaging } from '@cdklabs/saas-builder-toolkit'

Messaging.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.Messaging.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                       | **Type**                                     | **Description**   |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.property.node">node</a></code>         | <code>constructs.Node</code>                 | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.Messaging.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.EventBus</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.Messaging.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/saas-builder-toolkit.Messaging.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

---


### Services <a name="Services" id="@cdklabs/saas-builder-toolkit.Services"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.Services.Initializer"></a>

```typescript
import { Services } from '@cdklabs/saas-builder-toolkit'

new Services(scope: Construct, id: string, props: ServicesProps)
```

| **Name**                                                                                             | **Type**                                                                              | **Description**   |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                     | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps">ServicesProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.Services.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.ServicesProps">ServicesProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                             | **Description**                                    |
| ------------------------------------------------------------------------------------ | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.Services.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                   | **Description**               |
| ------------------------------------------------------------------------------------------ | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.Services.isConstruct"></a>

```typescript
import { Services } from '@cdklabs/saas-builder-toolkit'

Services.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.Services.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                      | **Type**                                     | **Description**   |
| ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.property.node">node</a></code>                                         | <code>constructs.Node</code>                 | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.Services.property.tenantManagementServices">tenantManagementServices</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.Services.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantManagementServices`<sup>Required</sup> <a name="tenantManagementServices" id="@cdklabs/saas-builder-toolkit.Services.property.tenantManagementServices"></a>

```typescript
public readonly tenantManagementServices: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


### Tables <a name="Tables" id="@cdklabs/saas-builder-toolkit.Tables"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.Tables.Initializer"></a>

```typescript
import { Tables } from '@cdklabs/saas-builder-toolkit'

new Tables(scope: Construct, id: string)
```

| **Name**                                                                                           | **Type**                          | **Description**   |
| -------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.Initializer.parameter.id">id</a></code>       | <code>string</code>               | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.Tables.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.Tables.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                           | **Description**                                    |
| ---------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.Tables.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                 | **Description**               |
| ---------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.Tables.isConstruct"></a>

```typescript
import { Tables } from '@cdklabs/saas-builder-toolkit'

Tables.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.Tables.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                              | **Type**                                    | **Description**   |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.node">node</a></code>                                   | <code>constructs.Node</code>                | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.tenantConfigColumn">tenantConfigColumn</a></code>       | <code>string</code>                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.tenantConfigIndexName">tenantConfigIndexName</a></code> | <code>string</code>                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.tenantDetails">tenantDetails</a></code>                 | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.tenantIdColumn">tenantIdColumn</a></code>               | <code>string</code>                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tables.property.tenantNameColumn">tenantNameColumn</a></code>           | <code>string</code>                         | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.Tables.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigColumn`<sup>Required</sup> <a name="tenantConfigColumn" id="@cdklabs/saas-builder-toolkit.Tables.property.tenantConfigColumn"></a>

```typescript
public readonly tenantConfigColumn: string;
```

- *Type:* string

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/saas-builder-toolkit.Tables.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/saas-builder-toolkit.Tables.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantIdColumn`<sup>Required</sup> <a name="tenantIdColumn" id="@cdklabs/saas-builder-toolkit.Tables.property.tenantIdColumn"></a>

```typescript
public readonly tenantIdColumn: string;
```

- *Type:* string

---

##### `tenantNameColumn`<sup>Required</sup> <a name="tenantNameColumn" id="@cdklabs/saas-builder-toolkit.Tables.property.tenantNameColumn"></a>

```typescript
public readonly tenantNameColumn: string;
```

- *Type:* string

---


### TenantConfigService <a name="TenantConfigService" id="@cdklabs/saas-builder-toolkit.TenantConfigService"></a>

#### Initializers <a name="Initializers" id="@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer"></a>

```typescript
import { TenantConfigService } from '@cdklabs/saas-builder-toolkit'

new TenantConfigService(scope: Construct, id: string, props: TenantConfigServiceProps)
```

| **Name**                                                                                                        | **Type**                                                                                                    | **Description**   |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code>                                                                           | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.id">id</a></code>       | <code>string</code>                                                                                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps">TenantConfigServiceProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/saas-builder-toolkit.TenantConfigService.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps">TenantConfigServiceProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name**                                                                                        | **Description**                                    |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@cdklabs/saas-builder-toolkit.TenantConfigService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name**                                                                                              | **Description**               |
| ----------------------------------------------------------------------------------------------------- | ----------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/saas-builder-toolkit.TenantConfigService.isConstruct"></a>

```typescript
import { TenantConfigService } from '@cdklabs/saas-builder-toolkit'

TenantConfigService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/saas-builder-toolkit.TenantConfigService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                   | **Type**                                     | **Description**   |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.property.node">node</a></code>                                           | <code>constructs.Node</code>                 | The tree node.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigService.property.tenantConfigServiceLambda">tenantConfigServiceLambda</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/saas-builder-toolkit.TenantConfigService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `tenantConfigServiceLambda`<sup>Required</sup> <a name="tenantConfigServiceLambda" id="@cdklabs/saas-builder-toolkit.TenantConfigService.property.tenantConfigServiceLambda"></a>

```typescript
public readonly tenantConfigServiceLambda: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---


## Structs <a name="Structs" id="Structs"></a>

### BashJobOrchestratorProps <a name="BashJobOrchestratorProps" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps"></a>

Encapsulates the list of properties for a BashJobOrchestrator.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.Initializer"></a>

```typescript
import { BashJobOrchestratorProps } from '@cdklabs/saas-builder-toolkit'

const bashJobOrchestratorProps: BashJobOrchestratorProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                            | **Type**                                                                              | **Description**                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.analyticsReporting">analyticsReporting</a></code>                   | <code>boolean</code>                                                                  | Include runtime versioning information in this Stack.                                             |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.crossRegionReferences">crossRegionReferences</a></code>             | <code>boolean</code>                                                                  | Enable this flag to allow native cross region stack references.                                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.description">description</a></code>                                 | <code>string</code>                                                                   | A description of the stack.                                                                       |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.env">env</a></code>                                                 | <code>aws-cdk-lib.Environment</code>                                                  | The AWS environment (account/region) where this stack will be deployed.                           |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.permissionsBoundary">permissionsBoundary</a></code>                 | <code>aws-cdk-lib.PermissionsBoundary</code>                                          | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.stackName">stackName</a></code>                                     | <code>string</code>                                                                   | Name to deploy the stack with.                                                                    |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.suppressTemplateIndentation">suppressTemplateIndentation</a></code> | <code>boolean</code>                                                                  | Enable this flag to suppress indentation in generated CloudFormation templates.                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.synthesizer">synthesizer</a></code>                                 | <code>aws-cdk-lib.IStackSynthesizer</code>                                            | Synthesis method to use while deploying this stack.                                               |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.tags">tags</a></code>                                               | <code>{[ key: string ]: string}</code>                                                | Stack tags that will be applied to all the taggable resources and the stack itself.               |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.terminationProtection">terminationProtection</a></code>             | <code>boolean</code>                                                                  | Whether to enable termination protection for this stack.                                          |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.bashJobRunner">bashJobRunner</a></code>                             | <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunner">BashJobRunner</a></code> | The BashJobRunner to execute as part of this BashJobOrchestrator.                                 |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.detailType">detailType</a></code>                                   | <code>string</code>                                                                   | The detail type to use when publishing event bridge events.                                       |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.eventSource">eventSource</a></code>                                 | <code>string</code>                                                                   | The event source to use when publishing event bridge events.                                      |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.targetEventBus">targetEventBus</a></code>                           | <code>aws-cdk-lib.aws_events.IEventBus</code>                                         | The event bus to publish the outgoing event to.                                                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.exportedVariables">exportedVariables</a></code>                     | <code>string[]</code>                                                                 | Environment variables to export into the outgoing event once the bash job has finished.           |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.importedVariables">importedVariables</a></code>                     | <code>string[]</code>                                                                 | Environment variables to import into the bash job from event details field.                       |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.crossRegionReferences"></a>

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

##### `description`<sup>Optional</sup> <a name="description" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.env"></a>

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


##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `suppressTemplateIndentation`<sup>Optional</sup> <a name="suppressTemplateIndentation" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.suppressTemplateIndentation"></a>

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

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.synthesizer"></a>

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

##### `tags`<sup>Optional</sup> <a name="tags" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `bashJobRunner`<sup>Required</sup> <a name="bashJobRunner" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.bashJobRunner"></a>

```typescript
public readonly bashJobRunner: BashJobRunner;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.BashJobRunner">BashJobRunner</a>

The BashJobRunner to execute as part of this BashJobOrchestrator.

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.detailType"></a>

```typescript
public readonly detailType: string;
```

- *Type:* string

The detail type to use when publishing event bridge events.

---

##### `eventSource`<sup>Required</sup> <a name="eventSource" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.eventSource"></a>

```typescript
public readonly eventSource: string;
```

- *Type:* string

The event source to use when publishing event bridge events.

---

##### `targetEventBus`<sup>Required</sup> <a name="targetEventBus" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.targetEventBus"></a>

```typescript
public readonly targetEventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to publish the outgoing event to.

---

##### `exportedVariables`<sup>Optional</sup> <a name="exportedVariables" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.exportedVariables"></a>

```typescript
public readonly exportedVariables: string[];
```

- *Type:* string[]

Environment variables to export into the outgoing event once the bash job has finished.

---

##### `importedVariables`<sup>Optional</sup> <a name="importedVariables" id="@cdklabs/saas-builder-toolkit.BashJobOrchestratorProps.property.importedVariables"></a>

```typescript
public readonly importedVariables: string[];
```

- *Type:* string[]

Environment variables to import into the bash job from event details field.

---

### BashJobRunnerProps <a name="BashJobRunnerProps" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps"></a>

Encapsulates the list of properties for a BashJobRunner.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.Initializer"></a>

```typescript
import { BashJobRunnerProps } from '@cdklabs/saas-builder-toolkit'

const bashJobRunnerProps: BashJobRunnerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                    | **Type**                                        | **Description**                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.eventBus">eventBus</a></code>                                     | <code>aws-cdk-lib.aws_events.IEventBus</code>   | The eventBus to submit the outgoing event to once the BashJobRunner has finished.                |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.name">name</a></code>                                             | <code>string</code>                             | The name of the BashJobRunner.                                                                   |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.outgoingEventDetailType">outgoingEventDetailType</a></code>       | <code>string</code>                             | The detail type of the event that will be emitted once the BashJobRunner has finished.           |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.outgoingEventSource">outgoingEventSource</a></code>               | <code>string</code>                             | The source of the event that will be emitted once the BashJobRunner has finished.                |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.permissions">permissions</a></code>                               | <code>aws-cdk-lib.aws_iam.PolicyDocument</code> | The IAM permission document for the BashJobRunner.                                               |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.script">script</a></code>                                         | <code>string</code>                             | The bash script to run as part of the BashJobRunner.                                             |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.exportedVariables">exportedVariables</a></code>                   | <code>string[]</code>                           | The environment variables to export into the outgoing event once the BashJobRunner has finished. |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.importedVariables">importedVariables</a></code>                   | <code>string[]</code>                           | The environment variables to import into the BashJobRunner from event details field.             |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.postScript">postScript</a></code>                                 | <code>string</code>                             | The bash script to run after the main script has completed.                                      |
| <code><a href="#@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.scriptEnvironmentVariables">scriptEnvironmentVariables</a></code> | <code>{[ key: string ]: string}</code>          | The variables to pass into the codebuild BashJobRunner.                                          |

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The eventBus to submit the outgoing event to once the BashJobRunner has finished.

---

##### `name`<sup>Required</sup> <a name="name" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the BashJobRunner.

Note that this value must be unique.

---

##### `outgoingEventDetailType`<sup>Required</sup> <a name="outgoingEventDetailType" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.outgoingEventDetailType"></a>

```typescript
public readonly outgoingEventDetailType: string;
```

- *Type:* string

The detail type of the event that will be emitted once the BashJobRunner has finished.

---

##### `outgoingEventSource`<sup>Required</sup> <a name="outgoingEventSource" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.outgoingEventSource"></a>

```typescript
public readonly outgoingEventSource: string;
```

- *Type:* string

The source of the event that will be emitted once the BashJobRunner has finished.

---

##### `permissions`<sup>Required</sup> <a name="permissions" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.permissions"></a>

```typescript
public readonly permissions: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The IAM permission document for the BashJobRunner.

---

##### `script`<sup>Required</sup> <a name="script" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

The bash script to run as part of the BashJobRunner.

---

##### `exportedVariables`<sup>Optional</sup> <a name="exportedVariables" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.exportedVariables"></a>

```typescript
public readonly exportedVariables: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the BashJobRunner has finished.

---

##### `importedVariables`<sup>Optional</sup> <a name="importedVariables" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.importedVariables"></a>

```typescript
public readonly importedVariables: string[];
```

- *Type:* string[]

The environment variables to import into the BashJobRunner from event details field.

---

##### `postScript`<sup>Optional</sup> <a name="postScript" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.postScript"></a>

```typescript
public readonly postScript: string;
```

- *Type:* string

The bash script to run after the main script has completed.

---

##### `scriptEnvironmentVariables`<sup>Optional</sup> <a name="scriptEnvironmentVariables" id="@cdklabs/saas-builder-toolkit.BashJobRunnerProps.property.scriptEnvironmentVariables"></a>

```typescript
public readonly scriptEnvironmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The variables to pass into the codebuild BashJobRunner.

---

### CognitoAuthProps <a name="CognitoAuthProps" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps.Initializer"></a>

```typescript
import { CognitoAuthProps } from '@cdklabs/saas-builder-toolkit'

const cognitoAuthProps: CognitoAuthProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                            | **Type**            | **Description**   |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.idpName">idpName</a></code>                                 | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.systemAdminEmail">systemAdminEmail</a></code>               | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.systemAdminRoleName">systemAdminRoleName</a></code>         | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.controlPlaneCallbackURL">controlPlaneCallbackURL</a></code> | <code>string</code> | *No description.* |

---

##### `idpName`<sup>Required</sup> <a name="idpName" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.idpName"></a>

```typescript
public readonly idpName: string;
```

- *Type:* string

---

##### `systemAdminEmail`<sup>Required</sup> <a name="systemAdminEmail" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.systemAdminEmail"></a>

```typescript
public readonly systemAdminEmail: string;
```

- *Type:* string

---

##### `systemAdminRoleName`<sup>Required</sup> <a name="systemAdminRoleName" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.systemAdminRoleName"></a>

```typescript
public readonly systemAdminRoleName: string;
```

- *Type:* string

---

##### `controlPlaneCallbackURL`<sup>Optional</sup> <a name="controlPlaneCallbackURL" id="@cdklabs/saas-builder-toolkit.CognitoAuthProps.property.controlPlaneCallbackURL"></a>

```typescript
public readonly controlPlaneCallbackURL: string;
```

- *Type:* string

---

### ControlPlaneAPIProps <a name="ControlPlaneAPIProps" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.Initializer"></a>

```typescript
import { ControlPlaneAPIProps } from '@cdklabs/saas-builder-toolkit'

const controlPlaneAPIProps: ControlPlaneAPIProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                    | **Type**                                                                    | **Description**   |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.auth">auth</a></code>                                           | <code><a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a></code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.services">services</a></code>                                   | <code><a href="#@cdklabs/saas-builder-toolkit.Services">Services</a></code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.tenantConfigServiceLambda">tenantConfigServiceLambda</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code>                                | *No description.* |

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a>

---

##### `services`<sup>Required</sup> <a name="services" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.services"></a>

```typescript
public readonly services: Services;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.Services">Services</a>

---

##### `tenantConfigServiceLambda`<sup>Required</sup> <a name="tenantConfigServiceLambda" id="@cdklabs/saas-builder-toolkit.ControlPlaneAPIProps.property.tenantConfigServiceLambda"></a>

```typescript
public readonly tenantConfigServiceLambda: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

---

### ControlPlaneProps <a name="ControlPlaneProps" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.Initializer"></a>

```typescript
import { ControlPlaneProps } from '@cdklabs/saas-builder-toolkit'

const controlPlaneProps: ControlPlaneProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                     | **Type**                                                              | **Description**   |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.applicationPlaneEventSource">applicationPlaneEventSource</a></code> | <code>string</code>                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.auth">auth</a></code>                                               | <code><a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a></code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code>         | <code>string</code>                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.offboardingDetailType">offboardingDetailType</a></code>             | <code>string</code>                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.onboardingDetailType">onboardingDetailType</a></code>               | <code>string</code>                                                   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.provisioningDetailType">provisioningDetailType</a></code>           | <code>string</code>                                                   | *No description.* |

---

##### `applicationPlaneEventSource`<sup>Required</sup> <a name="applicationPlaneEventSource" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.applicationPlaneEventSource"></a>

```typescript
public readonly applicationPlaneEventSource: string;
```

- *Type:* string

---

##### `auth`<sup>Required</sup> <a name="auth" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.auth"></a>

```typescript
public readonly auth: IAuth;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a>

---

##### `controlPlaneEventSource`<sup>Required</sup> <a name="controlPlaneEventSource" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

---

##### `offboardingDetailType`<sup>Required</sup> <a name="offboardingDetailType" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.offboardingDetailType"></a>

```typescript
public readonly offboardingDetailType: string;
```

- *Type:* string

---

##### `onboardingDetailType`<sup>Required</sup> <a name="onboardingDetailType" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.onboardingDetailType"></a>

```typescript
public readonly onboardingDetailType: string;
```

- *Type:* string

---

##### `provisioningDetailType`<sup>Required</sup> <a name="provisioningDetailType" id="@cdklabs/saas-builder-toolkit.ControlPlaneProps.property.provisioningDetailType"></a>

```typescript
public readonly provisioningDetailType: string;
```

- *Type:* string

---

### CoreApplicationPlaneJobRunnerProps <a name="CoreApplicationPlaneJobRunnerProps" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps"></a>

Encapsulates the list of properties for a CoreApplicationPlaneJobRunner.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.Initializer"></a>

```typescript
import { CoreApplicationPlaneJobRunnerProps } from '@cdklabs/saas-builder-toolkit'

const coreApplicationPlaneJobRunnerProps: CoreApplicationPlaneJobRunnerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                                    | **Type**                                                                                              | **Description**                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.incomingEvent">incomingEvent</a></code>                           | <code><a href="#@cdklabs/saas-builder-toolkit.IncomingEventMetadata">IncomingEventMetadata</a></code> | The IncomingEventMetadata to use when listening for the event that will trigger this CoreApplicationPlaneJobRunner. |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.name">name</a></code>                                             | <code>string</code>                                                                                   | The name of the CoreApplicationPlaneJobRunner.                                                                      |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.outgoingEvent">outgoingEvent</a></code>                           | <code><a href="#@cdklabs/saas-builder-toolkit.OutgoingEventMetadata">OutgoingEventMetadata</a></code> | The OutgoingEventMetadata to use when submitting a new event after this CoreApplicationPlaneJobRunner has executed. |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.permissions">permissions</a></code>                               | <code>aws-cdk-lib.aws_iam.PolicyDocument</code>                                                       | The IAM permission document for the CoreApplicationPlaneJobRunner.                                                  |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.script">script</a></code>                                         | <code>string</code>                                                                                   | The bash script to run as part of the CoreApplicationPlaneJobRunner.                                                |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.exportedVariables">exportedVariables</a></code>                   | <code>string[]</code>                                                                                 | The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished.    |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.importedVariables">importedVariables</a></code>                   | <code>string[]</code>                                                                                 | The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.                |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.postScript">postScript</a></code>                                 | <code>string</code>                                                                                   | The bash script to run after the main script has completed.                                                         |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.scriptEnvironmentVariables">scriptEnvironmentVariables</a></code> | <code>{[ key: string ]: string}</code>                                                                | The variables to pass into the codebuild CoreApplicationPlaneJobRunner.                                             |

---

##### `incomingEvent`<sup>Required</sup> <a name="incomingEvent" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.incomingEvent"></a>

```typescript
public readonly incomingEvent: IncomingEventMetadata;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.IncomingEventMetadata">IncomingEventMetadata</a>

The IncomingEventMetadata to use when listening for the event that will trigger this CoreApplicationPlaneJobRunner.

---

##### `name`<sup>Required</sup> <a name="name" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

The name of the CoreApplicationPlaneJobRunner.

Note that this value must be unique.

---

##### `outgoingEvent`<sup>Required</sup> <a name="outgoingEvent" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.outgoingEvent"></a>

```typescript
public readonly outgoingEvent: OutgoingEventMetadata;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.OutgoingEventMetadata">OutgoingEventMetadata</a>

The OutgoingEventMetadata to use when submitting a new event after this CoreApplicationPlaneJobRunner has executed.

---

##### `permissions`<sup>Required</sup> <a name="permissions" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.permissions"></a>

```typescript
public readonly permissions: PolicyDocument;
```

- *Type:* aws-cdk-lib.aws_iam.PolicyDocument

The IAM permission document for the CoreApplicationPlaneJobRunner.

---

##### `script`<sup>Required</sup> <a name="script" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.script"></a>

```typescript
public readonly script: string;
```

- *Type:* string

The bash script to run as part of the CoreApplicationPlaneJobRunner.

---

##### `exportedVariables`<sup>Optional</sup> <a name="exportedVariables" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.exportedVariables"></a>

```typescript
public readonly exportedVariables: string[];
```

- *Type:* string[]

The environment variables to export into the outgoing event once the CoreApplicationPlaneJobRunner has finished.

---

##### `importedVariables`<sup>Optional</sup> <a name="importedVariables" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.importedVariables"></a>

```typescript
public readonly importedVariables: string[];
```

- *Type:* string[]

The environment variables to import into the CoreApplicationPlaneJobRunner from event details field.

---

##### `postScript`<sup>Optional</sup> <a name="postScript" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.postScript"></a>

```typescript
public readonly postScript: string;
```

- *Type:* string

The bash script to run after the main script has completed.

---

##### `scriptEnvironmentVariables`<sup>Optional</sup> <a name="scriptEnvironmentVariables" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps.property.scriptEnvironmentVariables"></a>

```typescript
public readonly scriptEnvironmentVariables: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

The variables to pass into the codebuild CoreApplicationPlaneJobRunner.

---

### CoreApplicationPlaneProps <a name="CoreApplicationPlaneProps" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps"></a>

Encapsulates the list of properties for a CoreApplicationPlane.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.Initializer"></a>

```typescript
import { CoreApplicationPlaneProps } from '@cdklabs/saas-builder-toolkit'

const coreApplicationPlaneProps: CoreApplicationPlaneProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                           | **Type**                                                                                                                          | **Description**                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.applicationNamePlaneSource">applicationNamePlaneSource</a></code> | <code>string</code>                                                                                                               | The source to use for outgoing events that will be placed on the EventBus.     |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.controlPlaneSource">controlPlaneSource</a></code>                 | <code>string</code>                                                                                                               | The source to use when listening for events coming from the SBT control plane. |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.eventBusArn">eventBusArn</a></code>                               | <code>string</code>                                                                                                               | The arn belonging to the EventBus to listen for incoming messages.             |
| <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.jobRunnerPropsList">jobRunnerPropsList</a></code>                 | <code><a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps">CoreApplicationPlaneJobRunnerProps</a>[]</code> | The list of JobRunner definitions to create.                                   |

---

##### `applicationNamePlaneSource`<sup>Required</sup> <a name="applicationNamePlaneSource" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.applicationNamePlaneSource"></a>

```typescript
public readonly applicationNamePlaneSource: string;
```

- *Type:* string

The source to use for outgoing events that will be placed on the EventBus.

This is used as the default if the OutgoingEventMetadata source field is not set.

---

##### `controlPlaneSource`<sup>Required</sup> <a name="controlPlaneSource" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.controlPlaneSource"></a>

```typescript
public readonly controlPlaneSource: string;
```

- *Type:* string

The source to use when listening for events coming from the SBT control plane.

This is used as the default if the IncomingEventMetadata source field is not set.

---

##### `eventBusArn`<sup>Required</sup> <a name="eventBusArn" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.eventBusArn"></a>

```typescript
public readonly eventBusArn: string;
```

- *Type:* string

The arn belonging to the EventBus to listen for incoming messages.

This is also the EventBus on which the CoreApplicationPlane places outgoing messages on.

---

##### `jobRunnerPropsList`<sup>Optional</sup> <a name="jobRunnerPropsList" id="@cdklabs/saas-builder-toolkit.CoreApplicationPlaneProps.property.jobRunnerPropsList"></a>

```typescript
public readonly jobRunnerPropsList: CoreApplicationPlaneJobRunnerProps[];
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.CoreApplicationPlaneJobRunnerProps">CoreApplicationPlaneJobRunnerProps</a>[]

The list of JobRunner definitions to create.

---

### EventManagerProps <a name="EventManagerProps" id="@cdklabs/saas-builder-toolkit.EventManagerProps"></a>

Encapsulates the list of properties for an eventManager.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.EventManagerProps.Initializer"></a>

```typescript
import { EventManagerProps } from '@cdklabs/saas-builder-toolkit'

const eventManagerProps: EventManagerProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                               | **Type**                                      | **Description**                           |
| ------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.EventManagerProps.property.eventBus">eventBus</a></code> | <code>aws-cdk-lib.aws_events.IEventBus</code> | The event bus to register new rules with. |

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/saas-builder-toolkit.EventManagerProps.property.eventBus"></a>

```typescript
public readonly eventBus: IEventBus;
```

- *Type:* aws-cdk-lib.aws_events.IEventBus

The event bus to register new rules with.

---

### IncomingEventMetadata <a name="IncomingEventMetadata" id="@cdklabs/saas-builder-toolkit.IncomingEventMetadata"></a>

Provides metadata for incoming events.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.IncomingEventMetadata.Initializer"></a>

```typescript
import { IncomingEventMetadata } from '@cdklabs/saas-builder-toolkit'

const incomingEventMetadata: IncomingEventMetadata = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                       | **Type**              | **Description**                                              |
| -------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| <code><a href="#@cdklabs/saas-builder-toolkit.IncomingEventMetadata.property.detailType">detailType</a></code> | <code>string[]</code> | The list of detailTypes to listen for in the incoming event. |
| <code><a href="#@cdklabs/saas-builder-toolkit.IncomingEventMetadata.property.source">source</a></code>         | <code>string[]</code> | The list of sources to listen for in the incoming event.     |

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/saas-builder-toolkit.IncomingEventMetadata.property.detailType"></a>

```typescript
public readonly detailType: string[];
```

- *Type:* string[]

The list of detailTypes to listen for in the incoming event.

---

##### `source`<sup>Optional</sup> <a name="source" id="@cdklabs/saas-builder-toolkit.IncomingEventMetadata.property.source"></a>

```typescript
public readonly source: string[];
```

- *Type:* string[]
- *Default:* CoreApplicationPlaneProps.controlPlaneSource

The list of sources to listen for in the incoming event.

---

### OutgoingEventMetadata <a name="OutgoingEventMetadata" id="@cdklabs/saas-builder-toolkit.OutgoingEventMetadata"></a>

Provides metadata for outgoing events.

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.OutgoingEventMetadata.Initializer"></a>

```typescript
import { OutgoingEventMetadata } from '@cdklabs/saas-builder-toolkit'

const outgoingEventMetadata: OutgoingEventMetadata = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                       | **Type**            | **Description**                              |
| -------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.OutgoingEventMetadata.property.detailType">detailType</a></code> | <code>string</code> | The detailType to set in the outgoing event. |
| <code><a href="#@cdklabs/saas-builder-toolkit.OutgoingEventMetadata.property.source">source</a></code>         | <code>string</code> | The source to set in the outgoing event.     |

---

##### `detailType`<sup>Required</sup> <a name="detailType" id="@cdklabs/saas-builder-toolkit.OutgoingEventMetadata.property.detailType"></a>

```typescript
public readonly detailType: string;
```

- *Type:* string

The detailType to set in the outgoing event.

---

##### `source`<sup>Optional</sup> <a name="source" id="@cdklabs/saas-builder-toolkit.OutgoingEventMetadata.property.source"></a>

```typescript
public readonly source: string;
```

- *Type:* string
- *Default:* CoreApplicationPlaneProps.applicationNamePlaneSource

The source to set in the outgoing event.

---

### ServicesProps <a name="ServicesProps" id="@cdklabs/saas-builder-toolkit.ServicesProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.ServicesProps.Initializer"></a>

```typescript
import { ServicesProps } from '@cdklabs/saas-builder-toolkit'

const servicesProps: ServicesProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                         | **Type**                                                                | **Description**   |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.controlPlaneEventSource">controlPlaneEventSource</a></code> | <code>string</code>                                                     | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.eventBus">eventBus</a></code>                               | <code>aws-cdk-lib.aws_events.EventBus</code>                            | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.idpDetails">idpDetails</a></code>                           | <code>string</code>                                                     | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.lambdaLayer">lambdaLayer</a></code>                         | <code>aws-cdk-lib.aws_lambda.LayerVersion</code>                        | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.onboardingDetailType">onboardingDetailType</a></code>       | <code>string</code>                                                     | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.ServicesProps.property.tables">tables</a></code>                                   | <code><a href="#@cdklabs/saas-builder-toolkit.Tables">Tables</a></code> | *No description.* |

---

##### `controlPlaneEventSource`<sup>Required</sup> <a name="controlPlaneEventSource" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.controlPlaneEventSource"></a>

```typescript
public readonly controlPlaneEventSource: string;
```

- *Type:* string

---

##### `eventBus`<sup>Required</sup> <a name="eventBus" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.eventBus"></a>

```typescript
public readonly eventBus: EventBus;
```

- *Type:* aws-cdk-lib.aws_events.EventBus

---

##### `idpDetails`<sup>Required</sup> <a name="idpDetails" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.idpDetails"></a>

```typescript
public readonly idpDetails: string;
```

- *Type:* string

---

##### `lambdaLayer`<sup>Required</sup> <a name="lambdaLayer" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.lambdaLayer"></a>

```typescript
public readonly lambdaLayer: LayerVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.LayerVersion

---

##### `onboardingDetailType`<sup>Required</sup> <a name="onboardingDetailType" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.onboardingDetailType"></a>

```typescript
public readonly onboardingDetailType: string;
```

- *Type:* string

---

##### `tables`<sup>Required</sup> <a name="tables" id="@cdklabs/saas-builder-toolkit.ServicesProps.property.tables"></a>

```typescript
public readonly tables: Tables;
```

- *Type:* <a href="#@cdklabs/saas-builder-toolkit.Tables">Tables</a>

---

### Tenant <a name="Tenant" id="@cdklabs/saas-builder-toolkit.Tenant"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.Tenant.Initializer"></a>

```typescript
import { Tenant } from '@cdklabs/saas-builder-toolkit'

const tenant: Tenant = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                        | **Type**              | **Description**   |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.adminEmail">adminEmail</a></code>                                 | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.adminUserName">adminUserName</a></code>                           | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.callbackUrls">callbackUrls</a></code>                             | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.clientId">clientId</a></code>                                     | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.clientName">clientName</a></code>                                 | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.customDomainName">customDomainName</a></code>                     | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.groupName">groupName</a></code>                                   | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.id">id</a></code>                                                 | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.idpDetails">idpDetails</a></code>                                 | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.name">name</a></code>                                             | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.oidcClientId">oidcClientId</a></code>                             | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.oidcClientSecret">oidcClientSecret</a></code>                     | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.oidcIssuer">oidcIssuer</a></code>                                 | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.providerName">providerName</a></code>                             | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.supportedIdentityProviders">supportedIdentityProviders</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.tenantDomain">tenantDomain</a></code>                             | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.tier">tier</a></code>                                             | <code>string</code>   | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.Tenant.property.uniqueName">uniqueName</a></code>                                 | <code>string</code>   | *No description.* |

---

##### `adminEmail`<sup>Optional</sup> <a name="adminEmail" id="@cdklabs/saas-builder-toolkit.Tenant.property.adminEmail"></a>

```typescript
public readonly adminEmail: string;
```

- *Type:* string

---

##### `adminUserName`<sup>Optional</sup> <a name="adminUserName" id="@cdklabs/saas-builder-toolkit.Tenant.property.adminUserName"></a>

```typescript
public readonly adminUserName: string;
```

- *Type:* string

---

##### `callbackUrls`<sup>Optional</sup> <a name="callbackUrls" id="@cdklabs/saas-builder-toolkit.Tenant.property.callbackUrls"></a>

```typescript
public readonly callbackUrls: string[];
```

- *Type:* string[]

---

##### `clientId`<sup>Optional</sup> <a name="clientId" id="@cdklabs/saas-builder-toolkit.Tenant.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `clientName`<sup>Optional</sup> <a name="clientName" id="@cdklabs/saas-builder-toolkit.Tenant.property.clientName"></a>

```typescript
public readonly clientName: string;
```

- *Type:* string

---

##### `customDomainName`<sup>Optional</sup> <a name="customDomainName" id="@cdklabs/saas-builder-toolkit.Tenant.property.customDomainName"></a>

```typescript
public readonly customDomainName: string;
```

- *Type:* string

---

##### `groupName`<sup>Optional</sup> <a name="groupName" id="@cdklabs/saas-builder-toolkit.Tenant.property.groupName"></a>

```typescript
public readonly groupName: string;
```

- *Type:* string

---

##### `id`<sup>Optional</sup> <a name="id" id="@cdklabs/saas-builder-toolkit.Tenant.property.id"></a>

```typescript
public readonly id: string;
```

- *Type:* string

---

##### `idpDetails`<sup>Optional</sup> <a name="idpDetails" id="@cdklabs/saas-builder-toolkit.Tenant.property.idpDetails"></a>

```typescript
public readonly idpDetails: string;
```

- *Type:* string

---

##### `name`<sup>Optional</sup> <a name="name" id="@cdklabs/saas-builder-toolkit.Tenant.property.name"></a>

```typescript
public readonly name: string;
```

- *Type:* string

---

##### `oidcClientId`<sup>Optional</sup> <a name="oidcClientId" id="@cdklabs/saas-builder-toolkit.Tenant.property.oidcClientId"></a>

```typescript
public readonly oidcClientId: string;
```

- *Type:* string

---

##### `oidcClientSecret`<sup>Optional</sup> <a name="oidcClientSecret" id="@cdklabs/saas-builder-toolkit.Tenant.property.oidcClientSecret"></a>

```typescript
public readonly oidcClientSecret: string;
```

- *Type:* string

---

##### `oidcIssuer`<sup>Optional</sup> <a name="oidcIssuer" id="@cdklabs/saas-builder-toolkit.Tenant.property.oidcIssuer"></a>

```typescript
public readonly oidcIssuer: string;
```

- *Type:* string

---

##### `providerName`<sup>Optional</sup> <a name="providerName" id="@cdklabs/saas-builder-toolkit.Tenant.property.providerName"></a>

```typescript
public readonly providerName: string;
```

- *Type:* string

---

##### `supportedIdentityProviders`<sup>Optional</sup> <a name="supportedIdentityProviders" id="@cdklabs/saas-builder-toolkit.Tenant.property.supportedIdentityProviders"></a>

```typescript
public readonly supportedIdentityProviders: string[];
```

- *Type:* string[]

---

##### `tenantDomain`<sup>Optional</sup> <a name="tenantDomain" id="@cdklabs/saas-builder-toolkit.Tenant.property.tenantDomain"></a>

```typescript
public readonly tenantDomain: string;
```

- *Type:* string

---

##### `tier`<sup>Optional</sup> <a name="tier" id="@cdklabs/saas-builder-toolkit.Tenant.property.tier"></a>

```typescript
public readonly tier: string;
```

- *Type:* string

---

##### `uniqueName`<sup>Optional</sup> <a name="uniqueName" id="@cdklabs/saas-builder-toolkit.Tenant.property.uniqueName"></a>

```typescript
public readonly uniqueName: string;
```

- *Type:* string

---

### TenantConfigServiceProps <a name="TenantConfigServiceProps" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.Initializer"></a>

```typescript
import { TenantConfigServiceProps } from '@cdklabs/saas-builder-toolkit'

const tenantConfigServiceProps: TenantConfigServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                                                                    | **Type**                                    | **Description**   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantConfigIndexName">tenantConfigIndexName</a></code>                     | <code>string</code>                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetails">tenantDetails</a></code>                                     | <code>aws-cdk-lib.aws_dynamodb.Table</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetailsTenantConfigColumn">tenantDetailsTenantConfigColumn</a></code> | <code>string</code>                         | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetailsTenantNameColumn">tenantDetailsTenantNameColumn</a></code>     | <code>string</code>                         | *No description.* |

---

##### `tenantConfigIndexName`<sup>Required</sup> <a name="tenantConfigIndexName" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantConfigIndexName"></a>

```typescript
public readonly tenantConfigIndexName: string;
```

- *Type:* string

---

##### `tenantDetails`<sup>Required</sup> <a name="tenantDetails" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetails"></a>

```typescript
public readonly tenantDetails: Table;
```

- *Type:* aws-cdk-lib.aws_dynamodb.Table

---

##### `tenantDetailsTenantConfigColumn`<sup>Required</sup> <a name="tenantDetailsTenantConfigColumn" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetailsTenantConfigColumn"></a>

```typescript
public readonly tenantDetailsTenantConfigColumn: string;
```

- *Type:* string

---

##### `tenantDetailsTenantNameColumn`<sup>Required</sup> <a name="tenantDetailsTenantNameColumn" id="@cdklabs/saas-builder-toolkit.TenantConfigServiceProps.property.tenantDetailsTenantNameColumn"></a>

```typescript
public readonly tenantDetailsTenantNameColumn: string;
```

- *Type:* string

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IAuth <a name="IAuth" id="@cdklabs/saas-builder-toolkit.IAuth"></a>

- *Implemented By:* <a href="#@cdklabs/saas-builder-toolkit.CognitoAuth">CognitoAuth</a>, <a href="#@cdklabs/saas-builder-toolkit.IAuth">IAuth</a>


#### Properties <a name="Properties" id="Properties"></a>

| **Name**                                                                                                               | **Type**                                            | **Description**   |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------- |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.authorizationServer">authorizationServer</a></code>       | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.authorizer">authorizer</a></code>                         | <code>aws-cdk-lib.aws_apigateway.IAuthorizer</code> | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.clientId">clientId</a></code>                             | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.controlPlaneIdpDetails">controlPlaneIdpDetails</a></code> | <code>string</code>                                 | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.createUserFunction">createUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.deleteUserFunction">deleteUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.disableUserFunction">disableUserFunction</a></code>       | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.enableUserFunction">enableUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.fetchAllUsersFunction">fetchAllUsersFunction</a></code>   | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.fetchUserFunction">fetchUserFunction</a></code>           | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.updateUserFunction">updateUserFunction</a></code>         | <code>aws-cdk-lib.aws_lambda.IFunction</code>       | *No description.* |
| <code><a href="#@cdklabs/saas-builder-toolkit.IAuth.property.wellKnownEndpointUrl">wellKnownEndpointUrl</a></code>     | <code>string</code>                                 | *No description.* |

---

##### `authorizationServer`<sup>Required</sup> <a name="authorizationServer" id="@cdklabs/saas-builder-toolkit.IAuth.property.authorizationServer"></a>

```typescript
public readonly authorizationServer: string;
```

- *Type:* string

---

##### `authorizer`<sup>Required</sup> <a name="authorizer" id="@cdklabs/saas-builder-toolkit.IAuth.property.authorizer"></a>

```typescript
public readonly authorizer: IAuthorizer;
```

- *Type:* aws-cdk-lib.aws_apigateway.IAuthorizer

---

##### `clientId`<sup>Required</sup> <a name="clientId" id="@cdklabs/saas-builder-toolkit.IAuth.property.clientId"></a>

```typescript
public readonly clientId: string;
```

- *Type:* string

---

##### `controlPlaneIdpDetails`<sup>Required</sup> <a name="controlPlaneIdpDetails" id="@cdklabs/saas-builder-toolkit.IAuth.property.controlPlaneIdpDetails"></a>

```typescript
public readonly controlPlaneIdpDetails: string;
```

- *Type:* string

---

##### `createUserFunction`<sup>Required</sup> <a name="createUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.createUserFunction"></a>

```typescript
public readonly createUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `deleteUserFunction`<sup>Required</sup> <a name="deleteUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.deleteUserFunction"></a>

```typescript
public readonly deleteUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `disableUserFunction`<sup>Required</sup> <a name="disableUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.disableUserFunction"></a>

```typescript
public readonly disableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `enableUserFunction`<sup>Required</sup> <a name="enableUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.enableUserFunction"></a>

```typescript
public readonly enableUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchAllUsersFunction`<sup>Required</sup> <a name="fetchAllUsersFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.fetchAllUsersFunction"></a>

```typescript
public readonly fetchAllUsersFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `fetchUserFunction`<sup>Required</sup> <a name="fetchUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.fetchUserFunction"></a>

```typescript
public readonly fetchUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `updateUserFunction`<sup>Required</sup> <a name="updateUserFunction" id="@cdklabs/saas-builder-toolkit.IAuth.property.updateUserFunction"></a>

```typescript
public readonly updateUserFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---

##### `wellKnownEndpointUrl`<sup>Required</sup> <a name="wellKnownEndpointUrl" id="@cdklabs/saas-builder-toolkit.IAuth.property.wellKnownEndpointUrl"></a>

```typescript
public readonly wellKnownEndpointUrl: string;
```

- *Type:* string

---

