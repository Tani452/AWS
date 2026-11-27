#!/usr/bin/env python3
"""Seeds 8 realistic Bharat handicraft sample products into DynamoDB and S3 for demo shops.

Uploads craft images from docs/sample-images/ to the S3 media bucket,
and inserts rich bilingual (English + Hindi) product records into the Products table.

Usage:
    python backend/seed_demo_products.py [--shop-id demo-artisan] [--region ap-southeast-2]
"""
import argparse
import glob
import os
import sys
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from botocore.exceptions import ClientError

REGION_DEFAULT = "ap-southeast-2"
STACK_DEFAULT = "kalamitra"
DEFAULT_SHOP_ID = "demo-artisan"

DEMO_PRODUCTS = [
    {
        "productId": "craft-patola-01",
        "title_en": "Handcrafted Patan Patola Double Ikat Silk Saree",
        "title_hi": "हस्तनिर्मित पाटन पाटोला डबल इकत सिल्क साड़ी",
        "description_en": "Woven with pure natural mulberry silk and geometric double ikat heritage patterns. Takes over 25 days of dedicated master artisan handloom weaving.",
        "description_hi": "शुद्ध रेशम और प्राकृतिक वनस्पति रंगों से बनी पारंपरिक पाटोला साड़ी, 25 दिनों की सूक्ष्म हथकरघा बुनाई से तैयार।",
        "category": "textiles",
        "price": Decimal("6500"),
        "materials": ["Pure Mulberry Silk", "Natural Plant Dyes", "Zari Thread"],
        "technique": "Double Ikat Handloom Weaving",
        "craft_tradition": "Patan Heritage, Gujarat",
        "care_instructions_en": "Dry clean only. Store wrapped in pure unbleached muslin cloth.",
        "tags": ["saree", "patola", "handloom", "silk", "ikat", "gujaratcraft", "madeinbharat"],
        "image_file": "sample_01_textiles.jpg",
    },
    {
        "productId": "craft-pottery-02",
        "title_en": "Kutch Traditional Terracotta Clay Water Matka",
        "title_hi": "कच्छ पारंपरिक मिट्टी का शीतल मटका",
        "description_en": "Wheel-thrown porous clay pot from organic riverbed silt. Naturally cools drinking water during warm summer seasons through micro-evaporation.",
        "description_hi": "नदी की उपजाऊ मिट्टी से कुम्हार के चाक पर बना पारंपरिक मटका, पानी को प्राकृतिक रूप से शीतल और सुवासित रखता है।",
        "category": "pottery",
        "price": Decimal("450"),
        "materials": ["Riverbed Terracotta Clay", "Natural White Clay Engobe"],
        "technique": "Wheel-Thrown Pottery & Hand Carving",
        "craft_tradition": "Bhuj & Kutch, Gujarat",
        "care_instructions_en": "Rinse thoroughly with clean water before first use. Do not use synthetic soap.",
        "tags": ["terracotta", "pottery", "claymatka", "handmade", "ecofriendly", "cooling"],
        "image_file": "sample_02_pottery.jpg",
    },
    {
        "productId": "craft-wood-03",
        "title_en": "Channapatna Wooden Rocking Toy Horse",
        "title_hi": "चन्नापट्टना हस्तनिर्मित लकड़ी का खिलौना घोड़ा",
        "description_en": "Artisanal wooden horse turned on traditional lathes and finished with non-toxic, child-safe vegetable lac colors from Wrightia tinctoria ivory wood.",
        "description_hi": "दूधी की लकड़ी पर कुदरती लाख और वनस्पति रंगों से तराशा गया सुरक्षित, पारंपरिक व मनमोहक खिलौना।",
        "category": "woodwork",
        "price": Decimal("780"),
        "materials": ["Ivory Wood (Aale Mara)", "Vegetable Dye Lacquer"],
        "technique": "Lathe Turning & Lac Polish",
        "craft_tradition": "Channapatna GI Craft, Karnataka",
        "care_instructions_en": "Wipe with a soft dry cloth. Keep away from water immersion.",
        "tags": ["channapatna", "woodentoy", "ecofriendly", "kids", "safe", "graftcraft"],
        "image_file": "sample_03_woodwork.jpg",
    },
    {
        "productId": "craft-metal-04",
        "title_en": "Bastar Dhokra Lost-Wax Tribal Brass Oil Lamp",
        "title_hi": "बस्तर ढोकरा पारंपरिक पीतल का आदिवासी दीया",
        "description_en": "Handcrafted tribal brass oil lamp cast using the 4000-year-old lost-wax bell metal casting technique by indigenous Bastar artisans.",
        "description_hi": "4000 वर्ष पुरानी ढोकरा मोम-ढलाई कला से हाथ से ढाला गया शुद्ध पीतल का पारंपरिक आदिवासी दीया।",
        "category": "metalcraft",
        "price": Decimal("1850"),
        "materials": ["Solid Brass Alloy", "Beeswax", "River Clay Core"],
        "technique": "Lost-Wax Bell Metal Casting (Dhokra)",
        "craft_tradition": "Bastar Tribal Craft, Chhattisgarh",
        "care_instructions_en": "Clean gently with lemon and salt or brass polish to retain warm antique sheen.",
        "tags": ["dhokra", "brass", "tribalart", "diya", "bellmetal", "heritage"],
        "image_file": "sample_04_metalcraft.jpg",
    },
    {
        "productId": "craft-jewelry-05",
        "title_en": "Jaipur Kundan Meenakari Floral Drop Earrings",
        "title_hi": "जयपुर कुंदन मीनाकारी मोरपंखी झुमके",
        "description_en": "Hand-set glass Kundan stones encased in gold-plated silver alloy, featuring reverse-side vibrant hand-painted floral Meenakari enameling.",
        "description_hi": "पारंपरिक जड़ाऊ कुंदन और पिछले हिस्से पर हस्तनिर्मित मोरपंखी मीनाकारी से सजे उत्सव के आभूषण।",
        "category": "jewelry",
        "price": Decimal("2400"),
        "materials": ["Silver Alloy", "Glass Kundan Gems", "Enamel Meena", "Freshwater Pearl"],
        "technique": "Jadau Setting & Meenakari Enameling",
        "craft_tradition": "Jaipur Royal Heritage, Rajasthan",
        "care_instructions_en": "Avoid direct contact with perfumes and moisture. Store in cotton-lined box.",
        "tags": ["jewelry", "kundan", "meenakari", "earrings", "jaipur", "weddingwear"],
        "image_file": "sample_05_jewelry.jpg",
    },
    {
        "productId": "craft-painting-06",
        "title_en": "Madhubani Kohbar Tree of Life Handpainted Canvas",
        "title_hi": "मधुबनी कोहबर जीवन-वृक्ष हस्तनिर्मित चित्रकला",
        "description_en": "Intricate sacred Mithila painting rendered with bamboo twigs and nibs on handmade cotton canvas using organic mineral and plant pigments.",
        "description_hi": "बांस की तीलियों और प्राकृतिक रंगों से हाथ से बनाई गई पारंपरिक मिथिला कोहबर एवं जीवन-वृक्ष चित्रकला।",
        "category": "paintings",
        "price": Decimal("3200"),
        "materials": ["Organic Cotton Canvas", "Natural Indigo & Ochre Pigments"],
        "technique": "Fine Nib Freehand Line Drawing",
        "craft_tradition": "Mithila Folk Painting, Bihar",
        "care_instructions_en": "Frame behind anti-reflective UV glass. Keep away from humid walls.",
        "tags": ["madhubani", "mithilapainting", "folkart", "canvas", "treeoflife", "biharcraft"],
        "image_file": "sample_06_paintings.jpg",
    },
    {
        "productId": "craft-leather-07",
        "title_en": "Authentic Hand-Tooled Kolhapuri Leather Sandals",
        "title_hi": "कोल्हापुरी हस्तनिर्मित शुद्ध चमड़े की चप्पल",
        "description_en": "Hand-cut, vegetable-tanned natural buffalo leather sandals with braided leather cords and punch-work detailing. Mold to foot shape over time.",
        "description_hi": "प्राकृतिक वनस्पति रंगों से पके चमड़े और हाथ की सिलाई से बनी पारंपरिक कोल्हापुरी चप्पल।",
        "category": "leathercraft",
        "price": Decimal("1450"),
        "materials": ["Vegetable-Tanned Buffalo Leather", "Braided Leather Twine"],
        "technique": "Hand-Tooling & Stitching",
        "craft_tradition": "Kolhapur GI Craft, Maharashtra",
        "care_instructions_en": "Polish with neutral leather cream. Keep dry; if wet, dry slowly in shade.",
        "tags": ["kolhapuri", "leather", "sandals", "traditionalfootwear", "graftcraft"],
        "image_file": "sample_07_leathercraft.jpg",
    },
    {
        "productId": "craft-bamboo-08",
        "title_en": "Assam Golden Cane & Bamboo Handwoven Storage Hamper",
        "title_hi": "असम स्वर्णिम बांस व बेंत की हाथ से बुनी टोकरी",
        "description_en": "Eco-friendly versatile storage hamper woven from sustainable native Bhaluka bamboo and wild river cane, featuring interlocking twill weave.",
        "description_hi": "असम के टिकाऊ भालुका बांस और प्राकृतिक बेंत से हाथ द्वारा गुंथी गई सुंदर, मजबूत व पर्यावरण-अनुकूल टोकरी।",
        "category": "bamboo_craft",
        "price": Decimal("920"),
        "materials": ["Native Bhaluka Bamboo", "Wild River Cane (Calamus)"],
        "technique": "Splitting, Planing & Twill Weaving",
        "craft_tradition": "Brahmaputra Valley, Assam",
        "care_instructions_en": "Wipe with slightly damp cloth. Ensure adequate air ventilation.",
        "tags": ["bamboo", "cane", "storagebasket", "sustainable", "assamcraft", "ecofriendly"],
        "image_file": "sample_08_bamboo.jpg",
    },
]


def resolve_resources(stack_name: str, region: str):
    """Discovers ProductsTable and MediaBucket from CloudFormation stack."""
    cfn = boto3.client("cloudformation", region_name=region)
    try:
        resp = cfn.describe_stack_resources(StackName=stack_name)
    except ClientError as e:
        print(f"Error describing stack {stack_name}: {e}")
        sys.exit(1)

    table_name = None
    bucket_name = None

    for res in resp.get("StackResources", []):
        rtype = res.get("ResourceType")
        if rtype == "AWS::DynamoDB::Table" and "ProductsTable" in res.get("LogicalResourceId", ""):
            table_name = res.get("PhysicalResourceId")
        elif rtype == "AWS::S3::Bucket" and "MediaBucket" in res.get("LogicalResourceId", ""):
            bucket_name = res.get("PhysicalResourceId")

    if not table_name or not bucket_name:
        print(f"Could not find ProductsTable ({table_name}) or MediaBucket ({bucket_name}) in stack {stack_name}.")
        sys.exit(1)

    return table_name, bucket_name


def find_image_data(image_file: str, sample_dir: str) -> tuple[bytes, str]:
    """Finds image in sample_dir, matching exact or partial filename."""
    candidate_path = os.path.join(sample_dir, image_file)
    if os.path.exists(candidate_path):
        with open(candidate_path, "rb") as f:
            return f.read(), "image/jpeg"

    # Search for any image file in directory
    all_images = glob.glob(os.path.join(sample_dir, "*.jpg")) + glob.glob(os.path.join(sample_dir, "*.png"))
    for p in all_images:
        basename = os.path.basename(p).lower()
        if any(token in basename for token in image_file.lower().split("_")):
            with open(p, "rb") as f:
                mime = "image/png" if p.lower().endswith(".png") else "image/jpeg"
                return f.read(), mime

    if all_images:
        with open(all_images[0], "rb") as f:
            mime = "image/png" if all_images[0].lower().endswith(".png") else "image/jpeg"
            return f.read(), mime

    raise FileNotFoundError(f"No sample images found in {sample_dir}")


def seed_products(shop_ids: list[str], stack_name: str, region: str, sample_dir: str):
    print(f"Connecting to AWS in region {region}...")
    table_name, bucket_name = resolve_resources(stack_name, region)
    print(f"Target Products Table: {table_name}")
    print(f"Target Media Bucket:   {bucket_name}")

    s3 = boto3.client("s3", region_name=region)
    dynamodb = boto3.resource("dynamodb", region_name=region)
    table = dynamodb.Table(table_name)

    now_iso = datetime.now(timezone.utc).isoformat()

    for shop_id in shop_ids:
        print(f"\n--- Seeding 8 products for shopId: '{shop_id}' ---")
        for prod in DEMO_PRODUCTS:
            prod_id = prod["productId"]
            s3_key = f"media/{shop_id}/{prod_id}.jpg"

            # 1. Upload sample image to S3
            try:
                img_data, mime = find_image_data(prod["image_file"], sample_dir)
                s3.put_object(
                    Bucket=bucket_name,
                    Key=s3_key,
                    Body=img_data,
                    ContentType=mime,
                )
                print(f"  [S3] Uploaded {s3_key} ({len(img_data)} bytes)")
            except Exception as e:
                print(f"  [S3 Warning] Failed to upload image for {prod_id}: {e}")

            # 2. Put item into DynamoDB
            item = {
                "ownerId": shop_id,
                "productId": prod_id,
                "shopId": shop_id,
                "title_en": prod["title_en"],
                "title_hi": prod["title_hi"],
                "description_en": prod["description_en"],
                "description_hi": prod["description_hi"],
                "category": prod["category"],
                "price": prod["price"],
                "materials": prod["materials"],
                "technique": prod["technique"],
                "craft_tradition": prod["craft_tradition"],
                "care_instructions_en": prod["care_instructions_en"],
                "tags": prod["tags"],
                "imageKey": s3_key,
                "createdAt": now_iso,
                "updatedAt": now_iso,
            }

            table.put_item(Item=item)
            print(f"  [DB] Saved '{prod['title_en']}' (₹{prod['price']})")

        print(f"✓ Successfully seeded shop '{shop_id}'!")
        print(f"  Public Storefront URL: https://staging.d7fvd9ozmbri0.amplifyapp.com/#/shop/{shop_id}")


def main():
    parser = argparse.ArgumentParser(description="Seed demo products into KalaMitra")
    parser.add_argument("--shop-id", nargs="+", default=[DEFAULT_SHOP_ID, "artisan-1"], help="One or more shop IDs to seed")
    parser.add_argument("--stack", default=STACK_DEFAULT, help="CloudFormation stack name")
    parser.add_argument("--region", default=REGION_DEFAULT, help="AWS region")
    parser.add_argument("--sample-dir", default="docs/sample-images", help="Path to sample images")
    args = parser.parse_args()

    seed_products(args.shop_id, args.stack, args.region, args.sample_dir)


if __name__ == "__main__":
    main()
