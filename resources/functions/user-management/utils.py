# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
from http import HTTPStatus
from aws_lambda_powertools.event_handler import (Response, 
                                                content_types)
def create_success_response(message):
    return Response(status_code=HTTPStatus.OK.value,
                    content_type=content_types.APPLICATION_JSON,
                    body=json.dumps({"response": message}))

def generate_response(inputObject):
    return Response(status_code=HTTPStatus.OK.value,
                    content_type=content_types.APPLICATION_JSON,
                    body=json.dumps(inputObject))