---
title: Datenbank-Performance-Optimierung
description: MySQL- und Redis-Bereitschaft vor Traffic-Spitzen überprüfen
useCases:
  - databases-001-provision-mysql
  - databases-003-setup-redis-cache
  - databases-004-manage-users
  - apps-002-update-nodejs-version
destructive: false
---

Dieses Tutorial ist eine Read-First-Performance-Review für Commerce- und High-Traffic-Workloads.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Run a mittwald database performance readiness review for my production project.

Tasks:
1) List MySQL and Redis instances.
2) Inspect configuration and capacity signals.
3) Flag likely bottlenecks and missing cache coverage.
4) Recommend prioritized actions for this week.

Read-only only. No writes.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Aktuelles MySQL/Redis-Inventar und Konfiguration sammeln.
- Kapazität und Cache-Bereitschaftssignale analysieren.
- Wahrscheinliche Risikobereiche priorisieren.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Wählen, welche Empfehlungen umzusetzen sind.
- Wartungsfenster für Änderungen planen.
- Business-seitige Performance-Schwellenwerte bereitstellen.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which project/database is critical? → `Production project <project-id>.`
- What is acceptable latency? → `Keep checkout DB queries under 200ms p95.`
- Can I apply changes now? → `No, recommendations only.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-run the same readiness checks and confirm no data gaps in the audit.
Return the list of inspected database IDs and the top 3 risks.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
No rollback needed for read-only audit. If any write action happened accidentally, list affected resource IDs and propose reversal steps.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume the readiness audit from the first database that does not yet have findings.
```
