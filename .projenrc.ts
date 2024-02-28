// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { awscdk, javascript } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { NpmAccess } from 'projen/lib/javascript';

const GITHUB_USER = 'awslabs';
const PUBLICATION_NAMESPACE = 'cdklabs';
const PROJECT_NAME = 'sbt-aws';
const CDK_VERSION: string = '2.114.1';
const PROJEN_VERSION: string = '0.80.2';

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
  pullRequestTemplateContents: [
    '### Issue # (if applicable)',
    '',
    'Closes #<issue number here>.',
    '',
    '### Reason for this change',
    '',
    '<!--What is the bug or use case behind this change?-->',
    '',
    '### Description of changes',
    '',
    '<!--What code changes did you make? Have you made any important design decisions?-->',
    '',
    '### Description of how you validated changes',
    '',
    '<!--Have you added any unit tests and/or integration tests?-->',
    '',
    '### Checklist',
    '',
    '- [ ] My code adheres to the [CONTRIBUTING GUIDE](https://github.com/awslabs/sbt-aws/blob/main/CONTRIBUTING.md)',
  ],
  repositoryUrl: `https://github.com/${GITHUB_USER}/${PROJECT_NAME}`,
  sampleCode: false,
  stability: 'experimental',
  workflowNodeVersion: '20.x',

  npmTokenSecret: 'NPM_TOKEN',
  npmAccess: NpmAccess.PUBLIC,
  githubOptions: {
    projenCredentials: GithubCredentials.fromPersonalAccessToken({
      secret: 'GITHUB_TOKEN',
    }),
    pullRequestLintOptions: {
      contributorStatement:
        '\n*By submitting this pull request, I confirm that you can use, modify, copy, and redistribute this contribution, under the terms of the project license.*',
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
  'yarn.lock',
  '*.drawio'
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
