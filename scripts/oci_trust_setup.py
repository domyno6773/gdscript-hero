#!/usr/bin/env python3
"""Local OCI trust bootstrap. Python 3.10+, standard library only.

Default: offline preview. --apply: create ONE INACTIVE identity trust after
local confirmation. Never activates apps/trusts, grants IAM permissions,
creates hosting resources, or communicates with GitHub. Admin token stays local.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ISSUER = "https://token.actions.githubusercontent.com"
AUDIENCE = "gdh-oci-readonly"
SUBJECT = "repo:domyno6773@134240680/gdscript-hero@1431761977:environment:oci-readonly"
# Pin to the existing, tested workflow. A future audit workflow needs a
# separately reviewed trust change; do not broaden this to a wildcard.
WORKFLOW = "domyno6773/gdscript-hero/.github/workflows/oci-oidc-preflight.yml@refs/heads/main"
TRUST_NAME = "gdh-github-readonly"
COLLECTION = "/admin/v1/IdentityPropagationTrusts"


class SetupError(Exception):
    """Only static, non-sensitive messages may be placed here."""


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise SetupError("Redirect rifiutato: nessuna credenziale inoltrata.")


def domain_origin(value):
    try:
        p = urllib.parse.urlsplit(value.strip())
        valid = (
            p.scheme == "https" and not p.username and not p.password
            and p.port in (None, 443) and p.path in ("", "/")
            and not p.query and not p.fragment
            and re.fullmatch(r"idcs-[0-9a-f]{32}\.identity\.oraclecloud\.com", p.hostname or "")
        )
    except ValueError:
        valid = False
    if not valid:
        raise SetupError("Serve il Domain URL principale HTTPS di Oracle, senza percorsi o parametri.")
    return "https://" + p.hostname


def trust_payload(client_id):
    if not re.fullmatch(r"[0-9a-f]{32}", client_id):
        raise SetupError("Client ID non valido: usa il Client ID OAuth, non Application ID o secret.")
    return {
        "schemas": ["urn:ietf:params:scim:schemas:oracle:idcs:IdentityPropagationTrust"],
        "name": TRUST_NAME,
        "description": "GDScript Hero GitHub identity preflight; inactive bootstrap; no IAM grants",
        "type": "JWT", "subjectType": "Resource", "active": False,
        "issuer": ISSUER,
        "publicKeyEndpoint": ISSUER + "/.well-known/jwks",
        "oauthClients": [client_id],
        "allowImpersonation": True,
        "impersonatingResource": "gdhgithubreadonly",
        "clientClaimName": "aud", "clientClaimValues": [AUDIENCE],
        "claimValidations": [
            {"name": "sub", "value": SUBJECT},
            {"name": "workflow_ref", "value": WORKFLOW},
            {"name": "ref", "value": "refs/heads/main"},
            {"name": "event_name", "value": "workflow_dispatch"},
            {"name": "aud", "value": AUDIENCE},
        ],
        "claimPropagations": ["ext_repository", "ext_workflow_ref", "ext_event_name"],
    }


def read_token(path):
    raw = Path(path).read_text(encoding="utf-8-sig").strip()
    # Accept the raw JWT from Oracle's tokens.tok. Unknown formats stop instead
    # of extracting an arbitrary credential or printing the downloaded file.
    if not re.fullmatch(r"[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+", raw):
        raise SetupError("Formato tokens.tok non riconosciuto. Non inviare il file in chat.")
    return raw


def request_json(origin, token, method, suffix, payload=None):
    # Only this fixed identity API collection is reachable with the token.
    if method not in ("GET", "POST") or not suffix.startswith(COLLECTION):
        raise SetupError("Operazione non consentita.")
    if method == "POST" and suffix != COLLECTION:
        raise SetupError("Operazione non consentita.")
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(origin + suffix, data=data, method=method,
                                 headers={"Authorization": "Bearer " + token,
                                          "Accept": "application/scim+json",
                                          "Content-Type": "application/scim+json"})
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        # Do not expose response body, headers or request credentials.
        raise SetupError("Oracle ha rifiutato la richiesta (HTTP %d). Nessun retry automatico." % exc.code) from None
    except (urllib.error.URLError, TimeoutError):
        raise SetupError("Errore di rete: esito da verificare, non ripetere automaticamente la creazione.") from None
    if not isinstance(result, dict):
        raise SetupError("Risposta Oracle inattesa.")
    return result


def validate_saved(saved, expected):
    for key in ("name", "type", "subjectType", "active", "issuer", "publicKeyEndpoint",
                "allowImpersonation", "impersonatingResource", "clientClaimName"):
        if type(saved.get(key)) is not type(expected[key]) or saved[key] != expected[key]:
            raise SetupError("Trust salvato non conforme: non attivarlo. Verifica amministrativa necessaria.")
    for key in ("oauthClients", "clientClaimValues", "claimPropagations"):
        if not isinstance(saved.get(key), list) or sorted(saved[key]) != sorted(expected[key]):
            raise SetupError("Vincoli del trust non confermati: non attivarlo.")
    rules = saved.get("claimValidations")
    if not isinstance(rules, list) or len(rules) != len(expected["claimValidations"]):
        raise SetupError("Validazioni claim non confermate: non attivare il trust.")
    actual = {(r.get("name"), r.get("value")) for r in rules if isinstance(r, dict)}
    wanted = {(r["name"], r["value"]) for r in expected["claimValidations"]}
    if actual != wanted:
        raise SetupError("Validazioni claim non confermate: non attivare il trust.")


def create_inactive(origin, token, payload, confirm=input, api=request_json):
    query = urllib.parse.urlencode({"filter": 'issuer eq "' + ISSUER + '"', "count": "1"})
    existing = api(origin, token, "GET", COLLECTION + "?" + query)
    if type(existing.get("totalResults")) is not int or existing["totalResults"] < 0:
        raise SetupError("Inventario trust incompleto: nessuna creazione autorizzata.")
    if existing["totalResults"] != 0 or existing.get("Resources", []):
        raise SetupError("Esiste gia un trust GitHub: fermato senza modificarlo o duplicarlo.")
    print("Verifica iniziale: nessun trust con questo issuer.")
    print("Unica modifica: creare il trust INATTIVO mostrato sopra. Nessun permesso IAM assegnato.")
    if confirm("Per confermare scrivi CREA TRUST INATTIVO: ").strip() != "CREA TRUST INATTIVO":
        print("Annullato: nessuna modifica.")
        return False
    created = api(origin, token, "POST", COLLECTION, payload)
    trust_id = created.get("id", "")
    if not isinstance(trust_id, str) or not re.fullmatch(r"[0-9a-f]{32}", trust_id):
        raise SetupError("Risposta di creazione incompleta: verifica la console prima di riprovare.")
    saved = api(origin, token, "GET", COLLECTION + "/" + trust_id)
    validate_saved(saved, payload)
    print("Trust INATTIVO creato e riletto: tutti i vincoli confermati.")
    print("Collegamento non ancora operativo: restano policy IAM, test di scambio, secrets GitHub e attivazione.")
    return True


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Crea solo il trust inattivo dopo conferma locale")
    args = parser.parse_args(argv)
    try:
        origin = domain_origin(input("Domain URL principale Oracle (non e un segreto): "))
        payload = trust_payload(input("Client ID OAuth dell'app gdh-github-readonly: ").strip())
        print("\nANTEPRIMA: trust inattivo; nessuna VM, policy IAM o risorsa di hosting.")
        print("Destinazione: " + origin)
        print(json.dumps(payload, indent=2))
        if not args.apply:
            print("Solo anteprima OFFLINE. Nessuna credenziale letta o chiamata di rete eseguita.")
            return 0
        token_path = input("Percorso locale del file tokens.tok (non incollare il contenuto): ").strip().strip('"')
        token = read_token(token_path)
        try:
            create_inactive(origin, token, payload)
        finally:
            token = None
        return 0
    except SetupError as exc:
        print("STOP: " + str(exc))
    except (EOFError, KeyboardInterrupt):
        print("Interrotto. Se una richiesta era in corso verifica la console prima di riprovare.")
    except Exception:
        print("STOP: errore inatteso. Dettagli omessi per proteggere le credenziali; verifica la console prima di riprovare.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
