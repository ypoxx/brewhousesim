#!/usr/bin/env python3
"""Generate an image with the Gemini image models and write it to disk.

The API key is never stored in this repository. It is read from, in order:
  1. $GEMINI_API_KEY
  2. the path in $GEMINI_KEY_FILE
  3. <scratchpad>/.gemini_key

Usage:
    ./gen_image.py --prompt-file prompt.txt --out mockup.png
    ./gen_image.py --prompt "..." --out mockup.png --aspect 16:9 --resolution 2K
    ./gen_image.py --prompt "..." --out v2.png --ref v1.png    # edit / iterate on an image

Exit codes: 0 ok, 1 usage/config error, 2 API error, 3 no image in response.
"""

import argparse
import base64
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
DEFAULT_MODEL = "gemini-3-pro-image"
SCRATCH_KEY = os.path.expanduser("~/.gemini_key")
MIME_BY_SUFFIX = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
                  ".webp": "image/webp"}
# Verified against the API on 2026-07-26. There is deliberately no 16:10.
ASPECTS = ["1:1", "1:4", "1:8", "2:3", "3:2", "3:4", "4:1", "4:3", "4:5", "5:4",
           "8:1", "9:16", "16:9", "21:9"]


def load_key():
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key.strip()
    for path in (os.environ.get("GEMINI_KEY_FILE"), SCRATCH_KEY):
        if path and pathlib.Path(path).is_file():
            return pathlib.Path(path).read_text().strip()
    sys.exit("no API key: set GEMINI_API_KEY, GEMINI_KEY_FILE, or write the scratchpad key file")


def build_request(args):
    parts = []
    for ref in args.ref or []:
        p = pathlib.Path(ref)
        mime = MIME_BY_SUFFIX.get(p.suffix.lower(), "image/png")
        parts.append({"inlineData": {"mimeType": mime,
                                     "data": base64.b64encode(p.read_bytes()).decode()}})
    parts.append({"text": args.prompt})

    image_config = {"aspectRatio": args.aspect}
    if args.resolution:
        image_config["imageSize"] = args.resolution

    return {
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": image_config,
        },
    }


def call_api(model, key, payload, attempts=4):
    """POST with backoff on 429/5xx, which the image models return under load."""
    url = ENDPOINT.format(model=model)
    body = json.dumps(payload).encode()
    delay = 4
    for attempt in range(1, attempts + 1):
        req = urllib.request.Request(
            url, data=body,
            headers={"Content-Type": "application/json", "x-goog-api-key": key},
        )
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:600]
            retriable = e.code == 429 or e.code >= 500
            if not retriable or attempt == attempts:
                sys.exit(f"API error {e.code} after {attempt} attempt(s): {detail}")
            print(f"  {e.code}, retrying in {delay}s ({attempt}/{attempts - 1})",
                  file=sys.stderr)
            time.sleep(delay)
            delay *= 2
        except urllib.error.URLError as e:
            if attempt == attempts:
                sys.exit(f"network error after {attempt} attempt(s): {e}")
            time.sleep(delay)
            delay *= 2
    sys.exit("unreachable")


def extract_image(data):
    """Return (bytes, mime) of the first inline image, or exit with the model's text."""
    for cand in data.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                return base64.b64decode(blob["data"]), blob.get("mimeType", "image/png")
    said = " ".join(
        part["text"]
        for cand in data.get("candidates", [])
        for part in cand.get("content", {}).get("parts", [])
        if "text" in part
    )
    feedback = data.get("promptFeedback", {})
    sys.exit(f"no image returned. model said: {said!r} feedback: {feedback}")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--prompt", help="prompt text")
    src.add_argument("--prompt-file", help="file containing the prompt (preferred: long "
                                           "prompts survive shell quoting intact)")
    ap.add_argument("--out", required=True, help="output image path")
    ap.add_argument("--model", default=DEFAULT_MODEL,
                    help=f"default {DEFAULT_MODEL}; also gemini-3.1-flash-image (faster, "
                         f"cheaper), nano-banana-pro-preview")
    ap.add_argument("--aspect", default="16:9", choices=ASPECTS,
                    help="16:9 for UI mockups; 21:9 for a wide panorama (default 16:9). "
                         "Note there is no 16:10.")
    ap.add_argument("--resolution", default="2K", choices=["1K", "2K", "4K"],
                    help="2K is the right default for UI mockups; 4K for a hero image")
    ap.add_argument("--ref", action="append",
                    help="reference image to edit or continue from; repeatable. This is "
                         "how you keep a consistent style across a set of mockups.")
    args = ap.parse_args()

    if args.prompt_file:
        args.prompt = pathlib.Path(args.prompt_file).read_text()
    if not args.prompt.strip():
        sys.exit("empty prompt")

    key = load_key()
    data = call_api(args.model, key, build_request(args))
    image, mime = extract_image(data)

    out = pathlib.Path(args.out)
    # The models return JPEG regardless of the name you ask for; keep the suffix honest
    # so downstream tools and browsers do not choke on a mislabelled file.
    wanted = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}.get(mime)
    if wanted and out.suffix.lower() not in (wanted, ".jpeg" if wanted == ".jpg" else wanted):
        out = out.with_suffix(wanted)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(image)
    print(f"{out}  {len(image) // 1024} KB  {mime}  [{args.model} {args.aspect} "
          f"{args.resolution}]")


if __name__ == "__main__":
    main()
