// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as path from 'path';
import { PythonLayerVersion } from '@aws-cdk/aws-lambda-python-alpha';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class LambdaLayers extends Construct {
  controlPlaneLambdaLayer: LayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    const lambdaLayer = new PythonLayerVersion(this, 'controlPlaneLambdaLayer', {
      entry: path.join(__dirname, '../../resources/layers'),
      compatibleRuntimes: [Runtime.PYTHON_3_12],
    });

    this.controlPlaneLambdaLayer = lambdaLayer;
  }
}
