# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import botocore
import os
import json
import time
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
)

cors_config = CORSConfig(allow_origin="*", max_age=300)
app = APIGatewayRestResolver(cors=cors_config)
tracer = Tracer()
logger = Logger(service="register-new-subscriber")

dynamodb = boto3.resource("dynamodb")
ses = boto3.client("ses", region_name="us-east-1")
metering_marketplace = boto3.client("meteringmarketplace", region_name="us-east-1")
marketplace_entitlement = boto3.client('marketplace-entitlement', region_name="us-east-1")
sqs = boto3.client("sqs")
event_bus = boto3.client('events')

new_subscribers_table = os.environ["NewSubscribersTableName"]
entitlement_queue_url = os.environ.get("EntitlementQueueUrl")
marketplace_seller_email = os.environ.get("MARKETPLACE_SELLER_EMAIL")
onboarding_detail_type = os.environ['ONBOARDING_DETAIL_TYPE']
eventbus_name = os.environ['EVENTBUS_NAME']
control_plane_event_source = os.environ['EVENT_SOURCE']

new_subscribers_table_handler = dynamodb.Table(new_subscribers_table)


@tracer.capture_method
def send_buyer_notification(contact_email):
    if not marketplace_seller_email:
        return

    body_html = """<!DOCTYPE html>
    <html>
    <head>
        <title>Welcome!</title>
    </head>
    <body>
        <h1>Welcome!</h1>
        <p>Thanks for purchasing</p>
        <p>We're thrilled to have you on board. Our team is hard at work setting up your account, please expect to hear from a member of our customer success team soon</p>
    </body>
    </html>"""

    body_text = "Welcome! Thanks for purchasing. We're thrilled to have you on board. Our team is hard at work setting up your account, please expect to hear from a member of our customer success team soon"

    ses.send_email(
        Destination={"ToAddresses": [contact_email]},
        Message={
            "Body": {"Html": {"Charset": "UTF-8", "Data": body_html}, "Text": {"Charset": "UTF-8", "Data": body_text}},
            "Subject": {"Charset": "UTF-8", "Data": "Welcome Email"},
        },
        Source=marketplace_seller_email,
    )


@app.post("/subscriber")
@tracer.capture_method
def register_new_subscriber():
    try:
        data = app.current_event.json_body
        reg_token = data.get("regToken")
        company_name = data.get("companyName")
        contact_person = data.get("contactPerson")
        contact_phone = data.get("contactPhone")
        contact_email = data.get("contactEmail")

        if not all([reg_token, company_name, contact_person, contact_phone, contact_email]):
            raise BadRequestError("Invalid request data")

        resolve_customer_response = metering_marketplace.resolve_customer(RegistrationToken=reg_token)
        customer_identifier = resolve_customer_response["CustomerIdentifier"]
        product_code = resolve_customer_response["ProductCode"]
        customer_aws_account_id = resolve_customer_response["CustomerAWSAccountId"]

        datetime = str(int(time.time()))

        new_subscriber_item = {
            "companyName": company_name,
            "contactPerson": contact_person,
            "contactPhone": contact_phone,
            "contactEmail": contact_email,
            "customerIdentifier": customer_identifier,
            "productCode": product_code,
            "customerAWSAccountID": customer_aws_account_id,
            "created": datetime,
        }
        new_subscribers_table_handler.put_item(
            Item=new_subscriber_item
        )

        # place message on sbt-aws event bus
        # to trigger onboarding process
        paginator = marketplace_entitlement.get_paginator('get_entitlements')
        page_iterator = paginator.paginate(
            ProductCode=product_code,
            Filter={
                "CUSTOMER_IDENTIFIER": [
                    customer_identifier
                ],
            },
        )
        entitlements = []
        for page in page_iterator:
            entitlements.append(page['Entitlements'])

        response = event_bus.put_events(
            Entries=[
                {
                    'EventBusName': eventbus_name,
                    'Source': control_plane_event_source,
                    'DetailType': onboarding_detail_type,
                    'Detail': json.dumps(
                        # add entitlements to inform sbt-aws onboarding process
                        new_subscriber_item | {
                            "entitlements": entitlements,
                        },
                        # to avoid datetime serialization issues
                        default=str
                    ),
                }
            ]
        )
        logger.info(response)

        if entitlement_queue_url:
            sqs.send_message(
                QueueUrl=entitlement_queue_url,
                MessageBody=f"""{{
                    "Type": "Notification",
                    "Message": {{
                        "action": "entitlement-updated",
                        "customer-identifier": "{customer_identifier}",
                        "product-code": "{product_code}"
                    }}
                }}""",
            )

        send_buyer_notification(contact_email)

        return {
            'message:': 'Success! Registration completed. You have purchased an ' +
            'enterprise product that requires some additional setup. A representative ' +
            'from our team will be contacting you within two business days ' +
            'with your account credentials. Please contact Support through our ' +
            'website if you have any questions.',
            'data': new_subscriber_item,
        }, HTTPStatus.CREATED

    except botocore.exceptions.ClientError as e:
        logger.exception(e)
        raise InternalServerError("Registration data not valid. Please try again, or contact support!")
    except Exception as e:
        logger.exception(e)
        raise InternalServerError("An unexpected error occurred. Please try again later.")


@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_REST, log_event=True)
@tracer.capture_lambda_handler
def lambda_handler(event, context):
    logger.debug(event)
    return app.resolve(event, context)