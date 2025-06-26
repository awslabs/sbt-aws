# Serverless SaaS - Reference Solution

The AWS SaaS Factory Serverless SaaS Reference Architecture is a comprehensive example of a working, multi-tenant SaaS application using serverless technologies on AWS. This architecture leverages a range of AWS services to optimize operational efficiency and scalability while minimizing the complexity of managing infrastructure. The architecture leverages SBT for its control plane and tenant deployments. Key components and concepts of this architecture include:

## Key Components[​](#key-components "Direct link to Key Components")

* **Control Plane**: This is where tenant management and operational services reside. It includes components for registration, onboarding, and provisioning of tenants. The control plane is crucial for managing the lifecycle of tenants in a SaaS environment.
* **Application Plane**: This consists of the core application services that handle business logic and data processing. It typically involves AWS Lambda for compute, Amazon API Gateway for routing requests, and Amazon DynamoDB for data storage.
* **Identity and Access Management**: Amazon Cognito is used for user authentication and authorization, providing a secure way to manage user identities across different tenants.

## Architectural Strategies[​](#architectural-strategies "Direct link to Architectural Strategies")

* **Serverless Model**: By using serverless services like AWS Lambda, the architecture reduces operational overhead and allows automatic scaling based on demand. This model aligns resource consumption with tenant activity, optimizing cost efficiency.
* **Multi-Tenant Management**: The architecture supports both pooled and siloed deployment models, allowing flexibility in how resources are shared or isolated among tenants. This can be configured using AWS Lambda layers and API Gateway usage plans to manage tenant-specific configurations.
* **Deployment Automation**: The reference architecture includes automated deployment pipelines using AWS CodePipeline, enabling continuous integration and delivery of updates across all tenants.

# GitHub Repository

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/aws-saas-factory-ref-solution-serverless-saas/tree/main)
