---
title: Backup Restore Incident Recovery
description: Recover service after a failed deployment using backup evidence and controlled restore
useCases:
  - backups-003-restore-from-backup
destructive: true
---

## Incident Trigger

Use this runbook when production is degraded and rollback via backup restore is required.

## Copy-paste prompt

```text
Run a mittwald backup-restore incident workflow for my production project.

Steps:
1) identify latest known-good backup before incident,
2) show restore options and risks,
3) execute restore only after my approval,
4) verify service health after restore,
5) return incident timeline with backup/restore IDs.
```

## What the agent will do automatically

- Collect candidate backups and incident context.
- Recommend safest restore point.
- Execute approved restore.
- Produce post-restore verification report.

## What you (human) must still do

- Approve restore point selection.
- Communicate downtime/status externally.
- Decide follow-up corrective actions.

## Verification prompt

```text
Verify post-restore state: backup used, restore status, app availability indicators, and remaining errors.
```

## Rollback/cleanup prompt

```text
If restore target was wrong, list alternative restore candidates and execute a second restore only after explicit confirmation.
```

## Resume after failure

```text
Resume incident recovery from the failed restore step using previously selected backup candidates.
```
