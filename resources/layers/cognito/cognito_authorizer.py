# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

from abstract_classes.idp_authorizer_abstract_class import IdpAuthorizerAbstractClass
import json
import boto3
import time
from jose import jwk, jwt
from jose.utils import base64url_decode
import urllib.request
from aws_lambda_powertools import Logger

logger = Logger()

region = boto3.session.Session().region_name


class CognitoAuthorizer(IdpAuthorizerAbstractClass):
    def validateJWT(self, event):

        input_details = event

        token = input_details['jwtToken']
        idp_details = input_details['idpDetails']
        user_pool_id = idp_details['idp']['userPoolId']
        app_client_id = idp_details['idp']['clientId']

        keys_url = 'https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json'.format(
            region, user_pool_id)
        with urllib.request.urlopen(keys_url) as f:  # nosec B310 # keys_url defined above with https://
            response = f.read()
        keys = json.loads(response.decode('utf-8'))['keys']

        response = self.__validateCognitoJWT(token, app_client_id, keys)

        return response

    def __validateCognitoJWT(self, token, app_client_id, keys):
        # get the kid from the headers prior to verification
        headers = jwt.get_unverified_headers(token)
        kid = headers['kid']
        # search for the kid in the downloaded public keys
        key_index = -1
        for i in range(len(keys)):
            if kid == keys[i]['kid']:
                key_index = i
                break
        if key_index == -1:
            logger.info('Public key not found in jwks.json')
            return False
        # construct the public key
        public_key = jwk.construct(keys[key_index])
        # get the last two sections of the token,
        # message and signature (encoded in base64)
        message, encoded_signature = str(token).rsplit('.', 1)
        # decode the signature
        decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
        # verify the signature
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            logger.info('Signature verification failed')
            return False
        logger.info('Signature successfully verified')
        # since we passed the verification, we can now safely
        # use the unverified claims
        claims = jwt.get_unverified_claims(token)
        # additionally we can verify the token expiration
        if time.time() > claims['exp']:
            logger.info('Token is expired')
            return False
        # and the Audience  (use claims['client_id'] if verifying an access token)
        if claims['aud'] != app_client_id:
            logger.info('Token was not issued for this audience')
            return False
        # now we can use the claims
        logger.info(claims)
        return claims
