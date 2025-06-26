# Amazon EKS SaaS Reference Architecture

The AWS SaaS Factory EKS SaaS Reference Architecture provides a working example of a multi-tenant SaaS solution using Amazon Elastic Kubernetes Service (EKS). This architecture, like all SaaS Factory reference architectures, are provided as examples from which to create scalable, secure, and efficient SaaS applications on AWS. This architecture leverages SBT for both control plane and tenant deployments. Key components and considerations of this reference architecture include:

## Key Components[​](#key-components "Direct link to Key Components")

1. **Multi-Tenant Isolation**: The architecture emphasizes tenant isolation, which is crucial for ensuring that each tenant's data and operations are secure and separate from others. This is achieved through Kubernetes namespaces and network policies.
2. **Identity and Access Management**: Amazon Cognito is used for managing user identities and access controls, ensuring that tenant-specific access policies are enforced.
3. **Data Partitioning**: Data for each tenant is partitioned to maintain privacy and security. This can involve using separate databases or schemas for each tenant, depending on the application's requirements.
4. **Deployment Automation**: The architecture supports automated deployment processes, often using AWS CodePipeline, to streamline the onboarding of new tenants and updates to the application.
5. **Microservices Architecture**: The solution leverages a microservices architecture, allowing for modular development and deployment. This approach supports scalability and flexibility in managing different components of the application.
6. **Operational Management**: Shared services within the EKS cluster handle common operational tasks such as logging, monitoring, and configuration management, which are essential for maintaining a robust SaaS environment. This reference architecture serves as a starting point for developing SaaS applications on AWS using EKS, providing practical examples and best practices to address common challenges in multi-tenant environments.

# GitHub Repository

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/aws-saas-factory-eks-reference-architecture)
