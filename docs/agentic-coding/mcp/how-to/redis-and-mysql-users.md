---
title: Set Up Redis and Manage MySQL Users
description: Add cache services and least-privilege database users
useCases:
  - databases-003-setup-redis-cache
  - databases-004-manage-users
destructive: true
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Set up Redis caching and a least-privilege MySQL user for my mittwald project.

Steps:
1) inspect existing Redis/MySQL resources,
2) create missing Redis instance if needed,
3) create read-only MySQL user for reporting,
4) return connection details and security notes.

Ask before creating users/resources.
```

## What the agent will do automatically {#what-agent-will-do}

- Audit existing Redis/MySQL setup.
- Create approved resources.
- Return relevant IDs and connection metadata.

## What you (human) must still do {#what-you-must-do}

- Approve resource/user creation.
- Place credentials into secret manager.
- Validate app/plugin integration.

## Verification prompt {#verification-prompt}

```text
Re-list Redis instances and MySQL users for this project and confirm the new resources exist with intended permissions.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Delete only the Redis/MySQL user resources created in this session and confirm they are no longer active.
```
