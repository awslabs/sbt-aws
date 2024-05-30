# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import event_source, DynamoDBStreamEvent
import os
import json
import boto3
from aws_lambda_powertools import Logger, Tracer

logger = Logger(service='dynamodb-stream-handler')
tracer = Tracer(service='dynamodb-stream-handler')

sns = boto3.client('sns')
topic_arn = os.environ.get('SupportSNSArn')

events_client = boto3.client('events')
eventbus_name = os.environ.get('EVENTBUS_NAME')
control_plane_event_source = os.environ.get('EVENT_SOURCE')
offboarding_detail_type = os.environ.get('OFFBOARDING_DETAIL_TYPE')


@logger.inject_lambda_context
@tracer.capture_lambda_handler
@event_source(data_class=DynamoDBStreamEvent)
def lambda_handler(event: DynamoDBStreamEvent, context: LambdaContext):
    for record in event.records:
        old_image = {} if record.dynamodb.old_image is None else record.dynamodb.old_image
        new_image = {} if record.dynamodb.new_image is None else record.dynamodb.new_image

        logger.debug({'old_image': old_image, 'new_image': new_image})

        grant_access = (
            new_image.get('successfully_subscribed') is True
            and 'is_free_trial_term_present' in new_image
            and (
                old_image.get('successfully_subscribed') is not True
                or 'is_free_trial_term_present' not in old_image
            )
        )

        revoke_access = (
            new_image.get('subscription_expired') is True
            and old_image.get('subscription_expired') is not True
        )

        entitlement_updated = (
            new_image.get('entitlement') != old_image.get('entitlement')
            if 'entitlement' in new_image and 'entitlement' in old_image
            else False
        )

        logger.debug(
            {
                'grant_access': grant_access,
                'revoke_access': revoke_access,
                'entitlement_updated': entitlement_updated,
            }
        )

        if grant_access or revoke_access or entitlement_updated:
            subject = ''
            message = ''

            if grant_access:
                subject = 'New AWS Marketplace Subscriber'
                message = f'subscribe-success: {json.dumps(new_image)}'

            elif revoke_access:
                subject = 'AWS Marketplace customer end of subscription'
                message = f'unsubscribe-success: {json.dumps(new_image)}'
                if eventbus_name:
                    response = events_client.put_events(
                        Entries=[
                            {
                                'EventBusName': eventbus_name,
                                'Source': control_plane_event_source,
                                'DetailType': offboarding_detail_type,
                                'Detail': json.dumps(new_image),
                            }
                        ]
                    )
                    logger.info(response)

            elif entitlement_updated:
                subject = 'AWS Marketplace customer change of subscription'
                message = f'entitlement-updated: {json.dumps(new_image)}'

            sns_params = {
                'TopicArn': topic_arn,
                'Subject': subject,
                'Message': message,
            }

            logger.info('Sending notification')
            logger.debug({'sns_params': sns_params})
            sns.publish(**sns_params)

    return {}
