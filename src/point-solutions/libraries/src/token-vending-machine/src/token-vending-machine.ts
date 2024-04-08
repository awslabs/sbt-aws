// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import * as jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
/**
 * The Token Vending Machine library offers a solution for dynamically assuming an
 * ABAC role and obtaining tenant-scoped credentials. It conceals the intricacies
 * of managing and generating these scoped credentials. By utilizing these scoped credentials,
 * tenant isolation is enforced when accessing tenant-specific resources.
 */
export class TokenVendingMachine {
  private sts: STSClient;

  constructor(private shouldValidateToken: boolean = false) {
    this.sts = new STSClient();
  }

  private async validateJwt(
    jwtToken: string,
    idpDetails: string,
  ): Promise<boolean> {
    const idpDetailsJson = JSON.parse(idpDetails);
    const issuer = idpDetailsJson.issuer;
    const audience = idpDetailsJson.audience;

    const client = new JwksClient({
      jwksUri: `${issuer}.well-known/jwks.json`,
    });

    const decodedToken = jwt.decode(jwtToken, { complete: true });
    if (!decodedToken) {
      console.error("Decoding token has failed");
      return false;
    }

    const kid = decodedToken.header.kid;
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    try {
      jwt.verify(jwtToken, signingKey, {
        algorithms: ["RS256"],
        issuer: issuer,
        audience: audience,
      });
      return true;
    } catch (error: any) {
      console.error("JWT validation error:", error);
      return false;
    }
  }

  private async getTemporaryCredentails(
    roleArn: string,
    requestTagKeysMappingAttributes: any,
    decodedToken: any,
    ttl: number,
  ): Promise<string> {
    try {
      const requestTagKeyValueArray = this.createRequestTagKeyValueArray(
        requestTagKeysMappingAttributes,
        decodedToken,
      );

      const command = new AssumeRoleCommand({
        RoleArn: roleArn,
        RoleSessionName: "AssumeRoleSession",
        DurationSeconds: ttl,
        Tags: requestTagKeyValueArray,
      });

      const response = await this.sts.send(command);
      if (!response.Credentials) {
        throw new Error("Temporary credentials not found");
      }
      const creds: string = JSON.stringify(response.Credentials);

      return creds;
    } catch (error: any) {
      console.error(
        `Error getting temporary credentials for role ${roleArn}:`,
        error,
      );
      throw error;
    }
  }

  private createRequestTagKeyValueArray(
    requestTagKeysMappingAttributes: any,
    decodedToken: any,
  ): any {
    const requestTagKeyValueArray: { Key: string; Value: string }[] = [];

    for (const key in requestTagKeysMappingAttributes) {
      const value = requestTagKeysMappingAttributes[key];
      requestTagKeyValueArray.push({ Key: key, Value: decodedToken[value] });
    }
    return requestTagKeyValueArray;
  }
  /**
   * This method is used to dynamically assume an ABAC role
   * which is provided through environment variables
   * and obtain temporary tenant-scoped credentials.It takes in a json web token and a time to live (ttl) in seconds as input.
   * If isValidateToken is set to true, the method will validate the input json web token against identity provider details provided through environment variables.
   * It returns a json string containing the temporary tenant-scoped credentials.
   * {
   *   "AccessKeyId": "...",
   *   "SecretAccessKey": "...",
   *   "SessionToken": "...",
   *   "Expiration": "..."
   * }
   *
   * @param jwtToken - Input json web token with custom attributes
   * @param ttl - Time to live in seconds for the scoped credentials
   * @returns - {
   *              "AccessKeyId": "...",
   *              "SecretAccessKey": "...",
   *              "SessionToken": "...",
   *              "Expiration": "..."
   *            }
   */
  public async assumeRole(jwtToken: string, ttl: number): Promise<string> {
    try {
      if (this.shouldValidateToken === true) {
        const idpDetails = process.env.IDP_DETAILS;
        if (!idpDetails) {
          throw new Error("IDP_DETAILS environment variable is not set");
        }
        const isValid: boolean = await this.validateJwt(jwtToken, idpDetails);
        if (isValid !== true) {
          throw new Error("Invalid JWT token");
        }
      }

      const roleArn = process.env.IAM_ROLE_ARN;
      if (!roleArn) {
        throw new Error("IAM_ROLE_ARN environment variable is not set");
      }

      if (!process.env.REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES) {
        throw new Error("REQUEST_TAG_KEYS environment variable is not set");
      }

      const requestTagKeysMappingAttributes = JSON.parse(
        process.env.REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES,
      );

      const decodedToken = jwt.decode(jwtToken);
      if (!decodedToken) {
        console.error("Decoding token has failed");
        throw new Error("Decoding token has failed");
      }

      return await this.getTemporaryCredentails(
        roleArn,
        requestTagKeysMappingAttributes,
        decodedToken,
        ttl,
      );
    } catch (error: any) {
      console.error(`Error occured:`, error);
      throw error;
    }
  }
}
