import os
import boto3
from botocore.exceptions import ClientError
from http import HTTPStatus
from boto3.dynamodb.conditions import Attr
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler import APIGatewayHttpResolver
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_requests_auth.boto_utils import BotoAWSRequestsAuth
import requests
import uuid
import json

app = APIGatewayHttpResolver()
tracer = Tracer()
logger = Logger()
dynamodb = boto3.resource("dynamodb")
tenant_registration_table = dynamodb.Table(os.environ["TENANT_REGISTRATION_TABLE_NAME"])

event_bus = boto3.client("events")
eventbus_name = os.environ["EVENTBUS_NAME"]
event_source = os.environ["EVENT_SOURCE"]
onboarding_detail_type = os.environ["ONBOARDING_DETAIL_TYPE"]
offboarding_detail_type = os.environ["OFFBOARDING_DETAIL_TYPE"]

tenant_api_url = os.environ["TENANT_API_URL"]
auth = BotoAWSRequestsAuth(
    # '${API_ID}.execute-api.${REGION}.amazonaws.com'
    aws_host=tenant_api_url.split("/")[-2],
    aws_region=os.environ["AWS_REGION"],
    aws_service="execute-api",
)


@app.post("/tenant-registrations")
@tracer.capture_method
def create_tenant_registration():
    json_body = app.current_event.json_body
    tenant_registration_id = str(uuid.uuid4())
    tenant_data = json_body.get("tenantData", {})
    tenant_registration_data = json_body.get("tenantRegistrationData", {})

    # Create tenant registration
    tenant_registration_item = {
        "tenantRegistrationId": tenant_registration_id,
        "sbtaws_active": True,
    } | tenant_registration_data

    try:
        tenant_registration_table.put_item(
            Item=tenant_registration_item,
            ConditionExpression=Attr("tenantRegistrationId").not_exists(),
        )
    except ClientError as e:
        logger.error(f"Error creating tenant registration: {str(e)}")
        return {"message": "Internal server error"}, HTTPStatus.INTERNAL_SERVER_ERROR

    response = requests.post(f"{tenant_api_url}tenants", json=tenant_data, auth=auth)
    if response.status_code != HTTPStatus.CREATED:
        return {"message": "Failed to create tenant"}, HTTPStatus.INTERNAL_SERVER_ERROR

    tenant_id = response.json()["data"]["tenantId"]
    # add tenant id to the tenant-registration after creating it to ensure
    # that the tenant registration is created without issue
    __update_tenant_registration(tenant_registration_id, {"tenantId": tenant_id})

    __create_control_plane_event(
        json.dumps(
            tenant_registration_data
            | tenant_data
            | {"tenantId": tenant_id, "tenantRegistrationId": tenant_registration_id}
        ),
        onboarding_detail_type,
    )

    return {
        "tenantRegistrationId": tenant_registration_id,
        "tenantId": tenant_id,
        "message": "Tenant registration initiated",
    }, HTTPStatus.CREATED


@app.get("/tenant-registrations/<tenant_registration_id>")
@tracer.capture_method
def get_tenant_registration(tenant_registration_id: str):
    try:
        response = tenant_registration_table.get_item(
            Key={"tenantRegistrationId": tenant_registration_id}
        )
    except ClientError as e:
        logger.error(f"Error deleting tenant registration: {str(e)}")
        return {"message": "Internal server error"}, HTTPStatus.INTERNAL_SERVER_ERROR

    if "Item" not in response:
        return {"message": "Tenant registration not found."}, HTTPStatus.NOT_FOUND

    return response["Item"]


def __update_tenant_registration(tenant_registration_id, update_data):
    update_expression = "SET " + ", ".join(f"#{k}=:{k}" for k in update_data.keys())
    expression_attribute_names = {f"#{k}": k for k in update_data.keys()}
    expression_attribute_values = {f":{k}": v for k, v in update_data.items()}

    return tenant_registration_table.update_item(
        Key={"tenantRegistrationId": tenant_registration_id},
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
        ConditionExpression=Attr("tenantRegistrationId").exists(),
        ReturnValues="ALL_NEW",
    )


@app.patch("/tenant-registrations/<tenant_registration_id>")
@tracer.capture_method
def update_tenant_registration(tenant_registration_id: str):
    update_data = app.current_event.json_body
    logger.info(f"Update data: {update_data}")
    logger.info(f"tenantRegistrationData: {update_data.get("tenantRegistrationData", {})}")
    logger.info(f"tenantData: {update_data.get("tenantData", {})}")
    try:
        tenant_id = None
        if update_data.get("tenantRegistrationData", {}) == {}:
            tenant_registration = tenant_registration_table.get_item(
                Key={"tenantRegistrationId": tenant_registration_id}
            )
            tenant_id = tenant_registration["Item"].get("tenantId")
            if not tenant_id:
                return {
                    "message": "Tenant ID not found for this registration"
                }, HTTPStatus.BAD_REQUEST
        else:
            tenant_registration = __update_tenant_registration(
                tenant_registration_id, update_data.get("tenantRegistrationData", {})
            )
            tenant_id = tenant_registration['Attributes']['tenantId']

        logger.info(f"url: {tenant_api_url}tenants/{tenant_id}")
        if update_data.get("tenantData", {}) != {}:
            update_response = requests.put(
                f"{tenant_api_url}tenants/{tenant_id}",
                json=update_data.get("tenantData"),
                auth=auth,
            )
            if update_response.status_code != 200:
                logger.error(
                    f"Error updating tenant: {update_response.json()}"
                )
                return {
                    "message": "Failed to update tenant"
                }, HTTPStatus.INTERNAL_SERVER_ERROR

        return {"message": "Tenant registration updated successfully"}
    except ClientError as e:
        logger.error(f"Error updating tenant registration: {str(e)}")
        return {"message": "Internal server error"}, HTTPStatus.INTERNAL_SERVER_ERROR


@app.delete("/tenant-registrations/<tenant_registration_id>")
@tracer.capture_method
def delete_tenant_registration(tenant_registration_id: str):
    try:
        response = tenant_registration_table.get_item(
            Key={"tenantRegistrationId": tenant_registration_id}
        )
        if "Item" not in response:
            return {"message": "Tenant registration not found."}, HTTPStatus.NOT_FOUND

        tenant_id = response["Item"].get("tenantId")
        if not tenant_id:
            return {
                "message": "Tenant ID not found for this registration"
            }, HTTPStatus.BAD_REQUEST

        # Delete tenant using the tenant management API
        delete_response = requests.delete(
            f"{tenant_api_url}tenants/{tenant_id}", auth=auth
        )
        if delete_response.status_code != 200:
            return {
                "message": "Failed to delete tenant"
            }, HTTPStatus.INTERNAL_SERVER_ERROR

        __update_tenant_registration(
            tenant_registration_id,
            {
                "sbtaws_active": False,
            },
        )

        __create_control_plane_event(
            json.dumps(delete_response.json()["data"] | response["Item"]),
            offboarding_detail_type,
        )

        return {"message": "Tenant registration deletion initiated"}
    except ClientError as e:
        logger.error(f"Error deleting tenant registration: {str(e)}")
        return {"message": "Internal server error"}, HTTPStatus.INTERNAL_SERVER_ERROR


def __create_control_plane_event(event_details, detail_type):
    response = event_bus.put_events(
        Entries=[
            {
                "EventBusName": eventbus_name,
                "Source": event_source,
                "DetailType": detail_type,
                "Detail": event_details,
            }
        ]
    )
    logger.info(response)


@logger.inject_lambda_context
@tracer.capture_lambda_handler
def handler(event: dict, context: LambdaContext) -> dict:
    logger.info(event)
    return app.resolve(event, context)
