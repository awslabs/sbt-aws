#!/bin/bash
# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

set -e

# Config values
CONFIG_FILE="${HOME}/.sbt-aws-config"

# Functions
help() {
  echo "Usage: $0 [--debug] <operation> [additional args]"
  echo "Operations:"
  echo "  configure <control_plane_stack> <email_user> <email_domain>"
  echo "  refresh-tokens"
  echo "  create-tenant"
  echo "  get-tenant <tenant_id>"
  echo "  get-all-tenants"
  echo "  delete-tenant <tenant_id>"
  echo "  update-tenant <tenant_id> <key> <value>"
  echo "  create-user"
  echo "  get-user <user_name>"
  echo "  delete-user <user_name>"
  echo "  help"
}

generate_credentials() {
  if $DEBUG; then
    echo "Generating credentials..."
  fi

  USER="admin"
  PASSWORD="$1"
  CONTROL_PLANE_STACK_NAME="$2"

  CONTROL_PLANE_IDP_DETAILS=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpDetails'].OutputValue" \
    --output text)
  CLIENT_ID=$(echo "$CONTROL_PLANE_IDP_DETAILS" | jq -r '.idp.clientId')
  USER_POOL_ID=$(echo "$CONTROL_PLANE_IDP_DETAILS" | jq -r '.idp.userPoolId')

  if $DEBUG; then
    echo "CLIENT_ID: $CLIENT_ID"
    echo "USER_POOL_ID: $USER_POOL_ID"
    echo "USER: $USER"
  fi

  # required in order to initiate-auth
  aws cognito-idp update-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-id "$CLIENT_ID" \
    --explicit-auth-flows USER_PASSWORD_AUTH \
    --output text >/dev/null

  if $DEBUG; then
    echo "Updated user pool client for USER_PASSWORD_AUTH"
  fi

  # remove need for password reset
  aws cognito-idp admin-set-user-password \
    --user-pool-id "$USER_POOL_ID" \
    --username "$USER" \
    --password "$PASSWORD" \
    --permanent \
    --output text >/dev/null

  if $DEBUG; then
    echo "Set user password for $USER"
  fi

  # get credentials for user
  AUTHENTICATION_RESULT=$(aws cognito-idp initiate-auth \
    --auth-flow USER_PASSWORD_AUTH \
    --client-id "${CLIENT_ID}" \
    --auth-parameters "USERNAME='${USER}',PASSWORD='${PASSWORD}'" \
    --query 'AuthenticationResult')

  ACCESS_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.AccessToken')
  ID_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.IdToken')

  if $DEBUG; then
    echo "ACCESS_TOKEN: $ACCESS_TOKEN"
    echo "ID_TOKEN: $ID_TOKEN"
  fi

  export ACCESS_TOKEN
  export ID_TOKEN
}

configure() {
  CONTROL_PLANE_STACK_NAME="$1"
  EMAIL_USERNAME="$2"
  EMAIL_DOMAIN="$3"

  if $DEBUG; then
    echo "Configuring with:"
    echo "CONTROL_PLANE_STACK_NAME: $CONTROL_PLANE_STACK_NAME"
    echo "EMAIL_USERNAME: $EMAIL_USERNAME"
    echo "EMAIL_DOMAIN: $EMAIL_DOMAIN"
  fi

  read -r -s -p "Enter admin password: " ADMIN_USER_PASSWORD
  echo

  generate_credentials "$ADMIN_USER_PASSWORD" "$CONTROL_PLANE_STACK_NAME"
  CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

  if $DEBUG; then
    echo "CONTROL_PLANE_API_ENDPOINT: $CONTROL_PLANE_API_ENDPOINT"
  fi

  printf "CONTROL_PLANE_STACK_NAME=%s\nCONTROL_PLANE_API_ENDPOINT=%s\nADMIN_USER_PASSWORD=\'%s\'\nEMAIL_USERNAME=%s\nEMAIL_DOMAIN=%s\nACCESS_TOKEN=%s\nID_TOKEN=%s\n" \
    "$CONTROL_PLANE_STACK_NAME" "$CONTROL_PLANE_API_ENDPOINT" "$ADMIN_USER_PASSWORD" "$EMAIL_USERNAME" "$EMAIL_DOMAIN" "$ACCESS_TOKEN" "$ID_TOKEN" > "$CONFIG_FILE"

  if $DEBUG; then
    echo "Configuration saved to $CONFIG_FILE"
  fi
}

refresh_tokens() {
  source_config

  if $DEBUG; then
    echo "Refreshing tokens..."
  fi

  generate_credentials "$ADMIN_USER_PASSWORD"
  CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

  printf "CONTROL_PLANE_STACK_NAME=%s\nCONTROL_PLANE_API_ENDPOINT=%s\nADMIN_USER_PASSWORD=\'%s\'\nEMAIL_USERNAME=%s\nEMAIL_DOMAIN=%s\nACCESS_TOKEN=%s\nID_TOKEN=%s\n" \
    "$CONTROL_PLANE_STACK_NAME" "$CONTROL_PLANE_API_ENDPOINT" "$ADMIN_USER_PASSWORD" "$EMAIL_USERNAME" "$EMAIL_DOMAIN" "$ACCESS_TOKEN" "$ID_TOKEN" >"$CONFIG_FILE"

  if $DEBUG; then
    echo "Tokens refreshed and saved to $CONFIG_FILE"
  fi
}

source_config() {
  source "$CONFIG_FILE"
}

create_tenant() {
  source_config
  TENANT_NAME="tenant$RANDOM"
  TENANT_EMAIL="${EMAIL_USERNAME}+${TENANT_NAME}@${EMAIL_DOMAIN}"

  if $DEBUG; then
    echo "Creating tenant with:"
    echo "TENANT_NAME: $TENANT_NAME"
    echo "TENANT_EMAIL: $TENANT_EMAIL"
  fi

  DATA=$(jq --null-input \
    --arg tenantName "$TENANT_NAME" \
    --arg tenantEmail "$TENANT_EMAIL" \
    '{
      "tenantName": $tenantName,
      "email": $tenantEmail,
      "tier": "basic",
      "tenantStatus": "In progress",
      "prices": [
        {
          "id": "price_123456789Example",
          "metricName": "productsSold"
        },
        {
          "id": "price_123456789AnotherExample",
          "metricName": "plusProductsSold"
        }
      ]
    }')

  RESPONSE=$(curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ID_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

get_tenant() {
  source_config
  TENANT_ID="$1"

  if $DEBUG; then
    echo "Getting tenant with ID: $TENANT_ID"
  fi

  RESPONSE=$(curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants/$TENANT_ID" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

get_all_tenants() {
  source_config

  if $DEBUG; then
    echo "Getting all tenants"
  fi

  RESPONSE=$(curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

delete_tenant() {
  source_config
  TENANT_ID="$1"

  if $DEBUG; then
    echo "Deleting tenant with ID: $TENANT_ID"
  fi

  RESPONSE=$(curl --request DELETE \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants/$TENANT_ID" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --header 'content-type: application/json' \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

create_user() {
  source_config
  USER_NAME="user$RANDOM"
  USER_EMAIL="${EMAIL_USERNAME}+${USER_NAME}@${EMAIL_DOMAIN}"

  if $DEBUG; then
    echo "Creating user with:"
    echo "USER_NAME: $USER_NAME"
    echo "USER_EMAIL: $USER_EMAIL"
  fi

  DATA=$(jq --null-input \
    --arg userName "$USER_NAME" \
    --arg email "$USER_EMAIL" \
    '{
      "userName": $userName,
      "email": $email,
      "userRole": "basicUser"
    }')

  RESPONSE=$(curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}users" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --header 'content-type: application/json' \
    --data "$DATA" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

get_user() {
  source_config
  USER_NAME="$1"

  if $DEBUG; then
    echo "Getting user with name: $USER_NAME"
  fi

  RESPONSE=$(curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}users/$USER_NAME" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

delete_user() {
  source_config
  USER_NAME="$1"

  if $DEBUG; then
    echo "Deleting user with name: $USER_NAME"
  fi

  RESPONSE=$(curl --request DELETE \
    --url "${CONTROL_PLANE_API_ENDPOINT}users/$USER_NAME" \
    --header "Authorization: Bearer $ID_TOKEN" \
    --silent)

  if $DEBUG; then
    echo "Response: $RESPONSE"
  else
    echo "$RESPONSE"
  fi
}

update_tenant() {
  echo "PUT ${CONTROL_PLANE_API_ENDPOINT}tenants/$TENANT_ID only supports AWS_IAM auth"
  # source_config
  # TENANT_ID="$1"
  # KEY="$2"
  # VALUE="$3"

  # DATA=$(jq --null-input \
  #   --arg key "$KEY" \
  #   --arg value "$VALUE" \
  #   '{($key): $value}')

  # curl --request PUT \
  #   --url "${CONTROL_PLANE_API_ENDPOINT}tenants/$TENANT_ID" \
  #   --header "Authorization: Bearer $ID_TOKEN" \
  #   --header 'content-type: application/json' \
  #   --data "$DATA" \
  #   --silent
}

# Main
DEBUG=false
if [ "$1" = "--debug" ]; then
  DEBUG=true
  shift
fi

if [ $# -eq 0 ]; then
  help
  exit 1
fi

case "$1" in
"configure")
  shift
  configure "$@"
  ;;

"refresh-tokens")
  refresh_tokens
  ;;

"create-tenant")
  create_tenant
  ;;

"get-tenant")
  if [ $# -ne 2 ]; then
    echo "Error: delete-tenant requires tenant id"
    exit 1
  fi
  get_tenant "$2"
  ;;

"get-all-tenants")
  get_all_tenants
  ;;

"delete-tenant")
  if [ $# -ne 2 ]; then
    echo "Error: delete-tenant requires tenant id"
    exit 1
  fi
  delete_tenant "$2"
  ;;

"update-tenant")
  if [ $# -ne 4 ]; then
    echo "Error: update-tenant requires tenant id, key, and value"
    exit 1
  fi
  update_tenant "$2" "$3" "$4"
  ;;

"create-user")
  create_user
  ;;

"get-user")
  if [ $# -ne 2 ]; then
    echo "Error: get-user requires user name"
    exit 1
  fi
  get_user "$2"
  ;;

"delete-user")
  if [ $# -ne 2 ]; then
    echo "Error: delete-user requires user name"
    exit 1
  fi
  delete_user "$2"
  ;;

"help")
  help
  ;;

*)
  echo "Invalid operation: $1"
  help
  exit 1
  ;;
esac
