"""Daily usage limit tracking for AI actions per user using DynamoDB."""
import os
import time
from datetime import datetime, timezone
from typing import Optional, Tuple

import boto3
from botocore.exceptions import ClientError

from .http import error_response

# Cost safety constraints: 20 AI actions per user per day, TTL 3 days
DAILY_AI_LIMIT = 20
TTL_DAYS = 3
TTL_SECONDS = TTL_DAYS * 86400

DEFAULT_LIMIT_MESSAGE = (
    "Daily AI limit reached (20 actions per day). Please try again tomorrow."
)


class UsageLimitExceededError(Exception):
    """Raised when user exceeds the allowed daily AI actions."""

    def __init__(self, message: str = DEFAULT_LIMIT_MESSAGE, count: int = DAILY_AI_LIMIT):
        super().__init__(message)
        self.message = message
        self.count = count
        self.status_code = 429


def get_user_id(event: dict) -> str:
    """Extracts Cognito user ID (sub) from HTTP API JWT authorizer claims."""
    try:
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        user_id = claims.get("sub")
        if not user_id:
            raise KeyError("sub claim is empty")
        return str(user_id)
    except (KeyError, TypeError, AttributeError) as e:
        raise ValueError("Unauthorized: missing user identity in request context") from e


def _get_today_date_str() -> str:
    """Returns today's date in UTC as YYYY-MM-DD."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _get_dynamodb_resource():
    """Initializes DynamoDB resource bound to Sydney (ap-southeast-2)."""
    region = os.environ.get("AWS_REGION_NAME", "ap-southeast-2")
    return boto3.resource("dynamodb", region_name=region)


def check_and_increment_usage(
    user_id: str,
    table_name: Optional[str] = None,
    date_str: Optional[str] = None,
    limit: int = DAILY_AI_LIMIT,
    dynamodb_resource=None,
) -> Tuple[bool, int]:
    """Atomically checks and increments the user's daily AI action counter in DynamoDB.

    Returns:
        (allowed: bool, current_or_new_count: int)
        If allowed is False, limit was reached and count was NOT incremented.
    """
    if not user_id:
        raise ValueError("user_id is required")

    resolved_table = table_name or os.environ.get("USAGE_TABLE", "kalamitra-usage")
    resolved_date = date_str or _get_today_date_str()
    dynamodb = dynamodb_resource or _get_dynamodb_resource()
    table = dynamodb.Table(resolved_table)

    ttl_timestamp = int(time.time()) + TTL_SECONDS

    try:
        response = table.update_item(
            Key={"ownerId": user_id, "date": resolved_date},
            UpdateExpression="ADD #cnt :inc SET #ttl = if_not_exists(#ttl, :ttl)",
            ConditionExpression="attribute_not_exists(#cnt) OR #cnt < :limit",
            ExpressionAttributeNames={"#cnt": "count", "#ttl": "ttl"},
            ExpressionAttributeValues={
                ":inc": 1,
                ":ttl": ttl_timestamp,
                ":limit": limit,
            },
            ReturnValues="UPDATED_NEW",
        )
        new_count = int(response.get("Attributes", {}).get("count", 1))
        return True, new_count
    except ClientError as e:
        if e.response.get("Error", {}).get("Code") == "ConditionalCheckFailedException":
            return False, limit
        raise


def get_usage_count(
    user_id: str,
    table_name: Optional[str] = None,
    date_str: Optional[str] = None,
    dynamodb_resource=None,
) -> int:
    """Retrieves current usage count for the given user and date without incrementing."""
    if not user_id:
        return 0

    resolved_table = table_name or os.environ.get("USAGE_TABLE", "kalamitra-usage")
    resolved_date = date_str or _get_today_date_str()
    dynamodb = dynamodb_resource or _get_dynamodb_resource()
    table = dynamodb.Table(resolved_table)

    try:
        resp = table.get_item(Key={"ownerId": user_id, "date": resolved_date})
        item = resp.get("Item")
        if item and "count" in item:
            return int(item["count"])
        return 0
    except Exception:
        return 0


def enforce_daily_limit(
    user_id: str,
    table_name: Optional[str] = None,
    limit: int = DAILY_AI_LIMIT,
    dynamodb_resource=None,
) -> Optional[dict]:
    """Enforces the daily limit. Returns HTTP 429 response dict if limit reached, else None."""
    allowed, count = check_and_increment_usage(
        user_id=user_id,
        table_name=table_name,
        limit=limit,
        dynamodb_resource=dynamodb_resource,
    )
    if not allowed:
        return error_response(
            message=DEFAULT_LIMIT_MESSAGE,
            status_code=429,
            details={"limit": limit, "count": count},
        )
    return None
