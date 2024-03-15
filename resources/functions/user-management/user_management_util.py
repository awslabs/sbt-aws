# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3

cognito = boto3.client('cognito-idp')


def create_user_group(user_pool_id, group_name):
        response = cognito.create_group(
            GroupName=group_name,
            UserPoolId=user_pool_id,
            Precedence=0
        )
        return response


def create_user(user_pool_id, user_details):
        response = cognito.admin_create_user(
            Username=user_details['userName'],
            UserPoolId=user_pool_id,
            ForceAliasCreation=True,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': user_details['email']
                },
                {
                    'Name': 'email_verified',
                    'Value': 'true'
                },
                {
                    'Name': 'custom:userRole',
                    'Value': user_details['userRole'] 
                }
            ]
        )
        return response

def add_user_to_group(user_pool_id, user_name, group_name):
        response = cognito.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName=group_name
        )
        return response

def user_group_exists(user_pool_id, group_name):        
        try:
            response=cognito.get_group(
                UserPoolId=user_pool_id, 
                GroupName=group_name)
            return True
        except Exception as e:
            return False
        