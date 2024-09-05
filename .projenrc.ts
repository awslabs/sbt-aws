// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { awscdk, javascript, cdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
import {
  PULL_REQUEST_TEMPLATE,
  GITHUB_OPTIONS,
  GIT_IGNORE_PATTERNS,
  NPM_IGNORE_PATTERNS,
  ESLINT_RULE,
} from './projenrc/constants';
import { runTestsWorkflow } from './projenrc/run-tests-workflow';

const GITHUB_USER: string = 'awslabs';
const PUBLICATION_NAMESPACE: string = 'cdklabs';
const PS_PUBLICATION_NAMESPACE: string = 'aws';
const PROJECT_NAME: string = 'sbt-aws';
const PROJEN_VERSION: string = '0.86.9';
const CDK_VERSION: string = '2.140.0';
const JSII_VERSION: string = '~5.3.0';
const CONSTRUCTS_VERSION: string = '10.0.5';
const POINT_SOLUTIONS_CDK_VERSION: string = '2.140.0';
const POINT_SOLUTIONS_LIB_PROJECT_NAME: string = 'sbt-point-solutions-lib';
const AWS_SDK_VERSION: string = '^3.621.0';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Amazon Web Services - SaaS Factory',
  authorAddress: 'sbt-aws-maintainers@amazon.com',
  authorOrganization: true,
  cdkVersion: CDK_VERSION,
  constructsVersion: CONSTRUCTS_VERSION,
  copyrightOwner: 'Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  copyrightPeriod: '2024-',
  defaultReleaseBranch: 'main',
  deps: [
    `@aws-cdk/aws-lambda-python-alpha@${CDK_VERSION}-alpha.0`,
    'cdk-nag',
    `@aws-cdk/aws-kinesisfirehose-alpha@${CDK_VERSION}-alpha.0`,
    `@aws-cdk/aws-kinesisfirehose-destinations-alpha@${CDK_VERSION}-alpha.0`,
  ],
  description:
    'SaaS Builder Toolkit for AWS is a developer toolkit to implement SaaS best practices and increase developer velocity.',
  devDeps: [
    `aws-cdk@${CDK_VERSION}`,
    'eslint-plugin-header',
    `@aws-cdk/aws-kinesisfirehose-alpha@${CDK_VERSION}-alpha.0`,
    `braces@>=3.0.3`, // fixes CVE-2024-4068
  ],
  github: true,
  jsiiVersion: JSII_VERSION,
  keywords: ['constructs', 'aws-cdk', 'saas'],
  license: 'Apache-2.0',
  licensed: true,
  maxNodeVersion: '20.x',
  minNodeVersion: '18.12.0',
  name: `@${PUBLICATION_NAMESPACE}/${PROJECT_NAME}`,
  npmignoreEnabled: true,
  packageManager: javascript.NodePackageManager.NPM,
  peerDeps: [`@aws-cdk/aws-kinesisfirehose-alpha@${CDK_VERSION}-alpha.0`],
  prettier: true,
  projenrcTs: true,
  projenVersion: PROJEN_VERSION,
  pullRequestTemplateContents: PULL_REQUEST_TEMPLATE,
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '20.x',
  npmTokenSecret: 'NPM_TOKEN',
  npmAccess: NpmAccess.PUBLIC,
  githubOptions: GITHUB_OPTIONS,
  gitignore: GIT_IGNORE_PATTERNS,
  npmIgnoreOptions: {
    ignorePatterns: NPM_IGNORE_PATTERNS,
  },
  releaseTagPrefix: '@cdklabs/sbt-aws-',
});

// Add License header automatically
project.eslint?.addPlugins('header');
project.eslint?.addRules({
  'header/header': ESLINT_RULE,
});

const jsiiLibraryProjectOptions: cdk.JsiiProjectOptions = {
  author: 'Amazon Web Services - SaaS Factory',
  authorAddress: 'sbt-aws-maintainers@amazon.com',
  authorOrganization: true,
  copyrightOwner: 'Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  copyrightPeriod: '2024-',
  defaultReleaseBranch: 'main',
  deps: [
    `@aws-sdk/client-sts@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-ssm@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-cognito-identity-provider@${AWS_SDK_VERSION}`,
    `@aws-sdk/credential-providers@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-dynamodb@${AWS_SDK_VERSION}`,
    '@smithy/types',
    'jsonwebtoken',
    'jwks-rsa',
    'uuid',
    `aws-cdk-lib@${POINT_SOLUTIONS_CDK_VERSION}`,
    '@types/uuid',
    '@aws-sdk/types',
  ],
  description:
    'SaaS Builder Toolkit point solutions for AWS is a developer toolkit to implement SaaS best practices and increase developer velocity.',
  devDeps: ['@types/uuid', '@types/node', 'typescript'],
  github: true,
  jsiiVersion: JSII_VERSION,
  keywords: ['constructs', 'aws-cdk', 'saas'],
  license: 'Apache-2.0',
  licensed: true,
  maxNodeVersion: '20.x',
  minNodeVersion: '18.12.0',
  name: `@${PS_PUBLICATION_NAMESPACE}/${POINT_SOLUTIONS_LIB_PROJECT_NAME}`,
  npmignoreEnabled: true,
  packageManager: javascript.NodePackageManager.NPM,
  peerDeps: [`constructs@${CONSTRUCTS_VERSION}`, `aws-cdk-lib@${POINT_SOLUTIONS_CDK_VERSION}`],
  prettier: true,
  projenrcTs: true,
  projenVersion: PROJEN_VERSION,
  pullRequestTemplateContents: PULL_REQUEST_TEMPLATE,
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  parent: project,
  outdir: 'src/point-solutions/libraries',
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '20.x',

  npmTokenSecret: 'NPM_TOKEN',
  npmAccess: NpmAccess.PUBLIC,
  githubOptions: GITHUB_OPTIONS,
  gitignore: GIT_IGNORE_PATTERNS,
  npmIgnoreOptions: {
    ignorePatterns: NPM_IGNORE_PATTERNS,
  },
  buildWorkflow: true,
  buildWorkflowOptions: {
    preBuildSteps: [
      {
        name: 'Install Dependencies',
        run: 'npm install',
      },
    ],
  },
  release: true,
  releaseWorkflowSetupSteps: [
    {
      name: 'Install Dependencies',
      run: 'npm ci',
    },
  ],
  releaseTagPrefix: '@aws/sbt-point-solutions-lib-',
  bundledDeps: [
    `@aws-sdk/client-sts@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-ssm@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-cognito-identity-provider@${AWS_SDK_VERSION}`,
    `@aws-sdk/credential-providers@${AWS_SDK_VERSION}`,
    `@aws-sdk/client-dynamodb@${AWS_SDK_VERSION}`,
    '@smithy/types',
    'jsonwebtoken',
    'jwks-rsa',
    'uuid',
    '@types/uuid',
    '@aws-sdk/types',
  ],
  // TODO: Need to setup account in  Pypi
  // publishToPypi: {
  //   distName: 'sbt_point_solutions_lib',
  //   module: 'sbt_point_solutions_lib',
  // },
};

const pointSolutionsLibraryProject = new cdk.JsiiProject(jsiiLibraryProjectOptions);

// Add License header automatically
pointSolutionsLibraryProject.eslint?.addPlugins('header');
pointSolutionsLibraryProject.eslint?.addRules({
  'header/header': ESLINT_RULE,
});

pointSolutionsLibraryProject.synth();
runTestsWorkflow(project);
project.synth();
