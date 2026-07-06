---
title: Erste Schritte mit Claude Desktop
description: Richte OAuth und mittwald MCP in Claude Desktop mit Schritt-für-Schritt-Anweisungen ein
---

# Erste Schritte mit Claude Desktop

Claude Desktop und Claude.ai unterstützen Remote-MCP-Server über Custom Connectors. Diese Anleitung zeigt dir, wie du mittwald MCP mit Claude über OAuth-Authentifizierung verbindest.

## Voraussetzungen {#prerequisites}

- **Claude Pro, Max, Team oder Enterprise Plan** (erforderlich für Custom Connectors)
- **Ein mittwald mStudio Account** (zur Authentifizierung)
- **5 Minuten** zum Abschluss des Setups

:::note

Custom Connectors mit Remote-MCP-Servern befinden sich derzeit in der Beta. Das Feature ist in Claude Desktop und Claude.ai verfügbar.

:::

## Schritt 1: Connector-Einstellungen öffnen {#step-1-open-connector-settings}

1. Öffne Claude Desktop oder gehe zu [claude.ai](https://claude.ai)
2. Klicke auf dein Profilsymbol oder navigiere zu **Settings**
3. Wähle **Connectors** aus dem Menü

## Schritt 2: mittwald MCP hinzufügen {#step-2-add-mittwald-mcp}

1. Klicke auf **Add custom connector**
2. Gib die mittwald MCP-Server-URL ein: `https://mcp.mittwald.de/mcp`
3. Klicke auf **Add**, um den Connector zu speichern

## Schritt 3: Authentifizieren {#step-3-authenticate}

Wenn du den Connector zum ersten Mal verwendest, fordert Claude dich zur Authentifizierung auf:

1. Ein Browserfenster öffnet sich für die mittwald-Autorisierung
2. Melde dich mit deinem mittwald-Account an
3. Überprüfe die angeforderten Berechtigungen
4. Klicke auf **Autorisieren**

Claude speichert deine OAuth-Tokens sicher und erneuert sie automatisch.

## Schritt 4: Verbindung verifizieren {#step-4-verify-your-connection}

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

**Symptom**: Die Option "Connectors" erscheint nicht in den Einstellungen.

**Ursache**: Dein Claude-Plan enthält keine Custom Connectors.

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

**Symptom**: Claude kann den MCP-Server nicht erreichen.

**Ursache**: Netzwerkprobleme oder Firewall-Regeln.

**Lösung**:

1. Bestätige, dass die URL `https://mcp.mittwald.de/mcp` ist
2. Überprüfe ausgehenden Netzwerkzugriff
3. Versuche es von einem anderen Netzwerk

## Team und Enterprise {#team-and-enterprise}

Für Team- und Enterprise-Pläne:

- **Owners** können Connectors hinzufügen, die für alle Workspace-Mitglieder verfügbar sind
- Mitglieder können gemeinsame Connectors ohne individuelles Setup verwenden
- Admins können Connector-Berechtigungen in den Workspace-Einstellungen verwalten

## FAQ {#faq}

### F: Welche Claude-Pläne unterstützen MCP-Connectors? {#faq-supported-plans}

**A**: Claude Pro, Max, Team und Enterprise-Pläne unterstützen Custom Connectors.

### F: Ist meine Authentifizierung sicher? {#faq-authentication-security}

**A**: Ja. Claude verwendet OAuth 2.1 mit PKCE. Tokens werden sicher gespeichert und automatisch erneuert.

### F: Kann ich mehrere MCP-Connectors verwenden? {#faq-multiple-connectors}

**A**: Ja. Du kannst mehrere Custom Connectors hinzufügen und sie in derselben Konversation verwenden.

### F: Wie entferne ich einen Connector? {#faq-remove-connector}

**A**: Gehe zu **Settings → Connectors**, finde den mittwald-Connector und klicke auf **Remove**.

### F: Funktioniert das mit Claude Desktop offline? {#faq-offline}

**A**: Nein. Remote-MCP-Server erfordern eine Internetverbindung.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](../)**: Richte GitHub Copilot, Cursor oder Claude Code CLI ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf der offiziellen Anthropic-Dokumentation:

- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) - Claude MCP Connector Setup
