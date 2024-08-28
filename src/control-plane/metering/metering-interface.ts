// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { IASyncFunction, ISyncFunction } from '../../utils';

/**
 * Encapsulates the list of properties for an IMetering construct.
 */
export interface IMetering {
  /**
   * The sync function responsible for creating a meter.
   * Once created, the meter can be used to track and analyze the specific usage metrics for tenants.
   * -- POST /meters
   */
  createMeterFunction: ISyncFunction;

  /**
   * The sync function responsible for fetching a single a meter based on its id.
   * -- GET /meters/{meterId}
   */
  fetchMeterFunction: ISyncFunction;

  /**
   * The sync function responsible for fetching multiple meters. This should support pagination.
   * -- GET /meters
   */
  fetchAllMetersFunction: ISyncFunction;

  /**
   * The sync function responsible for updating a meter.
   * -- PUT /meters/{meterId}
   */
  updateMeterFunction?: ISyncFunction;

  /**
   * The sync function responsible for deleting a meter.
   * -- DELETE /meters/{meterId}
   */
  deleteMeterFunction?: ISyncFunction;

  /**
   * The async function responsible for ingesting a usage event.
   * Usage events are used to measure and track the usage metrics associated with the meter.
   * -- Default event trigger: INGEST_USAGE
   */
  ingestUsageEventFunction: IASyncFunction;

  /**
   * The function responsible for getting usage data for a specific meter.
   * -- GET /usage/{meterId}
   */
  fetchUsageFunction: ISyncFunction; // use 'fetch*' instead of 'get*' to avoid error JSII5000

  /**
   * The function to trigger to exclude specific events from being recorded or included in the usage data.
   * Used for canceling events that were incorrectly ingested.
   * -- DELETE /usage
   */
  cancelUsageEventsFunction?: ISyncFunction;

  /**
   * The function responsible for creating a new customer.
   * (Customer in this context is a tenant.)
   *
   * Default event trigger: ONBOARDING_REQUEST
   */
  createCustomerFunction?: IASyncFunction;

  /**
   * The function responsible for deleting an existing customer.
   * (Customer in this context is a tenant.)
   *
   * Default event trigger: OFFBOARDING_REQUEST
   */
  deleteCustomerFunction?: IASyncFunction;
}
