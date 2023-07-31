---
title: Verwendung der mittwald CLI
sidebar_label: CLI
description: Eine Einführung in die Verwendung der mittwald-Befehlszeilenschnittstelle (CLI)
---

## Installation

### Jedes Betriebssystem, mit NPM

Mit einer lokalen Node.js-Installation kannst du die mittwald CLI mit NPM installieren:

```
$ npm install -g @mittwald/cli
$ mw --help
```

### macOS, mit Homebrew

```
$ brew tap mittwald/cli
$ brew install mw
$ mw --help
```

### macOS, mit dem Installationspaket

Lade das neueste Installationspaket (`*.pkg`-Datei) von unserer [Releases-Seite](https://github.com/mittwald/cli/releases) herunter und führe den Installer aus. Achte auf die Prozessorarchitektur und lade die `mw-*-arm64.pkg`-Datei, wenn du einen ARM-Mac verwendest, und die `mw-*-amd64.pkg`-Datei, wenn du einen Intel-Mac verwendest.

:::info

Derzeit sind unsere Alpha-Release-Pakete nicht mit einem Entwicklerzertifikat signiert. Möglicherweise musst du die Ausführung des Installer ausdrücklich in deinen Systemeinstellungen freigeben.

:::

### Windows, mit dem Installationspaket

Lade das neueste Installationspaket (`*.exe`-Datei) von unserer [Releases-Seite](https://github.com/mittwald/cli/releases) herunter und führe den Installer aus.

### Mit Docker

```
$ export MITTWALD_API_TOKEN=xxx
$ docker run \
    --rm \
    -it \
    -e MITTWALD_API_TOKEN \
    mittwald/cli --help
```

## Authentifizierung

Um die CLI zu verwenden, musst du dich zunächst mit einem API-Token authentifizieren. Schau dir den Abschnitt ["Ein API-Token beziehen"](../../intro#obtaining-an-api-token) der Einführung an, um Details zum Erhalt eines API-Tokens zu erfahren.

:::note

Weitere Authentifizierungsmechanismen (wie z.B. ein OAuth2-Flow, bei dem du deinen Browser zur Authentifizierung verwenden kannst) sind für die Zukunft geplant.

:::

Mit einem Token kannst du dich wie folgt authentifizieren:

```
$ mw login token
Enter your mStudio API token: ********
```

Für nicht-interaktive Nutzung (beispielsweise in CI/CD-Pipelines), kannst du das Token auch über die `MITTWALD_API_TOKEN`-Umgebungsvariable bereitstellen:

```
$ export MITTWALD_API_TOKEN=********
$ mw login status
```

## Allgemeine Verwendung

### Projekt-, Server- und Organisations-Kontexte

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

### Nicht-interaktive Nutzung

Falls du `mw` auf nicht-interaktive Weise verwenden möchtest (z.B. in Skripten oder CI/CD-Pipelines), unterstützen viele Befehle ein `--output|-o`-Flag, mit dem du das Ausgabeformat angeben kannst. Standardwert ist `text`, was in einer menschenlesbaren Ausgabe resultiert. Du kannst auch `json` verwenden, um maschinenlesbare Ausgaben zu erhalten, die du dann leicht mit Werkzeugen wie `jq` verarbeiten kannst:

```bash
PROJECT_ID=$(mw project get -ojson | jq -r '.id')
```

Viele Befehle, die eine Ressource erstellen, geben standardmäßig Fortschrittsinformationen aus. Sie haben aber auch ein `--quiet|-q`-Flag, mit dem du die Ausgabe unterdrücken kannst. In diesen Fällen geben die meisten Befehle die ID der erstellten Ressource aus, die du dann verwenden kannst, um damit weiterzuarbeiten:

```bash
PROJECT_ID=$(mw project create --quiet --description="...")
```
