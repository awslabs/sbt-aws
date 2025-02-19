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
'use strict';

var AWS = require("aws-sdk");

exports.handler = (event, context, callback) => {
    console.log('LogScheduledEvent');
    //Receive CloudWatch scheduled event
    console.log('Received event:', JSON.stringify(event, null, 2));

    //Bootstrap DynamoDB Client
    var dynamodb = new AWS.DynamoDB();

    //Search for all entries that are not yet expired cause entries are automatically expired if necessary when polled
    var params = {
        ExpressionAttributeNames: {
            "#Status": "Status"
        },
        ExpressionAttributeValues: {
            ":expired": {
                S: "expired"
            }
        },
        FilterExpression: "#Status <> :expired",
        TableName: process.env.DYNAMODB_TABLE
    };
    dynamodb.scan(params, function (err, data) {
        if (err) {
            //There was an error when collecting the data
            console.log("Error while scanning DB for 'non-expired");
            console.log(err, err.stack); // an error occurred
        } else {
            console.log("Processing result set");
            //If the Result Set is not empty  
            if (data.Items.length > 0) {
                var item;
                //For any Result in the Result set
                for (item in data.Items) {
                    //If the Result Lifetime is older than the DYNAMODB_MAX_VISIBILITY
                    if (Date.now() > (new Date(parseInt(data.Items[item].Max_expiry.S)) + process.env.DYNAMODB_MAX_VISIBILITY)) {
                        //Delete the codes from the DB
                        params = {
                            Key: {
                                "Device_code": {
                                    S: data.Items[item].Device_code.S
                                }
                            },
                            TableName: process.env.DYNAMODB_TABLE,
                        };
                        dynamodb.deleteItem(params, function (err, data) {
                            if (err) {
                                //An error occured during the deletion
                                console.log("Error occured when deleting item from the DB");
                                console.log(err, err.stack); // an error occurred
                            } else {
                                //Result is deleted
                                console.log("Item deleted from DB");
                            }
                        });
                        //If the Result Lifetime is older maximum lifetime
                    } else if (Date.now() > (new Date(parseInt(data.Items[item].Max_expiry.S)))) {
                        //Expire the codes in the DB
                        params = {
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
                                    S: data.Items[item].Device_code.S
                                }
                            },
                            ReturnValues: "ALL_NEW",
                            TableName: process.env.DYNAMODB_TABLE,
                            UpdateExpression: "SET #Status = :status"
                        };
                        dynamodb.updateItem(params, function (err, data) {
                            if (err) {
                                //An error happened while updating teh status of the codes
                                console.log("Error occured when updating the DB to expired");
                                console.log(err, err.stack);
                            } else {
                                //Codes have been expired
                                console.log("DB has been updated");
                            }
                        });
                    } else {
                        //Codes are still valid
                        console.log("Codes are still valid");
                    }
                }
            } else {
                //There were no result set
                console.log("No non-expired result set");
            }
        }
    });
    //Search for all entries that are not expired
    params = {
        ExpressionAttributeNames: {
            "#Status": "Status"
        },
        ExpressionAttributeValues: {
            ":expired": {
                S: "expired"
            }
        },
        FilterExpression: "#Status = :expired",
        TableName: "DeviceGrant"
    };
    dynamodb.scan(params, function (err, data) {
        if (err) {
            //There was an error when collecting the data
            console.log("Error while scanning DB for 'expired'");
            console.log(err, err.stack); // an error occurred
        } else {
            console.log("Processing result set");
            //If the Result Set is not empty  
            if (data.Items.length > 0) {
                var item;
                for (item in data.Items) {
                    //If the Result Lifetime is older than the DYNAMODB_MAX_VISIBILITY
                    var limit = new Date(parseInt(data.Items[item].Max_expiry.S));
                    limit = limit + process.env.DYNAMODB_MAX_VISIBILITY;
                    if (Date.now() > limit) {
                        //Delete the codes from the DB
                        params = {
                            Key: {
                                "Device_code": {
                                    S: data.Items[item].Device_code.S
                                }
                            },
                            TableName: process.env.DYNAMODB_TABLE,
                        };
                        dynamodb.deleteItem(params, function (err, data) {
                            if (err) {
                                //An error occured during the deletion
                                console.log("Error occured when deleting item from the DB");
                                console.log(err, err.stack); // an error occurred
                            } else {
                                //Result is deleted
                                console.log("Item deleted from DB");
                            }
                        });
                    } else {
                        //Codes are still valid
                        console.log("Codes are still valid");
                    }
                }
            } else {
                //There were no result set
                console.log("No expired result set");
            }
        }
    });

    callback(null, 'Finished');
};