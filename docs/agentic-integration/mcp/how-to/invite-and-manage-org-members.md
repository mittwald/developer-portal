---
title: Invite and Manage Organization Members
description: Add team members and audit organization access
useCases:
  - organization-001-invite-team-member
  - organization-002-manage-memberships
destructive: true
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Help me manage mittwald organization memberships.

Workflow:
1) list current members and pending invites,
2) invite the specified new member,
3) show role/access posture after invite,
4) flag risky access patterns.

Do not modify existing memberships beyond sending the invite unless I approve.
```

## What the agent will do automatically {#what-agent-will-do}

- Enumerate memberships and invites.
- Create invite after approval.
- Summarize post-change access state.

## What you (human) must still do {#what-you-must-do}

- Confirm invited email and role.
- Approve any additional membership changes.

## Verification prompt {#verification-prompt}

```text
Re-list members and pending invites and confirm the invited user appears with the intended role state.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Cancel the invite(s) created in this session if needed and return the final invite/membership status.
```
