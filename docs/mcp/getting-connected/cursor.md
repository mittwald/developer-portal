---
title: Getting Started with Cursor
description: Connect mittwald MCP to Cursor using OAuth (recommended) or API token headers
---

# Getting Started with Cursor

Cursor can connect to mittwald MCP over HTTP and use OAuth for authentication.

This guide uses the Fly deployment endpoint:

`https://mcp.mittwald.de/mcp`

## Prerequisites {#prerequisites}

- Cursor installed
- A mittwald account
- Browser access for OAuth
- Cursor MCP enabled in your workspace

## Step 1: Create MCP Configuration {#step-1-create-mcp-configuration}

Cursor reads MCP configuration from either:

- Project: `.cursor/mcp.json`
- Global: `~/.cursor/mcp.json`

Use project config if you want the setup shared with the repo.

## Step 2: Add mittwald MCP (OAuth, recommended) {#step-2-add-mcp-oauth}

Add this to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp"
    }
  }
}
```

Important:

- Cursor uses `mcpServers` (not `servers`).
- For remote servers, `url` is enough to start OAuth-capable flows when the server supports it.

## Step 3: Authenticate {#step-3-authenticate}

1. Open Cursor chat.
2. Ask for a mittwald action, for example:

```text
Use mittwald MCP to list my projects.
```

3. Cursor opens the OAuth flow in your browser.
4. Sign in and approve scopes.
5. Return to Cursor and re-run the prompt.

## Step 4: Verify {#step-4-verify}

Run:

```text
Use mittwald MCP to get my user profile and list my projects.
```

You should receive mittwald data from live MCP tools.

## Optional: Static OAuth Client (Only if your provider requires it) {#optional-static-oauth-client}

Most setups should use the default flow above. Use static OAuth only when your OAuth provider requires pre-registered client credentials/redirect URIs.

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp",
      "auth": {
        "CLIENT_ID": "${env:MITTWALD_OAUTH_CLIENT_ID}",
        "CLIENT_SECRET": "${env:MITTWALD_OAUTH_CLIENT_SECRET}",
        "scopes": ["mcp", "offline_access"]
      }
    }
  }
}
```

Cursor static redirect URI:

`cursor://anysphere.cursor-mcp/oauth/callback`

If your OAuth provider requires allowlisted redirect URIs, include exactly that value.

## Alternative: API Token Authentication {#alternative-api-token}

If you prefer token headers (for CI or deterministic non-interactive runs):

```json
{
  "mcpServers": {
    "mittwald": {
      "url": "https://mcp.mittwald.de/mcp",
      "headers": {
        "Authorization": "Bearer ${env:MITTWALD_API_TOKEN}"
      }
    }
  }
}
```

Set the token in your shell/environment before launching Cursor.

## Troubleshooting {#troubleshooting}

### OAuth prompt never appears {#oauth-prompt-never-appears}

- Trigger a real tool call from chat (not just opening config).
- Confirm the MCP server is enabled in Cursor.
- Re-open Cursor after editing `mcp.json`.

### Invalid JSON / server not loading {#invalid-json-server-not-loading}

- Validate `.cursor/mcp.json` syntax.
- Confirm top-level key is `mcpServers`.

### 401 Unauthorized {#401-unauthorized}

- Re-authenticate in Cursor.
- If using token headers, rotate the token in mStudio and update `MITTWALD_API_TOKEN`.

### Re-auth needed after inactivity {#re-auth-needed-after-inactivity}

- Re-run a tool call to trigger a fresh OAuth flow.
- If frequent re-auth occurs, update Cursor and verify provider refresh-token behavior.

## FAQ {#faq}

### Q: Should I manually register an OAuth client for Cursor? {#faq-manual-oauth-client}

A: Not for the default setup. Start with `url` only. Use static OAuth config only if your provider explicitly requires fixed client credentials.

### Q: Can I keep secrets out of JSON files? {#faq-secrets-out-of-json}

A: Yes. Use interpolation with `${env:NAME}` and set environment variables outside the repo.

### Q: Can I use one config across projects? {#faq-one-config-across-projects}

A: Yes, use `~/.cursor/mcp.json` for global configuration.

## Next Steps {#next-steps}

- [Tutorials](../../tutorials/)
- [Other Tools](./)

## Official Documentation {#official-documentation}

- [Cursor MCP Overview](https://cursor.com/docs/context/mcp)
- [Cursor MCP Extension API](https://cursor.com/docs/context/mcp-extension-api)
