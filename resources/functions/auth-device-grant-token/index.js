/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

console.log("Loading function");
const common = require( __dirname + '/Modules/common.js');
const tokenP = require( __dirname + '/Modules/token-path.js');
const deviceP = require( __dirname + '/Modules/device-path.js');
const callbackP = require( __dirname + '/Modules/callback-path.js');
const authzP = require( __dirname + '/Modules/authorization-path.js');

exports.handler = (event, context, callback) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    //Initialize default settings if needed
    if (!process.env.CODE_EXPIRATION || process.env.CODE_EXPIRATION == '') process.env.CODE_EXPIRATION = "1800";
    if (!process.env.DYNAMODB_TABLE || process.env.DYNAMODB_TABLE == '') process.env.DYNAMODB_TABLE = "DeviceGrant";
    if (!process.env.DYNAMODB_AUTHZ_STATE_INDEX || process.env.DYNAMODB_AUTHZ_STATE_INDEX == '') process.env.DYNAMODB_AUTHZ_STATE_INDEX = "AuthZ_state-index";
    if (!process.env.DYNAMODB_USERCODE_INDEX || process.env.DYNAMODB_USERCODE_INDEX == '') process.env.DYNAMODB_USERCODE_INDEX = "User_code-index";
    if (!process.env.POLLING_INTERVAL || process.env.POLLING_INTERVAL == '') process.env.POLLING_INTERVAL = "5";
    if (!process.env.DEVICE_CODE_FORMAT || process.env.DEVICE_CODE_FORMAT == '') process.env.DEVICE_CODE_FORMAT = "#aA";
    if (!process.env.DEVICE_CODE_LENGTH || process.env.DEVICE_CODE_LENGTH == '') process.env.DEVICE_CODE_LENGTH = "64";
    if (!process.env.USER_CODE_FORMAT || process.env.USER_CODE_FORMAT == '') process.env.USER_CODE_FORMAT = "#B";
    if (!process.env.USER_CODE_LENGTH || process.env.USER_CODE_LENGTH == '') process.env.USER_CODE_LENGTH = "8";
    if (!process.env.RESULT_TOKEN_SET || process.env.RESULT_TOKEN_SET == '') process.env.RESULT_TOKEN_SET = "ACCESS+REFRESH";

    switch(event.path) {
        //Call the Token endpoint either for getting codes or using a device code to get a JWTs
        case '/token':
            // If it is a POST on /token with client_id provided
            if(event.httpMethod == 'POST' && event.queryStringParameters.client_id && event.queryStringParameters.client_id != '') {
                tokenP.processPostRequest(event, callback);
            } else { // If it is something else than a POST on /token with client_id provided
                console.log("Unsupported Call on /token");
                common.returnJSONError(405, callback);
            }
            break;

        case "/device":
            if(event.httpMethod == 'GET') {
                // This is a POST Call on /device whit represent the end user wanting 
                // to delegate access to a device by providing the User code
                if (event.headers['x-amzn-oidc-accesstoken'] && event.headers['x-amzn-oidc-accesstoken'] != '' && event.headers["x-amzn-oidc-data"] &&  event.headers["x-amzn-oidc-data"] != '') {
                    // If the request contains Authorize and Code as Query Parameters
                    if (event.queryStringParameters.authorize && event.queryStringParameters.authorize != '' && event.queryStringParameters.code && event.queryStringParameters.code != '' ) {
                        // If Code Query Parameter is NULL
                        if ( event.queryStringParameters.code == '' ) {
                             console.log("End user submitted an empty user code");
                             common.returnExpiredUserCodeError(callback);
                        } else {
                            // If Code Query Parameter is not NULL
                            deviceP.requestUserCodeProcessing(event, callback);
                        }
                    } else {
                        // If the request does not contain Authorize and Code as Query Parameters
                        // The end user has been authenticated at the ALB and the Access token flows to the /device endpoint
                        deviceP.requestUI(event, callback);
                    }
                } else {
                    // Request went through ALB but miss the necessary Access Token
                    console.log("Call passed to /device without x-amzn-oidc-accesstoken ");
                    common.returnJSONError(405, callback);
                }
            } else {
                // If it is something else than a GET on /device
                console.log("Unsupported Call on /device");
                common.returnJSONError(405, callback);
            }
            break;
        
        case "/callback":
            if(event.httpMethod == 'GET') {
                if (event.queryStringParameters.code && event.queryStringParameters.code  != '' && event.queryStringParameters.state && event.queryStringParameters.state != '' ) {
                    callbackP.processAuthZCodeCallback(event, callback);
                } else {
                    // ÉMissing necessary Query Parameter
                    console.log("Unsupported Call on /callback");
                    common.returnJSONError(405, callback);
                }
            } else {
                // If it is something else than a GET on /callback
                console.log("Unsupported Call on /callback");
                common.returnJSONError(405, callback);
            }
            break;
        
        default:
            // If it is an unsupported call to this API
            console.log("Unsupported Call");
            common.returnJSONError(405, callback);
    } 
};