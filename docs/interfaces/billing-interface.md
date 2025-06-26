# IBilling Interface

## Overview[​](#overview "Direct link to Overview")

The IBilling interface encapsulates the list of properties for a billing construct. It includes functions for customer and user management, data ingestion, and usage data handling. This interface is designed to provide a standardized way of handling billing-related operations in a cloud-native application.

## Properties[​](#properties "Direct link to Properties")

### createCustomerFunction[​](#createcustomerfunction "Direct link to createCustomerFunction")

* Type: IASyncFunction
* Description: The async function responsible for creating a new customer. A customer in this context is an entity that can have zero or more users.
* Default Event Trigger: ONBOARDING\_REQUEST

### deleteCustomerFunction[​](#deletecustomerfunction "Direct link to deleteCustomerFunction")

* Type: IASyncFunction
* Description: The async function responsible for deleting an existing customer. A customer in this context is an entity that can have zero or more users.
* Default Event Trigger: OFFBOARDING\_REQUEST

### createUserFunction[​](#createuserfunction "Direct link to createUserFunction")

* Type: IASyncFunction (Optional)
* Description: The async function responsible for creating a new user. A user in this context is an entity that belongs to a customer.
* Default Event Trigger: TENANT\_USER\_CREATED

### deleteUserFunction[​](#deleteuserfunction "Direct link to deleteUserFunction")

* Type: IASyncFunction (Optional)
* Description: The async function responsible for deleting an existing user. A user in this context is an entity that belongs to a customer.
* Default Event Trigger: TENANT\_USER\_DELETED

### ingestor[​](#ingestor "Direct link to ingestor")

* Type: IDataIngestorAggregator (Optional)
* Description: The IDataIngestorAggregator responsible for accepting and aggregating raw billing data.

### putUsageFunction[​](#putusagefunction "Direct link to putUsageFunction")

* Type: IFunctionSchedule (Optional)
* Description: The async function responsible for taking the aggregated data and pushing it to the billing provider.
* Default Event Trigger: events.Schedule.rate(cdk.Duration.hours(24)) (Triggered every 24 hours)

### webhookFunction[​](#webhookfunction "Direct link to webhookFunction")

* Type: IFunctionPath (Optional)
* Description: The function to trigger when a webhook request is received.
* Default HTTP Path: POST /billing/{$webhookPath}

## Additional Interfaces[​](#additional-interfaces "Direct link to Additional Interfaces")

### IFunctionSchedule[​](#ifunctionschedule "Direct link to IFunctionSchedule")

This interface allows specifying both the function to trigger and the schedule by which to trigger it.

Properties:

* handler: The function definition (IFunction).
* schedule: The schedule that will trigger the handler function (Schedule).

### IFunctionPath[​](#ifunctionpath "Direct link to IFunctionPath")

This interface allows specifying both the function to trigger and the path on the API Gateway that triggers it.

Properties:

* path: The path to the webhook resource (string).
* handler: The function definition (IFunction).

## Usage[​](#usage "Direct link to Usage")

To use the IBilling interface, you need to implement the required properties and pass them to the billing construct. Here's an example:

```
import { IBilling } from 'your-billing-interface';

const billing: IBilling = {
  createCustomerFunction: /* Provide your implementation */,
  deleteCustomerFunction: /* Provide your implementation */,
  createUserFunction: /* Provide your implementation (optional) */,
  deleteUserFunction: /* Provide your implementation (optional) */,
  ingestor: /* Provide your implementation (optional) */,
  putUsageFunction: /* Provide your implementation (optional) */,
  webhookFunction: /* Provide your implementation (optional) */,
};

// Pass the `billing` object to your billing construct
const billingConstruct = new BillingConstruct(scope, 'BillingConstruct', billing);
```

In this example, you need to provide implementations for the required properties (createCustomerFunction and deleteCustomerFunction). The optional properties can be provided based on your specific requirements.
