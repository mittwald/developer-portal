---
sidebar_label: Listmonk
description: Installiere und betreibe Listmonk containerisiert als Self-hosted Newsletter-Tool.
---

# Listmonk ausführen

## Einführung

**Listmonk** ist ein leistungsfähiges Self-Hosted-Tool zur Verwaltung und zum Versand von Newslettern. Es bietet eine eigenständige Alternative zu kommerziellen Plattformen wie Mailchimp oder Sendinblue.

Die Anwendung kombiniert eine moderne Weboberfläche mit einem performanten Backend und nutzt PostgreSQL als Datenbank.

### Voraussetzungen

1. **mStudio-Projekt mit spaceServer oder proSpace dedicated**
2. **Laufender PostgreSQL-Container**  
   → Beachte die Anleitung im Abschnitt [PostgreSQL](./postgresql.md) und halte DB-Zugangsdaten bereit.
3. **Angelegte Subdomain** für den Webzugriff (z.B. `listmonk.meine-domain.de`)

### Weiterführende Links

- [Offizielle Website – Listmonk](https://listmonk.app/)
- [Listmonk Dokumentation](https://listmonk.app/docs/configuration/)
- [Docker Hub – listmonk](https://hub.docker.com/r/listmonk/listmonk)

## Deployment der Workload

### Deployment via Terraform (empfohlen)

Erstelle eine Terraform-Konfiguration für Listmonk:

```hcl
data "mittwald_container_image" "postgres" {
  name = "postgres:17"
}

data "mittwald_container_image" "listmonk" {
  name = "listmonk/listmonk:latest"
}

variable "project_id" {
  type = string
}

variable "postgres_password" {
  type = string
  sensitive = true
}

resource "mittwald_container_stack" "listmonk" {
  project_id    = var.project_id
  default_stack = true

  containers = {
    database = {
      description = "PostgreSQL database for Listmonk"
      image       = data.mittwald_container_image.postgres.name

      entrypoint = data.mittwald_container_image.postgres.entrypoint
      command    = data.mittwald_container_image.postgres.command

      environment = {
        POSTGRES_DB       = "listmonk"
        POSTGRES_USER     = "listmonk"
        POSTGRES_PASSWORD = var.postgres_password
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
      image       = data.mittwald_container_image.listmonk.name

      entrypoint = data.mittwald_container_image.listmonk.entrypoint
      command    = data.mittwald_container_image.listmonk.command

      environment = {
        LISTMONK_app__address = "0.0.0.0:9000"
        LISTMONK_db__host     = "database"
        LISTMONK_db__port     = "5432"
        LISTMONK_db__user     = "listmonk"
        LISTMONK_db__password = var.postgres_password
        LISTMONK_db__database = "listmonk"
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

Für die Erstinstallation muss Listmonk mit `./listmonk --install --yes` initialisiert werden. Dies kann nach dem Deployment manuell durchgeführt werden.

### Deployment via mStudio UI

#### Container anlegen

- Öffne dein Projekt in **mStudio**
- Navigiere zu **"Container" → "Neu anlegen"**
- Als Beschreibung kannst du z. B. `"listmonk"` angeben
- Im nächsten Schritt gibst du folgendes Image an:

`listmonk/listmonk`

#### Entrypoint für Erstinstallation setzen

Für die erste Ausführung muss Listmonk initialisiert werden. Wähle bei _Command_ die Option **"Benutzerdefiniert"** und trage ein:

`./listmonk --install --yes`

> Dieser Befehl legt die nötigen Tabellen in der PostgreSQL-Datenbank an und startet die Weboberfläche.

#### Volume anlegen

Füge ein neues Volume hinzu:

- **Pfad im Container:** `/listmonk/uploads`

:::warning
Der Container verhält sich wie ein temporärer Speicher. Verwende das Volume unbedingt, um Uploads dauerhaft zu sichern.
:::

#### Umgebungsvariablen definieren

Klicke auf **"Texteingabe"** und gib folgende Umgebungsvariablen ein:

```
LISTMONK_app__address=0.0.0.0:9000
LISTMONK_db__host=<DB_HOST>
LISTMONK_db__port=5432
LISTMONK_db__user=<DB_USER>
LISTMONK_db__password=<DB_PASSWORD>
LISTMONK_db__database=<DB_NAME>
```

Ersetze `<...>` mit den Werten deines PostgreSQL-Containers.

#### Port festlegen

Der Standardport `9000/tcp` wird automatisch gesetzt und kann so belassen werden.

#### Container starten

Abschließend wird der Container erstellt. Nach kurzer Zeit sollte der Status auf **"läuft"** stehen. Die Datenbank-Initialisierung ist damit abgeschlossen.

#### Weitere Einstellungen

**Entrypoint ändern**

Nach der erfolgreichen Installation muss der Entrypoint auf den regulären Startbefehl geändert werden:

```
./listmonk
```

Der Container wird anschließend **neu erstellt**.

#### Domain mit dem Container verknüpfen

Damit der Aufruf funktioniert, muss die angelegte Domain mit dem Container verknüpft werden:

1.  Klicke im Menü auf der linken Seite auf **"Domains"**.
2.  Wähle die entsprechende Domain, z. B. `listmonk.meine-domain.de`.
3.  Es öffnet sich ein Menü – wähle unter **"Domainziel einstellen"** den Eintrag **"Container"** aus.
4.  Wähle im Dropdown-Menü den Namen des Containers (standardmäßig `"listmonk"`).
5.  Der Port wird automatisch gesetzt.
6.  Bestätige die Einstellung mit dem grünen **"Speichern"**-Button unten rechts.

Kurz darauf kannst du den Aufruf testen und solltest die Login-Seite von Listmonk sehen. Lege nun über die Weboberfläche den **Admin-User** an und führe die weiteren Einstellungen direkt dort durch.

### Deployment über CLI via `mw container run`

Starte zuerst den PostgreSQL-Container:

```bash
mw container run \
  --name listmonk-postgresql \
  --env POSTGRES_DB=listmonk \
  --env POSTGRES_USER=listmonk \
  --env POSTGRES_PASSWORD=<SICHERES_PASSWORT> \
  --publish 5432:5432 \
  --volume listmonk-database:/var/lib/postgresql/data \
  --create-volumes \
  postgres:16
```

Starte anschließend den Listmonk-Container für die Erstinstallation:

```bash
mw container run \
  --name listmonk \
  --env LISTMONK_app__address=0.0.0.0:9000 \
  --env LISTMONK_db__host=listmonk-postgresql \
  --env LISTMONK_db__port=5432 \
  --env LISTMONK_db__user=listmonk \
  --env LISTMONK_db__password=<SICHERES_PASSWORT> \
  --env LISTMONK_db__database=listmonk \
  --publish 9000:9000 \
  --volume listmonk-uploads:/listmonk/uploads
  --create-volumes \
  -- \
  listmonk/listmonk ./listmonk --install --yes
```

Nach der Erstinstallation erstelle den Container mit dem normalen Startbefehl neu:

```bash
mw container update listmonk --command "./listmonk" --recreate
```

### Deployment über CLI via `mw stack deploy`

Erstelle eine `stack.yaml`-Datei:

```yaml
services:
  database:
    image: postgres:16
    environment:
      POSTGRES_DB: listmonk
      POSTGRES_USER: listmonk
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - listmonk-database:/var/lib/postgresql/data
    ports:
      - 5432:5432

  listmonk:
    image: listmonk/listmonk
    command: ["./listmonk"]
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: database
      LISTMONK_db__port: "5432"
      LISTMONK_db__user: listmonk
      LISTMONK_db__password: ${POSTGRES_PASSWORD}
      LISTMONK_db__database: listmonk
    volumes:
      - listmonk-uploads:/listmonk/uploads
    ports:
      - 9000:9000
    depends_on:
      - database

volumes:
  listmonk-database:
  listmonk-uploads:
```

Führe das Deployment durch:

```bash
export POSTGRES_PASSWORD="dein-sicheres-passwort"
mw stack deploy stack.yaml
```

Für die Erstinstallation muss das Command temporär auf `["./listmonk", "--install", "--yes"]` gesetzt werden.
