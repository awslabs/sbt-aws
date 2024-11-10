#!/bin/bash

CONTROL_PLANE_NAME=$1

STREAM_NAME=$(aws cloudformation describe-stacks --stack-name "$CONTROL_PLANE_NAME" --query "Stacks[0].Outputs[?contains(OutputKey,'dataIngestorName')].OutputValue" --output text)

while true; do
  if [ -z "$2" ]; then
    tenantId=$((RANDOM % 100))
  else
    tenantId="$2"
  fi

  value=$((RANDOM % 1000))
  timestamp=$((RANDOM % 10000000000))

  data=$(jq -cn \
    --arg tenantId "$tenantId" \
    --arg value $value \
    --arg timestamp $timestamp \
    '{type: "ProductCount", tenantId: $tenantId, metric: {name: "productsSold", unit: "Count", value: $value}, timestamp: $timestamp}' | base64)

  echo "$data" | base64 --decode
  aws firehose put-record --delivery-stream-name "$STREAM_NAME" --record Data="$data"

  sleep 1
done
