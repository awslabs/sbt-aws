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

//Function that processes Cognito callback after end user Authorization Code grant flow with PKCE request
//  event:          Full event trapped by the Lambda function
//  callback:       Callback function to return the message
function processAuthZCodeCallback(event, callback) {
    console.log("An Authorization Code has been sent back as Callback");
    
    //Search the DynamoDb table for Authorization Request with provided State
    var DynamoDBParams = {
        ExpressionAttributeValues: {
            ":authz_state": {
                S: event.queryStringParameters.state
            }
        },
        KeyConditionExpression: "AuthZ_State = :authz_state", 
        IndexName: process.env.DYNAMODB_AUTHZ_STATE_INDEX,
        TableName: process.env.DYNAMODB_TABLE
    };
    dynamodb.query(DynamoDBParams, function(err, data) {
        if (err) { 
            //There was an error retrieving the Authorization request
            console.log("Authorization State can't be retrieved: " +  event.queryStringParameters.state);
            console.log(err, err.stack);
            common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
        } else {
            console.log("Successful response");
            //If there is no result set
            if (data.Items.length == 0) {
                 console.log("No AuthZ State was returned");
                 common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
            //If Result Set is more than 1 entry
            } else if (data.Items.length > 1) {
                console.log("Too much AuthZ State were returned");
                common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
            } else {
                console.log("AuthZ State was returned");
                // Updating the Authorization request with the Code returned through the Authorization Code grant flow with PKCE callback
                DynamoDBParams = {
                    ExpressionAttributeNames: {
                        "#AuthZ_code": "AuthZ_code"
                    },
                    ExpressionAttributeValues: {
                        ":value": {
                            S: event.queryStringParameters.code
                        }
                    }, 
                    Key: {
                        "Device_code": {
                            S: data.Items[0].Device_code.S
                        }
                    },
                    ReturnValues: "ALL_NEW", 
                    TableName: process.env.DYNAMODB_TABLE,
                    UpdateExpression: "SET #AuthZ_code = :value"
                };
                dynamodb.updateItem(DynamoDBParams, function(err, data) {
                    if (err) {
                        //Update was not successful
                        console.log("Unable to set state to Authorization Code for Device Code");
                        console.log(err, err.stack);
                        common.returnHTMLError(400, "<H1>Error, can't update status</H1>", callback);
                    }
                    else {
                        //Update was successful
                        console.log("AuthZ Code updated");
                        common.returnHTMLSuccess("<H1>Thanks, Device has been Authorized. You can return to your device.</H1>", callback);
                    }
                });
            }
        }
    });
}

module.exports = Object.assign({ processAuthZCodeCallback });