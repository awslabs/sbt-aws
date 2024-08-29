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

//Reference to Authorization path library
const authzP = require( __dirname + '/authorization-path.js');

//Require a filesystem object to read the HTML page dedicated to end user UI
var fs = require("fs");

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

//Function that processes request by an authenticated end user with a user code
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function requestUserCodeProcessing(event, callback) {
    //Search for an Authorization request related to the provided user code
    var DynamoDBParams = {
        ExpressionAttributeValues: {
            ":User_code": {
                S: event.queryStringParameters.code
            }
        },
        KeyConditionExpression: "User_code = :User_code", 
        IndexName: process.env.DYNAMODB_USERCODE_INDEX,
        TableName: process.env.DYNAMODB_TABLE
    };
    dynamodb.query(DynamoDBParams, function(err, data) {
        if (err) { 
            //There was an error retrieving the Authorization request
            console.log("User code does not exist: " +  event.queryStringParameters.code);
            console.log(err, err.stack);
            common.returnExpiredUserCodeError(callback);
        } else {
            console.log("successful response");
            //If no result is returned
            if (data.Items.length == 0) {
                 console.log("no User code was returned");
                 common.returnExpiredUserCodeError(callback);
            //If too much result is returned
            } else if (data.Items.length > 1) {
                console.log("Too much User code returned from the request");
                common.returnExpiredUserCodeError(callback);
            //If only one result is returned
            } else {
                var Device_code_ctx = data.Items[0].Device_code.S;
                //If the Authorization request is already expired, authorized, or denied
                if (data.Items[0].Status.S == "expired" || data.Items[0].Status.S == "authorized" || data.Items[0].Status.S == "denied") {
                    console.log("The Device code has already expired or been used");
                    common.returnExpiredUserCodeError(callback);
                //If the Authorization request has not the expired status but has a lifetime that is greater than the maximum one
                } else if (Date.now() > parseInt(data.Items[0].Max_expiry.S)) {
                    console.log("User Code has expired");
                    //Update the Authorization request to expire
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
                                S: Device_code_ctx
                            }
                        },
                        ReturnValues: "ALL_NEW", 
                        TableName: process.env.DYNAMODB_TABLE,
                        UpdateExpression: "SET #Status = :status"
                    };
                    dynamodb.updateItem(DynamoDBParams, function(err, data) {
                        if (err) {
                            //There was an error updating the Authorization request
                            console.log("User Code has expired but an error occurend when updating the DB");
                            console.log(err, err.stack);
                            common.returnExpiredUserCodeError(callback);
                        } else {
                            //Update was successfull, we return an HTML message to the end-user
                            console.log("User Code has expired and DB has been updated");
                            common.returnExpiredUserCodeError(callback);
                        }
                    });
                //If the code has not been redeemed and is still valid
                } else {
                    console.log("User Code is valid and action is Authorize = " + event.queryStringParameters.authorize );
                    //Retrieving the OIDC authenticated user attributes set by ALB
                    var payload = common.base64UrlDecode(event.headers["x-amzn-oidc-data"].split('.')[1]);
                    //If the end-user "Authorized" the Authorization request
                    if (event.queryStringParameters.authorize == 'true') {
                        //Update the Status and Subject of the Authorization request
                        DynamoDBParams = {
                            ExpressionAttributeNames: {
                                "#Status": "Status",
                                "#Subject": "Subject"
                            },
                            ExpressionAttributeValues: {
                                ":status": {
                                    S: "authorized"
                                },
                                ":subject": {
                                    S: JSON.parse(payload).username
                                }
                            }, 
                            Key: {
                                "Device_code": {
                                    S: Device_code_ctx
                                }
                            },
                            ReturnValues: "ALL_NEW", 
                            TableName: process.env.DYNAMODB_TABLE,
                            UpdateExpression: "SET #Status = :status, #Subject = :subject"
                        };
                        dynamodb.updateItem(DynamoDBParams, function(err, data) {
                            if (err) {
                                //There was an error updating the Authorization request
                                console.log("Unable to set state to autorized for User Code");
                                console.log(err, err.stack);
                                common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
                             } else {
                                //Update was successfull, follwoing up with the Authroization path
                                authzP.processAllow(data.Attributes.Client_id.S, data.Attributes.Device_code.S, callback, dynamodb);
                            }
                        });
                    //If the end-user "Denied" the Authorization request
                    } else if (event.queryStringParameters.authorize == 'false') {
                        console.log("User Code is valid and action is Authorize = " + event.queryStringParameters.authorize );
                        //Update the Status and Subject of the Authorization request
                        DynamoDBParams = {
                            ExpressionAttributeNames: {
                                "#Status": "Status",
                                "#Subject": "Subject"
                            },
                            ExpressionAttributeValues: {
                                ":status": {
                                    S: "denied"
                                },
                                ":subject": {
                                    S: JSON.parse(payload).username
                                }
                            }, 
                            Key: {
                                "Device_code": {
                                    S: Device_code_ctx
                                }
                            },
                            ReturnValues: "ALL_NEW", 
                            TableName: process.env.DYNAMODB_TABLE,
                            UpdateExpression: "SET #Status = :status, #Subject = :subject"
                        };
                        dynamodb.updateItem(DynamoDBParams, function(err, data) {
                            if (err) {
                                //There was an error updating the Authorization request
                                console.log("Unable to set state to autorized for User Code");
                                common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
                            }
                            else {
                                //Update was successfull, returning an HTML SUCCESS message
                                common.returnHTMLSuccess("<H1>Thanks, Device has been unauthorized.</H1>", callback);
                            }
                        });
                    //If the operation is not supported
                    } else {
                        console.log("Unsupported Authorization option");
                        common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
                    }
                }
            }
        }
    });
}

//Function that processes a request to show the Authorization UI
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function requestUI(event, callback){
    //Retrieving the OIDC authenticated user attributes set by ALB
    var payload = common.base64UrlDecode(event.headers["x-amzn-oidc-data"].split('.')[1]);

    //Reading the HTML page
    fs.readFile('Resources/index.html', 'utf8', function(err, data) {
        if (err) {
            //There was an error reading the page, returning an HTML error
            console.log("Error reading Resources/index.html");
            console.log(err, err.stack);
            common.returnHTMLError(500, "", callback);
        } else {
            console.log("Success reading Resources/index.html " + data);
            //Sucessful, returning page and setting the username correctly
            var response = {
                statusCode: 200,
                headers: {"content-type": "text/html", "cache-control": "no-store"},
                body: data.replace("$Username", JSON.parse(payload).username)
            };
            callback(null, response);
        }
    });
}

module.exports = Object.assign({ requestUserCodeProcessing }, { requestUI });