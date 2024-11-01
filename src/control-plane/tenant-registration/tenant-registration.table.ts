// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

/**
 * Represents a table for managing tenant registration information.
 *
 * @class TenantRegistrationTable
 * @extends Construct
 */
export class TenantRegistrationTable extends Construct {
  /**
   * The table that stores the tenant details.
   *
   * @type {Table}
   */
  public readonly tenantRegistration: Table;

  /**
   * The name of the column that stores the tenant registration ID.
   *
   * @type {string}
   */
  public readonly tenantRegistrationIdColumn: string = 'tenantRegistrationId';

  /**
   * Constructs a new instance of the TenantRegistrationTable.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.tenantRegistration = new Table(this, 'TenantRegistrationTable', {
      partitionKey: { name: this.tenantRegistrationIdColumn, type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: true,
    });
  }
}
