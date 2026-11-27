"""Common utilities and JSON response helpers for KalaMitra Lambdas.

Aliases and re-exports functions from http.py for backward compatibility.
"""
from .http import DecimalEncoder, error_response, json_response, parse_body, success_response

__all__ = [
    "DecimalEncoder",
    "json_response",
    "success_response",
    "error_response",
    "parse_body",
]
