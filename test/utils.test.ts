// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { App, Stack } from 'aws-cdk-lib';
import { addTemplateTag } from '../src/utils';
const app = new App();
const telemetryConst = 'sbt-aws (uksb-1tupboc57)';

describe('addTemplateTag', () => {
  it('should append telemetry and tags to existing template description', () => {
    const stackA = new Stack(app, 'TestStackA', { description: 'test' });
    const newTag = 'new-tag';
    const expectedDescription = `test - ${telemetryConst} (tag: new-tag)`;
    addTemplateTag(stackA, newTag);
    expect(stackA.templateOptions.description).toBe(expectedDescription);
  });

  it('should append a new tag to the description if it does not have any tags', () => {
    const stackB = new Stack(app, 'TestStackB');
    const newTag = 'new-tag';
    const expectedDescription = `${telemetryConst} (tag: new-tag)`;
    addTemplateTag(stackB, newTag);
    expect(stackB.templateOptions.description).toBe(expectedDescription);
  });

  it('should append a new tag to the existing tags in the description', () => {
    const existingDescription = `This is a sample description - ${telemetryConst} (tag: tag1, tag2)`;
    const stackC = new Stack(app, 'TestStackC', { description: existingDescription });
    const newTag = 'new-tag';
    const expectedDescription = `This is a sample description - ${telemetryConst} (tag: tag1, tag2, new-tag)`;
    addTemplateTag(stackC, newTag);
    expect(stackC.templateOptions.description).toBe(expectedDescription);
  });

  it('should not append a new tag if it already exists in the description', () => {
    const existingDescription = `This is a sample description - ${telemetryConst} (tag: tag1, tag2, new-tag)`;
    const stackD = new Stack(app, 'TestStackD', { description: existingDescription });
    const newTag = 'new-tag';
    const expectedDescription = `This is a sample description - ${telemetryConst} (tag: tag1, tag2, new-tag)`;
    addTemplateTag(stackD, newTag);
    expect(stackD.templateOptions.description).toBe(expectedDescription);
  });
});
