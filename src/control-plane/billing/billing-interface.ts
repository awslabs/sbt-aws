// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IDataIngestorAggregator } from '../ingestor-aggregator/ingestor-aggregator-interface';

export interface IBilling {
  webhookPath: string;
  createUserFunction: IFunction;
  deleteUserFunction: IFunction;
  ingestor: IDataIngestorAggregator;
  putUsageFunction: IFunction;
  webhookFunction?: IFunction;
}
