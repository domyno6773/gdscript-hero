# Oracle Always Free — ZERO-COST DEPLOYMENT GATE

**Policy for GDScript Hero:** NO paid resources and NO account upgrades. A payment card being on file is not authorization to spend. This document authorizes NO provisioning. If a single check is unknown or ambiguous, **STOP**.

## Preconditions — all must pass before ANY OCI creation

- [ ] The Oracle account clearly displays **Free Tier** or **Always Free** under Billing & Cost Management -> Upgrade and Manage Payment / subscription details. **STOP for Pay As You Go or paid subscriptions**, even if a particular machine has an "Always Free" label.
- [ ] No button or flow labeled **Upgrade**, **Pay As You Go**, **Paid**, **trial-credit resources**, or similar will be accepted. Promotional free credits are **not** the same thing as Always Free.
- [ ] Identify the account **home region** in the Oracle console. Provision ONLY there and verify the VM shows Always Free eligibility.
- [ ] Check **all existing Compute and Boot/Block Volume usage** across compartments and availability domains in the home region. Never assume free resources are unallocated.
- [ ] Proposed starting deployment: **one VM.Standard.A1.Flex, 1 OCPU, 4 GB RAM, one 50 GB boot volume**, using an Always Free eligible OS image. This is below even Oracle's conservative published 1,500 OCPU-hours and 9,000 GB-hours monthly allowance for 2 OCPU/12 GB at Always Free tenancy capacity. Never multiply by additional instances.
- [ ] Check estimated charges/price information **twice**: at the resource shape/volume configuration and the final create/review screen. If anything says an amount other than **0**, or does not clearly establish Always Free eligibility, **STOP**.
- [ ] NO paid upgrades in storage performance, backups, snapshots, networking, public IP add-ons, load balancers, additional volumes, managed databases, paid marketplace images, or paid monitoring. Check each component separately against current Oracle pricing and tenancy limits.
- [ ] Read **Governance & Administration -> Limits, Quotas and Usage** before provisioning. Do NOT assume an empty "Free Tier" badge covers all resources.
- [ ] Never use budget alerts as a hard stop: Oracle explicitly says budgets are **soft limits**, checked periodically. Optional notifications help discover anomalies but do not prevent charges.
- [ ] The GitHub repository, its `server/arena/godot/Dockerfile.oci-arm64`, and all development/test steps may be edited and verified without creating Oracle resources. Do not set public Arena API URL until deployment is verified and operational.

## What we know, what we do NOT know

Oracle's official documentation says the registered payment card is **not charged unless the account is upgraded** to a paid plan. However, we **cannot inspect the user's OCI subscription, home region, existing usage, quotas, card authorizations or final checkout screen** from this GitHub repository. Therefore, **NO absolute guarantee about the user's specific account can be made without checking the OCI console**.

In particular, budget alerts (including a "0 budget") are NOT a zero-spend fail-safe. Any upgrade to paid subscription would violate this project's policy. Avoid creating resources during a time-limited free trial even if they are paid for by promotional credits.

An Always Free VM may be reclaimed for inactivity or become unavailable due to regional capacity; that is an availability risk, NOT a reason to choose paid resources.

## Safe technical preparation performed without OCI billing

`server/arena/godot/Dockerfile.oci-arm64` is a separate **ARM64** build definition for the existing Godot 4.4.1 grader. It fetches the official 4.4.1 ARM64 binary, verifies the release SHA-512 checksum, and runs as uid 65534. It does NOT build or deploy anything automatically. The currently running public website and Supabase configuration are unchanged by this document.

Before deployment: exercise an actual ARM64 build in a disposable **local** environment, audit sandbox isolation, then provision ONLY after the cost gate passes and the user has approved the verified zero-cost configuration.

## Primary Oracle references (verified 2026-10-27)

- Free Tier and no charge without upgrade: https://docs.oracle.com/it-it/iaas/Content/FreeTier/freetier.htm
- Always Free resource shapes/limits and home region: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- Billing details and how to distinguish Trial / Always Free / Pay As You Go: https://docs.oracle.com/en-us/iaas/Content/GSG/Concepts/console_topic-AccountCenter-Billing.htm
- Budgets are soft alerts, not limits: https://docs.oracle.com/en-us/iaas/Content/Billing/Concepts/budgetsoverview.htm
- Godot 4.4.1 official ARM64 distribution: https://github.com/godotengine/godot-builds/releases/tag/4.4.1-stable

## Ponte GitHub OIDC, 27 ottobre 2026

Preparato workflow **esclusivamente per la verifica dell'identità GitHub**: `.github/workflows/oci-oidc-preflight.yml`. Il token GitHub non viene visualizzato e il workflow non interroga Oracle. Per l'attivazione delle autorizzazioni federate OCI seguire `docs/OCI_GITHUB_OIDC_SETUP.md`: il proprietario deve proteggere l'ambiente GitHub e configurare un trust IAM a privilegi minimi. **NON è ancora presente alcun workflow di provisioning. Nessun account cloud è stato toccato.**
