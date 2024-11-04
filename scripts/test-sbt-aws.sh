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

# Test deleting a non-existent tenant registration
echo "Testing delete-tenant for non-existent tenant registration..."
fake_tenant_registration_id=$(openssl rand -hex 10)
delete_output=$(./sbt-aws.sh delete-tenant-registration "$fake_tenant_registration_id" 2>&1)
delete_response=$(echo "$delete_output" | jq -r '.')

if [ "$(echo "$delete_response" | jq -r '.message')" = "Tenant registration not found." ]; then
    log_test "pass" "Received expected error when deleting non-existent tenant"
else
    log_test "fail" "Unexpected output when deleting non-existent tenant"
fi


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

# Test create-user
echo "Testing create-user..."
user_id=$(./sbt-aws.sh create-user | jq -r '.data.userName')
if [ -n "$user_id" ] && [ "$user_id" != "null" ]; then
    log_test "pass" "User created successfully with ID: $user_id"
else
    log_test "fail" "Failed to create user"
fi

# Test get-all-users
echo "Testing get-all-users..."
users=$(./sbt-aws.sh get-all-users 30)
if echo "$users" | grep -q "$user_id"; then
    log_test "pass" "User found in get-all-users"
else
    log_test "fail" "User not found in get-all-users"
fi

# Test get-user
echo "Testing get-user..."
user_details=$(./sbt-aws.sh get-user "$user_id")
if [ -n "$user_details" ]; then
    log_test "pass" "User details retrieved successfully"
else
    log_test "fail" "Failed to retrieve user details"
fi

# Test update-user
new_user_role="advancedUser"
new_user_email="newemail@example.com"
./sbt-aws.sh update-user "$user_id" "$new_user_role" "$new_user_email" >/dev/null
if [ $? -eq 0 ]; then
    log_test "pass" "User update initiated successfully"

    # Get the updated user details
    updated_user_details=$(./sbt-aws.sh get-user "$user_id")
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
./sbt-aws.sh delete-user "$user_id" >/dev/null
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
