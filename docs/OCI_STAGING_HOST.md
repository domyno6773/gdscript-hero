# Automatic OCI staging host

The successful federated audit established GitHub-to-OCI authentication and
read access. Provisioning is now implemented in `scripts/oci_cloudshell_bootstrap.py`.
Nothing is created by pushing code, CI, or the default workflow inputs.

## Initial authorization (one Cloud Shell command)

Open Oracle Cloud Shell in **Italy Northwest (Milan)**, check out the reviewed
repository commit, and run:

```bash
python3 scripts/oci_cloudshell_bootstrap.py --authorize-github --free-tier-account
```

This uses the SDK credentials already configured by Oracle inside Cloud Shell.
It never asks for a token, exports administrator credentials, or adds GitHub
secrets. After a native read-only preflight, it creates only:

- the dedicated `gdh-arena-free` compartment;
- `gdh-arena-staging-provision`, a policy for the existing exact domain, immutable
  GitHub repository identity, protected environment, workflow and manual event.

The additional policy allows limited reads for shapes, platform images, limits
and VCN inventory. Mutations are confined to the dedicated compartment and an
explicit operation list for creating the host and its network. It grants no IAM,
subscription, upgrade, delete, resize or arbitrary resource permissions. Existing
objects with different names/tags/configuration are not adopted or overwritten.
The existing inventory policy remains necessary and unchanged.

## Manual GitHub workflow

In `oci-oidc-preflight.yml`, choose:

- `host_action: none` (default): original identity/audit behavior;
- `host_action: plan`: fresh read-only host preflight;
- `host_action: create` plus `free_tier_account: true`: guarded staging creation.

The checkbox attests that the console still shows an unupgraded Free Tier
account; the API script cannot independently certify the account's subscription
status or total bill. The workflow is manual-only. It retains the existing
protected environment named `oci-readonly` to avoid moving credentials or
weakening the validated trust. **After the initial authorization that environment
also has limited create permissions; its historical name is not a security
boundary.** Required reviewers and main-only deployment restrictions must remain.

## Fixed resource plan and runtime guards

- Home region must be Milan, verified again from tenancy region subscriptions.
- A1 only: 1 OCPU, 6 GB RAM; no paid shape/region fallback, no retries on capacity
  errors, no quota increase requests, no subscription API writes.
- Live `Shape.billing_type` must be `ALWAYS_FREE` or `LIMITED_FREE`. For
  `LIMITED_FREE`, the total published A1 envelope is independently enforced.
- Full Compute/boot/block inventory across all compartments and ADs must pass.
  Tenant-level A1 usage from Limits also includes Container Instances. Existing
  plus planned usage must stay within 2 OCPU, 12 GB RAM, 200 GB storage and five
  volume backups. Unknown values stop creation; quota capacity is not free host
  capacity and the latter may still be unavailable.
- A free Canonical Ubuntu 24.04 ARM **platform** image only; no custom or
  Marketplace image. One 50 GB boot volume, explicitly balanced at 10 VPU/GB.
- One dedicated VCN, internet gateway, routing table, security list and subnet.
  No NAT gateway, load balancer, reserved public IP, flow logs, monitoring add-on,
  scheduled backup or extra data volume. An ephemeral public IP permits bootstrap
  downloads; the dedicated subnet uses a security list with **no ingress rules**.
- Preflight is repeated before the first mutation and immediately before VM
  launch. OCI retry tokens and cloud-side discovery prevent a second VM; unknown
  mutation outcomes must be checked, not blindly retried. Partial resources are
  left in place for review, never automatically deleted.

`--free-tier-account`/the workflow checkbox is an operator attestation, not an
automated proof of a zero bill. It must never be selected for a paid account.
Limits are quota checks, not a price quote. The current documented free envelope
and account state must remain valid at execution time. No budget alert is used
as a billing stop.

## What RUNNING means

Cloud-init installs Node.js 22.23.4 (official ARM64 binary with SHA-256 check),
Docker, the source from the immutable workflow commit and the Godot 4.4.1 ARM64
grader (release SHA-512 verified by the Dockerfile). It runs the coordinator unit
tests and a native Docker version smoke, then stages a disabled systemd service.

`RUNNING` confirms only the VM lifecycle. It does not mean cloud-init succeeded.
`/var/lib/gdh-bootstrap-status` distinguishes `BOOTSTRAP_FAILED` from
`RUNTIME_READY_BACKEND_DISABLED`; logs stay in `/var/log/gdh-bootstrap.log` on the
host. Inspect these using an administrator console/OCI run command before
claiming runtime readiness.

Public grading remains disabled: no Supabase service credentials, private test
fixtures, HTTPS endpoint, migrations or public frontend URL are inserted here.
Before activation, configure those privately and run real authenticated staging
tests; the existing `server/arena/README.md` describes the contract. No secret
belongs in OCI instance user-data, public GitHub logs, or frontend files.

## Validation

Offline tests call the **actual OCI SDK** with intercepted transport for every
plan/create operation and explicitly prohibit network I/O. Tests verify quota
and image rejection, no writes for paid shapes, exact IAM scope, fresh checks,
closed ingress and idempotent second apply. CI also builds and executes the
actual grader on a standard ARM64 GitHub-hosted runner, without OCI credentials.

Sources checked 2026-10-28:

- https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm
- https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- https://docs.oracle.com/en-us/iaas/Content/General/service-limits/overview.htm
- https://docs.oracle.com/en-us/iaas/Content/API/Concepts/cloudshellquickstart_python.htm
- https://docs.oracle.com/en-us/iaas/tools/python/latest/api/core/models/oci.core.models.Shape.html
- https://www.ateam-oracle.com/oci-workload-identity-federation-using-ephemeral-rpst
