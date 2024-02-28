// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface Tenant {
  readonly id?: string;
  readonly adminEmail?: string;
  readonly adminUserName?: string;
  readonly callbackUrls?: string[];
  readonly clientId?: string;
  readonly clientName?: string;
  readonly customDomainName?: string;
  readonly groupName?: string;
  readonly name?: string;
  readonly oidcClientId?: string;
  readonly oidcClientSecret?: string;
  readonly oidcIssuer?: string;
  readonly providerName?: string;
  readonly supportedIdentityProviders?: string[];
  readonly tenantDomain?: string;
  readonly tier?: string;
  readonly uniqueName?: string;
  readonly idpDetails?: string;
}
