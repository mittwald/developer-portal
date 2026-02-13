---
sidebar_label: Listmonk
description: Erfahre, wie du Listmonk in einer containerisierten Umgebung einrichtest und ausführst
---

# Listmonk ausführen

## Einführung

Listmonk ist ein selbst gehosteter Newsletter- und Mailinglisten-Manager. Es handelt sich um eine eigenständige, in sich geschlossene Anwendung, die du auf deinem eigenen Server betreiben kannst. Es bietet eine moderne Weboberfläche für die Verwaltung von Abonnenten, das Erstellen von Kampagnen und das Tracking von Metriken. Listmonk ist darauf ausgelegt, schnell, effizient und funktionsreich zu sein und ist eine ausgezeichnete Open-Source-Alternative zu kommerziellen E-Mail-Marketing-Plattformen.

> listmonk ist ein eigenständiger, selbst gehosteter Newsletter- und Mailinglisten-Manager. Er ist schnell, funktionsreich und in eine einzige Binärdatei verpackt. Er verwendet eine PostgreSQL-Datenbank (⩾ v12) als Datenspeicher.  
> – [Listmonk-Dokumentation](https://listmonk.app/docs/)

## Voraussetzungen

Um Listmonk auszuführen, benötigst du:

- Zugriff auf ein mittwald mStudio-Projekt
- Ein Hosting-Paket, das [containerisierte Workloads](/docs/v2/platform/workloads/containers) unterstützt
- Eine PostgreSQL-Datenbank (Version 12 oder höher)

:::note

Du kannst eine PostgreSQL-Datenbank in einem separaten Container erstellen. Eine Anleitung zum Einrichten von PostgreSQL in einem Container findest du im [PostgreSQL-Leitfaden](./postgresql).

:::

## Wie starte ich den Container?

Wir verwenden das `listmonk/listmonk`-Image von [Docker Hub](https://hub.docker.com/r/listmonk/listmonk) für den Container.

### Über die mStudio-Oberfläche

In mStudio gehst du zu deinem Projekt und wählst **"Container erstellen"** aus. Ein geführter Dialog öffnet sich, um dich bei der Container-Einrichtung zu unterstützen.

Gib zuerst eine Beschreibung ein – dies ist ein Freitextfeld, das zur Identifizierung des Containers verwendet wird. Gib zum Beispiel **"Listmonk"** ein und klicke auf **"Weiter"**.

Als Nächstes wirst du nach dem Image-Namen gefragt. Gib `listmonk/listmonk` ein und bestätige mit **"Weiter"**.

#### Entrypoint und Command {#ui-entrypoint-und-command}

Für die initiale Installation muss Listmonk das Datenbankschema initialisieren:

- **Entrypoint:** Keine Änderungen erforderlich
- **Command:** Wähle **"Benutzerdefiniert"** aus und gib `./listmonk --install --yes` ein

:::note

Dieser Befehl erstellt die notwendigen Datenbanktabellen und bereitet Listmonk für die erste Verwendung vor. Nach Abschluss der initialen Installation musst du den Befehl zurück auf den Standard (`./listmonk`) ändern und den Container neu starten.

:::

#### Volumes {#ui-volumes}

Um hochgeladene Dateien und Medien dauerhaft zu speichern, füge ein Volume hinzu:

- **Pfad im Container:** `/listmonk/uploads`

:::caution

Ohne dieses Volume gehen alle über Listmonk hochgeladenen Dateien (wie Bilder für Kampagnen) verloren, wenn der Container neu erstellt oder neu gestartet wird.

:::

#### Umgebungsvariablen {#ui-umgebungsvariablen}

Konfiguriere Listmonk für die Verbindung zu deiner PostgreSQL-Datenbank. Klicke auf **"Texteingabe"** und gib die folgenden Umgebungsvariablen ein:

```
# Anwendungseinstellungen
LISTMONK_app__address=0.0.0.0:9000

# Datenbankkonfiguration
LISTMONK_db__host=<DB_HOST>
LISTMONK_db__port=5432
LISTMONK_db__user=<DB_USER>
LISTMONK_db__password=<DB_PASSWORD>
LISTMONK_db__database=<DB_NAME>
```

Ersetze die Platzhalter (`<DB_HOST>`, `<DB_USER>`, `<DB_PASSWORD>`, `<DB_NAME>`) durch deine PostgreSQL-Datenbankverbindungsdetails.

:::caution

Stelle sicher, dass du ein sicheres Passwort für deine Datenbankverbindung verwendest. Das Datenbankpasswort wird als Klartext in der Container-Konfiguration gespeichert.

:::

Nachdem du alle Umgebungsvariablen eingegeben hast, klicke auf **"Weiter"**. Im letzten Dialog wirst du nach dem **Port** gefragt – du kannst diesen unverändert bei `9000` lassen. Klicke auf **"Container erstellen"**, um den Container zu erstellen und zu starten.

#### Schritte nach der Installation {#ui-schritte-nach-installation}

Nachdem die initiale Installation abgeschlossen ist und der Container läuft, musst du den Startbefehl ändern:

1. In mStudio navigierst du zu deinem Listmonk-Container
2. Klicke auf **"Einstellungen"** oder **"Bearbeiten"**
3. Ändere das **Command** von `./listmonk --install --yes` zurück auf `./listmonk`
4. Speichere die Änderungen und starte den Container neu

### Alternative: Über den Befehl `mw container run`

Du kannst auch den Befehl `mw container run` verwenden, um direkt von der Kommandozeile aus einen Listmonk-Container zu erstellen und zu starten. Dieser Ansatz ist ähnlich wie die Verwendung der Docker-CLI und ermöglicht es dir, alle Container-Parameter in einem einzigen Befehl anzugeben.

Für die initiale Installation verwende den folgenden Befehl:

```shellsession
user@local $ mw container run \
  --name listmonk \
  --description "Listmonk Newsletter Manager" \
  --publish 9000:9000 \
  --env "LISTMONK_app__address=0.0.0.0:9000" \
  --env "LISTMONK_db__host=<DB_HOST>" \
  --env "LISTMONK_db__port=5432" \
  --env "LISTMONK_db__user=<DB_USER>" \
  --env "LISTMONK_db__password=<DB_PASSWORD>" \
  --env "LISTMONK_db__database=<DB_NAME>" \
  --volume "listmonk-uploads:/listmonk/uploads" \
  --create-volumes \
  -- \
  listmonk/listmonk ./listmonk --install --yes
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Datenbankkonfigurationsdetails ersetzt.

Nachdem die Installation abgeschlossen ist, aktualisiere den Container, um den normalen Startbefehl zu verwenden:

```shellsession
user@local $ mw container update listmonk --command "./listmonk" --recreate
```

Nach dem Erstellen des Containers musst du noch eine Domain zuweisen.

### Alternative: Über den Befehl `mw stack deploy`

Alternativ kannst du den Befehl `mw stack deploy` verwenden, der mit Docker Compose kompatibel ist. Dieser Ansatz ermöglicht es dir, deine Container-Konfiguration in einer YAML-Datei zu definieren und mit einem einzigen Befehl bereitzustellen.

Erstelle zunächst eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
services:
  listmonk:
    image: listmonk/listmonk
    command: ["./listmonk"]
    ports:
      - "9000:9000"
    volumes:
      - "listmonk-uploads:/listmonk/uploads"
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: "<DB_HOST>"
      LISTMONK_db__port: "5432"
      LISTMONK_db__user: "<DB_USER>"
      LISTMONK_db__password: "<DB_PASSWORD>"
      LISTMONK_db__database: "<DB_NAME>"

volumes:
  listmonk-uploads: {}
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Datenbankkonfigurationsdetails ersetzt.

:::note

Für die initiale Installation ändere den Befehl vorübergehend auf `["./listmonk", "--install", "--yes"]`, stelle den Stack bereit, warte bis die Installation abgeschlossen ist, ändere ihn dann zurück auf `["./listmonk"]` und stelle erneut bereit.

:::

Dann stelle den Container mit dem Befehl `mw stack deploy` bereit:

```shellsession
user@local $ mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml`-Datei aus dem aktuellen Verzeichnis und stellt sie auf deinem Standard-Stack bereit.

## Domain zuweisen {#domain-zuweisen}

Um Listmonk vom öffentlichen Internet aus zugänglich zu machen, musst du es mit einer Domain verbinden:

1. In mStudio navigierst du zu **"Domains"** in der linken Seitenleiste
2. Wähle die Domain aus, die du verwenden möchtest (z. B. `listmonk.example.com`)
3. Unter **"Domainziel einstellen"** wählst du **"Container"** aus
4. Wähle deinen Listmonk-Container aus dem Dropdown-Menü
5. Der Port wird automatisch auf `9000` gesetzt
6. Klicke auf den grünen **"Speichern"**-Button, um die Änderungen anzuwenden

Nach einigen Augenblicken solltest du in der Lage sein, auf Listmonk über deine konfigurierte Domain zuzugreifen. Beim ersten Zugriff auf die Weboberfläche musst du ein Administratorkonto erstellen.

:::caution

Wenn du zum ersten Mal auf die Listmonk-Weboberfläche zugreifst, wirst du aufgefordert, ein Administratorkonto zu erstellen. Stelle sicher, dass du ein starkes Passwort verwendest, da dieses Konto vollen Zugriff auf alle Funktionen und Abonnentendaten hat.

:::

## Betrieb

### Datenbank-Setup {#datenbank-setup}

Wenn du Listmonk zusammen mit einer PostgreSQL-Datenbank in einem Container-Stack bereitstellst, kannst du das folgende Beispiel verwenden, um beide Container gemeinsam bereitzustellen:

```yaml
services:
  database:
    image: postgres:17
    ports:
      - "5432:5432"
    volumes:
      - "listmonk-database:/var/lib/postgresql/data"
    environment:
      POSTGRES_DB: "listmonk"
      POSTGRES_USER: "listmonk"
      POSTGRES_PASSWORD: "<SICHERES_PASSWORT>"

  listmonk:
    image: listmonk/listmonk
    command: ["./listmonk"]
    ports:
      - "9000:9000"
    volumes:
      - "listmonk-uploads:/listmonk/uploads"
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: "database"
      LISTMONK_db__port: "5432"
      LISTMONK_db__user: "listmonk"
      LISTMONK_db__password: "<SICHERES_PASSWORT>"
      LISTMONK_db__database: "listmonk"
    depends_on:
      - database

volumes:
  listmonk-database: {}
  listmonk-uploads: {}
```

:::caution

Ersetze `<SICHERES_PASSWORT>` durch ein starkes, zufällig generiertes Passwort. Verwende in Produktionsumgebungen keine Standardpasswörter.

:::

### Backups {#backups}

Deine Listmonk-Daten werden an zwei Orten gespeichert:

1. **PostgreSQL-Datenbank**: Enthält Abonnenten, Kampagnen und Einstellungen
2. **Uploads-Volume**: Enthält über die Weboberfläche hochgeladene Mediendateien

Beide sind in den regelmäßigen Projekt-Backups enthalten und können bei Bedarf wiederhergestellt werden. Für zusätzlichen Schutz solltest du in Erwägung ziehen, automatische Datenbank-Backups mit den integrierten Tools von PostgreSQL einzurichten.

## Weiterführende Ressourcen

- [Offizielle Listmonk-Website](https://listmonk.app/)
- [Listmonk-Dokumentation](https://listmonk.app/docs/)
- [Listmonk auf Docker Hub](https://hub.docker.com/r/listmonk/listmonk)
- [Listmonk GitHub-Repository](https://github.com/knadh/listmonk)
- [Container-Workloads-Dokumentation](/docs/v2/platform/workloads/containers)
