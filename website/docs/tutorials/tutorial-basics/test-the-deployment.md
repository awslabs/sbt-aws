---
sidebar_position: 8
---

# Testing the deployment

Once deployed, let's run a few tests to see our basic control plane and application plane in action. When you deployed the control plane, you should've received an email with temporary admin credentials. Let's use those credentials now to log in to that account. Please replace the placeholder ('INSERT PASSWORD HERE') with your temporary password in the script below. Once logged in, this script will onboard a new tenant, and retrieve its details. Note this script uses the jq JSON processor.

```bash
PASSWORD='INSERT PASSWORD HERE'
# Change this to a real email if you'd like to log into the tenant
TENANT_EMAIL="tenant@example.com"
CONTROL_PLANE_STACK_NAME="ControlPlaneStack"
TENANT_NAME="tenant$RANDOM"

CLIENT_ID=$(aws cloudformation describe-stacks \
  --stack-name "$CONTROL_PLANE_STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpClientId'].OutputValue" \
  --output text)

USER_POOL_ID=$(aws cloudformation describe-stacks \
  --stack-name "$CONTROL_PLANE_STACK_NAME" \
  --query "Stacks[0].Outputs[?OutputKey=='ControlPlaneIdpUserPoolId'].OutputValue" \
  --output text)

USER="admin"

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
  --auth-parameters "USERNAME='${USER}',PASSWORD='${PASSWORD}'" \
  --query 'AuthenticationResult')

ACCESS_TOKEN=$(echo "$AUTHENTICATION_RESULT" | jq -r '.AccessToken')

CONTROL_PLANE_API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$CONTROL_PLANE_STACK_NAME" \
    --query "Stacks[0].Outputs[?contains(OutputKey,'controlPlaneAPIEndpoint')].OutputValue" \
    --output text)

DATA=$(jq --null-input \
    --arg tenantName "$TENANT_NAME" \
    --arg tenantEmail "$TENANT_EMAIL" \
    '{
  "tenantName": $tenantName,
  "email": $tenantEmail,
  "tier": "basic",
  "tenantStatus": "In progress"
}')

echo "creating tenant..."
curl --request POST \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --header 'content-type: application/json' \
    --data "$DATA" | jq
echo "" # add newline

echo "retrieving tenants..."
curl --request GET \
    --url "${CONTROL_PLANE_API_ENDPOINT}tenants" \
    --header "Authorization: Bearer ${ACCESS_TOKEN}" \
    --silent | jq
```

Now that we've onboarded a tenant, let's take a look at the console to see what got deployed.

First, let's open the [DynamoDB console](https://console.aws.amazon.com/dynamodbv2/home#). Once open, click the Explore Items link on the left. On the "Tables" screen, select the table that starts with `ControlPlaneStack`. Notice there is an entry for the tenant we just onboarded. Also notice it's probably still "in progress"

Recall that we deployed a `ScriptJob` with our application plane, and it's a wrapper around an AWS Step Function that runs our provisioning script via CodeBuild. Let's take a look at that Step Function now by clicking navigating to Step Functions in the console (ensure you're in the same region you deployed to).

The Step Function is likely still running, but feel free to examine the execution. Once finished, it'll return the results back to EventBridge, and close the loop with the Control plane.
