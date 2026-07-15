---
title: TYPO3 MCP per STDIO konfigurieren
description: Führe TYPO3 MCP über mw app exec mit installationsbezogenen Einstellungen und bekannten Grenzen aus
useCases:
  - app-typo3-001-stdio-setup
  - app-typo3-002-installation-id-resolution
  - app-typo3-003-runtime-constraints
---

## Copy-paste-Prompt {#copy-paste-prompt}

```text
Set up TYPO3 MCP for my mittwald TYPO3 app using STDIO transport.

Tasks:
1) identify the correct TYPO3 installation ID,
2) verify TYPO3 MCP server package availability,
3) provide a working local command and MCP config block,
4) explain current runtime limitations before execution.

Ask before changing dependencies or running write operations.
```

## Voraussetzungen {#prerequisites}

- Eine TYPO3-Installation, die bei mittwald läuft
- Lokaler Zugriff auf die `mw` CLI
- TYPO3 MCP-Server-Paket `hn/typo3-mcp-server`, installiert in der TYPO3-Instanz

## Lokaler STDIO-Transport-Befehl {#local-stdio-transport-command}

Nutze `mw app exec`, um den TYPO3 MCP-Server im App-Container auszuführen:

```shellsession
user@local $ mw app exec --quiet --installation-id=a-XXXXX "vendor/bin/typo3 mcp:server"
```

Ersetze `a-XXXXX` durch die Installations-ID deiner TYPO3-App.

## Installations-ID finden {#find-the-installation-id}

Liste App-Installationen auf und wähle die TYPO3-Installations-ID:

```shellsession
user@local $ mw app list
```

Nutze die zurückgegebene ID in `--installation-id=...`.

## Hinweis zur Composer-Abhängigkeit {#composer-dependency-note}

Wenn `vendor/bin/typo3 mcp:server` nicht verfügbar ist, installiere das Paket in der TYPO3-Installation:

```shellsession
user@local $ mw app exec --installation-id=a-XXXXX "composer require hn/typo3-mcp-server"
```

## MCP-Konfigurationsbeispiel {#mcp-configuration-example}

Nutze diese kommandobasierte Server-Konfiguration in MCP-fähigen Tools:

```json
{
  "mcpServers": {
    "typo3": {
      "command": "mw",
      "args": [
        "app",
        "exec",
        "--quiet",
        "--installation-id=a-XXXXX",
        "vendor/bin/typo3 mcp:server"
      ]
    }
  }
}
```

## Bekannte Einschränkungen {#known-limitations}

:::warning

Aktuelle Plattformbeschränkungen gelten:

- TYPO3-Backend-Zugriffskontrollen werden in diesem MCP-Integrationspfad derzeit umgangen.
- Dieses Setup funktioniert derzeit nur mit lokalen MCP-Clients, bedingt durch Einschränkungen bei der `.well-known/` OAuth-Discovery.

:::
