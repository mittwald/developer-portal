---
title: Getting Started with ChatGPT
description: Install the official mittwald app in ChatGPT with step-by-step instructions
---

# Getting Started with ChatGPT

mittwald publishes an official app in the ChatGPT app directory, backed by mittwald MCP. This guide shows you how to install the mittwald app and connect it to your mittwald account using OAuth authentication.

## Prerequisites {#prerequisites}

- **ChatGPT Plus, Team, Enterprise, or Education plan**
- **A mittwald account** (to authenticate)
- **2 minutes** to complete setup

## Step 1: Install the mittwald App {#step-1-install-the-app}

1. Open the [mittwald app listing](https://chatgpt.com/plugins/plugin_asdk_app_6a68b368b8588191afee9a7e2b327d63) in ChatGPT, or click **Plugins** in the ChatGPT menu bar (or go to **Settings → Plugins → Browse Plugins**) and search for "mittwald"
2. Click **Install plugin**

Because this is an official, published app, ChatGPT already knows its endpoint and available tools — there is no server URL to enter.

## Step 2: Authenticate {#step-2-authenticate}

When you first use the mittwald app in a chat:

1. ChatGPT prompts you to authorize the connection
2. A browser window opens for mittwald authorization
3. Sign in with your mittwald account
4. Review the requested permissions
5. Click **Authorize**

## Step 3: Verify Your Connection {#step-3-verify-your-connection}

1. Start a new chat in ChatGPT
2. Click **+** next to the message input
3. Select **More** and choose the **mittwald** app
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

### Error: "App Not Available" {#error-app-not-available}

**Symptom**: The mittwald app does not appear under **Plugins** or in search results.

**Cause**: Your ChatGPT plan does not support apps, or the app listing has not loaded yet.

**Fix**:

1. Upgrade to ChatGPT Plus, Team, Enterprise, or Education
2. Reload the [mittwald app listing](https://chatgpt.com/plugins/plugin_asdk_app_6a68b368b8588191afee9a7e2b327d63) directly

### Error: "Authentication Failed" {#error-authentication-failed}

**Symptom**: OAuth flow fails or times out.

**Cause**: Browser popup blocked or session expired.

**Fix**:

1. Allow popups for chat.openai.com in your browser
2. Clear browser cookies for mittwald.de
3. Try again from a different browser

### Error: "Tool Not Found" {#error-tool-not-found}

**Symptom**: ChatGPT cannot find mittwald tools after installing the app.

**Cause**: The installed app metadata has not refreshed yet.

**Fix**:

1. Go to **Settings → Plugins**
2. Find the mittwald app
3. Click **Refresh** to update the tool list, or remove and reinstall the app

### Error: "Permission Denied" {#error-permission-denied}

**Symptom**: Operations fail with authorization errors.

**Cause**: OAuth tokens expired or permissions changed.

**Fix**:

1. Uninstall the mittwald app in Settings
2. Install it again and re-authenticate

## FAQ {#faq}

### Q: Which ChatGPT plans support the mittwald app? {#faq-supported-plans}

**A**: ChatGPT Plus, Team, Enterprise, and Education plans support installing apps.

### Q: Does this work on mobile? {#faq-mobile}

**A**: Yes. Installed apps work on ChatGPT web and mobile apps.

### Q: Is my authentication secure? {#faq-authentication-security}

**A**: Yes. ChatGPT uses OAuth for app authentication. Tokens are stored securely by OpenAI.

### Q: Can I use multiple apps at once? {#faq-multiple-connectors}

**A**: Yes. You can install multiple apps and use them in the same conversation.

### Q: How do I remove the app? {#faq-remove-connector}

**A**: Go to **Settings → Plugins**, find the mittwald app, and uninstall it.

### Q: Why does ChatGPT ask for confirmation? {#faq-confirmation}

**A**: Write operations require approval to prevent accidental changes. You can choose to remember approvals for specific action types.

## Next Steps {#next-steps}

- **[Tutorials](../../tutorials/)**: See real-world examples
- **[Other Tools](./)**: Set up Claude, GitHub Copilot, or Cursor

## Official Documentation {#official-documentation}

This guide is based on official OpenAI documentation:

- [Connect ChatGPT](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt/) - ChatGPT app and connector setup
