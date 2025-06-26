# IMetering Interface

## Overview[​](#overview "Direct link to Overview")

The IMetering interface encapsulates the properties and functions required for metering operations in a system. It defines the contracts for various actions related to meter management, usage ingestion, customer (tenant) management, and usage data retrieval.

## Properties[​](#properties "Direct link to Properties")

1. **createMeterFunction (ISyncFunction)**: This function is responsible for creating a new meter. A meter is used to track and analyze specific usage metrics for tenants. It corresponds to the POST /meters endpoint.

2. **fetchMeterFunction (ISyncFunction)**: This function retrieves a single meter based on its unique identifier (id). It corresponds to the GET /meters/{meterId} endpoint.

3. **fetchAllMetersFunction (ISyncFunction)**: This function fetches multiple meters. It should support pagination to handle large result sets. It corresponds to the GET /meters endpoint.

4. **updateMeterFunction (Optional, ISyncFunction)**: This function updates an existing meter. It corresponds to the PUT /meters/{meterId} endpoint.

5. **deleteMeterFunction (Optional, ISyncFunction)**: This function deletes an existing meter. It corresponds to the DELETE /meters/{meterId} endpoint.

6. **ingestUsageEventFunction (IASyncFunction)**: This asynchronous function is responsible for ingesting a usage event. Usage events are used to measure and track the usage metrics associated with a meter. It is typically triggered by the INGEST\_USAGE event.

7. **fetchUsageFunction (ISyncFunction)**: This function retrieves the usage data for a specific meter. It corresponds to the GET /usage/{meterId} endpoint.

8. **cancelUsageEventsFunction (Optional, ISyncFunction)**: This function is used to exclude specific events from being recorded or included in the usage data. It is helpful for canceling events that were incorrectly ingested. It corresponds to the DELETE /usage endpoint.

9. **createCustomerFunction (Optional, IASyncFunction)**: This asynchronous function is responsible for creating a new customer (tenant). It is typically triggered by the ONBOARDING\_REQUEST event.

10. **deleteCustomerFunction (Optional, IASyncFunction)**: This asynchronous function is responsible for deleting an existing customer (tenant). It is typically triggered by the OFFBOARDING\_REQUEST event.

## Usage[​](#usage "Direct link to Usage")

The IMetering interface can be implemented by a class or object that provides the required functionality for metering operations. The implementation should define the functions and properties according to the interface contract.

Here's an example of how the interface might be used:

```
import { IMetering } from './metering';

class MeteringService implements IMetering {
  // Implement the properties and functions defined in the IMetering interface
}

const meteringService = new MeteringService();

// Create a new meter
const newMeterId = await meteringService.createMeterFunction({ /* meter data */ });

// Fetch a meter
const meter = await meteringService.fetchMeterFunction({ meterId: newMeterId });

// Ingest a usage event
await meteringService.ingestUsageEventFunction({ /* usage event data */ });

// Fetch usage data for a meter
const usageData = await meteringService.fetchUsageFunction({ meterId: newMeterId });
```

By adhering to the IMetering interface, the implementation can be easily integrated into other parts of the system or replaced with a different implementation if needed, as long as the new implementation adheres to the same interface contract.
