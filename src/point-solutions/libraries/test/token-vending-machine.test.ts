// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
