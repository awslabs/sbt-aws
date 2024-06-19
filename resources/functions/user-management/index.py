# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import os
import boto3
from http import HTTPStatus
from typing import Optional
from aws_lambda_powertools import Tracer
from aws_lambda_powertools import Logger
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler.openapi.params import Query, Body, Path
from aws_lambda_powertools.shared.types import Annotated
from aws_lambda_powertools.event_handler import APIGatewayHttpResolver
from cognito_user_management_service import CognitoUserManagementService
from aws_lambda_powertools.event_handler.exceptions import (
    InternalServerError,
    NotFoundError,
)

tracer = Tracer()
logger = Logger()
app = APIGatewayHttpResolver(enable_validation=True)
idp_details = {
    "idp": {
        "userPoolId": os.environ['USER_POOL_ID'],
    }
}
idp_user_mgmt_service = CognitoUserManagementService()
client = boto3.client('cognito-idp')


@app.post("/users")
@tracer.capture_method
def create_user(userName: Annotated[str, Body(embed=True)],
                userRole: Annotated[str, Body(embed=True)],
                email: Annotated[str, Body(embed=True)]):
    response = idp_user_mgmt_service.create_user({
        'userName': userName,
        'userRole': userRole,
        'email': email,
        'idpDetails': idp_details,
    })
    logger.info(response)
    if response is None:
        raise InternalServerError("Failed to create user")
    return {"data": {'userName': userName}}, HTTPStatus.CREATED


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

    return return_response, HTTPStatus.OK


@app.get("/users/<userId>")
@tracer.capture_method
def get_user(userId: Annotated[str, Path(min_length=0)]):
    user = idp_user_mgmt_service.get_user({
        'idpDetails': idp_details,
        'userName': userId,
    })
    if user:
        logger.info(user.serialize())
        return {'data': user.serialize()}, HTTPStatus.OK
    else:
        logger.info("User not found")
        raise NotFoundError(f"User {userId} not found.")


@app.put("/users/<userId>")
@tracer.capture_method
def update_user(userId: Annotated[str, Path(min_length=0)],
                userRole: Annotated[Optional[str], Body(embed=True)],
                email: Annotated[Optional[str], Body(embed=True)]) -> dict[str, str]:
    user_details = {
        'userName': userId,
        'idpDetails': idp_details,
    }
    if userRole:
        user_details['userRole'] = userRole
    if email:
        user_details['email'] = email
    response = idp_user_mgmt_service.update_user(user_details)
    logger.info(response)
    return {"message": "User updated"}, HTTPStatus.OK


@app.delete("/users/<userId>/disable")
@tracer.capture_method
def disable_user(userId: Annotated[str, Path(min_length=0)]):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.disable_user(user_details)
    logger.info(response)
    return {"message": "User disabled"}, HTTPStatus.OK


@app.put("/users/<userId>/enable")
@tracer.capture_method
def enable_user(userId: Annotated[str, Path(min_length=0)]):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.enable_user(user_details)
    logger.info(response)
    return {"message": "User enabled"}, HTTPStatus.OK


@app.delete("/users/<userId>")
@tracer.capture_method
def delete_user(userId: Annotated[str, Path(min_length=0)]):
    user_details = {}
    user_details['idpDetails'] = idp_details
    user_details['userName'] = userId
    response = idp_user_mgmt_service.delete_user(user_details)
    if response is None:
        logger.info(f"user {userId} not found.")
    logger.info(response)
    return {"message": "User deleted"}, HTTPStatus.OK


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_HTTP, log_event=True)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
