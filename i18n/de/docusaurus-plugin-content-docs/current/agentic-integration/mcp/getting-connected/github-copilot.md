---
title: Erste Schritte mit GitHub Copilot
description: Richte OAuth und mittwald MCP in GitHub Copilot mit Schritt-für-Schritt-Anweisungen ein
---

# Erste Schritte mit GitHub Copilot

GitHub Copilot in VS Code kann sich mit mittwald MCP verbinden, sodass du mittwald-Tools direkt aus Copilot Chat ausführen kannst. Diese Anleitung zeigt dir, wie du OAuth (empfohlen) oder einen API-Schlüssel für Headless-Umgebungen einrichtest.

## Voraussetzungen {#prerequisites}

- **VS Code 1.99 oder neuer** (erforderlich für OAuth-Unterstützung)
- **GitHub Copilot-Extension installiert**
- **Ein mittwald-Account** (zur Authentifizierung)
- **10 Minuten** zum Abschluss des Setups

## Schritt 1: MCP-Konfiguration erstellen {#step-1-create-mcp-configuration}

Erstelle eine projektspezifische Konfigurationsdatei unter `.vscode/mcp.json`. Wähle eine der folgenden Authentifizierungsmethoden.

### 1.1 OAuth (Empfohlen) {#oauth-recommended}

Verwende OAuth für den sicheren browserbasierten Flow mit automatischer Token-Erneuerung.

```json
{
  "servers": {
    "mittwald": {
      "type": "http",
      "url": "https://mcp.mittwald.de/mcp"
    }
  }
}
```

### 1.2 API-Schlüssel (Alternative) {#api-key-alternative}

Verwende diese Option für Headless-Server oder CI-Umgebungen, in denen OAuth nicht praktikabel ist. Input-Variablen halten den Token aus der Versionskontrolle heraus.

```json
{
  "inputs": [
    {
      "id": "mittwald_token",
      "type": "promptString",
      "description": "Enter your mittwald API token",
      "password": true
    }
  ],
  "servers": {
    "mittwald": {
      "type": "http",
      "url": "https://mcp.mittwald.de/mcp",
      "headers": {
        "Authorization": "Bearer ${input:mittwald_token}"
      }
    }
  }
}
```

Um einen Token zu erstellen, gehe zu **mStudio → Benutzereinstellungen → API-Tokens**, generiere einen Token und speichere ihn sicher.

## Schritt 2: MCP-Server starten {#step-2-start-the-mcp-server}

Öffne `.vscode/mcp.json` in VS Code. Du solltest einen **Start**-CodeLens über der Server-Definition sehen. Klicke auf **Start**, um den Server zu aktivieren.

Falls du keine CodeLens-Buttons siehst, starte VS Code neu und bestätige, dass deine Version 1.99+ ist.

## Schritt 3: Authentifizieren {#step-3-authenticate}

### 3.1 OAuth {#oauth}

Klicke auf den **Auth**-CodeLens über der Server-Definition:

1. Ein Browserfenster öffnet sich für die mittwald-Autorisierung
2. Überprüfe die angeforderten Berechtigungen
3. Klicke auf **Autorisieren**

Enterprise-Benutzer müssen möglicherweise ihren Admin bitten, die **MCP servers in Copilot**-Richtlinie zu aktivieren, bevor Auth erscheint.

### 3.2 API-Schlüssel {#api-key}

Wenn du die API-Schlüssel-Konfiguration gewählt hast, fordert VS Code beim Start des Servers den Token an. Füge den Token ein, wenn du dazu aufgefordert wirst.

:::warning

Codiere niemals Tokens direkt in die Konfigurationsdatei. Input-Variablen halten Secrets aus der Versionskontrolle heraus.

:::

## Schritt 4: Verbindung verifizieren {#step-4-verify-your-connection}

Öffne Copilot Chat und führe einen einfachen Test aus:

```
Use mittwald MCP to list my projects
```

Du solltest eine Liste von Projekten sehen, die von mittwald MCP zurückgegeben werden.

✅ **Erfolg!** mittwald MCP ist jetzt mit GitHub Copilot verbunden.

## Häufige Aufgaben mit mittwald MCP {#common-tasks}

Sobald du authentifiziert bist, kannst du Copilot Chat-Prompts wie diese verwenden:

### Deine Projekte auflisten {#list-your-projects}

```
Use mittwald MCP to show all my projects
```

### App-Informationen abrufen {#get-app-information}

```
Show apps in my project [project-id]
```

### Datenbankdetails {#database-details}

```
Get database connection info for [db-id]
```

### Backup-Status {#backup-status}

```
Check backup schedules for project [project-id]
```

### Support-Tickets {#support-tickets}

```
List open support conversations for my account
```

## Fehlerbehebung {#troubleshooting}

### Fehler: "No CodeLens Buttons Appearing" {#error-no-codelens-buttons}

**Symptom**: Keine **Start**- oder **Auth**-Buttons erscheinen über der Server-Konfiguration.

**Ursache**: VS Code erkennt die MCP-Konfiguration nicht oder CodeLens ist deaktiviert.

**Lösung**:

1. Bestätige, dass der Dateipfad `.vscode/mcp.json` ist
2. Starte VS Code neu
3. Stelle sicher, dass du VS Code 1.99+ verwendest (`code --version`)

### Fehler: "Auth Button Not Working" {#error-auth-button-not-working}

**Symptom**: Ein Klick auf **Auth** bewirkt nichts oder schlägt sofort fehl.

**Ursache**: VS Code ist zu alt für MCP OAuth oder die Richtlinie ist deaktiviert.

**Lösung**:

1. Update VS Code auf 1.99 oder neuer
2. Falls du Copilot Enterprise verwendest, bitte deinen Admin, **MCP servers in Copilot** zu aktivieren

### Fehler: "Configuration Error" {#error-configuration-error}

**Symptom**: VS Code zeigt JSON-Parse-Fehler oder der MCP-Server lädt nicht.

**Ursache**: Ungültiges JSON in `.vscode/mcp.json`.

**Lösung**:

1. Validiere die JSON-Syntax
2. Entferne abschließende Kommas
3. Vergleiche mit dem Beispiel in dieser Anleitung

### Fehler: "Server Connection Failed" {#error-server-connection-failed}

**Symptom**: MCP-Server startet nicht oder läuft in ein Timeout.

**Ursache**: Netzwerkprobleme, Firewall-Regeln oder falsche URL.

**Lösung**:

1. Bestätige, dass die URL `https://mcp.mittwald.de/mcp` ist
2. Überprüfe ausgehenden Netzwerkzugriff
3. Versuche es von einem anderen Netzwerk

### Fehler: "Token Not Accepted" {#error-token-not-accepted}

**Symptom**: Anfragen schlagen mit 401 Unauthorized fehl.

**Ursache**: Token ist ungültig, abgelaufen oder widerrufen.

**Lösung**:

1. Erstelle einen neuen API-Token in mStudio
2. Starte den MCP-Server neu und gib den neuen Token ein

### Fehler: "MCP Policy Disabled" {#error-mcp-policy-disabled}

**Symptom**: MCP-Server sind in Copilot Enterprise blockiert.

**Ursache**: Organisationsrichtlinie deaktiviert MCP-Server.

**Lösung**:

1. Bitte deinen Admin, **MCP servers in Copilot** zu aktivieren
2. Starte VS Code nach der Richtlinienänderung neu

## FAQ {#faq}

### F: Welche VS Code-Version benötige ich? {#faq-vscode-version}

**A**: Verwende VS Code 1.99 oder neuer für OAuth-Unterstützung.

### F: Funktioniert das mit VS Code Insiders? {#faq-vscode-insiders}

**A**: Ja, solange dein Insiders-Build 1.99+ ist.

### F: Wird mein Token sicher gespeichert? {#faq-token-storage}

**A**: OAuth-Tokens werden von VS Code gespeichert. API-Tokens werden über Input-Variablen eingegeben und nicht in der Konfigurationsdatei gespeichert.

### F: Wie aktualisiere ich die MCP-Konfiguration? {#faq-update-config}

**A**: Bearbeite `.vscode/mcp.json` und starte den MCP-Server über den **Start**-CodeLens neu.

### F: Kann ich das mit GitHub Copilot Enterprise verwenden? {#faq-copilot-enterprise}

**A**: Ja, aber deine Organisation muss die **MCP servers in Copilot**-Richtlinie aktivieren.

### F: Wie widerrufe ich MCP-Zugriff? {#faq-revoke-access}

**A**: Entferne den Server aus `.vscode/mcp.json` und widerrufe Tokens in mStudio.

### F: Kann ich meine mcp.json mit meinem Team teilen? {#faq-share-config}

**A**: Ja, aber speichere keine API-Tokens in der Datei. Verwende OAuth oder Input-Variablen.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](./)**: Richte Claude Code, Cursor oder Codex CLI ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf den offiziellen GitHub Copilot-Fähigkeiten:

- [Setting up GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server) - MCP-Setup für GitHub Copilot
- [Enhanced MCP OAuth Support](https://github.blog/changelog/2025-11-18-enhanced-mcp-oauth-support-for-github-copilot-in-jetbrains-eclipse-and-xcode/) - OAuth 2.1 mit PKCE (GA Sept 2025)
- [Extending Copilot Chat with MCP](https://docs.github.com/copilot/customizing-copilot/using-model-context-protocol/extending-copilot-chat-with-mcp) - MCP-Integrationsanleitung

## Brauchst du noch Hilfe? {#still-need-help}

- Prüfe die [GitHub Copilot-Dokumentation](https://docs.github.com/en/copilot)
- Sieh dir die [VS Code MCP-Dokumentation](https://code.visualstudio.com/docs) an
- Kontaktiere den [mittwald-Support](mailto:support@mittwald.de)
