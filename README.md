# SaaS Builder Toolkit for AWS

**[Feedback & Feature request](https://pulse.aws/survey/5JPQR0BV)**

![build status](https://github.com/awslabs/sbt-aws/actions/workflows/build.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@cdklabs%2Fsbt-aws.svg)](https://badge.fury.io/js/@cdklabs%2Fsbt-aws)

[![View on Construct Hub](https://constructs.dev/badge?package=%40cdklabs%2Fsbt-aws)](https://constructs.dev/packages/@cdklabs/sbt-aws)

The **SaaS Builder Toolkit for AWS** (SBT) is an open-source developer toolkit to implement SaaS best practices and increase developer velocity. SBT should be considered sample code and, as such, you should ensure that proper security concerns such as authorization and other security is implemented per your organziation's standards before you deploy this into production environments.

It offers a high-level object-oriented abstraction to define SaaS resources on AWS imperatively using the power of modern programming languages. Using SBT’s library of infrastructure constructs, you can easily encapsulate SaaS best practices in your SaaS application, and share it without worrying about boilerplate logic.

Currently, SBT is available in the following language:

* JavaScript, TypeScript ([Node.js ≥ 20](https://nodejs.org/download/release/latest-v20.x/))
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/previous-releases)

Third-party Language Deprecation: language version is only supported until its EOL (End Of Life) shared by the vendor or community and is subject to change with prior notice.

Jump To:
[Developer Guide](/docs/public/README.md) |
[API Reference](/API.md) |
[Getting Started](#getting-started) |
[Examples](#examples) |
[Getting Help](#getting-help) |
[Contributing](#contributing) |
[Roadmap](#roadmap) |
[More Resources](#more-resources)

-------

SBT is built on top of the AWS Cloud Development Kit (CDK). It offers a number of higher-order constructs (L2, L2.5 and L3) to short-circuit the time required to build SaaS applications. Specifically, SBT attempts to codify several control plane and application plane concepts into reusable components, promoting reuse and reducing boilerplate code.

## Getting Started

For a detailed walkthrough, see the [tutorial](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md#tutorial) in the [developer guide](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md).

## Examples

Interested in seeing SBT used in a comprehensive SaaS reference architecture? Take a look at the following:

* [Elastic Kubernetes Service (EKS) Reference Architecture](https://github.com/aws-samples/aws-saas-factory-eks-reference-architecture)
* [Elastic Container Service (ECS) Reference Architecture](https://github.com/aws-samples/saas-reference-architecture-ecs)
* [Serverless Reference Architecture](https://github.com/aws-samples/aws-saas-factory-ref-solution-serverless-saas)
* [SBT Workshop](https://catalog.workshops.aws/sbt-aws)

## Getting Help

The best way to interact with our team is through GitHub. You can open an [issue](https://github.com/awslabs/sbt-aws/issues/new/choose) and choose from one of our templates for bug reports, feature requests, documentation issues, or guidance.

You may also find help on these community resources:

* Look through the [API Reference](https://github.com/awslabs/sbt-aws/blob/main/API.md) or [Developer Guide](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md)

## Roadmap

The [SBT for AWS Roadmap project board](https://github.com/orgs/awslabs/projects/197) lets developers know about our upcoming features and priorities to help them plan how to best leverage the CDK and identify opportunities to contribute to the project.

## Contributing

We welcome community contributions and pull requests. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to set up a development environment and submit code.

## More Resources

* [SaaS on AWS](http://aws.amazon.com/saas)
* [Changelog](./CHANGELOG.md)
* [NOTICE](./NOTICE)
* [License](./LICENSE)
