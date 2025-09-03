---
title: KI-unterstützte Entwicklung
sidebar_label: KI-unterstützte Entwicklung
---

# KI-unterstützte Entwicklung

Du kannst mittwalds [KI-Modelle](/platform/aihosting) verwenden, um dich in deinem Entwicklungsprozess zu unterstützen. Die Modelle sind DSGVO-konform und werden in Deutschland gehostet, ohne Nutzerdaten zu speichern oder für das Training zu verwenden.

Um die Modelle zu nutzen, musst du einen Proxy-Dienst auf deinem lokalen Rechner einrichten, der die Authentifizierung übernimmt und Anfragen an die mittwald-API weiterleitet.

## Einrichtung

Klone den [LLM-Proxy](https://github.com/mittwald/llm-proxy) und konfiguriere ihn mit deinen mittwald-API-Zugangsdaten:

```bash
git clone https://github.com/mittwald/llm-proxy.git
cd llm-proxy
```

Hole dir deinen API-Schlüssel aus dem [mittwald mStudio](https://studio.mittwald.de) und konfiguriere die Umgebungvariablen:

```bash
cp .env.example .env
# Bearbeite .env und füge deinen API-Schlüssel hinzu
```

Starte den Proxy-Dienst:

```bash
docker compose up
```

Der Proxy läuft unter `http://localhost:4000/v1` und bietet eine OpenAI-kompatible API-Schnittstelle.

## Verfügbare Modelle

Der Service bietet verschiedene KI-Modelle, die für unterschiedliche Entwicklungsaufgaben optimiert sind. Eine vollständige Liste der verfügbaren Modelle und ihrer Spezifikationen findest du in der [KI-Modelle-Dokumentation](/platform/aihosting/models).

## IDE-Integration

Detaillierte Anweisungen zur Integration des Proxys in deine IDE findest du im [IDE-Setup-Abschnitt](https://github.com/mittwald/llm-proxy#ide-setup) der Projekt-README.

## Nutzungslimits

Während der Beta-Phase ist jeder API-Schlüssel auf 300 Anfragen pro Minute begrenzt. Der Service ist derzeit kostenlos in der Beta-Phase, die vollständige Veröffentlichung ist für 2025 geplant.
