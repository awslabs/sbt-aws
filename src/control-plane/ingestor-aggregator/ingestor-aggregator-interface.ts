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
