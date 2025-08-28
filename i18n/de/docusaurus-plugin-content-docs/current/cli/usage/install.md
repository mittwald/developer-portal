---
title: Die mittwald CLI installieren
sidebar_label: Installation
sidebar_position: 20
description: Wie du das mittwald Command-Lint Interface (CLI) installierst
---

## Unter macOS

Unter macOS ist die empfohlene Methode zur Installation der CLI die Verwendung von [Homebrew](https://brew.sh):

```
$ brew tap mittwald/cli
$ brew install mw
$ mw --help
```

Du kannst Homebrew auch verwenden, um die CLI zu aktualisieren:

```
$ brew upgrade mw
```

Lies wie du [Autovervollständigung](#autovervollständigung) installierst und aktualisierst.

## Unter Windows

Lade das neueste Installationspaket (`*.exe`-Datei) von unserer [Releases-Seite](https://github.com/mittwald/cli/releases) herunter und führe den Installer aus. Nach dem Ausführen des Installers solltest du den Befehl `mw` sowohl in der CMD-Eingabeaufforderung als auch in PowerShell verwenden können.

Lies wie du [Autovervollständigung](#autovervollständigung) installierst und aktualisierst.

## Unter Linux

Derzeit bieten wir kein Paket für Linux-Distributionen an. Du kannst jedoch die NPM-Installationsmethode verwenden oder die CLI mit Docker ausführen.

## Unter jedem Betriebssystem

### Mit NPM

Mit einer lokalen Node.js-Installation kannst du die mittwald CLI mit NPM installieren:

```
$ npm install -g @mittwald/cli
$ mw --help
```

:::important

Beachte bitte, dass diese Installationsmethode die mittwald CLI mit der auf deinem lokalen System installierten Node.js-Version verwendet. Wir können keine vollständige Kompatibilität mit allen Node.js-Versionen garantieren, da die CLI derzeit nur gegen Node.js-Version 18 und 20 getestet wird.

Wenn Du Probleme mit einer Node.js-Version über 20 hast, [sende bitte einen Fehlerbericht](https://github.com/mittwald/cli/issues), damit wir das Problem in zukünftigen Versionen beheben können.

:::

### Mit Docker

Wenn du auf deinem System [Docker](https://www.docker.com/) installiert hast, kannst du das `mittwald/cli` Docker-Image verwenden, anstatt die CLI auf deinem System zu installieren. Wenn du das Docker-Image verwendest, funktioniert die Authentifizierung etwas anders: Stelle sicher, dass eine Umgebungsvariable `MITTWALD_API_TOKEN` auf deinem System vorhanden ist; du kannst diese Umgebungsvariable dann in deinen Container übergeben:

```
$ export MITTWALD_API_TOKEN=xxx
$ docker run \
    --rm \
    -it \
    -e MITTWALD_API_TOKEN \
    mittwald/cli --help
```

## Autovervollständigung

Wir bieten eine Autovervollständigung für die `mw`-CLI an. Um diese zu aktivieren, führe den folgenden Befehl aus und befolge die angezeigten Anweisungen:

```
$ mw autocomplete
```

Nach einer Aktualisierung der CLI, führe den Befehl `mw autocomplete --refresh-cache` aus und öffne einen neuen Shell-Kontext, um die neue Autovervollständigung zu laden.
