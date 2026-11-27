"""PriceFunction: recommends fair craft pricing based on material, labor, and reference data."""
import os
import sys
from decimal import Decimal
import boto3
from botocore.exceptions import ClientError

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.ai import AIError, generate_json
from common.http import (
    ValidationError,
    error_response,
    parse_body,
    success_response,
    validate_payload,
)
from common.limits import enforce_daily_limit, get_user_id

DEFAULT_LABOUR_RATE_PER_HOUR = 100.0  # Rs 100 per hour fair artisan wage
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

SYSTEM_PROMPT = """You are a fair-trade pricing advisor for Indian artisans and craft entrepreneurs on the KalaMitra platform.
Your mission is to ensure artisans earn a dignity-affirming wage, recover material expenses, and capture a fair profit margin.

OUTPUT FORMAT REQUIREMENTS:
Output STRICT JSON ONLY. Do not wrap in markdown or add explanations.
The JSON must have exactly this shape:
{
  "min_price": <number: lowest fair price in INR>,
  "suggested_price": <number: recommended selling price in INR>,
  "max_price": <number: premium boutique price in INR>,
  "reasoning_en": "<clear explanation in English explaining why this price is fair and competitive>",
  "reasoning_hi": "<स्पष्ट और सरल हिंदी में मूल्य निर्धारण का कारण>",
  "breakdown": {
    "material": <number: material cost in INR>,
    "labour": <number: labour cost in INR>,
    "margin": <number: artisan profit margin in INR>
  },
  "tips": [
    "<3-4 actionable tips on how the artisan can increase perceived value, bundle items, or market this craft>"
  ]
}

RULES:
- Suggested price must be >= material + labor cost floor.
- Prices must be realistic and practical for Indian handcrafted items.
- Always provide tips to help the artisan maximize income.
"""


def _get_reference_price(category: str, table) -> dict:
    """Reads reference price row for the category from DynamoDB."""
    clean_cat = category.strip().lower()
    try:
        resp = table.get_item(Key={"category": clean_cat})
        if "Item" in resp:
            return resp["Item"]

        # Try with common prefixes/suffixes
        scan_resp = table.scan(Limit=50)
        items = scan_resp.get("Items", [])
        for item in items:
            cat_name = str(item.get("category", "")).lower()
            if clean_cat in cat_name or cat_name in clean_cat:
                return item
    except Exception:
        pass

    return {}


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    # 1. Enforce AI daily action limit
    limit_resp = enforce_daily_limit(user_id)
    if limit_resp:
        return limit_resp

    try:
        body = parse_body(event)
        validate_payload(
            body,
            required=["category", "materialCostInr", "hoursOfWork"],
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    category = str(body["category"]).strip()
    try:
        material_cost = float(body.get("materialCostInr", 0))
        hours_of_work = float(body.get("hoursOfWork", 0))
        quantity = int(body.get("quantity", 1)) or 1
        if material_cost < 0 or hours_of_work < 0 or quantity < 1:
            return error_response("Cost, hours, and quantity must be non-negative", status_code=400)
    except (ValueError, TypeError):
        return error_response("Invalid numeric value for cost, hours, or quantity", status_code=400)

    description = body.get("description", "")
    image_key = body.get("imageKey")

    # 2. Compute cost floor: material + labour at default Rs 100/hr
    labour_cost = round(hours_of_work * DEFAULT_LABOUR_RATE_PER_HOUR, 2)
    cost_floor = round(material_cost + labour_cost, 2)

    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    ref_table_name = os.environ.get("REFERENCE_PRICES_TABLE", "kalamitra-reference-prices")
    dynamodb = boto3.resource("dynamodb", region_name=region_name)
    ref_table = dynamodb.Table(ref_table_name)

    ref_data = _get_reference_price(category, ref_table)
    ref_context = ""
    if ref_data:
        ref_context = (
            f"Market Reference for {ref_data.get('category')}: "
            f"Typical market price range: ₹{ref_data.get('min_inr')} - ₹{ref_data.get('max_inr')} "
            f"(Median: ₹{ref_data.get('typical_inr')})."
        )

    # 3. Optional image retrieval
    image_bytes = None
    image_mime = "image/jpeg"
    if image_key:
        valid_prefix = (f"tmp/{user_id}/", f"media/{user_id}/")
        if not any(image_key.startswith(p) for p in valid_prefix):
            return error_response("Unauthorized key path: imageKey must belong to caller", status_code=403)

        media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
        s3 = boto3.client("s3", region_name=region_name)
        try:
            obj = s3.get_object(Bucket=media_bucket, Key=image_key)
            if obj.get("ContentLength", 0) > MAX_IMAGE_SIZE_BYTES:
                return error_response("Image exceeds maximum allowed size of 5MB", status_code=400)
            image_bytes = obj["Body"].read()
            image_mime = "image/png" if image_key.lower().endswith(".png") else "image/jpeg"
        except ClientError:
            pass  # Continue without image if fetch fails

    # 4. Formulate prompt and call AI
    user_prompt = (
        f"Craft Details:\n"
        f"- Category: {category}\n"
        f"- Description: {description}\n"
        f"- Raw Material Cost: ₹{material_cost}\n"
        f"- Artisan Labor Time: {hours_of_work} hours (baseline rate ₹100/hr = ₹{labour_cost})\n"
        f"- Baseline Cost Floor: ₹{cost_floor}\n"
        f"- Quantity Produced: {quantity}\n"
        f"{ref_context}\n"
        f"Recommend a fair minimum, suggested, and maximum price ensuring healthy artisan livelihood."
    )

    try:
        ai_result = generate_json(
            system_prompt=SYSTEM_PROMPT,
            user_text=user_prompt,
            image_bytes=image_bytes,
            image_mime=image_mime,
        )
    except (AIError, Exception) as e:
        print(f"Notice: Gemini pricing recommendation failed ({type(e).__name__}: {str(e)}), applying mathematical fair-trade formula.")
        ai_result = {
            "suggested_price": round(cost_floor * 1.35, 2),
            "min_price": round(cost_floor * 1.10, 2),
            "max_price": round(cost_floor * 1.75, 2),
            "reasoning_en": f"Calculated based on raw materials of ₹{material_cost} and fair wage of ₹{labour_cost} for {hours_of_work} hours of artisan effort (₹100/hr) plus a 35% margin.",
            "reasoning_hi": f"₹{material_cost} की सामग्री लागत और {hours_of_work} घंटे के श्रम (₹{labour_cost}) के आधार पर 35% लाभ जोड़कर उचित मूल्य निर्धारित किया गया है।",
            "tips": [
                "Mention your craft tradition in the story to highlight authenticity.",
                "Offer bundle options for multiple pieces to increase overall order value.",
                "Provide secure festive packaging for gift buyers.",
            ],
            "isFallback": True,
        }

    # 5. Enforce in code: suggested >= cost floor and min <= suggested <= max
    try:
        raw_suggested = float(ai_result.get("suggested_price", cost_floor * 1.35))
        raw_min = float(ai_result.get("min_price", cost_floor))
        raw_max = float(ai_result.get("max_price", max(cost_floor * 1.8, raw_suggested * 1.25)))
    except (ValueError, TypeError):
        raw_suggested = round(cost_floor * 1.35, 2)
        raw_min = cost_floor
        raw_max = round(cost_floor * 1.8, 2)

    # Strict enforcement
    suggested_price = max(raw_suggested, cost_floor)
    min_price = min(raw_min, suggested_price)
    if min_price < cost_floor:
        min_price = cost_floor
    max_price = max(raw_max, suggested_price)

    suggested_price = round(suggested_price, 2)
    min_price = round(min_price, 2)
    max_price = round(max_price, 2)

    margin = round(suggested_price - cost_floor, 2)

    reasoning_en = ai_result.get(
        "reasoning_en",
        f"Calculated based on material expenses of ₹{material_cost} and fair wage of ₹{labour_cost} for {hours_of_work} hours of handcrafting.",
    )
    reasoning_hi = ai_result.get(
        "reasoning_hi",
        f"₹{material_cost} की सामग्री लागत और {hours_of_work} घंटे के श्रम (₹{labour_cost}) के आधार पर उचित मूल्य निर्धारित किया गया है।",
    )
    tips = ai_result.get("tips", [
        "Mention the handcrafted techniques in your story to justify premium pricing.",
        "Highlight natural/traditional materials used to attract conscious buyers.",
    ])

    return success_response({
        "costFloor": cost_floor,
        "min_price": min_price,
        "suggested_price": suggested_price,
        "max_price": max_price,
        "reasoning_en": reasoning_en,
        "reasoning_hi": reasoning_hi,
        "breakdown": {
            "material": material_cost,
            "labour": labour_cost,
            "margin": margin,
        },
        "tips": tips,
        "disclaimer": "These price recommendations are indicative estimates and not legally binding or guaranteed market rates.",
    })
