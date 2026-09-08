---
title: Erste Schritte mit Claude
description: Verbinde den offiziellen mittwald Connector in Claude Desktop und Claude.ai mit Schritt-für-Schritt-Anweisungen
---

# Erste Schritte mit Claude

mittwald veröffentlicht einen offiziellen Connector im Claude Connectors Directory, der auf mittwald MCP basiert. Diese Anleitung zeigt dir, wie du ihn mit Claude Desktop oder Claude.ai über OAuth-Authentifizierung verbindest.

## Voraussetzungen {#prerequisites}

- **Claude Pro, Max, Team oder Enterprise Plan** (erforderlich für Connectors)
- **Ein mittwald mStudio Account** (zur Authentifizierung)
- **2 Minuten** zum Abschluss des Setups

## Schritt 1: mittwald Connector öffnen {#step-1-open-the-connector}

1. Öffne den [mittwald Connector](https://claude.ai/directory/mittwald) im Claude Connectors Directory, oder gehe in Claude Desktop / Claude.ai zu **Settings → Connectors → Browse connectors** und suche nach "mittwald"
2. Klicke auf **Connect to Claude** (bei einem persönlichen Plan) oder **Connect for your team** (bei einem Team- oder Enterprise-Plan)

Da es sich um einen offiziellen, veröffentlichten Connector handelt, kennt Claude bereits seinen Endpoint und die verfügbaren Tools — es gibt keine Server-URL einzutragen.

## Schritt 2: Authentifizieren {#step-2-authenticate}

Wenn du den mittwald Connector verbindest, fordert Claude dich zur Authentifizierung auf:

1. Ein Browserfenster öffnet sich für die mittwald-Autorisierung
2. Melde dich mit deinem mittwald-Account an
3. Überprüfe die angeforderten Berechtigungen
4. Klicke auf **Autorisieren**

Claude speichert deine OAuth-Tokens sicher und erneuert sie automatisch.

## Schritt 3: Verbindung verifizieren {#step-3-verify-your-connection}

Starte eine neue Konversation und teste die Verbindung:

```
Use mittwald MCP to list my projects
```

Du solltest eine Liste deiner mittwald-Projekte sehen.

✅ **Erfolg!** mittwald MCP ist jetzt mit Claude verbunden.

## Häufige Aufgaben mit mittwald MCP {#common-tasks}

Sobald du authentifiziert bist, kannst du Prompts wie diese verwenden:

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

### Fehler: "Connector Not Available" {#error-connector-not-available}

**Symptom**: Die Option "Connectors" erscheint nicht in den Einstellungen, oder der mittwald Connector fehlt im Directory.

**Ursache**: Dein Claude-Plan enthält keine Connectors.

**Lösung**:

1. Upgrade auf Claude Pro, Max, Team oder Enterprise
2. Warte auf das Feature-Rollout, falls du kürzlich upgegradet hast

### Fehler: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth-Flow schlägt fehl oder läuft ab.

**Ursache**: Browser-Popup blockiert oder Netzwerkprobleme.

**Lösung**:

1. Erlaube Popups für claude.ai in deinen Browsereinstellungen
2. Überprüfe deine Netzwerkverbindung
3. Versuche es erneut von einem anderen Browser

### Fehler: "Permission Denied" {#error-permission-denied}

**Symptom**: Connector schlägt mit Autorisierungsfehlern fehl.

**Ursache**: OAuth-Sitzung abgelaufen oder Berechtigungen widerrufen.

**Lösung**:

1. Entferne den Connector in den Einstellungen
2. Füge ihn erneut hinzu und authentifiziere dich neu
3. Verifiziere, dass dein mittwald-Account aktiv ist

### Fehler: "Server Connection Failed" {#error-server-connection-failed}

**Symptom**: Claude kann den mittwald MCP-Server nicht erreichen.

**Ursache**: Netzwerkprobleme oder Firewall-Regeln.

**Lösung**:

1. Überprüfe ausgehenden Netzwerkzugriff
2. Versuche es von einem anderen Netzwerk
3. Entferne den mittwald Connector und verbinde ihn erneut

## Team und Enterprise {#team-and-enterprise}

Für Team- und Enterprise-Pläne:

- **Owners** können den mittwald Connector aus dem Directory für alle Workspace-Mitglieder aktivieren
- Mitglieder können gemeinsame Connectors ohne individuelles Setup verwenden
- Admins können Connector-Berechtigungen in den Workspace-Einstellungen verwalten

## FAQ {#faq}

### F: Welche Claude-Pläne unterstützen den mittwald Connector? {#faq-supported-plans}

**A**: Claude Pro, Max, Team und Enterprise-Pläne unterstützen Connectors.

### F: Ist meine Authentifizierung sicher? {#faq-authentication-security}

**A**: Ja. Claude verwendet OAuth 2.1 mit PKCE. Tokens werden sicher gespeichert und automatisch erneuert.

### F: Kann ich mehrere Connectors verwenden? {#faq-multiple-connectors}

**A**: Ja. Du kannst mehrere Connectors aus dem Directory verbinden und sie in derselben Konversation verwenden.

### F: Wie entferne ich den Connector? {#faq-remove-connector}

**A**: Gehe zu **Settings → Connectors**, finde den mittwald-Connector und klicke auf **Remove**.

### F: Funktioniert das mit Claude Desktop offline? {#faq-offline}

**A**: Nein. Remote-MCP-Server erfordern eine Internetverbindung.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](../)**: Richte GitHub Copilot, Cursor oder Claude Code CLI ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf der offiziellen Anthropic-Dokumentation:

- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) - Claude Connector-Setup
