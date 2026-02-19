---
title: Bootstrap a Project with SSH and Environment Checks
description: Establish baseline project readiness for deployment work
useCases:
  - project-001-create-project
  - project-002-configure-ssh
  - project-003-manage-environment
destructive: true
---

## Copy-paste prompt

```text
Bootstrap a mittwald project for development and deployment.

Tasks:
1) create or select target project,
2) verify SSH user/access readiness,
3) validate environment/config basics,
4) return a bootstrap checklist with IDs and blockers.

Ask before creating users or changing configuration.
```

## What the agent will do automatically

- Discover project/server context.
- Validate SSH and environment prerequisites.
- Execute approved setup actions.

## What you (human) must still do

- Provide project naming/business context.
- Provide public keys or secret values.
- Approve user/config writes.

## Verification prompt

```text
Re-check project bootstrap status: project metadata, SSH readiness, and environment checks. Return pass/fail per item.
```

## Rollback/cleanup prompt

```text
Remove bootstrap artifacts created in this session (users/config entries) if setup should be undone.
```
