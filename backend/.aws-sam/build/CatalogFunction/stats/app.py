"""StatsFunction: computes artisan business impact metrics and estimated cataloging time saved."""
import os
import sys
import boto3
from boto3.dynamodb.conditions import Key

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import error_response, success_response
from common.limits import get_user_id

MINUTES_SAVED_PER_PRODUCT = 15  # Benchmark: 15 mins saved vs manual bilingual cataloging


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    products_table_name = os.environ.get("PRODUCTS_TABLE", "kalamitra-products")
    enquiries_table_name = os.environ.get("ENQUIRIES_TABLE", "kalamitra-enquiries")

    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    products_table = dynamodb.Table(products_table_name)
    enquiries_table = dynamodb.Table(enquiries_table_name)

    # 1. Count products for artisan
    try:
        prod_resp = products_table.query(
            KeyConditionExpression=Key("ownerId").eq(user_id),
            Select="COUNT",
        )
        products_count = prod_resp.get("Count", 0)
    except Exception:
        products_count = 0

    # 2. Count buyer enquiries received
    try:
        enq_resp = enquiries_table.query(
            KeyConditionExpression=Key("shopId").eq(user_id),
            Select="COUNT",
        )
        enquiries_count = enq_resp.get("Count", 0)
    except Exception:
        enquiries_count = 0

    # 3. Calculate estimated time saved
    estimated_minutes_saved = products_count * MINUTES_SAVED_PER_PRODUCT

    return success_response({
        "productsCount": products_count,
        "enquiriesCount": enquiries_count,
        "estimatedMinutesSaved": estimated_minutes_saved,
        "isEstimate": True,
        "note": "estimatedMinutesSaved is an indicative estimate based on 15 minutes cataloging time saved per product",
    })
