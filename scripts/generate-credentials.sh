#!/bin/bash -xe
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# This is a helper script to generate credentials for the control plane.
# It assumes the export 'ControlPlaneIdpDetails' is available.
# usage:
# generate-credentials.sh <password>

CLIENT_ID=$(aws cloudformation list-exports --query "Exports[?Name=='ControlPlaneIdpDetails'].Value" | jq -r '.[0]' | jq -r '.idp.clientId')
USER_POOL_ID=$(aws cloudformation list-exports --query "Exports[?Name=='ControlPlaneIdpDetails'].Value" | jq -r '.[0]' | jq -r '.idp.userPoolId')
USER="admin"
PASSWORD="$1"

# required in order to initiate-auth
aws cognito-idp update-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --explicit-auth-flows USER_PASSWORD_AUTH

# remove need for password reset
aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$USER" \
    --password "$PASSWORD" \
    --permanent

# get credentials for user
AUTHENTICATION_RESULT=$(aws cognito-idp initiate-auth \
    --auth-flow USER_PASSWORD_AUTH \
    --client-id "${CLIENT_ID}" \
    --auth-parameters "USERNAME=${USER},PASSWORD=${PASSWORD}" \
    --query 'AuthenticationResult')

ACCESS_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.AccessToken')
ID_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.IdToken')

echo "ACCESS-Token:"
echo "$ACCESS_TOKEN"

echo "ID-Token:"
echo "$ID_TOKEN"

export ACCESS_TOKEN
export ID_TOKEN
