# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import importlib

def get_idp_mgmt_object(idp_name):
    
    idp_impl_class = ''
    if (idp_name.upper() == 'COGNITO'):
        idp_impl_class = getattr(importlib.import_module("cognito.cognito_identity_provider_management"), "CognitoIdentityProviderManagement")

    return idp_impl_class()

def get_idp_user_mgmt_object(idp_name):
    
    idp_impl_class = ''
    if (idp_name.upper() == 'COGNITO'):
        idp_impl_class = getattr(importlib.import_module("cognito.cognito_user_management_service"), "CognitoUserManagementService")

    return idp_impl_class()    

def get_idp_authorizer_object(idp_name):
    
    idp_impl_class = ''
    if (idp_name.upper() == 'COGNITO'):
        idp_impl_class = getattr(importlib.import_module("cognito.cognito_authorizer"), "CognitoAuthorizer")

    return idp_impl_class() 