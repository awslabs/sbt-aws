// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Table, AttributeType, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { addTemplateTag } from '../../utils';

export class TenantManagementTable extends Construct {
  public readonly tenantDetails: Table;
  public readonly tenantConfigIndexName: string = 'tenantConfigIndex';

  // note that only the attributes included in this list will be returned when querying the tenant config endpoint
  public readonly tenantConfigColumn: string = 'tenantConfig';
  public readonly tenantNameColumn: string = 'tenantName';
  public readonly tenantIdColumn: string = 'tenantId';
  constructor(scope: Construct, id: string) {
    super(scope, id);
    addTemplateTag(this, 'Tables');
    this.tenantDetails = new Table(this, 'TenantDetails', {
      partitionKey: { name: this.tenantIdColumn, type: AttributeType.STRING },
      pointInTimeRecovery: true,
    });

    this.tenantDetails.addGlobalSecondaryIndex({
      indexName: this.tenantConfigIndexName,
      partitionKey: { name: this.tenantNameColumn, type: AttributeType.STRING },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: [this.tenantConfigColumn],
    });
  }
}
