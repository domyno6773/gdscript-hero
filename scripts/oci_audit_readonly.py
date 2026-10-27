#!/usr/bin/env python3
"""OCI inventory, read-only and sanitized for public GitHub Actions logs.
Never authorizes provisioning or certifies zero billing.
"""
from __future__ import annotations
import os
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

FREE_A1_OCPUS = 2.0
FREE_A1_RAM_GB = 12.0
FREE_STORAGE_GB = 200.0
REQUIRED = (
    "OCI_AUDIT_USER", "OCI_AUDIT_TENANCY", "OCI_AUDIT_FINGERPRINT",
    "OCI_AUDIT_PRIVATE_KEY", "OCI_AUDIT_REGION",
)


@dataclass
class Inventory:
    compartments: int = 0
    domains: int = 0
    a1_instances: int = 0
    a1_ocpus: float = 0.0
    a1_ram: float = 0.0
    e2_micro: int = 0
    other_instances: int = 0
    boot_volumes: int = 0
    block_volumes: int = 0
    storage_gb: float = 0.0
    backups: int = 0
    unknown: int = 0


def alive(resource):
    return str(getattr(resource, "lifecycle_state", "")).upper() not in ("DELETED", "TERMINATED")


def count_instance(instance, summary):
    if not alive(instance):
        return
    shape = getattr(instance, "shape", "")
    if shape == "VM.Standard.A1.Flex":
        summary.a1_instances += 1
        shape_config = getattr(instance, "shape_config", None)
        ocpus = getattr(shape_config, "ocpus", None)
        memory = getattr(shape_config, "memory_in_gbs", None)
        if ocpus is None or memory is None or float(ocpus) < 0 or float(memory) < 0:
            summary.unknown += 1
        else:
            summary.a1_ocpus += float(ocpus)
            summary.a1_ram += float(memory)
    elif shape == "VM.Standard.E2.1.Micro":
        summary.e2_micro += 1
    else:
        summary.other_instances += 1


def count_volume(volume, summary, boot):
    if not alive(volume):
        return
    if boot:
        summary.boot_volumes += 1
    else:
        summary.block_volumes += 1
    size = getattr(volume, "size_in_gbs", None)
    if size is None or float(size) < 0:
        summary.unknown += 1
    else:
        summary.storage_gb += float(size)


def pages(oci, method, *args, **kwargs):
    return oci.pagination.list_call_get_all_results(method, *args, **kwargs).data


def inventory_oci(oci, config, signer=None):
    auth = {"signer": signer} if signer is not None else {}
    ident = oci.identity.IdentityClient(config, **auth)
    tenancy = config["tenancy"]
    subscriptions = pages(oci, ident.list_region_subscriptions, tenancy)
    home = [x.region_name for x in subscriptions if getattr(x, "is_home_region", False) is True]
    if len(home) != 1 or home[0] != config["region"]:
        raise RuntimeError("Home region non verificata")
    ads = pages(oci, ident.list_availability_domains, tenancy)
    if not ads:
        raise RuntimeError("Availability domains non verificati")
    compartments = [tenancy]
    entries = pages(oci, ident.list_compartments, tenancy,
                    compartment_id_in_subtree=True, access_level="ANY")
    compartments.extend(x.id for x in entries if getattr(x, "lifecycle_state", "") == "ACTIVE")
    compartments = list(dict.fromkeys(compartments))
    summary = Inventory(compartments=len(compartments), domains=len(ads))
    compute = oci.core.ComputeClient(config, **auth)
    block = oci.core.BlockstorageClient(config, **auth)
    for compartment_id in compartments:
        # API failures stop the whole audit; "unknown" is never treated as zero.
        for instance in pages(oci, compute.list_instances, compartment_id):
            count_instance(instance, summary)
        for volume in pages(oci, block.list_volumes, compartment_id):
            count_volume(volume, summary, False)
        for ad in ads:
            for volume in pages(oci, block.list_boot_volumes, ad.name, compartment_id):
                count_volume(volume, summary, True)
        for backup in pages(oci, block.list_volume_backups, compartment_id):
            if alive(backup):
                summary.backups += 1
        for backup in pages(oci, block.list_boot_volume_backups, compartment_id):
            if alive(backup):
                summary.backups += 1
    return summary


def format_report(s):
    within = (
        s.unknown == 0 and s.other_instances == 0
        and s.a1_ocpus <= FREE_A1_OCPUS and s.a1_ram <= FREE_A1_RAM_GB
        and s.e2_micro <= 2 and s.storage_gb <= FREE_STORAGE_GB
        and s.backups <= 5
    )
    return "\n".join([
        "## Audit OCI — inventario SOLA LETTURA",
        "",
        "| Verifica aggregata | Risultato |",
        "|---|---:|",
        "| Regione: verificata come home region | SÌ |",
        f"| Compartment esaminati | {s.compartments} |",
        f"| Availability domain esaminati | {s.domains} |",
        f"| Istanze ARM A1 | {s.a1_instances} |",
        f"| OCPU A1 in uso | {s.a1_ocpus:.2f} / {FREE_A1_OCPUS:.0f} |",
        f"| GB RAM A1 in uso | {s.a1_ram:.2f} / {FREE_A1_RAM_GB:.0f} |",
        f"| Istanze E2 Micro | {s.e2_micro} / 2 |",
        f"| Altre forme Compute | {s.other_instances} |",
        f"| Volumi di avvio | {s.boot_volumes} |",
        f"| Volumi a blocchi | {s.block_volumes} |",
        f"| GB boot + block in uso | {s.storage_gb:.2f} / {FREE_STORAGE_GB:.0f} |",
        f"| Backup volumi | {s.backups} / 5 |",
        f"| Misure sconosciute | {s.unknown} |",
        f"| Quota inventariale parziale | {'Entro i valori guida' if within else 'Verifica manuale richiesta'} |",
        "| Piano e fatturazione | **NON VERIFICABILI DA QUESTO SCRIPT** |",
        "| Autorizzazione alla creazione di risorse | **NO** |",
        "",
        "**NON È UN CERTIFICATO DI GRATUITÀ.** L'inventario non copre rete, traffico,",
        "database, load balancer e tutti gli altri servizi OCI. Anche i numeri",
        "entro quota non sostituiscono il controllo del piano, dell'etichetta",
        "Always Free e dei dettagli di costo prima di una creazione.",
        "**Nessuna risorsa è stata creata o modificata da questo workflow.**",
    ])


def main():
    missing = [name for name in REQUIRED if not os.environ.get(name, "").strip()]
    if missing:
        print("Audit non avviato: mancano questi nomi GitHub Secrets: " + ", ".join(missing))
        return 2
    if "BEGIN" not in os.environ["OCI_AUDIT_PRIVATE_KEY"]:
        print("Audit non avviato: chiave PEM non riconosciuta.")
        return 2
    key_path = None
    try:
        import oci
        with tempfile.NamedTemporaryFile(mode="w", delete=False, encoding="utf-8") as f:
            key_path = f.name
            f.write(os.environ["OCI_AUDIT_PRIVATE_KEY"].replace("\\n", "\n"))
        os.chmod(key_path, 0o600)
        config = {
            "user": os.environ["OCI_AUDIT_USER"].strip(),
            "tenancy": os.environ["OCI_AUDIT_TENANCY"].strip(),
            "fingerprint": os.environ["OCI_AUDIT_FINGERPRINT"].strip(),
            "region": os.environ["OCI_AUDIT_REGION"].strip(),
            "key_file": key_path,
        }
        oci.config.validate_config(config)
        report = format_report(inventory_oci(oci, config))
        print(report)
        if os.environ.get("GITHUB_STEP_SUMMARY"):
            with Path(os.environ["GITHUB_STEP_SUMMARY"]).open("a", encoding="utf8") as f:
                f.write(report + "\n")
        return 0
    except Exception as exc:
        # Never expose exception details, headers, OCIDs, names or metadata.
        print("Audit incompleto: NON è possibile dedurre risorse libere o costi.")
        print("Classe dell'errore (senza dati dell'account): " + type(exc).__name__)
        return 1
    finally:
        if key_path:
            try:
                os.unlink(key_path)
            except OSError:
                pass


if __name__ == "__main__":
    sys.exit(main())
