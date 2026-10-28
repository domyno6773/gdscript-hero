#!/usr/bin/env python3
"""Delete exactly two unused legacy OCI VCNs in eu-milan-1 from Oracle Cloud Shell.

Only accepts a native OCI Cloud Shell session (no exported keys or CI tokens).
Dry run by default; --apply deletes after a complete dependency preflight.
Creates NO OCI resources. Refuses any GDH-managed VCN, attached resource,
unknown networking feature or inability to examine all compartments.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REGION = "eu-milan-1"
DEAD = {"DELETED", "TERMINATED", "DETACHED"}


class Stop(Exception):
    pass


def demand(condition, msg):
    if not condition:
        raise Stop(msg)


def active(seq):
    return [x for x in seq if getattr(x, "lifecycle_state", None) not in DEAD]


def full(oci, op, *args, **kwargs):
    return oci.pagination.list_call_get_all_results(op, *args, **kwargs).data


def protected(row):
    tags = getattr(row, "freeform_tags", None) or {}
    name = (getattr(row, "display_name", "") or "").lower()
    return bool(tags.get("gdh-managed") or "gdscript" in name or name.startswith("gdh-"))


def check_unused(oci, net, comp_ids, vcn):
    resource_types = {
        "vtaps": net.list_vtaps,
        "subnets": net.list_subnets,
        "route_tables": net.list_route_tables,
        "security_lists": net.list_security_lists,
        "dhcp_options": net.list_dhcp_options,
        "internet_gateways": net.list_internet_gateways,
        "nat_gateways": net.list_nat_gateways,
        "service_gateways": net.list_service_gateways,
        "local_peering_gateways": net.list_local_peering_gateways,
        "network_security_groups": net.list_network_security_groups,
        "vlans": net.list_vlans,
        "drg_attachments": net.list_drg_attachments,
    }
    found = {k: [] for k in resource_types}
    for cid in comp_ids:
        for k, method in resource_types.items():
            # list_network_security_groups exposes **kwargs only: passing cid
            # positionally raises TypeError before any deletion can start.
            opts = {"compartment_id": cid, "vcn_id": vcn.id}
            found[k] += active(full(oci, method, **opts))
    # Peering, DRG, NSGs and VLANs can be used outside the simple network.
    for label in ("local_peering_gateways", "network_security_groups", "vlans", "drg_attachments", "vtaps"):
        demand(not found[label], f"VCN {vcn.display_name}: collegamenti {label} presenti. Nessuna cancellazione.")
    # IP checks catch Compute VNICs, load balancers, mount targets, databases,
    # and detached reserved IPs. Unknown scan errors abort the entire operation.
    for subnet in found["subnets"]:
        demand(not full(oci, net.list_private_ips, subnet_id=subnet.id),
               f"VCN {vcn.display_name}: IP privati in uso o riservati ({subnet.display_name}).")
        demand(not full(oci, net.list_ipv6s, subnet_id=subnet.id),
               f"VCN {vcn.display_name}: indirizzi IPv6 presenti ({subnet.display_name}).")
    for kind, rows in found.items():
        demand(not any(protected(x) for x in rows),
               f"VCN {vcn.display_name}: rete con risorse GDScript Hero: protetta.")
        ids = [x.id for x in rows]
        demand(len(ids) == len(set(ids)), "Risorsa duplicata nell'inventario. Fermato.")
    return found


def snapshot(oci, vcns, plans):
    """Archive network objects locally without leaking details to public GitHub."""
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    dest = Path.home() / f"gdh_vcns_before_delete_{stamp}.json"
    data = {
        "region": REGION,
        "vcns": [oci.util.to_dict(x) for x in vcns],
        "network_resources": [
            {name: [oci.util.to_dict(row) for row in rows] for name, rows in plan.items()}
            for plan in plans
        ],
    }
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    fd = os.open(dest, flags, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return dest


def gone(oci, get_method, rid, label, max_seconds=210):
    from oci.exceptions import ServiceError
    until = time.monotonic() + max_seconds
    while True:
        try:
            state = getattr(get_method(rid).data, "lifecycle_state", None)
            if state in DEAD:
                return
        except ServiceError as exc:
            if exc.status == 404:
                return
            raise
        if time.monotonic() >= until:
            raise Stop(f"Timeout conferma {label}. Controllare stato in Oracle prima di riprovare.")
        time.sleep(3)


def remove_one(oci, net, vcn, plan):
    # No user-owned resources are deleted. Only empty network primitives.
    no_retry = {"retry_strategy": oci.retry.NoneRetryStrategy()}
    def delete_many(name, method, get):
        for row in plan[name]:
            print(f"Elimino {name}: {row.display_name}", flush=True)
            method(row.id, **no_retry)
            gone(oci, get, row.id, name)
    delete_many("subnets", net.delete_subnet, net.get_subnet)
    # A gateway referenced in ANY route table cannot be deleted until routes
    # are cleared. Subnets have already been removed, hence no active traffic.
    for route in plan["route_tables"]:
        if route.route_rules:
            print(f"Svuoto tabella rotte: {route.display_name}", flush=True)
            net.update_route_table(route.id,
                oci.core.models.UpdateRouteTableDetails(route_rules=[]), **no_retry)
    delete_many("internet_gateways", net.delete_internet_gateway, net.get_internet_gateway)
    delete_many("nat_gateways", net.delete_nat_gateway, net.get_nat_gateway)
    delete_many("service_gateways", net.delete_service_gateway, net.get_service_gateway)
    for kind, delete, get, default_id in (
        ("route_tables", net.delete_route_table, net.get_route_table, vcn.default_route_table_id),
        ("security_lists", net.delete_security_list, net.get_security_list, vcn.default_security_list_id),
        ("dhcp_options", net.delete_dhcp_options, net.get_dhcp_options, vcn.default_dhcp_options_id),
    ):
        for row in plan[kind]:
            if row.id == default_id:
                continue  # Oracle deletes defaults with VCN.
            print(f"Elimino {kind}: {row.display_name}", flush=True)
            delete(row.id, **no_retry)
            gone(oci, get, row.id, kind)
    print(f"Elimino VCN: {vcn.display_name}", flush=True)
    net.delete_vcn(vcn.id, **no_retry)
    gone(oci, net.get_vcn, vcn.id, "VCN")
    print(f"VCN eliminata: {vcn.display_name}", flush=True)


def run(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Elimina le due VCN solo dopo tutti i controlli")
    args = parser.parse_args(argv)
    try:
        import oci
        # Read active CLI configuration. Oracle Cloud Shell already configures it.
        demand(bool(os.environ.get("OCI_CLI_CONFIG_FILE") or Path.home().joinpath(".oci/config").exists()),
               "Usare Oracle Cloud Shell autenticato, non un runner GitHub.")
        cfg = oci.config.from_file(file_location=os.environ.get("OCI_CLI_CONFIG_FILE") or oci.config.DEFAULT_LOCATION,
                                  profile_name=os.environ.get("OCI_CLI_PROFILE") or "DEFAULT")
        if os.environ.get("OCI_CLI_REGION"):
            cfg["region"] = os.environ["OCI_CLI_REGION"]
        demand(cfg.get("region") == REGION, "Regione OCI diversa da Milano: nessuna cancellazione.")
        ident = oci.identity.IdentityClient(cfg)
        net = oci.core.VirtualNetworkClient(cfg)
        tenancy = cfg["tenancy"]
        comps = active(full(oci, ident.list_compartments, tenancy,
                            compartment_id_in_subtree=True, access_level="ANY"))
        comp_ids = list(dict.fromkeys([tenancy] + [x.id for x in comps]))
        vcns = []
        for cid in comp_ids:
            vcns.extend(active(full(oci, net.list_vcns, cid)))
        print(f"VCN trovate in {REGION}: {len(vcns)}", flush=True)
        for v in vcns:
            print(f"  - {v.display_name}: {v.id}")
        demand(len(vcns) == 2, "L'inventario non contiene esattamente due VCN: nessuna cancellazione.")
        demand(len({v.id for v in vcns}) == 2, "VCN duplicate: fermato.")
        demand(all(v.lifecycle_state == "AVAILABLE" for v in vcns),
               "Almeno una VCN non disponibile: fermato.")
        demand(all(not protected(v) for v in vcns), "VCN gestita da GDScript Hero: fermato.")
        print("Verifico tutte le dipendenze di ENTRAMBE le VCN prima di modificare alcunche...", flush=True)
        plans = [check_unused(oci, net, comp_ids, v) for v in vcns]
        archive = snapshot(oci, vcns, plans)
        print("Copia locale delle configurazioni: " + str(archive), flush=True)
        if not args.apply:
            print("PRECHECK RIUSCITO (sola lettura). Per eliminare usare --apply.")
            return 0
        for v, p in zip(vcns, plans):
            remove_one(oci, net, v, p)
        # Verify against current inventory, not just API delete responses.
        remaining = {v.id for cid in comp_ids for v in active(full(oci, net.list_vcns, cid))}
        demand(not (remaining & {v.id for v in vcns}), "Verifica finale: VCN ancora presenti.")
        print("SUCCESSO: ENTRAMBE LE VCN SONO STATE ELIMINATE. Nessuna risorsa OCI creata.")
        return 0
    except Stop as exc:
        print("STOP: " + str(exc), flush=True)
    except Exception as exc:
        print("STOP: " + type(exc).__name__ + " (HTTP " + str(getattr(exc, "status", "?")) + ")", flush=True)
        print("Se una cancellazione era gia cominciata, verificare lo stato prima di rieseguire.")
    return 1


if __name__ == "__main__":
    sys.exit(run())
