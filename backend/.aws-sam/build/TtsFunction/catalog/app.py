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
Generate authentic, warm, and honest product copy celebrating Indian traditional craftsmanship.

OUTPUT FORMAT REQUIREMENTS:
Output STRICT JSON ONLY. Do not wrap in markdown or add explanations.
The JSON must have exactly the following structure:
{
  "title_en": "Concise compelling English product title (3-7 words)",
  "title_hi": "सटीक और आकर्षक हिंदी उत्पाद शीर्षक (3-7 शब्द)",
  "title_regional": "Compelling product title in the artisan's selected language/locale (3-7 words)",
  "description_en": "Warm and honest product story and description in English (60-90 words)",
  "description_hi": "उत्पाद की विशेषता और शिल्प कहानी का हिंदी विवरण (60-90 शब्द)",
  "description_regional": "Warm and honest product story and description in the artisan's selected language/locale (60-90 words)",
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
- Regional language: title_regional and description_regional MUST be in the requested language (e.g. Gujarati script for gu-IN, Marathi in Devanagari for mr-IN, Tamil script for ta-IN, Bengali script for bn-IN, Telugu script for te-IN, Kannada script for kn-IN, Gurmukhi for pa-IN).
"""


def _generate_fallback_catalog(transcript: str, category: str, language: str) -> dict:
    """Generates an authentic fallback catalog draft when AI service is busy/unconfigured."""
    text_lower = transcript.lower()
    clean_cat = (category or "handicrafts").replace("_", " ").title()

    # Smart keyword-based translation for common artisan concepts when AI is offline
    is_water_bottle = any(w in text_lower for w in ["पाणी", "पिण्यासाठी", "पानी", "पीने", "water", "bottle", "मटका"])
    is_textile = any(w in text_lower for w in ["कापड", "रेशम", "सिल्क", "साड़ी", "हातमाग", "weaving", "cloth", "saree"])
    is_pottery = any(w in text_lower for w in ["माती", "कुंभार", "भांडे", "clay", "pottery", "terracotta"])
    is_metal = any(w in text_lower for w in ["तांबे", "पीतल", "धातू", "brass", "copper", "metal", "घंटी"])

    if is_water_bottle:
        title_en = "Artisanal Pure Drinking Water Bottle & Vessel"
        desc_en = (
            "Specially crafted for healthy everyday hydration and storing pure drinking water. "
            "Handmade using authentic Indian artisan traditions to keep water naturally cool and fresh."
        )
        title_mr = "पारंपरिक हस्तनिर्मित पाणी पिण्याची बाटली"
        desc_mr = f"शुद्ध पाणी पिण्यासाठी आणि दैनंदिन वापरासाठी निष्ठेने घडवलेली सुंदर बाटली: {transcript.strip()}। अस्सल भारतीय कारागिरीचे प्रतीक."
    elif is_pottery:
        title_en = f"Traditional Terracotta Clay {clean_cat}"
        desc_en = (
            "Wheel-thrown by master artisans from organic riverbed clay. "
            "Naturally porous and eco-friendly, keeping water and food cool and chemical-free."
        )
        title_mr = f"पारंपरिक मातीची हस्तकला - {clean_cat}"
        desc_mr = f"नदीच्या नैसर्गिक मातीपासून कुंभाराच्या चाकावर घडवलेले अस्सल भांडे: {transcript.strip()}."
    elif is_textile:
        title_en = f"Heritage Handwoven {clean_cat}"
        desc_en = (
            "Woven on traditional handlooms using natural organic yarns and heritage weave motifs. "
            "Represents weeks of patient craftsmanship and sustainable Indian textile heritage."
        )
        title_mr = f"पारंपरिक हातमाग विणकाम {clean_cat}"
        desc_mr = f"पारंपरिक हातमागावर नैसर्गिक धाग्यांनी विणलेले देखणे वस्त्र: {transcript.strip()}."
    elif is_metal:
        title_en = f"Hand-Cast Solid Brass & Metal {clean_cat}"
        desc_en = (
            "Handcrafted through time-honored metal casting and intricate surface engraving. "
            "Designed for enduring domestic utility, auspicious home decor, and pure daily rituals."
        )
        title_mr = f"नक्काशीदार धातू हस्तशिल्प {clean_cat}"
        desc_mr = f"शुद्ध धातूपासून कारागिरांनी हाताने घडवलेले पारंपरिक शिल्प: {transcript.strip()}."
    else:
        # Check if transcript contains Non-ASCII characters (e.g. Marathi/Hindi script)
        has_indic = any(ord(c) > 127 for c in transcript)
        if has_indic:
            title_en = f"Authentic Handcrafted Artisan {clean_cat}"
            desc_en = (
                f"Authentically handmade with time-honored traditional devotion. "
                "Crafted using pure, sustainable materials and heritage techniques that celebrate authentic Indian artisan pride."
            )
        else:
            title_en = f"Authentic Handcrafted {clean_cat} - {transcript.strip()[:35]}"
            desc_en = f"Handmade with artisanal devotion: {transcript.strip()[:180]}. Crafted using time-honored traditional techniques celebrating Indian heritage."

        title_mr = f"पारंपरिक हस्तनिर्मित {clean_cat}"
        desc_mr = f"पारंपरिक कारागिरी आणि निष्ठेने साकारलेले शिल्प: {transcript.strip()[:180]}। भारतीय समृद्ध संस्कृती आणि कौशल्याचा सुंदर संगम."

    # Select regional title and description based on selected language
    lang_code = language.split("-")[0] if language else "hi"
    title_regional = title_mr if lang_code == "mr" else f"पारंपरिक हस्तनिर्मित {clean_cat}"
    desc_regional = desc_mr if lang_code == "mr" else f"पारंपरिक कारीगरी और निष्ठा से तैयार: {transcript.strip()[:180]}। भारतीय शिल्प कला का सुंदर संगम।"

    return {
        "title_en": title_en,
        "title_hi": f"पारंपरिक हस्तनिर्मित {clean_cat}",
        "title_regional": title_regional,
        "description_en": desc_en,
        "description_hi": f"पारंपरिक कारीगरी और निष्ठा से तैयार: {transcript.strip()[:180]}। भारतीय शिल्प कला का सुंदर संगम।",
        "description_regional": desc_regional,
        "category": "pottery" if is_pottery or is_water_bottle else (category or "handicrafts"),
        "materials": ["Natural Traditional Materials", "Eco-friendly Elements"],
        "technique": "Handmade Craftsmanship",
        "craft_tradition": "Indian Artisan Heritage",
        "care_instructions_en": "Keep away from harsh direct sunlight. Gently wipe with a soft dry cloth.",
        "tags": ["handcrafted", "artisanal", "madeinbharat", "traditional", "heritage", clean_cat.lower()],
        "seo_keywords": ["authentic indian craft", "handmade artisan product", "bharat crafts"],
        "detected_language": language,
        "isFallback": True,
        "notice": "AI service is running in resilient smart draft mode.",
    }


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
        valid_prefix = (f"tmp/{user_id}/", f"media/{user_id}/")
        if any(image_key.startswith(p) for p in valid_prefix):
            media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
            region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
            s3 = boto3.client("s3", region_name=region_name)

            try:
                obj = s3.get_object(Bucket=media_bucket, Key=image_key)
                content_len = obj.get("ContentLength", 0)
                if content_len <= MAX_IMAGE_SIZE_BYTES:
                    image_bytes = obj["Body"].read()
                    image_mime = "image/png" if image_key.lower().endswith(".png") else "image/jpeg"
                else:
                    print(f"Notice: Image exceeds 5MB ({content_len} bytes), cataloging with text description.")
            except Exception as e:
                print(f"Notice: S3 image fetch skipped for {image_key} ({e}), cataloging with text description.")
                image_bytes = None

    # 3. Formulate prompt for Gemini
    user_prompt = f"Artisan Voice Description ({language}):\n\"{transcript}\"\n"
    if category:
        user_prompt += f"Artisan's Indicated Category: {category}\n"
    user_prompt += f"\nPlease generate the structured catalog entry JSON with English (title_en, description_en) and {language} (title_regional, description_regional) plus Hindi (title_hi, description_hi)."

    try:
        ai_data = generate_json(
            system_prompt=SYSTEM_PROMPT,
            user_text=user_prompt,
            image_bytes=image_bytes,
            image_mime=image_mime,
        )
    except (AIError, Exception) as e:
        # Graceful fallback so demo / live hackathon presentations never crash
        print(f"Notice: Gemini catalog generation failed ({type(e).__name__}: {str(e)}), generating smart fallback draft.")
        ai_data = _generate_fallback_catalog(transcript, category or "handicrafts", language)

    return success_response(ai_data)
