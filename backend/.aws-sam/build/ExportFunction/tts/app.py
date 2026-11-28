"""TtsFunction: converts dynamic regional text to natural audio using standard library urllib."""
import base64
import os
import sys
import urllib.parse
import urllib.request

# Add parent dir to sys.path so 'common' package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from common.http import (
    ValidationError,
    error_response,
    parse_body,
    success_response,
    validate_payload,
)

LANG_MAP = {
    "hi": "hi",
    "mr": "mr",
    "gu": "gu",
    "ta": "ta",
    "bn": "bn",
    "te": "te",
    "kn": "kn",
    "pa": "pa",
    "en": "en-IN",
}


def lambda_handler(event, context):
    try:
        body = parse_body(event)
        validate_payload(
            body,
            required=["text"],
            length_caps={"text": (1, 1500)},
        )
    except ValidationError as e:
        return error_response(e.message, status_code=400)

    text = body["text"].strip()
    raw_lang = body.get("language", "hi")
    lang_code = raw_lang.split("-")[0].lower() if raw_lang else "hi"
    target_lang = LANG_MAP.get(lang_code, "hi")

    # Split text into chunks <= 180 chars
    words = text.split()
    chunks = []
    current_chunk = []
    current_len = 0
    for w in words:
        if current_len + len(w) + 1 > 180:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [w]
                current_len = len(w)
            else:
                chunks.append(w[:180])
                current_chunk = []
                current_len = 0
        else:
            current_chunk.append(w)
            current_len += len(w) + 1
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    if not chunks:
        chunks = [text[:180]]

    # Download and concatenate audio chunks
    combined_audio = bytearray()
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    for chunk in chunks[:5]:  # Max 5 chunks (~900 chars)
        params = urllib.parse.urlencode({
            "ie": "UTF-8",
            "q": chunk,
            "tl": target_lang,
            "client": "tw-ob",
        })
        url = f"https://translate.google.com/translate_tts?{params}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                combined_audio.extend(resp.read())
        except Exception as e:
            print(f"TTS fetch notice for chunk '{chunk[:30]}': {e}")
            break

    if not combined_audio:
        return error_response("Failed to synthesize speech", status_code=502)

    b64_audio = base64.b64encode(combined_audio).decode("utf-8")
    audio_data_url = f"data:audio/mp3;base64,{b64_audio}"

    return success_response({
        "audioDataUrl": audio_data_url,
        "language": target_lang,
    })
