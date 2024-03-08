// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IDataIngestorAggregator } from '../ingestor-aggregator/ingestor-aggregator-interface';

/**
 * Encapsulates the list of properties for an IBilling construct.
 */
export interface IBilling {
  /**
   * The function to trigger when creating a new billing user.
   */
  createUserFunction: IFunction;

  /**
   * The function to trigger when deleting a billing user.
   */
  deleteUserFunction: IFunction;

  /**
   * The IDataIngestorAggregator responsible for accepting and aggregating
   * the raw billing data.
   */
  ingestor: IDataIngestorAggregator;

  /**
   * The function responsible for taking the aggregated data and pushing
   * that to the billing provider.
   */
  putUsageFunction: IFunction;

  /**
   * The function to trigger when a webhook request is received.
   */
  webhookFunction?: IFunction;

  /**
   * The path to the webhook resource.
   */
  webhookPath?: string;
}
