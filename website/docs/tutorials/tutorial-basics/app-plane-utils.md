---
sidebar_position: 5
---

# Application plane utilities

Although entirely optional, SBT includes a utility that lets you define, and run arbitrary jobs upon receipt of a control plane message, called a `ScriptJob`. This mechanism is extended to produce two new helper constructs `ProvisioningScriptJob` and `DeprovisioningScriptJob` which are used for onboarding and off-boarding, respectively, in the reference architectures which were ported to SBT (see references at the end of this document). That tenant provisioning/deprovisioning process is depicted below:

![sbt-provisioning.png](/img/sbt-provisioning.png)

Notice the use of the `provisioning.sh` and `deprovisioning.sh` scripts at the top. These scripts are fed to the `ProvisioningScriptJob` and `DeprovisioningScriptJob` as parameters. Internally the `ScriptJob` launches an AWS `CodeBuild` project, wrapped inside an AWS Step Function, to execute the bash scripts. The `ScriptJob` also lets you specify what input variables to feed to the scripts, along with what output variables you expect them to return. Note that in this version of SBT, you can create the `ScriptJob` construct with `ScriptJobProps` and configure `CoreAppPlane` with `ScriptJobs` using its `scriptJobs` property. The `CoreAppPlane` will then link these `ScriptJobs` to EventBridge. Let's take a simple example: imagine our SaaS application deployed only a single S3 bucket per tenant. Let's create a `ProvisioningScriptJob` for that provisioning now:

```typescript
const scriptJobProps: TenantLifecycleScriptJobProps = {
  permissions: PolicyDocument.fromJson(/*See below*/),
  script: '' /*See below*/,
  environmentStringVariablesFromIncomingEvent: ['tenantId', 'tier'],
  environmentVariablesToOutgoingEvent: ['tenantS3Bucket', 'someOtherVariable', 'tenantConfig'],
  scriptEnvironmentVariables: {
    TEST: 'test',
  },
  eventManager: eventManager /*See below on how to create EventManager*/,
};
```

| Key                                             | Type                                                                                                  | Purpose                                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **script**                                      | string                                                                                                | A string in bash script format that represents the job to be run (example below)                                   |
| **permissions**                                 | [PolicyDocument](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam.PolicyDocument.html) | An IAM policy document giving this job the IAM permissions it needs to do what it's being asked to do              |
| **environmentStringVariablesFromIncomingEvent** | string[]                                                                                              | The environment variables to import into the ScriptJob from event details field.                                   |
| **environmentVariablesToOutgoingEvent**         | string[]                                                                                              | The environment variables to export into the outgoing event once the ScriptJob has finished.                       |
| **scriptEnvironmentVariables**                  | `{ [key: string]: string }`                                                                           | The variables to pass into the codebuild ScriptJob.                                                                |
| **eventManager**                                | [IEventManager](https://github.com/awslabs/sbt-aws/blob/main/API.md#eventmanager-)                    | The EventManager instance that allows connecting to events flowing between the Control Plane and other components. |

The heavy lifting of the `ScriptJob` construct (along with constructs that extend it like `ProvisioningScriptJob`) happens with the value of the script key. Let's take a look at the example provisioning script now:

```typescript
echo "starting..."

# note that this template.json is being created here, but
# it could just as easily be pulled in from an S3 bucket.
cat > template.json << EOM
{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {"MyBucket": {"Type": "AWS::S3::Bucket"}},
  "Outputs": {"S3Bucket": {"Value": { "Ref": "MyBucket" }}}
}
EOM

echo "tenantId: $tenantId"
echo "tier: $tier"

aws cloudformation create-stack --stack-name "tenantTemplateStack-\${tenantId}"  --template-body "file://template.json"

aws cloudformation wait stack-create-complete --stack-name "tenantTemplateStack-\${tenantId}"

export tenantS3Bucket=$(aws cloudformation describe-stacks --stack-name "tenantTemplateStack-\${tenantId}" | jq -r '.Stacks[0].Outputs[0].OutputValue')
export someOtherVariable="this is a test"
echo $tenantS3Bucket
export tenantConfig=$(jq --arg SAAS_APP_USERPOOL_ID "MY_SAAS_APP_USERPOOL_ID" \
--arg SAAS_APP_CLIENT_ID "MY_SAAS_APP_CLIENT_ID" \
--arg API_GATEWAY_URL "MY_API_GATEWAY_URL" \
-n '{"userPoolId":$SAAS_APP_USERPOOL_ID,"appClientId":$SAAS_APP_CLIENT_ID,"apiGatewayUrl":$API_GATEWAY_URL}')

echo $tenantConfig
export tenantStatus="created"

echo "done!"
```