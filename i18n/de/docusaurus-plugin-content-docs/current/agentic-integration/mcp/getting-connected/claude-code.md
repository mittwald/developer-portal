---
title: Erste Schritte mit Claude Code
description: Richte OAuth und mittwald MCP in Claude Code mit Schritt-für-Schritt-Anweisungen ein
---

# Erste Schritte mit Claude Code

Claude Code ist Anthropics CLI für die Arbeit mit Claude in deinem Terminal. Diese Anleitung zeigt dir, wie du mittwald MCP über OAuth (empfohlen) oder einen API-Key verbindest, damit du mittwald-Tools direkt von Claude Code aus nutzen kannst.

## Voraussetzungen {#prerequisites}

- **Claude Code installiert** (https://code.claude.com/docs/en/mcp)
- **Ein mittwald-Account** (zur Authentifizierung)
- **Ein Webbrowser** (für OAuth-Login)
- **10 Minuten** zum Abschluss des Setups

## Authentifizierungsoptionen {#authentication-options}

Claude Code unterstützt zwei Wege zur Authentifizierung mit mittwald MCP:

- **OAuth (empfohlen)**: Sicherer browserbasierter Flow mit automatischer Token-Erneuerung.
- **API Key**: Am besten für Headless/CI-Umgebungen, wo OAuth nicht praktikabel ist.

## Option A: OAuth-Authentifizierung (Empfohlen) {#option-a-oauth}

Claude Code handhabt OAuth automatisch über Dynamic Client Registration (DCR), sodass du **keinen** Client manuell registrieren musst.

### Schritt 1: mittwald MCP-Server hinzufügen {#step-1-add-mcp-server}

Führe diesen Befehl in deinem Terminal aus:

```shellsession
user@local $ claude mcp add --transport http mittwald https://mcp.mittwald.de/mcp
```

**Optional: Wähle einen Konfigurationsbereich** (Standard ist `local`):

```shellsession
# Local (Standard, privat)
user@local $ claude mcp add --transport http --scope local mittwald https://mcp.mittwald.de/mcp

# Project (über .mcp.json geteilt)
user@local $ claude mcp add --transport http --scope project mittwald https://mcp.mittwald.de/mcp

# User (projektübergreifend verfügbar)
user@local $ claude mcp add --transport http --scope user mittwald https://mcp.mittwald.de/mcp
```

### Schritt 2: Mit mittwald authentifizieren {#step-2-authenticate}

Führe in Claude Code den `/mcp`-Befehl aus:

1. Starte Claude Code: `claude`
2. Tippe `/mcp` und wähle den **mittwald** Server
3. Claude Code öffnet deinen Browser für die OAuth-Autorisierung

Falls der Browser nicht öffnet, zeigt Claude Code eine URL an, die du manuell kopieren und einfügen kannst.

### Schritt 3: Autorisierung abschließen {#step-3-complete-authorization}

**In deinem Browser**:

1. Melde dich bei mittwald an
2. Überprüfe die angeforderten Berechtigungen
3. Klicke auf **Autorisieren**

**Zurück in Claude Code**:

- Die Autorisierung wird automatisch erfasst
- Tokens werden sicher gespeichert
- Tokens werden automatisch erneuert, wenn sie ablaufen

### Schritt 4: Verbindung verifizieren {#step-4-verify-connection}

Bitte Claude Code, ein einfaches mittwald-Tool auszuführen:

```
Use mittwald MCP to get my user information
```

Du solltest eine Ausgabe ähnlich dieser sehen:

```json
{
  "id": "user-abc123",
  "email": "your-email@mittwald.de",
  "name": "Your Name",
  "created": "2024-01-01T00:00:00Z"
}
```

✅ **Erfolg!** mittwald MCP ist jetzt mit Claude Code verbunden.

## Option B: API-Key-Authentifizierung {#option-b-api-key}

Verwende diese Option für Headless-Server oder CI-Umgebungen, wo OAuth nicht praktikabel ist.

### Schritt 1: Dein mittwald API-Token erhalten {#step-1-get-api-token}

1. Gehe zu **mStudio → Benutzereinstellungen → API Tokens**
2. Erstelle ein neues Token mit den Berechtigungen, die du benötigst
3. Kopiere und speichere das Token sicher

### Schritt 2: mittwald MCP mit API-Key hinzufügen {#step-2-add-mcp-with-api-key}

```shellsession
user@local $ claude mcp add --transport http mittwald https://mcp.mittwald.de/mcp \
    --header "Authorization: Bearer YOUR_MITTWALD_API_TOKEN"
```

:::warning

API-Tokens erneuern sich **nicht** automatisch. Rotiere sie regelmäßig und halte sie geheim.

:::

### Schritt 3: Verbindung verifizieren {#step-3-verify-connection}

Verwende denselben Test wie bei OAuth:

```
Use mittwald MCP to get my user information
```

## Häufige Aufgaben mit mittwald MCP {#common-tasks}

Sobald du authentifiziert bist, kannst du natürlichsprachliche Prompts in Claude Code verwenden:

### Deine Projekte auflisten {#list-your-projects}

```
Show me all my mittwald projects
```

### App-Informationen abrufen {#get-app-information}

```
List all apps in project [project-id]
```

### Datenbank-Infos anzeigen {#view-database-info}

```
Show database details for [db-id]
```

### Server-Status prüfen {#check-server-status}

```
Get server status for [server-id]
```

### Backup erstellen {#create-a-backup}

```
Create a backup for project [project-id]
```

## Fehlerbehebung {#troubleshooting}

### Fehler: "Browser Didn't Open" {#error-browser-didnt-open}

**Symptom**: Claude Code zeigt eine Autorisierungs-URL an, aber kein Browserfenster erscheint.

**Ursache**: Standard-Browser nicht erkannt oder Umgebung ist headless.

**Lösung**:

1. Kopiere die in Claude Code angezeigte URL
2. Füge sie manuell in deinen Browser ein
3. Schließe die Autorisierung ab und kehre zu Claude Code zurück

### Fehler: "OAuth Authorization Failed" {#error-oauth-authorization-failed}

**Symptom**: OAuth-Flow wird im Browser abgeschlossen, aber Claude Code meldet fehlgeschlagene Autorisierung.

**Ursache**: OAuth-Server hat die Client-Registrierung oder Callback abgelehnt.

**Lösung**:

1. Führe `/mcp` erneut aus und versuche den Flow erneut
2. Stelle sicher, dass dein Netzwerk Zugriff auf den OAuth-Server erlaubt
3. Falls es weiterhin auftritt, kontaktiere den mittwald-Support mit der Fehlermeldung

### Fehler: "Connection Refused" {#error-connection-refused}

**Symptom**: Claude Code kann `https://mcp.mittwald.de/mcp` nicht erreichen.

**Ursache**: Netzwerkproblem oder Firewall/Proxy blockiert ausgehende HTTPS-Verbindungen.

**Lösung**:

1. Überprüfe Internetzugang
2. Wiederhole den Befehl von einem anderen Netzwerk
3. Überprüfe Proxy- oder Firewall-Regeln

### Fehler: "Invalid Token" {#error-invalid-token}

**Symptom**: Anfragen schlagen mit 401 Unauthorized fehl, nachdem es zuvor funktionierte.

**Ursache**: Token abgelaufen oder widerrufen.

**Lösung**:

- **OAuth**: Führe `/mcp` aus und authentifiziere dich neu
- **API Key**: Generiere ein neues API-Token und füge den Server erneut hinzu

### Fehler: "Permission Denied" {#error-permission-denied}

**Symptom**: Du erhältst 403-Fehler für bestimmte Operationen.

**Ursache**: Dem Token fehlen erforderliche Berechtigungen.

**Lösung**:

1. Authentifiziere dich neu und genehmige die erforderlichen Berechtigungen
2. Für API-Keys erstelle ein neues Token mit den korrekten Berechtigungen

### Fehler: "Server Not Found" {#error-server-not-found}

**Symptom**: Claude Code sagt, der MCP-Server existiert nicht.

**Ursache**: Servername oder URL ist falsch, oder der Konfigurationsbereich ist unterschiedlich.

**Lösung**:

1. Führe `claude mcp list` aus, um konfigurierte Server zu prüfen
2. Füge den Server mit der korrekten URL und dem Bereich erneut hinzu

## FAQ {#faq}

### F: Wird mein Passwort an Claude Code übertragen? {#faq-password-transmitted}

**A**: Nein. Dein Passwort wird in deinem Browser bei mittwald eingegeben. Claude Code erhält nur ein OAuth-Token.

### F: Kann ich mehrere mittwald-Accounts verwenden? {#faq-multiple-accounts}

**A**: Ja, aber du musst jeden Account separat authentifizieren und separate Konfigurationen verwalten (z. B. verschiedene Bereiche oder Servernamen).

### F: Wie lange sind Tokens gültig? {#faq-token-duration}

**A**: OAuth-Access-Tokens sind normalerweise etwa 1 Stunde gültig, aber Claude Code erneuert sie automatisch. API-Keys bleiben gültig, bis sie widerrufen werden.

### F: Wie widerrufe ich den Zugriff? {#faq-revoke-access}

**A**: Führe in Claude Code `/mcp` aus, wähle den Server und wähle **Clear authentication**. Du kannst Tokens auch von mStudio aus widerrufen.

### F: Kann ich das auf einem Server (SSH) verwenden? {#faq-server-ssh}

**A**: OAuth erfordert einen Browser, daher sind API-Keys normalerweise besser für Headless-Server. Falls nötig, authentifiziere auf einer lokalen Maschine und verwende die Konfiguration wieder.

### F: Welche Berechtigungen sollte ich anfordern? {#faq-scopes}

**A**: Verwende den kleinsten Satz an Berechtigungen, der zu deinen Aufgaben passt. Die meisten Entwickler beginnen mit `user:read`, `customer:read`, `project:read` und `app:read`.

### F: Wie unterscheidet sich Claude Code von Claude Desktop? {#faq-claude-code-vs-desktop}

**A**: Claude Code ist eine CLI mit MCP-Unterstützung und Terminal-Workflows. Claude Desktop ist eine GUI-App mit einem anderen Konfigurationsmodell.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](./)**: Richte GitHub Copilot, Cursor oder Codex CLI ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf den offiziellen Claude Code-Funktionen:

- [Claude Code IAM Documentation](https://code.claude.com/docs/en/iam) - OAuth 2.1 mit DCR-Unterstützung
- [Claude Code MCP Setup](https://code.claude.com/docs/en/mcp) - MCP-Server-Konfiguration
- [OAuth for MCP Server Guide](https://www.buildwithmatija.com/blog/oauth-mcp-server-claude) - Community-Implementierungsanleitung

## Brauchst du noch Hilfe? {#still-need-help}

- Überprüfe die [Claude Code Documentation](https://code.claude.com/docs/en/mcp) für CLI-spezifische Hilfe
- Kontaktiere den [mittwald-Support](mailto:support@mittwald.de)
