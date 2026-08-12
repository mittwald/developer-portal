---
title: Automatisierte Backup-Überwachung
description: Backup-Abdeckung prüfen und bei Bedarf Sicherheits-Backups auslösen
useCases:
  - backups-001-setup-backup-schedule
  - backups-002-create-manual-backup
  - backups-003-restore-from-backup
destructive: true
---

Dieses Tutorial erstellt einen wiederholbaren Backup-Gesundheits-Workflow für mehrere Projekte.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Run a backup health audit across my mittwald projects.

Workflow:
1) List backup schedules and latest backup per project.
2) Flag projects with stale/missing backups.
3) For flagged projects, propose manual backup creation and schedule fixes.
4) Do not execute restore/delete actions unless I explicitly approve.

Return a concise status table with project IDs and backup IDs.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Projekte, Zeitpläne und aktuellen Backup-Status aufzählen.
- Veraltete oder fehlende Backup-Absicherung hervorheben.
- Sofortige Maßnahmen vorschlagen (manuelles Backup + Zeitplanänderungen).

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Schreibaktionen genehmigen.
- Aufbewahrungszeiträume und Backup-Timing festlegen.
- Restore-Aktionen genehmigen oder ablehnen.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- What retention policy should I enforce? → `14 days for production, 7 days for staging.`
- Should I trigger manual backups now? → `Yes for every project flagged as stale.`
- Restore anything now? → `No restore now, audit only.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-check backup schedules and latest backup timestamps for all audited projects.
Return before/after status for any project where changes were made.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
List backup schedules or manual backups created in this session and remove only the temporary/test ones after I confirm IDs.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume from the first project that has not been audited yet. Do not repeat projects that already have a completed backup status result.
```
