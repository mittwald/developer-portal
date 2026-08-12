---
title: Review Account Sessions and Security
description: Inspect account details and active sessions for suspicious activity
useCases:
  - identity-003-check-account-settings
destructive: false
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Run a security review for my mittwald account.

I need:
1) account profile summary,
2) active session list,
3) suspicious-session highlights,
4) recommended follow-up actions.

Read-only mode.
```

## What the agent will do automatically {#what-agent-will-do}

- Fetch account details.
- Retrieve active sessions.
- Flag unusual locations/devices/timestamps.

## What you (human) must still do {#what-you-must-do}

- Confirm whether suspicious sessions are legitimate.
- Decide whether to revoke sessions in a follow-up action.

## Verification prompt {#verification-prompt}

```text
Re-run account and session checks and confirm findings are reproducible, with session IDs included.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
No rollback needed for read-only review. If any session was revoked accidentally, list impacted sessions and required re-login steps.
```
