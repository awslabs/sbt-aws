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
const JSII_VERSION: string = '~5.9.0';
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
});

// Pin third-party GitHub Actions to full commit SHAs. Mutable tags (@v4 etc.)
// can be retagged, which is a supply-chain risk. These overrides are applied by
// projen during synthesis to every generated workflow that uses the action, so
// they survive `npx projen` regeneration (a direct edit to the generated YAML
// would be reverted by the build's self-mutation check). Official actions/* are
// left on tags, matching the maintainer preference. The version tag is kept in
// the comment here for traceability.
project.github?.actions.set(
  'aws-actions/configure-aws-credentials@v4',
  'aws-actions/configure-aws-credentials@7474bc4690e29a8392af63c5b98e7449536d5c3a' // v4
);
project.github?.actions.set(
  'peter-evans/create-pull-request@v6',
  'peter-evans/create-pull-request@c5a7806660adbe173f04e3e038b0ccdcd758773c' // v6
);
project.github?.actions.set(
  'amannn/action-semantic-pull-request@v5.4.0',
  'amannn/action-semantic-pull-request@e9fabac35e210fea40ca5b14c0da95a099eff26f' // v5.4.0
);

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

// Add License header automatically
pointSolutionsLibraryProject.eslint?.addPlugins('license-header');
pointSolutionsLibraryProject.eslint?.addRules({
  'license-header/header': ['error', 'header.js'],
});

pointSolutionsLibraryProject.synth();
runTestsWorkflow(project);
project.synth();
