---
title: Agentur-Multi-Projekt-Management
description: Wöchentliche Multi-Projekt-Operations-Review mit Agent-Ausführung und menschlichen Genehmigungen durchführen
useCases:
  - organization-002-manage-memberships
  - project-001-create-project
  - automation-002-manage-scheduled-tasks
destructive: false
---

Dieses Tutorial richtet sich an Agenturleiter, die einen wiederholbaren wöchentlichen Operations-Durchlauf über Projekte, Mitgliedschaften und offene Arbeiten wünschen.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Prepare my weekly mittwald agency operations brief.

Do this in order:
1) Discover my organization and active projects.
2) Review memberships and pending invites.
3) Review automation/cron status for production projects.
4) Return a prioritized report with: critical issues, actions for this week, and owner suggestions.

Read-only mode first. Do not create/update/delete anything unless I explicitly approve.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Deine Organisation auflösen und aktive Projekte auflisten.
- Mitgliedschaften und ausstehende Einladungen prüfen.
- Automatisierungsstatus und kürzliche Ausführungsergebnisse überprüfen.
- Eine priorisierte Zusammenfassung mit IDs erstellen, auf die du reagieren kannst.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Zielorganisation bestätigen, falls du mehrere hast.
- Schreibaktionen genehmigen.
- Eigentümerschaft und Prioritäten für markierte Elemente festlegen.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which organization should I audit? → `Use organization <org-id>.`
- Should I include staging projects? → `Production first, then staging if time permits.`
- Should I create tickets/tasks automatically? → `No, return recommendations only.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-check the same organization and show me:
- project count,
- membership count,
- pending invite count,
- any failing automations.
Return the raw IDs used in the report.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
If you created anything in this session by mistake, list each created resource ID and delete only those resources after I confirm.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume the weekly operations brief from the last completed step. Reuse previously discovered organization/project IDs and continue without re-running completed checks.
```
