---
sidebar_label: n8n
description: Erfahre, wie du einen n8n-Container aufsetzt, einzeln oder im Verbund mit anderen Apps
---

# n8n ausführen

## Einführung

n8n ist eine Automatisierungsplattform, mit der sich verschiedene Dienste und Anwendungen über sogenannte Workflows miteinander verbinden lassen. Sie funktioniert ähnlich zu Tools wie Zapier oder Make (ehemals Integromat), bietet aber mehr Flexibilität und Kontrolle – besonders für Entwickler:innen.

Mit n8n kannst du:

- Automatisierte Abläufe zwischen über 300+ Diensten (z. B. Slack, Google Sheets, GitHub, Datenbanken etc.) erstellen.
- Eigene Logik einbauen – z. B. mit Bedingungen, Schleifen, benutzerdefiniertem JavaScript.
- Die Software selbst hosten (Self-Hosting), was volle Datenhoheit ermöglicht.

## n8n Container erstellen

Du kannst n8n in deiner mittwald Hosting-Umgebung mit Containern bereitstellen. Es gibt verschiedene Hauptansätze:

### Verwendung der mStudio-Benutzeroberfläche

1. Gehe in deinem Projekt in mStudio auf den **Container**-Menüpunkt und erstelle einen neuen Container. Du kannst einen beliebigen Namen wählen.

2. Gib das Image `n8nio/n8n:stable` ein. Du kannst den Entrypoint und das Command wie vorgeschlagen beibehalten.

#### Volumes

Um die Daten deines n8n persistent zu speichern, definiere Volumes unter **Volumes** wie folgt:

- Neues Volume erstellen, auf **Pfad im Container** (Mount Point): `/root/.n8n`


#### Umgebungsvariablen

Setze die folgenden Umgebungsvariablen für den Container:

```dotenv
N8N_HOST=example.project.space
N8N_PORT=5678
N8N_PROTOCOL=https
NODE_ENV=production
WEBHOOK_URL=https://example.project.space/
GENERIC_TIMEZONE=Europe/Berlin
```

Hier passt du die Umgebungsvariablen `N8N_HOST` und `WEBHOOK_URL` auf den Host an, über den du die Weboberfläche von n8n erreichen möchtest.

#### Ports

Übernehme den vorgeschlagenen Standardport `5678`.

### Verwendung der CLI mit `mw container run`

Du kannst auch einen n8n-Container mit der mittwald CLI und dem Befehl `mw container run` bereitstellen:

```bash
mw container run \
  --name n8n \
  --env N8N_HOST=example.project.space \
  --env N8N_PORT=5678 \
  --env N8N_PROTOCOL=https \
  --env NODE_ENV=production \
  --env WEBHOOK_URL=https://example.project.space/ \
  --env GENERIC_TIMEZONE=Europe/Berlin \
  --volume n8n-data:/root/.n8n \
  --publish 5678:5678/tcp \
  --create-volumes \
  n8nio/n8n:stable  # alternatives: https://hub.docker.com/r/n8nio/n8n/tags
```

Dieser Befehl erstellt einen neuen Container namens "n8n" mit dem n8n-Image, setzt alle notwendigen Umgebungsvariablen und mountet Volumes für die persistente Datenspeicherung.

### Verwendung der CLI mit `mw stack deploy`

Wenn du Docker Compose bevorzugst, kannst du eine `docker-compose.yml`-Datei erstellen und sie mit dem Befehl `mw stack deploy` bereitstellen:

1. Erstelle eine `docker-compose.yml`-Datei mit folgendem Inhalt:

   ```yaml
   version: "3"
   services:
     n8n:
       image: n8nio/n8n:stable
       environment:
          - N8N_HOST=example.project.space
          - N8N_PORT=5678
          - N8N_PROTOCOL=https
          - NODE_ENV=production
          - WEBHOOK_URL=https://example.project.space/
          - GENERIC_TIMEZONE=Europe/Berlin
       ports:
          - "5678:5678"
       volumes:
          - n8n_data:/root/.n8n
   volumes:
     n8n_data:
   ```

2. Stelle den Stack mit der CLI bereit:

   ```bash
   mw stack deploy
   ```

Dieser Ansatz ist besonders nützlich, wenn du mehrere Container deployen möchtest, die zusammenarbeiten.

## Betrieb

Deine n8n-Daten werden im Rahmen des regelmäßigen Projektbackups gesichert und entsprechend auch wiederhergestellt werden.

### Use case: RAG mit postgreSQL

Random idea in a random place: We could create a special "example" react component,
wrapping such examples in a way they can be downloaded and directly passed to mw cli
without manual copy&paste. I miss the first or last line all the time because i dont
even read properly.

```
version: "3.9"
services:
  pgvector:
    image: ankane/pgvector:latest  # avoid manual pgvector extension installation, use proper image directly
    container_name: pgvector
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: n8n
    ports:
      - "5432:5432"
    volumes:
      - pgvector_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    environment:
      N8N_HOST: example.project.space
      N8N_PROTOCOL: https
      WEBHOOK_URL: https://example.project.space/
      GENERIC_TIMEZONE: Europe/Berlin
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: "admin"
      N8N_BASIC_AUTH_PASSWORD: "admin"
      N8N_DATABASE_POSTGRESDB_HOST: pgvector
      N8N_DATABASE_POSTGRESDB_PORT: 5432
      N8N_DATABASE_POSTGRESDB_DATABASE: n8n
      N8N_DATABASE_POSTGRESDB_USER: postgres
      N8N_DATABASE_POSTGRESDB_PASSWORD: postgres
      N8N_PORT: 5678
    ports:
      - "5678:5678"
    depends_on:
      - pgvector
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  pgvector_data:
    driver: local
  n8n_data:
    driver: local
```

CREATE TABLE meta (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    schema TEXT
);

CREATE TABLE rows (
    id SERIAL PRIMARY KEY,
    meta_id TEXT REFERENCES meta(id),
    row_data JSONB  -- Store the actual row data
);