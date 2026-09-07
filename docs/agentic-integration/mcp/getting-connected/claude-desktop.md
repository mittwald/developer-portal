---
title: Getting Started with Claude
description: Connect the official mittwald connector in Claude Desktop and Claude.ai with step-by-step instructions
---

# Getting Started with Claude

mittwald publishes an official connector in the Claude Connectors Directory, backed by mittwald MCP. This guide shows you how to connect it to Claude Desktop or Claude.ai using OAuth authentication.

## Prerequisites {#prerequisites}

- **Claude Pro, Max, Team, or Enterprise plan** (required for connectors)
- **A mittwald mStudio account** (to authenticate)
- **2 minutes** to complete setup

## Step 1: Open the mittwald Connector {#step-1-open-the-connector}

1. Open the [mittwald connector](https://claude.ai/directory/mittwald) in the Claude Connectors Directory, or in Claude Desktop / Claude.ai go to **Settings → Connectors → Browse connectors** and search for "mittwald"
2. Click **Connect**

Because this is an official, published connector, Claude already knows its endpoint and available tools — there is no server URL to enter.

## Step 2: Authenticate {#step-2-authenticate}

When you connect the mittwald connector, Claude prompts you to authenticate:

1. A browser window opens for mittwald authorization
2. Sign in with your mittwald account
3. Review the requested permissions
4. Click **Authorize**

Claude securely stores your OAuth tokens and refreshes them automatically.

## Step 3: Verify Your Connection {#step-3-verify-your-connection}

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

**Symptom**: The Connectors option does not appear in Settings, or the mittwald connector is missing from the directory.

**Cause**: Your Claude plan does not include connectors.

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

**Symptom**: Claude cannot reach the mittwald MCP server.

**Cause**: Network issues or firewall rules.

**Fix**:

1. Check outbound network access
2. Try from another network
3. Try removing and reconnecting the mittwald connector

## Team and Enterprise {#team-and-enterprise}

For Team and Enterprise plans:

- **Owners** can enable the mittwald connector from the directory for all workspace members
- Members can use shared connectors without individual setup
- Admins can manage connector permissions in workspace settings

## FAQ {#faq}

### Q: Which Claude plans support the mittwald connector? {#faq-supported-plans}

**A**: Claude Pro, Max, Team, and Enterprise plans support connectors.

### Q: Is my authentication secure? {#faq-authentication-security}

**A**: Yes. Claude uses OAuth 2.1 with PKCE. Tokens are stored securely and refreshed automatically.

### Q: Can I use multiple connectors? {#faq-multiple-connectors}

**A**: Yes. You can connect multiple directory connectors and use them in the same conversation.

### Q: How do I remove the connector? {#faq-remove-connector}

**A**: Go to **Settings → Connectors**, find the mittwald connector, and click **Remove**.

### Q: Does this work with Claude Desktop offline? {#faq-offline}

**A**: No. Remote MCP servers require an internet connection.

## Next Steps {#next-steps}

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](../)**: Set up GitHub Copilot, Cursor, or Claude Code CLI

## Official Documentation {#official-documentation}

This guide is based on official Anthropic documentation:

- [Get started with custom connectors using remote MCP](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp) - Claude connector setup
