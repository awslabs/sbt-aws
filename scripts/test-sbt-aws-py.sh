#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

CONTROL_PLANE_STACK_NAME="$1"
BASE_EMAIL="$2"

if [ -z "$CONTROL_PLANE_STACK_NAME" ] || [ -z "$BASE_EMAIL" ]; then
    echo "Usage: $0 <control-plane-stack-name> <email>"
    exit 1
fi

# Colors for logging
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Variable to track overall test status
TEST_PASSED=true

# Function to log test status
log_test() {
    local status=$1
    local message=$2

    if [ "$status" = "pass" ]; then
        echo -e "${GREEN}[PASS] $message${NC}"
    else
        echo -e "${RED}[FAIL] $message${NC}"
        TEST_PASSED=false
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

# Generate random name and email for tenant
generate_tenant_data() {
    RANDOM_SUFFIX=$(openssl rand -hex 4)
    TENANT_NAME="tenant${RANDOM_SUFFIX}"
    TENANT_EMAIL="${BASE_EMAIL%@*}+${TENANT_NAME}@${BASE_EMAIL#*@}"
}

# Generate random name and email for user
generate_user_data() {
    RANDOM_SUFFIX=$(openssl rand -hex 4)
    USER_NAME="user${RANDOM_SUFFIX}"
    USER_EMAIL="${BASE_EMAIL%@*}+${USER_NAME}@${BASE_EMAIL#*@}"
}

# Test create-tenant
echo "Testing create-tenant..."
generate_tenant_data
tenant_id=$(sbt-aws-cli create-tenant "$TENANT_NAME" "$TENANT_EMAIL" "basic" | jq -r '.data.tenantId')
# check to make sure tenant_id is NOT empty and is NOT null
if [ -n "$tenant_id" ] && [ "$tenant_id" != "null" ]; then
    log_test "pass" "Tenant created successfully with ID: $tenant_id"

    # Check DynamoDB table entry
    table_name=$(aws dynamodb list-tables --query "TableNames[?contains(@, 'TenantDetails') && contains(@, '$CONTROL_PLANE_STACK_NAME')]" | jq -r '.[0]')
    check_dynamodb_table_entry "$table_name" "$tenant_id" "In progress"
    if [ $? -eq 0 ]; then
        log_test "pass" "Tenant status set to 'In progress' in DynamoDB table"
    else
        log_test "fail" "Failed to set tenant status to 'In progress' in DynamoDB table"
    fi

#     # Wait for CloudFormation stack creation
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
tenants=$(sbt-aws-cli get-all-tenants 30)
if echo "$tenants" | grep -q "$tenant_id"; then
    log_test "pass" "Tenant found in get-all-tenants"
else
    log_test "fail" "Tenant not found in get-all-tenants"
fi

# Test get-tenant
echo "Testing get-tenant..."
tenant_details=$(sbt-aws-cli get-tenant "$tenant_id")
if [ -n "$tenant_details" ]; then
    log_test "pass" "Tenant details retrieved successfully"
else
    log_test "fail" "Failed to retrieve tenant details"
fi

# Test delete-tenant
echo "Testing delete-tenant..."
sbt-aws-cli delete-tenant "$tenant_id" >/dev/null
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
fake_tenant_id=$(openssl rand -hex 10)
delete_output=$(sbt-aws-cli delete-tenant "$fake_tenant_id" 2>&1)
delete_response=$(echo "$delete_output" | jq -r '.')

if [ "$(echo "$delete_response" | jq -r '.statusCode')" = "404" ] && [ "$(echo "$delete_response" | jq -r '.message')" = "Tenant $fake_tenant_id not found." ]; then
    log_test "pass" "Received expected error when deleting non-existent tenant"
else
    log_test "fail" "Unexpected output when deleting non-existent tenant"
fi

# Test create-user
echo "Testing create-user..."
generate_user_data
user_id=$(sbt-aws-cli create-user "$USER_NAME" "$USER_EMAIL" "basicUser" | jq -r '.data.userName')
if [ -n "$user_id" ] && [ "$user_id" != "null" ]; then
    log_test "pass" "User created successfully with ID: $user_id"
else
    log_test "fail" "Failed to create user"
fi

# Test get-all-users
echo "Testing get-all-users..."
users=$(sbt-aws-cli get-all-users 30)
if echo "$users" | grep -q "$user_id"; then
    log_test "pass" "User found in get-all-users"
else
    log_test "fail" "User not found in get-all-users"
fi

# Test get-users
echo "Testing get-user..."
user_details=$(sbt-aws-cli get-user "$user_id")
if [ -n "$user_details" ]; then
    log_test "pass" "User details retrieved successfully"
else
    log_test "fail" "Failed to retrieve user details"
fi

# Test update-user
new_user_role="advancedUser"
new_user_email="newemail@example.com"
sbt-aws-cli update-user "$user_id" "$new_user_role" "$new_user_email" >/dev/null
if [ $? -eq 0 ]; then
    log_test "pass" "User update initiated successfully"

    # Get the updated user details
    updated_user_details=$(sbt-aws-cli get-user "$user_id")
    updated_user_role=$(echo "$updated_user_details" | jq -r '.data' | jq -r '.userRole')
    updated_user_email=$(echo "$updated_user_details" | jq -r '.data' | jq -r '.email')

    # Verify the updated user details
    if [ "$updated_user_role" = "$new_user_role" ] && [ "$updated_user_email" = "$new_user_email" ]; then
        log_test "pass" "User details updated successfully"
    else
        log_test "fail" "Failed to update user details"
    fi
else
    log_test "fail" "Failed to update user"
fi

# Test delete-user
echo "Testing delete-user..."
sbt-aws-cli delete-user "$user_id" >/dev/null
if [ $? -eq 0 ]; then
    log_test "pass" "User deletion initiated successfully"
else
    log_test "fail" "Failed to delete user"
fi

# Set the exit code based on the overall test status
if [ "$TEST_PASSED" = true ]; then
    exit 0
else
    exit 1
fi
