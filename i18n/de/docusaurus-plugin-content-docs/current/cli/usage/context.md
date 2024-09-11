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
