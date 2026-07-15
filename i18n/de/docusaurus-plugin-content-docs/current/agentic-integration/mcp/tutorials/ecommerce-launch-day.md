---
title: E-Commerce-Launch-Day-Vorbereitung
description: Launch-Readiness-Check über Backups, Datenbank, SSL und App-Status durchführen
useCases:
  - apps-003-install-wordpress
  - backups-001-setup-backup-schedule
  - backups-002-create-manual-backup
  - databases-001-provision-mysql
  - domains-004-ssl-certificate
destructive: true
---

Verwende diese Launch-Checkliste, wenn eine Produktions-Storefront schnelle, evidenzbasierte Go/No-Go-Validierung benötigt.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Run a mittwald launch readiness audit for my production storefront.

Check:
1) backup schedule and latest backup,
2) database readiness,
3) SSL/certificate status,
4) app/runtime configuration.

Create a fresh pre-launch backup only after I approve.
Return a launch status summary with blockers and resource IDs.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Backups, DB, SSL und App-Runtime-Status prüfen.
- Blocker und fehlende Schutzmaßnahmen identifizieren.
- Launch/No-Launch-Empfehlung vorschlagen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Pre-Launch-Backup-Erstellung genehmigen.
- Go/No-Go basierend auf Blockern entscheiden.
- Externe Abhängigkeiten koordinieren (Marketing, DNS-Cutover-Fenster).

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which project/domain is launch target? → `Production project <project-id>, domain <domain>.`
- Should I create a manual backup now? → `Yes, create one now.`
- If SSL issues exist, pause launch? → `Yes, pause until SSL is green.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-check all launch criteria and confirm current status for backup freshness, DB readiness, SSL validity, and app runtime.
Show any remaining blockers with IDs.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
If launch changes were applied and need reversal, restore the pre-launch state using the latest approved backup and list all affected resources.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume launch readiness from the first incomplete validation step and keep completed checks as final.
```
