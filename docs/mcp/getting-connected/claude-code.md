---
title: Getting Started with Claude Code
description: Set up OAuth and mittwald MCP in Claude Code with step-by-step instructions
---

# Getting Started with Claude Code

Claude Code is Anthropic's CLI for working with Claude in your terminal. This guide shows you how to connect mittwald MCP using OAuth (recommended) or an API key so you can access mittwald tools directly from Claude Code.

## Prerequisites

- **Claude Code installed** (https://code.claude.com/docs/en/mcp)
- **A mittwald account** (to authenticate)
- **A web browser** (for OAuth login)
- **10 minutes** to complete setup

## Authentication Options

Claude Code supports two ways to authenticate with mittwald MCP:

- **OAuth (recommended)**: Secure browser-based flow with automatic token refresh.
- **API key**: Best for headless/CI environments where OAuth is not practical.

## Option A: OAuth Authentication (Recommended)

Claude Code handles OAuth automatically using Dynamic Client Registration (DCR), so you do **not** need to register a client manually.

### Step 1: Add mittwald MCP Server

Run this command in your terminal:

```shellsession
user@local $ claude mcp add --transport http mittwald https://mittwald-mcp-fly2.fly.dev/mcp
```

**Optional: choose a configuration scope** (default is `local`):

```shellsession
# Local (default, private)
user@local $ claude mcp add --transport http --scope local mittwald https://mittwald-mcp-fly2.fly.dev/mcp

# Project (shared via .mcp.json)
user@local $ claude mcp add --transport http --scope project mittwald https://mittwald-mcp-fly2.fly.dev/mcp

# User (available across projects)
user@local $ claude mcp add --transport http --scope user mittwald https://mittwald-mcp-fly2.fly.dev/mcp
```

### Step 2: Authenticate with mittwald

In Claude Code, run the `/mcp` command:

1. Start Claude Code: `claude`
2. Type `/mcp` and select the **mittwald** server
3. Claude Code opens your browser for OAuth authorization

If the browser doesn't open, Claude Code will show a URL you can copy and paste manually.

### Step 3: Complete Authorization

**In your browser**:
1. Log in to mittwald
2. Review the requested scopes
3. Click **Authorize**

**Back in Claude Code**:
- The authorization is captured automatically
- Tokens are stored securely
- Tokens refresh automatically when they expire

### Step 4: Verify Your Connection

Ask Claude Code to run a simple mittwald tool:

```
Use mittwald MCP to get my user information
```

You should see output similar to:

```json
{
  "id": "user-abc123",
  "email": "your-email@mittwald.de",
  "name": "Your Name",
  "created": "2024-01-01T00:00:00Z"
}
```

✅ **Success!** mittwald MCP is now connected to Claude Code.

## Option B: API Key Authentication

Use this option for headless servers or CI environments where OAuth is not practical.

### Step 1: Get Your mittwald API Token

1. Go to **MStudio → User Settings → API Tokens**
2. Create a new token with the permissions you need
3. Copy and store the token securely

### Step 2: Add mittwald MCP with API Key

```shellsession
user@local $ claude mcp add --transport http mittwald https://mittwald-mcp-fly2.fly.dev/mcp \
    --header "Authorization: Bearer YOUR_MITTWALD_API_TOKEN"
```

**Important**: API tokens do **not** auto-refresh. Rotate them regularly and keep them secret.

### Step 3: Verify Connection

Use the same test as OAuth:

```
Use mittwald MCP to get my user information
```

## Common Tasks with mittwald MCP

Once authenticated, you can use natural language prompts in Claude Code:

### List Your Projects

```
Show me all my mittwald projects
```

### Get App Information

```
List all apps in project [project-id]
```

### View Database Info

```
Show database details for [db-id]
```

### Check Server Status

```
Get server status for [server-id]
```

### Create a Backup

```
Create a backup for project [project-id]
```

## Troubleshooting

### Error: "Browser Didn't Open"

**Symptom**: Claude Code shows an authorization URL, but no browser window appears.

**Cause**: Default browser not detected or environment is headless.

**Fix**:
1. Copy the URL displayed in Claude Code
2. Paste it into your browser manually
3. Complete authorization and return to Claude Code

### Error: "OAuth Authorization Failed"

**Symptom**: OAuth flow completes in the browser, but Claude Code reports authorization failed.

**Cause**: OAuth server rejected the client registration or callback.

**Fix**:
1. Run `/mcp` again and retry the flow
2. Ensure your network allows access to the OAuth server
3. If it persists, contact mittwald support with the error message

### Error: "Connection Refused"

**Symptom**: Claude Code can't reach `https://mittwald-mcp-fly2.fly.dev/mcp`.

**Cause**: Network issue or firewall/proxy blocking outbound HTTPS.

**Fix**:
1. Verify internet access
2. Retry the command from a different network
3. Check proxy or firewall rules

### Error: "Invalid Token"

**Symptom**: Requests fail with 401 Unauthorized after previously working.

**Cause**: Token expired or was revoked.

**Fix**:
- **OAuth**: Run `/mcp` and re-authenticate
- **API Key**: Generate a new API token and re-add the server

### Error: "Permission Denied"

**Symptom**: You receive 403 errors for specific operations.

**Cause**: The token lacks required scopes.

**Fix**:
1. Re-authenticate and approve the required scopes
2. For API keys, create a new token with the correct permissions

### Error: "Server Not Found"

**Symptom**: Claude Code says the MCP server doesn't exist.

**Cause**: Server name or URL is incorrect, or the configuration scope is different.

**Fix**:
1. Run `claude mcp list` to check configured servers
2. Re-add the server with the correct URL and scope

## FAQ

### Q: Is my password transmitted to Claude Code?
**A**: No. Your password is entered in your browser with mittwald. Claude Code only receives an OAuth token.

### Q: Can I use multiple mittwald accounts?
**A**: Yes, but you must authenticate each account separately and manage separate configurations (for example, different scopes or server names).

### Q: How long do tokens last?
**A**: OAuth access tokens typically last about 1 hour, but Claude Code refreshes them automatically. API keys remain valid until revoked.

### Q: How do I revoke access?
**A**: In Claude Code, run `/mcp`, select the server, and choose **Clear authentication**. You can also revoke tokens from MStudio.

### Q: Can I use this on a server (SSH)?
**A**: OAuth requires a browser, so API keys are usually better for headless servers. If needed, authenticate on a local machine and reuse the configuration.

### Q: What scopes should I request?
**A**: Use the smallest set of scopes that fits your tasks. Most developers start with `user:read`, `customer:read`, `project:read`, and `app:read`.

### Q: How does Claude Code differ from Claude Desktop?
**A**: Claude Code is a CLI with MCP support and terminal workflows. Claude Desktop is a GUI app with a different configuration model.

## Next Steps

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](./)**: Set up GitHub Copilot, Cursor, or Codex CLI

## Official Documentation

This guide is based on official Claude Code capabilities:
- [Claude Code IAM Documentation](https://code.claude.com/docs/en/iam) - OAuth 2.1 with DCR support
- [Claude Code MCP Setup](https://code.claude.com/docs/en/mcp) - MCP server configuration
- [OAuth for MCP Server Guide](https://www.buildwithmatija.com/blog/oauth-mcp-server-claude) - Community implementation guide

## Still Need Help?

- Check [Claude Code Documentation](https://code.claude.com/docs/en/mcp) for CLI-specific help
- Contact [mittwald support](mailto:support@mittwald.de)
