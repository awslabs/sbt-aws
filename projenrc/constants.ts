// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { github } from 'projen';
import { GithubCredentials } from 'projen/lib/github';

export const PULL_REQUEST_TEMPLATE: string[] = [
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
];

export const GIT_IGNORE_PATTERNS: string[] = [
  '*.DS_STORE',
  '!.node-version',
  '*.pyc',
  '__pycache__/',
  '!.ort.yml',
  '.idea',
  '.vscode',
  'cdk.out',
];

export const NPM_IGNORE_PATTERNS: string[] = [
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
  '*.drawio',
];

export const ESLINT_RULE: any[] = [
  2,
  'line',
  [
    ' Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.',
    ' SPDX-License-Identifier: Apache-2.0',
  ],
  2,
];

export const GITHUB_OPTIONS: github.GitHubOptions = {
  projenCredentials: GithubCredentials.fromPersonalAccessToken({
    secret: 'GITHUB_TOKEN',
  }),
  pullRequestLintOptions: {
    contributorStatement:
      '\n*By submitting this pull request, I confirm that you can use, modify, copy, and redistribute this contribution, under the terms of the project license.*',
    contributorStatementOptions: {
      exemptUsers: ['amazon-auto', 'dependabot[bot]', 'github-actions'],
    },
    semanticTitle: true,
    semanticTitleOptions: {
      types: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'style', 'refactor', 'perf', 'test'],
    },
  },
};
