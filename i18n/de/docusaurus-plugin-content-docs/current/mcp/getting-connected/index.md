---
title: Verbindung herstellen
description: Wähle dein Tool und richte die OAuth-Authentifizierung ein, um mittwald MCP zu nutzen
sidebar_position: 1
---

# Verbindung zu mittwald MCP herstellen

Willkommen! Diese Anleitung hilft dir, die Authentifizierung für mittwald MCP mit deinem bevorzugten Agentic Coding Tool einzurichten.

**Warum Authentifizierung erforderlich ist**: mittwald MCP erfordert authentifizierten Zugriff auf deine mittwald-Ressourcen. OAuth 2.1 ist die empfohlene Methode für interaktive Nutzung, und API-Tokens sind für Headless/CI-Workflows verfügbar.

## Wähle dein Tool {#choose-your-tool}

mittwald MCP funktioniert mit 6 beliebten KI-Tools. Wähle dasjenige, das du verwendest:

### Claude Desktop {#claude-desktop}

**Am besten für**: Nutzer der Claude Desktop App oder des Claude.ai Web-Interface

- **Typ**: Desktop App / Web App
- **OAuth-Muster**: Browser-basiert (Connector-Einstellungen UI)
- **Setup-Zeit**: ~5 Minuten
- **Komplexität**: ⭐ (Sehr einfach - nur Einstellungs-UI)

→ **[Claude Desktop einrichten](./claude-desktop)**

### ChatGPT {#chatgpt}

**Am besten für**: Nutzer von ChatGPT Plus, Team, Enterprise oder Education

- **Typ**: Web App / Mobile App
- **OAuth-Muster**: Browser-basiert (Connector-Einstellungen UI)
- **Setup-Zeit**: ~5 Minuten
- **Komplexität**: ⭐ (Sehr einfach - nur Einstellungs-UI)

→ **[ChatGPT einrichten](./chatgpt)**

### Claude Code {#claude-code}

**Am besten für**: Entwickler, die Anthropics Claude Code CLI verwenden

- **Typ**: Command-line Interface
- **OAuth-Muster**: Browser-basiert (Standard-Web-Flow)
- **Setup-Zeit**: ~10 Minuten
- **Komplexität**: ⭐⭐ (Einfach - unkomplizierte CLI-Befehle)

→ **[Claude Code einrichten](./claude-code)**

### GitHub Copilot {#github-copilot}

**Am besten für**: Entwickler, die GitHub Copilot in VS Code, Visual Studio, JetBrains IDEs oder Xcode verwenden

- **Typ**: IDE Extension (mehrere Plattformen)
- **OAuth-Muster**: IDE-basiert (Dynamic Client Registration)
- **Setup-Zeit**: ~10 Minuten
- **Komplexität**: ⭐⭐ (Einfach - IDE-Einstellungen-basiert)

→ **[GitHub Copilot einrichten](./github-copilot)**

### Cursor {#cursor}

**Am besten für**: Entwickler, die Cursor IDE verwenden (VS Code Fork mit KI-Features)

- **Typ**: IDE (Desktop Application)
- **OAuth-Muster**: IDE-basiert (Konfigurationsdatei oder Einstellungs-UI)
- **Setup-Zeit**: ~10 Minuten
- **Komplexität**: ⭐⭐ (Einfach - JSON-Konfiguration)

→ **[Cursor einrichten](./cursor)**

### Codex CLI {#codex-cli}

**Am besten für**: Entwickler, die OpenAIs Codex CLI für terminalbasierte KI-Workflows verwenden

- **Typ**: Command-line Interface
- **OAuth-Muster**: RFC 8252 Loopback (Native App Pattern)
- **Setup-Zeit**: ~10 Minuten
- **Komplexität**: ⭐⭐ (Einfach - CLI-Befehle, Browser für Auth)

→ **[Codex CLI einrichten](./codex-cli)**

## Zwei Authentifizierungsoptionen {#two-authentication-options}

### Option 1: OAuth 2.1 (Empfohlen) {#option-1-oauth}

**Am besten für**: Interaktive Nutzung in IDEs, Desktop Apps und Web-Interfaces

**Wie es funktioniert**:

1. Dein Tool leitet dich zur mittwald-Autorisierung um
2. Du meldest dich mit deinem mittwald-Account an
3. Du genehmigst Berechtigungen
4. mittwald gibt ein Token an dein Tool zurück
5. Dein Tool nutzt das Token automatisch

**Vorteile**:

- **Sicher**: Keine Passwörter in Konfigurationsdateien
- **Bequem**: Einmaliges Setup, automatische Token-Erneuerung
- **Granulare Kontrolle**: Widerrufe den Zugriff jederzeit

**Nachteile**:

- Erfordert Browser-Zugriff (nicht für Headless-Umgebungen geeignet)
- Benötigt interaktive Authentifizierung

| Tool           | OAuth-Implementierung               |
| -------------- | ----------------------------------- |
| Claude Desktop | Settings UI (Beta-Feature)          |
| ChatGPT        | Settings UI                         |
| Claude Code    | Standard Web Flow                   |
| GitHub Copilot | Dynamic Client Registration (DCR)   |
| Cursor         | Settings UI oder JSON-Konfiguration |
| Codex CLI      | RFC 8252 Loopback Flow              |

### Option 2: API Token {#option-2-api-token}

**Am besten für**: CI/CD-Pipelines, Headless-Server, automatisierte Skripte

**Wie es funktioniert**:

1. Gehe zu **mStudio → Benutzereinstellungen → API Tokens**
2. Generiere ein neues Token
3. Speichere das Token sicher
4. Füge das Token der Konfiguration deines Tools hinzu

**Vorteile**:

- **Headless-kompatibel**: Keine Browser-Interaktion erforderlich
- **Skript-freundlich**: Für Automatisierung geeignet
- **Einfach**: Keine OAuth-Flows

**Nachteile**:

- Manuelle Rotation erforderlich
- Token muss sicher gespeichert werden
- Keine automatische Erneuerung

:::caution

Speichere API-Tokens niemals in Konfigurationsdateien, die in die Versionskontrolle eingecheckt werden. Verwende Umgebungsvariablen oder sichere Secret-Management-Tools.

:::

**Setup-Anleitung für jedes Tool**:

| Tool           | Unterstützt API Token         |
| -------------- | ----------------------------- |
| Claude Desktop | Nein (nur OAuth)              |
| ChatGPT        | Nein (nur OAuth)              |
| Claude Code    | Ja (über Umgebungsvariable)   |
| GitHub Copilot | Ja (über Terraform-Variablen) |
| Cursor         | Ja (über JSON-Konfiguration)  |
| Codex CLI      | Ja (über Konfigurationsdatei) |

## Schrittweise Setup-Anleitungen {#step-by-step-guides}

Wähle dein Tool oben aus, um detaillierte Setup-Anweisungen zu erhalten.

Jede Anleitung enthält:

- Voraussetzungen
- Schritt-für-Schritt-Anweisungen
- Beispielkonfigurationen
- Verifizierungs-Prompts
- Fehlerbehebung

## Autorisierungsbereiche {#authorization-scopes}

Wenn du mittwald MCP mit OAuth verbindest, wirst du aufgefordert, Berechtigungen zu genehmigen. Der MCP-Server fordert:

| Bereich            | Beschreibung                     | Zweck                                         |
| ------------------ | -------------------------------- | --------------------------------------------- |
| `read:projects`    | Projekte anzeigen                | Projekte auflisten, Details abrufen           |
| `write:projects`   | Projekte erstellen/aktualisieren | Neue Projekte erstellen, Einstellungen ändern |
| `read:apps`        | Anwendungen anzeigen             | Installierte Apps auflisten                   |
| `write:apps`       | Apps verwalten                   | Apps installieren/aktualisieren/entfernen     |
| `read:databases`   | Datenbanken anzeigen             | Datenbank-Verbindungsdetails abrufen          |
| `write:databases`  | Datenbanken verwalten            | Datenbanken erstellen/löschen                 |
| `read:containers`  | Container anzeigen               | Container-Status abrufen                      |
| `write:containers` | Container verwalten              | Container starten/stoppen/erstellen           |
| `read:backups`     | Backups anzeigen                 | Backup-Zeitpläne anzeigen                     |
| `write:backups`    | Backups verwalten                | Backup-Richtlinien konfigurieren              |

:::note

Du kannst den Zugriff jederzeit in **mStudio → Benutzereinstellungen → Verbundene Apps** widerrufen.

:::

## Sicherheit und Best Practices {#security-best-practices}

### OAuth-Best-Practices {#oauth-best-practices}

✅ **Empfohlen**:

- Verwende OAuth für interaktive Tools (IDEs, Desktop Apps)
- Überprüfe die Berechtigungen, bevor du autorisierst
- Widerrufe den Zugriff für nicht genutzte Tools regelmäßig

❌ **Vermeide**:

- OAuth-Tokens mit anderen teilen
- Dieselbe OAuth-Sitzung auf mehreren Geräten verwenden
- Berechtigungen genehmigen, ohne sie zu lesen

### API-Token-Best-Practices {#api-token-best-practices}

✅ **Empfohlen**:

- Verwende Umgebungsvariablen oder Secret Manager
- Rotiere Tokens regelmäßig (alle 90 Tage)
- Erstelle separate Tokens für verschiedene Zwecke
- Setze Ablaufdaten für Tokens

❌ **Vermeide**:

- Tokens in Konfigurationsdateien hartcodieren
- Tokens in Versionskontrollsystemen committen
- Tokens in Logs oder Fehlermeldungen teilen

## Nach der Verbindung {#after-connecting}

Sobald die Authentifizierung abgeschlossen ist:

1. **Teste die Verbindung**: Verwende einen einfachen Prompt wie "List my mittwald projects"
2. **Probiere Tutorials aus**: Sieh dir [Tutorials](../tutorials/) für End-to-End-Workflows an
3. **Lies How-To Guides**: Lerne spezifische Aufgaben in [How-To Playbooks](../how-to/)

## Häufig gestellte Fragen {#faq}

### F: Kann ich mehrere Tools mit demselben mittwald-Account verbinden? {#faq-multiple-tools}

A: Ja. Jedes Tool erhält seine eigene OAuth-Sitzung oder du kannst separate API-Tokens verwenden.

### F: Was passiert, wenn mein Token abläuft? {#faq-token-expiration}

A: OAuth-Tokens werden automatisch erneuert. API-Tokens erfordern manuelle Erneuerung.

### F: Kann ich den Zugriff für ein Tool widerrufen? {#faq-revoke-access}

A: Ja. Um den Zugriff vollständig zu widerrufen, widerrufe zunächst die OAuth-Autorisierung für dieses Tool in mStudio (z. B. unter den verbundenen Apps oder API-Zugriff-Einstellungen deines Accounts). Dies macht die ausgegebenen Tokens sofort ungültig. Entferne anschließend die MCP-Server-Konfiguration aus deinem Tool, damit es keine Tokens mehr verwenden oder erneuern kann, um auf mittwald zuzugreifen.

### F: Sind meine Daten sicher? {#faq-data-security}

A: Ja. mittwald MCP verwendet branchenübliche OAuth 2.1 mit PKCE. Tokens sind verschlüsselt gespeichert.

### F: Welche Pläne unterstützen mittwald MCP? {#faq-supported-plans}

A: mittwald MCP ist für alle mittwald-Pläne verfügbar. Einige Tools (z. B. Claude Desktop) erfordern einen kostenpflichtigen Plan des Tool-Anbieters.

## Weitere Ressourcen {#further-resources}

**Learn more**: [mittwald API Authentication](/docs/v2/api/intro/) - Offizielle Dokumentation zu API-Tokens und Authentifizierungsmethoden.
