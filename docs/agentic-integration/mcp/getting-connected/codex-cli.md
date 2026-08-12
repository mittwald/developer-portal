---
title: Getting Connected with Codex CLI
description: Connect Codex CLI to mittwald MCP using OAuth or API tokens
---

# Getting Connected with Codex CLI

This guide shows the current Codex CLI flow for connecting to mittwald MCP.

## Prerequisites {#prerequisites}

- Codex CLI installed (`codex --version`)
- A mittwald account (for OAuth)
- Browser access for OAuth login
- Optional: mittwald API token for headless usage

## Confirm Your CLI Supports MCP {#confirm-cli-supports-mcp}

```shellsession
user@local $ codex mcp --help
```

You should see commands like `add`, `list`, `get`, `login`, `logout`, and `remove`.

## Option A: OAuth (Recommended for interactive use) {#option-a-oauth}

### 1. Add mittwald MCP server {#add-mcp-server}

```shellsession
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp
```

Current Codex CLI behavior:

- detects OAuth support from the server
- starts the OAuth flow automatically
- prints an authorization URL and waits for callback

### 2. Complete browser login {#complete-browser-login}

- Open the authorization URL if your browser does not open automatically
- Sign in with your mittwald account
- Approve requested scopes

### 3. Verify server registration {#verify-server-registration}

```shellsession
user@local $ codex mcp list
user@local $ codex mcp get mittwald
```

### 4. Re-authenticate later (if needed) {#re-authenticate-later}

```shellsession
user@local $ codex mcp login mittwald
```

Use this when tokens are revoked/expired and you need a fresh OAuth session.

## Option B: API Token (CI/CD and headless environments) {#option-b-api-token}

### 1. Create token in mStudio {#create-token-in-mstudio}

- mStudio -> User Settings -> API Tokens
- Create token with least-privilege scopes
- Copy token once

### 2. Export token locally {#export-token-locally}

```shellsession
user@local $ export MITTWALD_API_TOKEN="<your_token>"
```

### 3. Add server with token env var {#add-server-with-token}

```shellsession
user@local $ codex mcp add mittwald \
    --url https://mcp.mittwald.de/mcp \
    --bearer-token-env-var MITTWALD_API_TOKEN
```

## Manage the Connection {#manage-the-connection}

### Show configured server {#show-configured-server}

```shellsession
user@local $ codex mcp get mittwald
```

### Logout OAuth session {#logout-oauth-session}

```shellsession
user@local $ codex mcp logout mittwald
```

### Remove server config {#remove-server-config}

```shellsession
user@local $ codex mcp remove mittwald
```

## Troubleshooting {#troubleshooting}

### `missing required argument 'commandOrUrl'` {#error-missing-argument}

This error appears when `add` is called without a server name and URL/command.

Correct format:

```shellsession
user@local $ codex mcp add <name> --url <mcp_endpoint>
```

Example:

```shellsession
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp
```

### OAuth browser step did not open {#oauth-browser-step-did-not-open}

- Copy the printed authorization URL from terminal into your browser
- Complete login and consent
- Return to terminal

### Token-based auth returns `401` {#token-based-auth-returns-401}

- verify `MITTWALD_API_TOKEN` is set
- rotate token in mStudio if needed
- remove and re-add server configuration

```shellsession
user@local $ codex mcp remove mittwald
user@local $ codex mcp add mittwald --url https://mcp.mittwald.de/mcp --bearer-token-env-var MITTWALD_API_TOKEN
```

## Security Notes {#security-notes}

- Prefer OAuth for interactive local usage (refresh and revocation support)
- Prefer API tokens for CI/CD and non-interactive jobs
- Never commit tokens in repository files

## Next Steps {#next-steps}

- [Tutorials](../../tutorials/) for human + agent workflows
- [How-To Playbooks](../../how-to/) for task-focused operations
- [Auth & Token Lifecycle](../../auth-token-lifecycle/) for consent/refresh/re-auth behavior
