"""UploadUrlFunction: generates presigned PUT URLs for artisan craft photos."""
import os
import sys
import uuid
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
from common.limits import get_user_id

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
PRESIGNED_URL_EXPIRES_SECONDS = 300  # 5 minutes


def lambda_handler(event, context):
    try:
        user_id = get_user_id(event)
    except (ValueError, KeyError):
        return error_response("Unauthorized: Missing or invalid token", status_code=401)

    try:
        body = parse_body(event)
        validate_payload(
            body,
            required=["contentType"],
            allowed_values={"contentType": ALLOWED_CONTENT_TYPES},
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    content_type = body["contentType"]
    ext = ".jpg" if content_type == "image/jpeg" else ".png"
    file_uuid = str(uuid.uuid4())
    key = f"tmp/{user_id}/{file_uuid}{ext}"

    media_bucket = os.environ.get("MEDIA_BUCKET", "kalamitra-media")
    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")

    s3 = boto3.client("s3", region_name=region_name)
    try:
        upload_url = s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": media_bucket,
                "Key": key,
                "ContentType": content_type,
            },
            ExpiresIn=PRESIGNED_URL_EXPIRES_SECONDS,
        )
    except Exception as e:
        return error_response(f"Failed to generate upload URL: {str(e)}", status_code=500)

    return success_response({
        "uploadUrl": upload_url,
        "key": key,
        "expiresIn": PRESIGNED_URL_EXPIRES_SECONDS,
    })
