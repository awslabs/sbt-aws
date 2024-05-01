// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AwsCdkConstructLibrary } from 'projen/lib/awscdk';
import { JobPermission } from 'projen/lib/github/workflows-model';

export function runTestsWorkflow(project: AwsCdkConstructLibrary) {
  const runTests = project.github?.addWorkflow('run-tests');
  if (runTests) {
    runTests.on({
      schedule: [
        { cron: '0 6 * * *' }, // Runs at midnight Mountain Time (UTC-6) every day
      ],
    });

    runTests.addJobs({
      'run-tests': {
        runsOn: ['ubuntu-22.04'],
        permissions: {
          idToken: JobPermission.WRITE,
          contents: JobPermission.READ,
        },
        steps: [
          {
            name: 'configure aws credentials',
            uses: 'aws-actions/configure-aws-credentials@v4',
            with: {
              'role-to-assume': '${{ secrets.IAM_ROLE_GITHUB }}',
              'aws-region': '${{ secrets.AWS_REGION }}',
            },
          },
          {
            name: 'checkout source',
            uses: 'actions/checkout@v4',
          },
          {
            name: 'run tests',
            run: 'bash -e scripts/github-actions-run-tests-script.sh',
            env: {
              STEP_FUNCTION_ARN: '${{ secrets.STEP_FUNCTION_ARN }}',
              LOG_GROUP_NAME: '${{ secrets.LOG_GROUP_NAME }}',
            },
          },
        ],
      },
    });
  }
}
