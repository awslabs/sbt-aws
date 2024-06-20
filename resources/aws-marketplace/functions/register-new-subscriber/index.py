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
events_client = boto3.client('events')

new_subscribers_table = os.environ["NEW_SUBSCRIBERS_TABLE_NAME"]
entitlement_queue_url = os.environ.get("ENTITLEMENT_QUEUE_URL")
marketplace_seller_email = os.environ.get("MARKETPLACE_SELLER_EMAIL")
required_fields = os.environ.get('REQUIRED_FIELDS', '').split(',')

eventbus_name = os.environ.get('EVENTBUS_NAME')
onboarding_detail_type = os.environ.get('ONBOARDING_DETAIL_TYPE')
control_plane_event_source = os.environ.get('EVENT_SOURCE')

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

        # The resulting `missing_fields` list will contain the names of any required
        # fields that are missing or have a falsy value in the `data` dictionary.
        missing_fields = [field for field in required_fields if field not in data or not data[field]]

        if missing_fields:
            raise BadRequestError(f"Missing required fields: {', '.join(missing_fields)}")

        # pop() so that it removes regToken from the data object
        reg_token = data.pop("regToken")

        contact_email = data.get("contactEmail")

        resolve_customer_response = metering_marketplace.resolve_customer(RegistrationToken=reg_token)
        customer_identifier = resolve_customer_response["CustomerIdentifier"]
        product_code = resolve_customer_response["ProductCode"]
        customer_aws_account_id = resolve_customer_response["CustomerAWSAccountId"]

        datetime = str(int(time.time()))

        new_subscriber_item = data | {
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

        if eventbus_name:
            response = events_client.put_events(
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
            'message': 'Success! Registration completed. You have purchased an ' +
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
