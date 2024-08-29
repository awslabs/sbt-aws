// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Schedule } from 'aws-cdk-lib/aws-events';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IASyncFunction } from '../../utils';
import { IDataIngestorAggregator } from '../ingestor-aggregator/ingestor-aggregator-interface';

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
  readonly schedule?: Schedule;
}

/**
 * Interface that allows specifying both the function to trigger
 * and the path on the API Gateway that triggers it.
 */
export interface IFunctionPath {
  /**
   * The path to the webhook resource.
   */
  readonly path: string;

  /**
   * The function definition.
   */
  readonly handler: IFunction;
}

/**
 * Encapsulates the list of properties for an IBilling construct.
 */
export interface IBilling {
  /**
   * The async function responsible for creating a new customer.
   * The function to trigger to create a new customer.
   * (Customer in this context is an entity that has zero or more Users.)
   * -- Default event trigger: ONBOARDING_REQUEST
   */
  createCustomerFunction: IASyncFunction;

  /**
   * The async function responsible for deleting an existing customer.
   * (Customer in this context is an entity that has zero or more Users.)
   * -- Default event trigger: OFFBOARDING_REQUEST
   */
  deleteCustomerFunction: IASyncFunction;

  /**
   * The async function responsible for creating a new user.
   * (User in this context is an entity that belongs to a Customer.)
   * -- Default event trigger: TENANT_USER_CREATED
   */
  createUserFunction?: IASyncFunction;

  /**
   * The async function responsible for deleting an existing user.
   * (User in this context is an entity that belongs to a Customer.)
   * -- Default event trigger: TENANT_USER_DELETED
   */
  deleteUserFunction?: IASyncFunction;

  /**
   * The IDataIngestorAggregator responsible for accepting and aggregating
   * the raw billing data.
   */
  ingestor?: IDataIngestorAggregator;

  /**
   * The async function responsible for taking the aggregated data and pushing
   * that to the billing provider.
   * -- Default event trigger: events.Schedule.rate(cdk.Duration.hours(24))
   */
  putUsageFunction?: IFunctionSchedule;

  /**
   * The function to trigger when a webhook request is received.
   * -- POST /billing/{$webhookPath}
   */
  webhookFunction?: IFunctionPath;
}
