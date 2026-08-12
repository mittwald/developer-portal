---
title: Client Onboarding Automation
description: Provision project, domain, mail, and SSL from one guided prompt
useCases:
  - project-001-create-project
  - domains-001-setup-email-forwarding
  - domains-002-configure-dns
  - domains-003-setup-mailbox
  - domains-004-ssl-certificate
destructive: true
---

This tutorial turns new-client setup into a single human-intent workflow with explicit approvals.

## Copy-paste prompt {#copy-paste-prompt}

```text
Onboard a new client on mittwald.

Required outcomes:
1) create project,
2) configure domain and DNS,
3) set up required mailbox/forwarding,
4) request SSL certificate,
5) return a final readiness summary with all created IDs.

Ask me for approval before each write step.
```

## What the agent will do automatically {#what-agent-will-do}

- Discover org/project context.
- Plan the dependency order (project -> domain/DNS -> mail -> SSL).
- Execute approved writes and track resource IDs.
- Return a completion summary.

## What you (human) must still do {#what-you-must-do}

- Provide domain and mailbox requirements.
- Approve writes.
- Validate ownership/registrar prerequisites where needed.

## Likely questions the agent will ask and good answers {#likely-questions}

- What project name should I use? -> `Use <client-name>-website.`
- Which domain is primary? -> `Use <domain> as primary and include www.`
- Which mailbox pattern is required? -> `Create info@ and forward contact@ to our support inbox.`

## Verification prompt {#verification-prompt}

```text
Verify the onboarding result by listing project, domain/DNS, mailbox/forwarding, and certificate state for this client.
Return all relevant IDs.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
List resources created in this onboarding run and remove only those resources after I confirm each ID.
```

## Resume after failure {#resume-after-failure}

```text
Resume onboarding from the failed step and keep already-created valid resources; do not recreate successful ones.
```
