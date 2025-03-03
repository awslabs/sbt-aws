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
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });
  }
}
