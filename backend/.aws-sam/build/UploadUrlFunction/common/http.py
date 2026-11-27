"""HTTP and JSON response builder with CORS headers, error helpers, and input validation."""
import json
import base64
from decimal import Decimal
from typing import Any, Iterable, Optional, Union

# Standard CORS headers allowed by HTTP API Gateway
CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Requested-With,Accept,Origin",
}


class DecimalEncoder(json.JSONEncoder):
    """Encodes DynamoDB Decimal objects to int or float for JSON serialization."""

    def default(self, o: Any) -> Any:
        if isinstance(o, Decimal):
            return float(o) if (o % 1 > 0) else int(o)
        return super().default(o)


class ValidationError(Exception):
    """Raised when request payload fails validation constraints."""

    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(message)
        self.message = message
        self.field = field


def json_response(
    data: Any,
    status_code: int = 200,
    headers: Optional[dict] = None,
) -> dict:
    """Builds a standardized API Gateway HTTP response."""
    resp_headers = dict(CORS_HEADERS)
    if headers:
        resp_headers.update(headers)
    return {
        "statusCode": status_code,
        "headers": resp_headers,
        "body": json.dumps(data, cls=DecimalEncoder),
    }


def success_response(
    data: Any,
    status_code: int = 200,
    headers: Optional[dict] = None,
) -> dict:
    """Convenience helper for 2xx responses."""
    return json_response(data, status_code=status_code, headers=headers)


def error_response(
    message: str,
    status_code: int = 400,
    details: Optional[Any] = None,
    headers: Optional[dict] = None,
) -> dict:
    """Convenience helper for error responses with consistent payload shape."""
    payload: dict = {"ok": False, "error": message}
    if details is not None:
        payload["details"] = details
    return json_response(payload, status_code=status_code, headers=headers)


def parse_body(event: dict) -> dict:
    """Parses JSON body from an API Gateway event, handling base64 encoding."""
    if not isinstance(event, dict):
        raise ValidationError("Invalid event format")

    body = event.get("body")
    if body is None:
        return {}

    if isinstance(body, dict):
        return body

    if not isinstance(body, str):
        raise ValidationError("Request body must be a JSON string or dict")

    if event.get("isBase64Encoded", False):
        try:
            body = base64.b64decode(body).decode("utf-8")
        except Exception as e:
            raise ValidationError("Failed to decode base64 body") from e

    stripped = body.strip()
    if not stripped:
        return {}

    try:
        parsed = json.loads(stripped)
        if not isinstance(parsed, dict):
            raise ValidationError("Request JSON root must be an object")
        return parsed
    except json.JSONDecodeError as e:
        raise ValidationError(f"Invalid JSON in request body: {e.msg}") from e


def validate_required(data: dict, fields: Iterable[str]) -> None:
    """Validates that all specified fields exist and are not empty/None."""
    if not isinstance(data, dict):
        raise ValidationError("Data must be a dictionary")
    for field in fields:
        if field not in data or data[field] is None:
            raise ValidationError(f"Missing required field: '{field}'", field=field)
        val = data[field]
        if isinstance(val, str) and not val.strip():
            raise ValidationError(f"Field '{field}' cannot be empty", field=field)


def validate_string_length(
    data: dict,
    field: str,
    max_length: int,
    min_length: int = 0,
) -> None:
    """Validates string length for a field if present."""
    if field not in data or data[field] is None:
        return
    val = data[field]
    if not isinstance(val, str):
        raise ValidationError(f"Field '{field}' must be a string", field=field)
    if len(val) < min_length:
        raise ValidationError(
            f"Field '{field}' must be at least {min_length} characters",
            field=field,
        )
    if len(val) > max_length:
        raise ValidationError(
            f"Field '{field}' cannot exceed {max_length} characters",
            field=field,
        )


def validate_allowed_values(
    data: dict,
    field: str,
    allowed: Iterable[Any],
) -> None:
    """Validates that a field value is among allowed values if present."""
    if field not in data or data[field] is None:
        return
    val = data[field]
    allowed_set = set(allowed)
    if val not in allowed_set:
        allowed_list = sorted(list(allowed_set)) if all(isinstance(x, (int, str)) for x in allowed_set) else list(allowed_set)
        raise ValidationError(
            f"Field '{field}' must be one of: {allowed_list}",
            field=field,
        )


def validate_payload(
    data: dict,
    required: Optional[Iterable[str]] = None,
    length_caps: Optional[dict[str, Union[int, tuple[int, int]]]] = None,
    allowed_values: Optional[dict[str, Iterable[Any]]] = None,
) -> None:
    """Convenience multi-rule validator for incoming API payloads."""
    if required:
        validate_required(data, required)

    if length_caps:
        for field, cap in length_caps.items():
            if isinstance(cap, tuple):
                min_len, max_len = cap
            else:
                min_len, max_len = 0, cap
            validate_string_length(data, field, max_length=max_len, min_length=min_len)

    if allowed_values:
        for field, allowed in allowed_values.items():
            validate_allowed_values(data, field, allowed)
