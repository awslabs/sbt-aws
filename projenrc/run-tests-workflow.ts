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

export interface RunTestsWorkflowOptions {
  /**
   * Name of the build job that must complete successfully before tests run
   * @default 'build'
   */
  buildJobId?: string;
}

export function runTestsWorkflow(
  project: AwsCdkConstructLibrary,
  options: RunTestsWorkflowOptions = {}
) {
  // Set default values
  const buildJobId = options.buildJobId || 'build';
  const runTests = project.github?.addWorkflow('run-tests');
  if (runTests) {
    // Use regular pull_request trigger for better security
    runTests.on({
      pullRequest: {
        branches: ['main'],
      },
      workflowDispatch: {}, // Add workflow_dispatch trigger to allow manual runs
    });

    // Make this workflow depend on the build workflow specified by buildJobId parameter

    runTests.addJobs({
      'run-tests': {
        runsOn: ['ubuntu-24.04-arm'],
        permissions: {
          idToken: JobPermission.WRITE,
          contents: JobPermission.READ,
        },
        // Add dependency on the build workflow
        needs: [buildJobId],
        // Only run if the build workflow succeeded AND the PR is not from a fork
        if: `\${{ needs.${buildJobId}.result == 'success' && github.event.pull_request.head.repo.full_name == github.repository }}`,
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
            // When using pull_request trigger, we don't need explicit checkout parameters
            // as it automatically checks out the PR code
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
