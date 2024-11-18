---
sidebar_position: 2
---
# Amazon ECS SaaS - Reference Architecture

**[Developer Documentation](DEVELOPER_GUIDE.md)**
## Introduction
Organizations are moving to the SaaS (Software-as-a-service) delivery model to achieve optimized cost, operational efficiency and overall agility in their software business. SaaS helps to onboard their customers (tenants) into a centrally hosted version of the solution, and manage them via a single pane of glass. These SaaS solutions allow the underneath infrastructure components to be shared across tenants, while demanding mechanisms that can implement the multi-tenancy in the architecture to preserve overall security, performance and other non-functional requirements demanded by the use-case. Often, these strategies and their implementation heavily depend on the underneath technologies and AWS managed services that are being used.

This github solution provides code samples, configurations and best practices that help to implement multi-tenant SaaS reference architecture leveraging Amazon Elastic Container Service (ECS).

The objective here is to dive deeper into design principals and implementation details in building ECS SaaS reference solution covering necessary technical aspects. We will discuss SaaS control plane functionalities with shared services such as tenant onboarding, user management, admin portals, along with the SaaS application plane capabilities such as ECS compute isolation strategies, request routing at scale, service discovery, storage isolation patterns, API throttling and usage plans, and different ways to ensure security and scalability.

## ECS SaaS Reference Solution Overview
The following diagram shows the high-level architecture of the solution that outlines the core components of ECS SaaS. It is a tier-based SaaS, and the three tiers represent three different tenant isolation strategies using Amazon ECS. This would help SaaS providers to have a wide range of technical options to model their SaaS solution based on their tiering requirements.

1. Basic Tier: Shared ECS Services across all the tenants (Pool model)
2. Advanced Tier : Shared ECS Cluster, dedicated ECS services per tenant (Silo model)
3. Premium Tier: Dedicated ECS Cluster per tenant (Silo model)

<p align="center">
<img src="images/archi-high-level.png" alt="High-level Architecture"/>
Fig 1: ECS SaaS - High-level infrastructure
</p>


This reference architecture adopts the latest [AWS SaaS Builder Toolkit](https://github.com/awslabs/sbt-aws) (SBT) that [AWS SaaS Factory](https://aws.amazon.com/partners/programs/saas-factory) has developed. SBT helps to extend the SaaS control plane services such as tenant onboarding, off-boarding, tenant and user management, billing, etc seamlessly into the solution. It also provides an event-based integration to the ECS application plane that enables bi-directional communication for SaaS operations. Read more about AWS SBT [here](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md).


## Pre-requisites
This solution can be deployed via an [AWS Cloud9](https://aws.amazon.com/pm/cloud9/) environment on your AWS account, or directly from your laptop.

If you are using Cloud9, make sure to use `Amazon Linux 2023` AMI for the EC2 with at least t3.large instance size. Also, increase the volume size of the underlying EC2 instance to 50 GB (instead of default 10 GB) using this script `./scripts/resize-cloud9.sh` - This is to make sure that you have enough compute and space to build the solution.

- This reference architecture uses Python. Make sure you have Python 3.8 or above installed.
- Make sure you have [AWS CLI 2.14](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) or above installed.
- Make sure you have [Docker Engine](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html) installed.
- Make sure you have the latest version of [AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) installed. Not having the release version of CDK can cause deployment issues.
- Make sure that you have Node 18 or above.
- Make sure that you have Git installed.


## Deployment Steps

To deploy this ECS SaaS reference solution, you can run the below commands. Replace the ```admin_email``` with a real email address that will be used to create an admin user in the solution, and to share the admin credentials that allow to perform administrative tasks such as onboarding new tenants.


```bash
git clone this_repo_url
cd saas-reference-architecture-ecs/scripts
./build-application.sh 
./install.sh admin_email 
```

Note that, ```build-application.sh``` builds docker images of sample SaaS application with order, product & user microservices and pushes to Amazon ECR.

And, ```install.sh``` deploys the following:

- Creates an AWS S3 bucket in your AWS account and pushes this reference solution code to the bucket
  - Uploaded sources are used for microservices provisioning for the Advanced tier and each ECS and microservices provisioning for the Premium tier.
- Cdk stack `controlplane-stack` which provisions
  - SaaS Builder Toolkit(SBT) control plane components which allows infrastructure to provision/de-provision a tenant.
- Cdk stack `coreappplane-stack` which provisions
  - SaaS Builder Toolkit(SBT) core application plane, an optional utility that lets define, and run arbitrary jobs upon receipt of a control plane messages. This reference solution uses this utility to launch AWS CodeBuild project for onboarding and off-boarding tenants.
- Cdk stack `shared-infra-stack`, which provisions
  - Shared application infrastructure like Amazon VPC, Amazon API Gateway, and Load balancers.
- Cdk stack `tenant-template-stack`, which provisions
  - ECS Cluster and ECS services order, product & user microservices.
  - `tenant-template-basic`: ECS cluster and ECS service Order, Product, and User microservices for the Basic tier.
  - `tenant-template-advanced`: ECS cluster for the Advanced tier (Microservices are installed exclusively when a tenant onboard.)

## Steps to Clean-up

Run the following script to clean up reference solution resources from your AWS account. Please make sure that [jq](https://jqlang.github.io/jq/download/) JSON processor installed in your environment before invoking below script.

```bash
cd scripts
./cleanup.sh
```
## License

This library is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/saas-reference-architecture-ecs)