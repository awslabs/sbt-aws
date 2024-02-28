# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import os
from http import HTTPStatus
import uuid

import boto3
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler import (APIGatewayRestResolver,
                                                 CORSConfig)
from aws_lambda_powertools.logging import correlation_paths
from models.control_plane_event_types import ControlPlaneEventTypes

tracer = Tracer()
logger = Logger()
# TODO Make sure we fill in an appropriate origin for this call (the CloudFront domain)
cors_config = CORSConfig(allow_origin="*", max_age=300)
app = APIGatewayRestResolver(cors=cors_config)

event_bus = boto3.client('events')
eventbus_name = os.environ['EVENTBUS_NAME']
event_source = os.environ['EVENT_SOURCE']
dynamodb = boto3.resource('dynamodb')
tenant_details_table = dynamodb.Table(os.environ['TENANT_DETAILS_TABLE'])


@app.post("/tenants")
@tracer.capture_method
def create_tenant():
    input_details = app.current_event.json_body
    input_item = {}
    input_details['tenantId'] = str(uuid.uuid4())

    logger.info("Request received to create new tenant")

    try:
        for key, value in input_details.items():
            input_item[key] = value

        input_item['isActive'] = True

        response = tenant_details_table.put_item(Item=input_item)
        __create_control_plane_event(
            json.dumps(input_details), ControlPlaneEventTypes.ONBOARDING.value)

    except Exception as e:
        raise Exception("Error creating a new tenant", e)
    else:
        return "New tenant created", HTTPStatus.OK


@app.get("/tenants")
@tracer.capture_method
def get_tenants():
    logger.info("Request received to get all tenants")
    try:
        response = tenant_details_table.scan()
    except Exception as e:
        raise Exception('Error getting all tenants', e)
    else:
        return response['Items'], HTTPStatus.OK


@app.get("/tenants/<tenantId>")
@tracer.capture_method
def get_tenant(tenantId):
    logger.info("Request received to get a tenant")
    try:
        response = tenant_details_table.get_item(Key={'tenantId': tenantId})
    except Exception as e:
        raise Exception('Error getting tenant', e)
    else:
        return response['Item'], HTTPStatus.OK


@app.put("/tenants/<tenantId>")
@tracer.capture_method
def update_tenant(tenantId):
    logger.info("Request received to update a tenant")
    input_details = app.current_event.json_body

    try:
        __update_tenant(tenantId, input_details)
    except Exception as e:
        raise Exception("Error updating a tenant", e)
    else:
        return "Tenant updated", HTTPStatus.OK


@app.delete("/tenants/<tenantId>")
@tracer.capture_method
def delete_tenant(tenantId):
    logger.info("Request received to delete a tenant")
    input_details = {**app.current_event.json_body, 'tenantStatus': 'Deleting'}

    try:
        __update_tenant(tenantId, input_details)
        __create_control_plane_event(
            json.dumps(input_details), ControlPlaneEventTypes.OFFBOARDING.value)
    except Exception as e:
        raise Exception("Error deleting a tenant", e)
    else:
        return 'Successsfuly sent offboarding message to application plane', HTTPStatus.OK


def __update_tenant(tenantId, tenant):
    # Remove the tenantId if the incoming object has one
    input_details = {key: tenant[key] for key in tenant if key != 'tenantId'}
    update_expression = []
    update_expression.append("set ")
    expression_attribute_values = {}
    for key, value in input_details.items():
        key_variable = f":{key}Variable"
        update_expression.append(''.join([key, " = ", key_variable]))
        update_expression.append(",")
        expression_attribute_values[key_variable] = value

    # remove the last comma
    update_expression.pop()

    response_update = tenant_details_table.update_item(
        Key={
            'tenantId': tenantId,
        },
        UpdateExpression=''.join(update_expression),
        ExpressionAttributeValues=expression_attribute_values,
        ReturnValues="UPDATED_NEW"
    )


@app.put("/tenants/<tenantId>/deactivate")
@tracer.capture_method
def deactivate_tenant(tenantId):
    logger.info("Request received to deactivate a tenant")

    try:
        response = tenant_details_table.update_item(
            Key={
                'tenantId': tenantId,
            },
            UpdateExpression="set isActive = :isActive",
            ExpressionAttributeValues={
                ':isActive': False
            },
            ReturnValues="ALL_NEW"
        )

        __create_control_plane_event(
            json.dumps({"tenantId": tenantId}), ControlPlaneEventTypes.DEACTIVATE.value)
    except Exception as e:
        raise Exception("Error while deactivating a tenant", e)

    else:
        return "Tenant deactivated", HTTPStatus.OK


@app.put("/tenants/<tenantId>/activate")
@tracer.capture_method
def activate_tenant(tenantId):
    logger.info("Request received to activate a tenant")

    try:
        response = tenant_details_table.update_item(
            Key={
                'tenantId': tenantId,
            },
            UpdateExpression="set isActive = :isActive",
            ExpressionAttributeValues={
                ':isActive': True
            },
            ReturnValues="ALL_NEW"
        )

        __create_control_plane_event(json.dumps(
            response['Attributes']), ControlPlaneEventTypes.ACTIVATE.value)
    except Exception as e:
        raise Exception("Error while activating a tenant", e)

    else:
        return "Tenant activated", HTTPStatus.OK


def __create_control_plane_event(eventDetails, eventType):
    response = event_bus.put_events(
        Entries=[
            {
                'EventBusName': eventbus_name,
                'Source': event_source,
                'DetailType': eventType,
                'Detail': eventDetails,
            }
        ]
    )
    logger.info(response)


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST, log_event=True)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)
