---
title: Verbindung mit Codex CLI herstellen
description: Verbinde Codex CLI mit mittwald MCP über OAuth oder API-Tokens
---

# Verbindung mit Codex CLI herstellen

Diese Anleitung zeigt den aktuellen Codex CLI-Flow für die Verbindung mit mittwald MCP.

## Voraussetzungen {#prerequisites}

- Codex CLI installiert (`codex --version`)
- Ein mittwald-Account (für OAuth)
- Browserzugriff für OAuth-Login
- Optional: mittwald API-Token für Headless-Nutzung

## Bestätige, dass deine CLI MCP unterstützt {#confirm-cli-supports-mcp}

```shellsession
user@local $ codex mcp --help
```

Du solltest Befehle wie `add`, `list`, `get`, `login`, `logout` und `remove` sehen.

## Option A: OAuth (Empfohlen für interaktive Nutzung) {#option-a-oauth}

### 1. mittwald MCP-Server hinzufügen {#add-mcp-server}

```shellsession
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp
```

Aktuelles Codex CLI-Verhalten:

- erkennt OAuth-Unterstützung vom Server
- startet den OAuth-Flow automatisch
- gibt eine Autorisierungs-URL aus und wartet auf Callback

### 2. Browser-Login abschließen {#complete-browser-login}

- Öffne die Autorisierungs-URL, falls dein Browser nicht automatisch öffnet
- Melde dich mit deinem mittwald-Account an
- Genehmige die angeforderten Berechtigungen

### 3. Server-Registrierung verifizieren {#verify-server-registration}

```shellsession
user@local $ codex mcp list
user@local $ codex mcp get mittwald
```

### 4. Später erneut authentifizieren (falls benötigt) {#re-authenticate-later}

```shellsession
user@local $ codex mcp login mittwald
```

Verwende dies, wenn Tokens widerrufen/abgelaufen sind und du eine neue OAuth-Sitzung benötigst.

## Option B: API-Token (CI/CD und Headless-Umgebungen) {#option-b-api-token}

### 1. Token in mStudio erstellen {#create-token-in-mstudio}

- mStudio → Benutzereinstellungen → API-Tokens
- Erstelle Token mit Least-Privilege-Scopes
- Kopiere Token einmal

### 2. Token lokal exportieren {#export-token-locally}

```shellsession
user@local $ export MITTWALD_API_TOKEN="<dein_token>"
```

### 3. Server mit Token-Umgebungsvariable hinzufügen {#add-server-with-token}

```shellsession
user@local $ codex mcp add mittwald \
    --url https://mcp.mittwald.de/mcp \
    --bearer-token-env-var MITTWALD_API_TOKEN
```

## Verbindung verwalten {#manage-the-connection}

### Konfigurierten Server anzeigen {#show-configured-server}

```shellsession
user@local $ codex mcp get mittwald
```

### OAuth-Sitzung abmelden {#logout-oauth-session}

```shellsession
user@local $ codex mcp logout mittwald
```

### Server-Konfiguration entfernen {#remove-server-config}

```shellsession
user@local $ codex mcp remove mittwald
```

## Fehlerbehebung {#troubleshooting}

### `missing required argument 'commandOrUrl'` {#error-missing-argument}

Dieser Fehler erscheint, wenn `add` ohne Server-Namen und URL/Befehl aufgerufen wird.

Korrektes Format:

```shellsession
user@local $ codex mcp add <name> --url <mcp_endpoint>
```

Beispiel:

```shellsession
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp
```

### OAuth-Browser-Schritt öffnet nicht {#oauth-browser-step-did-not-open}

- Kopiere die ausgegebene Autorisierungs-URL aus dem Terminal in deinen Browser
- Schließe Login und Zustimmung ab
- Kehre zum Terminal zurück

### Token-basierte Authentifizierung gibt `401` zurück {#token-based-auth-returns-401}

- Verifiziere, dass `MITTWALD_API_TOKEN` gesetzt ist
- Rotiere Token in mStudio falls nötig
- Entferne und füge Server-Konfiguration erneut hinzu

```shellsession
user@local $ codex mcp remove mittwald
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp --bearer-token-env-var MITTWALD_API_TOKEN
```

## Sicherheitshinweise {#security-notes}

- Bevorzuge OAuth für interaktive lokale Nutzung (Refresh- und Revocation-Unterstützung)
- Bevorzuge API-Tokens für CI/CD und nicht-interaktive Jobs
- Committe niemals Tokens in Repository-Dateien

## Nächste Schritte {#next-steps}

- [Tutorials](../../tutorials/) für Mensch + Agent-Workflows
- [How-To-Playbooks](../../how-to/) für aufgabenfokussierte Operationen
- [Auth & Token Lifecycle](../../auth-token-lifecycle/) für Consent/Refresh/Re-Auth-Verhalten
