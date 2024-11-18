---
sidebar_position: 3
---
# Serverless SaaS - Reference Solution

This serverless saas reference solution is built using [SaaS Builder Toolkit (SBT)](https://github.com/awslabs/sbt-aws) control plane and core application plane components.

We have also created a workshop that you can use as a reference to understand this reference solution in a step-by-step fashion. Workshop is available [here](https://github.com/aws-samples/aws-serverless-saas-workshop).

**[Feedback & Feature request](https://www.pulse.aws/survey/EHE3TICQ)** | **[Documentation](DOCUMENTATION.md)**

## Pre-requisites

- This reference architecture uses Python. Make sure you have Python 3.9 or above installed.
- Make sure you have [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed.
- Make sure you have the latest version of [AWS CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) installed. Not having the release version of CDK can cause deployment issues.
- Make sure you have the latest version of [git-remote-codecommit](https://docs.aws.amazon.com/codecommit/latest/userguide/setting-up-git-remote-codecommit.html) installed.
- Make sure that you have Node 18 or above.

## Deploying

To deploy this reference solution run below script. Replace the "test@example.com" email address with yours. This email address will be used to setup an admin user in the control plane of this reference solution.

```bash
cd scripts
./install.sh test@example.com
```

This script will deploy the following:

- Creates a codecommit repo in your AWS account and pushes this reference solutions code to the repo
- Clones SaaS Builder Toolkit(SBT) control plane repo and installs control plane which has all shared services and control plane UI.
- Deploys cdk stack `serverless-saas-ref-arch-bootstrap-stack` which provisions
  - SaaS Builder Toolkit(SBT) core application plane component which provides infrastructure to provision/de-provision a tenant
  - Infrastructure to host a saas application UI and also deploys this saas application UI.
- Deploys pooled tenant cdk stack `serverless-saas-ref-arch-tenant-template-pooled`, which deploys cognito userpool and multi-tenant order & product services.
- Deploys cdk stack `ServerlessSaaSPipeline` which provisions Tenant Pipeline.This pipeline uses CodePipeline and is responsible for auto updating the stack for all the tenants in an automated fashion.

## Steps to Clean-up

Run below script to clean up

```bash
cd scripts
./cleanup.sh
```

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/aws-saas-factory-ref-solution-serverless-saas/tree/main)
