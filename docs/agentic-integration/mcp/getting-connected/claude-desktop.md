---
title: Getting Started with Claude Desktop
description: Set up OAuth and mittwald MCP in Claude Desktop with step-by-step instructions
---

# Getting Started with Claude Desktop

Claude Desktop and Claude.ai support remote MCP servers through custom connectors. This guide shows you how to connect mittwald MCP to Claude using OAuth authentication.

## Prerequisites {#prerequisites}

- **Claude Pro, Max, Team, or Enterprise plan** (required for custom connectors)
- **A mittwald mStudio account** (to authenticate)
- **5 minutes** to complete setup

:::note

Custom connectors with remote MCP servers are currently in beta. The feature is available in Claude Desktop and Claude.ai.

:::

## Step 1: Open Connector Settings {#step-1-open-connector-settings}

1. Open Claude Desktop or go to [claude.ai](https://claude.ai)
2. Click on your profile icon or navigate to **Settings**
3. Select **Connectors** from the menu

## Step 2: Add mittwald MCP {#step-2-add-mittwald-mcp}

1. Click **Add custom connector**
2. Enter the mittwald MCP server URL: `https://mcp.mittwald.de/mcp`
3. Click **Add** to save the connector

## Step 3: Authenticate {#step-3-authenticate}

When you first use the connector, Claude prompts you to authenticate:

1. A browser window opens for mittwald authorization
2. Sign in with your mittwald account
3. Review the requested permissions
4. Click **Authorize**

Claude securely stores your OAuth tokens and refreshes them automatically.

## Step 4: Verify Your Connection {#step-4-verify-your-connection}

Start a new conversation and test the connection:

```
Use mittwald MCP to list my projects
```

You should see a list of your mittwald projects.

✅ **Success!** mittwald MCP is now connected to Claude.

## Common Tasks with mittwald MCP {#common-tasks}

Once authenticated, you can use prompts like these:

### List Your Projects {#list-your-projects}

```
Use mittwald MCP to show all my projects
```

### Get App Information {#get-app-information}

```
Show apps in my project [project-id]
```

### Database Details {#database-details}

```
Get database connection info for [db-id]
```

### Backup Status {#backup-status}

```
Check backup schedules for project [project-id]
```

### Support Tickets {#support-tickets}

```
List open support conversations for my account
```

## Troubleshooting {#troubleshooting}

### Error: "Connector Not Available" {#error-connector-not-available}

**Symptom**: The Connectors option does not appear in Settings.

**Cause**: Your Claude plan does not include custom connectors.

**Fix**:

1. Upgrade to Claude Pro, Max, Team, or Enterprise
2. Wait for feature rollout if you recently upgraded

### Error: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth flow fails or times out.

**Cause**: Browser popup blocked or network issues.

**Fix**:

1. Allow popups for claude.ai in your browser settings
2. Check your network connection
3. Try again from a different browser

### Error: "Permission Denied" {#error-permission-denied}

**Symptom**: Connector fails with authorization errors.

**Cause**: OAuth session expired or permissions revoked.

**Fix**:

1. Remove the connector in Settings
2. Add it again and re-authenticate
3. Verify your mittwald account is active

### Error: "Server Connection Failed" {#error-server-connection-failed}

**Symptom**: Claude cannot reach the MCP server.

**Cause**: Network issues or firewall rules.

**Fix**:

1. Confirm the URL is `https://mcp.mittwald.de/mcp`
2. Check outbound network access
3. Try from another network

## Team and Enterprise {#team-and-enterprise}

For Team and Enterprise plans:

- **Owners** can add connectors that are available to all workspace members
- Members can use shared connectors without individual setup
- Admins can manage connector permissions in workspace settings

## FAQ {#faq}

### Q: Which Claude plans support MCP connectors? {#faq-supported-plans}

**A**: Claude Pro, Max, Team, and Enterprise plans support custom connectors.

### Q: Is my authentication secure? {#faq-authentication-security}

**A**: Yes. Claude uses OAuth 2.1 with PKCE. Tokens are stored securely and refreshed automatically.

### Q: Can I use multiple MCP connectors? {#faq-multiple-connectors}

**A**: Yes. You can add multiple custom connectors and use them in the same conversation.

### Q: How do I remove a connector? {#faq-remove-connector}

**A**: Go to **Settings → Connectors**, find the mittwald connector, and click **Remove**.

### Q: Does this work with Claude Desktop offline? {#faq-offline}

**A**: No. Remote MCP servers require an internet connection.

## Next Steps {#next-steps}

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](../)**: Set up GitHub Copilot, Cursor, or Claude Code CLI

## Official Documentation {#official-documentation}

This guide is based on official Anthropic documentation:

- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) - Claude MCP connector setup
