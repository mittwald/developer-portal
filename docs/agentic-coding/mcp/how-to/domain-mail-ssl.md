---
title: Configure DNS, Forwarding, Mailbox, and SSL
description: Complete domain and mail setup with certificate validation
useCases:
  - domains-001-setup-email-forwarding
  - domains-002-configure-dns
  - domains-003-setup-mailbox
  - domains-004-ssl-certificate
destructive: true
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Set up domain operations for my mittwald project.

I need:
1) DNS record validation/update,
2) email forwarding and mailbox setup,
3) SSL certificate setup/validation,
4) final operational summary with IDs.

Ask before any write operation.
```

## What the agent will do automatically {#what-agent-will-do}

- Discover domain/mail/certificate state.
- Execute approved DNS/mail/SSL changes.
- Return a complete operational summary.

## What you (human) must still do {#what-you-must-do}

- Confirm authoritative domain and addresses.
- Approve each write.
- Validate external DNS propagation expectations.

## Verification prompt {#verification-prompt}

```text
Re-list DNS records, mail addresses/forwarding, and certificate status for the target domain. Confirm all requested changes are active.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Revert DNS/mail changes created in this session and restore the prior known-good state using the recorded IDs.
```
