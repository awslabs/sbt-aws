---
sidebar_position: 6
---

# Provisioning script breakdown

Let's break this script down section by section.

## CloudFormation template

Notice the first few lines contains a sample AWS CloudFormation template that contains our S3 Bucket.

```bash
# note that this template.json is being created here, but
# it could just as easily be pulled in from an S3 bucket.
cat > template.json << EOM
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {"MyBucket": {"Type": "AWS::S3::Bucket"}},
  "Outputs": {"S3Bucket": {"Value": { "Ref": "MyBucket" }}}
}
EOM
```

In this case we're declaring it inline with the script, but as the comment points out, there's no reason this template couldn't live in an S3 bucket, or any other place supported by the CloudFormation SDK.

Next we're echoing the value of the tenantId and tier environment variables below the CloudFormation template.

## Imported variables('environmentStringVariablesFromIncomingEvent')

```bash
echo "tenantId: $tenantId"
echo "tier: $tier"
```

Let's examine how exactly those variables get populated. Remember that the `ScriptJob` (which is used to extend the ProvisioningScriptJob construct) creates an AWS CodeBuild project internally. When the `ScriptJob` creates the CodeBuild project, it can specify what environment variables to provide. The `ScriptJob` utility is also triggered by an EventBridge message matching the criteria specified in the incomingEvent parameter of the `ScriptJobProps`. (You don't need to worry about doing that for `ProvisioningScriptJob` and `DeprovisioningScriptJob` because that is already configured.) The message that arrives via EventBridge has a detail JSON Object (see docs here) that carries with it contextual information included by the sender, in our case, the control plane. For each key in the `environmentStringVariablesFromIncomingEvent` object, the `ScriptJob` extracts the value of a matching key found in the EventBridge message's detail JSON object, and provides that value to the CodeBuild project as an environment variable.

So, take for example, this sample EventBridge provisioning message sent by a control plane:

```json
{
  "version": "0",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "onboardingRequest",
  "source": "controlPlaneEventSource",
  "account": "111122223333",
  "time": "2017-12-22T18:43:48Z",
  "region": "us-west-1",
  "resources": ["arn:aws:ec2:us-west-1:123456789012:instance/i-1234567890abcdef0"],
  "detail": {
    "tenantId": "e6878e03-ae2c-43ed-a863-08314487318b",
    "tier": "standard"
  }
}
```

When executing, the script cited above would echo both tenantId and tier with the values set according to this message.

## Deploy tenant CloudFormation artifacts

Next, we're deploying tenant infrastructure by way of the CloudFormation template we saw above.

```bash
aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"
```

## Exported variables ('environmentVariablesToOutgoingEvent')

The final portion of the script exports environment variables containing information to return to the control plane via the outgoing EventBridge message.

```bash
export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket
export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')
echo $tenantConfig
export tenantStatus="created"
```

Similar to how it mapped incoming EventBridge message detail variables to environment variables, the `ScriptJob` does almost the same thing but in reverse. The variables specified in the `environmentVariablesToOutgoingEvent` section of `ScriptJobProps` will be extracted from the environment, and sent back in the EventBridge message's detail section.
