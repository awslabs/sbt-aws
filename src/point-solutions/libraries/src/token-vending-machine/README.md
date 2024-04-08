# Token Vending Machine Library

The Token Vending Machine library offers a solution for dynamically assuming an ABAC role and obtaining tenant-scoped credentials. It conceals the intricacies of managing and generating these scoped credentials. By utilizing these scoped credentials, tenant isolation is enforced when accessing tenant-specific resources.

Jump To:
[API Reference](../../API.md)

## How to use it

```ts
/**
 * While you are provisioning your compute infrastructure,
 * set environment variables as shown below.
 * These will be used by TokenVendingMachine library
*/

/**
 * Sample identity provider details.
 * TokenVendingMachine library expects the identity provider details
 * in the below format i.e., with issuer and audience
*/
const idpDetails = {
  issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/`,
  audience: userPoolAppClientId,
};

/**
 * Sample abac role policy
*/
const abacRolePolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/product-table",
            "Condition": {
                "ForAllValues:StringEquals": {
                    "dynamodb:LeadingKeys": [
                        "${aws:PrincipalTag/TenantId}"
                    ]
                }
            }
        }
    ]
}


/**
 * Sample json web token with tenantId custom attribute
*/
const inputJsonWebToken = {
    ....
    "custom:tenantId":"12345"
    ....
}

/**
 * Need to set this IDP_DETAILS environment variable
 * if you want TokenVendingMachine library to validate the json web token
*/
process.env.IDP_DETAILS = JSON.stringify(idpDetails);

/**
 * Set this IAM_ROLE_ARN environment variable
 * with the abac iam role which needs to be assumed
*/
process.env.IAM_ROLE_ARN = /* For example, set ARN of role which has above abacRolePolicy*/

/**
 * Set this REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES environment variable
 * with mapping of variable name used in abacRolePolicy "TenantId"
 * to the attribute name("custom:tenantId") in the
 * inputJsonWebToken which has TenantId value as shown below
*/
process.env.REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES: '{"TenantId":"custom:tenantId"}';


/**
 * Below is the example of how you can use TokenVendingMachine
 *
 */
import { TokenVendingMachine } from "@sbt/sbt-point-solutions-lib";

export class MyClass {

  public hello() {
    const tvm: TokenVendingMachine = new TokenVendingMachine(true);

    tvm
      .assumeRole(inputJsonWebToken, 900)
      .then(async (creds: string) => {
        console.log(creds);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
```
