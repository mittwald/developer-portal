---
title: Erste Schritte mit Cursor
description: Verbinde mittwald MCP mit Cursor über OAuth (empfohlen) oder API-Token-Header
---

# Erste Schritte mit Cursor

Cursor kann sich über HTTP mit mittwald MCP verbinden und OAuth zur Authentifizierung verwenden.

Diese Anleitung verwendet den Deployment-Endpoint:

`https://mcp.mittwald.de/mcp`

## Voraussetzungen {#prerequisites}

- Cursor installiert
- Ein mittwald-Account
- Browser-Zugriff für OAuth
- Cursor MCP aktiviert in deinem Workspace

## Schritt 1: MCP-Konfiguration erstellen {#step-1-create-mcp-configuration}

Cursor liest die MCP-Konfiguration entweder von:

- Projekt: `.cursor/mcp.json`
- Global: `~/.cursor/mcp.json`

Verwende die Projekt-Konfiguration, wenn du das Setup mit dem Repo teilen möchtest.

## Schritt 2: mittwald MCP hinzufügen (OAuth, empfohlen) {#step-2-add-mcp-oauth}

Füge dies zu `.cursor/mcp.json` hinzu:

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp"
    }
  }
}
```

Wichtig:

- Cursor verwendet `mcpServers` (nicht `servers`).
- Für Remote-Server reicht `url` aus, um OAuth-fähige Flows zu starten, wenn der Server dies unterstützt.

## Schritt 3: Authentifizieren {#step-3-authenticate}

1. Öffne Cursor Chat.
2. Frage nach einer mittwald-Aktion, zum Beispiel:

```text
Use mittwald MCP to list my projects.
```

3. Cursor öffnet den OAuth-Flow in deinem Browser.
4. Melde dich an und genehmige die Berechtigungen.
5. Kehre zu Cursor zurück und führe den Prompt erneut aus.

## Schritt 4: Verifizieren {#step-4-verify}

Führe aus:

```text
Use mittwald MCP to get my user profile and list my projects.
```

Du solltest mittwald-Daten von Live-MCP-Tools erhalten.

## Optional: Statischer OAuth-Client (Nur wenn dein Provider dies erfordert) {#optional-static-oauth-client}

Die meisten Setups sollten den obigen Standard-Flow verwenden. Verwende statisches OAuth nur, wenn dein OAuth-Provider vorab registrierte Client-Credentials/Redirect-URIs erfordert.

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp",
      "auth": {
        "CLIENT_ID": "${env:MITTWALD_OAUTH_CLIENT_ID}",
        "CLIENT_SECRET": "${env:MITTWALD_OAUTH_CLIENT_SECRET}",
        "scopes": ["mcp", "offline_access"]
      }
    }
  }
}
```

Cursor statische Redirect-URI:

`cursor://anysphere.cursor-mcp/oauth/callback`

Wenn dein OAuth-Provider zugelassene Redirect-URIs erfordert, füge genau diesen Wert hinzu.

## Alternative: API-Token-Authentifizierung {#alternative-api-token}

Wenn du Token-Header bevorzugst (für CI oder deterministische nicht-interaktive Runs):

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp",
      "headers": {
        "Authorization": "Bearer ${env:MITTWALD_API_TOKEN}"
      }
    }
  }
}
```

Setze das Token in deiner Shell/Umgebung, bevor du Cursor startest.

## Fehlerbehebung {#troubleshooting}

### OAuth-Prompt erscheint nie {#oauth-prompt-never-appears}

- Löse einen echten Tool-Aufruf vom Chat aus (nicht nur Konfiguration öffnen).
- Bestätige, dass der MCP-Server in Cursor aktiviert ist.
- Öffne Cursor erneut nach Bearbeitung von `mcp.json`.

### Ungültiges JSON / Server lädt nicht {#invalid-json-server-not-loading}

- Validiere die Syntax von `.cursor/mcp.json`.
- Bestätige, dass der Top-Level-Key `mcpServers` ist.

### 401 Unauthorized {#401-unauthorized}

- Authentifiziere dich erneut in Cursor.
- Falls du Token-Header verwendest, rotiere das Token in mStudio und aktualisiere `MITTWALD_API_TOKEN`.

### Re-Auth nach Inaktivität erforderlich {#re-auth-needed-after-inactivity}

- Führe erneut einen Tool-Aufruf aus, um einen frischen OAuth-Flow auszulösen.
- Falls häufige Re-Auth auftritt, aktualisiere Cursor und verifiziere das Refresh-Token-Verhalten des Providers.

## FAQ {#faq}

### F: Sollte ich manuell einen OAuth-Client für Cursor registrieren? {#faq-manual-oauth-client}

A: Nicht für das Standard-Setup. Beginne nur mit `url`. Verwende statische OAuth-Konfiguration nur, wenn dein Provider explizit feste Client-Credentials erfordert.

### F: Kann ich Secrets aus JSON-Dateien heraushalten? {#faq-secrets-out-of-json}

A: Ja. Verwende Interpolation mit `${env:NAME}` und setze Umgebungsvariablen außerhalb des Repos.

### F: Kann ich eine Konfiguration projektübergreifend verwenden? {#faq-one-config-across-projects}

A: Ja, verwende `~/.cursor/mcp.json` für globale Konfiguration.

## Nächste Schritte {#next-steps}

- [Tutorials](../../tutorials/)
- [Andere Tools](./)

## Offizielle Dokumentation {#official-documentation}

- [Cursor MCP Overview](https://cursor.com/docs/context/mcp)
- [Cursor MCP Extension API](https://cursor.com/docs/context/mcp-extension-api)
