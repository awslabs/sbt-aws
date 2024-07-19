## Contributing to the SaaS Builder Toolkit for AWS

We are open to and grateful for any contributions made by the community. Please read through this document before submitting a pull request to ensure that your contribution meets our guidelines.

SBT is released under the [Apache license](http://aws.amazon.com/apache2.0/). Any code you submit will be released under that license.

This document describes how to set up a development environment and submit your changes. Please let us know if it's not up-to-date (even better, submit a PR with your corrections :smile:).

### Setting up your development environment

* Ensure [Node.js ≥ 18.12.0](https://nodejs.org/download/release/latest-v18.x/) is installed
  * We recommend using a version in [Active LTS](https://nodejs.org/en/about/previous-releases)
 
This project uses [Projen](https://projen.io/releases.html).

Once you have all the required dependencies installed, you can fork this repo, then:

```sh
git clone https://github.com/{your-account}/sbt-aws.git
cd sbt-aws
npm install
```

### When to contribute

Please note this document is largely inspired by [AWS Cloud Development Kit (CDK)'s contribution guidance](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md). Rather than repeat all of that here, we encourage you to consult their guidance specifically the [advice](https://github.com/aws/aws-cdk/blob/main/CONTRIBUTING.md#demonstrating-value) around when and why to contribute.

In short, if your contribution contains changes that are demonstrably desired by many SBT users, we absolutely want those changes in the `sbt-aws` core packages. If the changes are more localized, or vendor/partner specific, we'd want to leave those changes in a vendor/partner maintained repo. To the extent the core abstractions and interfaces present in this repo satisfy the needs of integrators, we'll leave them unchanged. In the event our abstractions fall short, or need changed, we encourage a pull request with those changes.

Please consult the issues and discussions section of the SBT repo for good first issues

## Development

1. Make desired changes
1. Run `npm install` to install the npm packages
1. Make sure existing (and new) tests pass successfully by running `npm run test`
1. Run `npm run build` to compile
1. Go to the root of the project. Then, deploy the CDK stack using the following:
   - For `core-app-plane`: `npx cdk deploy --app='./src/core-app-plane/integ.default.js'`
   - For `control-plane`: `CDK_PARAM_SYSTEM_ADMIN_EMAIL="test@example.com" npx cdk deploy --app='./src/control-plane/integ.default.js'`
1. Test out the new feature(s) and redeploy as needed
1. Write tests for any changed code and commit
1. Create a PR.

