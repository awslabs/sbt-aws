# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import os
from http import HTTPStatus
from typing import Optional
from aws_lambda_powertools import Tracer
from aws_lambda_powertools import Logger
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler.openapi.params import Query
from aws_lambda_powertools.shared.types import Annotated
from aws_lambda_powertools.event_handler import APIGatewayHttpResolver
from cognito_user_management_service import CognitoUserManagementService

tracer = Tracer()
logger = Logger()
app = APIGatewayHttpResolver(enable_validation=True)

idp_details = {
    "idp": {
        "userPoolId": os.environ['USER_POOL_ID'],
    }
}
idp_user_mgmt_service = CognitoUserManagementService()


@app.post("/users")
@tracer.capture_method
def create_user():
    user_details = app.current_event.json_body
    user_details['idpDetails'] = idp_details
    response = idp_user_mgmt_service.create_user(user_details)
    logger.info(response)
    return {"response": "New user created"}, HTTPStatus.OK.value


@app.get("/users")
@tracer.capture_method
def get_users(limit: Annotated[Optional[int], Query(gt=0, le=60)] = 10,
              next_token: Annotated[Optional[str], Query(min_length=0)] = None):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['limit'] = limit
    user_details['next_token'] = next_token
    users, next_token = idp_user_mgmt_service.get_users(user_details)
    logger.info(users.serialize())
    return_response = {
        "data": users.serialize()
    }

    if next_token:
        return_response["next_token"] = next_token

    return return_response, HTTPStatus.OK.value


@app.get("/users/<userId>")
@tracer.capture_method
def get_user(userId):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    user = idp_user_mgmt_service.get_user(user_details)
    if (user == None):
        logger.info("User not found")
        return {"response": "User not found"}, HTTPStatus.NOT_FOUND.value
    logger.info(user.serialize())
    return user.serialize(), HTTPStatus.OK.value


@app.put("/users/<userId>")
@tracer.capture_method
def update_user(userId):
    user_details = app.current_event.json_body
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.update_user(user_details)
    logger.info(response)
    return {"response": "User updated"}, HTTPStatus.OK.value


@app.delete("/users/<userId>/disable")
@tracer.capture_method
def disable_user(userId):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.disable_user(user_details)
    logger.info(response)
    return {"response": "User disabled"}, HTTPStatus.OK.value


@app.put("/users/<userId>/enable")
@tracer.capture_method
def enable_user(userId):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.enable_user(user_details)
    logger.info(response)
    return {"response": "User enabled"}, HTTPStatus.OK.value


@app.delete("/users/<userId>")
@tracer.capture_method
def delete_user(userId):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.delete_user(user_details)
    logger.info(response)
    return {"response": "User deleted"}, HTTPStatus.OK.value


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_HTTP, log_event=True)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
