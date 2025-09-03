---
title: KI-unterstützte Entwicklung
sidebar_label: KI-unterstützte Entwicklung
---

# KI-unterstützte Entwicklung

Du kannst mittwalds [KI-Modelle](/docs/v2/platform/aihosting) verwenden, um dich in deinem Entwicklungsprozess zu unterstützen. Die Modelle sind DSGVO-konform und werden in Deutschland gehostet, ohne Nutzerdaten zu speichern oder für das Training zu verwenden.

## Verfügbare Modelle

Der Service bietet verschiedene KI-Modelle, die für unterschiedliche Entwicklungsaufgaben optimiert sind. Eine vollständige Liste der verfügbaren Modelle und ihrer Spezifikationen findest du in der [KI-Modelle-Dokumentation](/docs/v2/platform/aihosting/models).

## IDE-Integration

### Übersicht

| IDE                                      | Integrationen                                        |
| ---------------------------------------- | ---------------------------------------------------- |
| Jetbrains IDEs (IntelliJ, PHPStorm, ...) | [Continue](#continue), [Jetbrains AI](#jetbrains-ai) |
| Visual Studio Code                       | [Continue](#continue)                                |

### Jetbrains AI (für Jetbrains IDEs, wie IntelliJ, PHPStorm, WebStorm, ...) {#jetbrains-ai}

Um die Modelle zu nutzen, musst du einen Proxy-Dienst auf deinem lokalen Rechner einrichten, der die Authentifizierung übernimmt und Anfragen an die mittwald-API weiterleitet.

Detaillierte Anweisungen zur Integration des Proxys in deine IDE findest du im [IDE-Setup-Abschnitt](https://github.com/mittwald/llm-proxy#ide-setup) der Projekt-README.

### Continue (für Visual Studio Code oder Jetbrains IDEs) {#continue}

[Continue](https://www.continue.dev) funktioniert sowohl mit Jetbrains IDEs als auch mit Visual Studio Code.

Installiere zuerst das Plugin für deine IDE:

- [Jetbrains IDEs](https://plugins.jetbrains.com/plugin/22707-continue)
- [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Continue.continue)

Modelle werden normalerweise in der `config.yaml`-Datei konfiguriert (normalerweise im `~/.continue/`-Verzeichnis in deinem Home-Verzeichnis zu finden). Du kannst die mittwald-Modelle (`Qwen3-Coder-30B-Instruct` funktioniert gut für Code-Generierung) mit der folgenden Konfiguration einrichten:

```yaml
name: mittwald
version: 1.0.0
schema: v1
models:
  - name: Qwen3-Coder-30B-Instruct
    provider: openai
    model: Qwen3-Coder-30B-Instruct
    apiBase: https://llm.aihosting.mittwald.de/v1
    apiKey: <API-SCHLÜSSEL-EINFÜGEN>
    roles:
      - chat
      - edit
      - apply
    capabilities:
      - tool_use
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
```

## Nutzungslimits

Während der Beta-Phase ist jeder API-Schlüssel auf 300 Anfragen pro Minute begrenzt. Der Service ist derzeit kostenlos in der Beta-Phase, die vollständige Veröffentlichung ist für 2025 geplant.
