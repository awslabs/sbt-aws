# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import os
import uuid
import user_management_util as user_management_util
from aws_lambda_powertools import Logger

logger = Logger()
cognito = boto3.client('cognito-idp')
region = os.environ['AWS_REGION']

class CognitoIdentityProviderManagement():
    def delete_control_plane_idp(self, userPoolId):        
        response = cognito.describe_user_pool(
            UserPoolId=userPoolId
        )
        domain = response['UserPool']['Domain']
        
        cognito.delete_user_pool_domain(
            UserPoolId=userPoolId,
            Domain=domain
        )
        cognito.delete_user_pool(UserPoolId=userPoolId)

    def create_control_plane_idp(self, event):
        idp_response = {}
        idp_response['idp'] = {}
        user_details = {}
        control_plane_callback_url = event['ControlPlaneCallbackURL']
        user_details['email'] = event['SystemAdminEmail']
        user_details['userRole'] = event['SystemAdminRoleName']
        user_details['userName'] = 'admin'

        user_pool_response = self.__create_user_pool(
            'SaaSControlPlaneUserPool', control_plane_callback_url)
        logger.info(user_pool_response)
        user_pool_id = user_pool_response['UserPool']['Id']

        app_client_response = self.__create_user_pool_client(user_pool_id, control_plane_callback_url)
        logger.info(app_client_response)
        app_client_id = app_client_response['UserPoolClient']['ClientId']
        user_pool_domain = 'saascontrolplane'+uuid.uuid1().hex
        self.__create_user_pool_domain(user_pool_id, user_pool_domain)
        tenant_user_group_response = user_management_util.create_user_group(user_pool_id, user_details['userRole'])
        user_management_util.create_user(user_pool_id, user_details)
        user_management_util.add_user_to_group(user_pool_id, user_details['userName'], tenant_user_group_response['Group']['GroupName'])        

        idp_response['idp']['name'] = 'Cognito'
        idp_response['idp']['userPoolId'] = user_pool_id
        idp_response['idp']['clientId'] = app_client_id
        idp_response['idp']['authorizationServer'] = f'https://{user_pool_domain}.auth.{region}.amazoncognito.com'
        idp_response['idp']['wellKnownEndpointUrl'] = f'https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/openid-configuration'

        return idp_response

    def __create_user_pool(self, user_pool_name, control_plane_site_url):
        email_message = ''.join(["Login into control plane UI at ",
                                control_plane_site_url,
                                " with username {username} and temporary password {####}"])
        email_subject = ''.join(
            ["Your temporary password for control plane UI"])
        response = cognito.create_user_pool(
            PoolName=user_pool_name,
            AutoVerifiedAttributes=['email'],
            AccountRecoverySetting={
                'RecoveryMechanisms': [
                    {
                        'Priority': 1,
                        'Name': 'verified_email'
                    },
                ]
            },
            Schema=[
                {
                    'Name': 'email',
                    'AttributeDataType': 'String',
                    'Required': True,
                    'Mutable': True
                },
                {
                    'Name': 'userRole',
                    'AttributeDataType': 'String',
                    'Required': False,
                    'Mutable': True
                }
            ],
            AdminCreateUserConfig={
                'InviteMessageTemplate': {
                    'EmailMessage': email_message,
                    'EmailSubject': email_subject
                }
            }
        )
        return response

    def __create_user_pool_client(self, user_pool_id, callback_url):
        response = cognito.create_user_pool_client(
            UserPoolId=user_pool_id,
            ClientName='SaaSControlPlaneUserPoolClient',
            GenerateSecret=False,
            AllowedOAuthFlowsUserPoolClient=True,
            AllowedOAuthFlows=[
                'code', 'implicit'
            ],
            SupportedIdentityProviders=[
                'COGNITO',
            ],
            CallbackURLs=[
                callback_url,
            ],
            LogoutURLs=[
                callback_url,
            ],
            AllowedOAuthScopes=[
                'email',
                'openid',
                'profile'
            ],
            WriteAttributes=[
                'email',
                'custom:userRole'
            ]
        )
        return response

    def __create_user_pool_domain(self, user_pool_id, domain_name):
        response = cognito.create_user_pool_domain(
            Domain=domain_name,
            UserPoolId=user_pool_id
        )
        return response
