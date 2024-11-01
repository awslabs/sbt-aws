# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

# import json
import os
from http import HTTPStatus
import uuid

import boto3
from boto3.dynamodb.conditions import Attr
import botocore
from typing import Optional
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler import APIGatewayHttpResolver, CORSConfig
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler.openapi.params import Query, Path
from aws_lambda_powertools.shared.types import Annotated
from aws_lambda_powertools.event_handler.exceptions import (
    InternalServerError,
    NotFoundError,
)

tracer = Tracer()
logger = Logger()
# TODO Make sure we fill in an appropriate origin for this call (the CloudFront domain)
cors_config = CORSConfig(allow_origin="*", max_age=300)
app = APIGatewayHttpResolver(cors=cors_config, enable_validation=True)

# event_bus = boto3.client("events")
# eventbus_name = os.environ["EVENTBUS_NAME"]
# event_source = os.environ["EVENT_SOURCE"]
# onboarding_detail_type = os.environ["ONBOARDING_DETAIL_TYPE"]
# offboarding_detail_type = os.environ["OFFBOARDING_DETAIL_TYPE"]
# activate_detail_type = os.environ["ACTIVATE_DETAIL_TYPE"]
# deactivate_detail_type = os.environ["DEACTIVATE_DETAIL_TYPE"]
dynamodb = boto3.resource("dynamodb")
tenant_details_table = dynamodb.Table(os.environ["TENANT_DETAILS_TABLE"])


@app.post("/tenants")
@tracer.capture_method
def create_tenant():
    input_details = app.current_event.json_body
    input_details["tenantId"] = str(uuid.uuid4())
    input_details["sbtaws_active"] = True

    logger.info("Request received to create new tenant")

    try:
        response = tenant_details_table.put_item(Item=input_details)
        logger.info(f"put_item response {response}")

    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")
    else:
        return {"data": input_details}, HTTPStatus.CREATED


@app.get("/tenants")
@tracer.capture_method
def get_tenants(
    limit: Annotated[Optional[int], Query(gt=0)] = 10,
    next_token: Annotated[Optional[str], Query(min_length=0)] = None,
):
    logger.info("Request received to get all tenants")
    tenants = None
    last_evaluated_key = None

    kwargs = {"Limit": limit}
    if next_token:
        kwargs["ExclusiveStartKey"] = {"tenantId": next_token}

    try:
        response = tenant_details_table.scan(**kwargs)
        tenants = response["Items"]
        last_evaluated_key = response.get("LastEvaluatedKey")

    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")

    else:
        return_response = {"data": tenants}

        if last_evaluated_key:
            return_response["next_token"] = last_evaluated_key["tenantId"]

        return return_response, HTTPStatus.OK


@app.get("/tenants/<tenantId>")
@tracer.capture_method
def get_tenant(tenantId: Annotated[str, Path(min_length=0)]):
    logger.info(f"Request received to get a tenant: {tenantId}")
    tenant = None
    try:
        response = tenant_details_table.get_item(Key={"tenantId": tenantId})
        tenant = response.get("Item")
        if not tenant:
            raise NotFoundError(f"Tenant not found for id {tenantId}")
    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")
    else:
        return {"data": tenant}, HTTPStatus.OK


@app.put("/tenants/<tenantId>")
@tracer.capture_method
def update_tenant(tenantId: Annotated[str, Path(min_length=0)]):
    logger.info("Request received to update a tenant")
    input_details = app.current_event.json_body
    updated_tenant = None
    try:
        response = __update_tenant(tenantId, input_details)
        updated_tenant = response["Attributes"]
    except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
        logger.info(f"received request to update non-existing tenant {tenantId}")
        raise NotFoundError(f"Tenant {tenantId} not found.")
    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")
    else:
        return {"data": updated_tenant}, HTTPStatus.OK


@app.delete("/tenants/<tenantId>")
@tracer.capture_method
def delete_tenant(tenantId: Annotated[str, Path(min_length=0)]):
    logger.info("Request received to delete a tenant")
    deleted_tenant = None

    try:
        response = __update_tenant(tenantId, {"sbtaws_active": False})
        deleted_tenant = response["Attributes"]
        # __create_control_plane_event(
        #     json.dumps(deleted_tenant), offboarding_detail_type
        # )
    except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
        logger.info(f"received request to update non-existing tenant {tenantId}")
        raise NotFoundError(f"Tenant {tenantId} not found.")
    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")
    else:
        return {"data": deleted_tenant}, HTTPStatus.OK


def __update_tenant(tenantId, tenant):
    # Remove the tenantId if the incoming object has one
    input_details = {key: tenant[key] for key in tenant if key != "tenantId"}
    update_expression = []
    update_expression.append("set ")
    expression_attribute_values = {}
    for key, value in input_details.items():
        key_variable = f":{key}Variable"
        update_expression.append("".join([key, " = ", key_variable]))
        update_expression.append(",")
        expression_attribute_values[key_variable] = value

    # remove the last comma
    update_expression.pop()

    return tenant_details_table.update_item(
        Key={
            "tenantId": tenantId,
        },
        ConditionExpression=Attr("tenantId").eq(tenantId),
        UpdateExpression="".join(update_expression),
        ExpressionAttributeValues=expression_attribute_values,
        ReturnValues="ALL_NEW",
    )


# @app.put("/tenants/<tenantId>/deactivate")
# @tracer.capture_method
# def deactivate_tenant(tenantId: Annotated[str, Path(min_length=0)]):
#     logger.info("Request received to deactivate a tenant")

#     try:
#         response = tenant_details_table.update_item(
#             Key={
#                 "tenantId": tenantId,
#             },
#             UpdateExpression="set isActive = :isActive",
#             ExpressionAttributeValues={":isActive": False},
#             ReturnValues="ALL_NEW",
#         )
#         logger.info(f"update_item response {response}")

#         __create_control_plane_event(
#             json.dumps({"tenantId": tenantId}), deactivate_detail_type
#         )
#     except botocore.exceptions.ClientError as error:
#         logger.error(error)
#         raise InternalServerError("Unknown error during processing!")

#     else:
#         return {"message": "Tenant deactivated"}, HTTPStatus.OK


# @app.put("/tenants/<tenantId>/activate")
# @tracer.capture_method
# def activate_tenant(tenantId: Annotated[str, Path(min_length=0)]):
#     logger.info("Request received to activate a tenant")

#     try:
#         response = tenant_details_table.update_item(
#             Key={
#                 "tenantId": tenantId,
#             },
#             UpdateExpression="set isActive = :isActive",
#             ExpressionAttributeValues={":isActive": True},
#             ReturnValues="ALL_NEW",
#         )
#         logger.info(f"update_item response {response}")

#         __create_control_plane_event(
#             json.dumps(response["Attributes"]), activate_detail_type
#         )
#     except botocore.exceptions.ClientError as error:
#         logger.error(error)
#         raise InternalServerError("Unknown error during processing!")

#     else:
#         return {"message": "Tenant activated"}, HTTPStatus.OK


# def __create_control_plane_event(event_details, detail_type):
#     response = event_bus.put_events(
#         Entries=[
#             {
#                 "EventBusName": eventbus_name,
#                 "Source": event_source,
#                 "DetailType": detail_type,
#                 "Detail": event_details,
#             }
#         ]
#     )
#     logger.info(response)


@logger.inject_lambda_context(
    correlation_id_path=correlation_paths.API_GATEWAY_HTTP, log_event=True
)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
