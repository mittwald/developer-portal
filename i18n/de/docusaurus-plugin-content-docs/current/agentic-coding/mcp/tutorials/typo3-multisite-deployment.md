---
title: TYPO3-Multi-Site-Deployment
description: TYPO3-Sites über mehrere Domains mit kontrollierten Prompts ausrollen
useCases:
  - apps-004-migrate-application
  - project-002-configure-ssh
  - databases-001-provision-mysql
  - domains-004-ssl-certificate
destructive: true
---

Dieses Tutorial deckt das kontrollierte Rollout von TYPO3-Varianten über mehrere Domains ab.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Set up a TYPO3 multi-site rollout for my mittwald project.

Workflow:
1) inspect existing TYPO3 app baseline,
2) create/add required database resources,
3) configure domain/virtualhost and SSL coverage,
4) prepare deployment SSH access,
5) return a site-by-site summary with IDs.

Do read-only validation first, then ask for approval before each write.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Bestehende App und Projektkontext entdecken.
- Ressourcenerstellung für jede Site-Variante planen.
- Genehmigte Setup-Operationen ausführen.
- Domain/App/Datenbank/Zugriffs-Mappings zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Ziel-Domains und Sprach-/Site-Mapping bestätigen.
- Jeden Schreibschritt genehmigen.
- TYPO3-Level-Konfiguration nach Infra-Setup validieren.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which project is the base installation in? → `Project <project-id>.`
- Should each site have its own DB? → `No, TYPO3 multisite uses a single shared database.`
- Include `www` + apex for SSL? → `Yes, both.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Verify each configured site: app ID, database ID, domain/virtualhost ID, certificate status, and SSH access state.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
List resources created for this rollout and remove only those that belong to this session after I confirm IDs.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume multi-site rollout from the first incomplete site and skip sites already marked as complete.
```
