#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# Colors for logging
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to log test status
log_test() {
    local status=$1
    local message=$2

    if [ "$status" = "pass" ]; then
        echo -e "${GREEN}[PASS] $message${NC}"
    else
        echo -e "${RED}[FAIL] $message${NC}"
    fi
}

# Function to wait for CloudFormation stack creation
wait_for_stack_creation() {
    local stack_name_pattern=$1
    local max_attempts=60
    local attempt=0

    while true; do
        stack_status=$(aws cloudformation describe-stacks --query 'Stacks[?contains(StackName, `'"$stack_name_pattern"'`)].StackStatus' --output text)
        if [ "$stack_status" = "CREATE_COMPLETE" ]; then
            break
        elif [ "$stack_status" = "CREATE_FAILED" ]; then
            log_test "fail" "CloudFormation stack creation failed"
            return 1
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$max_attempts" ]; then
            log_test "fail" "Timeout waiting for CloudFormation stack creation"
            return 1
        fi

        sleep 10
    done
}

check_dynamodb_table_entry() {
    local table_name=$1
    local tenant_id=$2
    local expected_status=$3

    entry=$(aws dynamodb get-item --table-name "$table_name" --key '{"tenantId":{"S":"'$tenant_id'"}}' --query 'Item.tenantStatus.S' --output text)
    if [ "$entry" = "$expected_status" ]; then
        return 0
    else
        return 1
    fi
}

# Test create-tenant
echo "Testing create-tenant..."
tenant_id=$(./sbt-aws.sh create-tenant | jq -r '.data.tenantId')
# check to make sure tenant_id is NOT empty and is NOT null
if [ -n "$tenant_id" ] && [ "$tenant_id" != "null" ]; then
    log_test "pass" "Tenant created successfully with ID: $tenant_id"

    # Check DynamoDB table entry
    table_name=$(aws dynamodb list-tables --query "TableNames[?contains(@, 'TenantDetails')]" | jq -r '.[0]')
    check_dynamodb_table_entry "$table_name" "$tenant_id" "In progress"
    if [ $? -eq 0 ]; then
        log_test "pass" "Tenant status set to 'In progress' in DynamoDB table"
    else
        log_test "fail" "Failed to set tenant status to 'In progress' in DynamoDB table"
    fi

    # Wait for CloudFormation stack creation
    stack_name="$tenant_id"
    wait_for_stack_creation "$stack_name"

    # Wait for tenant status to change to 'created'
    max_attempts=60
    attempt=0
    while true; do
        check_dynamodb_table_entry "$table_name" "$tenant_id" "created"
        if [ $? -eq 0 ]; then
            log_test "pass" "Tenant status changed to 'created' in DynamoDB table"
            break
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$max_attempts" ]; then
            log_test "fail" "Timeout waiting for tenant status to change to 'created'"
            break
        fi

        sleep 5
    done
else
    log_test "fail" "Failed to create tenant"
    exit 1
fi

# Test get-all-tenants
echo "Testing get-all-tenants..."
tenants=$(./sbt-aws.sh get-all-tenants)
if echo "$tenants" | grep -q "$tenant_id"; then
    log_test "pass" "Tenant found in get-all-tenants"
else
    log_test "fail" "Tenant not found in get-all-tenants"
fi

# Test get-tenant
echo "Testing get-tenant..."
tenant_details=$(./sbt-aws.sh get-tenant "$tenant_id")
if [ -n "$tenant_details" ]; then
    log_test "pass" "Tenant details retrieved successfully"
else
    log_test "fail" "Failed to retrieve tenant details"
fi

# Test delete-tenant
echo "Testing delete-tenant..."
./sbt-aws.sh delete-tenant "$tenant_id" >/dev/null
if [ $? -eq 0 ]; then
    log_test "pass" "Tenant deletion initiated successfully"

    # Check DynamoDB table entry
    check_dynamodb_table_entry "$table_name" "$tenant_id" "Deleting"
    if [ $? -eq 0 ]; then
        log_test "pass" "Tenant status set to 'Deleting' in DynamoDB table"
    else
        log_test "fail" "Failed to set tenant status to 'Deleting' in DynamoDB table"
    fi

    # Wait for tenant status to change to 'deleted'
    max_attempts=60
    attempt=0
    while true; do
        check_dynamodb_table_entry "$table_name" "$tenant_id" "deleted"
        if [ $? -eq 0 ]; then
            log_test "pass" "Tenant status changed to 'deleted' in DynamoDB table"
            break
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$max_attempts" ]; then
            log_test "fail" "Timeout waiting for tenant status to change to 'deleted'"
            break
        fi

        sleep 5
    done
else
    log_test "fail" "Failed to delete tenant"
fi

# Test deleting a non-existent tenant
echo "Testing delete-tenant for non-existent tenant..."
fake_tenant_id=$(openssl rand -hex 10)  # Generate a random 10-character hexadecimal string
delete_output=$(./sbt-aws.sh delete-tenant "$fake_tenant_id" 2>&1)
expected_error='{"statusCode":404,"message":"Tenant '"$fake_tenant_id"' not found."}'
if echo "$delete_output" | grep -q "$expected_error"; then
    log_test "pass" "Received expected error when deleting non-existent tenant"
else
    log_test "fail" "Unexpected output when deleting non-existent tenant"
fi
