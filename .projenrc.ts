// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { awscdk, javascript } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';

const GITHUB_USER = 'awslabs';
const PUBLICATION_NAMESPACE = 'cdklabs';
const PROJECT_NAME = 'sbt-aws';
const CDK_VERSION: string = '2.114.1';
const PROJEN_VERSION: string = '0.79.7';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Amazon Web Services - SaaS Factory',
  authorAddress: 'sbt-aws-maintainers@amazon.com',
  authorOrganization: true,
  cdkVersion: CDK_VERSION,
  constructsVersion: '10.0.5',
  copyrightOwner: 'Amazon.com, Inc. or its affiliates. All Rights Reserved.',
  copyrightPeriod: '2024-',
  defaultReleaseBranch: 'main',
  deps: ['@aws-cdk/aws-lambda-python-alpha', 'cdk-nag'],
  description:
    'SaaS Builder Toolkit for AWS is a developer toolkit to implement SaaS best practices and increase developer velocity.',
  devDeps: ['eslint-plugin-header'],
  github: true,
  jsiiVersion: '~5.2.0',
  keywords: ['constructs', 'aws-cdk', 'saas'],
  license: 'Apache-2.0',
  licensed: true,
  maxNodeVersion: '20.x',
  minNodeVersion: '18.12.0',
  name: `@${PUBLICATION_NAMESPACE}/${PROJECT_NAME}`,
  npmignoreEnabled: true,
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  projenVersion: PROJEN_VERSION,
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '20.x',

  npmTokenSecret: 'NPM_TOKEN',
  npmAccess: NpmAccess.PUBLIC,

  githubOptions: {
    pullRequestLintOptions: {
      contributorStatement:
        'By submitting this pull request, I confirm that you can use, modify, copy, and redistribute this contribution, under the terms of the project license.',
      contributorStatementOptions: {
        exemptUsers: ['amazon-auto', 'dependabot[bot]', 'github-actions'],
      },
    },
  },

  gitignore: [
    '*.DS_STORE',
    '!.node-version',
    '*.pyc',
    '__pycache__/',
    '!.ort.yml',
    '.idea',
    '.vscode',
  ],
});

project.npmignore?.addPatterns(
  '.eslintrc.json',
  '.gitattributes',
  '.gitattributes',
  '.github',
  '.gitignore',
  '.mergify.yml',
  '.node-version',
  '.npmignore',
  '.projen',
  '.projenrc.ts',
  '/apidocs/',
  '/coverage',
  '/docs/',
  '/images',
  '/scripts',
  'cdk.out',
  'header.js',
  'projenrc',
  'tsconfig.dev.json',
  'yarn.lock'
);

// Add License header automatically
project.eslint?.addPlugins('header');
project.eslint?.addRules({
  'header/header': [
    2,
    'line',
    [
      ' Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.',
      ' SPDX-License-Identifier: Apache-2.0',
    ],
    2,
  ],
});

project.synth();
