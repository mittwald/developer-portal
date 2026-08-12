---
title: Configure TYPO3 MCP via STDIO
description: Run TYPO3 MCP through mw app exec with installation-scoped settings and known limits
useCases:
  - app-typo3-001-stdio-setup
  - app-typo3-002-installation-id-resolution
  - app-typo3-003-runtime-constraints
---

## Copy-paste prompt {#copy-paste-prompt}

```text
Set up TYPO3 MCP for my mittwald TYPO3 app using STDIO transport.

Tasks:
1) identify the correct TYPO3 installation ID,
2) verify TYPO3 MCP server package availability,
3) provide a working local command and MCP config block,
4) explain current runtime limitations before execution.

Ask before changing dependencies or running write operations.
```

## Prerequisites {#prerequisites}

- A TYPO3 installation running on mittwald
- Local access to the `mw` CLI
- TYPO3 MCP server package `hn/typo3-mcp-server` installed in the TYPO3 instance

## Local STDIO transport command {#local-stdio-transport-command}

Use `mw app exec` to run the TYPO3 MCP server inside your app container:

```shellsession
user@local $ mw app exec --quiet --installation-id=a-XXXXX "vendor/bin/typo3 mcp:server"
```

Replace `a-XXXXX` with your TYPO3 app installation ID.

## Find the installation ID {#find-the-installation-id}

List app installations and pick the TYPO3 installation ID:

```shellsession
user@local $ mw app list
```

Use the returned ID in `--installation-id=...`.

## Composer dependency note {#composer-dependency-note}

If `vendor/bin/typo3 mcp:server` is not available, install the package inside the TYPO3 installation:

```shellsession
user@local $ mw app exec --installation-id=a-XXXXX "composer require hn/typo3-mcp-server"
```

## MCP configuration example {#mcp-configuration-example}

Use this command-based server configuration in MCP-capable tools:

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

## Known limitations {#known-limitations}

:::warning

Current platform constraints apply:

- TYPO3 backend access controls are currently bypassed by this MCP integration path.
- This setup currently works with local MCP clients only due to `.well-known/` OAuth discovery constraints.

:::
