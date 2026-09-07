---
title: Getting Connected with Hermes Agent
description: Connect Hermes Agent to mittwald MCP using OAuth or API tokens
---

# Getting Connected with Hermes Agent

Hermes Agent manages MCP servers with `hermes mcp` and stores them in
`~/.hermes/config.yaml` (on native Windows: `%LOCALAPPDATA%\hermes\config.yaml`).
This guide covers both authentication paths.

If you also want Hermes to run against mittwald AI Hosting models, see the
[Hermes Agent CLI guide](/docs/v2/agentic-integration/cli-agents/hermes-agent).
The two are independent: MCP gives the agent mittwald infrastructure tools, the
provider config decides which model drives it.

## Prerequisites {#prerequisites}

- Hermes Agent installed (`hermes --version`)
- A mittwald account (for OAuth)
- Browser access for OAuth login
- Optional: mittwald API token for headless usage

## Confirm Your CLI Supports MCP {#confirm-cli-supports-mcp}

```shellsession
user@local $ hermes mcp --help
```

You should see the subcommands `add`, `remove`, `list`, `test`, `configure`,
`login`, `reauth` and `catalog`.

## Option A: OAuth (Recommended for interactive use) {#option-a-oauth}

### 1. Add mittwald MCP server {#add-mcp-server}

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth oauth
```

`--auth oauth` skips the interactive credential prompt and starts the browser
flow directly. Hermes writes the server to `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  mittwald:
    url: https://mcp.mittwald.de/mcp
    auth: oauth
    enabled: true
```

### 2. Complete browser login {#complete-browser-login}

- Open the authorization URL if your browser does not open automatically
- Sign in with your mittwald account
- Approve the requested scopes

### 3. Verify the connection {#verify-server-registration}

```shellsession
user@local $ hermes mcp list
user@local $ hermes mcp test mittwald
```

`hermes mcp test` connects, discovers tools and prints how many it found. A
server that appears in `list` but discovers no tools is registered, not working.

### 4. Re-authenticate later (if needed) {#re-authenticate-later}

```shellsession
user@local $ hermes mcp login mittwald
```

To refresh every OAuth server in your config, one at a time:

```shellsession
user@local $ hermes mcp reauth --all
```

## Option B: API Token (CI/CD and headless environments) {#option-b-api-token}

### 1. Create token in mStudio {#create-token-in-mstudio}

- mStudio -> User Settings -> API Tokens
- Create a token with least-privilege scopes
- Copy the token once

### 2. Export token locally {#export-token-locally}

```shellsession
user@local $ export MITTWALD_API_TOKEN="<your_token>"
```

### 3. Add server with header auth {#add-server-with-token}

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth header
```

Hermes asks for the token and stores it as an `Authorization` header. To keep
the token out of the config file, edit the entry so it reads the environment
variable instead:

```yaml
mcp_servers:
  mittwald:
    url: https://mcp.mittwald.de/mcp
    headers:
      Authorization: Bearer ${MITTWALD_API_TOKEN}
    enabled: true
```

Hermes expands `${VAR}` from the environment at connection time, so the file
holds the variable name and never the token.

## Manage the Connection {#manage-the-connection}

### List configured servers {#list-configured-servers}

```shellsession
user@local $ hermes mcp list
```

### Choose which tools the agent sees {#choose-which-tools}

```shellsession
user@local $ hermes mcp configure mittwald
```

This opens the tool selection for one server. Use it to hide tools you do not
want in the agent's prompt.

### Disable without removing {#disable-without-removing}

Set `enabled: false` on the entry in `~/.hermes/config.yaml`. The config stays,
the tools disappear from the agent.

### Remove server config {#remove-server-config}

```shellsession
user@local $ hermes mcp remove mittwald
```

## Troubleshooting {#troubleshooting}

### The prompt asks for an API key when you wanted OAuth {#prompt-asks-for-api-key}

Running `hermes mcp add` with only `--url` starts an interactive dialog that
asks `Does this server require authentication?` and then offers a bearer token
field. Pass `--auth oauth` on the command line to go straight to the browser
flow.

### `Failed to connect: Server returned an error response` {#failed-to-connect}

The mittwald MCP endpoint rejects unauthenticated requests with `401` and a
`WWW-Authenticate` header pointing at `https://auth.mcp.mittwald.de/authorize`.
If you see this during `add`, the credentials were missing or wrong. Hermes then
offers `Save config anyway (you can test later)?` — answer `n`, and add the
server again with `--auth oauth` or `--auth header`.

### Connection times out during tool discovery {#connection-times-out}

Raise the discovery timeout:

```shellsession
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth oauth --connect-timeout 30
```

### Token-based auth returns `401` {#token-based-auth-returns-401}

- Verify `MITTWALD_API_TOKEN` is set in the shell that starts Hermes
- Rotate the token in mStudio if needed
- Remove and re-add the server configuration

```shellsession
user@local $ hermes mcp remove mittwald
user@local $ hermes mcp add mittwald --url https://mcp.mittwald.de/mcp --auth header
```

## Security Notes {#security-notes}

- Prefer OAuth for interactive local usage (refresh and revocation support)
- Prefer API tokens for CI/CD and non-interactive jobs
- Keep tokens in environment variables, not in `~/.hermes/config.yaml`
- Never commit tokens in repository files

## Next Steps {#next-steps}

- [Hermes Agent with mittwald AI Hosting](/docs/v2/agentic-integration/cli-agents/hermes-agent) to run the agent on mittwald models
- [Tutorials](../../tutorials/) for human + agent workflows
- [How-To Playbooks](../../how-to/) for task-focused operations
- [Auth & Token Lifecycle](../../auth-token-lifecycle/) for consent/refresh/re-auth behavior
