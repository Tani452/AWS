"""Seed reference prices for Indian artisan craft categories into DynamoDB."""
import os
import sys
import argparse
from decimal import Decimal
import boto3

AWS_REGION = "ap-southeast-2"

REFERENCE_DATA = [
    {
        "category": "cotton saree",
        "min_inr": Decimal("600"),
        "typical_inr": Decimal("1500"),
        "max_inr": Decimal("4500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "silk saree",
        "min_inr": Decimal("2500"),
        "typical_inr": Decimal("6500"),
        "max_inr": Decimal("25000"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "handloom stole",
        "min_inr": Decimal("350"),
        "typical_inr": Decimal("850"),
        "max_inr": Decimal("2200"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "bandhani dupatta",
        "min_inr": Decimal("400"),
        "typical_inr": Decimal("1100"),
        "max_inr": Decimal("3500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "block-print fabric",
        "min_inr": Decimal("150"),
        "typical_inr": Decimal("350"),
        "max_inr": Decimal("900"),
        "unit": "meter",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "patola",
        "min_inr": Decimal("3500"),
        "typical_inr": Decimal("12000"),
        "max_inr": Decimal("65000"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "Kutch embroidery",
        "min_inr": Decimal("500"),
        "typical_inr": Decimal("1800"),
        "max_inr": Decimal("6000"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "wooden toy",
        "min_inr": Decimal("150"),
        "typical_inr": Decimal("450"),
        "max_inr": Decimal("1500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "terracotta pot",
        "min_inr": Decimal("100"),
        "typical_inr": Decimal("350"),
        "max_inr": Decimal("1200"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "bamboo basket",
        "min_inr": Decimal("120"),
        "typical_inr": Decimal("300"),
        "max_inr": Decimal("950"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "brass lamp",
        "min_inr": Decimal("450"),
        "typical_inr": Decimal("1200"),
        "max_inr": Decimal("4500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "jute bag",
        "min_inr": Decimal("120"),
        "typical_inr": Decimal("350"),
        "max_inr": Decimal("950"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "pottery",
        "min_inr": Decimal("150"),
        "typical_inr": Decimal("450"),
        "max_inr": Decimal("1800"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "leather juti",
        "min_inr": Decimal("400"),
        "typical_inr": Decimal("950"),
        "max_inr": Decimal("2400"),
        "unit": "pair",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "silver/oxidised jewellery",
        "min_inr": Decimal("250"),
        "typical_inr": Decimal("850"),
        "max_inr": Decimal("3200"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "Madhubani painting",
        "min_inr": Decimal("600"),
        "typical_inr": Decimal("2200"),
        "max_inr": Decimal("8500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "Warli painting",
        "min_inr": Decimal("500"),
        "typical_inr": Decimal("1800"),
        "max_inr": Decimal("7000"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "durrie/carpet",
        "min_inr": Decimal("900"),
        "typical_inr": Decimal("2800"),
        "max_inr": Decimal("11000"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "shawl",
        "min_inr": Decimal("800"),
        "typical_inr": Decimal("2400"),
        "max_inr": Decimal("9500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "handicraft decor",
        "min_inr": Decimal("300"),
        "typical_inr": Decimal("950"),
        "max_inr": Decimal("3500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "chanderi fabric",
        "min_inr": Decimal("250"),
        "typical_inr": Decimal("600"),
        "max_inr": Decimal("1600"),
        "unit": "meter",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "kantha quilt",
        "min_inr": Decimal("1200"),
        "typical_inr": Decimal("3200"),
        "max_inr": Decimal("8500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "brass idol",
        "min_inr": Decimal("550"),
        "typical_inr": Decimal("1600"),
        "max_inr": Decimal("6500"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "blue pottery",
        "min_inr": Decimal("250"),
        "typical_inr": Decimal("750"),
        "max_inr": Decimal("2400"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    },
    {
        "category": "chikankari kurta",
        "min_inr": Decimal("650"),
        "typical_inr": Decimal("1650"),
        "max_inr": Decimal("4800"),
        "unit": "piece",
        "source_note": "indicative, seeded by team; not live market data"
    }
]

def seed_prices(table_name: str):
    print(f"Connecting to DynamoDB table '{table_name}' in region '{AWS_REGION}'...")
    dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
    table = dynamodb.Table(table_name)

    with table.batch_writer() as batch:
        for item in REFERENCE_DATA:
            batch.put_item(Item=item)
            print(f"  [+] Loaded category: {item['category']} ({item['min_inr']} - {item['max_inr']} INR)")

    print(f"Successfully seeded {len(REFERENCE_DATA)} reference price records.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed reference craft prices into DynamoDB")
    parser.add_argument("--table", default=os.environ.get("REFERENCE_PRICES_TABLE"), help="DynamoDB ReferencePrices table name")
    args = parser.parse_args()

    if not args.table:
        print("Error: Table name must be provided via --table or REFERENCE_PRICES_TABLE environment variable.", file=sys.stderr)
        sys.exit(1)

    seed_prices(args.table)
