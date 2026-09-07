---
title: Erste Schritte mit ChatGPT
description: Installiere die offizielle mittwald App in ChatGPT mit Schritt-für-Schritt-Anweisungen
---

# Erste Schritte mit ChatGPT

mittwald veröffentlicht eine offizielle App im ChatGPT App-Verzeichnis, die auf mittwald MCP basiert. Diese Anleitung zeigt dir, wie du die mittwald App installierst und mit deinem mittwald-Account über OAuth-Authentifizierung verbindest.

## Voraussetzungen {#prerequisites}

- **ChatGPT Plus, Team, Enterprise oder Education Plan**
- **Ein mittwald-Account** (zur Authentifizierung)
- **2 Minuten** zum Abschluss des Setups

## Schritt 1: mittwald App installieren {#step-1-install-the-app}

1. Öffne den [mittwald App-Eintrag](https://chatgpt.com/plugins/plugin_asdk_app_6a68b368b8588191afee9a7e2b327d63) in ChatGPT, oder gehe zu **Settings → Apps & Connectors**, suche nach "mittwald" und öffne den Eintrag
2. Klicke auf **Install**

Da es sich um eine offizielle, veröffentlichte App handelt, kennt ChatGPT bereits ihren Endpoint und die verfügbaren Tools — es gibt keine Server-URL einzutragen und keinen Developer Mode zu aktivieren.

## Schritt 2: Authentifizieren {#step-2-authenticate}

Wenn du die mittwald App zum ersten Mal in einem Chat verwendest:

1. ChatGPT fordert dich auf, die Verbindung zu autorisieren
2. Ein Browserfenster öffnet sich für die mittwald-Autorisierung
3. Melde dich mit deinem mittwald-Account an
4. Überprüfe die angeforderten Berechtigungen
5. Klicke auf **Autorisieren**

## Schritt 3: Verbindung verifizieren {#step-3-verify-your-connection}

1. Starte einen neuen Chat in ChatGPT
2. Klicke auf **+** neben dem Message-Input
3. Wähle **More** und wähle die **mittwald** App
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

### Fehler: "App Not Available" {#error-app-not-available}

**Symptom**: Die mittwald App erscheint nicht unter **Apps & Connectors** oder in den Suchergebnissen.

**Ursache**: Dein ChatGPT-Plan unterstützt keine Apps, oder der App-Eintrag ist noch nicht geladen.

**Lösung**:

1. Upgrade auf ChatGPT Plus, Team, Enterprise oder Education
2. Lade den [mittwald App-Eintrag](https://chatgpt.com/plugins/plugin_asdk_app_6a68b368b8588191afee9a7e2b327d63) direkt neu

### Fehler: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth-Flow schlägt fehl oder läuft ab.

**Ursache**: Browser-Popup blockiert oder Sitzung abgelaufen.

**Lösung**:

1. Erlaube Popups für chat.openai.com in deinem Browser
2. Lösche Browser-Cookies für mittwald.de
3. Versuche es erneut von einem anderen Browser

### Fehler: "Tool Not Found" {#error-tool-not-found}

**Symptom**: ChatGPT kann mittwald-Tools nach der Installation nicht finden.

**Ursache**: Die Metadaten der installierten App sind noch nicht aktualisiert.

**Lösung**:

1. Gehe zu **Settings → Apps & Connectors**
2. Finde die mittwald App
3. Klicke auf **Refresh**, um die Tool-Liste zu aktualisieren, oder entferne die App und installiere sie erneut

### Fehler: "Permission Denied" {#error-permission-denied}

**Symptom**: Operationen schlagen mit Autorisierungsfehlern fehl.

**Ursache**: OAuth-Tokens abgelaufen oder Berechtigungen geändert.

**Lösung**:

1. Deinstalliere die mittwald App in den Einstellungen
2. Installiere sie erneut und authentifiziere dich neu

## FAQ {#faq}

### F: Welche ChatGPT-Pläne unterstützen die mittwald App? {#faq-supported-plans}

**A**: ChatGPT Plus, Team, Enterprise und Education-Pläne unterstützen die Installation von Apps.

### F: Funktioniert das auf Mobilgeräten? {#faq-mobile}

**A**: Ja. Installierte Apps funktionieren in ChatGPT Web- und Mobile-Apps.

### F: Ist meine Authentifizierung sicher? {#faq-authentication-security}

**A**: Ja. ChatGPT verwendet OAuth für die App-Authentifizierung. Tokens werden sicher von OpenAI gespeichert.

### F: Kann ich mehrere Apps gleichzeitig verwenden? {#faq-multiple-connectors}

**A**: Ja. Du kannst mehrere Apps installieren und sie in derselben Konversation verwenden.

### F: Wie entferne ich die App? {#faq-remove-connector}

**A**: Gehe zu **Settings → Apps & Connectors**, finde die mittwald App und deinstalliere sie.

### F: Warum fragt ChatGPT um Bestätigung? {#faq-confirmation}

**A**: Schreiboperationen erfordern Genehmigung, um versehentliche Änderungen zu verhindern. Du kannst wählen, Genehmigungen für bestimmte Aktionstypen zu merken.

## Nächste Schritte {#next-steps}

- **[Tutorials](../../tutorials/)**: Sieh dir Praxisbeispiele an
- **[Andere Tools](./)**: Richte Claude, GitHub Copilot oder Cursor ein

## Offizielle Dokumentation {#official-documentation}

Diese Anleitung basiert auf der offiziellen OpenAI-Dokumentation:

- [Connect ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt/) - ChatGPT App- und Connector-Setup
