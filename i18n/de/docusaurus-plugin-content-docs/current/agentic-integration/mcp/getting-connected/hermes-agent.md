---
title: Verbindung mit Hermes Agent herstellen
description: Verbinde Hermes Agent mit mittwald MCP über OAuth oder API-Tokens
---

# Verbindung mit Hermes Agent herstellen

Hermes Agent verwaltet MCP-Server mit `hermes mcp` und legt sie in
`~/.hermes/config.yaml` ab, unter nativem Windows in
`%LOCALAPPDATA%\hermes\config.yaml`. Diese Anleitung deckt beide
Authentifizierungswege ab.

Wenn Hermes zusätzlich auf Modellen aus dem mittwald AI Hosting laufen soll,
siehe die [Hermes-Agent-CLI-Anleitung](/docs/v2/agentic-integration/cli-agents/hermes-agent).
Beides ist unabhängig voneinander: MCP gibt dem Agenten Werkzeuge für deine
mittwald-Infrastruktur, die Provider-Konfiguration bestimmt das Modell.

## Voraussetzungen {#prerequisites}

- Hermes Agent installiert (`hermes --version`)
- Ein mittwald-Account (für OAuth)
- Browserzugriff für OAuth-Login
- Optional: mittwald API-Token für Headless-Nutzung

## Bestätige, dass deine CLI MCP unterstützt {#confirm-cli-supports-mcp}

```shellsession
user@local $ hermes mcp --help
```

Du solltest die Unterbefehle `add`, `remove`, `list`, `test`, `configure`,
`login`, `reauth` und `catalog` sehen.

## Option A: OAuth (Empfohlen für interaktive Nutzung) {#option-a-oauth}

### 1. mittwald MCP-Server hinzufügen {#add-mcp-server}

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth oauth
```

`--auth oauth` überspringt die interaktive Abfrage der Zugangsdaten und startet
direkt den Browser-Flow. Hermes schreibt den Server nach `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  mittwald:
    url: https://mcp.mittwald.de/mcp
    auth: oauth
    enabled: true
```

### 2. Browser-Login abschließen {#complete-browser-login}

- Öffne die Autorisierungs-URL, falls dein Browser nicht automatisch öffnet
- Melde dich mit deinem mittwald-Account an
- Genehmige die angeforderten Berechtigungen

### 3. Verbindung verifizieren {#verify-server-registration}

```shellsession
user@local $ hermes mcp list
user@local $ hermes mcp test mittwald
```

`hermes mcp test` baut die Verbindung auf, sucht die Tools und gibt aus, wie
viele es gefunden hat. Ein Server, der in `list` auftaucht, aber keine Tools
findet, ist eingetragen und nicht funktionsfähig.

### 4. Später erneut authentifizieren (falls benötigt) {#re-authenticate-later}

```shellsession
user@local $ hermes mcp login mittwald
```

Alle OAuth-Server der Konfiguration nacheinander erneuern:

```shellsession
user@local $ hermes mcp reauth --all
```

## Option B: API-Token (CI/CD und Headless-Umgebungen) {#option-b-api-token}

### 1. Token in mStudio erstellen {#create-token-in-mstudio}

- mStudio → Benutzereinstellungen → API-Tokens
- Erstelle Token mit Least-Privilege-Scopes
- Kopiere Token einmal

### 2. Token lokal exportieren {#export-token-locally}

```shellsession
user@local $ export MITTWALD_API_TOKEN="<dein_token>"
```

### 3. Server mit Header-Authentifizierung hinzufügen {#add-server-with-token}

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth header
```

Hermes fragt das Token ab und legt es als `Authorization`-Header ab. Damit das
Token nicht in der Konfigurationsdatei landet, ändere den Eintrag so, dass er
die Umgebungsvariable liest:

```yaml
mcp_servers:
  mittwald:
    url: https://mcp.mittwald.de/mcp
    headers:
      Authorization: Bearer ${MITTWALD_API_TOKEN}
    enabled: true
```

Hermes löst `${VAR}` beim Verbindungsaufbau aus der Umgebung auf. In der Datei
steht dann nur der Name der Variablen, nie das Token.

## Verbindung verwalten {#manage-the-connection}

### Konfigurierte Server anzeigen {#list-configured-servers}

```shellsession
user@local $ hermes mcp list
```

### Auswählen, welche Tools der Agent sieht {#choose-which-tools}

```shellsession
user@local $ hermes mcp configure mittwald
```

Damit öffnest du die Tool-Auswahl für einen Server. Nutze sie, um Tools
auszublenden, die nicht im Prompt des Agenten stehen sollen.

### Abschalten, ohne zu entfernen {#disable-without-removing}

Setze `enabled: false` im Eintrag in `~/.hermes/config.yaml`. Die Konfiguration
bleibt erhalten, die Tools verschwinden aus dem Agenten.

### Server-Konfiguration entfernen {#remove-server-config}

```shellsession
user@local $ hermes mcp remove mittwald
```

## Fehlerbehebung {#troubleshooting}

### Die Abfrage will einen API-Key, obwohl du OAuth wolltest {#prompt-asks-for-api-key}

`hermes mcp add` nur mit `--url` startet einen interaktiven Dialog. Der fragt
`Does this server require authentication?` und bietet danach ein Feld für ein
Bearer-Token an. Gib `--auth oauth` auf der Kommandozeile mit, dann geht es
direkt in den Browser-Flow.

### `Failed to connect: Server returned an error response` {#failed-to-connect}

Der mittwald MCP-Endpoint weist unauthentifizierte Anfragen mit `401` und einem
`WWW-Authenticate`-Header auf `https://auth.mcp.mittwald.de/authorize` ab.
Kommt das beim `add`, fehlten die Zugangsdaten oder sie waren falsch. Hermes
fragt danach `Save config anyway (you can test later)?`. Antworte mit `n` und
füge den Server erneut mit `--auth oauth` oder `--auth header` hinzu.

### Zeitüberschreitung beim Suchen der Tools {#connection-times-out}

Erhöhe das Zeitlimit:

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth oauth --connect-timeout 30
```

### Token-basierte Authentifizierung gibt `401` zurück {#token-based-auth-returns-401}

- Prüfe, ob `MITTWALD_API_TOKEN` in der Shell gesetzt ist, die Hermes startet
- Rotiere Token in mStudio falls nötig
- Entferne und füge Server-Konfiguration erneut hinzu

```shellsession
user@local $ hermes mcp remove mittwald
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth header
```

## Sicherheitshinweise {#security-notes}

- Bevorzuge OAuth für interaktive lokale Nutzung (Refresh- und Revocation-Unterstützung)
- Bevorzuge API-Tokens für CI/CD und nicht-interaktive Jobs
- Halte Tokens in Umgebungsvariablen, nicht in `~/.hermes/config.yaml`
- Committe niemals Tokens in Repository-Dateien

## Nächste Schritte {#next-steps}

- [Hermes Agent mit mittwald AI Hosting](/docs/v2/agentic-integration/cli-agents/hermes-agent), um den Agenten auf mittwald-Modellen zu betreiben
- [Tutorials](../../tutorials/) für Mensch + Agent-Workflows
- [How-To-Playbooks](../../how-to/) für aufgabenfokussierte Operationen
- [Auth & Token Lifecycle](../../auth-token-lifecycle/) für Consent/Refresh/Re-Auth-Verhalten
