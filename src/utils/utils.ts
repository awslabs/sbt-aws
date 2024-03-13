// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const setTemplateDesc = (construct: Construct, sbtDesc: string) => {
  const stackDesc = Stack.of(construct).templateOptions.description;
  let description = stackDesc === undefined ? sbtDesc : stackDesc + ' - ' + sbtDesc;
  Stack.of(construct).templateOptions.description = description;
};
