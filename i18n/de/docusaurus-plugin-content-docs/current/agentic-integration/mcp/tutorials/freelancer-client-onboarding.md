---
title: Client-Onboarding-Automatisierung
description: Projekt, Domain, Mail und SSL aus einem geführten Prompt bereitstellen
useCases:
  - project-001-create-project
  - domains-001-setup-email-forwarding
  - domains-002-configure-dns
  - domains-003-setup-mailbox
  - domains-004-ssl-certificate
destructive: true
---

Dieses Tutorial verwandelt das Setup für neue Clients in einen einzelnen Human-Intent-Workflow mit expliziten Genehmigungen.

## Copy-Paste-Prompt {#copy-paste-prompt}

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

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Org/Projekt-Kontext entdecken.
- Abhängigkeitsreihenfolge planen (Projekt → Domain/DNS → Mail → SSL).
- Genehmigte Schreibvorgänge ausführen und Ressourcen-IDs verfolgen.
- Abschlusszusammenfassung zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Domain- und Mailbox-Anforderungen bereitstellen.
- Schreibvorgänge genehmigen.
- Eigentümer/Registrar-Voraussetzungen validieren, wo benötigt.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- What project name should I use? → `Use <client-name>-website.`
- Which domain is primary? → `Use <domain> as primary and include www.`
- Which mailbox pattern is required? → `Create info@ and forward contact@ to our support inbox.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Verify the onboarding result by listing project, domain/DNS, mailbox/forwarding, and certificate state for this client.
Return all relevant IDs.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
List resources created in this onboarding run and remove only those resources after I confirm each ID.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume onboarding from the failed step and keep already-created valid resources; do not recreate successful ones.
```
