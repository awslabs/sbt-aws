import os
import boto3
from decimal import Decimal
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities.typing import LambdaContext
from datetime import datetime
from botocore.exceptions import ClientError

logger = Logger()
dynamodb = boto3.resource("dynamodb")
data_repository = dynamodb.Table(os.environ["DATA_REPOSITORY"])
billing_table = dynamodb.Table(os.environ["BILLING_TABLE"])


@logger.inject_lambda_context
def handler(event: dict, context: LambdaContext):
    logger.info("Starting put-usage function")

    current_period = str(int(datetime.now().timestamp()))

    scan_kwargs = {}
    done = False
    start_key = None
    while not done:
        if start_key:
            scan_kwargs["ExclusiveStartKey"] = start_key
        try:
            response = data_repository.scan(**scan_kwargs)
            for item in response.get("Items", []):
                process_item(item, current_period)
            start_key = response.get("LastEvaluatedKey", None)
            done = start_key is None
        except ClientError as e:
            logger.exception(f"Error scanning data repository: {e}")

    return {
        "statusCode": 200,
        "body": "Usage data processed and billing records updated",
    }


def process_item(item, current_period):
    tenant_id = item["tenantId"]

    try:
        # Atomic delete and retrieve operation
        old_item = data_repository.delete_item(
            Key={"tenantId": tenant_id}, ReturnValues="ALL_OLD"
        )["Attributes"]

        usage = {k: v for k, v in old_item.items() if k not in ["tenantId"]}

        billing_table.put_item(
            Item={
                "tenantId": tenant_id,
                "billingPeriod": current_period,
            }
            | usage
        )
        logger.info(f"Updated billing record for tenant {tenant_id}")
    except ClientError as e:
        logger.exception(
            f"Error processing and updating billing record for tenant {tenant_id}: {e}"
        )
