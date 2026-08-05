---
title: PHP-Anwendungen mit Tideways profilen
sidebar_label: Tideways-Profiling
tags:
  - PHP
  - Containers
description: |
  Erfahre, wie du deine PHP-Anwendungen mit Tideways profilst und überwachst – mit der mitgelieferten PHP-Extension und einem containerisierten Tideways-Daemon.
---

[Tideways](https://tideways.com/) ist ein kommerzieller Dienst für Application Performance Monitoring (APM) und Profiling von PHP-Anwendungen. Tideways zeichnet kontinuierlich auf, wie lange deine Requests dauern, wo diese Zeit verbraucht wird und welche Fehler auftreten — bis hinunter zu einzelnen Funktionsaufrufen und Datenbankabfragen.

Tideways besteht aus drei Bestandteilen:

1. Einer **PHP-Extension**, die deine Anwendung instrumentiert und Traces sammelt. Diese Extension ist in den PHP-Builds von mittwald bereits enthalten und muss nur noch aktiviert werden.
2. Dem **Tideways-Daemon**, einem kleinen Hintergrunddienst, der die gesammelten Traces puffert und an das Tideways-Backend weiterleitet. Diesen betreibst du selbst, als Container in deinem Projekt.
3. Dem **Tideways-Backend** unter [app.tideways.io](https://app.tideways.io/), in dem du die gesammelten Daten auswertest.

Diese Anleitung zeigt dir, wie du die Extension aktivierst und den Daemon auf der mittwald-Plattform betreibst.

## Voraussetzungen {#prerequisites}

Für diese Anleitung benötigst du:

- Zugriff auf ein mittwald mStudio-Projekt mit einer [PHP-App](/docs/v2/platform/workloads/php) (oder einem [PHP-Worker](/docs/v2/platform/workloads/php-worker))
- Ein Hosting-Produkt, das [Container-Workloads](/docs/v2/platform/workloads/containers) unterstützt, da der Tideways-Daemon als Container läuft
- Einen [Tideways-Account](https://tideways.com/) und den API-Key eines Tideways-Projekts (diesen findest du in der Tideways-Oberfläche in den Projekteinstellungen)
- Eine der folgenden PHP-Versionen — das sind die ersten mittwald-Builds, die die Tideways-Extension mitbringen:
  - PHP 8.3.33 oder neuer
  - PHP 8.4.24 oder neuer
  - PHP 8.5.9 oder neuer

Die PHP-Version deiner App kannst du im mStudio UI nachsehen oder über die CLI:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw app get <app-id>
```

Falls deine App noch eine ältere PHP-Version verwendet, aktualisiere sie, bevor du fortfährst:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw app dependency update <app-id> --set php=~8.4
```

Weitere Informationen zur Verwaltung der PHP-Version findest du unter [PHP-Anwendungen verwalten und deployen](/docs/v2/platform/workloads/php#auto-updates).

## Schritt 1: Den Tideways-Daemon betreiben {#daemon}

Die PHP-Extension kommuniziert nicht direkt mit dem Tideways-Backend. Stattdessen schickt sie ihre Daten über eine TCP-Verbindung an den Tideways-Daemon, der sich um Pufferung und Übertragung kümmert. Du benötigst daher genau einen Daemon-Container pro Projekt, den sich alle deine PHP-Apps teilen können.

Für diesen Container verwenden wir das Image `ghcr.io/tideways/daemon:latest` aus der [GitHub Container Registry](https://github.com/tideways/daemon/pkgs/container/daemon). Der Daemon lauscht auf dem TCP-Port `9135` und benötigt keinen persistenten Speicher, es sind also keine Volumes erforderlich.

:::note

Der Daemon benötigt deinen API-Key **nicht**. Der Key wird auf PHP-Seite konfiguriert und mit jedem Trace mitgeschickt — deshalb kann ein einzelner Daemon auch mehrere Tideways-Projekte bedienen.

:::

### Über das mStudio UI {#daemon-ui}

Gehe in mStudio zu deinem Projekt, wähle **„Container"** und klicke auf **„Container erstellen"**. Ein geführter Dialog öffnet sich, um dir beim Container-Setup zu helfen.

Gib zunächst eine Beschreibung ein — dies ist ein Freitextfeld zur Identifizierung des Containers. Gib zum Beispiel **„Tideways-Daemon"** ein und klicke auf **„Weiter"**.

Als Nächstes wirst du nach dem Image-Namen gefragt. Gib `ghcr.io/tideways/daemon:latest` ein und bestätige mit **„Weiter"**.

#### Entrypoint und Command {#daemon-ui-command}

- **Entrypoint:** Keine Änderungen erforderlich
- **Command:** Für ein Standard-Setup keine Änderungen erforderlich. Um zu steuern, wie sich der Daemon in der Tideways-Oberfläche registriert, kannst du `--env=production --hostname=tideways-daemon` angeben (siehe [Daemon-Optionen](#daemon-options) weiter unten).

#### Volumes {#daemon-ui-volumes}

Es sind keine Volumes erforderlich. Der Daemon puffert die Daten nur im Arbeitsspeicher und leitet sie weiter.

#### Umgebungsvariablen {#daemon-ui-env}

Es sind keine Umgebungsvariablen erforderlich.

Am Ende des Dialogs wirst du nach dem **Port** gefragt. Gib `9135` ein, damit der Daemon für die übrigen Workloads in deinem Projekt erreichbar wird. Klicke auf **„Container erstellen"**, um den Container zu erstellen und zu starten.

:::note

Merke dir den internen DNS-Namen des Containers, der nach der Erstellung in mStudio angezeigt wird. Er leitet sich vom Container-Namen ab — ein Container namens `Tideways-Daemon` erhält den DNS-Namen `tideways-daemon`. Du benötigst diesen Namen in [Schritt 2](#php-config).

:::

### Alternative: Verwendung des `mw container run`-Befehls {#daemon-cli-run}

Du kannst den Daemon-Container auch direkt über die Kommandozeile erstellen und starten:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw container run \
  --name tideways-daemon \
  --description "Tideways-Daemon" \
  --publish 9135:9135 \
  ghcr.io/tideways/daemon:latest
```

Das `--name`-Flag bestimmt den internen DNS-Namen, unter dem der Daemon aus deinen Apps erreichbar ist.

Um Optionen an den Daemon selbst zu übergeben, hängst du sie hinter dem Image-Namen an. Da diese Optionen wie CLI-Flags aussehen, trennst du sie mit einem `--` von den `mw`-Flags:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw container run \
  --name tideways-daemon \
  --description "Tideways-Daemon" \
  --publish 9135:9135 \
  -- ghcr.io/tideways/daemon:latest --env=production --hostname=tideways-daemon
```

### Alternative: Verwendung des `mw stack deploy`-Befehls {#daemon-cli-stack}

Alternativ kannst du den Befehl `mw stack deploy` verwenden, der mit Docker Compose kompatibel ist. Erstelle dazu eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
services:
  tideways-daemon:
    image: ghcr.io/tideways/daemon:latest
    command: "--env=production --hostname=tideways-daemon"
    ports:
      - "9135:9135/tcp"
```

Deploye sie anschließend:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml`-Datei aus dem aktuellen Verzeichnis und deployt sie in deinen Standard-Stack.

### Daemon-Optionen {#daemon-options}

Der Daemon läuft mit seinen Standardeinstellungen problemlos, zwei Optionen solltest du aber explizit setzen:

- `--env=<name>` legt den Namen der Umgebung fest, unter der Traces gemeldet werden, zum Beispiel `production` oder `staging`. Der Standardwert ist `production`.
- `--hostname=<name>` legt den Servernamen fest, unter dem sich der Daemon in der Tideways-Oberfläche registriert. In Containern hängt der Daemon standardmäßig die Container-ID an den ermittelten Hostnamen an — dadurch erscheint jede Neuerstellung des Containers als neuer Server. Ein fester Hostname vermeidet das.

Alle verfügbaren Optionen sind in der [Konfigurationsreferenz des Daemons](https://support.tideways.com/documentation/reference/daemon/configuration-reference.html) dokumentiert.

:::note

Das Veröffentlichen von Port `9135` macht den Daemon ausschließlich _innerhalb_ deiner Hosting-Umgebung erreichbar, also für andere Container und Managed Apps im selben Projekt. Er ist nicht aus dem Internet erreichbar, und die Netzwerk-Policies der Plattform verhindern Zugriffe aus anderen Projekten.

:::

## Schritt 2: Die PHP-Extension konfigurieren {#php-config}

Die Tideways-Extension ist Bestandteil der PHP-Installation deiner App, ist aber standardmäßig deaktiviert. Um sie zu aktivieren und zu konfigurieren, legst du eine neue Konfigurationsdatei im PHP-Konfigurationsverzeichnis deines Projekts an. Verbinde dich dazu per SSH mit deiner App:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw app ssh <app-id>
```

Erstelle dann die Datei `~/.config/php/php.d/20-tideways.ini` mit folgendem Inhalt:

```ini title="~/.config/php/php.d/20-tideways.ini"
extension=tideways.so

; Der API-Key deines Tideways-Projekts
tideways.api_key=YOUR_API_KEY

; Interner DNS-Name und Port deines Daemon-Containers
tideways.connection=tcp://tideways-daemon:9135

; Gruppiert die gesammelten Daten innerhalb deines Tideways-Projekts
tideways.service=web

; Prozentsatz der Requests, die mit dem Timeline-Profiler aufgezeichnet werden
tideways.trace_sample_rate=25
```

Ersetze `YOUR_API_KEY` durch den API-Key deines Tideways-Projekts und `tideways-daemon` durch den internen DNS-Namen des Containers aus [Schritt 1](#daemon).

Die Einstellungen haben folgende Bedeutung:

- `tideways.api_key` (**erforderlich**) authentifiziert deine Traces gegenüber deinem Tideways-Projekt.
- `tideways.connection` (in diesem Setup **erforderlich**) verweist die Extension auf deinen Daemon. Ohne diese Einstellung sucht die Extension einen Daemon auf einem lokalen Unix-Socket, den es auf der mittwald-Plattform nicht gibt.
- `tideways.service` gruppiert die Monitoring-Daten in voneinander unabhängige Einheiten innerhalb eines Projekts, jeweils mit eigenen Performance- und Fehlerstatistiken. Damit kannst du zum Beispiel Webfrontend, API und Hintergrund-Worker voneinander trennen. Der Standardwert ist `app`.
- `tideways.trace_sample_rate` steuert, wie viel Prozent der Requests mit dem vollständigen Timeline-Profiler aufgezeichnet werden. Der Standardwert ist `25`. Alle übrigen Requests werden weiterhin vom Performance- und Fehler-Monitoring erfasst.

Die vollständige Liste der Einstellungen findest du in der [Tideways-Konfigurationsdokumentation](https://support.tideways.com/documentation/setup/configuration/configure-tideways-globally-via-php-ini.html).

:::caution

Dein API-Key ist ein Zugangsschlüssel. Jede Person mit Dateisystemzugriff auf dein Projekt kann ihn aus dieser Datei auslesen. Checke `20-tideways.ini` daher nicht in die Versionsverwaltung ein und kopiere die Datei nicht in öffentlich lesbare Verzeichnisse.

:::

:::note

Änderungen an Dateien in `~/.config/php/php.d` werden automatisch erkannt, und der PHP-FPM-Dienst wird für dich neu gestartet. Du musst nichts manuell neu starten.

Die Konfiguration gilt für das gesamte Projekt, es melden also alle darin enthaltenen PHP-Apps an Tideways. Das Laden einer PHP-Extension ist eine systemweite Einstellung und kann deshalb nicht in einer verzeichnisbezogenen `.user.ini`-Datei erfolgen.

:::

## Schritt 3: Das Setup überprüfen {#verification}

Prüfe zunächst, ob die Extension geladen ist. Führe dazu in einer SSH-Sitzung auf deiner App aus:

```shellsession title="SSH-Sitzung"
user@ssh $ php -m | grep -i tideways
```

Die Ausgabe sollte `tideways` enthalten. Um zusätzlich zu prüfen, ob deine Einstellungen übernommen wurden, führe aus:

```shellsession title="SSH-Sitzung"
user@ssh $ php -i | grep tideways
```

Prüfe als Nächstes, ob der Daemon läuft und Verbindungen annimmt:

```shellsession title="Lokale Shell-Sitzung"
user@local $ mw container logs tideways-daemon
```

Schicke abschließend etwas Traffic auf deine Anwendung und öffne dein Projekt unter [app.tideways.io](https://app.tideways.io/). Die ersten Datenpunkte erscheinen üblicherweise innerhalb weniger Minuten.

## Gezieltes Profiling mit der Browser-Extension {#browser-extension}

Sampling deckt deinen durchschnittlichen Traffic ab, manchmal möchtest du aber einen vollständigen Trace eines bestimmten Seitenaufrufs. Mit der [Tideways-Browser-Extension](https://support.tideways.com/documentation/reference/browser-extension/chrome-extension.html) kannst du das direkt aus dem Browser auslösen: Sie setzt ein signiertes `TIDEWAYS_SESSION`-Cookie, das die PHP-Extension anweist, für deine eigenen Requests einen vollständigen Timeline- und Callgraph-Trace aufzuzeichnen.

Nachdem du sie installiert und dich mit deinem Tideways-Account angemeldet hast, klickst du auf das Tideways-Icon und wählst **„Take Profile"**, um die aktuelle Seite mit aktiviertem Profiling neu zu laden, oder **„Profile for 15 seconds"**, um eine Abfolge von Interaktionen wie ein Formular-Submit oder mehrere AJAX-Calls aufzuzeichnen.

## Fehlerbehebung {#troubleshooting}

### In Tideways erscheinen keine Daten {#troubleshooting-no-data}

- Prüfe, ob der Daemon-Container läuft und Port `9135` veröffentlicht ist. Ohne veröffentlichten Port ist der Container aus deiner App nicht erreichbar.
- Prüfe, ob `tideways.connection` den internen DNS-Namen des Containers verwendet und nicht dessen Anzeigenamen oder Container-ID. Den DNS-Namen findest du im mStudio UI oder über `mw container list`.
- Sieh dir das PHP-Error-Log unter `/var/log/php_errors.log` und die Daemon-Logs mit `mw container logs tideways-daemon` auf Verbindungs- oder Authentifizierungsfehler an.
- Stelle sicher, dass der API-Key zu dem Tideways-Projekt gehört, das du dir gerade ansiehst.

### Die Extension wird nicht geladen {#troubleshooting-extension}

- Vergewissere dich, dass deine App eine PHP-Version verwendet, die die Extension enthält (siehe [Voraussetzungen](#prerequisites)).
- Stelle sicher, dass die Konfigurationsdatei in `~/.config/php/php.d/` liegt und die Endung `.ini` hat. `extension=tideways.so` hat in einer verzeichnisbezogenen `.user.ini`-Datei keine Wirkung.
- Prüfe das PHP-Error-Log deiner App unter `/var/log/php_errors.log` auf Meldungen über eine fehlgeschlagene Extension-Ladung.

### Für CLI-Skripte und Cronjobs fehlen Traces {#troubleshooting-cli}

Das Standardverhalten der Extension unterscheidet sich zwischen Web-Requests und CLI-Skripten. Wenn du Cronjobs, Queue-Worker oder Console-Commands überwachen möchtest, wirf einen Blick in die [Tideways-Dokumentation zu Background-Jobs und CLI-Monitoring](https://support.tideways.com/documentation/).

### Profiling einer containerisierten PHP-Anwendung {#troubleshooting-containers}

Diese Anleitung behandelt Managed PHP-Apps, bei denen mittwald den PHP-Build inklusive Tideways-Extension bereitstellt. Wenn du PHP stattdessen in einem eigenen Container betreibst, musst du die Extension selbst in dein Image installieren — folge dazu der [Docker-Installationsanleitung von Tideways](https://support.tideways.com/documentation/setup/installation/docker-with-compose.html). Das Daemon-Setup aus [Schritt 1](#daemon) bleibt unverändert.

## Weiterführende Ressourcen {#further-resources}

- [Tideways-Dokumentation](https://support.tideways.com/documentation/)
- [Tideways über die php.ini konfigurieren](https://support.tideways.com/documentation/setup/configuration/configure-tideways-globally-via-php-ini.html)
- [Konfigurationsreferenz des Tideways-Daemons](https://support.tideways.com/documentation/reference/daemon/configuration-reference.html)
- [Tideways-Browser-Extension](https://support.tideways.com/documentation/reference/browser-extension/chrome-extension.html)
- [PHP-Anwendungen verwalten und deployen](/docs/v2/platform/workloads/php)
- [Containerisierte Anwendungen verwalten und deployen](/docs/v2/platform/workloads/containers)
