# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import user_management_util as user_management_util
from crhelper import CfnResource
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
    try:
        user_pool_id = event['ResourceProperties']['UserPoolId']
        user_details = {
            'email': event['ResourceProperties']['SystemAdminEmail'],
            'userRole': event['ResourceProperties']['SystemAdminRoleName'],
            'userName': 'admin',
        }

        tenant_user_group_response = user_management_util.create_user_group(
            user_pool_id,
            user_details['userRole']
        )

        user_management_util.create_user(user_pool_id, user_details)

        user_management_util.add_user_to_group(
            user_pool_id,
            user_details['userName'],
            tenant_user_group_response['Group']['GroupName']
        )

    except Exception as e:
        raise e


@helper.delete
def do_delete(event, _):
    # deleting the user-pool (created outside of this custom resource)
    # will delete the users and user groups created here
    pass


def handler(event, context):
    helper(event, context)
