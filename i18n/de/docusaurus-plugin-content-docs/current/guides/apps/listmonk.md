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

Du kannst eine PostgreSQL-Datenbank in einem separaten Container erstellen. Eine Anleitung zum Einrichten von PostgreSQL in einem Container findest du im [PostgreSQL-Leitfaden](/docs/v2/platform/databases/postgresql/).

:::

## Wie starte ich den Container?

Wir verwenden das `listmonk/listmonk`-Image von [Docker Hub](https://hub.docker.com/r/listmonk/listmonk) für den Container.

### Mit Terraform (Empfohlen) {#terraform}

Die komfortabelste Methode, um eine produktionsreife Listmonk-Instanz bereitzustellen, ist die Verwendung von [Terraform](/docs/v2/guides/deployment/terraform). Das folgende Beispiel zeigt, wie du Listmonk zusammen mit einer PostgreSQL-Datenbank als Container-Stack bereitstellen kannst:

```hcl
data "mittwald_container_image" "postgres" {
  image = "postgres:17"
}

data "mittwald_container_image" "listmonk" {
  image = "listmonk/listmonk:latest"
}

variable "project_id" {
  type = string
}

resource "random_password" "postgres_password" {
  length  = 24
  special = true
}

resource "mittwald_container_stack" "listmonk" {
  project_id    = var.project_id
  default_stack = true

  containers = {
    database = {
      description = "PostgreSQL database for Listmonk"
      image       = data.mittwald_container_image.postgres.image

      entrypoint = data.mittwald_container_image.postgres.entrypoint
      command    = data.mittwald_container_image.postgres.command

      environment = {
        POSTGRES_DB       = "listmonk"
        POSTGRES_USER     = "listmonk"
        POSTGRES_PASSWORD = random_password.postgres_password.result
      }

      volumes = [
        {
          volume     = "database"
          mount_path = "/var/lib/postgresql/data"
        }
      ]

      ports = [
        {
          container_port = 5432
          protocol       = "tcp"
        }
      ]
    }

    listmonk = {
      description = "Listmonk newsletter application"
      image       = data.mittwald_container_image.listmonk.image

      entrypoint = data.mittwald_container_image.listmonk.entrypoint
      command    = ["sh", "-c", "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"]

      environment = {
        LISTMONK_app__address = "0.0.0.0:9000"
        LISTMONK_db__host     = "database"
        LISTMONK_db__port     = "5432"
        LISTMONK_db__user     = "listmonk"
        LISTMONK_db__password = random_password.postgres_password.result
        LISTMONK_db__database = "listmonk"
        LISTMONK_db__ssl_mode = "disable"
      }

      volumes = [
        {
          volume     = "uploads"
          mount_path = "/listmonk/uploads"
        }
      ]

      ports = [
        {
          container_port = 9000
          public_port    = 9000
          protocol       = "tcp"
        }
      ]
    }
  }

  volumes = {
    database = {}
    uploads  = {}
  }
}
```

:::note

Diese Konfiguration verwendet das `--install --idempotent`-Flag, das sicherstellt, dass die Datenbankinstallation nur einmal bei einer leeren Datenbank während des ersten Starts erfolgt. Das `--upgrade`-Flag führt automatisch alle Datenbankmigrationen aus, wenn ein neues Image gezogen wird.

:::

### Über die mStudio-Oberfläche {#mstudio-ui}

In mStudio gehst du zu deinem Projekt und wählst **"Container erstellen"** aus. Ein geführter Dialog öffnet sich, um dich bei der Container-Einrichtung zu unterstützen.

Gib zuerst eine Beschreibung ein – dies ist ein Freitextfeld, das zur Identifizierung des Containers verwendet wird. Gib zum Beispiel **"Listmonk"** ein und klicke auf **"Weiter"**.

Als Nächstes wirst du nach dem Image-Namen gefragt. Gib `listmonk/listmonk` ein und bestätige mit **"Weiter"**.

#### Entrypoint und Command {#entrypoint-and-command}

Konfiguriere Listmonk so, dass es mit automatischer Datenbankinitialisierung und -upgrades startet:

- **Entrypoint:** Keine Änderungen erforderlich
- **Command:** Wähle **"Benutzerdefiniert"** aus und gib `sh -c "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"` ein

:::note

Dieser Befehl verwendet das `--install --idempotent`-Flag, das sicherstellt, dass die Datenbankinstallation nur einmal bei einer leeren Datenbank während des ersten Starts erfolgt. Das `--upgrade`-Flag führt automatisch alle Datenbankmigrationen aus, wenn der Container aktualisiert wird. Dieser Ansatz eliminiert die Notwendigkeit, die Datenbank manuell zu initialisieren oder den Befehl nach dem ersten Durchlauf zu ändern.

:::

#### Volumes {#volumes}

Um hochgeladene Dateien und Medien dauerhaft zu speichern, füge ein Volume hinzu:

- **Pfad im Container:** `/listmonk/uploads`

:::caution

Ohne dieses Volume gehen alle über Listmonk hochgeladenen Dateien (wie Bilder für Kampagnen) verloren, wenn der Container neu erstellt oder neu gestartet wird.

:::

#### Umgebungsvariablen {#environment-variables}

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
LISTMONK_db__ssl_mode=disable
```

Ersetze die Platzhalter (`<DB_HOST>`, `<DB_USER>`, `<DB_PASSWORD>`, `<DB_NAME>`) durch deine PostgreSQL-Datenbankverbindungsdetails.

:::caution

Stelle sicher, dass du ein sicheres Passwort für deine Datenbankverbindung verwendest. Das Datenbankpasswort wird als Klartext in der Container-Konfiguration gespeichert.

:::

Nachdem du alle Umgebungsvariablen eingegeben hast, klicke auf **"Weiter"**. Im letzten Dialog wirst du nach dem **Port** gefragt – du kannst diesen unverändert bei `9000` lassen. Klicke auf **"Container erstellen"**, um den Container zu erstellen und zu starten.

### Alternative: Über den Befehl `mw container run` {#mw-container-run}

Du kannst auch den Befehl `mw container run` verwenden, um direkt von der Kommandozeile aus einen Listmonk-Container zu erstellen und zu starten. Dieser Ansatz ist ähnlich wie die Verwendung der Docker-CLI und ermöglicht es dir, alle Container-Parameter in einem einzigen Befehl anzugeben.

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
  --env "LISTMONK_db__ssl_mode=disable" \
  --volume "listmonk-uploads:/listmonk/uploads" \
  --create-volumes \
  -- \
  listmonk/listmonk \
  sh -c "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Datenbankkonfigurationsdetails ersetzt. Nach dem Erstellen des Containers musst du noch eine Domain zuweisen.

### Alternative: Über den Befehl `mw stack deploy` {#mw-stack-deploy}

Alternativ kannst du den Befehl `mw stack deploy` verwenden, der mit Docker Compose kompatibel ist. Dieser Ansatz ermöglicht es dir, deine Container-Konfiguration in einer YAML-Datei zu definieren und mit einem einzigen Befehl bereitzustellen.

Erstelle zunächst eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
services:
  listmonk:
    image: listmonk/listmonk
    command:
      [
        "sh",
        "-c",
        "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''",
      ]
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
      LISTMONK_db__ssl_mode: "disable"

volumes:
  listmonk-uploads: {}
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Datenbankkonfigurationsdetails ersetzt.

Dann stelle den Container mit dem Befehl `mw stack deploy` bereit:

```shellsession
user@local $ mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml`-Datei aus dem aktuellen Verzeichnis und stellt sie auf deinem Standard-Stack bereit.

## Domain zuweisen {#assign-domain}

Um Listmonk vom öffentlichen Internet aus zugänglich zu machen, musst du es mit einer Domain verbinden:

1. In mStudio navigierst du zu **"Domains"** in der linken Seitenleiste
2. Wähle die Domain aus, die du verwenden möchtest (z. B. `listmonk.example.com`)
3. Unter **"Domainziel einstellen"** wählst du **"Container"** aus
4. Wähle deinen Listmonk-Container aus dem Dropdown-Menü
5. Der Port wird automatisch auf `9000` gesetzt
6. Klicke auf den grünen **"Speichern"**-Button, um die Änderungen anzuwenden

Nach einigen Augenblicken solltest du in der Lage sein, auf Listmonk über deine konfigurierte Domain zuzugreifen.

:::danger

**WICHTIG: Sichere deine Installation sofort!**

Beim ersten Zugriff auf die Listmonk-Weboberfläche wirst du aufgefordert, ein Administratorkonto zu erstellen. **Du musst dies sofort tun**, nachdem du die Domain verbunden hast, bevor jemand anderes auf deine Instanz zugreifen kann.

Bis du ein Administratorkonto erstellst, ist deine Listmonk-Installation vollständig ungesichert und jeder, der die URL entdeckt, kann das Admin-Konto einrichten und die volle Kontrolle über dein Newsletter-System erlangen, einschließlich Zugriff auf alle Abonnentendaten.

Stelle sicher, dass du:

- Die Weboberfläche sofort nach der Domain-Zuweisung aufrufst
- Ein starkes, einzigartiges Passwort für das Administratorkonto verwendest
- Den Einrichtungsprozess ohne Verzögerung abschließt

:::

## Betrieb

### Datenbank-Setup {#database-setup}

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
    command:
      [
        "sh",
        "-c",
        "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''",
      ]
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
      LISTMONK_db__ssl_mode: "disable"
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
