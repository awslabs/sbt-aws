import os
import boto3
import uuid
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent
from botocore.exceptions import ClientError

logger = Logger()
dynamodb = boto3.resource("dynamodb")
CUSTOMERS_TABLE = os.environ["CUSTOMERS_TABLE"]
customers_table = dynamodb.Table(CUSTOMERS_TABLE)


@logger.inject_lambda_context
def handler(event: EventBridgeEvent, context: LambdaContext):
    logger.info(f"Received event: {event}")

    tenant_id = event["detail"]["tenantId"]
    tenant_email = event["detail"]["email"]
    customer_id = str(uuid.uuid4())  # Generate a new customerId

    try:
        customers_table.put_item(
            Item={
                "customerId": customer_id,
                "email": tenant_email,
                "tenantId": tenant_id,
            }
        )
        logger.info(f"Created customer: {tenant_email} with customerId: {customer_id}")
    except ClientError as e:
        logger.exception(f"Error creating customer: {e}")

    return {
        "statusCode": 200,
        "body": f"Customer created for tenant {tenant_id} with customerId {customer_id}",
    }
