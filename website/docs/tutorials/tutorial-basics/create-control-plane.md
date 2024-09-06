---
sidebar_position: 2
---

# Create the control plane

Now that we have SBT installed, let's create a new SBT control plane. Create a new file under `/lib/control-plane.ts` with the following contents.

:::warning
Please be sure to replace the email address with a real email as this is where you'll get the temporary admin password.
:::

```typescript
import * as sbt from '@cdklabs/sbt-aws';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ControlPlaneStack extends Stack {
  public readonly regApiGatewayUrl: string;
  public readonly eventManager: sbt.IEventManager;

  constructor(scope: Construct, id: string, props?: any) {
    super(scope, id, props);
    const cognitoAuth = new sbt.CognitoAuth(this, 'CognitoAuth', {
      // Avoid checking scopes for API endpoints. Done only for testing purposes.
      setAPIGWScopes: false,
    });

    const controlPlane = new sbt.ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
      systemAdminEmail: 'ENTER YOUR EMAIL HERE',
    });

    this.eventManager = controlPlane.eventManager;
    this.regApiGatewayUrl = controlPlane.controlPlaneAPIGatewayUrl;
  }
}
```

Notice here we're creating a new CDK Stack called "ControlPlaneStack". In that stack, we're creating a `ControlPlane` construct which we imported from the `@cdklabs/sbt-aws` package.

Another important concept worth pointing out here is the plugability of this approach. Notice we're creating an "auth" component, called "CognitoAuth". This component implements the `IAuth` interface defined in the SBT core package. We currently have a Cognito implementation of `IAuth`, but we could technically implement that interface with any identity provider.
