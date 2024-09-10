---
title: Nicht-interaktive Nutzung der CLI
sidebar_label: Non-interaktive Nutzung
sidebar_position: 30
description: Wie du die mittwald CLI nicht-interaktiv benutzen kannst, beispielsweise in Skripten oder CI/CD-Pipelines
---

Falls du `mw` auf nicht-interaktive Weise verwenden möchtest (z.B. in Skripten oder CI/CD-Pipelines), unterstützen viele Befehle ein `--output|-o`-Flag, mit dem du das Ausgabeformat angeben kannst. Standardwert ist `text`, was in einer menschenlesbaren Ausgabe resultiert. Du kannst auch `json` verwenden, um maschinenlesbare Ausgaben zu erhalten, die du dann leicht mit Werkzeugen wie `jq` verarbeiten kannst:

```bash
PROJECT_ID=$(mw project get -ojson | jq -r '.id')
```

Viele Befehle, die eine Ressource erstellen, geben standardmäßig Fortschrittsinformationen aus. Sie haben aber auch ein `--quiet|-q`-Flag, mit dem du die Ausgabe unterdrücken kannst. In diesen Fällen geben die meisten Befehle die ID der erstellten Ressource aus, die du dann verwenden kannst, um damit weiterzuarbeiten:

```bash
PROJECT_ID=$(mw project create --quiet --description="...")
```
