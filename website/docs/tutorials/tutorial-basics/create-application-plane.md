---
sidebar_position: 4
---

# Create the application plane

As mentioned before, SBT is unopinionated about the application in which it's deployed. As a result, we expect you to create the `ApplicationPlane` construct as just another part of the CDK constructs that you'd use to define your application. Take this simple (non-functional) example:

```typescript
export interface AppPlaneProps extends cdk.StackProps {
  eventManager: sbt.IEventManager;
}

export class ApplicationPlaneStack extends Stack {
  constructor(scope: Construct, id: string, props: AppPlaneProps) {
    super(scope, id, props);

    new sbt.CoreApplicationPlane(this, 'CoreApplicationPlane', {
      eventManager: props.eventManager,
      scriptJobs: [],
    });
  }
}
```

In this example we're creating the application plane of SBT, and passing in an EventManager created using the same EventBus that we used in our control plane. This will ensure that both planes are wired to the same events in Amazon EventBridge.

What's missing in this example is the subscription to EventBridge events, and the acting upon those subscriptions. As an application plane developer, a builder could hook up listeners to the various events published by the control plane, and do what's asked in the event. For example, the onboarding event is sent by the control plane with the expectation that the application plane provisions new tenant resources. The event's payload should carry enough information for the application to complete its job. Once done, it's expected that the app plane sends back a status event indicating success or failure.

Again, SBT allows builders to publish and subscribe directly to EventBridge, and does not attempt to interfere with that process. However, as part of the SBT library we've published a set of utilities to assist with typical application plane workflows. Let's look one of those utilities now. Once done, we'll come back to this code and fill it in with what we learned.
