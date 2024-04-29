# API Reference <a name="API Reference" id="api-reference"></a>



## Classes <a name="Classes" id="Classes"></a>

### TokenVendingMachine <a name="TokenVendingMachine" id="@aws/sbt-point-solutions-lib.TokenVendingMachine"></a>

The Token Vending Machine library offers a solution for dynamically assuming an ABAC role and obtaining tenant-scoped credentials.

It conceals the intricacies
of managing and generating these scoped credentials. By utilizing these scoped credentials,
tenant isolation is enforced when accessing tenant-specific resources.

#### Initializers <a name="Initializers" id="@aws/sbt-point-solutions-lib.TokenVendingMachine.Initializer"></a>

```typescript
import { TokenVendingMachine } from '@aws/sbt-point-solutions-lib'

new TokenVendingMachine(shouldValidateToken?: boolean)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@aws/sbt-point-solutions-lib.TokenVendingMachine.Initializer.parameter.shouldValidateToken">shouldValidateToken</a></code> | <code>boolean</code> | *No description.* |

---

##### `shouldValidateToken`<sup>Optional</sup> <a name="shouldValidateToken" id="@aws/sbt-point-solutions-lib.TokenVendingMachine.Initializer.parameter.shouldValidateToken"></a>

- *Type:* boolean

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@aws/sbt-point-solutions-lib.TokenVendingMachine.assumeRole">assumeRole</a></code> | This method is used to dynamically assume an ABAC role which is provided through environment variables and obtain temporary tenant-scoped credentials.It takes in a json web token and a time to live (ttl) in seconds as input. If isValidateToken is set to true, the method will validate the input json web token against identity provider details provided through environment variables. It returns a json string containing the temporary tenant-scoped credentials. {   "AccessKeyId": "...",   "SecretAccessKey": "...",   "SessionToken": "...",   "Expiration": "..." }. |

---

##### `assumeRole` <a name="assumeRole" id="@aws/sbt-point-solutions-lib.TokenVendingMachine.assumeRole"></a>

```typescript
public assumeRole(jwtToken: string, ttl: number): string
```

This method is used to dynamically assume an ABAC role which is provided through environment variables and obtain temporary tenant-scoped credentials.It takes in a json web token and a time to live (ttl) in seconds as input. If isValidateToken is set to true, the method will validate the input json web token against identity provider details provided through environment variables. It returns a json string containing the temporary tenant-scoped credentials. {   "AccessKeyId": "...",   "SecretAccessKey": "...",   "SessionToken": "...",   "Expiration": "..." }.

###### `jwtToken`<sup>Required</sup> <a name="jwtToken" id="@aws/sbt-point-solutions-lib.TokenVendingMachine.assumeRole.parameter.jwtToken"></a>

- *Type:* string

Input json web token with custom attributes.

---

###### `ttl`<sup>Required</sup> <a name="ttl" id="@aws/sbt-point-solutions-lib.TokenVendingMachine.assumeRole.parameter.ttl"></a>

- *Type:* number

Time to live in seconds for the scoped credentials.

---





