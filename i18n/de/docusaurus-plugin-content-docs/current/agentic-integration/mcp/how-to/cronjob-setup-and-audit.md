---
title: Cronjobs einrichten und Ausführungen prüfen
description: Geplante Aufgaben erstellen und Ausführungsgesundheit verifizieren
useCases:
  - automation-001-setup-cronjob
  - automation-002-manage-scheduled-tasks
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Set up and audit cronjobs for my mittwald project.

Flow:
1) list current cronjobs and recent execution history,
2) create or adjust the required cronjob schedule,
3) optionally trigger a manual run,
4) report execution health and failure signals.

Ask for approval before creating/updating/triggering jobs.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Aktuellen Zeitplan/Ausführungsdaten prüfen.
- Korrigierende Zeitplanung vorschlagen.
- Genehmigte Änderungen ausführen und Ergebnisse berichten.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Zeitplan, Befehl und Timeout-Richtlinie bestätigen.
- Manuelle Auslöser in Produktionsfenstern genehmigen.
- Eskalationspfad für Fehler festlegen.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list cronjobs and execution history for this project and confirm the approved schedule/trigger outcomes are visible.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Restore previous cron configuration by reverting the jobs changed in this session.
```
