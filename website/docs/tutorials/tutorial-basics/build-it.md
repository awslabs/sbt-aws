---
sidebar_position: 3
---

# Build the control plane

Now let's build and deploy this component. Before we do, we have to modify one other file. Open up the `hello-cdk.ts` file in the bin directory, and replace everything that's in there with the following contents:

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ControlPlaneStack } from '../lib/control-plane';
// import { AppPlaneStack } from '../lib/app-plane';

const app = new cdk.App();
const controlPlaneStack = new ControlPlaneStack(app, 'ControlPlaneStack');
// const appPlaneStack = new AppPlaneStack(app, 'AppPlaneStack', {
//   eventManager: controlPlaneStack.eventManager,
// });
```

Notice we're leaving a few lines commented out here, we'll come back to those later when we discuss the application plane. Ensure everything is saved, then from the root of your hello-cdk project, run the following:

:::warning
Because our control plane deploys Lambda functions, you'll need Docker installed to build and deploy this CDK stack
:::

```bash
npm run build
cdk bootstrap
cdk deploy ControlPlaneStack
```

This will kick of the synthesis of your CDK application to AWS CloudFormation, then deploy that CloudFormation. Behind the scenes, a lot is getting created. This construct not only stands up the surface of our control plane API, using a new API Gateway component, it also deploys several services as AWS Lambda functions used for tenant provisioning and management.

Feel free to open your AWS Console and take a look at the following (ensure you're in the same region you deployed to):

* [AWS Lambda](https://console.aws.amazon.com/lambda/home)
* [Amazon Cognito](https://console.aws.amazon.com/cognito/v2/idp/user-pools)
* [API Gateway](https://console.aws.amazon.com/apigateway/main/apis)

Once done, we now have the left side of our conceptual diagram deployed, and we did it with just a few constructs. It deployed not only the API surface of our control plane, but also wired it up to EventBridge. Next, we'll start deploy the application plane, and connect it to the same EventBridge bus, so we can act upon those control plane messages.
