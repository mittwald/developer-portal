---
title: Automated Backup Monitoring
description: Audit backup coverage and trigger safety backups when needed
useCases:
  - backups-001-setup-backup-schedule
  - backups-002-create-manual-backup
  - backups-003-restore-from-backup
destructive: true
---

This tutorial creates a repeatable backup health workflow for multiple projects.

## Copy-paste prompt {#copy-paste-prompt}

```text
Run a backup health audit across my mittwald projects.

Workflow:
1) List backup schedules and latest backup per project.
2) Flag projects with stale/missing backups.
3) For flagged projects, propose manual backup creation and schedule fixes.
4) Do not execute restore/delete actions unless I explicitly approve.

Return a concise status table with project IDs and backup IDs.
```

## What the agent will do automatically {#what-agent-will-do}

- Enumerate projects, schedules, and recent backup state.
- Highlight stale or missing backup protection.
- Propose immediate mitigations (manual backup + schedule changes).

## What you (human) must still do {#what-you-must-do}

- Approve any write actions.
- Decide retention windows and backup timing.
- Approve or reject any restore action.

## Likely questions the agent will ask and good answers {#likely-questions}

- What retention policy should I enforce? -> `14 days for production, 7 days for staging.`
- Should I trigger manual backups now? -> `Yes for every project flagged as stale.`
- Restore anything now? -> `No restore now, audit only.`

## Verification prompt {#verification-prompt}

```text
Re-check backup schedules and latest backup timestamps for all audited projects.
Return before/after status for any project where changes were made.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
List backup schedules or manual backups created in this session and remove only the temporary/test ones after I confirm IDs.
```

## Resume after failure {#resume-after-failure}

```text
Resume from the first project that has not been audited yet. Do not repeat projects that already have a completed backup status result.
```
