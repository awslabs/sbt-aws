import os
import boto3
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import EventBridgeEvent
from botocore.exceptions import ClientError

logger = Logger()
dynamodb = boto3.resource("dynamodb")
CUSTOMERS_TABLE = os.environ["CUSTOMERS_TABLE"]
TENANT_INDEX_NAME = os.environ["TENANT_INDEX_NAME"]
customers_table = dynamodb.Table(CUSTOMERS_TABLE)


@logger.inject_lambda_context
def handler(event: EventBridgeEvent, context: LambdaContext):
    logger.info(f"Received event: {event}")

    tenant_id = event["detail"]["tenantId"]

    try:
        # First, query the table to get the customerId
        response = customers_table.query(
            IndexName=TENANT_INDEX_NAME,
            KeyConditionExpression="tenantId = :tenantId",
            ExpressionAttributeValues={":tenantId": tenant_id},
        )

        if response["Items"]:
            customer_id = response["Items"][0]["customerId"]
            customers_table.delete_item(Key={"customerId": customer_id})
            logger.info(f"Deleted customer: {tenant_id} with customerId: {customer_id}")
        else:
            logger.warning(f"Customer not found: {tenant_id}")
            return {
                "statusCode": 404,
                "body": f"Customer not found for tenant {tenant_id}",
            }

    except ClientError as e:
        logger.exception(f"Error deleting customer: {e}")

    return {"statusCode": 200, "body": f"Customer deleted for tenant {tenant_id}"}
