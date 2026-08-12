---
title: Sicherheitsaudit-Automatisierung
description: Compliance-Snapshot für Tokens, Keys, Zertifikate und Sitzungen erstellen
useCases:
  - identity-001-manage-api-tokens
  - identity-002-ssh-key-management
  - identity-003-check-account-settings
  - organization-002-manage-memberships
destructive: false
---

Dieses Tutorial führt einen Read-First-Sicherheitsnachweis-Durchlauf für Compliance- und Operational-Reviews durch.

## Copy-Paste-Prompt {#copy-paste-prompt}

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

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Token/Key/Session/Membership/Zertifikat-Daten sammeln.
- Veraltete oder riskante Elemente hervorheben.
- Einen nach Schweregrad geordneten Bericht erstellen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Sanierungsprioritäten festlegen.
- Folge-Widerrufs-/Entfernungsarbeiten genehmigen.
- Nachweis in deinem Compliance-System speichern.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- What time range for session review? → `Last 30 days.`
- Should unknown sessions be revoked now? → `No, report-only for this pass.`
- Which org is in scope? → `Use organization <org-id>.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-run the same audit queries and confirm the final report includes all token, key, session, membership, and certificate IDs.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
No rollback is required for read-only auditing. If any write action occurred by mistake, list affected IDs and propose corrective steps.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume the audit from the first incomplete security category and preserve completed categories.
```
