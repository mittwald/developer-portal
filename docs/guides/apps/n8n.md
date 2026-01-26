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

Deine n8n-Daten werden im Rahmen des regelmäßigen Projektbackups gesichert und können entsprechend auch wiederhergestellt werden.

### Use case: RAG mit postgreSQL und Mittwald AI-Hosting

n8n kann benutzt werden, um RAG Systeme verschiedenster Form aufzubauen. Das folgende Beispiel zeigt einen möglichen Aufbau, aufgrund des großen n8n-Ökosystems ist dies aber lediglich einer von vielen Wegen. Viel mehr soll dieses Beispiel als Einstieg dienen, um im Anschluss komplexere und vor allem produktionsreife Systeme aufzusetzen.

#### Vorraussetzungen

- Mittwald Container Hosting
- Mittwald AI-Hosting
- mStudio Zugriff, per Webapp und API-Token
- `mw` CLI, Deployment des Container Verbunds

#### Einführung, grundlegender Aufbau

Das Ziel ist, einem KI-Agenten Zugriff auf Informationen aus Dokumenten zu gewähren, sodass sich Agenten in ihren Aktionen / Anworten auf eben diese Dokumente beziehen können. Solche Dukumente können konkret vieles sein, z.B. Anleitungen, Handbücher oder gar Excel-Mappen mit vielen Daten.

Um dieses Ziel zu erriechen ist eine Persistenzschicht nötig, in der Informationen "KI-freundlich" abgelegt werden können. Unter der Haube kommen mindestens zwei KI-Modelle zum Einsatz: Eines zum Erzeugen sog. "Embeddings" und ein weiteres um den Agenten zu steuern. Embeddings sind dabei die "KI-freundliche" Art, Texte und Dokumente für KIs zu persistieren, sodass diese schnell zum Kontext einer Unterhaltung beigesteuert werden können.

Im Beispiel kommen diese zwei Modelle aus dem Mittwald KI-Hosting zum Einsatz:

- **Embedding**: `Qwen3-Embedding-8B`
- **Agent**: `Devstral-Small-2-24B-Instruct-2512`

Zum Speichern der Embeddings wird eine Vektordatenbank benötigt. Hier gibts es mehrere Möglichkeiten, das Beispiel nutzt `postgreSQL` mit der `pgvector` Extension. Dafür gibt es ein vorbereitetes Docker Image, das hier benutzt werden kann.

Der aufgebaute Verbund von Containern besteht also mindestens aus:

- **n8n**: Erstellung und Betrieb RAG
- **pgvector**: Vektordatenbank für Embeddings

#### Installation

Sind alle Vorraussetzungen gegeben, kann mit der Installation begonnen werden. Zunächst erstellen wir die Docker Compose Datei:

```
version: "3.9"
services:
  pgvector:
    image: ankane/pgvector:latest
    container_name: pgvector
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
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
      N8N_BASIC_AUTH_USER: ${N8N_BASIC_AUTH_USER}
      N8N_BASIC_AUTH_PASSWORD: ${N8N_BASIC_AUTH_PASSWORD}
      N8N_HOST: ${N8N_HOST}
      WEBHOOK_URL: ${WEBHOOK_URL}
      N8N_DATABASE_POSTGRESDB_USER: ${POSTGRES_USER}
      N8N_DATABASE_POSTGRESDB_PASSWORD: ${POSTGRES_PASSWORD}
      NODES_EXCLUDE: ${NODES_EXCLUDE}
      N8N_PROTOCOL: https
      GENERIC_TIMEZONE: Europe/Berlin
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_DATABASE_POSTGRESDB_HOST: pgvector
      N8N_DATABASE_POSTGRESDB_PORT: 5432
      N8N_DATABASE_POSTGRESDB_DATABASE: n8n
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

Alle kritischen Einstellungen wie z.B. Passwörter werden als Umgebungsvariablen eingegeben. Dies erlaubt u.a. das schnelle Aufsetzen mehrerer Umgebungen, z.B. für Test- und Produktivbetrieb.

Die konkreten Einstellungen schreiben wir dann in eine `.env` Datei:

```
N8N_HOST=example.project.space
WEBHOOK_URL=https://example.project.space/
N8N_BASIC_AUTH_USER=<basic auth user>
N8N_BASIC_AUTH_PASSWORD=<basic auth password>
POSTGRES_USER=<postgres user>
POSTGRES_PASSWORD=<postgres password>
NODES_EXCLUDE=[]
```

Zur einfachen Unterscheidung wird empfohlen, den `.env` Dateien sprechende Namen zu geben, z.B. `test.env` oder `prod.env`.

ATTN: `NODES_EXCLUDE=[]` aktiviert **alle** Knoten für die Benutzung. Einige dieser Knoten können ein Sicherheitsrisiko darstellen. Zum Testen kann dies sehr nützlich sein, für produktive Umgebungen wird empfohlen, eine genaue Liste unerwünschter Knoten zu pflegen.

Sind alle Einstellungen vorbereitet, kann der Verbund ausgeliefert werden:

```
mw stack deploy -c path/to/n8n/docker-compose.yml --env-file path/to/n8n/example.env
```

Sehen wir in der Konsole eine Erfolgsmeldung, kontrollieren wir die neuen Container im mStudio und haben somit den Installationsschritt abgeschlossen!

#### Beispiel-Workflow

**HIER EINFÜGEN / LINK**

#### Einrichtung

Nach der Installation setzen wir das RAG-System in n8n auf und richten das System ein. Zunächst aktivieren wir einen n8n-Lizenzschlüssel und laden die Basisknoten zur Workflowerstellung herunter. Die benötigten Knoten liegen in `n8n-nodes-base`und können direkt aus der Applikation heraus heruntergeladen und installiert werden.

ATTN: Prüfe stets **vor** dem Ausführen eines Workflows, ob alle beteiligten Knoten vorhanden und korrekt verbunden sind. n8n-Fehlermeldungen können sehr technisch oder gar irreführend sein, eine Kontrolle im Vorfeld lohnt sich um Arbeit bei der Fehlersuche zu sparen.

Neben dem bloßen Vorhandensein müssen einige der Knoten korrekt konfiguriert werden.

Benötigt wird:
- Zugang zum Mittwald AI-Hosting ( oder vergleichbarer, OpenAI-kompatibler Host ) mit API-Key
- Zugang zur Datenbank, Benutzer und Passwort haben wir bereits im Container-Verbund vorbereitet

**Security:** Für den Produktivbetrieb ist es sauberer, mehrere Datenbankbenutzer mit unterschiedlichen Privilegien zu pflegen. Dies bedarf allerdings händischer Anpassungen am Datenbank-Container, diee hier aus Komplexitätsgründen nicht weiter ausgeführt werden. Grundsätzlich sollte der mit Benutzereingaben arbeitende Datenbankbenutzer des KI-Agenten **keine** Berechtigung haben, das Datenbankschema zu ändern!

Wir erstellen also Zugangsdaten für die Datenbank und den KI-Host, anschließend weisen wir diese den entsprechenden Knoten zu. Beim Anlegen der Zugangsdaten wird bereits die Verbindung geprüft, d.h. wir sehen direkt, ob unser Verbund sauber arbeitet.

#### Betrieb - Webhook

Lasse den initialen Webhook lauschen im Test-Modus, dann kann man testen, z.B. per postman oder curl, die genaue URL wird dabei angezeigt:

```
curl -X POST -d '{
  "chatInput": "Hello World!",
  "sessionId": 42
}' -H "Content-Type: application/json" https://example.project.space/webhook-test/<webhook uuid>
```

Solange unser RAG noch nicht mit Dokumenten befüllt ist, haben wir hier einen einfachen Chatbot mit dem im Model "eingebackenen" Weltwissen. Fragen wir explizit, erklärt sich der Agent auch:

```
curl -X POST -d '{
  "chatInput": "How many documents do you know?",
  "sessionId": 42
}' -H "Content-Type: application/json" https://n8n.p-zrxbea.project.space/webhook-test/bf4dd093-bb02-472c-9454-7ab9af97bd1d
{"output":"I currently do not have access to any documents in my knowledge base. If you'd like, I can help answer questions based on general knowledge or assist with other tasks."}
```

**Security:** Für produktiven Betrieb müssen Webhooks mit einer Authentifizierungsmethode abgesichert werden. Nach Möglichkeit sollten Webhooks nicht weiter exponiert, sondern von einer anderen Applikation des Stakcs konsumiert werden.

#### Betrieb - RAG, Dateisystem
