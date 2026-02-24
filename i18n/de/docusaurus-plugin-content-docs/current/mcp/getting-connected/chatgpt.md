---
title: Erste Schritte mit ChatGPT
description: Richte mittwald MCP als Connector in ChatGPT mit Schritt-für-Schritt-Anweisungen ein
---

# Erste Schritte mit ChatGPT

ChatGPT unterstützt MCP-Server über sein Connector-Feature. Diese Anleitung zeigt dir, wie du mittwald MCP mit ChatGPT über OAuth-Authentifizierung verbindest.

## Voraussetzungen {#prerequisites}

- **ChatGPT Plus, Team, Enterprise oder Education Plan**
- **Developer Mode aktiviert** in den ChatGPT-Einstellungen
- **Ein mittwald-Account** (zur Authentifizierung)
- **5 Minuten** zum Abschluss des Setups

## Schritt 1: Developer Mode aktivieren {#step-1-enable-developer-mode}

1. Öffne [ChatGPT](https://chat.openai.com)
2. Klicke auf dein Profilsymbol und wähle **Settings**
3. Gehe zu **Apps & Connectors → Advanced settings**
4. Aktiviere **Developer Mode**

## Schritt 2: Connector erstellen {#step-2-create-connector}

1. Gehe in den Einstellungen zu **Connectors**
2. Klicke auf **Create**
3. Fülle die Connector-Details aus:

   | Feld               | Wert                                                                  |
   | ------------------ | --------------------------------------------------------------------- |
   | **Connector name** | mittwald                                                              |
   | **Description**    | Manage mittwald hosting: projects, apps, databases, domains, and more |
   | **Connector URL**  | `https://mcp.mittwald.de/mcp`                                         |

4. Klicke auf **Create** zum Speichern

ChatGPT validiert den Endpoint und zeigt die verfügbaren Tools von mittwald MCP an.

## Schritt 3: Authentifizieren {#step-3-authenticate}

Wenn du den Connector zum ersten Mal in einem Chat verwendest:

1. ChatGPT fordert dich auf, die Verbindung zu autorisieren
2. Ein Browserfenster öffnet sich für die mittwald-Autorisierung
3. Melde dich mit deinem mittwald-Account an
4. Überprüfe die angeforderten Berechtigungen
5. Klicke auf **Autorisieren**

## Schritt 4: Verbindung verifizieren {#step-4-verify-your-connection}

1. Starte einen neuen Chat in ChatGPT
2. Klicke auf **+** neben dem Message-Input
3. Wähle **More** und wähle den **mittwald** Connector
4. Teste die Verbindung:

```
List my mittwald projects
```

Du solltest eine Liste deiner mittwald-Projekte sehen.

✅ **Erfolg!** mittwald MCP ist jetzt mit ChatGPT verbunden.

## Tool-Bestätigung {#tool-confirmation}

ChatGPT fragt um Bestätigung, bevor es Schreiboperationen ausführt (Ressourcen erstellen, Einstellungen aktualisieren, etc.). Du kannst:

- **Einmal genehmigen**: Die spezifische Aktion bestätigen
- **Genehmigung merken**: Bestätigung für ähnliche Aktionen in Zukunft überspringen

Nur-Lese-Operationen wie Projekte auflisten laufen ohne Bestätigungs-Prompts.

## Häufige Aufgaben mit mittwald MCP {#common-tasks}

Sobald du authentifiziert bist, kannst du Prompts wie diese verwenden:

### Deine Projekte auflisten {#list-your-projects}

```
Show all my mittwald projects
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

### Fehler: "Developer Mode Not Available" {#error-developer-mode-not-available}

**Symptom**: Developer Mode Toggle erscheint nicht in den Einstellungen.

**Ursache**: Dein ChatGPT-Plan enthält dieses Feature nicht.

**Lösung**:

1. Upgrade auf ChatGPT Plus, Team, Enterprise oder Education
2. Warte auf das Feature-Rollout, falls du kürzlich upgegradet hast

### Fehler: "Connector Validation Failed" {#error-connector-validation-failed}

**Symptom**: ChatGPT kann den MCP-Endpoint nicht validieren.

**Ursache**: Netzwerkprobleme oder falsche URL.

**Lösung**:

1. Bestätige, dass die URL exakt `https://mcp.mittwald.de/mcp` ist
2. Überprüfe deine Netzwerkverbindung
3. Versuche, den Connector erneut zu erstellen

### Fehler: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth-Flow schlägt fehl oder läuft ab.

**Ursache**: Browser-Popup blockiert oder Sitzung abgelaufen.

**Lösung**:

1. Erlaube Popups für chat.openai.com in deinem Browser
2. Lösche Browser-Cookies für mittwald.de
3. Versuche es erneut von einem anderen Browser

### Fehler: "Tool Not Found" {#error-tool-not-found}

**Symptom**: ChatGPT kann mittwald-Tools nicht finden.

**Ursache**: Connector-Metadaten sind veraltet.

**Lösung**:

1. Gehe zu **Settings → Connectors**
2. Finde den mittwald-Connector
3. Klicke auf **Refresh**, um die Tool-Liste zu aktualisieren

### Fehler: "Permission Denied" {#error-permission-denied}

**Symptom**: Operationen schlagen mit Autorisierungsfehlern fehl.

**Ursache**: OAuth-Tokens abgelaufen oder Berechtigungen geändert.

**Lösung**:

1. Lösche den Connector in den Einstellungen
2. Erstelle ihn erneut und authentifiziere dich neu

## Tool-Metadaten aktualisieren {#refresh-tool-metadata}

Falls mittwald neue MCP-Tools hinzufügt:

1. Gehe zu **Settings → Connectors**
2. Finde den mittwald-Connector
3. Klicke auf **Refresh**

ChatGPT holt die aktualisierte Tool-Liste vom MCP-Server.

## FAQ {#faq}

### F: Welche ChatGPT-Pläne unterstützen MCP-Connectors? {#faq-supported-plans}

**A**: ChatGPT Plus, Team, Enterprise und Education-Pläne unterstützen Connectors mit Developer Mode.

### F: Funktioniert das auf Mobilgeräten? {#faq-mobile}

**A**: Ja. Connectors funktionieren in ChatGPT Web- und Mobile-Apps.

### F: Ist meine Authentifizierung sicher? {#faq-authentication-security}

**A**: Ja. ChatGPT verwendet OAuth für Connector-Authentifizierung. Tokens werden sicher von OpenAI gespeichert.

### F: Kann ich mehrere MCP-Connectors verwenden? {#faq-multiple-connectors}

**A**: Ja. Du kannst mehrere Connectors hinzufügen und sie in derselben Konversation verwenden.

### F: Wie entferne ich den Connector? {#faq-remove-connector}

**A**: Gehe zu **Settings → Connectors**, finde den mittwald-Connector und lösche ihn.

### F: Warum fragt ChatGPT um Bestätigung? {#faq-confirmation}

**A**: Schreiboperationen erfordern Genehmigung, um versehentliche Änderungen zu verhindern. Du kannst wählen, Genehmigungen für bestimmte Aktionstypen zu merken.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](./)**: Richte Claude Desktop, GitHub Copilot oder Cursor ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf der offiziellen OpenAI-Dokumentation:

- [Connect ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt/) - ChatGPT MCP Connector Setup
