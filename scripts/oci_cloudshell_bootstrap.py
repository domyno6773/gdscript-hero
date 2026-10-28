#!/usr/bin/env python3
"""Create the fixed GDScript Hero staging host from OCI Cloud Shell.

Default is read-only planning. --apply requires explicit Free Tier attestation.
Never upgrades subscriptions, buys capacity, changes IAM, or launches another
shape/region. Authentication stays inside Oracle Cloud Shell.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import ipaddress
import json
import math
import os
import re
import subprocess
import sys
import uuid
from pathlib import Path

from oci_audit_readonly import inventory_oci

REGION = "eu-milan-1"
SHAPE = "VM.Standard.A1.Flex"
NAME = "gdh-arena-free"
TAGS = {"gdh-managed": "arena-staging-v1"}
OCPUS, RAM_GB, DISK_GB = 1, 6, 50
VCN_CIDR, SUBNET_CIDR = "10.77.0.0/16", "10.77.1.0/24"


class GuardError(Exception):
    """Static, non-secret diagnostics."""


def require(condition, message):
    if not condition:
        raise GuardError(message)


def number(value):
    require(type(value) in (int, float) and math.isfinite(value) and value >= 0,
            "Quota sconosciuta: nessuna creazione.")
    return value


def pages(sdk, method, *args, **kwargs):
    return sdk.pagination.list_call_get_all_results(method, *args, **kwargs).data


def live(items):
    return [x for x in items if getattr(x, "lifecycle_state", "") not in ("DELETED", "TERMINATED")]


def named(items, name, field="display_name"):
    found = [x for x in live(items) if getattr(x, field, None) == name]
    require(len(found) <= 1, "Nome duplicato: verifica le risorse prima di riprovare.")
    if not found:
        return None
    row = found[0]
    require(all((getattr(row, "freeform_tags", None) or {}).get(k) == v for k, v in TAGS.items()),
            "Risorsa omonima non gestita da questo script: nessuna modifica.")
    return row


def budget(summary, core_used, memory_used, extra_cpu=OCPUS, extra_ram=RAM_GB, extra_disk=DISK_GB):
    require(summary.unknown == 0 and summary.other_instances == 0,
            "Inventario incompleto o forme diverse: nessuna creazione.")
    require(summary.a1_ocpus + extra_cpu <= 2 and summary.a1_ram + extra_ram <= 12,
            "La VM supererebbe il limite guida Always Free A1.")
    # Limits usage also includes A1 Container Instances, absent from Compute lists.
    require(number(core_used) + extra_cpu <= 2 and number(memory_used) + extra_ram <= 12,
            "Consumo A1 complessivo superiore al limite gratuito.")
    require(summary.e2_micro <= 2 and summary.storage_gb + extra_disk <= 200 and summary.backups <= 5,
            "Spazio o backup oltre il limite guida gratuito.")


def validate_image(image, tenancy):
    require(image.compartment_id is None and image.operating_system == "Canonical Ubuntu"
            and image.operating_system_version == "24.04"
            and image.display_name.startswith("Canonical-Ubuntu-24.04-aarch64-")
            and image.lifecycle_state == "AVAILABLE",
            "Immagine diversa dalla piattaforma Ubuntu ARM gratuita: fermato.")
    require(number(image.size_in_mbs) <= DISK_GB * 1024,
            "L'immagine richiede un disco piu grande del previsto.")


def inspect(sdk, config, signer=None):
    require(config.get("region") == REGION, "Seleziona Milano nella console e riapri Cloud Shell.")
    tenancy = config["tenancy"]
    require(bool(re.fullmatch(r"ocid1\.tenancy\.oc1\.[a-z0-9.]+", tenancy)), "Tenancy non valida.")
    auth = {"signer": signer} if signer else {}
    identity = sdk.identity.IdentityClient(config, **auth)
    compute = sdk.core.ComputeClient(config, **auth)
    network = sdk.core.VirtualNetworkClient(config, **auth)
    limits = sdk.limits.LimitsClient(config, **auth)
    summary = inventory_oci(sdk, config, signer=signer)
    compartments = pages(sdk, identity.list_compartments, tenancy,
                         compartment_id_in_subtree=True, access_level="ANY")
    dedicated = named(compartments, NAME, "name")
    if dedicated:
        require(dedicated.compartment_id == tenancy and dedicated.lifecycle_state == "ACTIVE",
                "Compartment dedicato non conforme o ancora in preparazione.")
    target = dedicated.id if dedicated else tenancy
    existing = named(pages(sdk, compute.list_instances, target), NAME) if dedicated else None
    if existing:
        require(existing.shape == SHAPE and existing.shape_config.ocpus == OCPUS
                and existing.shape_config.memory_in_gbs == RAM_GB,
                "VM esistente diversa dal piano: nessun ridimensionamento automatico.")
        require(existing.lifecycle_state == "RUNNING", "VM gia presente ma non RUNNING: nessun duplicato creato.")
    ads = pages(sdk, identity.list_availability_domains, tenancy)
    require(bool(ads), "Availability domain assenti.")
    core_used = memory_used = 0
    candidates = []
    for ad in ads:
        cpu = limits.get_resource_availability("compute", "standard-a1-core-count", target,
                                              availability_domain=ad.name).data
        ram = limits.get_resource_availability("compute", "standard-a1-memory-count", target,
                                              availability_domain=ad.name).data
        # Tenancy totals are checked separately when a child compartment exists.
        root_cpu = cpu if target == tenancy else limits.get_resource_availability(
            "compute", "standard-a1-core-count", tenancy, availability_domain=ad.name).data
        root_ram = ram if target == tenancy else limits.get_resource_availability(
            "compute", "standard-a1-memory-count", tenancy, availability_domain=ad.name).data
        core_used += number(root_cpu.used)
        memory_used += number(root_ram.used)
        shapes = pages(sdk, compute.list_shapes, target, availability_domain=ad.name)
        a1 = [x for x in shapes if x.shape == SHAPE]
        if (len(a1) == 1 and a1[0].billing_type in ("ALWAYS_FREE", "LIMITED_FREE")
                and number(cpu.available) >= OCPUS and number(ram.available) >= RAM_GB):
            candidates.append(ad.name)
    budget(summary, core_used, memory_used, 0 if existing else OCPUS,
           0 if existing else RAM_GB, 0 if existing else DISK_GB)
    require(bool(candidates) or existing is not None,
            "Nessuna A1 gratuita con quota sufficiente: nessun fallback a pagamento.")
    images = pages(sdk, compute.list_images, tenancy, operating_system="Canonical Ubuntu",
                   operating_system_version="24.04", shape=SHAPE,
                   sort_by="TIMECREATED", sort_order="DESC")
    platform = [x for x in images if x.compartment_id is None
                and x.display_name.startswith("Canonical-Ubuntu-24.04-aarch64-")
                and x.lifecycle_state == "AVAILABLE"]
    require(bool(platform), "Immagine Ubuntu ARM di piattaforma non trovata.")
    image = platform[0]
    validate_image(image, tenancy)
    all_vcns = []
    for cid in [tenancy] + [x.id for x in compartments if x.lifecycle_state == "ACTIVE"]:
        all_vcns.extend(live(pages(sdk, network.list_vcns, cid)))
    managed_vcn = named([v for v in all_vcns if v.compartment_id == target], NAME) if dedicated else None
    require(len(all_vcns) + (0 if managed_vcn else 1) <= 2, "Limite Free Tier di due VCN raggiunto.")
    for vcn in all_vcns:
        if managed_vcn and vcn.id == managed_vcn.id:
            continue
        for cidr in vcn.cidr_blocks or [vcn.cidr_block]:
            require(not ipaddress.ip_network(cidr).overlaps(ipaddress.ip_network(VCN_CIDR)),
                    "CIDR gia in uso: nessuna modifica alla rete esistente.")
    return dict(identity=identity, compute=compute, network=network,
                tenancy=tenancy, compartment=dedicated, existing=existing,
                image=image, ad=existing.availability_domain if existing else candidates[0])


def retry_token(compartment, role):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, compartment + "/gdh-arena-staging-v1/" + role))


def ensure(sdk, client, rows, name, create_method, details, check):
    row = named(rows, name)
    if row:
        require(row.lifecycle_state == "AVAILABLE", "Risorsa ancora in preparazione: attendere, nessun duplicato.")
        check(row)
        return row
    row = create_method(details, opc_retry_token=retry_token(details.compartment_id, name),
                        retry_strategy=sdk.retry.NoneRetryStrategy()).data
    # Always refresh via the SDK waiter, including asynchronous VCN/subnet creation.
    getters = {"Vcn": client.get_vcn, "InternetGateway": client.get_internet_gateway,
               "RouteTable": client.get_route_table, "SecurityList": client.get_security_list,
               "Subnet": client.get_subnet}
    getter = getters[type(row).__name__]
    row = sdk.wait_until(client, getter(row.id), "lifecycle_state", "AVAILABLE",
                         max_wait_seconds=120).data
    check(row)
    return row


def cloud_init(repo_commit, bootstrap):
    require(bool(re.fullmatch(r"[0-9a-f]{40}", repo_commit)), "Serve un commit immutabile.")
    require("__GDH_REPO_COMMIT__" in bootstrap, "Template bootstrap non valido.")
    return base64.b64encode(bootstrap.replace("__GDH_REPO_COMMIT__", repo_commit).encode()).decode()


def apply(sdk, config, state, repo_commit, bootstrap, account_confirmed=False, signer=None):
    require(account_confirmed is True,
            "Creazione bloccata: devi confermare che l'account sia ancora Free Tier senza upgrade.")
    # Fresh full preflight immediately before the first write. Never trust a saved plan.
    state = inspect(sdk, config, signer=signer)
    if state["existing"]:
        print("VM GDScript Hero gia RUNNING: nessuna seconda VM creata.")
        return state["existing"]
    m = sdk.core.models
    identity, network, compute = state["identity"], state["network"], state["compute"]
    compartment = state["compartment"]
    if not compartment:
        require(signer is None, "Autorizzazione iniziale Cloud Shell mancante: nessuna creazione IAM da GitHub.")
        compartment = identity.create_compartment(sdk.identity.models.CreateCompartmentDetails(
            compartment_id=state["tenancy"], name=NAME,
            description="GDScript Hero staging, Always Free only", freeform_tags=TAGS),
            opc_retry_token=retry_token(state["tenancy"], "compartment"),
            retry_strategy=sdk.retry.NoneRetryStrategy()).data
        compartment = sdk.wait_until(identity, identity.get_compartment(compartment.id),
                                      "lifecycle_state", "ACTIVE", max_wait_seconds=120).data
        # Compartment quotas may be more restrictive than the parent; validate again.
        state = inspect(sdk, config, signer=signer)
        require(state["compartment"] is not None and state["compartment"].id == compartment.id,
                "Compartment non ancora propagato: attendi prima di riprovare.")
    cid = compartment.id
    def same(condition):
        require(condition, "Risorsa gestita modificata: nessuna sovrascrittura automatica.")
    vcn = ensure(sdk, network, pages(sdk, network.list_vcns, cid), NAME, network.create_vcn,
        m.CreateVcnDetails(compartment_id=cid, cidr_blocks=[VCN_CIDR], display_name=NAME, freeform_tags=TAGS),
        lambda r: same((r.cidr_blocks or [r.cidr_block]) == [VCN_CIDR]))
    igw = ensure(sdk, network, pages(sdk, network.list_internet_gateways, cid, vcn_id=vcn.id), NAME + "-igw",
        network.create_internet_gateway, m.CreateInternetGatewayDetails(compartment_id=cid,
            vcn_id=vcn.id, is_enabled=True, display_name=NAME + "-igw", freeform_tags=TAGS),
        lambda r: same(r.vcn_id == vcn.id and r.is_enabled is True))
    route_rules = [m.RouteRule(destination="0.0.0.0/0", destination_type="CIDR_BLOCK", network_entity_id=igw.id)]
    route = ensure(sdk, network, pages(sdk, network.list_route_tables, cid, vcn_id=vcn.id), NAME + "-routes",
        network.create_route_table, m.CreateRouteTableDetails(compartment_id=cid, vcn_id=vcn.id,
            route_rules=route_rules, display_name=NAME + "-routes", freeform_tags=TAGS),
        lambda r: same([(x.destination, x.destination_type, x.network_entity_id) for x in r.route_rules]
                       == [("0.0.0.0/0", "CIDR_BLOCK", igw.id)]))
    # No incoming ports, including SSH. Only outbound package downloads and DNS.
    egress = [m.EgressSecurityRule(destination="0.0.0.0/0", destination_type="CIDR_BLOCK", protocol="6", is_stateless=False,
              tcp_options=m.TcpOptions(destination_port_range=m.PortRange(min=p, max=p))) for p in (80, 443)]
    egress += [m.EgressSecurityRule(destination="169.254.169.254/32", destination_type="CIDR_BLOCK", protocol=proto, is_stateless=False,
               **{options: klass(destination_port_range=m.PortRange(min=53, max=53))})
               for proto, options, klass in (("6", "tcp_options", m.TcpOptions), ("17", "udp_options", m.UdpOptions))]
    security = ensure(sdk, network, pages(sdk, network.list_security_lists, cid, vcn_id=vcn.id), NAME + "-closed",
        network.create_security_list, m.CreateSecurityListDetails(compartment_id=cid, vcn_id=vcn.id,
            ingress_security_rules=[], egress_security_rules=egress, display_name=NAME + "-closed", freeform_tags=TAGS),
        lambda r: same(r.ingress_security_rules == [] and canonical_egress(r.egress_security_rules) == canonical_egress(egress)))
    subnet = ensure(sdk, network, pages(sdk, network.list_subnets, cid, vcn_id=vcn.id), NAME + "-subnet",
        network.create_subnet, m.CreateSubnetDetails(compartment_id=cid, vcn_id=vcn.id, cidr_block=SUBNET_CIDR,
            route_table_id=route.id, security_list_ids=[security.id], prohibit_public_ip_on_vnic=False,
            display_name=NAME + "-subnet", freeform_tags=TAGS),
        lambda r: same(r.cidr_block == SUBNET_CIDR and r.route_table_id == route.id
                       and r.security_list_ids == [security.id] and r.prohibit_public_ip_on_vnic is False))
    # Recheck live tenancy consumption after network setup, immediately before launch.
    state = inspect(sdk, config, signer=signer)
    require(state["existing"] is None, "Una VM e comparsa durante il piano: nessun duplicato creato.")
    launch = m.LaunchInstanceDetails(compartment_id=cid, availability_domain=state["ad"],
        display_name=NAME, shape=SHAPE, shape_config=m.LaunchInstanceShapeConfigDetails(ocpus=OCPUS, memory_in_gbs=RAM_GB),
        source_details=m.InstanceSourceViaImageDetails(image_id=state["image"].id,
            boot_volume_size_in_gbs=DISK_GB, boot_volume_vpus_per_gb=10),
        create_vnic_details=m.CreateVnicDetails(subnet_id=subnet.id, assign_public_ip=True),
        metadata={"user_data": cloud_init(repo_commit, bootstrap)}, freeform_tags=TAGS,
        instance_options=m.InstanceOptions(are_legacy_imds_endpoints_disabled=True))
    print("Avvio della sola A1 prevista: 1 OCPU, 6 GB RAM, 50 GB. Nessun fallback.")
    instance = compute.launch_instance(launch, opc_retry_token=retry_token(cid, "instance"),
                                       retry_strategy=sdk.retry.NoneRetryStrategy()).data
    instance = sdk.wait_until(compute, compute.get_instance(instance.id), "lifecycle_state", "RUNNING",
                             max_wait_seconds=600).data
    print("VM RUNNING. Bootstrap in esecuzione; nessuna porta pubblica aperta.")
    print("Il backend resta in staging: mancano credenziali private, HTTPS e verifica end-to-end.")
    return instance


def canonical_egress(rules):
    def entry(r):
        ports = r.tcp_options or r.udp_options
        port = ports.destination_port_range if ports else None
        return (r.destination, r.destination_type, r.protocol, r.is_stateless,
                port.min if port else None, port.max if port else None)
    return sorted(entry(r) for r in rules)


def github_policy(domain, compartment):
    from oci_trust_setup import SUBJECT, WORKFLOW
    require(bool(re.fullmatch(r"ocid1\.domain\.oc1\.[a-z0-9.]+", domain)), "Dominio non valido.")
    require(bool(re.fullmatch(r"ocid1\.compartment\.oc1\.[a-z0-9.]+", compartment)), "Compartment non valido.")
    common = ("request.principal.type='identityfederateddomainapp', request.principal.domain.id='" + domain
              + "', request.principal.name='" + SUBJECT
              + "', request.principal.ext_repository='domyno6773/gdscript-hero', request.principal.ext_workflow_ref='"
              + WORKFLOW + "', request.principal.ext_event_name='workflow_dispatch'")
    grants = [
        ("read instances", "tenancy", ["ListShapes"]),
        ("read instance-images", "tenancy", ["ListImages", "GetImage", "LaunchInstance"]),
        ("read resource-availability", "tenancy", ["GetResourceAvailability"]),
        ("inspect vcns", "tenancy", ["ListVcns"]),
        ("manage instances", "compartment id " + compartment, ["LaunchInstance", "GetInstance", "ListInstances"]),
        ("manage volume-family", "compartment id " + compartment, ["LaunchInstance"]),
        ("manage virtual-network-family", "compartment id " + compartment,
         ["CreateVcn", "GetVcn", "ListVcns", "CreateInternetGateway", "GetInternetGateway", "ListInternetGateways",
          "CreateRouteTable", "GetRouteTable", "ListRouteTables", "CreateSecurityList", "GetSecurityList", "ListSecurityLists",
          "CreateSubnet", "GetSubnet", "ListSubnets", "LaunchInstance"]),
    ]
    return ["Allow any-user to " + grant + " in " + scope + " where all {" + common + ", any {"
            + ", ".join("request.operation='" + op + "'" for op in ops) + "}}"
            for grant, scope, ops in grants]


def authorize_github(sdk, config, state):
    """Native Cloud Shell admin session only: create dedicated scope and policy."""
    identity, tenancy = state["identity"], state["tenancy"]
    domains = pages(sdk, identity.list_domains, tenancy)
    default = [d for d in domains if d.display_name == "Default" and d.lifecycle_state == "ACTIVE"]
    require(len(default) == 1, "Dominio Default non identificato in modo univoco.")
    domain = default[0].id
    compartment = state["compartment"]
    if not compartment:
        compartment = identity.create_compartment(sdk.identity.models.CreateCompartmentDetails(
            compartment_id=tenancy, name=NAME, description="GDScript Hero staging, Always Free only", freeform_tags=TAGS),
            opc_retry_token=retry_token(tenancy, "compartment"), retry_strategy=sdk.retry.NoneRetryStrategy()).data
        compartment = sdk.wait_until(identity, identity.get_compartment(compartment.id),
                                     "lifecycle_state", "ACTIVE", max_wait_seconds=120).data
    statements = github_policy(domain, compartment.id)
    policies = [p for p in live(pages(sdk, identity.list_policies, tenancy)) if p.name == "gdh-arena-staging-provision"]
    require(len(policies) <= 1, "Policy omonime duplicate: fermato.")
    if policies:
        saved = identity.get_policy(policies[0].id).data
        require(saved.statements == statements and saved.freeform_tags == TAGS,
                "Policy gia presente con contenuto diverso: nessuna sovrascrittura.")
    else:
        saved = identity.create_policy(sdk.identity.models.CreatePolicyDetails(compartment_id=tenancy,
            name="gdh-arena-staging-provision", description="Exact GitHub workflow, staging compartment, create-only operations",
            statements=statements, freeform_tags=TAGS), opc_retry_token=retry_token(tenancy, "github-policy"),
            retry_strategy=sdk.retry.NoneRetryStrategy()).data
        saved = identity.get_policy(saved.id).data
        require(saved.statements == statements, "Policy non confermata dopo creazione.")
    print("AUTORIZZAZIONE GITHUB PRONTA. Nessuna VM creata e nessun secret aggiuntivo.")
    print("Il workflow manuale puo creare solo nel compartment dedicato; nessun upgrade o permesso IAM.")


def federated_config():
    import oci
    import oci_federated_readonly as fed
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import rsa
    origin = fed.config_from_env(os.environ)
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public = key.public_key().public_bytes(serialization.Encoding.PEM,
                serialization.PublicFormat.SubjectPublicKeyInfo).decode("ascii")
    rpst = fed.exchange(origin, os.environ, fed.github_token(os.environ), public)
    return ({"tenancy": os.environ["OCI_FED_TENANCY"], "region": os.environ["OCI_FED_REGION"]},
            oci.auth.signers.SecurityTokenSigner(rpst, key))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--authorize-github", action="store_true")
    mode.add_argument("--github", action="store_true")
    parser.add_argument("--free-tier-account", action="store_true",
                        help="Conferma account Free Tier senza upgrade, come nella console")
    args = parser.parse_args(argv)
    try:
        action = os.environ.get("GDH_HOST_ACTION", "none") if args.github else ("create" if args.apply else "plan")
        require(action in ("plan", "create"), "Azione host non valida.")
        account_confirmed = os.environ.get("GDH_FREE_TIER_ACCOUNT") == "true" if args.github else args.free_tier_account
        require((action != "create" and not args.authorize_github) or account_confirmed,
                "Per creare serve confermare l'account Free Tier; nessuna chiamata eseguita.")
        import oci
        config, signer = federated_config() if args.github else (oci.config.from_file(), None)
        state = inspect(oci, config, signer=signer)
        print("Piano: Milano; Ubuntu ARM; A1 1 OCPU / 6 GB RAM; boot 50 GB / 10 VPU.")
        print("Rete dedicata; nessuna porta in ingresso; niente NAT, load balancer o Marketplace.")
        if args.authorize_github:
            authorize_github(oci, config, state)
            return 0
        if action != "create":
            print("Solo piano: nessuna risorsa creata.")
            return 0
        root = Path(__file__).resolve().parents[1]
        commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=root, check=True,
                                capture_output=True, text=True).stdout.strip()
        bootstrap = (root / "server/arena/oci/bootstrap.sh").read_text()
        apply(oci, config, state, commit, bootstrap, account_confirmed, signer=signer)
        return 0
    except GuardError as exc:
        print("STOP: " + str(exc))
    except Exception as exc:
        print("STOP; categoria: " + type(exc).__name__)
        status = getattr(exc, "status", None)
        if type(status) is int:
            print("Stato HTTP: " + str(status))
        operation = getattr(exc, "operation_name", "")
        if operation in ("list_shapes", "list_images", "get_resource_availability", "list_vcns", "list_domains",
                         "create_compartment", "create_policy", "create_vcn", "create_subnet", "launch_instance", "get_instance"):
            print("Operazione: " + operation)
        print("Nessun retry o alternativa a pagamento. Non ripetere se l'esito della creazione e incerto.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
