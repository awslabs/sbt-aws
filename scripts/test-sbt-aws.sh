#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

CONTROL_PLANE_STACK_NAME="$1"

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

check_dynamodb_table_entry() {
    local table_name=$1
    local id=$2
    local entry_type=$3
    local expected_status=$4
    local field_name=$5

    entry=$(aws dynamodb get-item --table-name "$table_name" --key '{"tenantRegistrationId":{"S":"'$id'"}}' --query 'Item.'$field_name'.'$entry_type --output text)
    if [ "$entry" = "$expected_status" ]; then
        return 0
    else
        return 1
    fi
}

# Test create-tenant-registration
echo "Testing create-tenant-registration..."
response=$(./sbt-aws.sh create-tenant-registration)
tenant_registration_id=$(echo "$response" | jq -r '.tenantRegistrationId')
tenant_id=$(echo "$response" | jq -r '.tenantId')

if [ -n "$tenant_registration_id" ] && [ "$tenant_registration_id" != "null" ]; then
    log_test "pass" "Tenant registration created successfully with ID: $tenant_registration_id"

    # Check DynamoDB table entry
    sleep 1
    table_name=$(aws dynamodb list-tables --query "TableNames[?contains(@, 'TenantRegistration') && contains(@, '$CONTROL_PLANE_STACK_NAME')]" | jq -r '.[0]')
    check_dynamodb_table_entry "$table_name" "$tenant_registration_id" "BOOL" "True" "sbtaws_active"
    if [ $? -eq 0 ]; then
        log_test "pass" "Tenant registration sbtaws_active set to 'True' in DynamoDB table"
    else
        log_test "fail" "Failed to set tenant registration sbtaws_active to 'True' in DynamoDB table"
    fi

    # wait_for_stack_creation "$tenant_id"

    # Wait for tenant provisioning to complete
    max_attempts=60
    attempt=0
    while true; do
        check_dynamodb_table_entry "$table_name" "$tenant_registration_id" "S" "created" "registrationStatus"
        if [ $? -eq 0 ]; then
            log_test "pass" "Tenant registration status changed to 'created' in DynamoDB table"
            break
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$max_attempts" ]; then
            log_test "fail" "Timeout waiting for tenant registration status to change to 'created'"
            break
        fi

        sleep 5
    done
else
    log_test "fail" "Failed to create tenant registration"
    exit 1
fi

# Test get-tenant-registration
echo "Testing get-tenant-registration..."
tenant_registration=$(./sbt-aws.sh get-tenant-registration "$tenant_registration_id")
if echo "$tenant_registration" | grep -q "$tenant_registration_id"; then
    log_test "pass" "Tenant registration retrieved successfully"
else
    log_test "fail" "Failed to retrieve tenant registration"
fi

# Test update-tenant-registration
echo "Testing update-tenant-registration..."
update_key="testKey"
update_value="testValue"
./sbt-aws.sh update-tenant-registration "$tenant_registration_id" "$update_key" "$update_value" >/dev/null
updated_tenant_registration=$(./sbt-aws.sh get-tenant-registration "$tenant_registration_id")
if echo "$updated_tenant_registration" | grep -q "$update_value"; then
    log_test "pass" "Tenant registration updated successfully"
else
    log_test "fail" "Failed to update tenant registration"
fi

# Test delete-tenant-registration
echo "Testing delete-tenant-registration..."
./sbt-aws.sh delete-tenant-registration "$tenant_registration_id" >/dev/null
if [ $? -eq 0 ]; then
    log_test "pass" "Tenant registration deletion initiated successfully"

    sleep 1
    # Check DynamoDB table entry
    check_dynamodb_table_entry "$table_name" "$tenant_registration_id" "BOOL" "False" "sbtaws_active"
    if [ $? -eq 0 ]; then
        log_test "pass" "Tenant registration sbtaws_active set to 'False' in DynamoDB table"
    else
        log_test "fail" "Failed to set tenant registration sbtaws_active to 'False' in DynamoDB table"
    fi

    # Wait for tenant deprovisioning to complete
    max_attempts=60
    attempt=0
    while true; do
        check_dynamodb_table_entry "$table_name" "$tenant_registration_id" "S" "deleted" "registrationStatus"
        if [ $? -eq 0 ]; then
            log_test "pass" "Tenant registration status changed to 'deleted' in DynamoDB table"
            break
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$max_attempts" ]; then
            log_test "fail" "Timeout waiting for tenant registration status to change to 'deleted'"
            break
        fi

        sleep 5
    done
else
    log_test "fail" "Failed to delete tenant registration"
fi

# Set the exit code based on the overall test status
if [ "$TEST_PASSED" = true ]; then
    exit 0
else
    exit 1
fi
