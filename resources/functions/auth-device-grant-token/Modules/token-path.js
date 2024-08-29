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
//Reference to Commnon library
const common = require( __dirname + '/common.js');

const { CognitoIdentityProvider } = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

//Reference to https library for retrieving JWT tokens from Cognito using the Athorization Code grant flow with PKCE
const https = require('https');

var cognitoidentityserviceprovider = new CognitoIdentityProvider({
    // The transformation for apiVersions is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for apiVersions.
    // The transformation for apiVersions is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for apiVersions.
    apiVersions: {
        cognitoidentityserviceprovider: '2016-04-18',
    },
});
var dynamodb = new DynamoDB({
    // The transformation for apiVersions is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for apiVersions.
    // The transformation for apiVersions is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for apiVersions.
    apiVersions: {
        dynamodb: '2012-08-10',
    },
});

//Function to process a POST request pm /token
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function processPostRequest(event, callback) {

    //Preparing the request to acquire Cognito Client App configuration
    var params = {
        ClientId: event.queryStringParameters.client_id,
        UserPoolId: process.env.CUP_ID,
    };

    //Acquiring Cognito Client App configuration
    cognitoidentityserviceprovider.describeUserPoolClient(params, function(err, data) {
        if (err) { 
            console.log("There was an error acquiring the Cognito Client App configuration " + event.queryStringParameters.client_id);
            console.log(err, err.stack);
            common.returnJSONError(401, callback);
        } else {
            console.log("Acquired Cognito Client App Configuration");
            //Configuration has been acquired
            // An Authorization header has been provided, so this is a OAuth2 private client
            if (event.headers.authorization && event.headers.authorization != '') {
                    console.log("this is a Private Client");
                    //If it is a Basic Authentication value in the Authorization header
                    if (event.headers.authorization.startsWith("Basic ")){
                        console.log("Private Client has a Basic Authorizaiton header")
                        var HeaderClientAppId = common.base64Decode(event.headers.authorization.replace("Basic ", "")).split(':')[0];
                        var HeaderClientAppSecret = common.base64Decode(event.headers.authorization.replace("Basic ", "")).split(':')[1];
                        
                        //Check if there is no credentials abuse
                        if (HeaderClientAppId == event.queryStringParameters.client_id && HeaderClientAppId != "") {
                            //Check if header matches the Cognito Client App Configuration
                            if (HeaderClientAppId == data.UserPoolClient.ClientId  && HeaderClientAppSecret == data.UserPoolClient.ClientSecret && HeaderClientAppSecret != "") {
                                console.log("Authorization header is valid");
                                if (!event.queryStringParameters.device_code && !event.queryStringParameters.grant_type) {
                                    // If it is a POST on /token with valid client_id but no code parameter and no grant type, this is a request for codes
                                    requestSetOfCodes(event, callback);
                                } else if (event.queryStringParameters.device_code && event.queryStringParameters.device_code != '' &&event.queryStringParameters.grant_type == "urn:ietf:params:oauth:grant-type:device_code") {
                                    // If it is a POST on /token with valid client_id, a code parameter, and a grant type being "urn:ietf:params:oauth:grant-type:device_code", this is a request to get JWTs with a device code
                                    requestJWTs(event, callback);
                                } else {
                                    // If it is a POST on /token with valid client_id but missing a
                                    // code parameter or a grant type being "urn:ietf:params:oauth:grant-type:device_code",
                                    // this is a bad request
                                    console.log("POST Call on /token with valid client_id but missing code or correct grant type");
                                    common.returnJSONError(405, callback);
                                }
                            } else {
                                console.log("Authorization header is unvalid");
                                console.log("POST Call on /token with invalid client_id");
                                common.returnJSONError(401, callback);
                            }
                        } else {
                            console.log("Authorization header Client Id does not match paramater Client Id");
                            console.log("POST Call on /token with invalid client_id");
                            common.returnJSONError(401, callback);
                        }
                        
                    //If something else, it is not supported
                    } else {
                        console.log("Authorization header is using an unsupported authentication scheme");
                        console.log("POST Call on /token with invalid client_id");
                        common.returnJSONError(401, callback);
                    }
            // Otherwise this is a OAuth2 public client
            } else {
                //Check if request matches the Cognito Client App Configuration
                if (HeaderClientAppId == data.UserPoolClient.ClientId  && data.UserPoolClient.ClientSecret == "") {
                    console.log("Cognito Client App configuration is valid");
                    if (!event.queryStringParameters.device_code && !event.queryStringParameters.grant_type) {
                        // If it is a POST on /token with valid client_id but no code parameter and no grant type, this is a request for codes
                        requestSetOfCodes(event, callback);
                    } else if (event.queryStringParameters.device_code && event.queryStringParameters.device_code != '' && event.queryStringParameters.grant_type == "urn:ietf:params:oauth:grant-type:device_code") {
                        // If it is a POST on /token with valid client_id, a code parameter, and a grant type being "urn:ietf:params:oauth:grant-type:device_code", this is a request to get JWTs with a device code
                        requestJWTs(event, callback);
                    } else {
                        // If it is a POST on /token with valid client_id but missing a
                        // code parameter or a grant type being "urn:ietf:params:oauth:grant-type:device_code",
                        // this is a bad request
                        console.log("POST Call on /token with valid client_id but missing code or correct grant type");
                        common.returnJSONError(405, callback);
                    }
                } else {
                    console.log("Cognito Client App configuration is a private client while request try to pass as a public client");
                    console.log("POST Call on /token with invalid client_id");
                    common.returnJSONError(401, callback);
                }
            }
        }
    });
}

//Function that processes request by a client applicaiton to get codes generated
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function requestSetOfCodes(event, callback) {
    // Generating the user code (a unique code to return to the end user) and device code (a unique code for future device calls)
    var user_code = common.randomString(process.env.USER_CODE_LENGTH, process.env.USER_CODE_FORMAT);
    var device_code = common.randomString(process.env.DEVICE_CODE_LENGTH, process.env.DEVICE_CODE_FORMAT);
    var scope = 'openid';
    
    // Creating a JSON structure to return codes to the device
    var codes = {
        device_code: device_code,
        user_code: user_code,
        verification_uri: "https://" + process.env.CODE_VERIFICATION_URI + "/device",
        verification_uri_complete: "https://" + process.env.CODE_VERIFICATION_URI + "/device?code=" + user_code + "&authorize=true",
        interval: parseInt(process.env.POLLING_INTERVAL),
        expires_in: parseInt(process.env.CODE_EXPIRATION)
    };

    if (event.queryStringParameters.scope && event.queryStringParameters.scope != '' ) {
        scope = event.queryStringParameters.scope;
    } else {
        scope = 'openid';
    }

    // Prepare the stroage of the codes in the DynamoDB table
    var DynamoDBParams = {
        Item: {
            "Device_code": {
                S: device_code
            },
            "User_code": {
                S: user_code
            },
            "Status": {
                S: "authorization_pending"
            },
            "Client_id": {
                S: event.queryStringParameters.client_id
            },
            "Max_expiry": {
                S: (Date.now() + process.env.CODE_EXPIRATION * 1000).toString()
            },
            "Last_checked": {
                S: (Date.now()).toString()
            },
            "Scope":  {
                S: scope
            }
        },
        ReturnConsumedCapacity: "TOTAL", 
        TableName: process.env.DYNAMODB_TABLE
    };
    // Insert the item in DynamoDB
    dynamodb.putItem(DynamoDBParams, function(err, data) {
        if (err) {
            //There was an error
            console.log(err, err.stack);
            console.log("Error inserting Codes item in the DynamoDB table");
            common.returnJSONError(500, callback);
        } else {
            //Successful, the Authorization request has been written to the DynamoDB table
            console.log("Inserting Codes item in the DynamoDB table: " + data);
            common.returnJSONSuccess(codes, callback);
        }
    });
}

//Function that processes request to retrieve JWT tokens from Cognito using the Athorization Code grant flow with PKCE if status is "Authorized"
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function requestJWTs(event, callback) {
    //Retrieving the Authorization Request based on the device code provided by the client application
    var DynamoDBParams = {
        Key: {
            "Device_code": {
                S: event.queryStringParameters.device_code
            }
        },
        TableName: process.env.DYNAMODB_TABLE
    };
    dynamodb.getItem(DynamoDBParams, function(err, data) {
        if (err) { 
            //There was an error
            console.log("Error occured while retrieving device code");
            console.log(err, err.stack);
            common.returnJSONError(500, callback);
        } else {
            //Sucessful
            console.log("Sucessful request");
            //If Result Set has no value
            if (data.Item.length == 0) {
                console.log("No item matching device code exists");
                common.returnExpiredDeviceCodeError(callback);
            //If Result Set has more than one value
            } else if (data.Item.length > 1) {
                console.log("More than one device code has been returned");
                common.returnExpiredDeviceCodeError(callback);
            //If Result Set has only one value but it is with an "Expired" status
            } else if (data.Item.Status.S == "expired") {
                console.log("The Device code has already expired");
                common.returnExpiredDeviceCodeError(callback);
            //If Result Set has only one value, is not explicitely expired, but has not been requested initally by the same client application 
            } else if (data.Item.Client_id.S != event.queryStringParameters.client_id) {
                console.log("The Client id does not match the initial requestor client id");
                common.returnExpiredDeviceCodeError(callback);
            //If Result Set has only one value, is not explicitely expired, has been requested initally by the same client application, but has a lifetime older than the maximum lifetime
            } else if (Date.now() > parseInt(data.Item.Max_expiry.S)) {
                //Update status of the Authorization request to "Expired"
                console.log("The Device code has expired");
                DynamoDBParams = {
                    ExpressionAttributeNames: {
                        "#Status": "Status"
                    },
                    ExpressionAttributeValues: {
                        ":status": {
                            S: "expired"
                        }
                    }, 
                    Key: {
                        "Device_code": {
                            S: event.queryStringParameters.device_code
                        }
                    },
                    ReturnValues: "ALL_NEW", 
                    TableName: process.env.DYNAMODB_TABLE,
                    UpdateExpression: "SET #Status = :status"
                };
                dynamodb.updateItem(DynamoDBParams, function(err, data) {
                    if (err) {
                        //There was an error, so return an JSON error message the Code has expired
                        console.log("The Device code has expired, but an error occured when updating the DB");
                        console.log(err, err.stack);
                        common.returnExpiredDeviceCodeError(callback);
                    } else {
                        //Return an JSON error message the Code has expired
                        common.returnExpiredDeviceCodeError(callback);
                    }
                });
            //If Result Set has only one value, is not expired, has been requested initally by the same client application, but application client request a status too quickly
            } else if (Date.now() <= (parseInt(data.Item.Last_checked.S) + parseInt(process.env.POLLING_INTERVAL) * 1000) ) {
                //Update last checked timestamp of the Authorization request to Now
                DynamoDBParams = {
                    ExpressionAttributeNames: {
                        "#LC": "Last_checked"
                    },
                    ExpressionAttributeValues: {
                        ":lc": {
                            S: (Date.now()).toString()
                        }
                    }, 
                    Key: {
                        "Device_code": {
                            S: event.queryStringParameters.device_code
                        }
                    },
                    ReturnValues: "ALL_NEW", 
                    TableName: process.env.DYNAMODB_TABLE,
                    UpdateExpression: "SET #LC = :lc"
                };
                dynamodb.updateItem(DynamoDBParams, function(err, data) {
                    if (err) {
                        //There was an error, so return an JSON error message the client application has to slow down
                        console.log("Client makes too much API calls, but an error occured while updated the last check timestamp in the DB");
                        console.log(err, err.stack);
                        common.returnSlowDownError(callback);
                    } else {
                        //Return an JSON error message the client application has to slow down
                        console.log("Client makes too much API calls");
                        common.returnSlowDownError(callback);
                    }
                });
            //If all is good
            } else {
                //Must check the status
                //But first update last checked timestamp of the Authorization request to Now
                DynamoDBParams = {
                    ExpressionAttributeNames: {
                        "#LC": "Last_checked"
                    },
                    ExpressionAttributeValues: {
                        ":lc": {
                            S: (Date.now()).toString()
                        }
                    }, 
                    Key: {
                        "Device_code": {
                            S: event.queryStringParameters.device_code
                        }
                    },
                    ReturnValues: "ALL_NEW", 
                    TableName: process.env.DYNAMODB_TABLE,
                    UpdateExpression: "SET #LC = :lc"
                };
                dynamodb.updateItem(DynamoDBParams, function(err, data) {
                    if (err) {
                        //There was an error, so return an JSON error message the client application has to slow down
                        console.log("Client is on time for checking, but an error occured while updated the last check timestamp in the DB");
                        console.log(err, err.stack);
                        common.returnSlowDownError(callback);
                    }
                    else {
                        //Sucessfull
                        console.log("Client is on time for checking, we got a status");
                        //If the Status is authorization_pending or denied, return the status to the Client application
                        if (data.Attributes.Status.S == 'authorization_pending' || data.Attributes.Status.S == 'denied') {
                            console.log("Client is on time for checking, we got a status: " + data.Attributes.Status.S);
                            common.returnJSONErrorWithMsg(400, data.Attributes.Status.S, callback);
                        //If the Status is authorized
                        } else if (data.Attributes.Status.S == 'authorized') {
                            console.log("Client is on time for checking, we got a status: " + data.Attributes.Status.S);
                            console.log("Token Set is empty");
                            //Prepare the retrieving of JWT tokens from Cognito using the Athorization Code grant flow with PKCE
                            var options = {
                                hostname: process.env.CUP_DOMAIN + ".auth." + process.env.CUP_REGION + ".amazoncognito.com",
                                port: 443,
                                path: '/oauth2/token',
                                method: 'POST',
                                headers: {
                                    'Content-Type':  'application/x-www-form-urlencoded',
                                }
                            };
                            //If client application is private, has a Client Secret, and had provided it in the initial request, add it as an Authorization header to this request
                            if (event.headers.authorization != undefined) {
                                console.log("Setting Authorization header");
                                // Client knows authentication is required for Private Client, has been issued a Client secret, and therefore present an authentication header
                                    // Otherwise Client knows authentication is not necessary for Public Client or has made an error
                                options.headers.authorization = event.headers.authorization;
                            }
                            
                            console.log("Launching Request for Tokens");
                            //Request JWT tokens
                            const req = https.request(options, res => {
                                console.log('statusCode:', res.statusCode);
                                
                                //Reading request's response data
                                res.on('data', (d) => {
                                    //Prepare JWT Tokens blob
                                    if (d.error) {
                                        console.log("Cognito User Pool returned an error");
                                        common.returnExpiredDeviceCodeError(callback);
                                    } else {
                                        var result = JSON.parse(d.toString());
                                        var response = {}

                                        var rts = process.env.RESULT_TOKEN_SET.split('+');
                                        for (token_type in rts) {
                                            if (rts[token_type] == 'ID') response.id_token = result.id_token;
                                            if (rts[token_type] == 'ACCESS') response.access_token = result.access_token;
                                            if (rts[token_type] == 'REFRESH') response.refresh_token = result.refresh_token;
                                        }

                                        response.expires_in = result.expires_in;

                                        //Update the status of the Authorization request to "Denied" to prevent replay
                                        DynamoDBParams = {
                                            ExpressionAttributeNames: {
                                                "#Status": "Status"
                                            },
                                            ExpressionAttributeValues: {
                                                ":status": {
                                                    S: "expired"
                                                }
                                            }, 
                                            Key: {
                                                "Device_code": {
                                                    S: event.queryStringParameters.device_code
                                                }
                                            },
                                            ReturnValues: "ALL_NEW", 
                                            TableName: process.env.DYNAMODB_TABLE,
                                            UpdateExpression: "SET #Status = :status"
                                        };
                                        dynamodb.updateItem(DynamoDBParams, function(err, data) {
                                            if (err) {
                                                //There was an error, return expired message as Authroization code has been used
                                                console.log("We got the tokens but we got an error updating the DB");
                                                console.log(err, err.stack);
                                                common.returnExpiredDeviceCodeError(callback);
                                            } else {
                                                //Return the JWT tokens
                                                common.returnJSONSuccess(response, callback);
                                            }
                                        });
                                    }
                                });  
                            });
                            
                            //There was an error retrieving JWT Tokens
                            req.on('error', (e) => {
                                console.log("Got an error");
                                console.log(e);
                                common.returnExpiredDeviceCodeError(callback);
                            });
                            
                            //Writing Body of the request
                            req.write('grant_type=authorization_code&client_id=' + data.Attributes.Client_id.S + '&scope=' + data.Attributes.Scope.S  + '&redirect_uri=' + encodeURIComponent("https://" + process.env.CODE_VERIFICATION_URI + '/callback') + '&code=' + data.Attributes.AuthZ_code.S + '&code_verifier=' + data.Attributes.AuthZ_Verifier_code.S);
                            
                            //When request is finalized
                            req.end((e) => {
                                console.log("Finished");
                            });
                        //If Status is not suppoted
                        } else {
                            common.returnExpiredDeviceCodeError(callback);
                        }
                    }
                });
            }
        }
    });
}

module.exports = Object.assign({ processPostRequest }, { requestSetOfCodes }, { requestJWTs });