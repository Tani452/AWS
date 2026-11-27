"""ExportFunction: exports artisan catalog products to CSV format for B2B/marketplace onboarding."""
import csv
import io
import os
import sys
import boto3
from boto3.dynamodb.conditions import Key

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import error_response
from common.limits import get_user_id

PRESIGNED_GET_EXPIRY = 86400  # 24 hours for export CSV downloads


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
    table_name = os.environ.get("PRODUCTS_TABLE", "kalamitra-products")

    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    s3 = boto3.client("s3", region_name=region_name)
    table = dynamodb.Table(table_name)

    try:
        resp = table.query(KeyConditionExpression=Key("ownerId").eq(user_id))
        products = resp.get("Items", [])
    except Exception as e:
        return error_response(f"Failed to query products for export: {str(e)}", status_code=500)

    # Generate CSV in-memory
    csv_buffer = io.StringIO()
    writer = csv.writer(csv_buffer)

    # Headers
    headers = [
        "sku",
        "title_en",
        "title_hi",
        "description_en",
        "description_hi",
        "category",
        "price_inr",
        "materials",
        "image_url",
    ]
    writer.writerow(headers)

    for item in products:
        image_key = item.get("imageKey", "")
        image_url = ""
        if image_key:
            try:
                image_url = s3.generate_presigned_url(
                    ClientMethod="get_object",
                    Params={"Bucket": media_bucket, "Key": image_key},
                    ExpiresIn=PRESIGNED_GET_EXPIRY,
                )
            except Exception:
                image_url = ""

        raw_materials = item.get("materials", [])
        if isinstance(raw_materials, list):
            materials_str = ", ".join(str(m) for m in raw_materials)
        else:
            materials_str = str(raw_materials or "")

        row = [
            item.get("productId", ""),
            item.get("title_en", ""),
            item.get("title_hi", ""),
            item.get("description_en", ""),
            item.get("description_hi", ""),
            item.get("category", ""),
            str(item.get("price", "")),
            materials_str,
            image_url,
        ]
        writer.writerow(row)

    csv_data = csv_buffer.getvalue()

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": f'attachment; filename="kalamitra_catalog_{user_id[:8]}.csv"',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        "body": csv_data,
    }
