---
title: Database Performance Optimization
description: Review MySQL and Redis readiness before traffic spikes
useCases:
  - databases-001-provision-mysql
  - databases-003-setup-redis-cache
  - databases-004-manage-users
  - apps-002-update-nodejs-version
destructive: false
---

This tutorial is a read-first performance review for commerce and high-traffic workloads.

:::note[Additional MCP servers may be required]

The mittwald MCP server provides database inventory, configuration, and user management capabilities. For direct query inspection, performance metrics, and slow query analysis, you will need additional MCP servers that can connect directly to your MySQL or Redis instances (for example, a MySQL MCP server with access to your database credentials).

Always use a dedicated, least-privilege database user (read-only where possible) for these MCP servers and provide credentials via a secure secret mechanism (for example environment variables or your secret manager), never by pasting them into prompts, configuration files, or logs.
:::

## Copy-paste prompt {#copy-paste-prompt}

```text
Run a mittwald database performance readiness review for my production project.

Tasks:
1) List MySQL and Redis instances.
2) Inspect configuration and capacity signals.
3) Flag likely bottlenecks and missing cache coverage.
4) Recommend prioritized actions for this week.

Read-only only. No writes.
```

## What the agent will do automatically {#what-agent-will-do}

- Gather current MySQL/Redis inventory and config.
- Analyze capacity and cache readiness signals.
- Prioritize likely risk areas.

## What you (human) must still do {#what-you-must-do}

- Choose which recommendations to execute.
- Schedule maintenance windows for changes.
- Provide business-side performance thresholds.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which project/database is critical? -> `Production project <project-id>.`
- What is acceptable latency? -> `Keep checkout DB queries under 200ms p95.`
- Can I apply changes now? -> `No, recommendations only.`

## Verification prompt {#verification-prompt}

```text
Re-run the same readiness checks and confirm no data gaps in the audit.
Return the list of inspected database IDs and the top 3 risks.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
No rollback needed for read-only audit. If any write action happened accidentally, list affected resource IDs and propose reversal steps.
```

## Resume after failure {#resume-after-failure}

```text
Resume the readiness audit from the first database that does not yet have findings.
```
