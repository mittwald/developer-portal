---
sidebar_label: Open WebUI
description: Lerne, wie du Open WebUI in einer Container-Umgebung einrichtest und betreibst
---

# Open WebUI betreiben

## Einführung

> Open WebUI ist eine erweiterbare, funktionsreiche und benutzerfreundliche selbst gehostete WebUI, die vollständig offline betrieben werden kann. Es unterstützt verschiedene LLM-Runner, einschließlich Ollama und OpenAI-kompatible APIs.
> – [Open WebUI GitHub](https://github.com/open-webui/open-webui)

Open WebUI lässt sich als ChatGPT-ähnliches Interface im Container-Hosting von mittwald betreiben. Sofern dein Projekt in einem Container-fähigen Produkt angesiedelt ist, kann es beim Anlegen des API-Keys für [mittwald AI Hosting](/docs/v2/platform/aihosting/) automatisch mit installiert und konfiguriert werden.

## Voraussetzungen

- Zugriff auf ein mittwald mStudio-Projekt
- Ein Hosting-Produkt, das [Container-Workloads](/docs/v2/platform/workloads/containers) unterstützt
- (Optional) Ein [mittwald AI Hosting API-Key](/docs/v2/platform/aihosting/access-and-usage/access) zum Verbinden mit gehosteten KI-Modellen

## Wie starte ich den Container?

Wir verwenden das Image `ghcr.io/open-webui/open-webui:main` aus der [GitHub Container Registry](https://github.com/open-webui/open-webui/pkgs/container/open-webui) für den Container.

### Über das mStudio UI

Gehe in mStudio zu deinem Projekt und wähle **„Container erstellen"**. Ein geführter Dialog öffnet sich, um dir beim Container-Setup zu helfen.

Gib zunächst eine Beschreibung ein – dies ist ein Freitextfeld zur Identifizierung des Containers. Gib zum Beispiel **„Open WebUI"** ein und klicke auf **„Weiter"**.

Als Nächstes wirst du nach dem Image-Namen gefragt. Gib `ghcr.io/open-webui/open-webui:main` ein und bestätige mit **„Weiter"**.

#### Entrypoint und Command

- **Entrypoint:** Keine Änderungen erforderlich
- **Command:** Keine Änderungen erforderlich

#### Volumes

Für persistente Datenspeicherung konfiguriere folgendes Volume:

- `/app/backend/data` - Dieses Volume speichert alle Open WebUI-Daten einschließlich Konversationen, Konfigurationen und hochgeladene Dokumente.

:::note
Du kannst neue Volumes über das mStudio UI hinzufügen. Der obige Pfad sollte als Mount-Point gesetzt werden.
:::

#### Umgebungsvariablen

Open WebUI kann mit verschiedenen Umgebungsvariablen konfiguriert werden. Für den Basisbetrieb sind keine Umgebungsvariablen zwingend erforderlich, aber du kannst einige Einstellungen konfigurieren:

```
# Optional: Benutzerdefinierter Port (Standard ist 8080)
PORT=8080

# Optional: WebUI-Name
WEBUI_NAME=mittwald AI Chat

# Optional: Registrierung für neue Benutzer deaktivieren
ENABLE_SIGNUP=false
```

Sobald du alle Umgebungsvariablen eingegeben hast, klicke auf **„Weiter"**. Im letzten Dialog wirst du nach dem **Port** gefragt – gib `8080` ein. Klicke auf **„Container erstellen"**, um den Container zu erstellen und zu starten.

### Alternative: Verwendung des `mw container run`-Befehls

Du kannst auch den Befehl `mw container run` verwenden, um direkt einen Open WebUI-Container über die Kommandozeile zu erstellen und zu starten. Dieser Ansatz ist ähnlich wie die Verwendung der Docker-CLI und ermöglicht es dir, alle Container-Parameter in einem einzigen Befehl anzugeben.

```shellsession
user@local $ mw container run \
  --name openwebui \
  --description "Open WebUI - AI Chat Interface" \
  --publish 8080:8080 \
  --volume "openwebui-data:/app/backend/data" \
  --create-volumes \
  ghcr.io/open-webui/open-webui:main
```

Nach dem Erstellen des Containers musst du noch eine Domain zuweisen.

### Alternative: Verwendung des `mw stack deploy`-Befehls

Alternativ kannst du den Befehl `mw stack deploy` verwenden, der mit Docker Compose kompatibel ist. Dieser Ansatz ermöglicht es dir, deine Container-Konfiguration in einer YAML-Datei zu definieren und mit einem einzigen Befehl bereitzustellen.

Erstelle zunächst eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "8080:8080"
    volumes:
      - "openwebui-data:/app/backend/data"
    environment:
      PORT: "8080"
      WEBUI_NAME: "mittwald AI Chat"
volumes:
  openwebui-data: {}
```

Stelle dann den Container mit dem Befehl `mw stack deploy` bereit:

```shellsession
user@local $ mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml`-Datei aus dem aktuellen Verzeichnis und stellt sie in deinem Standard-Stack bereit.

## Verbindung mit mittwald AI Hosting

Wenn du einen [mittwald AI Hosting](/docs/v2/platform/aihosting/)-API-Key hast, kannst du Open WebUI mit den gehosteten KI-Modellen verbinden.

### Verwendung von Umgebungsvariablen (Empfohlen)

Der empfohlene Weg, Open WebUI mit mittwald AI Hosting zu verbinden, ist die Verwendung von Umgebungsvariablen während der Container-Erstellung. Füge folgende Umgebungsvariablen hinzu:

```
OPENAI_API_BASE_URL=https://llm.aihosting.mittwald.de/v1
OPENAI_API_KEY=dein_api_key_hier
```

Wenn du das mStudio UI verwendest, füge diese Variablen im Bereich Umgebungsvariablen während des Container-Setups hinzu. Für CLI-Deployments füge sie in deinen `mw container run`-Befehl oder deine `docker-compose.yml`-Datei ein:

```shellsession
user@local $ mw container run \
  --name openwebui \
  --description "Open WebUI - AI Chat Interface" \
  --publish 8080:8080 \
  --env "OPENAI_API_BASE_URL=https://llm.aihosting.mittwald.de/v1" \
  --env "OPENAI_API_KEY=dein_api_key_hier" \
  --volume "openwebui-data:/app/backend/data" \
  --create-volumes \
  ghcr.io/open-webui/open-webui:main
```

Oder in deiner `docker-compose.yml`:

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "8080:8080"
    volumes:
      - "openwebui-data:/app/backend/data"
    environment:
      PORT: "8080"
      WEBUI_NAME: "mittwald AI Chat"
      OPENAI_API_BASE_URL: "https://llm.aihosting.mittwald.de/v1"
      OPENAI_API_KEY: "dein_api_key_hier"
volumes:
  openwebui-data: {}
```

Mit dieser Konfiguration wird Open WebUI beim Start automatisch mit mittwald AI Hosting verbunden und erkennt alle verfügbaren Modelle.

### Verwendung des Admin Panels

Alternativ kannst du die Verbindung konfigurieren, nachdem Open WebUI läuft:

1. Öffne das Open WebUI Admin Panel, indem du auf dein Profilsymbol klickst
2. Navigiere zu **„Settings"** und wähle **„Connections"**
3. Im Bereich **„OpenAI API"** füge eine neue Verbindung hinzu
4. Gib die Basis-URL ein:
   ```
   https://llm.aihosting.mittwald.de/v1
   ```
5. Gib deinen API-Key von mittwald AI Hosting ein
6. Speichere die Konfiguration

Open WebUI wird beim Start automatisch mit mittwald AI Hosting verbunden und erkennt alle verfügbaren Modelle.

:::note
Für detaillierte Informationen zur Verwendung von Open WebUI mit mittwald AI Hosting, einschließlich Modellkonfiguration, RAG-Setups und Speech-to-Text-Funktionalität, siehe die [Open WebUI AI Hosting Anleitung](/docs/v2/platform/aihosting/examples/openwebui).
:::

## Betrieb

Um deine Open WebUI-Instanz vom öffentlichen Internet aus erreichbar zu machen, muss sie mit einer Domain verbunden werden. Danach kannst du auf Open WebUI über `https://<deine-domain>/` zugreifen.

Im Rahmen des Projekt-Backups werden die Daten aus deinen Volumes gesichert und können bei Bedarf wiederhergestellt werden.

## Weitere Ressourcen

- [Open WebUI GitHub Repository](https://github.com/open-webui/open-webui)
- [Open WebUI Dokumentation](https://docs.openwebui.com/)
- [mittwald AI Hosting Dokumentation](/docs/v2/platform/aihosting/)
- [Container Workloads Dokumentation](/docs/v2/platform/workloads/containers)
