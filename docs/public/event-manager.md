# EventManager and EventDefinition

The SaaS Builder Toolkit provides an event management system to handle communication between the Control Plane and Application Plane components. This document explains how to use the EventManager and EventDefinition classes.

## EventManager

The `EventManager` class provides a centralized way to manage events that flow between the Control Plane and Application Plane. It allows for consistent event definition, publishing, and subscription across your SaaS application.

### Creating an EventManager

When creating an EventManager, you need to specify the event sources for both the Control Plane and Application Plane:

```typescript
const eventManager = new EventManager(this, 'EventManager', {
  controlPlaneEventSource: 'com.example.controlplane',
  applicationPlaneEventSource: 'com.example.applicationplane'
});
```

You can optionally specify source overrides for specific event detail types:

```typescript
const eventManager = new EventManager(this, 'EventManager', {
  controlPlaneEventSource: 'com.example.controlplane',
  applicationPlaneEventSource: 'com.example.applicationplane',
  sourceOverrides: {
    'onboardingRequest': 'com.example.custom.source'
  }
});
```

## EventDefinition

The `EventDefinition` class represents an event with its detail type and source. It provides a more structured and type-safe way to define and work with events.

### EventDefinition Properties

An EventDefinition has two readonly properties:

- `detailType`: The event's detail type (e.g., 'onboardingRequest')
- `source`: The event's source (e.g., 'com.example.controlplane')

These properties are immutable and cannot be changed after the EventDefinition is created, ensuring event definitions remain consistent throughout your application.

```typescript
// Create an EventDefinition
const eventDef = new EventDefinition('customEvent', 'com.example.custom.source');

// Access its properties
console.log(eventDef.detailType); // 'customEvent'
console.log(eventDef.source);     // 'com.example.custom.source'
```

### Standard Events

EventManager pre-defines a set of standard events that are commonly used in SaaS applications:

```typescript
// Access standard events from the eventManager.events object
const onboardingRequestEvent = eventManager.events.onboardingRequest;
const provisionSuccessEvent = eventManager.events.provisionSuccess;
```

These events are automatically registered with the appropriate source based on whether they originate from the Control Plane or Application Plane.

#### Control Plane Events

- `onboardingRequest`
- `offboardingRequest`
- `billingSuccess`
- `billingFailure`
- `activateRequest`
- `deactivateRequest`
- `tenantUserCreated`
- `tenantUserDeleted`

#### Application Plane Events

- `onboardingSuccess`
- `onboardingFailure`
- `offboardingSuccess`
- `offboardingFailure`
- `provisionSuccess`
- `provisionFailure`
- `deprovisionSuccess`
- `deprovisionFailure`
- `activateSuccess`
- `activateFailure`
- `deactivateSuccess`
- `deactivateFailure`
- `ingestUsage`

### Creating Custom Events

You can create custom events for specific needs:

```typescript
// Create a Control Plane event
const customControlPlaneEvent = eventManager.createControlPlaneEvent('customControlEvent');

// Create an Application Plane event
const customAppPlaneEvent = eventManager.createApplicationPlaneEvent('customAppEvent');

// Create a fully custom event with a specific source
const fullyCustomEvent = eventManager.createCustomEvent('customEvent', 'com.example.custom.source');
```

Note that attempting to create an event with a detail type that already exists will throw an error:

```typescript
// This will throw an error because 'onboardingRequest' is already defined
try {
  eventManager.createControlPlaneEvent('onboardingRequest');
} catch (error) {
  console.error(error); // Error: Event with detail type 'onboardingRequest' already exists
}
```

### Using EventDefinitions with Targets

To add a target to an event:

```typescript
// Add a target to a standard event
eventManager.addTargetToEvent(scope, {
  eventDefinition: eventManager.events.onboardingRequest,
  target: myLambdaTarget
});

// Add a target to a custom event
const customEvent = eventManager.createCustomEvent('customEvent', 'com.example.custom.source');
eventManager.addTargetToEvent(scope, {
  eventDefinition: customEvent,
  target: myLambdaTarget
});
```

The `addTargetToEvent` method ensures that:

1. Only one rule is created per unique event definition
2. Multiple targets can be added to the same rule
3. Rules are created in the correct scope

### Getting Event Definitions

You can retrieve an event definition by its detail type:

```typescript
const eventDef = eventManager.getEventDefinition('onboardingRequest');
if (eventDef) {
  console.log(`Event detail type: ${eventDef.detailType}`);
  console.log(`Event source: ${eventDef.source}`);
}
```

If the event doesn't exist, `getEventDefinition` returns `undefined`.

## Benefits of Using EventDefinition

1. **Type Safety**: The EventDefinition class provides type checking for event properties, ensuring that events are properly defined.

2. **Encapsulation**: Each EventDefinition encapsulates both the detail type and source of an event, making it easier to manage and pass around.

3. **Consistency**: The EventManager ensures that events from each plane use the correct source, reducing errors and making the system more maintainable.

4. **Reusability**: Event definitions can be reused across your application, avoiding duplication and ensuring consistency.

5. **Immutability**: Event definitions are immutable, meaning their properties cannot be changed after creation, which prevents unintended modifications.

6. **Rule Deduplication**: The EventManager automatically deduplicates rules, ensuring that only one rule is created per event definition, even when multiple targets subscribe to the same event.

## Integration with ScriptJobs and Other Components

EventDefinitions are integrated with SBT components like ScriptJob:

```typescript
const scriptJobProps: TenantLifecycleScriptJobProps = {
  // ... other properties ...
  incomingEvent: eventManager.events.onboardingRequest,
  outgoingEvent: {
    success: eventManager.events.provisionSuccess,
    failure: eventManager.events.provisionFailure,
  },
  // ... other properties ...
};
```

This integration ensures that components are properly connected to the event system, using the correct event definitions.

## Event Flow Example

A typical event flow using EventDefinition might look like this:

1. The Control Plane emits an event using the `onboardingRequest` EventDefinition
2. The Application Plane, which has subscribed to this event, receives the notification
3. The Application Plane processes the request and emits either `provisionSuccess` or `provisionFailure` EventDefinition
4. The Control Plane, which has subscribed to these events, updates its state accordingly

This structured approach to event management ensures clear communication between components while maintaining type safety and consistency.

## Internal Event Management

Internally, the EventManager maintains a map of all event definitions by their detail types, ensuring:

1. Each event detail type is unique
2. Event sources are consistent with their plane (Control or Application)
3. Source overrides are applied correctly if provided

When you create custom events or use predefined events, the EventManager handles these details for you, ensuring consistent behavior across your application.
