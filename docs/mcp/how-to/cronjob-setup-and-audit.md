---
title: Set Up Cronjobs and Audit Executions
description: Create scheduled tasks and verify execution health
useCases:
  - automation-001-setup-cronjob
  - automation-002-manage-scheduled-tasks
destructive: true
---

## Copy-paste prompt

```text
Set up and audit cronjobs for my mittwald project.

Flow:
1) list current cronjobs and recent execution history,
2) create or adjust the required cronjob schedule,
3) optionally trigger a manual run,
4) report execution health and failure signals.

Ask for approval before creating/updating/triggering jobs.
```

## What the agent will do automatically

- Audit current schedule/execution data.
- Propose corrective scheduling.
- Execute approved changes and report outcomes.

## What you (human) must still do

- Confirm schedule, command, and timeout policy.
- Approve manual triggers in production windows.
- Decide escalation path for failures.

## Verification prompt

```text
Re-list cronjobs and execution history for this project and confirm the approved schedule/trigger outcomes are visible.
```

## Rollback/cleanup prompt

```text
Restore previous cron configuration by reverting the jobs changed in this session.
```
