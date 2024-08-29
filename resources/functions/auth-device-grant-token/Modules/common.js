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

//Function a random string based of the required lenght and format
//  length:     length of the random string to generate
//  client_id:  format of the randrom string to generate
//  result:     string
function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('b') > -1) mask += 'bcdfghjklmnpqrstvwxz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('B') > -1) mask += 'BCDFGHJKLMNPQRSTVWXZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

//Function that generates cookie value
//  result:     Cookie value for the domain, valid 5 minutes, and secure
function generateCookieVal() {
    //Generate cookie
    var date = new Date();
     // Valid for 5 minutes
    date.setTime(+ date + (3000)); // 5 \* 60 \* 100
    var cookieVal = Math.random().toString(36).substring(7);
    
    return "myCookie="+cookieVal+"; HttpOnly; Secure; SameSite=Strict; Domain=" + process.env.CODE_VERIFICATION_URI + "; Expires="+date.toGMTString()+";";
}

//Function that performs Base64 decoding for URL
//  encoded:    The Base64 URL encoded value
//  result:     The decoded value
function base64UrlDecode(encoded) {
    encoded = encoded.replace('-', '+').replace('_', '/');
    while (encoded.length % 4)
      encoded += '=';
    return base64Decode(encoded);
}

//Function that performs Base64 decoding
//  encoded:    The Base64 encoded value
//  result:     The decoded value
function base64Decode(encoded) {
    return new Buffer.from(encoded || '', 'base64').toString('utf8');
}

//Function that performs Base64 encoding for URL
//  unencoded:  The decoded value
//  result:     The Base64 URL encoded value
function base6UurlEncode(unencoded) {
    var encoded = base64Encode(unencoded);
    return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
}

//Function that performs Base64 encoding
//  unencoded:  The decoded value
//  result:     The Base64 encoded value
function base64Encode(unencoded) {
  return new Buffer.from(unencoded || '').toString('base64');
}

//Function that returns an error code as a JSON message
//  code:       Error code to return
//  callback:   Callback function to return the message
function returnJSONError(code, callback) {
    var response = {
        statusCode: code,
        headers: {"content-type": "application/json", "cache-control": "no-store"}
    };
    callback(null, response);
}

//Function that returns an error code as a JSON message with a body
//  code:       Error code to return
//  message:    Body of the JSON message
//  callback:   Callback function to return the message
function returnJSONErrorWithMsg(code, message, callback) {
    var msg = {
        "error": message
    };
    var response = {
        statusCode: 400,
        headers: {"content-type": "application/json", "cache-control": "no-store"},
        body: JSON.stringify(msg),
    };
    callback(null, response);
}

//Function that returns an error code as a HTML message with a body
//  code:       Error code to return
//  HTMLvalue:  Body of the HTML message
//  callback:   Callback function to return the message
function returnHTMLError(code, HTMLvalue, callback) {
    var response = {
        statusCode: code,
        headers: {"content-type": "text/html", "cache-control": "no-store"},
        body: HTMLvalue
    };
    callback(null, response);
}

//Function that returns a specific "Device Code has expired" JSON message
//  callback:   Callback function to return the message
function returnExpiredDeviceCodeError(callback) {
    var msg = {
        "error": "expired_token"
    };
    var response = {
        statusCode: 400,
        headers: {"content-type": "application/json", "cache-control": "no-store"},
        body: JSON.stringify(msg),
    };
    callback(null, response);
}

//Function that returns a specific "User Code has expired" HTML message
//  callback:   Callback function to return the message
function returnExpiredUserCodeError(callback) {
    var response = {
        statusCode: 400,
        headers: {"content-type": "text/html", "cache-control": "no-store"},
        body: "<H1>Sorry, code has expired</H1>"
    };
    callback(null, response);
}

//Function that returns a specific "Slow down" JSON message when client is polling too frequently for a status
//  callback:   Callback function to return the message
function returnSlowDownError(callback) {
    var msg = {
        "error": "slow_down"
        };
    var response = {
        statusCode: 400,
        headers: {"content-type": "application/json", "cache-control": "no-store"},
        body: JSON.stringify(msg),
    };
    callback(null, response);
}

//Function that returns a generic SUCCESS JSON message
//  callback:   Callback function to return the message
function returnJSONSuccess(JSONvalue, callback) {
    var response = {
        statusCode: 200,
        headers: {"content-type": "application/json", "cache-control": "no-store"},
        body: JSON.stringify(JSONvalue),
    };
    callback(null, response);
}

//Function that returns a generic SUCCESS JSON message
//  callback:   Callback function to return the message
function returnHTMLSuccess(HTMLvalue, callback) {
    var response = {
        statusCode: 200,
        headers: {"content-type": "text/html", "cache-control": "no-store"},
        body: HTMLvalue
    };
    callback(null, response);
}

module.exports = Object.assign({ cognitoidentityserviceprovider }, { dynamodb }, { randomString }, { generateCookieVal }, { base64UrlDecode }, { base64Decode }, { base6UurlEncode }, { base64Encode }, { returnJSONError }, { returnJSONErrorWithMsg }, { returnHTMLError }, { returnExpiredDeviceCodeError }, { returnExpiredUserCodeError }, { returnSlowDownError } ,{ returnJSONSuccess }, { returnHTMLSuccess });