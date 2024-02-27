# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import os
import idp_object_factory

from crhelper import CfnResource
helper = CfnResource()

try:
    idp_name = os.environ['IDP_NAME']
    idp_mgmt_service = idp_object_factory.get_idp_mgmt_object(idp_name)
except Exception as e:
    helper.init_failure(e)


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

    except Exception as e:
        raise e


@helper.delete
def do_nothing(_, __):
    pass


def handler(event, context):
    helper(event, context)
