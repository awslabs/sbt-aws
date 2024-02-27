# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import json
import jsonpickle
import simplejson
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
                    body=encode_to_json_object(inputObject))

def  encode_to_json_object(inputObject):
    jsonpickle.set_encoder_options('simplejson', use_decimal=True, sort_keys=True)
    jsonpickle.set_preferred_backend('simplejson')
    return jsonpickle.encode(inputObject, unpicklable=False, use_decimal=True)





