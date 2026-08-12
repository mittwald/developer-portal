---
title: Backup-Restore-Incident-Wiederherstellung
description: Service nach einem fehlgeschlagenen Deployment mit Backup-Nachweis und kontrollierter Wiederherstellung wiederherstellen
useCases:
  - backups-003-restore-from-backup
destructive: true
---

## Incident-Auslöser {#incident-trigger}

Verwende dieses Runbook, wenn die Produktion beeinträchtigt ist und ein Rollback über Backup-Wiederherstellung erforderlich ist.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Run a mittwald backup-restore incident workflow for my production project.

Steps:
1) identify latest known-good backup before incident,
2) show restore options and risks,
3) execute restore only after my approval,
4) verify service health after restore,
5) return incident timeline with backup/restore IDs.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Kandidaten-Backups und Incident-Kontext sammeln.
- Sichersten Wiederherstellungspunkt empfehlen.
- Genehmigte Wiederherstellung ausführen.
- Post-Restore-Verifizierungsbericht erstellen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Auswahl des Wiederherstellungspunkts genehmigen.
- Downtime/Status extern kommunizieren.
- Folge-Korrekturmaßnahmen entscheiden.

## Verifizierungs-Prompt {#verification-prompt}

```text
Verify post-restore state: backup used, restore status, app availability indicators, and remaining errors.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
If restore target was wrong, list alternative restore candidates and execute a second restore only after explicit confirmation.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume incident recovery from the failed restore step using previously selected backup candidates.
```
