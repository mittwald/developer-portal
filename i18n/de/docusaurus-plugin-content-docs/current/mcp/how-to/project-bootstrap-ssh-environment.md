---
title: Projekt mit SSH und Umgebungsprüfungen bootstrappen
description: Baseline-Projektbereitschaft für Deployment-Arbeit etablieren
useCases:
  - project-001-create-project
  - project-002-configure-ssh
  - project-003-manage-environment
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Bootstrap a mittwald project for development and deployment.

Tasks:
1) create or select target project,
2) verify SSH user/access readiness,
3) validate environment/config basics,
4) return a bootstrap checklist with IDs and blockers.

Ask before creating users or changing configuration.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Projekt/Server-Kontext entdecken.
- SSH- und Umgebungsvoraussetzungen validieren.
- Genehmigte Setup-Aktionen ausführen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Projektnamen/Business-Kontext bereitstellen.
- Public Keys oder Secret-Werte bereitstellen.
- Benutzer/Konfigurations-Schreibvorgänge genehmigen.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-check project bootstrap status: project metadata, SSH readiness, and environment checks. Return pass/fail per item.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Remove bootstrap artifacts created in this session (users/config entries) if setup should be undone.
```
