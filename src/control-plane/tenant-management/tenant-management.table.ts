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

import { AttributeType, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

/**
 * Represents a table for managing tenant details in the application.
 *
 * @class TenantManagementTable
 * @extends Construct
 */
export class TenantManagementTable extends Construct {
  /**
   * The table that stores the tenant details.
   *
   * @type {Table}
   */
  public readonly tenantDetails: Table;

  /**
   * The name of the global secondary index for the tenant configuration.
   *
   * @type {string}
   */
  public readonly tenantConfigIndexName: string = 'tenantConfigIndex';

  /**
   * The name of the column that stores the tenant configuration.
   *
   * @type {string}
   * @note Only the attributes included in this list will be returned when querying the tenant config endpoint.
   */
  public readonly tenantConfigColumn: string = 'tenantConfig';

  /**
   * The name of the column that stores the tenant name.
   *
   * @type {string}
   */
  public readonly tenantNameColumn: string = 'tenantName';

  /**
   * The name of the column that stores the tenant ID.
   *
   * @type {string}
   */
  public readonly tenantIdColumn: string = 'tenantId';

  /**
   * Constructs a new instance of the TenantManagementTable.
   *
   * @param {Construct} scope - The parent construct.
   * @param {string} id - The ID of the construct.
   */
  constructor(scope: Construct, id: string) {
    super(scope, id);
    addTemplateTag(this, 'Tables');
    this.tenantDetails = new Table(this, 'TenantDetails', {
      partitionKey: { name: this.tenantIdColumn, type: AttributeType.STRING },
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    this.tenantDetails.addGlobalSecondaryIndex({
      indexName: this.tenantConfigIndexName,
      partitionKey: { name: this.tenantNameColumn, type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: [this.tenantConfigColumn],
    });
  }
}
