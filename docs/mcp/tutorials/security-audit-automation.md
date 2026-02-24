---
title: Security Audit Automation
description: Build a compliance snapshot for tokens, keys, certificates, and sessions
useCases:
  - identity-001-manage-api-tokens
  - identity-002-ssh-key-management
  - identity-003-check-account-settings
  - organization-002-manage-memberships
destructive: false
---

This tutorial runs a read-first security evidence pass for compliance and operational reviews.

## Copy-paste prompt {#copy-paste-prompt}

```text
Run a mittwald security audit snapshot for my account and organization.

Include:
1) API token inventory,
2) SSH key inventory,
3) active sessions,
4) organization membership overview,
5) certificate expiration risks.

Read-only only. Return findings with severity and resource IDs.
```

## What the agent will do automatically {#what-agent-will-do}

- Collect token/key/session/membership/certificate data.
- Highlight stale or risky items.
- Produce a severity-ranked report.

## What you (human) must still do {#what-you-must-do}

- Decide remediation priorities.
- Approve any revocation/removal follow-up work.
- Store evidence in your compliance system.

## Likely questions the agent will ask and good answers {#likely-questions}

- What time range for session review? -> `Last 30 days.`
- Should unknown sessions be revoked now? -> `No, report-only for this pass.`
- Which org is in scope? -> `Use organization <org-id>.`

## Verification prompt {#verification-prompt}

```text
Re-run the same audit queries and confirm the final report includes all token, key, session, membership, and certificate IDs.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
No rollback is required for read-only auditing. If any write action occurred by mistake, list affected IDs and propose corrective steps.
```

## Resume after failure {#resume-after-failure}

```text
Resume the audit from the first incomplete security category and preserve completed categories.
```
