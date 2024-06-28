// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as apigatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayV2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { addTemplateTag } from '../utils';
import { IAuth } from './auth/auth-interface';

export interface ControlPlaneAPIProps {
  readonly auth: IAuth;
  readonly disableAPILogging?: boolean;
}

export class ControlPlaneAPI extends Construct {
  apiUrl: any;
  jwtAuthorizer: apigatewayV2.IHttpRouteAuthorizer;
  public readonly api: apigatewayV2.HttpApi;
  // public readonly tenantUpdateServiceTarget: events.IRuleTarget;
  constructor(scope: Construct, id: string, props: ControlPlaneAPIProps) {
    super(scope, id);
    addTemplateTag(this, 'ControlPlaneAPI');
    this.api = new apigatewayV2.HttpApi(this, 'controlPlaneAPI', {
      corsPreflight: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    if (props.disableAPILogging) {
      NagSuppressions.addResourceSuppressionsByPath(
        cdk.Stack.of(this),
        [this.api.defaultStage?.node.path!],
        [
          {
            id: 'AwsSolutions-APIG1',
            reason: 'Customer has explicitly opted out of logging',
          },
        ]
      );
    } else {
      const controlPlaneAPILogGroup = new LogGroup(this, 'controlPlaneAPILogGroup', {
        retention: RetentionDays.ONE_WEEK,
        logGroupName: `/aws/vendedlogs/api/${this.node.id}-${this.node.addr}`,
      });
      const accessLogSettings = {
        destinationArn: controlPlaneAPILogGroup.logGroupArn,
        format: JSON.stringify({
          requestId: '$context.requestId',
          ip: '$context.identity.sourceIp',
          requestTime: '$context.requestTime',
          httpMethod: '$context.httpMethod',
          routeKey: '$context.routeKey',
          status: '$context.status',
          protocol: '$context.protocol',
          responseLength: '$context.responseLength',
        }),
      };

      const stage = this.api.defaultStage?.node.defaultChild as apigatewayV2.CfnStage;
      stage.accessLogSettings = accessLogSettings;
    }

    this.apiUrl = this.api.url;
    new cdk.CfnOutput(this, 'controlPlaneAPIEndpoint', {
      value: this.apiUrl,
      key: 'controlPlaneAPIEndpoint',
    });

    this.jwtAuthorizer = new apigatewayV2Authorizers.HttpJwtAuthorizer(
      'tenantsAuthorizer',
      props.auth.jwtIssuer,
      {
        jwtAudience: props.auth.jwtAudience,
      }
    );
  }
}
