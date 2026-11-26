"""Unit tests for shared backend modules: http, limits, and ai."""
import base64
import io
import json
import os
import sys
from decimal import Decimal
from unittest import mock
import urllib.error

import pytest
from botocore.exceptions import ClientError

# Ensure backend/src is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from common import ai, http, limits, utils
from common.ai import AIError
from common.http import ValidationError


# ==============================================================================
# HTTP MODULE TESTS
# ==============================================================================
class TestHttpModule:
    def test_decimal_encoder(self):
        data = {"float_val": Decimal("19.99"), "int_val": Decimal("42")}
        encoded = json.dumps(data, cls=http.DecimalEncoder)
        decoded = json.loads(encoded)
        assert decoded["float_val"] == 19.99
        assert decoded["int_val"] == 42

    def test_json_response_and_cors(self):
        resp = http.json_response({"message": "hello"}, status_code=201)
        assert resp["statusCode"] == 201
        assert resp["headers"]["Access-Control-Allow-Origin"] == "*"
        assert resp["headers"]["Content-Type"] == "application/json"
        body = json.loads(resp["body"])
        assert body == {"message": "hello"}

    def test_success_and_error_response(self):
        success = http.success_response({"ok": True})
        assert success["statusCode"] == 200
        assert json.loads(success["body"])["ok"] is True

        err = http.error_response("Bad input", status_code=400, details={"field": "name"})
        assert err["statusCode"] == 400
        body = json.loads(err["body"])
        assert body["ok"] is False
        assert body["error"] == "Bad input"
        assert body["details"] == {"field": "name"}

    def test_parse_body_valid(self):
        event = {"body": json.dumps({"title": "Handmade Saree"})}
        parsed = http.parse_body(event)
        assert parsed == {"title": "Handmade Saree"}

        # Empty body
        assert http.parse_body({}) == {}
        assert http.parse_body({"body": ""}) == {}

        # Dict directly
        assert http.parse_body({"body": {"title": "Pottery"}}) == {"title": "Pottery"}

    def test_parse_body_base64(self):
        raw_json = json.dumps({"name": "Brass Bell"})
        b64 = base64.b64encode(raw_json.encode("utf-8")).decode("utf-8")
        event = {"body": b64, "isBase64Encoded": True}
        assert http.parse_body(event) == {"name": "Brass Bell"}

    def test_parse_body_invalid_json(self):
        with pytest.raises(ValidationError, match="Invalid JSON"):
            http.parse_body({"body": "{broken json"})

        with pytest.raises(ValidationError, match="Request JSON root must be an object"):
            http.parse_body({"body": json.dumps(["not", "an", "object"])})

    def test_validate_required(self):
        payload = {"title": "Clay Vase", "price": 450}
        http.validate_required(payload, ["title", "price"])

        with pytest.raises(ValidationError, match="Missing required field: 'category'"):
            http.validate_required(payload, ["title", "category"])

        with pytest.raises(ValidationError, match="cannot be empty"):
            http.validate_required({"title": "   "}, ["title"])

    def test_validate_string_length(self):
        payload = {"description": "Authentic handmade wool shawl"}
        http.validate_string_length(payload, "description", max_length=50, min_length=5)

        with pytest.raises(ValidationError, match="cannot exceed 10 characters"):
            http.validate_string_length(payload, "description", max_length=10)

        with pytest.raises(ValidationError, match="at least 50 characters"):
            http.validate_string_length(payload, "description", max_length=100, min_length=50)

    def test_validate_allowed_values(self):
        categories = ["textiles", "pottery", "jewelry", "woodwork"]
        payload = {"category": "textiles"}
        http.validate_allowed_values(payload, "category", categories)

        with pytest.raises(ValidationError, match="must be one of"):
            http.validate_allowed_values({"category": "electronics"}, "category", categories)

    def test_validate_payload_combined(self):
        data = {
            "title": "Kalamkari Painting",
            "category": "art",
            "notes": "Hand-painted organic dye",
        }
        http.validate_payload(
            data,
            required=["title", "category"],
            length_caps={"title": (3, 50), "notes": 100},
            allowed_values={"category": ["art", "textiles"]},
        )

        with pytest.raises(ValidationError):
            http.validate_payload(data, required=["missing_field"])

    def test_utils_backward_compatibility(self):
        resp = utils.success_response({"test": True})
        assert resp["statusCode"] == 200
        err = utils.error_response("Old error", status_code=404)
        assert err["statusCode"] == 404


# ==============================================================================
# LIMITS MODULE TESTS
# ==============================================================================
class TestLimitsModule:
    def test_get_user_id_success(self):
        event = {
            "requestContext": {
                "authorizer": {
                    "jwt": {
                        "claims": {
                            "sub": "user-uuid-12345",
                            "email": "artisan@example.com",
                        }
                    }
                }
            }
        }
        assert limits.get_user_id(event) == "user-uuid-12345"

    def test_get_user_id_unauthorized(self):
        with pytest.raises(ValueError, match="Unauthorized"):
            limits.get_user_id({})

        with pytest.raises(ValueError, match="Unauthorized"):
            limits.get_user_id({"requestContext": {}})

        with pytest.raises(ValueError, match="Unauthorized"):
            limits.get_user_id({"requestContext": {"authorizer": {"jwt": {"claims": {}}}}})

    def test_check_and_increment_usage_allowed(self):
        mock_resource = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_resource.Table.return_value = mock_table
        mock_table.update_item.return_value = {"Attributes": {"count": 1}}

        allowed, count = limits.check_and_increment_usage(
            user_id="artisan-1",
            table_name="TestUsageTable",
            date_str="2026-11-27",
            limit=20,
            dynamodb_resource=mock_resource,
        )

        assert allowed is True
        assert count == 1
        mock_table.update_item.assert_called_once()
        call_kwargs = mock_table.update_item.call_args[1]
        assert call_kwargs["Key"] == {"ownerId": "artisan-1", "date": "2026-11-27"}
        assert call_kwargs["ExpressionAttributeValues"][":limit"] == 20

    def test_check_and_increment_usage_exceeded(self):
        mock_resource = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_resource.Table.return_value = mock_table

        error_response = {
            "Error": {
                "Code": "ConditionalCheckFailedException",
                "Message": "The conditional request failed",
            }
        }
        mock_table.update_item.side_effect = ClientError(error_response, "UpdateItem")

        allowed, count = limits.check_and_increment_usage(
            user_id="artisan-1",
            table_name="TestUsageTable",
            limit=20,
            dynamodb_resource=mock_resource,
        )

        assert allowed is False
        assert count == 20

    def test_enforce_daily_limit_under_limit(self):
        mock_resource = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_resource.Table.return_value = mock_table
        mock_table.update_item.return_value = {"Attributes": {"count": 5}}

        res = limits.enforce_daily_limit(
            user_id="artisan-1",
            dynamodb_resource=mock_resource,
        )
        assert res is None

    def test_enforce_daily_limit_reached_returns_429(self):
        mock_resource = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_resource.Table.return_value = mock_table

        error_response = {"Error": {"Code": "ConditionalCheckFailedException"}}
        mock_table.update_item.side_effect = ClientError(error_response, "UpdateItem")

        res = limits.enforce_daily_limit(
            user_id="artisan-1",
            dynamodb_resource=mock_resource,
        )
        assert res is not None
        assert res["statusCode"] == 429
        body = json.loads(res["body"])
        assert body["ok"] is False
        assert "Daily AI limit reached" in body["error"]
        assert body["details"]["limit"] == 20

    def test_get_usage_count(self):
        mock_resource = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_resource.Table.return_value = mock_table
        mock_table.get_item.return_value = {"Item": {"count": 7}}

        count = limits.get_usage_count("artisan-1", dynamodb_resource=mock_resource)
        assert count == 7

        mock_table.get_item.return_value = {}
        assert limits.get_usage_count("artisan-1", dynamodb_resource=mock_resource) == 0


# ==============================================================================
# AI MODULE TESTS
# ==============================================================================
class TestAiModule:
    @pytest.fixture(autouse=True)
    def reset_ai_state(self):
        # Reset cached api key before each test
        ai._CACHED_GEMINI_KEY = None
        orig_provider = os.environ.get("AI_PROVIDER")
        yield
        ai._CACHED_GEMINI_KEY = None
        if orig_provider is not None:
            os.environ["AI_PROVIDER"] = orig_provider
        else:
            os.environ.pop("AI_PROVIDER", None)

    def test_get_gemini_api_key_ssm_caching(self):
        with mock.patch("boto3.client") as mock_boto:
            mock_ssm = mock.MagicMock()
            mock_boto.return_value = mock_ssm
            mock_ssm.get_parameter.return_value = {
                "Parameter": {"Value": "test-secret-gemini-key"}
            }

            # First call fetches from SSM
            key1 = ai.get_gemini_api_key()
            assert key1 == "test-secret-gemini-key"
            mock_ssm.get_parameter.assert_called_once_with(
                Name="/kalamitra/gemini-key", WithDecryption=True
            )

            # Second call uses in-memory cache
            key2 = ai.get_gemini_api_key()
            assert key2 == "test-secret-gemini-key"
            assert mock_ssm.get_parameter.call_count == 1

    def test_clean_and_parse_json_variants(self):
        # Plain JSON
        assert ai._clean_and_parse_json('{"name": "Saree"}') == {"name": "Saree"}

        # Markdown fenced ```json ... ```
        fenced_json = "```json\n{\n  \"name\": \"Chanderi Silk Saree\",\n  \"price\": 1800\n}\n```"
        assert ai._clean_and_parse_json(fenced_json) == {
            "name": "Chanderi Silk Saree",
            "price": 1800,
        }

        # Extra conversational preamble and trailer
        surrounded = "Here is the response:\n{\"title\": \"Terracotta Mug\"}\nHope this helps!"
        assert ai._clean_and_parse_json(surrounded) == {"title": "Terracotta Mug"}

        # Invalid string
        with pytest.raises(ValueError, match="Unable to parse valid JSON"):
            ai._clean_and_parse_json("Not a json at all")

    def test_generate_json_gemini_success(self):
        fake_api_response = {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": json.dumps({
                                    "title_en": "Handcrafted Clay Diya",
                                    "title_hi": "हस्तनिर्मित मिट्टी का दीया",
                                    "estimated_price": 150,
                                })
                            }
                        ]
                    }
                }
            ]
        }
        resp_bytes = json.dumps(fake_api_response).encode("utf-8")

        mock_http_resp = mock.MagicMock()
        mock_http_resp.read.return_value = resp_bytes
        mock_http_resp.__enter__.return_value = mock_http_resp

        with mock.patch.object(ai, "get_gemini_api_key", return_value="dummy-key"), \
             mock.patch("urllib.request.urlopen", return_value=mock_http_resp) as mock_urlopen:

            dummy_img = b"\xff\xd8\xff\xe0"  # Small dummy jpeg header bytes
            result = ai.generate_json(
                system_prompt="You are a craft catalog expert.",
                user_text="Describe this clay diya",
                image_bytes=dummy_img,
                image_mime="image/jpeg",
            )

            assert result["title_en"] == "Handcrafted Clay Diya"
            assert result["title_hi"] == "हस्तनिर्मित मिट्टी का दीया"
            assert result["estimated_price"] == 150

            mock_urlopen.assert_called_once()
            req_arg = mock_urlopen.call_args[0][0]
            assert "gemini-1.5-flash" in req_arg.full_url
            assert "key=dummy-key" in req_arg.full_url
            payload = json.loads(req_arg.data.decode("utf-8"))
            assert payload["generationConfig"]["responseMimeType"] == "application/json"
            assert payload["system_instruction"]["parts"][0]["text"] == "You are a craft catalog expert."

            # Verify image was base64 encoded into parts
            parts = payload["contents"][0]["parts"]
            image_part = next(p for p in parts if "inline_data" in p)
            assert image_part["inline_data"]["mime_type"] == "image/jpeg"
            assert image_part["inline_data"]["data"] == base64.b64encode(dummy_img).decode("utf-8")

    def test_generate_json_retry_on_429_then_succeed(self):
        fake_api_response = {
            "candidates": [{"content": {"parts": [{"text": '{"result": "success_after_429"}'}]}}]
        }
        success_resp = mock.MagicMock()
        success_resp.read.return_value = json.dumps(fake_api_response).encode("utf-8")
        success_resp.__enter__.return_value = success_resp

        http_429_error = urllib.error.HTTPError(
            url="https://generativelanguage.googleapis.com",
            code=429,
            msg="Too Many Requests",
            hdrs={},
            fp=io.BytesIO(b"Rate limit exceeded"),
        )

        with mock.patch.object(ai, "get_gemini_api_key", return_value="dummy-key"), \
             mock.patch("time.sleep") as mock_sleep, \
             mock.patch("urllib.request.urlopen", side_effect=[http_429_error, success_resp]) as mock_urlopen:

            res = ai.generate_json(system_prompt="", user_text="Hello")
            assert res == {"result": "success_after_429"}
            assert mock_urlopen.call_count == 2
            mock_sleep.assert_called_once()

    def test_generate_json_retry_on_invalid_json_then_succeed(self):
        bad_resp_payload = {
            "candidates": [{"content": {"parts": [{"text": 'Malformed response without json'}]}}]
        }
        good_resp_payload = {
            "candidates": [{"content": {"parts": [{"text": '{"fixed": true}'}]}}]
        }

        resp1 = mock.MagicMock()
        resp1.read.return_value = json.dumps(bad_resp_payload).encode("utf-8")
        resp1.__enter__.return_value = resp1

        resp2 = mock.MagicMock()
        resp2.read.return_value = json.dumps(good_resp_payload).encode("utf-8")
        resp2.__enter__.return_value = resp2

        with mock.patch.object(ai, "get_gemini_api_key", return_value="dummy-key"), \
             mock.patch("time.sleep"), \
             mock.patch("urllib.request.urlopen", side_effect=[resp1, resp2]):

            res = ai.generate_json(system_prompt="", user_text="Test prompt")
            assert res == {"fixed": True}

    def test_generate_json_exhausted_retries_raises_friendly_error(self):
        http_503_error = urllib.error.HTTPError(
            url="https://generativelanguage.googleapis.com",
            code=503,
            msg="Service Unavailable",
            hdrs={},
            fp=io.BytesIO(b"Backend unavailable"),
        )

        with mock.patch.object(ai, "get_gemini_api_key", return_value="dummy-key"), \
             mock.patch("time.sleep"), \
             mock.patch("urllib.request.urlopen", side_effect=http_503_error):

            with pytest.raises(AIError, match="AI service is currently busy or experiencing issues"):
                ai.generate_json(system_prompt="", user_text="Test prompt")

    def test_bedrock_provider_not_implemented(self):
        os.environ["AI_PROVIDER"] = "bedrock"
        with pytest.raises(NotImplementedError, match="AWS Bedrock is not enabled or usable"):
            ai.generate_json(system_prompt="", user_text="Test")

    def test_unsupported_provider_raises(self):
        os.environ["AI_PROVIDER"] = "invalid_llm"
        with pytest.raises(AIError, match="Unsupported AI provider: 'invalid_llm'"):
            ai.generate_json(system_prompt="", user_text="Test")
