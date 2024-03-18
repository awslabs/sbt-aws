# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import jsonpickle
import user_management_util as user_management_util

client = boto3.client('cognito-idp')

class CognitoUserManagementService():
    def create_user(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        user_group_name = user_details['userRole']

        response = user_management_util.create_user(user_pool_id, user_details)
        user_group_exists = user_management_util.user_group_exists(user_pool_id, user_group_name)
        if not user_group_exists:
            user_management_util.create_user_group(user_pool_id, user_group_name)

        user_management_util.add_user_to_group(user_pool_id, user_details['userName'], user_group_name)
        return response

    def get_users(self, event):
        user_details = event
        user_pool_id = user_details['idpDetails']['idp']['userPoolId']
        users = []
    
        response = client.list_users(
                UserPoolId=user_pool_id
            )
        
        num_of_users = len(response['Users'])
    
        if (num_of_users > 0):
                for user in response['Users']:
                    user_info = UserInfo()
                    for attr in user["Attributes"]:
                        if(attr["Name"] == "custom:userRole"):
                            user_info.user_role = attr["Value"]
    
                        if(attr["Name"] == "email"):
                            user_info.email = attr["Value"] 
                    user_info.enabled = user["Enabled"]
                    user_info.created = user["UserCreateDate"]
                    user_info.modified = user["UserLastModifiedDate"]
                    user_info.status = user["UserStatus"] 
                    user_info.user_name = user["Username"]
                    users.append(user_info)                    
            
        return users
    

    def get_user(self, event):
        try: 
            user_details = event
            user_pool_id = user_details['idpDetails']['idp']['userPoolId']
            user_name = user_details['userName']          
            response = client.admin_get_user(
                    UserPoolId=user_pool_id,
                    Username=user_name
            )
    
            user_info =  UserInfo()
            user_info.user_name = response["Username"]
            user_info.enabled = response["Enabled"]
            user_info.created = response["UserCreateDate"]
            user_info.modified = response["UserLastModifiedDate"]
            user_info.status = response["UserStatus"]             
            for attr in response["UserAttributes"]:
                if(attr["Name"] == "custom:userRole"):
                    user_info.user_role = attr["Value"]    
                if(attr["Name"] == "email"):
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
                            'Value': user_details['userEmail']
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
        
        response = client.admin_delete_user(
                    UserPoolId=user_pool_id,
                    Username=user_name
                )
        
        return response     
    

    



class UserInfo:
    def __init__(self, user_name=None, user_role=None, 
    email=None, status=None, enabled=None, created=None, modified=None):
        self.user_name = user_name
        self.user_role = user_role
        self.email = email
        self.status = status
        self.enabled = enabled
        self.created = created
        self.modified = modified
    def __str__(self):
        return jsonpickle.encode(self, unpicklable=False, use_decimal=True)