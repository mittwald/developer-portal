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

Open WebUI wird automatisch alle verfügbaren Modelle von mittwald AI Hosting erkennen. Du kannst diese Modelle nun in deinen Konversationen auswählen.

### Optimierung der Modell-Parameter

Für optimale Ergebnisse kann es erforderlich sein, die Standard-Parameter für jedes Modell anzupassen. Du kannst diese Parameter im Bereich **„Models"** anpassen:

1. Wähle das Modell aus, das du konfigurieren möchtest
2. Unter **„Advanced Params"** setze die empfohlenen Parameter, die im [Modell-Bereich](/docs/v2/platform/aihosting/models/) dokumentiert sind, wie z.B. `top_p`, `top_k` und `temperature`

:::note
Wir empfehlen, Embedding-Modelle in der Modellauswahl auszublenden, da sie automatisch von Open WebUI erkannt werden, aber nicht für Chat-Konversationen verwendet werden können.
:::

## Verwendung von Retrieval-Augmented Generation (RAG)

Open WebUI bietet die Funktion an, Wissen in Form von Dokumenten zu hinterlegen, auf die mithilfe von Retrieval-Augmented Generation (RAG) zugegriffen werden kann.

### Hochladen von Dokumenten

1. Navigiere in der linken Menüleiste zu **„Workspace"**
2. Wähle den Reiter **„Knowledge"**
3. Lade Dokumente hoch, die du verfügbar machen möchtest
4. In deinen Chats kannst du mit einem Hashtag auf diese Dokumente zugreifen

### Konfiguration eines Embedding-Modells

Um eine effizientere Dokumentenverarbeitung zu ermöglichen, kannst du ein Embedding-Modell konfigurieren:

1. Im Admin Panel unter **„Settings"** gehe zum Menüpunkt **„Documents"**
2. Im Bereich **„Embedding"** wähle **„OpenAI"** im Dropdown-Menü als Embedding Model Engine aus
3. Gib den Endpunkt ein: `https://llm.aihosting.mittwald.de/v1`
4. Gib deinen mittwald AI Hosting API-Key ein
5. Wähle eines der verfügbaren [Embedding-Modelle](/docs/v2/platform/aihosting/models/) aus (wie z.B. Qwen3-Embedding-8B)
6. Im Bereich **„Retrieval"** passe **„Top K"** und **„RAG Template"** für optimale Ergebnisse an

## Konfiguration von Speech-to-Text

Whisper-Large-V3-Turbo kann in Open WebUI für Speech-to-Text (STT) Funktionalität konfiguriert werden. Dieses Modell unterstützt über 99 Sprachen und ist für Audio-Transkription optimiert.

### Konfiguration im Admin Panel

Im Admin Panel unter **„Settings"** > **„Audio"** sind folgende Einstellungen vorzunehmen:

- **Engine**: Wähle „OpenAI"
- **API Base URL**: `https://llm.aihosting.mittwald.de/v1`
- **API Key**: Gib deinen mittwald AI Hosting API-Key ein
- **STT Model**: Gib den Modellnamen `whisper-large-v3-turbo` ein

### Whisper aus Chat-Modellen ausblenden

Whisper wird nach der Verbindung in der Modellliste erscheinen, sollte aber aus der Chat-Modell-Auswahl ausgeblendet werden, da es für Audio-Transkription entwickelt wurde, nicht für konversationelle KI:

1. Navigiere zu **„Workspace"** > **„Models"**
2. Wähle **Whisper-Large-V3-Turbo** aus
3. Wähle **„Hide"**, um zu verhindern, dass es als Chat-Option erscheint

### Benutzereinstellungen

Du kannst weiter spezifizieren, wie Open WebUI mit dem Whisper-Modell interagiert in den Benutzereinstellungen (nicht im Administrator-Panel) unter **„Audio"**:

- **Language**: Setze den Sprachcode explizit (z.B. „en" für Englisch, „de" für Deutsch)
- **Directly Send Speech**: Aktiviere, um Transkriptionen direkt ohne Bestätigung zu senden

### Empfohlene Parameter

Für optimale Transkriptionsqualität konfiguriere diese Parameter im Admin Panel oder in den Chat-Einstellungen:

- **Additional Parameters**: Setze `temperature=1.0`, `top_p=1.0`

### Testen von Speech-to-Text

Um die Speech-to-Text-Funktionalität zu testen:

1. Klicke auf das Mikrofon-Symbol in einer Chat-Oberfläche
2. Sprich in der konfigurierten Sprache
3. Die Transkription verwendet den `/v1/audio/transcriptions`-Endpunkt mit Unterstützung für MP3-, OGG-, WAV- und FLAC-Formate (maximale Dateigröße 25 MB)

:::note
Setze den Sprachparameter immer explizit für beste Genauigkeit, insbesondere für nicht-deutsche Audioeingaben.
:::

## Betrieb

Um deine Open WebUI-Instanz vom öffentlichen Internet aus erreichbar zu machen, muss sie mit einer Domain verbunden werden. Danach kannst du auf Open WebUI über `https://<deine-domain>/` zugreifen.

Im Rahmen des Projekt-Backups werden die Daten aus deinen Volumes gesichert und können bei Bedarf wiederhergestellt werden.

## Weitere Ressourcen

- [Open WebUI GitHub Repository](https://github.com/open-webui/open-webui)
- [Open WebUI Dokumentation](https://docs.openwebui.com/)
- [mittwald AI Hosting Dokumentation](/docs/v2/platform/aihosting/)
- [Container Workloads Dokumentation](/docs/v2/platform/workloads/containers)
