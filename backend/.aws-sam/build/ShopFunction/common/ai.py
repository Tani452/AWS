"""Provider-agnostic AI layer supporting Google Gemini REST API with JSON enforcement.

Calls the Google Gemini REST API using urllib from Python's standard library.
API key is securely loaded from SSM Parameter Store at runtime and cached in memory.
Never logs keys or prompts.
"""
import base64
import json
import logging
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Optional

import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger("kalamitra.common.ai")
logger.setLevel(logging.INFO)

# In-memory per-container API key cache
_CACHED_GEMINI_KEY: Optional[str] = None

# Free-tier Flash model supporting multimodal and structured JSON output
DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"
GEMINI_ENDPOINT_TEMPLATE = (
    "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
)

# Operational limits - safe for Lambda 25s timeout
REQUEST_TIMEOUT_SECONDS = 15
MAX_RETRIES = 1
INITIAL_BACKOFF_SECONDS = 1.5


class AIError(Exception):
    """User-friendly AI service exception."""

    def __init__(self, message: str = "AI service is temporarily unavailable. Please try again."):
        super().__init__(message)
        self.message = message


def get_gemini_api_key(force_refresh: bool = False) -> str:
    """Retrieves Gemini API key from SSM Parameter Store (SecureString) with decryption.

    Caches the decrypted key in-memory per container lifecycle.
    Never logs the key or parameter value.
    """
    global _CACHED_GEMINI_KEY

    if _CACHED_GEMINI_KEY and not force_refresh:
        return _CACHED_GEMINI_KEY

    param_name = os.environ.get("GEMINI_KEY_PARAM", "/kalamitra/gemini-key")
    region_name = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")

    try:
        ssm = boto3.client("ssm", region_name=region_name)
        response = ssm.get_parameter(Name=param_name, WithDecryption=True)
        key_value = response.get("Parameter", {}).get("Value")
        if not key_value or not key_value.strip():
            raise AIError("AI service configuration error: Empty API key in Parameter Store.")
        _CACHED_GEMINI_KEY = key_value.strip()
        return _CACHED_GEMINI_KEY
    except ClientError as e:
        logger.error("Failed to retrieve SSM parameter: %s", e.response.get("Error", {}).get("Code"))
        raise AIError("AI service configuration is temporarily unavailable. Please contact support.") from e
    except Exception as e:
        logger.error("Unexpected error retrieving AI credentials: %s", type(e).__name__)
        raise AIError("AI service credentials could not be loaded.") from e


def _clean_and_parse_json(raw_text: str) -> dict:
    """Robust JSON parser that strips markdown code blocks and extracts JSON objects."""
    if not raw_text or not isinstance(raw_text, str):
        raise ValueError("Empty or non-string response from AI model")

    text = raw_text.strip()

    # Strip markdown code blocks like ```json ... ``` or ``` ... ```
    if text.startswith("```"):
        lines = text.splitlines()
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip().startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    # Attempt direct JSON parse
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
        if isinstance(parsed, list):
            return {"items": parsed}
    except json.JSONDecodeError:
        pass

    # Fallback: attempt to find outermost curly braces
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        snippet = text[first_brace : last_brace + 1]
        try:
            parsed = json.loads(snippet)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Unable to parse valid JSON from AI response: {text[:100]}...")


def _call_gemini_rest_api(
    system_prompt: str,
    user_text: str,
    image_bytes: Optional[bytes] = None,
    image_mime: str = "image/jpeg",
) -> dict:
    """Executes a single generateContent call to Gemini REST API via urllib."""
    api_key = get_gemini_api_key()
    model = os.environ.get("GEMINI_MODEL", DEFAULT_GEMINI_MODEL)
    endpoint = GEMINI_ENDPOINT_TEMPLATE.format(model=model, key=api_key)

    # Build parts
    parts = []
    if image_bytes:
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        parts.append({
            "inline_data": {
                "mime_type": image_mime,
                "data": b64_image,
            }
        })
    parts.append({"text": user_text})

    payload: dict[str, Any] = {
        "contents": [
            {
                "role": "user",
                "parts": parts,
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2,
            "maxOutputTokens": 2048,
        },
    }

    if system_prompt:
        payload["system_instruction"] = {
            "parts": [{"text": system_prompt}]
        }

    encoded_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url=endpoint,
        data=encoded_data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    logger.info(
        "Calling Gemini REST API model=%s has_image=%s prompt_len=%d",
        model,
        bool(image_bytes),
        len(user_text),
    )

    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as response:
        resp_bytes = response.read()
        resp_json = json.loads(resp_bytes.decode("utf-8"))

    # Extract text from candidates
    candidates = resp_json.get("candidates", [])
    if not candidates:
        prompt_feedback = resp_json.get("promptFeedback", {})
        block_reason = prompt_feedback.get("blockReason")
        if block_reason:
            logger.warning("Gemini generation blocked: %s", block_reason)
            raise AIError("The request was flagged by content safety filters. Please adjust the input.")
        raise AIError("No response candidates returned by the AI service.")

    content = candidates[0].get("content", {})
    candidate_parts = content.get("parts", [])
    if not candidate_parts:
        raise AIError("AI service returned an empty candidate response.")

    raw_text = candidate_parts[0].get("text", "")
    return _clean_and_parse_json(raw_text)


def _generate_json_gemini(
    system_prompt: str,
    user_text: str,
    image_bytes: Optional[bytes] = None,
    image_mime: str = "image/jpeg",
) -> dict:
    """Calls Gemini REST API with retry on 429/5xx, timeouts, and JSON parsing retry."""
    last_exception: Optional[Exception] = None
    json_retry_used = False

    for attempt in range(MAX_RETRIES + 1):
        try:
            return _call_gemini_rest_api(
                system_prompt=system_prompt,
                user_text=user_text,
                image_bytes=image_bytes,
                image_mime=image_mime,
            )
        except urllib.error.HTTPError as e:
            last_exception = e
            status = e.code
            logger.warning("Gemini API HTTP %d on attempt %d/%d", status, attempt + 1, MAX_RETRIES + 1)

            # Retry once on 429 (rate limit) or 5xx (server error)
            if status == 429 or 500 <= status < 600:
                if attempt < MAX_RETRIES:
                    sleep_time = INITIAL_BACKOFF_SECONDS * (2**attempt)
                    time.sleep(sleep_time)
                    continue

            if status == 429:
                raise AIError("AI assistant is experiencing high demand right now. Please wait a moment and try again.") from e
            else:
                raise AIError("The AI service is currently busy or experiencing issues. Please try again shortly.") from e

        except (urllib.error.URLError, TimeoutError) as e:
            last_exception = e
            logger.warning("Gemini API network/timeout error on attempt %d: %s", attempt + 1, str(e))
            if attempt < MAX_RETRIES:
                sleep_time = INITIAL_BACKOFF_SECONDS * (2**attempt)
                time.sleep(sleep_time)
                continue
            raise AIError("AI service request timed out. Please check your connection and retry.") from e

        except ValueError as e:
            # JSON parsing error from the model response - retry once
            last_exception = e
            logger.warning("JSON parse failed on attempt %d: %s", attempt + 1, str(e))
            if not json_retry_used and attempt < MAX_RETRIES:
                json_retry_used = True
                time.sleep(INITIAL_BACKOFF_SECONDS)
                continue
            raise AIError("AI service returned an invalid structured format. Please retry.") from e

        except AIError:
            raise

        except Exception as e:
            last_exception = e
            logger.error("Unexpected error in Gemini generation: %s", type(e).__name__)
            raise AIError("An unexpected error occurred while communicating with the AI service.") from e

    raise AIError("AI service request failed after retries.") from last_exception


def _generate_json_bedrock(
    system_prompt: str,
    user_text: str,
    image_bytes: Optional[bytes] = None,
    image_mime: str = "image/jpeg",
) -> dict:
    """Optional untested Bedrock branch for architectural compatibility."""
    raise NotImplementedError(
        "AWS Bedrock is not enabled or usable for this environment. Use AI_PROVIDER='gemini'."
    )


def generate_json(
    system_prompt: str,
    user_text: str,
    image_bytes: Optional[bytes] = None,
    image_mime: str = "image/jpeg",
) -> dict:
    """Unified entry point to generate structured JSON using an AI provider.

    Reads AI_PROVIDER (default: 'gemini').
    """
    provider = os.environ.get("AI_PROVIDER", "gemini").strip().lower()

    if provider == "gemini":
        return _generate_json_gemini(
            system_prompt=system_prompt,
            user_text=user_text,
            image_bytes=image_bytes,
            image_mime=image_mime,
        )
    elif provider == "bedrock":
        return _generate_json_bedrock(
            system_prompt=system_prompt,
            user_text=user_text,
            image_bytes=image_bytes,
            image_mime=image_mime,
        )
    else:
        raise AIError(f"Unsupported AI provider: '{provider}'. Supported: 'gemini'.")
