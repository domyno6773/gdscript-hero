#!/usr/bin/env python3
"""GitHub Actions OIDC identity preflight. Does not contact Oracle or create resources.
Outputs ONLY sanitized public claim names and known GitHub repository identity.
Never prints the signed OIDC JWT, GitHub request tokens or full token payload.
"""
from __future__ import annotations
import base64
import json
import os
import sys
import urllib.parse
import urllib.request

AUDIENCE = "gdh-oci-readonly"
REPOSITORY = "domyno6773/gdscript-hero"
ENVIRONMENT = "oci-readonly"
ISSUER = "https://token.actions.githubusercontent.com"


def extract_claims(token: str) -> dict:
    parts = token.split(".")
    if len(parts) != 3:
        raise ValueError("Invalid JWT format")
    payload = parts[1] + "=" * (-len(parts[1]) % 4)
    data = json.loads(base64.urlsafe_b64decode(payload).decode("utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Invalid JWT body")
    return data


def validate_claims(c: dict) -> dict:
    expected_subject = f"repo:{REPOSITORY}:environment:{ENVIRONMENT}"
    expected = {
        "iss": ISSUER,
        "aud": AUDIENCE,
        "repository": REPOSITORY,
        "sub": expected_subject,
        "event_name": "workflow_dispatch",
        "ref": "refs/heads/main",
    }
    for k, v in expected.items():
        if c.get(k) != v:
            raise ValueError("Unexpected OIDC claim: " + k)
    if not isinstance(c.get("exp"), int) or not isinstance(c.get("iat"), int):
        raise ValueError("Missing token lifetime")
    if c["exp"] <= c["iat"] or c["exp"] - c["iat"] > 900:
        raise ValueError("Unexpected token lifetime")
    return expected


def main() -> int:
    try:
        base = os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"]
        bearer = os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]
        if not base.startswith("https://"):
            raise ValueError("Invalid GitHub token endpoint")
        parsed = urllib.parse.urlsplit(base)
        if parsed.hostname != "pipelines.actions.githubusercontent.com":
            # GitHub documents multiple token endpoint hostnames. Do not
            # weaken validation without inspecting the actual runner URL.
            raise ValueError("Unexpected GitHub token host")
        join = "&" if parsed.query else "?"
        url = base + join + urllib.parse.urlencode({"audience": AUDIENCE})
        req = urllib.request.Request(url, headers={"Authorization": "Bearer " + bearer})
        with urllib.request.urlopen(req, timeout=8) as response:
            raw = json.load(response)
        token = raw.get("value")
        if not isinstance(token, str):
            raise ValueError("GitHub OIDC JWT missing")
        claims = validate_claims(extract_claims(token))
        print("GITHUB OIDC: verified temporary claims (NO OCI operations):")
        for key in ("iss", "aud", "repository", "sub", "event_name", "ref"):
            print(key + ": " + claims[key])
        print("NOT CONNECTED TO ORACLE. NO RESOURCE CREATION OR COSTS.")
        return 0
    except Exception as exc:
        # Never expose JWT, request URL, tokens or raw network exceptions.
        print("OIDC preflight incomplete. No Oracle operations performed.")
        print("Error category: " + type(exc).__name__)
        return 1


if __name__ == "__main__":
    sys.exit(main())
