"""Unit tests for all 8 KalaMitra Lambda handlers with mocked AWS services and AI."""
import csv
import io
import json
import os
import sys
from decimal import Decimal
from unittest import mock
import pytest
from botocore.exceptions import ClientError

# Ensure backend/src is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from upload_url import app as upload_url_app
from enhance import app as enhance_app
from catalog import app as catalog_app
from price import app as price_app
from products import app as products_app
from shop import app as shop_app
from enquiry import app as enquiry_app
from export import app as export_app
from stats import app as stats_app


def _make_auth_event(sub="artisan-sub-1234", body=None, method="GET", path_params=None, query_params=None):
    """Helper to construct standard API Gateway HTTP API v2 events."""
    event = {
        "requestContext": {
            "http": {"method": method},
            "authorizer": {
                "jwt": {
                    "claims": {
                        "sub": sub,
                        "email": "artisan@example.com",
                    }
                }
            },
        },
        "pathParameters": path_params or {},
        "queryStringParameters": query_params or {},
    }
    if body is not None:
        event["body"] = json.dumps(body) if isinstance(body, (dict, list)) else str(body)
    return event


# ==============================================================================
# 1. UploadUrlFunction Tests
# ==============================================================================
class TestUploadUrlFunction:
    @mock.patch("boto3.client")
    def test_upload_url_jpeg_success(self, mock_boto):
        mock_s3 = mock.MagicMock()
        mock_boto.return_value = mock_s3
        mock_s3.generate_presigned_url.return_value = "https://s3.ap-southeast-2.amazonaws.com/presigned-put"

        event = _make_auth_event(body={"contentType": "image/jpeg"}, method="POST")
        resp = upload_url_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["uploadUrl"] == "https://s3.ap-southeast-2.amazonaws.com/presigned-put"
        assert body["key"].startswith("tmp/artisan-sub-1234/")
        assert body["key"].endswith(".jpg")
        assert body["expiresIn"] == 300

    @mock.patch("boto3.client")
    def test_upload_url_png_success(self, mock_boto):
        mock_s3 = mock.MagicMock()
        mock_boto.return_value = mock_s3
        mock_s3.generate_presigned_url.return_value = "https://s3.ap-southeast-2.amazonaws.com/presigned-png"

        event = _make_auth_event(body={"contentType": "image/png"}, method="POST")
        resp = upload_url_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["key"].endswith(".png")

    def test_upload_url_invalid_content_type(self):
        event = _make_auth_event(body={"contentType": "application/pdf"}, method="POST")
        resp = upload_url_app.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        body = json.loads(resp["body"])
        assert body["ok"] is False
        assert "must be one of" in body["error"]

    def test_upload_url_unauthorized(self):
        event = {"body": json.dumps({"contentType": "image/jpeg"})}
        resp = upload_url_app.lambda_handler(event, None)
        assert resp["statusCode"] == 401


# ==============================================================================
# 2. EnhanceFunction Tests
# ==============================================================================
class TestEnhanceFunction:
    @mock.patch("enhance.app.enforce_daily_limit", return_value=None)
    @mock.patch("boto3.client")
    def test_enhance_success(self, mock_boto, mock_limit):
        mock_s3 = mock.MagicMock()
        mock_rekog = mock.MagicMock()

        def client_side_effect(service, **kwargs):
            if service == "s3":
                return mock_s3
            elif service == "rekognition":
                return mock_rekog
            return mock.MagicMock()

        mock_boto.side_effect = client_side_effect

        dummy_image_data = b"fake-jpeg-image-bytes"
        mock_s3.get_object.return_value = {
            "ContentLength": len(dummy_image_data),
            "Body": io.BytesIO(dummy_image_data),
        }

        mock_rekog.detect_labels.return_value = {
            "Labels": [
                {"Name": "Textile", "Confidence": 98.5},
                {"Name": "Saree", "Confidence": 95.2},
            ],
            "ImageProperties": {
                "Quality": {
                    "Brightness": 55.4,
                    "Sharpness": 70.1,
                    "Contrast": 62.0,
                }
            },
        }

        event = _make_auth_event(
            sub="user-123",
            body={"key": "tmp/user-123/sample.jpg"},
            method="POST",
        )
        resp = enhance_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["guessedCategory"] == "textiles"
        assert body["qualityScores"]["brightness"] == 55.4
        assert len(body["detectedLabels"]) == 2
        assert len(body["tips"]) >= 1

    @mock.patch("enhance.app.enforce_daily_limit", return_value=None)
    def test_enhance_unauthorized_key_path(self, mock_limit):
        # Trying to access someone else's tmp file
        event = _make_auth_event(
            sub="user-123",
            body={"key": "tmp/another-user/craft.jpg"},
            method="POST",
        )
        resp = enhance_app.lambda_handler(event, None)
        assert resp["statusCode"] == 403

    @mock.patch("enhance.app.enforce_daily_limit", return_value=None)
    @mock.patch("boto3.client")
    def test_enhance_reject_over_5mb(self, mock_boto, mock_limit):
        mock_s3 = mock.MagicMock()
        mock_boto.return_value = mock_s3
        mock_s3.get_object.return_value = {
            "ContentLength": 6 * 1024 * 1024,  # 6MB
            "Body": io.BytesIO(b""),
        }

        event = _make_auth_event(
            sub="user-123",
            body={"key": "tmp/user-123/huge.jpg"},
            method="POST",
        )
        resp = enhance_app.lambda_handler(event, None)
        assert resp["statusCode"] == 400
        assert "5MB" in json.loads(resp["body"])["error"]

    @mock.patch("enhance.app.enforce_daily_limit")
    def test_enhance_daily_limit_exceeded(self, mock_limit):
        mock_limit.return_value = {
            "statusCode": 429,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"ok": False, "error": "Daily AI limit reached"}),
        }
        event = _make_auth_event(
            sub="user-123",
            body={"key": "tmp/user-123/photo.jpg"},
            method="POST",
        )
        resp = enhance_app.lambda_handler(event, None)
        assert resp["statusCode"] == 429


# ==============================================================================
# 3. CatalogFunction Tests
# ==============================================================================
class TestCatalogFunction:
    @mock.patch("catalog.app.enforce_daily_limit", return_value=None)
    @mock.patch("catalog.app.generate_json")
    def test_catalog_generation_success(self, mock_ai, mock_limit):
        mock_ai.return_value = {
            "title_en": "Handmade Clay Water Pot",
            "title_hi": "हस्तनिर्मित मिट्टी का मटका",
            "description_en": "Crafted from natural riverbed clay, this porous water pot naturally cools water through evaporation. Perfect for summer days and traditional households.",
            "description_hi": "प्राकृतिक नदी की मिट्टी से तैयार यह मटका पानी को प्राकृतिक रूप से ठंडा रखता है।",
            "category": "pottery",
            "materials": ["Riverbed terracotta clay"],
            "technique": "Potter's wheel thrown",
            "craft_tradition": "Rajasthan Pottery",
            "care_instructions_en": "Wash with water, avoid harsh detergents.",
            "tags": ["terracotta", "pottery", "handcrafted"],
            "seo_keywords": ["clay water pot", "terracotta matka"],
            "detected_language": "hi-IN",
        }

        event = _make_auth_event(
            sub="user-123",
            body={
                "transcript": "Yeh mitti ka matka hai jo garmi me paani thanda rakhta hai",
                "language": "hi-IN",
                "category": "pottery",
            },
            method="POST",
        )
        resp = catalog_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["title_en"] == "Handmade Clay Water Pot"
        assert body["category"] == "pottery"
        mock_ai.assert_called_once()

    @mock.patch("catalog.app.enforce_daily_limit", return_value=None)
    def test_catalog_missing_transcript(self, mock_limit):
        event = _make_auth_event(sub="user-123", body={}, method="POST")
        resp = catalog_app.lambda_handler(event, None)
        assert resp["statusCode"] == 400


# ==============================================================================
# 4. PriceFunction Tests
# ==============================================================================
class TestPriceFunction:
    @mock.patch("price.app.enforce_daily_limit", return_value=None)
    @mock.patch("price.app.generate_json")
    @mock.patch("boto3.resource")
    def test_price_calculation_and_floor_enforcement(self, mock_boto_res, mock_ai, mock_limit):
        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo
        mock_table = mock.MagicMock()
        mock_dynamo.Table.return_value = mock_table
        mock_table.get_item.return_value = {
            "Item": {
                "category": "pottery",
                "min_inr": Decimal("150"),
                "typical_inr": Decimal("450"),
                "max_inr": Decimal("1800"),
            }
        }

        # Model returns suggested below cost floor to test code enforcement
        # Cost floor = 100 material + (2 hours * 100/hr) = 300 INR
        mock_ai.return_value = {
            "min_price": 200,
            "suggested_price": 250,  # Below cost floor of 300!
            "max_price": 500,
            "reasoning_en": "Artisan pottery estimation",
            "reasoning_hi": "उचित मूल्य विवरण",
            "tips": ["Offer in sets of two."],
        }

        event = _make_auth_event(
            sub="user-123",
            body={
                "category": "pottery",
                "materialCostInr": 100,
                "hoursOfWork": 2,
                "quantity": 1,
            },
            method="POST",
        )
        resp = price_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["costFloor"] == 300.0
        # Code enforcement ensures suggested_price >= costFloor
        assert body["suggested_price"] >= 300.0
        assert body["min_price"] <= body["suggested_price"] <= body["max_price"]
        assert body["breakdown"]["material"] == 100.0
        assert body["breakdown"]["labour"] == 200.0
        assert "indicative estimates" in body["disclaimer"]


# ==============================================================================
# 5. ProductsFunction Tests
# ==============================================================================
class TestProductsFunction:
    @mock.patch("products.app._get_s3_and_table")
    def test_get_products(self, mock_helper):
        mock_s3 = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_helper.return_value = (mock_s3, "test-bucket", mock_table)

        mock_table.query.return_value = {
            "Items": [
                {
                    "ownerId": "artisan-123",
                    "productId": "p1",
                    "title_en": "Silk Dupatta",
                    "price": Decimal("850"),
                    "imageKey": "media/artisan-123/p1.jpg",
                }
            ]
        }
        mock_s3.generate_presigned_url.return_value = "https://s3/media/artisan-123/p1.jpg?signed"

        event = _make_auth_event(sub="artisan-123", method="GET")
        resp = products_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["count"] == 1
        assert body["products"][0]["imageUrl"] == "https://s3/media/artisan-123/p1.jpg?signed"

    @mock.patch("products.app._get_s3_and_table")
    def test_post_product_copies_tmp_image(self, mock_helper):
        mock_s3 = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_helper.return_value = (mock_s3, "test-bucket", mock_table)
        mock_s3.generate_presigned_url.return_value = "https://s3/signed-new-img"

        event = _make_auth_event(
            sub="artisan-123",
            body={
                "title_en": "Brass Bell",
                "price": 450,
                "imageKey": "tmp/artisan-123/temp-img-uuid.jpg",
            },
            method="POST",
        )
        resp = products_app.lambda_handler(event, None)

        assert resp["statusCode"] == 201
        body = json.loads(resp["body"])
        assert body["product"]["title_en"] == "Brass Bell"
        assert body["product"]["shopId"] == "artisan-123"
        assert body["product"]["imageKey"].startswith("media/artisan-123/")

        # Verify S3 copy and delete tmp were called
        mock_s3.copy_object.assert_called_once()
        mock_s3.delete_object.assert_called_once_with(
            Bucket="test-bucket", Key="tmp/artisan-123/temp-img-uuid.jpg"
        )
        mock_table.put_item.assert_called_once()

    @mock.patch("products.app._get_s3_and_table")
    def test_delete_product(self, mock_helper):
        mock_s3 = mock.MagicMock()
        mock_table = mock.MagicMock()
        mock_helper.return_value = (mock_s3, "test-bucket", mock_table)

        mock_table.get_item.return_value = {
            "Item": {
                "ownerId": "artisan-123",
                "productId": "prod-to-delete",
                "imageKey": "media/artisan-123/prod-to-delete.jpg",
            }
        }

        event = _make_auth_event(
            sub="artisan-123",
            method="DELETE",
            query_params={"productId": "prod-to-delete"},
        )
        resp = products_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["ok"] is True
        mock_table.delete_item.assert_called_once_with(
            Key={"ownerId": "artisan-123", "productId": "prod-to-delete"}
        )
        mock_s3.delete_object.assert_called_once_with(
            Bucket="test-bucket", Key="media/artisan-123/prod-to-delete.jpg"
        )


# ==============================================================================
# 6. ShopFunction and EnquiryFunction Tests
# ==============================================================================
class TestShopAndEnquiryFunctions:
    @mock.patch("boto3.resource")
    @mock.patch("boto3.client")
    def test_public_shop_listing(self, mock_boto_client, mock_boto_res):
        mock_s3 = mock.MagicMock()
        mock_boto_client.return_value = mock_s3
        mock_s3.generate_presigned_url.return_value = "https://s3/shop-img?signed"

        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo
        mock_table = mock.MagicMock()
        mock_dynamo.Table.return_value = mock_table
        mock_table.query.return_value = {
            "Items": [
                {
                    "ownerId": "artisan-shop-999",
                    "productId": "p-1",
                    "title_en": "Madhubani Canvas",
                    "title_hi": "मधुबनी पेंटिंग",
                    "price": Decimal("1200"),
                    "imageKey": "media/artisan-shop-999/p-1.jpg",
                    "secret_internal_data": "must-not-leak",
                }
            ]
        }

        # Public call without auth token
        event = {"pathParameters": {"shopId": "artisan-shop-999"}}
        resp = shop_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["shopId"] == "artisan-shop-999"
        assert len(body["products"]) == 1
        product = body["products"][0]
        assert product["title_en"] == "Madhubani Canvas"
        assert "secret_internal_data" not in product  # public-safe check
        assert product["imageUrl"] == "https://s3/shop-img?signed"

    @mock.patch("boto3.resource")
    def test_public_enquiry_submission(self, mock_boto_res):
        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo
        mock_table = mock.MagicMock()
        mock_dynamo.Table.return_value = mock_table

        event = {
            "body": json.dumps({
                "shopId": "artisan-shop-999",
                "productId": "p-1",
                "buyerName": "Ramesh Kumar",
                "buyerContact": "+91 9876543210",
                "message": "Interested in bulk order of 20 pieces",
                "quantity": 20,
            })
        }
        resp = enquiry_app.lambda_handler(event, None)

        assert resp["statusCode"] == 201
        body = json.loads(resp["body"])
        assert body["ok"] is True
        mock_table.put_item.assert_called_once()

    @mock.patch("boto3.resource")
    def test_enquiry_honeypot_silently_discards(self, mock_boto_res):
        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo
        mock_table = mock.MagicMock()
        mock_dynamo.Table.return_value = mock_table

        # Spam bot fills out the hidden honeypot field
        event = {
            "body": json.dumps({
                "shopId": "artisan-shop-999",
                "buyerName": "Bot Name",
                "buyerContact": "bot@spam.com",
                "message": "Spam payload",
                "website": "http://spam-link.ru",  # Honeypot filled!
            })
        }
        resp = enquiry_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["ok"] is True
        # Must NOT write to DynamoDB
        mock_table.put_item.assert_not_called()


# ==============================================================================
# 7. ExportFunction Tests
# ==============================================================================
class TestExportFunction:
    @mock.patch("boto3.resource")
    @mock.patch("boto3.client")
    def test_export_csv_generation(self, mock_boto_client, mock_boto_res):
        mock_s3 = mock.MagicMock()
        mock_boto_client.return_value = mock_s3
        mock_s3.generate_presigned_url.return_value = "https://s3/export-img.jpg"

        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo
        mock_table = mock.MagicMock()
        mock_dynamo.Table.return_value = mock_table

        mock_table.query.return_value = {
            "Items": [
                {
                    "productId": "sku-101",
                    "title_en": "Wooden Toy Elephant",
                    "title_hi": "लकड़ी का खिलौना हाथी",
                    "description_en": "Carved neem wood toy",
                    "description_hi": "नीम की लकड़ी से बना हाथी",
                    "category": "woodwork",
                    "price": Decimal("350"),
                    "materials": ["Neem wood", "Natural lacquer"],
                    "imageKey": "media/artisan-1/sku-101.jpg",
                }
            ]
        }

        event = _make_auth_event(sub="artisan-1", method="GET")
        resp = export_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        assert "text/csv" in resp["headers"]["Content-Type"]
        assert "attachment; filename=" in resp["headers"]["Content-Disposition"]

        # Parse CSV body
        csv_reader = list(csv.reader(io.StringIO(resp["body"])))
        assert len(csv_reader) == 2  # Header + 1 row
        headers = csv_reader[0]
        assert headers == [
            "sku",
            "title_en",
            "title_hi",
            "description_en",
            "description_hi",
            "category",
            "price_inr",
            "materials",
            "image_url",
        ]
        row = csv_reader[1]
        assert row[0] == "sku-101"
        assert row[1] == "Wooden Toy Elephant"
        assert row[6] == "350"
        assert "Neem wood" in row[7]
        assert row[8] == "https://s3/export-img.jpg"


# ==============================================================================
# 8. StatsFunction Tests
# ==============================================================================
class TestStatsFunction:
    @mock.patch("boto3.resource")
    def test_stats_aggregation_and_time_saved(self, mock_boto_res):
        mock_dynamo = mock.MagicMock()
        mock_boto_res.return_value = mock_dynamo

        mock_prod_table = mock.MagicMock()
        mock_enq_table = mock.MagicMock()

        def table_side_effect(name):
            if "products" in name.lower():
                return mock_prod_table
            return mock_enq_table

        mock_dynamo.Table.side_effect = table_side_effect

        mock_prod_table.query.return_value = {"Count": 6}
        mock_enq_table.query.return_value = {"Count": 14}

        event = _make_auth_event(sub="artisan-stats-user", method="GET")
        resp = stats_app.lambda_handler(event, None)

        assert resp["statusCode"] == 200
        body = json.loads(resp["body"])
        assert body["productsCount"] == 6
        assert body["enquiriesCount"] == 14
        # 6 products * 15 min saved = 90 min saved
        assert body["estimatedMinutesSaved"] == 90
        assert body["isEstimate"] is True
