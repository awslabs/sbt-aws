// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { DetailType } from '../../utils';

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
 * Encapsulates the list of properties for an IMetering construct.
 */
export interface IMetering {
  /**
   * The function to trigger to create a meter.
   * Once created, the meter can be used to track and analyze the specific usage metrics for tenants.
   */
  createMeterFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to update a meter.
   */
  updateMeterFunction?: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to ingest a usage event.
   * Usage events are used to measure and track the usage metrics associated with the meter.
   */
  ingestFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to get the usage data that has been recorded for a specific meter.
   */
  getUsageFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to exclude specific events from being recorded or included in the usage data.
   * Used for canceling events that were incorrectly ingested.
   */
  cancelUsageEventsFunction?: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to create a new customer.
   * (Customer in this context is a tenant.)
   */
  createCustomerFunction?: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to delete a customer.
   * (Customer in this context is a tenant.)
   */
  deleteCustomerFunction?: IFunction | IFunctionTrigger;
}
