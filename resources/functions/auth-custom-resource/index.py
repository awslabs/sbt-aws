# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
from cognito_identity_provider_management import CognitoIdentityProviderManagement
from crhelper import CfnResource
helper = CfnResource()
idp_mgmt_service = CognitoIdentityProviderManagement()


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

        idp_input = {}
        idp_input['ControlPlaneCallbackURL'] = event['ResourceProperties']['ControlPlaneCallbackURL']
        idp_input['SystemAdminRoleName'] = event['ResourceProperties']['SystemAdminRoleName']
        idp_input['SystemAdminEmail'] = event['ResourceProperties']['SystemAdminEmail']

        idpDetails = idp_mgmt_service.create_control_plane_idp(idp_input)
        response = json.dumps(idpDetails)
        auth_server = idpDetails['idp']['authorizationServer']
        client_id = idpDetails['idp']['clientId']
        well_known_endpoint = idpDetails['idp']['wellKnownEndpointUrl']
        helper.Data['IdpDetails'] = response
        helper.Data['AuthorizationServer'] = auth_server
        helper.Data['ClientId'] = client_id
        helper.Data['WellKnownEndpointUrl'] = well_known_endpoint

        return idpDetails['idp']['userPoolId']
    except Exception as e:
        raise e

@helper.delete
def do_delete(event, _):
    try:        
        userPoolId = event['PhysicalResourceId']
        idp_mgmt_service.delete_control_plane_idp(userPoolId)
    except Exception as e:
        raise e

def handler(event, context):
    helper(event, context)
