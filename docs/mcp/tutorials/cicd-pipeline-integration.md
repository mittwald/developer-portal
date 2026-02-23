---
title: CI/CD Pipeline Integration
description: Connect deployment automation, cron execution checks, and safe release validation
useCases:
  - automation-001-setup-cronjob
  - automation-002-manage-scheduled-tasks
  - containers-003-deploy-docker-stack
destructive: true
---

This tutorial aligns automated deployment workflows with mittwald runtime checks.

## Copy-paste prompt {#copy-paste-prompt}

```text
Prepare and validate CI/CD operations for my mittwald production project.

Steps:
1) List existing cronjobs and recent execution results.
2) Verify deployment-related scheduled tasks.
3) Propose missing monitoring/cleanup cronjobs.
4) Validate the current stack deployment status.

Do read-only analysis first. Ask for explicit approval before creating/updating cronjobs or triggering manual executions.
```

## What the agent will do automatically {#what-agent-will-do}

- Audit cron inventory and execution history.
- Detect failing or missing scheduled jobs.
- Check deployment/stack health signals.
- Provide an action-ready change list.

## What you (human) must still do {#what-you-must-do}

- Approve any new/updated cronjobs.
- Confirm maintenance windows for disruptive steps.
- Decide release go/no-go.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which project/environment is in scope? -> `Use production project <project-id>.`
- Should failed jobs be retried now? -> `Retry once and report result.`
- Should I add a nightly health check cronjob? -> `Yes, 03:00 local time.`

## Verification prompt {#verification-prompt}

```text
Re-list cronjobs and execution history for the updated project and confirm each approved change is present.
Return cronjob IDs and last execution statuses.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Undo the cronjob changes created in this session (by ID) and restore the previous schedule configuration.
```

## Resume after failure {#resume-after-failure}

```text
Resume from the last incomplete CI/CD validation step and keep prior successful checks as completed.
```
