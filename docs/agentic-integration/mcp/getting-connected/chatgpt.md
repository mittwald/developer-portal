---
title: Getting Started with ChatGPT
description: Set up mittwald MCP as a connector in ChatGPT with step-by-step instructions
---

# Getting Started with ChatGPT

ChatGPT supports MCP servers through its connector feature. This guide shows you how to connect mittwald MCP to ChatGPT using OAuth authentication.

## Prerequisites {#prerequisites}

- **ChatGPT Plus, Team, Enterprise, or Education plan**
- **Developer Mode enabled** in ChatGPT settings
- **A mittwald account** (to authenticate)
- **5 minutes** to complete setup

## Step 1: Enable Developer Mode {#step-1-enable-developer-mode}

1. Open [ChatGPT](https://chat.openai.com)
2. Click your profile icon and select **Settings**
3. Go to **Apps & Connectors → Advanced settings**
4. Enable **Developer Mode**

## Step 2: Create a Connector {#step-2-create-connector}

1. In Settings, go to **Connectors**
2. Click **Create**
3. Fill in the connector details:

   | Field              | Value                                                                 |
   | ------------------ | --------------------------------------------------------------------- |
   | **Connector name** | mittwald                                                              |
   | **Description**    | Manage mittwald hosting: projects, apps, databases, domains, and more |
   | **Connector URL**  | `https://mcp.mittwald.de/mcp`                                         |

4. Click **Create** to save

ChatGPT validates the endpoint and displays the available tools from mittwald MCP.

## Step 3: Authenticate {#step-3-authenticate}

When you first use the connector in a chat:

1. ChatGPT prompts you to authorize the connection
2. A browser window opens for mittwald authorization
3. Sign in with your mittwald account
4. Review the requested permissions
5. Click **Authorize**

## Step 4: Verify Your Connection {#step-4-verify-your-connection}

1. Start a new chat in ChatGPT
2. Click **+** next to the message input
3. Select **More** and choose the **mittwald** connector
4. Test the connection:

```
List my mittwald projects
```

You should see a list of your mittwald projects.

✅ **Success!** mittwald MCP is now connected to ChatGPT.

## Tool Confirmation {#tool-confirmation}

ChatGPT asks for confirmation before executing write operations (creating resources, updating settings, etc.). You can:

- **Approve once**: Confirm the specific action
- **Remember approval**: Skip confirmation for similar actions in the future

Read-only operations like listing projects run without confirmation prompts.

## Common Tasks with mittwald MCP {#common-tasks}

Once authenticated, you can use prompts like these:

### List Your Projects {#list-your-projects}

```
Show all my mittwald projects
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

### Error: "Developer Mode Not Available" {#error-developer-mode-not-available}

**Symptom**: Developer Mode toggle does not appear in settings.

**Cause**: Your ChatGPT plan does not include this feature.

**Fix**:

1. Upgrade to ChatGPT Plus, Team, Enterprise, or Education
2. Wait for feature rollout if you recently upgraded

### Error: "Connector Validation Failed" {#error-connector-validation-failed}

**Symptom**: ChatGPT cannot validate the MCP endpoint.

**Cause**: Network issues or incorrect URL.

**Fix**:

1. Confirm the URL is exactly `https://mcp.mittwald.de/mcp`
2. Check your network connection
3. Try creating the connector again

### Error: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth flow fails or times out.

**Cause**: Browser popup blocked or session expired.

**Fix**:

1. Allow popups for chat.openai.com in your browser
2. Clear browser cookies for mittwald.de
3. Try again from a different browser

### Error: "Tool Not Found" {#error-tool-not-found}

**Symptom**: ChatGPT cannot find mittwald tools.

**Cause**: Connector metadata is stale.

**Fix**:

1. Go to **Settings → Connectors**
2. Find the mittwald connector
3. Click **Refresh** to update the tool list

### Error: "Permission Denied" {#error-permission-denied}

**Symptom**: Operations fail with authorization errors.

**Cause**: OAuth tokens expired or permissions changed.

**Fix**:

1. Delete the connector in Settings
2. Create it again and re-authenticate

## Refresh Tool Metadata {#refresh-tool-metadata}

If mittwald adds new MCP tools:

1. Go to **Settings → Connectors**
2. Find the mittwald connector
3. Click **Refresh**

ChatGPT fetches the updated tool list from the MCP server.

## FAQ {#faq}

### Q: Which ChatGPT plans support MCP connectors? {#faq-supported-plans}

**A**: ChatGPT Plus, Team, Enterprise, and Education plans support connectors with Developer Mode.

### Q: Does this work on mobile? {#faq-mobile}

**A**: Yes. Connectors work on ChatGPT web and mobile apps.

### Q: Is my authentication secure? {#faq-authentication-security}

**A**: Yes. ChatGPT uses OAuth for connector authentication. Tokens are stored securely by OpenAI.

### Q: Can I use multiple MCP connectors? {#faq-multiple-connectors}

**A**: Yes. You can add multiple connectors and use them in the same conversation.

### Q: How do I remove the connector? {#faq-remove-connector}

**A**: Go to **Settings → Connectors**, find the mittwald connector, and delete it.

### Q: Why does ChatGPT ask for confirmation? {#faq-confirmation}

**A**: Write operations require approval to prevent accidental changes. You can choose to remember approvals for specific action types.

## Next Steps {#next-steps}

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](./)**: Set up Claude Desktop, GitHub Copilot, or Cursor

## Official Documentation {#official-documentation}

This guide is based on official OpenAI documentation:

- [Connect ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt/) - ChatGPT MCP connector setup
