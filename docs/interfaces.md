# SBT Interfaces

This documentation covers the interfaces that form the backbone of SBT's authentication, billing, and metering functionalities. These interfaces provide a standardized and consistent approach to handling various operations, making it easier to manage and integrate different components across the system.

By following a consistent interface-driven approach, SBT maintains a high degree of modularity, extensibility, and maintainability. This allows for easy integration of new features, replacement of implementations, and adherence to best practices.

Below, you'll find detailed explanations of each interface, their key features, and links to dive deeper into their documentation.

## IAuth Interface[​](#iauth-interface "Direct link to IAuth Interface")

The IAuth interface defines the contracts for authentication and authorization in an application. It provides various configurations and endpoints related to JSON Web Tokens (JWT), OAuth, client IDs, client secrets, and scopes for different operations. Additionally, it includes Lambda functions for managing users.

Key features include:

🔑 JWT and OAuth Configuration: Properties for setting up JWT issuer, audience, token endpoint, and OAuth client IDs and secrets.

🔍 Scope Management: Scopes for authorizing requests related to tenant registration, user management, and other operations.

👤 User Management: Lambda functions for creating, fetching, updating, enabling, and disabling users.

The interface ensures a consistent and standardized way of handling authentication and authorization across the application, making it easier to manage security-related configurations and user operations.

To learn more about the IAuth interface and its properties and methods, you can dive deeper into the documentation by [clicking here](/sbt-aws/docs/interfaces/auth-interface.md).

## IBilling Interface[​](#ibilling-interface "Direct link to IBilling Interface")

The IBilling interface defines a standardized way of handling billing-related operations in a cloud-native application. It encapsulates functions for customer and user management, data ingestion, and usage data handling.

Key Features include:

👪 Customer Management: Create and delete customers (entities that can have zero or more users).

🧑‍🤝‍🧑 User Management (Optional): Create and delete users belonging to customers.

📥 Data Ingestion (Optional): Aggregate raw billing data using a data ingestor.

📊 Usage Data Handling (Optional): Push aggregated data to the billing provider on a scheduled basis.

🔗 Webhook Support (Optional): Trigger a function when a webhook request is received.

The interface includes properties for defining the required functions and their triggers, such as onboarding requests, offboarding requests, user creation/deletion events, and scheduled data pushes.

To learn more about the IBilling interface and its functions, you can dive deeper into the documentation by [clicking here](/sbt-aws/docs/interfaces/billing-interface.md).

## IMetering Interface[​](#imetering-interface "Direct link to IMetering Interface")

The IMetering interface defines the contracts for metering operations in a system. It provides functions for managing meters, ingesting usage events, handling customer (tenant) operations, and retrieving usage data.

Key features include:

📏 Meter Management: Create, fetch, update, and delete meters used for tracking usage metrics.

📊 Usage Ingestion: Ingest usage events associated with meters to measure and analyze usage data.

👤 Customer Management: Create and delete customers (tenants) for tracking usage.

📥 Usage Retrieval: Fetch usage data for specific meters, supporting features like pagination.

🗑️ Event Cancellation: Cancel or exclude specific usage events from being recorded.

The interface ensures a consistent and standardized way of handling metering operations, making it easier to integrate or replace the implementation in different parts of the system.

To learn more about the IMetering interface and its functions, you can dive deeper into the documentation by [clicking here](/sbt-aws/docs/interfaces/metering-interface.md).

## Appendix[​](#appendix "Direct link to Appendix")

* [Auth Interface](/sbt-aws/docs/interfaces/auth-interface.md)
* [Metering Interface](/sbt-aws/docs/interfaces/metering-interface.md)
* [Billing Interface](/sbt-aws/docs/interfaces/billing-interface.md)
