# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
from crhelper import CfnResource
cognito = boto3.client('cognito-idp')
helper = CfnResource()


@helper.create
@helper.update
def do_action(event, _):
    """ Called as part of bootstrap template. 
        Inserts/Updates Settings table based upon the resources deployed inside bootstrap template
        We use these settings inside tenant template

    Args:
            event ([type]): [description]
            _ ([type]): [description]
    """
    user_name = event['ResourceProperties']['Name']
    email = event['ResourceProperties']['Email']
    user_role = event['ResourceProperties']['Role']
    user_pool_id = event['ResourceProperties']['UserPoolId']

    try:
        create_group_response = cognito.create_group(
            GroupName=user_role,
            UserPoolId=user_pool_id,
            Precedence=0
        )
        print(f'create_group_response: {create_group_response}')
    except cognito.exceptions.GroupExistsException:
        print(f'group: {user_role} already exists!')

    try:
        create_user_response = cognito.admin_create_user(
            Username=user_name,
            UserPoolId=user_pool_id,
            ForceAliasCreation=True,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
                {
                    'Name': 'email_verified',
                    'Value': 'true'
                },
                {
                    'Name': 'custom:userRole',
                    'Value': user_role
                }
            ]
        )
        print(f'create_user_response: {create_user_response}')
    except cognito.exceptions.UsernameExistsException:
        print(f'user: {user_name} already exists!')

    try:
        add_user_to_group_response = cognito.admin_add_user_to_group(
            UserPoolId=user_pool_id,
            Username=user_name,
            GroupName=user_role
        )
        print(f'add_user_to_group_response: {add_user_to_group_response}')
    except cognito.exceptions as e:
        print(f'failed to add user to group: {e}')


@helper.delete
def do_delete(event, _):
    # deleting the user-pool (created outside of this custom resource)
    # will delete the users and user groups created here
    pass


def handler(event, context):
    helper(event, context)
