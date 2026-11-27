"""ShopFunction (Public): returns public-safe product listing for an artisan's storefront."""
import os
import sys
import boto3
from boto3.dynamodb.conditions import Key

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import error_response, success_response

PRESIGNED_GET_EXPIRY = 3600  # 1 hour


def lambda_handler(event, context):
    path_params = event.get("pathParameters") or {}
    shop_id = path_params.get("shopId")

    if not shop_id:
        # Fallback to query string or direct path parsing
        query_params = event.get("queryStringParameters") or {}
        shop_id = query_params.get("shopId")

    if not shop_id:
        return error_response("Missing required shopId in path", status_code=400)

    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
    table_name = os.environ.get("PRODUCTS_TABLE", "kalamitra-products")

    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    s3 = boto3.client("s3", region_name=region_name)
    table = dynamodb.Table(table_name)

    try:
        resp = table.query(KeyConditionExpression=Key("ownerId").eq(shop_id))
        items = resp.get("Items", [])
    except Exception as e:
        return error_response("Failed to retrieve artisan shop products", status_code=500)

    # Filter strictly to public-safe fields with presigned image URLs
    public_products = []
    for item in items:
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

        public_products.append({
            "productId": item.get("productId"),
            "shopId": shop_id,
            "title_en": item.get("title_en", ""),
            "title_hi": item.get("title_hi", ""),
            "description_en": item.get("description_en", ""),
            "description_hi": item.get("description_hi", ""),
            "price": item.get("price", 0),
            "category": item.get("category", "handicrafts"),
            "tags": item.get("tags", []),
            "materials": item.get("materials", []),
            "technique": item.get("technique", ""),
            "craft_tradition": item.get("craft_tradition", ""),
            "imageUrl": image_url,
            "createdAt": item.get("createdAt", ""),
        })

    return success_response({
        "shopId": shop_id,
        "products": public_products,
        "count": len(public_products),
    })
