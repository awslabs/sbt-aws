# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

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
from typing_extensions import Annotated
from aws_lambda_powertools.event_handler.exceptions import (
    InternalServerError,
    NotFoundError,
)

tracer = Tracer()
logger = Logger()
# TODO Make sure we fill in an appropriate origin for this call (the CloudFront domain)
cors_config = CORSConfig(allow_origin="*", max_age=300)
app = APIGatewayHttpResolver(cors=cors_config, enable_validation=True)

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


@logger.inject_lambda_context(
    correlation_id_path=correlation_paths.API_GATEWAY_HTTP, log_event=True
)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
