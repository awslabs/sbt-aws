/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { awscdk, javascript, cdk } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
import {
  PULL_REQUEST_TEMPLATE,
  GITHUB_OPTIONS,
  GIT_IGNORE_PATTERNS,
  NPM_IGNORE_PATTERNS,
} from './projenrc/constants';
import { runTestsWorkflow } from './projenrc/run-tests-workflow';

const GITHUB_USER: string = 'awslabs';
const PUBLICATION_NAMESPACE: string = 'cdklabs';
const PS_PUBLICATION_NAMESPACE: string = 'aws';
const PROJECT_NAME: string = 'sbt-aws';
const PROJEN_VERSION: string = '~0.92.3';
const CDK_CLI_VERSION: string = '2.1014.0';
const CDK_LIB_VERSION: string = '2.195.0';
const JSII_VERSION: string = '~5.8.0';
const CONSTRUCTS_VERSION: string = '10.4.2';
const POINT_SOLUTIONS_CDK_LIB_VERSION: string = '2.195.0';
const POINT_SOLUTIONS_LIB_PROJECT_NAME: string = 'sbt-point-solutions-lib';
const AWS_SDK_VERSION: string = '^3.621.0';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Amazon Web Services - SaaS Factory',
  authorAddress: 'sbt-aws-maintainers@amazon.com',
  authorOrganization: true,
  cdkVersion: CDK_LIB_VERSION,
  constructsVersion: CONSTRUCTS_VERSION,
  copyrightOwner: 'Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  copyrightPeriod: '2024-',
  defaultReleaseBranch: 'main',
  deps: [`@aws-cdk/aws-lambda-python-alpha@${CDK_LIB_VERSION}-alpha.0`, 'cdk-nag@^2.35.96'],
  description:
    'SaaS Builder Toolkit for AWS is a developer toolkit to implement SaaS best practices and increase developer velocity.',
  devDeps: [`aws-cdk@${CDK_CLI_VERSION}`, 'eslint-plugin-license-header'],
  github: true,
  jsiiVersion: JSII_VERSION,
  keywords: ['constructs', 'aws-cdk', 'saas'],
  license: 'Apache-2.0',
  licensed: true,
  maxNodeVersion: '24.x',
  minNodeVersion: '20.x',
  name: `@${PUBLICATION_NAMESPACE}/${PROJECT_NAME}`,
  npmignoreEnabled: true,
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  projenVersion: PROJEN_VERSION,
  pullRequestTemplateContents: PULL_REQUEST_TEMPLATE,
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '22.x',
  workflowRunsOn: ['ubuntu-24.04-arm'],
  npmTokenSecret: 'NPM_TOKEN',
  npmAccess: NpmAccess.PUBLIC,
  githubOptions: GITHUB_OPTIONS,
  gitignore: GIT_IGNORE_PATTERNS,
  npmIgnoreOptions: {
    ignorePatterns: NPM_IGNORE_PATTERNS,
  },
  releaseTagPrefix: '@cdklabs/sbt-aws-',
  jestOptions: {
    jestConfig: {
      testEnvironment: 'node',
      testTimeout: 30000,
    },
  },
  buildWorkflowOptions: {
    preBuildSteps: [
      {
        name: 'Configure npm registry',
        run: 'npm config set registry https://registry.npmjs.org/',
      },
    ],
  },
});

// Add security overrides for vulnerability fixes
project.package.addField('overrides', {
  'semver': '^7.5.4',
  'word-wrap': '^1.2.5',
  'tough-cookie': '^4.1.3',
  'postcss': '^8.4.31',
  'follow-redirects': '^1.15.4',
  'braces': '^3.0.3',
  'micromatch': '^4.0.8',
  'loader-utils': '^3.2.1'
});

// Add License header automatically
project.eslint?.addPlugins('license-header');
project.eslint?.addRules({
  'license-header/header': ['error', 'header.js'],
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
    `aws-cdk-lib@${POINT_SOLUTIONS_CDK_LIB_VERSION}`,
    '@types/uuid',
    '@aws-sdk/types',
  ],
  description:
    'SaaS Builder Toolkit point solutions for AWS is a developer toolkit to implement SaaS best practices and increase developer velocity.',
  devDeps: ['@types/node', 'typescript'],
  github: true,
  jsiiVersion: JSII_VERSION,
  keywords: ['constructs', 'aws-cdk', 'saas'],
  license: 'Apache-2.0',
  licensed: true,
  maxNodeVersion: '24.x',
  minNodeVersion: '20.x',
  name: `@${PS_PUBLICATION_NAMESPACE}/${POINT_SOLUTIONS_LIB_PROJECT_NAME}`,
  npmignoreEnabled: true,
  packageManager: javascript.NodePackageManager.NPM,
  peerDeps: [`constructs@${CONSTRUCTS_VERSION}`, `aws-cdk-lib@${POINT_SOLUTIONS_CDK_LIB_VERSION}`],
  prettier: true,
  projenrcTs: true,
  projenVersion: PROJEN_VERSION,
  pullRequestTemplateContents: PULL_REQUEST_TEMPLATE,
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  parent: project,
  outdir: 'src/point-solutions/libraries',
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '22.x',
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

// Add security overrides for vulnerability fixes
pointSolutionsLibraryProject.package.addField('overrides', {
  'semver': '^7.5.4',
  'word-wrap': '^1.2.5',
  'tough-cookie': '^4.1.3',
  'postcss': '^8.4.31',
  'follow-redirects': '^1.15.4',
  'braces': '^3.0.3',
  'micromatch': '^4.0.8'
});

// Add License header automatically
pointSolutionsLibraryProject.eslint?.addPlugins('license-header');
pointSolutionsLibraryProject.eslint?.addRules({
  'license-header/header': ['error', 'header.js'],
});

pointSolutionsLibraryProject.synth();
runTestsWorkflow(project);
project.synth();
