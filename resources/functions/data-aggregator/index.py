from aws_lambda_powertools.utilities.data_classes import event_source, S3Event
from urllib.parse import unquote_plus
import boto3  # relying on lambda runtime to provide boto3 https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
import os
from aws_lambda_powertools import Logger
from aws_lambda_powertools import Tracer
import json
import jmespath

tracer = Tracer()
logger = Logger(service=os.environ['SERVICE_NAME'])
dynamodb = boto3.resource("dynamodb")
s3_client = boto3.client('s3')
data_table = dynamodb.Table(os.environ['DATA_TABLE'])
primary_key_column = os.environ['PRIMARY_KEY_COLUMN']
primary_key_path = os.environ['PRIMARY_KEY_PATH']
aggregate_key_path = os.environ['AGGREGATE_KEY_PATH']
aggregate_value_path = os.environ['AGGREGATE_VALUE_PATH']


@event_source(data_class=S3Event)
def handler(event: S3Event, context):
    bucket_name = event.bucket_name
    logger.info(event)

    # Multiple records can be delivered in a single event
    for record in event.records:
        object_key = unquote_plus(record.s3.get_object.key)
        obj = s3_client.get_object(Bucket=event.bucket_name, Key=object_key)
        lines = obj['Body'].read().decode('utf-8').splitlines()

        for line in lines:
            logger.info(line)
            data = json.loads(line)
            logger.info(data)

            primary_key = jmespath.search(primary_key_path, data)
            aggregate_key = jmespath.search(aggregate_key_path, data)
            aggregate_value = jmespath.search(aggregate_value_path, data)

            logger.info(f"primary_key: {primary_key}")
            logger.info(f"aggregate_key: {aggregate_key}")
            logger.info(f"aggregate_value: {aggregate_value}")
            if primary_key is None or aggregate_key is None or aggregate_value is None:
                logger.info(f"Skipping line {line}. Required data not found.")
                continue

            # perform the following as an atomic operation
            # i.e., read and update in one-go
            # if we break it up into 2 operations, it's possible
            # that after we read, another process updates the aggregate_value
            # so then adding to the value that we just read would result
            # in the wrong sum.
            response = data_table.update_item(
                Key={primary_key_column: primary_key},
                UpdateExpression=f"SET {aggregate_key} = if_not_exists({aggregate_key}, :default_val) + :val",
                ExpressionAttributeValues={':val': int(aggregate_value), ':default_val': 0}
            )
            logger.info(f"update response: {response}")

        logger.info(f"{bucket_name}/{object_key}")
