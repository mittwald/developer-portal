---
title: Run the Application Lifecycle
description: Deploy, update, install CMS, and migrate apps with agent-led execution
useCases:
  - apps-001-deploy-php-app
  - apps-002-update-nodejs-version
  - apps-003-install-wordpress
  - apps-004-migrate-application
destructive: true
---

## Copy-paste prompt

```text
Manage my mittwald application lifecycle end-to-end.

I need:
1) app inventory,
2) deploy/install/update/migrate plan,
3) execution with approvals at risky steps,
4) final state summary with app and dependency IDs.

Start read-only, then request approval before writes.
```

## What the agent will do automatically

- Inventory project/app runtime state.
- Select the right lifecycle action path.
- Execute approved lifecycle steps and summarize outcomes.

## What you (human) must still do

- Approve production-impacting changes.
- Provide migration direction (source/destination).
- Validate app-level smoke checks after rollout.

## Verification prompt

```text
Re-list affected apps and verify lifecycle outcomes (deploy/update/install/migrate) including status and IDs.
```

## Rollback/cleanup prompt

```text
Rollback the last lifecycle change for affected apps and report restored state and remaining risks.
```
