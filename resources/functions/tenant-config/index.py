# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3  # relying on lambda runtime to provide boto3 https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
import botocore  # relying on lambda runtime to provide botocore https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
from boto3.dynamodb.conditions import Key
import os
from http import HTTPStatus
from aws_lambda_powertools import Logger
from aws_lambda_powertools import Tracer
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.event_handler import (
    APIGatewayRestResolver, CORSConfig
)
from aws_lambda_powertools.event_handler.exceptions import (
    BadRequestError,
    InternalServerError,
    NotFoundError,
)

cors_config = CORSConfig(allow_origin="*", max_age=300)
app = APIGatewayRestResolver(cors=cors_config)
tracer = Tracer()
logger = Logger(service="tenant-config-service")
dynamodb = boto3.resource("dynamodb")
tenant_details_table = os.environ['TENANT_DETAILS_TABLE']
tenant_config_index_name = os.environ['TENANT_CONFIG_INDEX_NAME']
tenant_name_column = os.environ['TENANT_NAME_COLUMN']
tenant_config_column = os.environ['TENANT_CONFIG_COLUMN']
tenant_details_table_handler = dynamodb.Table(tenant_details_table)


def _get_tenant_config_by_name(name):
    response = tenant_details_table_handler.query(
        IndexName=tenant_config_index_name,
        KeyConditionExpression=Key(tenant_name_column).eq(name),
    )
    if "Items" not in response or len(response["Items"]) < 1:
        return None

    tenant_config = response["Items"][0]
    return tenant_config.get(tenant_config_column, None)

def _get_tenant_config_by_id(id):
    logger.info(f"id: {id}")
    response = tenant_details_table_handler.get_item(
        Key={
            'tenantId': id
        },
    )
    if "Item" not in response or len(response["Item"]) < 1:
        return None

    tenant_config = response["Item"]
    return tenant_config.get(tenant_config_column, None)


def _get_tenant_config_for_tenant_name(name):
    try:
        tenant_config = _get_tenant_config_by_name(name)
        logger.info(f"tenant_config: {tenant_config}")
        if tenant_config is None:
            logger.error(f"No tenant details found for {name}")
            raise NotFoundError(f"No tenant details found for {name}")
        logger.info(
            f"Tenant config found for {name} - {tenant_config}")

        return tenant_config, HTTPStatus.OK.value
    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")

def _get_tenant_config_for_tenant_id(id):
    try:
        tenant_config = _get_tenant_config_by_id(id)
        logger.info(f"tenant_config: {tenant_config}")
        if tenant_config is None:
            logger.error(f"No tenant details found for {id}")
            raise NotFoundError(f"No tenant details found for {id}")
        logger.info(
            f"Tenant config found for {id} - {tenant_config}")

        return tenant_config, HTTPStatus.OK.value
    except botocore.exceptions.ClientError as error:
        logger.error(error)
        raise InternalServerError("Unknown error during processing!")


@app.get("/tenant-config/<tenant_name>")
@tracer.capture_method
def get_tenant_config_via_req_param(tenant_name):
    logger.info(f"tenant_name: {tenant_name}")
    if tenant_name is None:
        logger.error(f"Tenant name not found in path!")
        raise BadRequestError(f"Tenant name not found in path!")

    return _get_tenant_config_for_tenant_name(tenant_name)


@app.get("/tenant-config")
@tracer.capture_method
def get_tenant_config_via_param_or_header():
    tenant_id: str = app.current_event.get_query_string_value(name="tenantId", default_value="")
    tenant_name: str = ''
    logger.info(f"tenant_id: {tenant_id}")
    if tenant_id is None:
        logger.info(f"No tenantId query parameter found. Looking for tenantName.")
    else:
        return _get_tenant_config_for_tenant_id(tenant_id)

    tenant_name = app.current_event.get_query_string_value(name="tenantName", default_value="")
    if tenant_name is None:
        logger.info(f"No tenantName query parameter found. Looking at headers.")

    origin_header = app.current_event.get_header_value(name="Origin")
    logger.info(f"origin_header: {origin_header}")
    if origin_header is None:
        logger.error(f"Origin header missing!")
        raise BadRequestError(f"Origin header missing!")

    hostname = origin_header.split("://")[1]
    logger.info(f"hostname: {hostname}")
    tenant_name = hostname.split(".")[0]
    logger.info(f"tenant_name: {tenant_name}")
    if tenant_name is None:
        logger.error(f"Unable to parse tenant name!")
        raise BadRequestError(f"Unable to parse tenant name!")

    return _get_tenant_config_for_tenant_name(tenant_name)


@logger.inject_lambda_context(
    correlation_id_path=correlation_paths.API_GATEWAY_REST, log_event=True
)
@tracer.capture_lambda_handler
def handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
