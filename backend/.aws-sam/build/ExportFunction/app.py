import json

def lambda_handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/csv",
            "Content-Disposition": "attachment; filename=\"kalamitra_catalog.csv\"",
            "Access-Control-Allow-Origin": "*"
        },
        "body": "title,category,price,materials,origin,created_at\n"
    }
