#!/usr/bin/env python3
"""GitHub JWT -> OCI RPST -> partial read-only inventory.

Run only manually in the protected oci-readonly environment. No persistent
OCI API key, admin token, infrastructure writes, or raw token logging.
An inactive trust/app intentionally fails. This does not establish zero cost.
"""
from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from oci_github_oidc_probe import (
    AUDIENCE, EXPECTED_SUBJECT, extract_claims, validate_claims, validate_endpoint,
)
from oci_audit_readonly import inventory_oci, format_report
from oci_trust_setup import domain_origin

REQUIRED = ("OCI_FED_DOMAIN_URL", "OCI_FED_CLIENT_ID", "OCI_FED_CLIENT_SECRET",
            "OCI_FED_TENANCY", "OCI_FED_REGION", "OCI_FED_DOMAIN_OCID")


class FederationError(Exception):
    """Static sanitized error only."""


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise FederationError("Redirect rifiutato: credenziali non inoltrate.")


def oauth_error_summary(exc):
    """Expose only fixed vocabulary, never server text or credential values."""
    details = []
    try:
        raw = exc.read(16385)
        if len(raw) > 16384:
            return ""
        body = json.loads(raw)
        if not isinstance(body, dict):
            return ""
        code = body.get("error")
        if code in ("invalid_request", "invalid_client", "invalid_grant",
                    "unauthorized_client", "unsupported_grant_type", "invalid_scope",
                    "access_denied", "server_error", "temporarily_unavailable"):
            details.append("OAuth=" + code)
        description = body.get("error_description", "")
        if isinstance(description, str):
            # Labels are hints from the response, not a diagnosis. No source
            # substring (including tokens, IDs or descriptions) is emitted.
            words = set(re.findall(r"[a-z_]+", description.lower()))
            labels = [word for word in ("audience", "issuer", "signature", "certificate",
                      "public_key", "client", "trust", "claim", "subject", "grant",
                      "expired", "scope", "resource", "unsupported", "disabled")
                      if word in words]
            if labels:
                details.append("riferimenti=" + ",".join(labels))
    except Exception:
        pass
    return "; " + "; ".join(details) if details else ""


def http_json(request):
    try:
        with urllib.request.build_opener(NoRedirect()).open(request, timeout=20) as response:
            # Bound response size; never write raw responses to stdout or files.
            raw = response.read(131073)
            if len(raw) > 131072:
                raise FederationError("Risposta troppo grande.")
            body = json.loads(raw)
    except urllib.error.HTTPError as exc:
        raise FederationError("Autenticazione rifiutata (HTTP %d)%s." %
                              (exc.code, oauth_error_summary(exc))) from None
    except urllib.error.URLError:
        raise FederationError("Connessione di autenticazione non riuscita.") from None
    if not isinstance(body, dict):
        raise FederationError("Risposta di autenticazione non valida.")
    return body


def config_from_env(env):
    if any(not env.get(k, "").strip() for k in REQUIRED):
        raise FederationError("Configurazione OCI_FED incompleta: nessuna chiamata Oracle eseguita.")
    origin = domain_origin(env["OCI_FED_DOMAIN_URL"])
    if not re.fullmatch(r"[0-9a-f]{32}", env["OCI_FED_CLIENT_ID"]):
        raise FederationError("Client ID non valido.")
    if not re.fullmatch(r"ocid1\.tenancy\.oc1\.[a-z0-9.]+", env["OCI_FED_TENANCY"]):
        raise FederationError("Tenancy OCID non valido.")
    if not re.fullmatch(r"ocid1\.domain\.oc1\.[a-z0-9.]+", env["OCI_FED_DOMAIN_OCID"]):
        raise FederationError("Domain OCID non valido.")
    # Only the region observed in the user's console; inventory independently
    # verifies the TENANCY home region before enumerating Compute/storage.
    if env["OCI_FED_REGION"] != "eu-milan-1":
        raise FederationError("Regione inattesa: audit fermato.")
    return origin


def github_token(env, http=http_json):
    base = env["ACTIONS_ID_TOKEN_REQUEST_URL"]
    validate_endpoint(base)
    p = urllib.parse.urlsplit(base)
    # Replace any existing audience instead of appending duplicate parameters.
    query = [(k, v) for k, v in urllib.parse.parse_qsl(p.query) if k != "audience"]
    query.append(("audience", AUDIENCE))
    url = urllib.parse.urlunsplit(p._replace(query=urllib.parse.urlencode(query)))
    request = urllib.request.Request(url, headers={
        "Authorization": "Bearer " + env["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]})
    token = http(request).get("value")
    if not isinstance(token, str):
        raise FederationError("Token GitHub assente.")
    claims = extract_claims(token)
    validate_claims(claims)
    now = int(time.time())
    if claims["iat"] > now + 60 or claims["exp"] <= now + 30:
        raise FederationError("Token GitHub scaduto o prematuro.")
    return token


def exchange(origin, env, jwt, public_pem, http=http_json):
    body = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
        "requested_token_type": "urn:oci:token-type:oci-rpst",
        "public_key": public_pem,
        "subject_token_type": "jwt", "subject_token": jwt,
        "res_type": "gdhgithubreadonly", "rpst_exp": "20",
    }).encode("utf-8")
    basic = base64.b64encode((env["OCI_FED_CLIENT_ID"] + ":" +
                              env["OCI_FED_CLIENT_SECRET"]).encode()).decode("ascii")
    request = urllib.request.Request(origin + "/oauth2/v1/token", data=body,
        headers={"Authorization": "Basic " + basic,
                 "Content-Type": "application/x-www-form-urlencoded"}, method="POST")
    rpst = http(request).get("token")
    if not isinstance(rpst, str):
        raise FederationError("RPST assente nella risposta Oracle.")
    claims = extract_claims(rpst)
    if claims.get("var_domain.id") != env["OCI_FED_DOMAIN_OCID"] or claims.get("var_name") != EXPECTED_SUBJECT:
        raise FederationError("Identita Oracle inattesa: inventario non avviato.")
    exp = claims.get("exp")
    if type(exp) is not int or not int(time.time()) < exp <= int(time.time()) + 1260:
        raise FederationError("Durata RPST inattesa: inventario non avviato.")
    return rpst


def run(env):
    origin = config_from_env(env)
    # Dependencies imported only after local configuration validation.
    import oci
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_pem = key.public_key().public_bytes(
        serialization.Encoding.PEM, serialization.PublicFormat.SubjectPublicKeyInfo).decode("ascii")
    print("Fase: richiesta identita GitHub.")
    jwt = github_token(env)
    print("Fase: scambio token GitHub con Oracle.")
    rpst = exchange(origin, env, jwt, public_pem)
    signer = oci.auth.signers.SecurityTokenSigner(rpst, key)
    config = {"tenancy": env["OCI_FED_TENANCY"], "region": env["OCI_FED_REGION"]}
    print("Scambio OCI completato; avvio inventario parziale SOLA LETTURA.")
    # Only existing list_* methods in inventory_oci are called.
    report = format_report(inventory_oci(oci, config, signer=signer))
    print(report)
    if env.get("GITHUB_STEP_SUMMARY"):
        with Path(env["GITHUB_STEP_SUMMARY"]).open("a", encoding="utf-8") as f:
            f.write(report + "\n")


def main():
    try:
        run(os.environ)
        return 0
    except FederationError as exc:
        print("Audit federato fermato: " + str(exc))
    except Exception as exc:
        # Neither exception messages, response bodies nor traceback may escape.
        print("Audit federato incompleto; categoria: " + type(exc).__name__)
        status = getattr(exc, "status", None)
        if type(status) is int and 100 <= status <= 599:
            print("Stato HTTP OCI: " + str(status))
    print("Non dedurre quote disponibili o gratuita da questo esito. Nessuna risorsa di hosting creata.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
