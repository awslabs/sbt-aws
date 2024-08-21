// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { IFunctionTrigger } from '../../utils';

/**
 * Encapsulates the list of properties for an IMetering construct.
 */
export interface IMetering {
  /**
   * The function to trigger to create a meter -- POST /meters
   * Once created, the meter can be used to track and analyze the specific usage metrics for tenants.
   */
  createMeterFunction: IFunction;

  /**
   * The scope required to authorize requests for creating a new meter.
   */
  createMeterScope?: string;

  /**
   * The function to trigger to update a meter -- PUT /meters/meterId
   */
  updateMeterFunction?: IFunction;

  /**
   * The scope required to authorize requests for updating a meter.
   */
  updateMeterScope?: string;

  /**
   * The function to trigger to ingest a usage event.
   * Usage events are used to measure and track the usage metrics associated with the meter.
   *
   * Default event trigger: INGEST_USAGE
   */
  ingestUsageEventFunction: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to get the usage data that has been recorded for a specific meter.
   * -- GET /usage/meterId
   */
  fetchUsageFunction: IFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * The scope required to authorize requests for fetching metering usage.
   */
  fetchUsageScope?: string;

  /**
   * The function to trigger to exclude specific events from being recorded or included in the usage data.
   * Used for canceling events that were incorrectly ingested.
   * -- DELETE /usage
   */
  cancelUsageEventsFunction?: IFunction;

  /**
   * The scope required to authorize requests for cancelling usage events.
   */
  cancelUsageEventsScope?: string;

  /**
   * The function to trigger to create a new customer.
   * (Customer in this context is a tenant.)
   *
   * Default event trigger: ONBOARDING_REQUEST
   */
  createCustomerFunction?: IFunction | IFunctionTrigger;

  /**
   * The function to trigger to delete a customer.
   * (Customer in this context is a tenant.)
   *
   * Default event trigger: OFFBOARDING_REQUEST
   */
  deleteCustomerFunction?: IFunction | IFunctionTrigger;
}
