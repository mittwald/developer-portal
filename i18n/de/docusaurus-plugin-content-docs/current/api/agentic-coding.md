---
title: Nutzung in Coding-Agenten
sidebar_position: 4
description: |
  Erfahre, wie du die mStudio v2 API effektiv in Coding-Agenten wie GitHub Copilot oder Claude Code nutzen kannst. Diese Seite bietet Hinweise zum Prompting dieser Agenten für die Code-Generierung und zur optimalen Strukturierung deines Codes.
---

Wenn du einen Coding-Agenten wie GitHub Copilot oder Claude Code verwendest, um Code zu generieren, der mit der mStudio v2 API interagiert, kannst du den Context7 MCP-Server nutzen, um dem Agenten Zugriff auf die API-Spezifikation und Dokumentation zu geben. Dadurch kann der Agent Code generieren, der korrekt und stets auf dem neuesten Stand der API-Änderungen ist.

## Verfügbare Bibliotheken auf Context7 {#context7-libraries}

- [OpenAPI-Spezifikation für die mStudio v2 API](https://context7.com/openapi/api_mittwald_de_v2_openapi_json)
- [mittwald Developer-Dokumentation](https://context7.com/mittwald/developer-portal) (diese Seite)
- [mittwald Flow Design-System](https://context7.com/websites/mittwald_github_io_flow)
- weitere folgen...

## Context7 in Coding-Agenten verwenden {#context7-usage}

In der [offiziellen Dokumentation von Context7](https://github.com/upstash/context7#installation) erfährst du, wie du den Context7 MCP-Server in deinem Coding-Agenten einrichten kannst.

In Claude Code kannst du beispielsweise den folgenden Befehl verwenden, um den MCP-Server zu aktivieren:

```shellsession
claude mcp add --header "CONTEXT7_API_KEY: YOUR_API_KEY" --transport http context7 https://mcp.context7.com/mcp
```

Um den Agenten dazu zu bringen, die mStudio v2 API-Spezifikation für die Code-Generierung zu verwenden, kannst du die folgende Anweisung in deinen Prompt aufnehmen:

```
Always use the `/openapi/api_mittwald_de_v2_openapi_json` library from Context7 for any code generation related to the mStudio v2 API. This library contains the latest OpenAPI specification for the API, and ensures that your generated code is accurate and up-to-date with the latest API changes.
```
