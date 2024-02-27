#!/bin/bash -e
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# This is a helper script to run basic queries against the control plane.
# usage:
# run-basic-queries.sh <control plane stack name> <admin user password> <email username> <email domain>

CONTROL_PLANE_STACK_NAME="$1"
ADMIN_USER_PASSWORD="$2"
EMAIL_USERNAME="$3"
EMAIL_DOMAIN="$4"

source scripts/generate-credentials.sh "$ADMIN_USER_PASSWORD"

CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

# generate data to use in new tenant request
TENANT_NAME="tenant$RANDOM"
TENANT_ID="$RANDOM"
TENANT_EMAIL="${EMAIL_USERNAME}+${TENANT_NAME}@${EMAIL_DOMAIN}"
DATA=$(jq --null-input \
    --arg tenantName "$TENANT_NAME" \
    --arg tenantEmail "$TENANT_EMAIL" \
    --arg tenantId "$TENANT_ID" \
    '{
  "tenantName": $tenantName,
  "email": $tenantEmail,
  "tier": "basic",
  "tenantId": $tenantId,
  "tenantStatus": "In progress"
}')

echo "creating tenant..."
curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA"
echo "" # add newline

echo "retrieving tenant..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants/${TENANT_ID}" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

echo "retrieving ALL tenants..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

echo "deleting tenant..."
curl --request DELETE \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants/${TENANT_ID}" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA" \
    --silent | jq

echo "retrieving ALL tenants..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

# generate data to use in new user request
USER_NAME="user$RANDOM"
USER_EMAIL="${EMAIL_USERNAME}+${USER_NAME}@${EMAIL_DOMAIN}"
DATA=$(jq --null-input \
    --arg userName "$USER_NAME" \
    --arg email "$USER_EMAIL" \
    '{
  "userName": $userName,
  "email": $email,
  "userRole": "basicUser"
}')

echo "creating user..."
curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}users" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA"
echo "" # add newline

echo "retrieving user..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}users/${USER_NAME}" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

echo "retrieving ALL users..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}users" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

echo "deleting user..."
curl --request DELETE \
    --url "${CONTROL_PLANE_API_ENDPOINT}users/${USER_NAME}" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq

echo "retrieving ALL users..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}users" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --silent | jq
