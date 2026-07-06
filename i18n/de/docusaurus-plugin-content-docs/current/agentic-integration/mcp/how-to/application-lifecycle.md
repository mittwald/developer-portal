---
title: Anwendungs-Lifecycle durchführen
description: Apps mit Agent-geführter Ausführung deployen, aktualisieren, CMS installieren und migrieren
useCases:
  - apps-001-deploy-php-app
  - apps-002-update-nodejs-version
  - apps-003-install-wordpress
  - apps-004-migrate-application
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Manage my mittwald application lifecycle end-to-end.

I need:
1) app inventory,
2) deploy/install/update/migrate plan,
3) execution with approvals at risky steps,
4) final state summary with app and dependency IDs.

Start read-only, then request approval before writes.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Projekt/App-Runtime-Status inventarisieren.
- Den richtigen Lifecycle-Aktionspfad auswählen.
- Genehmigte Lifecycle-Schritte ausführen und Ergebnisse zusammenfassen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Produktionsrelevante Änderungen genehmigen.
- Migrationsrichtung bereitstellen (Quelle/Ziel).
- App-Level-Smoke-Checks nach Rollout validieren.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list affected apps and verify lifecycle outcomes (deploy/update/install/migrate) including status and IDs.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Rollback the last lifecycle change for affected apps and report restored state and remaining risks.
```
