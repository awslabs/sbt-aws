# Amazon ECS SaaS - Reference Architecture

The AWS SaaS Factory ECS SaaS Reference Architecture is a example architecture that illustrates how to build and manage multi-tenant Software-as-a-Service (SaaS) applications using Amazon Elastic Container Service (ECS). It serves as a guide for developers looking to implement best practices in building multi-tenant SaaS applications on AWS using ECS, offering a flexible and scalable solution tailored to various business needs. This architecture leverages SBT for both control plane and tenant deployments. Key components and considerations of this reference architecture include:

## Key Features[​](#key-features "Direct link to Key Features")

* **Multi-Tenant Architecture**: The architecture supports different tenant isolation strategies, including pooled and silo models, across three tiers: Basic, Advanced, and Premium. These tiers offer varying levels of resource sharing and isolation to meet different tenant needs.
* **AWS Integration**: The solution leverages native AWS services for routing, observability, and service discovery. It uses AWS CloudFormation, AWS CDK, and ECS Service Connect for seamless integration and management of services.
* **AWS SaaS Builder Toolkit (SBT)**: This toolkit extends the SaaS control plane with functionalities like tenant onboarding, user management, and billing. It also integrates with the ECS application plane for bi-directional communication necessary for SaaS operations.

## Architectural Tiers[​](#architectural-tiers "Direct link to Architectural Tiers")

* **Basic Tier**: Utilizes shared ECS services across all tenants in a pooled model. This tier is preloaded in the baseline architecture and shares resources like product and order microservices.
* **Advanced Tier**: Features a shared ECS cluster with dedicated ECS services per tenant, following a silo model. This setup provides more isolation compared to the Basic tier.
* **Premium Tier**: Offers dedicated ECS clusters per tenant, providing the highest level of isolation and customization for each tenant.

## GitHub Repository[​](#github-repository "Direct link to GitHub Repository")

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/saas-reference-architecture-ecs)
