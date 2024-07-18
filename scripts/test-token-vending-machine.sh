#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

STACK_NAME="token-vending-machine-integ"

LAMBDA_FUNCTION_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs[?OutputKey=='TVMTestFunctionName'].OutputValue" --output text)

TEMP_FILE=$(mktemp)

aws lambda invoke --function-name $LAMBDA_FUNCTION_NAME --payload "{}" $TEMP_FILE

RESPONSE_VALUE=$(cat $TEMP_FILE | jq -r '.statusCode')

rm $TEMP_FILE

echo "Response code: $RESPONSE_VALUE"  

# Check the contents of the response
if [[ "$RESPONSE_VALUE" == "200" ]]; then
  echo "Token vending machine tests passed successfully!"
  exit 0
else
  echo "Token vending machine tests failed!"
  exit 1
fi