#!/usr/bin/env python3
"""Local OCI trust bootstrap. Python 3.10+, standard library only.

Default: offline preview. --apply: create ONE INACTIVE identity trust.
--prepare-activation: generate a list-only IAM policy locally; after the owner
creates it, revalidate app/trust and activate only those two identities with
explicit local confirmation. Never grants IAM permissions or creates hosting
resources. Admin token stays local; never communicates with GitHub.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import tempfile
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


def readonly_policy(domain_ocid):
    if not re.fullmatch(r"ocid1\.domain\.oc1\.[a-z0-9.]+", domain_ocid):
        raise SetupError("Domain OCID non valido.")
    common = "request.principal.type='gdhgithubreadonly', request.domain.id='" + domain_ocid + "'"
    rules = [
        ("inspect tenancies", ["ListRegionSubscriptions"]),
        ("inspect compartments", ["ListCompartments", "ListAvailabilityDomains"]),
        ("read instances", ["ListInstances"]),
        ("inspect volumes", ["ListVolumes", "ListBootVolumes", "ListVolumeBackups", "ListBootVolumeBackups"]),
        ("inspect volume-backups", ["ListVolumeBackups"]),
        ("inspect boot-volume-backups", ["ListBootVolumeBackups"]),
    ]
    result = []
    for grant, operations in rules:
        ops = ["request.operation='" + op + "'" for op in operations]
        condition = ops[0] if len(ops) == 1 else "any {" + ", ".join(ops) + "}"
        result.append("Allow any-user to " + grant + " in tenancy where all {" + common + ", " + condition + "}")
    return "\n".join(result) + "\n"


def activation_api(origin, token, method, suffix, payload=None, version=None):
    allowed_read = re.fullmatch(r"/admin/v1/(Apps|Grants|IdentityPropagationTrusts)(/[0-9a-f]{32})?(\?[^#]*)?", suffix)
    app_write = method == "PUT" and re.fullmatch(r"/admin/v1/AppStatusChanger/[0-9a-f]{32}", suffix)
    trust_write = method == "PATCH" and re.fullmatch(r"/admin/v1/IdentityPropagationTrusts/[0-9a-f]{32}", suffix)
    if method == "GET":
        if not allowed_read or payload is not None:
            raise SetupError("Lettura non consentita.")
    elif app_write:
        if payload != {"schemas": ["urn:ietf:params:scim:schemas:oracle:idcs:AppStatusChanger"], "active": True}:
            raise SetupError("Solo attivazione dell'app consentita.")
    elif trust_write:
        if payload != {"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
                       "Operations": [{"op": "replace", "path": "active", "value": True}]}:
            raise SetupError("Solo attivazione del trust consentita.")
        if not isinstance(version, str) or not version:
            raise SetupError("Versione trust assente: attivazione fermata.")
    else:
        raise SetupError("Operazione di attivazione non consentita.")
    headers = {"Authorization": "Bearer " + token, "Accept": "application/scim+json",
               "Content-Type": "application/scim+json"}
    if version:
        headers["If-Match"] = version
    req = urllib.request.Request(domain_origin(origin) + suffix,
        data=None if payload is None else json.dumps(payload).encode("utf-8"),
        method=method, headers=headers)
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as response:
            raw = response.read(131073)
            if len(raw) > 131072:
                raise SetupError("Risposta Oracle troppo grande.")
            result = json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        raise SetupError("Attivazione o verifica rifiutata (HTTP %d). Nessun retry automatico." % exc.code) from None
    except (urllib.error.URLError, TimeoutError):
        raise SetupError("Connessione interrotta: verificare lo stato dell'app e del trust prima di riprovare.") from None
    if not isinstance(result, dict):
        raise SetupError("Risposta Oracle inattesa.")
    return result


def one_resource(result):
    rows = result.get("Resources")
    if type(result.get("totalResults")) is not int or result["totalResults"] != 1 or not isinstance(rows, list) or len(rows) != 1:
        raise SetupError("Serve esattamente una identita corrispondente: nessuna modifica.")
    row = rows[0]
    if not isinstance(row, dict) or not re.fullmatch(r"[0-9a-f]{32}", str(row.get("id", ""))):
        raise SetupError("Identificativo Oracle inatteso.")
    return row


APP_ATTRS = "id,name,displayName,active,domainOcid,isOAuthClient,clientType,allowedGrants,trustScope,allowedScopes,grantedAppRoles"


def activation_snapshot(origin, token, client_id, domain_ocid, api=activation_api):
    expected = trust_payload(client_id)
    query = urllib.parse.urlencode({"filter": 'issuer eq "' + ISSUER + '"', "count": "2"})
    trust = one_resource(api(origin, token, "GET", COLLECTION + "?" + query))
    if type(trust.get("active")) is not bool or trust.get("domainOcid") != domain_ocid:
        raise SetupError("Dominio o stato del trust non verificato.")
    expected["active"] = trust["active"]
    validate_saved(trust, expected)
    query = urllib.parse.urlencode({"filter": 'name eq "' + client_id + '"', "count": "2", "attributes": APP_ATTRS})
    app = one_resource(api(origin, token, "GET", "/admin/v1/Apps?" + query))
    if (app.get("domainOcid") != domain_ocid or app.get("name") != client_id
            or app.get("displayName") != TRUST_NAME or app.get("isOAuthClient") is not True
            or app.get("clientType") != "confidential" or app.get("trustScope") != "Explicit"
            or app.get("allowedGrants") != ["client_credentials"] or type(app.get("active")) is not bool
            or app.get("allowedScopes") or app.get("grantedAppRoles")):
        raise SetupError("Configurazione app non conforme: nessuna attivazione.")
    query = urllib.parse.urlencode({"filter": 'grantee.value eq "' + app["id"] + '"', "count": "1"})
    grants = api(origin, token, "GET", "/admin/v1/Grants?" + query)
    if type(grants.get("totalResults")) is not int or grants["totalResults"] != 0 or grants.get("Resources", []):
        raise SetupError("App con assegnazioni o inventario incompleto: nessuna attivazione.")
    version = trust.get("meta", {}).get("version")
    if not trust["active"] and (not isinstance(version, str) or not version):
        raise SetupError("Versione trust non verificata.")
    return trust, app


def activate_verified(origin, token, client_id, domain_ocid, confirm=input, api=activation_api):
    trust, app = activation_snapshot(origin, token, client_id, domain_ocid, api)
    print("Controlli OK: app senza scope o grant aggiuntivi; trust esatto per repository, workflow e ambiente.")
    print("La policy IAM e stata confermata da te, NON verificata da queste API Identity Domains.")
    print("Modifiche previste: attivare solo gdh-github-readonly e il relativo trust. Nessuna policy assegnata dallo script.")
    if confirm("Per autorizzare scrivi ATTIVA PONTE SOLA LETTURA: ").strip() != "ATTIVA PONTE SOLA LETTURA":
        print("Annullato: nessuna attivazione.")
        return False
    # Refresh all identity checks immediately before writes; conditional trust
    # PATCH rejects concurrent edits rather than overwriting changed constraints.
    trust, app = activation_snapshot(origin, token, client_id, domain_ocid, api)
    if not app["active"]:
        api(origin, token, "PUT", "/admin/v1/AppStatusChanger/" + app["id"],
            {"schemas": ["urn:ietf:params:scim:schemas:oracle:idcs:AppStatusChanger"], "active": True})
        print("Richiesta attivazione app inviata; verifica finale in corso.")
    if not trust["active"]:
        api(origin, token, "PATCH", COLLECTION + "/" + trust["id"],
            {"schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
             "Operations": [{"op": "replace", "path": "active", "value": True}]},
            version=trust["meta"]["version"])
        print("Richiesta attivazione trust inviata; verifica finale in corso.")
    saved_trust, saved_app = activation_snapshot(origin, token, client_id, domain_ocid, api)
    if saved_trust["active"] is not True or saved_app["active"] is not True:
        raise SetupError("Attivazione non confermata: verificare console e stato prima di riprovare.")
    print("APP E TRUST ATTIVI: configurazione riletta e verificata.")
    print("Restano da verificare lo scambio reale e l'efficacia della policy con il workflow manuale oracle_audit=true.")
    return True


def prepare_activation(origin, client_id):
    domain_ocid = input("OCID dominio Default (lo stesso salvato in OCI_FED_DOMAIN_OCID): ").strip()
    policy = readonly_policy(domain_ocid)
    # Generated policy contains identifiers only, never credentials. Keep it
    # local; opening it in Notepad avoids six manual replacements in the UI.
    with tempfile.NamedTemporaryFile(mode="w", suffix="-gdh-readonly-policy.txt", delete=False, encoding="utf-8") as f:
        f.write(policy)
        policy_path = f.name
    print("\nPolicy generata nel file locale: " + policy_path)
    if os.name == "nt":
        os.startfile(policy_path)
    print("Su Oracle: Identity & Security -> Policies (IAM tenancy, non Domain policies).")
    print("Compartment radice -> Create policy -> nome gdh-github-inventory-readonly.")
    print("Descrizione: Inventario GDScript Hero in sola lettura.")
    print("Policy Builder -> Show manual editor -> incolla tutte le righe del file e crea la policy.")
    print("Questa policy concede solo le operazioni List indicate. L'efficacia verra verificata dal workflow.")
    if input("Dopo aver verificato e creato la policy, scrivi POLICY SOLA LETTURA CREATA: ").strip() != "POLICY SOLA LETTURA CREATA":
        print("Preparazione terminata senza attivazioni.")
        return
    print("Verifica che l'ambiente GitHub oci-readonly abbia reviewer obbligatorio, solo main e i sei secrets previsti.")
    print("Le protezioni GitHub non sono verificabili da questo script locale.")
    print("Ora serve un token personale Identity Domains ancora valido. Se il precedente e scaduto, scaricane uno nuovo da My access tokens.")
    token_path = input("Percorso locale del nuovo tokens.tok (non il contenuto): ").strip().strip('"')
    token = read_token(token_path)
    try:
        activate_verified(origin, token, client_id, domain_ocid)
    finally:
        token = None


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--apply", action="store_true", help="Crea solo il trust inattivo dopo conferma locale")
    modes.add_argument("--prepare-activation", action="store_true", help="Genera policy locale e guida l'attivazione verificata")
    args = parser.parse_args(argv)
    try:
        origin = domain_origin(input("Domain URL principale Oracle (non e un segreto): "))
        payload = trust_payload(input("Client ID OAuth dell'app gdh-github-readonly: ").strip())
        if args.prepare_activation:
            prepare_activation(origin, payload["oauthClients"][0])
            return 0
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
