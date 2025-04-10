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
