#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# Required env variables
# - $STEP_FUNCTION_ARN - ARN of the Step Function to trigger
# - $LOG_GROUP_NAME - Name of the CloudWatch Log Group to tail logs from
# - $GITHUB_HEAD_REF - Git branch name that will be passed as input to the Step Function

# Check if required environment variables are set
if [ -z "$STEP_FUNCTION_ARN" ]; then
    echo "Error: STEP_FUNCTION_ARN is not set"
    exit 1
fi

if [ -z "$LOG_GROUP_NAME" ]; then
    echo "Error: LOG_GROUP_NAME is not set"
    exit 1
fi

if [ -z "$GITHUB_HEAD_REF" ]; then
    echo "Error: GITHUB_HEAD_REF is not set"
    exit 1
fi

# Get the current timestamp in UTC format
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Start the Step Functions execution
# The input is a JSON object with the gitBranchName key and the value of $GITHUB_HEAD_REF
# The --query option extracts the executionArn from the response and assigns it to EXECUTION_ARN
EXECUTION_ARN=$(aws stepfunctions start-execution \
    --state-machine-arn "$STEP_FUNCTION_ARN" \
    --input "{\"gitBranchName\": \"$GITHUB_HEAD_REF\"}" \
    --query 'executionArn' \
    --output text)

# Get the execution name from the execution ARN
EXECUTION_NAME=$(aws stepfunctions describe-execution \
    --execution-arn "$EXECUTION_ARN" \
    --query 'name' \
    --output text)

# Loop until the Step Function execution is complete
while true; do
    # Get the current status of the Step Function execution
    STATUS=$(aws stepfunctions describe-execution \
        --execution-arn "$EXECUTION_ARN" \
        --query 'status' \
        --output text)

    # Tail the logs for the current execution from the specified log group
    # The --log-stream-name-prefix option filters logs by the execution name
    # The --format short option prints logs in a compact format
    # The --since option specifies the start time for the log stream
    aws logs tail "$LOG_GROUP_NAME" --log-stream-name-prefix "$EXECUTION_NAME" --format short --since "$TIMESTAMP"

    # Update the timestamp for the next iteration
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # If the execution is still running, wait for 5 seconds before checking again
    if [ "$STATUS" == "RUNNING" ]; then
        sleep 5
    else
        # Exit the loop if the execution is not running
        break
    fi
done

# Get the final status and test result of the Step Function execution
FINAL_STATUS=$(aws stepfunctions describe-execution \
    --execution-arn "$EXECUTION_ARN" \
    --query 'status' \
    --output text)

TEST_RESULT=$(aws stepfunctions describe-execution \
    --execution-arn "$EXECUTION_ARN" \
    --query 'output' | jq -rc '. as $my_json | try (fromjson) catch $my_json | .testResult')

# Exit with a success (0) or failure (1) code based on the final status and test result
if [ "$FINAL_STATUS" == "SUCCEEDED" ] && [ "$TEST_RESULT" == "0" ]; then
    exit 0
else
    exit 1
fi
