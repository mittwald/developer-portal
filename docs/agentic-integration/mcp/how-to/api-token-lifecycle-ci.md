---
title: Manage API Token Lifecycle for CI/CD
description: Create, validate, rotate, and retire mittwald API tokens used by pipelines
useCases:
  - identity-001-manage-api-tokens
destructive: true
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Help me manage mittwald API tokens for CI/CD.

Do this:
1) list existing API tokens,
2) identify stale or over-permissioned tokens,
3) create a new pipeline token with least privilege,
4) provide a rotation plan and retirement list.

Do not delete/revoke tokens until I approve.
```

## What the agent will do automatically {#what-agent-will-do}

- Inventory existing tokens.
- Flag risk (age, scope, inactivity).
- Create an approved replacement token and return metadata.

## What you (human) must still do {#what-you-must-do}

- Store new token in CI secret manager.
- Confirm cutover timing.
- Approve revocation of old token.

## Verification prompt {#verification-prompt}

```text
Re-list API tokens and show which token is active for CI, which one is pending retirement, and whether scope is least-privilege.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
If the new token rollout failed, mark the new token as unused and keep the previous token active until a new cutover window.
```
