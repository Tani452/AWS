"""EnhanceFunction: analyzes craft image with Rekognition and enforces AI limits."""
import os
import sys
import boto3
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
from common.limits import enforce_daily_limit, get_user_id

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB hard limit

# Mapping Rekognition labels to Indian handicraft craft categories
CRAFT_CATEGORY_MAP = {
    "textiles": ["Textile", "Cloth", "Pattern", "Dress", "Saree", "Scarf", "Embroidery", "Clothing", "Silk", "Cotton", "Weaving", "Shawl", "Quilt"],
    "pottery": ["Pottery", "Ceramic", "Vase", "Clay", "Earthenware", "Pot", "Jug", "Terracotta"],
    "jewelry": ["Jewelry", "Necklace", "Bracelet", "Earring", "Gemstone", "Ornament", "Bead", "Silver", "Gold"],
    "woodwork": ["Wood", "Carving", "Furniture", "Sculpture", "Wooden Toy", "Hardwood"],
    "metalcraft": ["Metal", "Brass", "Bronze", "Copper", "Bell", "Idol", "Statue", "Lamp"],
    "paintings": ["Painting", "Art", "Drawing", "Artwork", "Canvas", "Illustration"],
    "leathercraft": ["Leather", "Footwear", "Shoe", "Bag", "Purse", "Sandal"],
    "bamboo_craft": ["Bamboo", "Basket", "Wicker", "Cane", "Jute"],
}


def _guess_category(labels: list[str]) -> str:
    """Guesses handicraft category from detected Rekognition labels."""
    label_set = {lbl.lower() for lbl in labels}
    for category, keywords in CRAFT_CATEGORY_MAP.items():
        for kw in keywords:
            if kw.lower() in label_set:
                return category
    return "handicrafts"


def _generate_tips(brightness: float, sharpness: float, contrast: float) -> list[str]:
    """Generates plain, artisan-friendly tips for lighting and clarity."""
    tips = []
    if brightness < 40.0:
        tips.append("Photo is dark: move near a window or turn on a light.")
    elif brightness > 85.0:
        tips.append("Photo has heavy glare: avoid harsh direct light on the craft.")

    if sharpness < 45.0:
        tips.append("Photo looks blurry: hold the phone steady or tap the screen to focus.")

    if contrast < 30.0:
        tips.append("Photo lacks contrast: place your craft against a plain, contrasting surface.")

    if not tips:
        tips.append("Photo quality looks great! Lighting and details are clear.")

    return tips


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    # 1. Enforce AI daily action limit (20 actions per user per day)
    limit_resp = enforce_daily_limit(user_id)
    if limit_resp:
        return limit_resp

    try:
        body = parse_body(event)
        validate_payload(body, required=["key"])
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    key = body["key"]
    # Key MUST start with tmp/<sub>/
    expected_prefix = f"tmp/{user_id}/"
    if not key.startswith(expected_prefix):
        return error_response(
            f"Unauthorized key path: Key must start with tmp/{user_id}/",
            status_code=403,
        )

    media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")

    s3 = boto3.client("s3", region_name=region_name)
    rekognition = boto3.client("rekognition", region_name=region_name)

    # 2. Read image from S3 and reject if over 5MB
    try:
        obj = s3.get_object(Bucket=media_bucket, Key=key)
        content_length = obj.get("ContentLength", 0)
        if content_length > MAX_IMAGE_SIZE_BYTES:
            return error_response("Image exceeds maximum allowed size of 5MB", status_code=400)

        image_bytes = obj["Body"].read()
        if len(image_bytes) > MAX_IMAGE_SIZE_BYTES:
            return error_response("Image exceeds maximum allowed size of 5MB", status_code=400)
    except ClientError as e:
        error_code = e.response.get("Error", {}).get("Code", "Unknown")
        if error_code == "NoSuchKey":
            return error_response("Image file not found in storage", status_code=404)
        return error_response("Failed to read image from storage", status_code=500)

    # 3. Call Rekognition DetectLabels with IMAGE_PROPERTIES
    try:
        rekog_resp = rekognition.detect_labels(
            Image={"Bytes": image_bytes},
            Features=["GENERAL_LABELS", "IMAGE_PROPERTIES"],
            MaxLabels=10,
        )
    except Exception as e:
        return error_response("Failed to analyze image with Rekognition", status_code=500)

    # 4. Extract quality scores
    image_properties = rekog_resp.get("ImageProperties", {})
    quality = image_properties.get("Quality", {})
    brightness = round(float(quality.get("Brightness", 50.0)), 1)
    sharpness = round(float(quality.get("Sharpness", 50.0)), 1)
    contrast = round(float(quality.get("Contrast", 50.0)), 1)

    # 5. Extract top detected labels
    raw_labels = rekog_resp.get("Labels", [])
    labels = [
        {
            "name": lbl.get("Name", ""),
            "confidence": round(float(lbl.get("Confidence", 0.0)), 1),
        }
        for lbl in raw_labels[:10]
    ]

    label_names = [lbl["name"] for lbl in labels]
    guessed_category = _guess_category(label_names)
    tips = _generate_tips(brightness, sharpness, contrast)

    return success_response({
        "detectedLabels": labels,
        "guessedCategory": guessed_category,
        "qualityScores": {
            "brightness": brightness,
            "sharpness": sharpness,
            "contrast": contrast,
        },
        "tips": tips,
    })
