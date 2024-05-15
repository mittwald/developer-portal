---
title: PHP-Anwendungen lokal mit DDEV ausführen
sidebar_label: DDEV
tags:
  - PHP
  - Deployment
description: DDEV ist eine lokale Entwicklungsumgebung für PHP-Anwendungen. Es kann verwendet werden, um PHP-Anwendungen auf einfache Weise lokal für Test- und Entwicklungszwecke zu starten.
---

## Voraussetzungen

### Benötigte Werkzeuge

Bevor du loslegen kannst, stelle sicher, dass du die erforderlichen Tools auf deinem lokalen Rechner installiert hast:

- [DDEV](https://ddev.readthedocs.io/en/stable/): DDEV ist eine lokale Entwicklungsumgebung, die das Einrichten und Verwalten von PHP-Anwendungen auf deinem Computer vereinfacht.
- [Docker](https://www.docker.com/): Docker ist eine Plattform zum Entwickeln, Deployment und Ausführen von Anwendungen in Containern.

Wir empfehlen außerdem, die [mittwald CLI][cli] für die Einrichtung zu verwenden -- obwohl es auch ohne geht.

### SSH-Konnektivität herstellen

Um die Befehle `ddev pull` und `ddev push` verwenden zu können, musst du eine SSH-Verbindung zwischen deinem lokalen Rechner und deiner mittwald-App ermöglichen. Folge dazu dem Abschnitt ["SSH-Authentifizierung"][cli-ssh] der mittwald CLI-Dokumentation.

Weiterhin ist für die korrekte Funktion der DDEV-Integration mit mittwald eine SSH-Konnektivität von innerhalb des DDEV-Webcontainers erforderlich. Normalerweise werden alle deine SSH-Schlüssel in den DDEV-Container über einen SSH-Agenten übergeben, wenn du `ddev auth ssh` ausführst. Wenn du jedoch Probleme wie `too many authentication failures` hast, musst du möglicherweise deine SSH-Schlüssel manuell im DDEV-Container konfigurieren. Siehe den Abschnitt ["Häufige Probleme"](#häufige-probleme) für weitere Informationen.

## Einrichten einer neuen DDEV-Umgebung für ein mittwald-Projekt

Die folgenden Anweisungen führen dich durch die Einrichtung einer DDEV-Umgebung für deine mittwald-App. Du kannst zwischen der Verwendung der mittwald CLI oder der manuellen Konfiguration deiner DDEV-Umgebung wählen.

Diese Anweisungen funktionieren sowohl für die Einrichtung einer neuen DDEV-Umgebung als auch für das Verbinden einer mittwald-App mit einer vorhandenen DDEV-Umgebung.

Dir steht es auch frei, ob du ein leeres Projekt initialisieren und Code und Datenbank von einer bereits installierten App auf dem Server abrufen möchtest, oder ob du eine DDEV-Umgebung für eine bereits vorhandene Codebasis auf deinem lokalen Rechner einrichten möchtest.

### Mit der mittwald CLI

Wenn du die [mittwald CLI][cli] bereits installiert hast, kannst du mit einem einzigen Befehl ein DDEV-Projekt für deine mittwald-App einrichten.

Um die Einrichtung zu starten, führe den folgenden Befehl in deinem Terminal aus und ersetze `<app-id>` durch deine App-ID (üblicherweise im Format `a-xxxxx`) und `<project-name>` durch einen geeigneten Namen für dein Projekt:

```shell-session
$ # Projektverzeichnis erstellen und betreten
$ mkdir project-dir && cd project-dir

$ # DDEV-Umgebung initialisieren
$ mw ddev init <app-id> --project-name <project-name>

$ # Optional: Code und Datenbank vom Server abrufen
$ ddev pull mittwald
```

Dieser Befehl konfiguriert automatisch eine DDEV-Umgebung, die deiner vorhandenen mittwald-App weitgehend entspricht, einschließlich PHP- und MySQL-Versionen sowie des Document Roots. Darüber hinaus installiert und konfiguriert er das [mittwald DDEV-Addon][ddev-addon], das nahtlos mit DDEV integriert ist.

:::tip

Du kannst deine DDEV-Umgebung jederzeit aktualisieren, um etwaige Änderungen in der Konfiguration deiner mittwald-App zu berücksichtigen, indem du `mw ddev init` erneut ausführst.

:::

### Manuelle Einrichtung

Wenn du das mittwald CLI nicht installiert hast oder eine manuelle Herangehensweise bevorzugst, kannst du dennoch eine DDEV-Umgebung für deine PHP-Anwendung einrichten. So geht's:

```bash
$ ddev config \
    --project-type <type> \
    --php-version <php-version> \
    --database mysql:<mysql-version>
$ ddev get mittwald/ddev
```

Ersetze `<type>`, `<php-version>` und `<mysql-version>` durch die entsprechenden Werte für dein Projekt. Nach Ausführung dieser Befehle wird deine DDEV-Umgebung konfiguriert, und das [mittwald DDEV-Addon][ddev-addon] wird installiert.

Während dieser Einrichtung wirst du nach einem [mittwald API-Token][apitoken] und der App-ID deiner mittwald-App (üblicherweise im Format `a-xxxxx`) gefragt.

## Funktionen

### Code und Datenbank abrufen und übertragen

DDEV vereinfacht den Prozess der Synchronisierung von Code und Datenbanken zwischen deiner lokalen Umgebung und deiner mittwald-App.

Um den Code und die Datenbank von deiner mittwald-App in deine lokale DDEV-Umgebung zu laden, verwende den folgenden Befehl:

```bash
$ ddev pull mittwald
```

Umgekehrt, um lokale Code- und Datenbankänderungen auf deine mittwald-App hochzuladen, führe den folgenden Befehl aus:

```bash
$ ddev push mittwald
```

:::warning

Sei vorsichtig bei der Verwendung von `ddev push`, da er deinen mittwald-App-Code und deine Datenbank mit Daten aus deiner lokalen Umgebung überschreibt. Dieser Befehl ist für Entwicklungszwecke gedacht und implementiert keine produktionsfähige Bereitstellungsstrategie.

:::

### Verwendung des mittwald CLI

Das [mittwald DDEV-Addon][ddev-addon] ermöglicht es dir, das [mittwald CLI][cli] direkt in deinem DDEV-Webcontainer auszuführen. Diese Integration ermöglicht es dir, verschiedene mittwald CLI-Befehle nahtlos auszuführen.

Um das mittwald CLI in deiner DDEV-Umgebung zu nutzen, verwende die folgende Syntax:

```bash
$ ddev mw <command>
```

Ersetze `<command>` durch einen unterstützten Befehl des mittwald CLI.

## Häufige Probleme

### SSH-Verbindungen schlagen mit `too many authentication failures` fehl

Dieser Fehler kann auftreten, wenn du viele SSH-Schlüsselpaare auf deinem lokalen Rechner konfiguriert hast und der Remote-Server die Verbindung nach zu vielen fehlgeschlagenen Authentifizierungsversuchen ablehnt.

Um dieses Problem zu umgehen, kannst du deine SSH-Schlüssel manuell im DDEV-Webcontainer konfigurieren. Führe dazu folgende Schritte aus:

0. Finde das SSH-Schlüsselpaar, das du für die Verbindung verwenden möchtest, und stelle sicher, dass der öffentliche Schlüssel zu deinem mStudio-Benutzerprofil hinzugefügt ist. Für die folgenden Schritte gehen wir davon aus, dass der SSH-Schlüssel `mstudio` heißt und der private Schlüssel in `~/.ssh/mstudio` gespeichert ist.

1. Füge den erforderlichen SSH-Schlüssel direkt zum DDEV-Webcontainer hinzu, indem du ihn in `.ddev/homeadditions` verlinkst:

    ```shell-session
    $ mkdir -p .ddev/homeadditions/.ssh
    $ ln -s ~/.ssh/mstudio ~/.ddev/homeadditions/.ssh/mstudio
    ```

2. Setze die Umgebungsvariable `MITTWALD_SSH_IDENTITY_FILE` so, dass sie auf den verlinkten SSH-Schlüssel zeigt:

    ```shell-session
    $ ddev config --web-environment-add MITTWALD_SSH_IDENTITY_FILE=~/.ssh/mstudio
    ```

[cli]: /docs/v2/api/sdks/cli
[cli-ssh]: /docs/v2/api/sdks/cli/#ssh
[apitoken]: /docs/v2/api/intro
[ddev-addon]: https://github.com/mittwald/ddev

[^1]: DDEV-`homeadditions` sind ein Mechanismus, um dein Home-Verzeichnis innerhalb des Webcontainers zu erweitern. Siehe das [Handbuch](https://ddev.readthedocs.io/en/stable/users/extend/in-container-configuration/) für weitere Informationen.
