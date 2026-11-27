"""CatalogFunction: generates bilingual e-commerce catalog copy from artisan voice description."""
import os
import sys
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

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB

SYSTEM_PROMPT = """You are an expert Indian handicraft e-commerce copywriter for the KalaMitra artisan platform.
Understand the artisan's spoken text in any Indian language (often colloquial, dialect words, code-mixed with English or Hindi).
Generate authentic, warm, and honest bilingual product copy celebrating Indian traditional craftsmanship.

OUTPUT FORMAT REQUIREMENTS:
Output STRICT JSON ONLY. Do not wrap in markdown or add explanations.
The JSON must have exactly the following structure:
{
  "title_en": "Concise compelling English product title (3-7 words)",
  "title_hi": "सटीक और आकर्षक हिंदी उत्पाद शीर्षक (3-7 शब्द)",
  "description_en": "Warm and honest product story and description in English (60-90 words)",
  "description_hi": "उत्पाद की विशेषता और शिल्प कहानी का हिंदी विवरण (60-90 शब्द)",
  "category": "Standard category (e.g., textiles, pottery, jewelry, woodwork, metalcraft, paintings, etc.)",
  "materials": ["Array of specific materials used"],
  "technique": "Craft technique (e.g. handloom, wheel-thrown, block-printed)",
  "craft_tradition": "Regional heritage or tradition (e.g. Kutch, Chanderi, Madhubani, Warli)",
  "care_instructions_en": "Simple practical care instructions in English",
  "tags": ["Array of 4-8 search tags"],
  "seo_keywords": ["Array of 4-8 SEO keywords"],
  "detected_language": "Detected input language or locale code"
}

RULES:
- Word count: Descriptions must strictly be 60-90 words, warm and honest.
- Factuality: Never invent fake certifications (e.g. 'GI certified' or '100% pure organic') unless explicitly stated.
- Unknowns: Omit or gracefully generalize unknown details without fabricating history.
- Array types: materials, tags, and seo_keywords must be arrays of strings.
"""


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
            required=["transcript"],
            length_caps={"transcript": (1, 2000)},
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    transcript = body["transcript"]
    language = body.get("language", "hi-IN")
    category = body.get("category")
    image_key = body.get("imageKey")

    image_bytes = None
    image_mime = "image/jpeg"

    # 2. Fetch image if imageKey is provided
    if image_key:
        # Verify image key belongs to caller
        valid_prefix = (f"tmp/{user_id}/", f"media/{user_id}/")
        if not any(image_key.startswith(p) for p in valid_prefix):
            return error_response(
                "Unauthorized key path: imageKey must belong to caller",
                status_code=403,
            )

        media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
        region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
        s3 = boto3.client("s3", region_name=region_name)

        try:
            obj = s3.get_object(Bucket=media_bucket, Key=image_key)
            if obj.get("ContentLength", 0) > MAX_IMAGE_SIZE_BYTES:
                return error_response("Image exceeds maximum allowed size of 5MB", status_code=400)
            image_bytes = obj["Body"].read()
            if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
                return error_response("Image exceeds maximum allowed size of 5MB", status_code=400)

            image_mime = "image/png" if image_key.lower().endswith(".png") else "image/jpeg"
        except ClientError as e:
            if e.response.get("Error", {}).get("Code") == "NoSuchKey":
                return error_response("Image not found in storage", status_code=404)
            return error_response("Failed to retrieve image for cataloging", status_code=500)

    # 3. Formulate prompt for Gemini
    user_prompt = f"Artisan Voice Description ({language}):\n\"{transcript}\"\n"
    if category:
        user_prompt += f"Artisan's Indicated Category: {category}\n"
    user_prompt += "\nPlease generate the structured bilingual catalog entry JSON."

    try:
        ai_data = generate_json(
            system_prompt=SYSTEM_PROMPT,
            user_text=user_prompt,
            image_bytes=image_bytes,
            image_mime=image_mime,
        )
    except AIError as e:
        return error_response(e.message, status_code=503)
    except Exception as e:
        return error_response("Failed to generate catalog description", status_code=500)

    return success_response(ai_data)
