// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schedule } from 'aws-cdk-lib/aws-events';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { DetailType } from '../../utils';
import { IDataIngestorAggregator } from '../ingestor-aggregator/ingestor-aggregator-interface';

/**
 * Optional interface that allows specifying both
 * the function to trigger and the event that will trigger it.
 */
export interface IFunctionTrigger {
  /**
   * The function definition.
   */
  readonly handler: IFunction;

  /**
   * The detail-type that will trigger the handler function.
   */
  readonly trigger: DetailType;
}

/**
 * Optional interface that allows specifying both
 * the function to trigger and the schedule by which to trigger it.
 */
export interface IFunctionSchedule {
  /**
   * The function definition.
   */
  readonly handler: IFunction;

  /**
   * The schedule that will trigger the handler function.
   */
  readonly schedule: Schedule;
}

/**
 * Encapsulates the list of properties for an IBilling construct.
 */
export interface IBilling {
  /**
   * The function to trigger to create a new customer.
   * (Customer in this context is an entity that has zero or more Users.)
   */
  createCustomerFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to delete a customer.
   * (Customer in this context is an entity that has zero or more Users.)
   */
  deleteCustomerFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to create a new user.
   * (User in this context is an entity that belongs to a Customer.)
   */
  createUserFunction?: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to delete a user.
   * (User in this context is an entity that belongs to a Customer.)
   */
  deleteUserFunction?: IFunction | IFunctionTrigger;

  /**
   * The IDataIngestorAggregator responsible for accepting and aggregating
   * the raw billing data.
   */
  ingestor?: IDataIngestorAggregator;

  /**
   * The function responsible for taking the aggregated data and pushing
   * that to the billing provider.
   */
  putUsageFunction?: IFunction | IFunctionSchedule;

  /**
   * The function to trigger when a webhook request is received.
   */
  webhookFunction?: IFunction;

  /**
   * The path to the webhook resource.
   */
  webhookPath?: string;
}
