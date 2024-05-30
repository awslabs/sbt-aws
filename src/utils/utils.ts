// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export const addTemplateTag = (construct: Construct, tag: string) => {
  const stackDesc = Stack.of(construct).templateOptions.description;
  const baseTelemetry = 'sbt-aws (uksb-1tupboc57)';
  let description = stackDesc;
  // There is no description, just make it telemetry + tags
  if (stackDesc === undefined) {
    description = appendTagToDescription(baseTelemetry, tag);
  }
  // There is a description, and it doesn't contain telemetry. We need to append telemetry + tags to it
  else if (!stackDesc.includes(baseTelemetry)) {
    description = appendTagToDescription(`${stackDesc} - ${baseTelemetry}`, tag);
  }
  // There is a telemetry description already
  else {
    description = appendTagToDescription(stackDesc, tag);
  }
  Stack.of(construct).templateOptions.description = description;
};

const appendTagToDescription = (existingDescription: string, newTag: string): string => {
  // Check if the existing description already has tags
  if (existingDescription.includes('(tag:')) {
    // Extract the existing tags
    const startIndex = existingDescription.indexOf('(tag:') + 6;
    const endIndex = existingDescription.lastIndexOf(')');
    const existingTags = existingDescription.substring(startIndex, endIndex).split(', ');

    // Check if the new tag already exists
    if (!existingTags.includes(newTag)) {
      // Append the new tag to the existing tags
      existingTags.push(newTag);
      const newDescription = `${existingDescription.substring(0, startIndex)}${existingTags.join(', ')})`;
      return newDescription;
    } else {
      // The new tag already exists, return the original description
      return existingDescription;
    }
  } else {
    // Append the new tag to the description
    return `${existingDescription} (tag: ${newTag})`;
  }
};
