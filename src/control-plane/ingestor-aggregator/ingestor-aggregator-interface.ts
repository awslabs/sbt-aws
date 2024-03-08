// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';

/**
 * Encapsulates the list of properties for a IDataIngestorAggregator.
 */
export interface IDataIngestorAggregator {
  /**
   * The table containing the aggregated data.
   */
  readonly dataRepository: dynamodb.ITable;

  /**
   * The function responsible for aggregating the raw data coming in
   * via the dataIngestor.
   */
  readonly dataAggregator: lambda.IFunction;

  /**
   * The ingestor responsible for accepting and storing the incoming data.
   */
  readonly dataIngestorName: string;
}
