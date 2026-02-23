---
title: Getting Started with GitHub Copilot
description: Set up OAuth and mittwald MCP in GitHub Copilot with step-by-step instructions
---

# Getting Started with GitHub Copilot

GitHub Copilot in VS Code can connect to mittwald MCP so you can run mittwald tools directly from Copilot Chat. This guide shows you how to set up OAuth (recommended) or an API key for headless environments.

## Prerequisites

- **VS Code 1.99 or later** (required for OAuth support)
- **GitHub Copilot extension installed**
- **A mittwald account** (to authenticate)
- **10 minutes** to complete setup

## Step 1: Create MCP Configuration

Create a project-level configuration file at `.vscode/mcp.json`. Choose one of the authentication methods below.

### 1.1 OAuth (Recommended)

Use OAuth for the secure browser-based flow with automatic token refresh.

```json
{
  "servers": {
    "mittwald": {
      "type": "http",
      "url": "https://mcp.mittwald.de/mcp"
    }
  }
}
```

### 1.2 API Key (Alternative)

Use this option for headless servers or CI environments where OAuth is not practical. Input variables keep the token out of source control.

```json
{
  "inputs": [
    {
      "id": "mittwald_token",
      "type": "promptString",
      "description": "Enter your mittwald API token",
      "password": true
    }
  ],
  "servers": {
    "mittwald": {
      "type": "http",
      "url": "https://mcp.mittwald.de/mcp",
      "headers": {
        "Authorization": "Bearer ${input:mittwald_token}"
      }
    }
  }
}
```

To create a token, go to **mStudio → User Settings → API Tokens**, generate a token, and store it securely.

## Step 2: Start the MCP Server

Open `.vscode/mcp.json` in VS Code. You should see a **Start** CodeLens above the server definition. Click **Start** to activate the server.

If you do not see CodeLens buttons, restart VS Code and confirm your version is 1.99+.

## Step 3: Authenticate

### 3.1 OAuth

Click the **Auth** CodeLens above the server definition:

1. A browser window opens for mittwald authorization
2. Review the requested scopes
3. Click **Authorize**

Enterprise users may need their admin to enable the **MCP servers in Copilot** policy before Auth appears.

### 3.2 API Key

If you chose the API key configuration, VS Code prompts for the token when the server starts. Paste the token when prompted.

:::warning

Never hardcode tokens in the config file. Input variables keep secrets out of source control.

:::
## Step 4: Verify Your Connection

Open Copilot Chat and run a simple test:

```
Use mittwald MCP to list my projects
```

You should see a list of projects returned from mittwald MCP.

✅ **Success!** mittwald MCP is now connected to GitHub Copilot.

## Common Tasks with mittwald MCP

Once authenticated, you can use Copilot Chat prompts like these:

### List Your Projects

```
Use mittwald MCP to show all my projects
```

### Get App Information

```
Show apps in my project [project-id]
```

### Database Details

```
Get database connection info for [db-id]
```

### Backup Status

```
Check backup schedules for project [project-id]
```

### Support Tickets

```
List open support conversations for my account
```

## Troubleshooting

### Error: "No CodeLens Buttons Appearing"

**Symptom**: No **Start** or **Auth** buttons appear above the server configuration.

**Cause**: VS Code does not recognize MCP configuration or CodeLens is disabled.

**Fix**:

1. Confirm the file path is `.vscode/mcp.json`
2. Restart VS Code
3. Ensure you are on VS Code 1.99+ (`code --version`)

### Error: "Auth Button Not Working"

**Symptom**: Clicking **Auth** does nothing or fails immediately.

**Cause**: VS Code is too old for MCP OAuth or policy is disabled.

**Fix**:

1. Update VS Code to 1.99 or later
2. If you are on Copilot Enterprise, ask your admin to enable **MCP servers in Copilot**

### Error: "Configuration Error"

**Symptom**: VS Code shows JSON parse errors or MCP server fails to load.

**Cause**: Invalid JSON in `.vscode/mcp.json`.

**Fix**:

1. Validate JSON syntax
2. Remove trailing commas
3. Compare with the example in this guide

### Error: "Server Connection Failed"

**Symptom**: MCP server fails to start or times out.

**Cause**: Network issues, firewall rules, or incorrect URL.

**Fix**:

1. Confirm the URL is `https://mcp.mittwald.de/mcp`
2. Check outbound network access
3. Try from another network

### Error: "Token Not Accepted"

**Symptom**: Requests fail with 401 Unauthorized.

**Cause**: Token is invalid, expired, or revoked.

**Fix**:

1. Create a new API token in mStudio
2. Restart the MCP server and enter the new token

### Error: "MCP Policy Disabled"

**Symptom**: MCP servers are blocked in Copilot Enterprise.

**Cause**: Organization policy disables MCP servers.

**Fix**:

1. Ask your admin to enable **MCP servers in Copilot**
2. Restart VS Code after the policy change

## FAQ

### Q: What VS Code version do I need?

**A**: Use VS Code 1.99 or later for OAuth support.

### Q: Does this work with VS Code Insiders?

**A**: Yes, as long as your Insiders build is 1.99+.

### Q: Is my token stored securely?

**A**: OAuth tokens are stored by VS Code. API tokens are entered via input variables and are not saved in the config file.

### Q: How do I update the MCP configuration?

**A**: Edit `.vscode/mcp.json` and restart the MCP server using the **Start** CodeLens.

### Q: Can I use this with GitHub Copilot Enterprise?

**A**: Yes, but your organization must enable the **MCP servers in Copilot** policy.

### Q: How do I revoke MCP access?

**A**: Remove the server from `.vscode/mcp.json` and revoke tokens in mStudio.

### Q: Can I share my mcp.json with my team?

**A**: Yes, but do not store API tokens inside the file. Use OAuth or input variables.

## Next Steps

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](./)**: Set up Claude Code, Cursor, or Codex CLI

## Official Documentation

This guide is based on official GitHub Copilot capabilities:

- [Setting up GitHub MCP Server](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/set-up-the-github-mcp-server) - MCP setup for GitHub Copilot
- [Enhanced MCP OAuth Support](https://github.blog/changelog/2025-11-18-enhanced-mcp-oauth-support-for-github-copilot-in-jetbrains-eclipse-and-xcode/) - OAuth 2.1 with PKCE (GA Sept 2025)
- [Extending Copilot Chat with MCP](https://docs.github.com/copilot/customizing-copilot/using-model-context-protocol/extending-copilot-chat-with-mcp) - MCP integration guide

## Still Need Help?

- Check [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- Review [VS Code MCP documentation](https://code.visualstudio.com/docs)
- Contact [mittwald support](mailto:support@mittwald.de)
