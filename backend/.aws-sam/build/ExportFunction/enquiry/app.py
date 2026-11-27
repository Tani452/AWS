"""EnquiryFunction (Public): receives customer inquiries for artisan crafts with honeypot protection."""
import os
import sys
import uuid
from datetime import datetime, timezone
import boto3

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import (
    ValidationError,
    error_response,
    parse_body,
    success_response,
    validate_payload,
)

# Common honeypot field names used to trap spam bots
HONEYPOT_FIELDS = {"honeypot", "website", "hp_field", "_gotcha", "company_url"}


def lambda_handler(event, context):
    try:
        body = parse_body(event)
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    # 1. Honeypot Anti-Spam Check:
    # If any honeypot field is populated, silently discard and return 200 OK
    for hp in HONEYPOT_FIELDS:
        val = body.get(hp)
        if val and str(val).strip():
            # Return fake success without persisting to DynamoDB
            return success_response({
                "ok": True,
                "message": "Enquiry submitted successfully",
            }, status_code=200)

    # 2. Input validation and length capping
    try:
        validate_payload(
            body,
            required=["shopId", "buyerName", "buyerContact", "message"],
            length_caps={
                "shopId": (1, 100),
                "productId": 100,
                "buyerName": (1, 100),
                "buyerContact": (1, 100),
                "message": (1, 1000),
            },
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    try:
        quantity = int(body.get("quantity", 1))
        if quantity < 1 or quantity > 10000:
            quantity = 1
    except (ValueError, TypeError):
        quantity = 1

    shop_id = body["shopId"].strip()
    product_id = body.get("productId", "general").strip()
    buyer_name = body["buyerName"].strip()
    buyer_contact = body["buyerContact"].strip()
    message = body["message"].strip()

    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    table_name = os.environ.get("ENQUIRIES_TABLE", "kalamitra-enquiries")

    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    table = dynamodb.Table(table_name)

    enquiry_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    item = {
        "shopId": shop_id,
        "enquiryId": enquiry_id,
        "productId": product_id,
        "buyerName": buyer_name,
        "buyerContact": buyer_contact,
        "message": message,
        "quantity": quantity,
        "createdAt": now_iso,
        "status": "new",
    }

    try:
        table.put_item(Item=item)
    except Exception as e:
        return error_response(f"Failed to save enquiry: {str(e)}", status_code=500)

    return success_response({
        "ok": True,
        "enquiryId": enquiry_id,
        "message": "Enquiry submitted successfully",
    }, status_code=201)
