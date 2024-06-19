# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import json

client = boto3.client('cognito-idp')


class CognitoUserManagementService():
    def create_user(self, event):
        try:
            create_user_response = client.admin_create_user(
                Username=event['userName'],
                UserPoolId=event['idpDetails']['idp']['userPoolId'],
                ForceAliasCreation=True,
                UserAttributes=[
                    {
                        'Name': 'email',
                        'Value': event['email']
                    },
                    {
                        'Name': 'email_verified',
                        'Value': 'true'
                    },
                    {
                        'Name': 'custom:userRole',
                        'Value': event['userRole']
                    }
                ]
            )
            print(f'create_user_response: {create_user_response}')
            return create_user_response
        except client.exceptions.UsernameExistsException:
            return None

    def get_users(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        limit = user_details['limit']
        next_token = user_details['next_token']
        users = UserInfoList()

        kwargs = {
            'UserPoolId': user_pool_id,
            'Limit': limit
        }

        if next_token:
            kwargs['PaginationToken'] = next_token

        response = client.list_users(**kwargs)

        num_of_users = len(response['Users'])

        if num_of_users:
            for user in response['Users']:
                user_info = UserInfo()
                for attr in user["Attributes"]:
                    if (attr["Name"] == "custom:userRole"):
                        user_info.user_role = attr["Value"]

                    if (attr["Name"] == "email"):
                        user_info.email = attr["Value"]
                user_info.enabled = user["Enabled"]
                user_info.created = user["UserCreateDate"]
                user_info.modified = user["UserLastModifiedDate"]
                user_info.status = user["UserStatus"]
                user_info.user_name = user["Username"]
                users.add_user(user_info)

        return users, response.get('PaginationToken')

    def get_user(self, event):
        try:
            user_details = event
            user_pool_id = user_details['idpDetails']['idp']['userPoolId']
            user_name = user_details['userName']
            response = client.admin_get_user(
                UserPoolId=user_pool_id,
                Username=user_name
            )

            user_info = UserInfo()
            user_info.userName = response["Username"]
            user_info.enabled = response["Enabled"]
            user_info.created = response["UserCreateDate"]
            user_info.modified = response["UserLastModifiedDate"]
            user_info.status = response["UserStatus"]
            for attr in response["UserAttributes"]:
                if (attr["Name"] == "custom:userRole"):
                    user_info.userRole = attr["Value"]
                if (attr["Name"] == "email"):
                    user_info.email = attr["Value"]
            return user_info
        except client.exceptions.UserNotFoundException as e:
            return

    def update_user(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        user_name = user_details['userName']

        response = client.admin_update_user_attributes(
            Username=user_name,
            UserPoolId=user_pool_id,
            UserAttributes=[
                {
                    'Name': 'email',
                            'Value': user_details['email']
                },
                {
                    'Name': 'custom:userRole',
                            'Value': user_details['userRole']
                }
            ]
        )
        return response

    def disable_user(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        user_name = user_details['userName']

        response = client.admin_disable_user(
            Username=user_name,
            UserPoolId=user_pool_id
        )

        return response

    def enable_user(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        user_name = user_details['userName']

        response = client.admin_enable_user(
            Username=user_name,
            UserPoolId=user_pool_id
        )

        return response

    def delete_user(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        user_name = user_details['userName']

        try:
            response = client.admin_delete_user(
                UserPoolId=user_pool_id,
                Username=user_name
            )
            return response
        except client.exceptions.UserNotFoundException as e:
            return None


class UserInfo:
    def __init__(self, user_name=None, user_role=None,
                 email=None, status=None, enabled=None, created=None, modified=None):
        self.userName = user_name
        self.userRole = user_role
        self.email = email
        self.status = status
        self.enabled = enabled
        self.created = created
        self.modified = modified

    def serialize(self):
        return json.dumps(self.__dict__, default=str)


class UserInfoList:
    def __init__(self):
        self.users = []

    def add_user(self, user):
        self.users.append(user)

    def serialize(self):
        user_dicts = [user.__dict__ for user in self.users]
        return json.dumps(user_dicts, default=str)
