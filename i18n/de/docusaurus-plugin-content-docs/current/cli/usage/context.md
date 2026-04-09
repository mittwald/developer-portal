---
title: Speichern von Objekten als Kontext für Folge-Befehle
sidebar_label: Persistenter Kontext
sidebar_position: 25
description: Wie man bestimmte Objekte als Kontext für Folge-Befehle festhält
---

Viele Befehle der CLI agieren im Kontext eines bestimmten Projekts, Servers oder einer Organisation und benötigen daher einen `--project-id`, `--server-id` oder `--org-id`-Parameter. Du kannst diese Parameter entweder an jeden Befehl übergeben, oder sie global mit dem `mw context`-Befehl setzen:

```bash
$ mw context set --project-id=...
$ mw context set --server-id=...
$ mw context set --org-id=...
```

Manche Befehle, die eine dieser Ressourcen erstellen, haben auch ein `--update-context`-Flag, das den Kontext automatisch auf die neu erstellte Ressource setzt:

```bash
$ mw project create --description="..." --update-context
```

## Verzeichnisbezogener Kontext mit `.mw-context.json` {#dotfile-context}

Wenn du an mehreren mittwald-Projekten parallel arbeitest, kann das Wechseln des Kontexts mit `mw context set` umständlich sein, da der Kontext global in `~/.config/mw/context.json` gespeichert wird. Um dies zu vermeiden, kannst du eine `.mw-context.json`-Datei in deinem Projektverzeichnis (oder einem übergeordneten Verzeichnis) erstellen, um Kontextwerte festzulegen, die nur beim Arbeiten in diesem Verzeichnis gelten.

Erstelle eine `.mw-context.json`-Datei mit den benötigten Kontextschlüsseln:

```json
{
  "project-id": "p-xxxxx",
  "server-id": "s-xxxxx",
  "org-id": "o-xxxxx"
}
```

Die CLI sucht automatisch aufwärts von deinem aktuellen Arbeitsverzeichnis nach dieser Datei. Wenn sie gefunden wird, haben die Werte in `.mw-context.json` Vorrang vor dem globalen Kontext.

Dieser Ansatz ist nützlich für:

- **Multi-Projekt-Workflows**: Jedes Projektverzeichnis kann seinen eigenen Kontext haben, ohne manuell wechseln zu müssen.
- **Team-Zusammenarbeit**: Committe die `.mw-context.json`-Datei in dein Repository, damit Teammitglieder automatisch den richtigen Kontext verwenden.
- **Vermeidung von Race Conditions**: Mehrere Terminals in verschiedenen Verzeichnissen beeinflussen sich nicht gegenseitig.
