# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import os
import utils
from aws_lambda_powertools import Tracer
from aws_lambda_powertools import Logger
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler import APIGatewayRestResolver
from cognito_user_management_service import CognitoUserManagementService

tracer = Tracer()
logger = Logger()
app = APIGatewayRestResolver()

idp_name = os.environ['IDP_NAME']
idp_details=json.loads(os.environ['IDP_DETAILS'])
idp_user_mgmt_service = CognitoUserManagementService()

@app.post("/users")
@tracer.capture_method
def create_user():
    user_details = app.current_event.json_body
    logger.info("Request received to create new user")
    user_details['idpDetails'] = idp_details
    response = idp_user_mgmt_service.create_user(user_details)
    logger.info("Request completed to create new user ")

    return utils.create_success_response("New user created")

@app.get("/users")
@tracer.capture_method
def get_users():
    users = []
    user_details = {}
    user_details['idpDetails'] = idp_details  
    
    logger.info("Request received to get user")
    response = idp_user_mgmt_service.get_users(user_details)
        
    logger.info(response) 
    num_of_users = len(response)
    return utils.generate_response(response)


@app.get("/users/<username>")
@tracer.capture_method
def get_user(username):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = username

    logger.info("Request received to get user")
    user_info = idp_user_mgmt_service.get_user(user_details)
    logger.info("Request completed to get new user ")
    return utils.create_success_response(user_info.__dict__)

    
@app.put("/users/<username>")
@tracer.capture_method
def update_user(username):
    user_details = app.current_event.json_body
    user_details['idpDetails'] = idp_details
    user_details['userName'] = username
    
    logger.info("Request received to get user")
    response = idp_user_mgmt_service.update_user(user_details)
    logger.info(response)
    logger.info("Request completed to update user ")
    return utils.create_success_response("user updated")   

@app.delete("/users/<username>/disable")
@tracer.capture_method
def disable_user(username):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = username

    logger.info("Request received to disable new user")
    response = idp_user_mgmt_service.disable_user(user_details)
    logger.info(response)
    logger.info("Request completed to disable new user ")
    return utils.create_success_response("User disabled")

@app.put("/users/<username>/enable")
@tracer.capture_method
def enable_user(username):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = username

    logger.info("Request received to enable new user")
    response = idp_user_mgmt_service.enable_user(user_details)
    logger.info(response)
    logger.info("Request completed to enable new user ")
    return utils.create_success_response("User enabled")

@app.delete("/users/<username>")
@tracer.capture_method
def delete_user(username):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = username

    logger.info("Request received to delete new user")
    response = idp_user_mgmt_service.delete_user(user_details)
    logger.info(response)
    logger.info("Request completed to delete new user ")
    return utils.create_success_response("User deleted")

@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST, log_event=True)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)


