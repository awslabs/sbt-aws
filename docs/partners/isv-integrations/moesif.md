# Moesif API Monetization for AWS SBT

This module extends the AWS SaaS Builder Toolkit (SBT) to support usage-based billing through Moesif.

[Moesif API Monetization](https://www.moesif.com/) provides a cloud-based solution for [usage-based billing](https://www.moesif.com/solutions/metered-api-billing) such as billing on API transactions, compute resources, or unique users. Then, you can invoice and collect payments automatically through popular payment providers like Stripe, Zuora, or custom invoicing solutions.

## How it works[​](#how-it-works "Direct link to How it works")

### Event Ingestion[​](#event-ingestion "Direct link to Event Ingestion")

The project deploys an [Amazon Data Firehose](https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html) to ingest your raw usage events. Events can be API Calls such as from an Amazon API Gateway instance or custom actions triggered within your application. The firehose will send all events to Moesif's Collection API for metering and analytics.

![moesif-firehose-diagram.png](/sbt-aws/assets/images/moesif-firehose-diagram-c3fcee72e3d6e26029b08e2044abe234.png)

For more info on how the `MoesifFirehoseConstruct` works, view [Moesif docs on ingesting actions via Firehose](https://www.moesif.com/docs/ingest-action-events/aws-firehose/)

### User and Tenant Management[​](#user-and-tenant-management "Direct link to User and Tenant Management")

The project also deploys a [Lambda Function](https://aws.amazon.com/lambda/) for user and tenant management. The lambda will listen to events like `provisionSuccess` to create companies and subscriptions in Moesif and your payment provider. Similarly, when receiving a `deprovisionSuccess` event, all subscriptions will be canceled for the tenant. You can [inspect the code here](https://github.com/Moesif/sbt-aws-moesif/tree/master/resources/functions/billing_management).

| SBT Entity | Moesif Entity | Description                                        | Parent  |
| ---------- | ------------- | -------------------------------------------------- | ------- |
| Tenant     | Company       | Your customer that you provisioned resources for.  | None    |
| Tenant     | Subscription  | A single subscription for a company/tenant.        | Company |
| User       | User          | End users of your customer who login to your SaaS. | Company |

## How to use[​](#how-to-use "Direct link to How to use")

### Prerequisites[​](#prerequisites "Direct link to Prerequisites")

1. If you don't already have a SBT project deployed, follow [AWS SBT's tutorial](https://github.com/awslabs/sbt-aws/tree/main/docs/public) to deploy the sample `hello-cdk` project with a `ControlPlane` and `CoreApplicationPlane`.
2. You already have a Moesif account. You can sign up for a trial on [moesif.com](https://www.moesif.com/)

### 1. Install the NPM package[​](#1-install-the-npm-package "Direct link to 1. Install the NPM package")

Within your SBT project directory, install `sbt-aws-moesif` via the following command:

```
npm install --save sbt-aws-moesif
```

### 2. Add MoesifBilling to your ControlPlane[​](#2-add-moesifbilling-to-your-controlplane "Direct link to 2. Add MoesifBilling to your ControlPlane")

Instantiate the [MoesifBilling](https://github.com/Moesif/sbt-aws-moesif/blob/master/lib/moesif-billing.ts) construct like below. You will need to set some properties to authenticate with Moesif.

```
export class ControlPlaneStack extends Stack {
  public readonly regApiGatewayUrl: string;
  public readonly eventBusArn: string;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id, props);
    const cognitoAuth = new CognitoAuth(this, 'CognitoAuth', {
      idpName: 'COGNITO',
      systemAdminRoleName: 'SystemAdmin',
      systemAdminEmail: '<<Your Admin Email>>',
    });

    const moesifBilling = new MoesifBilling(stack, 'MoesifBilling', {
      moesifApplicationId: '<<Your Moesif Application Id>>',
      moesifManagementAPIKey: '<<Your Moesif Management API Key>>',
      billingProviderSlug: BillingProviderSlug.STRIPE,
      billingProviderSecretKey: '<<Your Billing Provider\'s Secret Such as for Stripe>>'
    }
   );

    const controlPlane = new ControlPlane(this, 'ControlPlane', {
      auth: cognitoAuth,
      billing: moesifBilling,
    });
    this.eventBusArn = controlPlane.eventBusArn;
    this.regApiGatewayUrl = controlPlane.controlPlaneAPIGatewayUrl;
  }
}
```

### Moesif Billing Properties[​](#moesif-billing-properties "Direct link to Moesif Billing Properties")

| Property Name              | Type                | Required                   | Description                                                                                                                                                                                                                                                                        | Default                  |
| -------------------------- | ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| moesifApplicationId        | string              | Required                   | Collector Application Id from your Moesif account for event ingestion                                                                                                                                                                                                              |                          |
| moesifManagementAPIKey     | string              | Required                   | Management API Key from your Moesif account. The key must have the following scopes: create<!-- -->:companies<!-- --> create<!-- -->:subscriptions<!-- --> create<!-- -->:users<!-- --> delete<!-- -->:companies<!-- --> delete<!-- -->:subscriptions<!-- --> delete<!-- -->:users |                          |
| moesifManagementAPIBaseUrl | string              |                            | Override the base URL for the Moesif Mangaement API. For most setups, you don't need to set this.                                                                                                                                                                                  | <https://api.moesif.com> |
| moesifCollectorAPIBaseUrl  | string              |                            | Override the base URL for the Moesif Collector API. For most setups, you don't need to set this.                                                                                                                                                                                   | <https://api.moesif.net> |
| billingProviderSlug        | BillingProviderSlug | Required                   | Slug for Billing Provider / Payment Gateway                                                                                                                                                                                                                                        |                          |
| billingProviderSecretKey   | string              | Required                   | Secret Key for Billing Provider / Payment Gateway selected by billingProviderSlug                                                                                                                                                                                                  |                          |
| billingProviderClientId    | string              | Only if Zuora              | Client Id for Billing Provider / Payment Gateway. Only used when billingProviderSlug is Zuora                                                                                                                                                                                      |                          |
| billingProviderBaseUrl     | string              | Only if Chargebee or Zuora | Base URL for Billing Provider / Payment Gateway. Only used when billingProviderSlug is Zuora or Chargebee                                                                                                                                                                          |                          |
| tenantPlanField            | string              |                            | Tenant object's field name that contains the plan id used when creating new subscriptions. Only used when billingProviderSlug is Zuora                                                                                                                                             | planId                   |
| tenantPriceField           | string              |                            | Tenant object's field name that contains the price id used when creating new subscriptions.                                                                                                                                                                                        | priceId                  |
| firehoseName               | string              |                            | The name of the Kinesis Firehose delivery stream. By default, a unique name will be generated.                                                                                                                                                                                     |                          |
| bucketName                 | string              |                            | The name of the S3 bucket for backup. By default, a unique name will be generated.                                                                                                                                                                                                 |                          |
| schema                     | string              |                            | Moesif Event Schema for data ingestion. By default, Moesif actions                                                                                                                                                                                                                 |                          |

### 3. Provision a Tenant[​](#3-provision-a-tenant "Direct link to 3. Provision a Tenant")

Once you deploy your updated stack, create a tenant in your AWS SBT setup using the SBT APIs.

When you create a tenant, you must also set the price id to be used for creating subscriptions, By default, the field name is `priceId`, but this can be overridden via the above options. If you are using Zuora, you must also set the plan id. The field `email` must also be set.

*If your provider is set to Zuora, [you must also set these fields](#zuora)*

If you're running the `hello-cdk` project, this can be done by running [this script](https://github.com/awslabs/sbt-aws/tree/main/docs/public#test-the-deployment) to onboard a new tenant. Modify, the script to also include the price (and plan if required).

> To find your plan id and price id, you can log into Moesif UI and go to Product Catalog or log into your billing provider.

```
DATA=$(jq --null-input \
    --arg tenantEmail "$TENANT_EMAIL" \
    --arg tenantId "$TENANT_ID" \
    '{
  "email": $tenantEmail,
  "tenantId": $tenantId,
  "priceId": "price_1MoBy5LkdIwHu7ixZhnattbh"
}')

echo "creating tenant..."
curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA"
```

Once done, you should see the company show up in the Moesif UI. There should also be a subscription for the company in the "active" status.

The tenant will be subscribed to the price defined by `defaultPriceId`. This can be expanded to allow more customization.

### 4. Ingest Events[​](#4-ingest-events "Direct link to 4. Ingest Events")

Now that you created a tenant, you should ingest some actions in you're newly created firehose. Actions have an action name (like "Signed Up", "API Request", or "Finished Job") which represents the usage event. You can also include arbitrary metadata with an action, which enables you to create billable metrics, usage reporting, and more. For more info, [see docs on actions](https://www.moesif.com/docs/getting-started/user-actions/)

You'll want to set a few fields like below:

* `action_name` is a string and should include name of the event such as "Processed Payment Transaction"
* `company_id` is your tenant identifier. [See companies](https://www.moesif.com/docs/getting-started/companies/)
* `transaction_id` should be a random UUID for this event which Moesif uses for deduplication. [Docs on Moesif idempotency](https://www.moesif.com/docs/api#idempotency).
* `request.time` represents the transaction time as an ISO formatted string.
* `metadata` is an object which includes any custom properties for this event. By setting metadata, you can bill on arbitrary metrics, create metrics on them, etc. For example, if the action name is "Processed Payment Transaction", you can include an amount and the currency to bill on the total amount.

For full schema and available fields, see [Actions API Reference](https://www.moesif.com/docs/api#track-user-actions-in-batch)

An example action is below:

```
{
  "action_name": "Processed Payment Transaction",
  "request": {
    "time": "2024-03-01T04:45:42.914"
  },
  "company_id": "12345", // This is your tenant id
  "transaction_id": "a3765025-46ec-45dd-bc83-b136c8d1d257",
  "metadata": {
    "amount": 24.6,
    "currency": "USD",
    "time_seconds": 66.3
  }
}
```

In the above example, the action is created whenever a payment is processed. There are also two metrics we are tracking as part of the action (the amount of the payment and how long the job took). You can create billable metrics and usage reports from these attributes.

> If your events are API calls, we recommend changing the MoesifEventSchema to `API_CALL` which provides a different schema than the above actions. See [API Calls](https://www.moesif.com/docs/api?int_source=docs#api-calls)

### 5. Create a Billing Meter[​](#5-create-a-billing-meter "Direct link to 5. Create a Billing Meter")

Now that the tenant is created, follow [these steps](https://www.moesif.com/docs/metered-billing/creating-billing-meters/) to create a billing meter in Moesif. The billing meter can filter or aggregate on any of the metadata fields you included with your action.

You should also select the provider and price defined by `billingProviderSlug` and `defaultPriceId`.

## Provider Specific Requirements[​](#provider-specific-requirements "Direct link to Provider Specific Requirements")

### Zuora[​](#zuora "Direct link to Zuora")

If you are using Zuora, the following fields must be set when creating a new tenant:

```
{
    "email": "<Customer email address>",
    "firstName": "<First name of customer contact>",
    "lastName": "<Last name of customer contact>",
    "currency": "<Three-letter ISO currency code>",
    "address": {
        "state": "<State or providence of the contact's address>",
        "country": "<The country of the contact's address>"
    }
}
```

## Limitations[​](#limitations "Direct link to Limitations")

`sbt-aws-moesif` is in preview. Development is still ongoing. There are limitations to be aware of.

* Deprovisioning a tenant will cancel all subscriptions but does not delete objects in case a subscription should be reactivated.

## Useful commands[​](#useful-commands "Direct link to Useful commands")

* `npm run build` compile typescript to js
* `npm run watch` watch for changes and compile
* `npm run test` perform the jest unit tests
