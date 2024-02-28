# SaaS Builder Toolkit for AWS

<!-- ![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSy9rWmVENzRDbXBoVlhYaHBsNks4OGJDRXFtV1IySmhCVjJoaytDU2dtVWhhVys3NS9Odk5DbC9lR2JUTkRvSWlHSXZrNVhYQ3ZsaUJFY3o4OERQY1pnPSIsIml2UGFyYW1ldGVyU3BlYyI6IlB3ODEyRW9KdU0yaEp6NDkiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=main)
[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/aws/aws-cdk)
[![NPM version](https://badge.fury.io/js/aws-cdk.svg)](https://badge.fury.io/js/aws-cdk)
[![PyPI version](https://badge.fury.io/py/aws-cdk-lib.svg)](https://badge.fury.io/py/aws-cdk-lib)
[![NuGet version](https://badge.fury.io/nu/Amazon.CDK.Lib.svg)](https://badge.fury.io/nu/Amazon.CDK.Lib)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/software.amazon.awscdk/aws-cdk-lib/badge.svg)](https://maven-badges.herokuapp.com/maven-central/software.amazon.awscdk/aws-cdk-lib)
[![Go Reference](https://pkg.go.dev/badge/github.com/aws/aws-cdk-go/awscdk/v2.svg)](https://pkg.go.dev/github.com/aws/aws-cdk-go/awscdk/v2)
[![Mergify](https://img.shields.io/endpoint.svg?url=https://gh.mergify.io/badges/aws/aws-cdk&style=flat)](https://mergify.io)-->
![build status](https://github.com/awslabs/sbt-aws/actions/workflows/release.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@cdklabs%2Fsbt-aws.svg)](https://badge.fury.io/js/@cdklabs%2Fsbt-aws)

[![View on Construct Hub](https://constructs.dev/badge?package=%40cdklabs%2Fsbt-aws)](https://constructs.dev/packages/@cdklabs/sbt-aws)

The **SaaS Builder Toolkit for AWS** is an open-source developer toolkit to implement SaaS best practices and increase developer velocity.

It offers a high-level object-oriented abstraction to define SaaS resources on AWS imperatively using the power of modern programming languages. Using SBT’s library of infrastructure constructs, you can easily encapsulate SaaS best practices in your SaaS application, and share it without worrying about boilerplate logic.

Currently, SBT is available in the following language:

* JavaScript, TypeScript ([Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/))
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/previous-releases)
<!-- * Python ([Python ≥ 3.8](https://www.python.org/downloads/))
* Java ([Java ≥ 8](https://www.oracle.com/technetwork/java/javase/downloads/index.html) and [Maven ≥ 3.5.4](https://maven.apache.org/download.cgi))
* .NET ([.NET ≥ 6.0](https://dotnet.microsoft.com/download))
* Go ([Go ≥ 1.16.4](https://golang.org/)) -->

Third-party Language Deprecation: language version is only supported until its EOL (End Of Life) shared by the vendor or community and is subject to change with prior notice.

Jump To:
[Developer Guide](/docs/public/README.md) |
[API Reference](/API.md) |
[Getting Started](#getting-started) |
[Getting Help](#getting-help) |
[Contributing](#contributing) |
[Roadmap](https://github.com/aws/aws-cdk/blob/main/ROADMAP.md) |
[More Resources](#more-resources)

-------

SBT is built on top of the AWS Cloud Development Kit (CDK). It offers a number of higher-order constructs (L2, L2.5 and L3) to short-circuit the time required to build SaaS applications. Specifically, SBT attempts to codify several control plane and application plane concepts into reusable components, promoting reuse and reducing boilerplate code.

## Getting Started

For a detailed walkthrough, see the [tutorial](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md#tutorial) in the [developer guide](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md).

### At a glance

Initialize a CDK project:

```sh
mkdir hello-cdk
cd hello-cdk
cdk init sample-app --language=typescript
```

This creates a sample project looking like this:

```ts
export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'HelloCdkQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'HelloCdkTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
```

Install or update SBT from npm (requires [Node.js ≥ 14.15.0](https://nodejs.org/download/release/latest-v14.x/)). We recommend using a version in [Active LTS](https://nodejs.org/en/about/previous-releases)

```sh
npm install @cdklabs/sbt-aws
```

Add a sample control plane to your application. In the `HelloCdkStack` add the following:

```typescript
const cp = new sbt.ControlPlane(this, 'control-plane', {
  idpName: 'COGNITO',
  systemAdminRoleName: 'SystemAdmin',
  systemAdminEmail: 'admin@example.com',
  applicationPlaneEventSource: 'sbt-application-plane-api',
  provisioningDetailType: 'Onboarding',
  controlPlaneEventSource: 'sbt-control-plane-api',
  onboardingDetailType: 'Onboarding',
  offboardingDetailType: 'Offboarding',
});
```

Deploy this to your account:

```sh
cdk deploy
```

## Getting Help

The best way to interact with our team is through GitHub. You can open an [issue](https://github.com/awslabs/sbt-aws/issues/new/choose) and choose from one of our templates for bug reports, feature requests, documentation issues, or guidance.

You may also find help on these community resources:

* Look through the [API Reference](https://github.com/awslabs/sbt-aws/blob/main/API.md) or [Developer Guide](https://github.com/awslabs/sbt-aws/blob/main/docs/public/README.md)

## Roadmap

The [SBT for AWS Roadmap project board](PLACEHOLDER) lets developers know about our upcoming features and priorities to help them plan how to best leverage the CDK and identify opportunities to contribute to the project. 

## Contributing

We welcome community contributions and pull requests. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to set up a development environment and submit code.

<!-- ## Metrics collection

This solution collects anonymous operational metrics to help AWS improve the quality and features of the CDK. For more information, including how to disable this capability, please see the [developer guide](https://docs.aws.amazon.com/cdk/latest/guide/cli.html#version_reporting). -->

## More Resources

* [SaaS on AWS](http://aws.amazon.com/saas)
* [Examples](PLACEHOLDER)
* [Changelog](./CHANGELOG.md)
* [NOTICE](./NOTICE)
* [License](./LICENSE)