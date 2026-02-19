---
title: E-commerce Launch Day Preparation
description: Run a launch-readiness check across backups, database, SSL, and app state
useCases:
  - apps-003-install-wordpress
  - backups-001-setup-backup-schedule
  - backups-002-create-manual-backup
  - databases-001-provision-mysql
  - domains-004-ssl-certificate
destructive: true
---

Use this launch checklist when a production storefront needs fast, evidence-based go/no-go validation.

## Copy-paste prompt

```text
Run a mittwald launch readiness audit for my production storefront.

Check:
1) backup schedule and latest backup,
2) database readiness,
3) SSL/certificate status,
4) app/runtime configuration.

Create a fresh pre-launch backup only after I approve.
Return a launch status summary with blockers and resource IDs.
```

## What the agent will do automatically

- Audit backups, DB, SSL, and app runtime state.
- Identify blockers and missing safeguards.
- Propose launch/no-launch recommendation.

## What you (human) must still do

- Approve pre-launch backup creation.
- Decide go/no-go based on blockers.
- Coordinate external dependencies (marketing, DNS cutover windows).

## Likely questions the agent will ask and good answers

- Which project/domain is launch target? -> `Production project <project-id>, domain <domain>.`
- Should I create a manual backup now? -> `Yes, create one now.`
- If SSL issues exist, pause launch? -> `Yes, pause until SSL is green.`

## Verification prompt

```text
Re-check all launch criteria and confirm current status for backup freshness, DB readiness, SSL validity, and app runtime.
Show any remaining blockers with IDs.
```

## Rollback/cleanup prompt

```text
If launch changes were applied and need reversal, restore the pre-launch state using the latest approved backup and list all affected resources.
```

## Resume after failure

```text
Resume launch readiness from the first incomplete validation step and keep completed checks as final.
```
