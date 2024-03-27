# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import argparse
import boto3
import re
import time
from botocore.exceptions import ClientError

# Parse command line arguments
parser = argparse.ArgumentParser(description='Wait for an email message and extract password')
parser.add_argument('email', type=str, help='The email address to search for')
parser.add_argument('--bucket', type=str, required=True, help='The S3 bucket name')
parser.add_argument('--prefix', type=str, default='emails/', help='The prefix for email files in the S3 bucket')
parser.add_argument('--max_attempts', type=int, default=30, help='The maximum number of attempts to check for the email')
parser.add_argument('--debug', type=bool, default=False, help='Set debug mode for more verbose logs.')
args = parser.parse_args()

# Create an S3 client
s3 = boto3.client('s3')

# Function to check for the email message
def check_for_email():
    try:
        # List objects in the S3 bucket with the specified prefix
        response = s3.list_objects_v2(Bucket=args.bucket, Prefix=args.prefix)
        # Iterate over the objects
        for obj in response.get('Contents', []):
            # Download the object content
            s3_object = s3.get_object(Bucket=args.bucket, Key=obj['Key'])
            file_contents = s3_object['Body'].read()
            try:
                obj_body = file_contents.decode('utf-8')
            except UnicodeDecodeError:
                if args.debug:
                    print(f"Unable to decode file with name: {obj['Key']}")
                continue

            # Check if the email is for the specified recipient
            if args.email in obj_body:
                if args.debug:
                    print(obj_body)
                # Search for the password pattern
                password_match = re.search(r'with username admin and temporary password (.+)', obj_body)
                if password_match:
                    password = password_match.group(1)
                    if args.debug:
                        print(f"Found password '{password}' for {args.email} in {obj['Key']}")
                    return password

    except ClientError as e:
        print(f"Error: {e}")

    return None

# Loop to check for the email message with a maximum number of attempts
password = None
attempts = 0
while attempts < args.max_attempts:
    password = check_for_email()
    if password:
        break
    time.sleep(10)
    attempts += 1

# Print the password if found, or a message indicating the maximum attempts reached
if password:
    print(password.strip())
else:
    print(f"Maximum attempts ({args.max_attempts}) reached: Email message not found.")
