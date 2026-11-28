"""ProductsFunction: CRUD operations for artisan products with S3 image asset handling."""
import os
import sys
import uuid
from datetime import datetime, timezone
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import (
    ValidationError,
    error_response,
    parse_body,
    success_response,
    validate_payload,
)
from common.limits import get_user_id

PRESIGNED_GET_EXPIRY = 3600  # 1 hour


def _get_s3_and_table():
    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
    table_name = os.environ.get("PRODUCTS_TABLE", "kalamitra-products")

    s3 = boto3.client("s3", region_name=region_name)
    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    table = dynamodb.Table(table_name)
    return s3, media_bucket, table


def _generate_image_url(s3, bucket: str, key: str) -> str:
    """Generates presigned GET URL for an image asset."""
    if not key:
        return ""
    try:
        return s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket, "Key": key},
            ExpiresIn=PRESIGNED_GET_EXPIRY,
        )
    except Exception:
        return ""


def _handle_get(user_id: str, s3, bucket: str, table):
    """Lists caller's products with presigned image URLs."""
    try:
        resp = table.query(
            KeyConditionExpression=Key("ownerId").eq(user_id)
        )
        items = resp.get("Items", [])
        for item in items:
            key = item.get("imageKey", "")
            item["imageUrl"] = _generate_image_url(s3, bucket, key)
        return success_response({"products": items, "count": len(items)})
    except Exception as e:
        return error_response(f"Failed to query products: {str(e)}", status_code=500)


def _handle_post(event, user_id: str, s3, bucket: str, table):
    """Creates/updates product, copying image from tmp/ to media/."""
    try:
        body = parse_body(event)
        validate_payload(
            body,
            required=["title_en", "price", "imageKey"],
            length_caps={"title_en": (2, 200)},
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    product_id = body.get("productId") or str(uuid.uuid4())
    src_key = body["imageKey"]

    # Image key verification and copy from tmp/ to media/
    final_image_key = src_key
    if src_key.startswith(f"tmp/{user_id}/"):
        ext = ".png" if src_key.lower().endswith(".png") else ".jpg"
        dest_key = f"media/{user_id}/{product_id}{ext}"
        try:
            s3.copy_object(
                Bucket=bucket,
                CopySource={"Bucket": bucket, "Key": src_key},
                Key=dest_key,
            )
            # Clean up tmp object
            s3.delete_object(Bucket=bucket, Key=src_key)
            final_image_key = dest_key
        except ClientError as e:
            return error_response(f"Failed to process craft photo: {str(e)}", status_code=500)
    elif not src_key.startswith(f"media/{user_id}/"):
        return error_response("Unauthorized key path: image does not belong to user", status_code=403)

    now_iso = datetime.now(timezone.utc).isoformat()
    raw_price = body.get("price", 0)
    try:
        price_dec = Decimal(str(raw_price))
    except Exception:
        price_dec = Decimal("0")

    item = {
        "ownerId": user_id,
        "productId": product_id,
        "shopId": user_id,
        "title_en": body.get("title_en", "").strip(),
        "title_hi": body.get("title_hi", "").strip(),
        "description_en": body.get("description_en", "").strip(),
        "description_hi": body.get("description_hi", "").strip(),
        "price": price_dec,
        "category": body.get("category", "handicrafts").strip(),
        "tags": body.get("tags", []),
        "materials": body.get("materials", []),
        "technique": body.get("technique", ""),
        "craft_tradition": body.get("craft_tradition", ""),
        "care_instructions_en": body.get("care_instructions_en", ""),
        "imageKey": final_image_key,
        "createdAt": body.get("createdAt") or now_iso,
        "updatedAt": now_iso,
    }

    try:
        table.put_item(Item=item)
    except Exception as e:
        return error_response(f"Failed to save product: {str(e)}", status_code=500)

    item["imageUrl"] = _generate_image_url(s3, bucket, final_image_key)
    return success_response({"product": item, "imageUrl": item["imageUrl"]}, status_code=201)


def _handle_delete(event, user_id: str, s3, bucket: str, table):
    """Deletes a product from DynamoDB and its image from S3."""
    query_params = event.get("queryStringParameters") or {}
    product_id = query_params.get("productId")

    if not product_id:
        try:
            body = parse_body(event)
            product_id = body.get("productId")
        except Exception:
            pass

    if not product_id:
        return error_response("Missing required productId parameter", status_code=400)

    # 1. Fetch item to obtain imageKey
    try:
        resp = table.get_item(Key={"ownerId": user_id, "productId": product_id})
        item = resp.get("Item")
        if not item:
            return error_response("Product not found", status_code=404)

        image_key = item.get("imageKey")

        # 2. Delete item from DynamoDB
        table.delete_item(Key={"ownerId": user_id, "productId": product_id})

        # 3. Delete image from S3
        if image_key and image_key.startswith(f"media/{user_id}/"):
            try:
                s3.delete_object(Bucket=bucket, Key=image_key)
            except ClientError:
                pass
    except Exception as e:
        return error_response(f"Failed to delete product: {str(e)}", status_code=500)

    return success_response({"ok": True, "deletedProductId": product_id})


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    s3, bucket, table = _get_s3_and_table()

    # Route according to HTTP method
    method = (
        event.get("requestContext", {}).get("http", {}).get("method")
        or event.get("httpMethod")
        or "GET"
    ).upper()

    if method == "GET":
        return _handle_get(user_id, s3, bucket, table)
    elif method == "POST":
        return _handle_post(event, user_id, s3, bucket, table)
    elif method == "DELETE":
        return _handle_delete(event, user_id, s3, bucket, table)
    else:
        return error_response(f"Method {method} not allowed", status_code=405)
