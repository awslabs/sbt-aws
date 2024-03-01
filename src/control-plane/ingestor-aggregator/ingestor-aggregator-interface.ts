// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

// todo: come up with a better name
export interface IDataIngestorAggregator {
  readonly dataRepository: dynamodb.Table;
  readonly dataAggregator: lambda.IFunction;
  readonly dataIngestorName: string;
}
