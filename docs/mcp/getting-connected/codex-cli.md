---
title: Getting Connected with Codex CLI
description: Connect Codex CLI to mittwald MCP using OAuth or API tokens
---

# Getting Connected with Codex CLI

This guide shows the current Codex CLI flow for connecting to mittwald MCP.

## Prerequisites

- Codex CLI installed (`codex --version`)
- A mittwald account (for OAuth)
- Browser access for OAuth login
- Optional: mittwald API token for headless usage

## Confirm Your CLI Supports MCP

```bash
codex mcp --help
```

You should see commands like `add`, `list`, `get`, `login`, `logout`, and `remove`.

## Option A: OAuth (Recommended for interactive use)

### 1. Add mittwald MCP server

```bash
codex mcp add mittwald --url https://mittwald-mcp-fly2.fly.dev/mcp
```

Current Codex CLI behavior:
- detects OAuth support from the server
- starts the OAuth flow automatically
- prints an authorization URL and waits for callback

### 2. Complete browser login

- Open the authorization URL if your browser does not open automatically
- Sign in with your mittwald account
- Approve requested scopes

### 3. Verify server registration

```bash
codex mcp list
codex mcp get mittwald
```

### 4. Re-authenticate later (if needed)

```bash
codex mcp login mittwald
```

Use this when tokens are revoked/expired and you need a fresh OAuth session.

## Option B: API Token (CI/CD and headless environments)

### 1. Create token in mStudio

- mStudio -> User Settings -> API Tokens
- Create token with least-privilege scopes
- Copy token once

### 2. Export token locally

```bash
export MITTWALD_API_TOKEN="<your_token>"
```

### 3. Add server with token env var

```bash
codex mcp add mittwald \
  --url https://mittwald-mcp-fly2.fly.dev/mcp \
  --bearer-token-env-var MITTWALD_API_TOKEN
```

## Manage the Connection

### Show configured server

```bash
codex mcp get mittwald
```

### Logout OAuth session

```bash
codex mcp logout mittwald
```

### Remove server config

```bash
codex mcp remove mittwald
```

## Troubleshooting

### `missing required argument 'commandOrUrl'`

This error appears when `add` is called without a server name and URL/command.

Correct format:

```bash
codex mcp add <name> --url <mcp_endpoint>
```

Example:

```bash
codex mcp add mittwald --url https://mittwald-mcp-fly2.fly.dev/mcp
```

### OAuth browser step did not open

- Copy the printed authorization URL from terminal into your browser
- Complete login and consent
- Return to terminal

### Token-based auth returns `401`

- verify `MITTWALD_API_TOKEN` is set
- rotate token in mStudio if needed
- remove and re-add server configuration

```bash
codex mcp remove mittwald
codex mcp add mittwald --url https://mittwald-mcp-fly2.fly.dev/mcp --bearer-token-env-var MITTWALD_API_TOKEN
```

## Security Notes

- Prefer OAuth for interactive local usage (refresh and revocation support)
- Prefer API tokens for CI/CD and non-interactive jobs
- Never commit tokens in repository files

## Next Steps

- [Tutorials](../tutorials/) for human + agent workflows
- [How-To Playbooks](../how-to/) for task-focused operations
- [Auth & Token Lifecycle](../auth-token-lifecycle/) for consent/refresh/re-auth behavior
