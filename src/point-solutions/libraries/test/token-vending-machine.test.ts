/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as jwt from "jsonwebtoken";
import { TokenVendingMachine } from "../src/token-vending-machine/src";

jest.mock("jsonwebtoken");

describe("TokenVendingMachine", () => {
  it("should return a valid response", async () => {
    const tvm: TokenVendingMachine = new TokenVendingMachine(true);
    process.env.IDP_DETAILS = "test";
    process.env.IAM_ROLE_ARN = "test";
    process.env.REQUEST_TAG_KEYS_MAPPING_ATTRIBUTES = JSON.stringify({
      test: "test",
    });

    const validateJwtMock = jest.spyOn(tvm as any, "validateJwt");

    validateJwtMock.mockReturnValue(true);

    const getTemporaryCredentailsMock = jest.spyOn(
      tvm as any,
      "getTemporaryCredentails",
    );
    getTemporaryCredentailsMock.mockReturnValue({
      accessKeyId: "test",
      secretAccessKey: "test",
      sessionToken: "test",
      expiration: new Date(),
    });

    const jwtMock = jwt as jest.Mocked<typeof jwt>;
    jwtMock.decode.mockReturnValue({ test: "test" });

    const response = await tvm.assumeRole("", 360);
    expect(validateJwtMock).toHaveBeenCalled();
    expect(getTemporaryCredentailsMock).toHaveBeenCalled();
    expect(response).toEqual(expect.objectContaining({ accessKeyId: "test" }));
  });
});
