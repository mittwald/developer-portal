---
title: Manage Your SSH Keys
description: Audit and update user SSH keys safely
useCases:
  - identity-002-ssh-key-management
destructive: true
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Audit my mittwald SSH keys and help me add/replace keys safely.

Process:
1) list current keys,
2) flag old/duplicate keys,
3) add my new public key,
4) prepare cleanup actions for obsolete keys.

Do not delete old keys until I confirm successful login with the new key.
```

## What the agent will do automatically {#what-agent-will-do}

- List and classify existing keys.
- Add the provided new key.
- Prepare a safe decommission plan for old keys.

## What you (human) must still do {#what-you-must-do}

- Provide the correct public key.
- Validate login with new key.
- Approve old key removal.

## Verification prompt {#verification-prompt}

```text
List my SSH keys again and confirm the new fingerprint is present and old keys are unchanged unless I approved removal.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
If new-key login fails, keep old keys active and remove only the newly added key by ID.
```
