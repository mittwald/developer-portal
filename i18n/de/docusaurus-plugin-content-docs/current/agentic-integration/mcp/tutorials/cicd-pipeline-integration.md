---
title: CI/CD-Pipeline-Integration
description: Deployment-Automatisierung, Cron-Ausführungsprüfungen und sichere Release-Validierung verbinden
useCases:
  - automation-001-setup-cronjob
  - automation-002-manage-scheduled-tasks
  - containers-003-deploy-docker-stack
destructive: true
---

Dieses Tutorial bringt automatisierte Deployment-Workflows mit mittwald-Runtime-Checks in Einklang.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Prepare and validate CI/CD operations for my mittwald production project.

Steps:
1) List existing cronjobs and recent execution results.
2) Verify deployment-related scheduled tasks.
3) Propose missing monitoring/cleanup cronjobs.
4) Validate the current stack deployment status.

Do read-only analysis first. Ask for explicit approval before creating/updating cronjobs or triggering manual executions.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Cron-Inventar und Ausführungshistorie prüfen.
- Fehlgeschlagene oder fehlende geplante Jobs erkennen.
- Deployment/Stack-Gesundheitssignale prüfen.
- Eine aktionsfähige Änderungsliste bereitstellen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Neue/aktualisierte Cronjobs genehmigen.
- Wartungsfenster für störende Schritte bestätigen.
- Release-Go/No-Go entscheiden.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which project/environment is in scope? → `Use production project <project-id>.`
- Should failed jobs be retried now? → `Retry once and report result.`
- Should I add a nightly health check cronjob? → `Yes, 03:00 local time.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list cronjobs and execution history for the updated project and confirm each approved change is present.
Return cronjob IDs and last execution statuses.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Undo the cronjob changes created in this session (by ID) and restore the previous schedule configuration.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume from the last incomplete CI/CD validation step and keep prior successful checks as completed.
```
