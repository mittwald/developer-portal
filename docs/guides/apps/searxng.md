---
sidebar_label: SearXNG
description: Learn how to deploy SearXNG on mittwald and add web search to AI Hosting-powered agents, using Open WebUI as an example
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Running SearXNG

:::note Draft

This guide is under development. The mStudio template workflow, CLI deployment configuration, and Open WebUI integration still need end-to-end verification before this guide is complete.

:::

## Introduction {#introduction}

SearXNG is a self-hosted metasearch engine that combines results from multiple search services. Besides providing a browser-based search interface, it can return results as JSON for use by agents and other applications.

This guide focuses on using SearXNG as a web-search service for agentic runtimes powered by [mittwald AI Hosting](/docs/v2/platform/aihosting/). It covers two deployment methods: a container template in mStudio and a Docker Compose stack deployed with the mittwald CLI. Both methods lead to the same search integration.

[Open WebUI](./openwebui.md) serves as the integration example. SearXNG is not exclusive to Open WebUI: other agentic runtimes can use its search API if they support SearXNG or can integrate an HTTP-based search tool.

## Use case: Web search for AI agents {#use-case}

The models provided by mittwald AI Hosting do **not include native web-search capabilities by default**. A model's training knowledge alone cannot reliably answer questions about current events, recent releases, or newly published documentation. The surrounding runtime needs to provide a search tool and pass retrieved information to the model.

Combining SearXNG with AI Hosting-powered agents separates retrieval from reasoning: SearXNG finds relevant web pages across multiple search services, while the model uses the retrieved context to formulate an answer. This enables workflows such as researching current technical documentation, comparing recent product information, and answering questions with links to sources.

In the Open WebUI example, Open WebUI coordinates search and supplies retrieved content to the model. Adding SearXNG does not change the model itself or guarantee that every answer is current or correct; source quality and successful retrieval still matter.

## Prerequisites {#prerequisites}

- Access to a mittwald mStudio project
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- A mittwald AI Hosting API key and a runtime connected to AI Hosting; for this example, use [Open WebUI](./openwebui.md)

For CLI deployment, you also need:

- The [mittwald CLI](/docs/v2/cli/) installed on your local machine
- A [mittwald API token](/docs/v2/api/intro#obtaining-an-api-token) with access to the target project

## How do I start the container? {#start-container}

The deployment described here is a multi-service stack, rather than a single `mw container run` command. Choose one of the following methods, then continue with the shared configuration and integration steps.

<Tabs groupId="access-mode">
	<TabItem value="mstudio" label="mStudio template">

### Using a container template in mStudio {#mstudio-template}

The planned template-based workflow creates the SearXNG stack from within your mStudio project.

:::note Pending verification

The SearXNG template's availability, exact selection steps, required inputs, and configuration defaults still need to be verified. A complete walkthrough will be added here once the template workflow has been tested.

:::

	</TabItem>
	<TabItem value="cli" label="CLI">

### Alternative: Using the `mw stack deploy` command {#stack-deploy}

The CLI workflow uses a Docker Compose file to describe the SearXNG stack and deploys it with [`mw stack deploy`](/docs/v2/cli/reference/stack).

Start with the official [SearXNG Compose instancing instructions](https://docs.searxng.org/admin/installation-docker.html#compose-instancing). Download the upstream Compose file and environment example into a new directory:

```shellsession
user@local $ mkdir -p searxng
user@local $ cd searxng
user@local $ curl -fsSLO https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
		-O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example
user@local $ cp .env.example .env
```

The upstream Compose file uses a relative bind mount for `core-config`. A local directory is not copied to mittwald when you deploy a stack, so replace that mount with a named stack volume. In `docker-compose.yml`, use this volume configuration for the `core` service and declare it in the top-level `volumes` section:

```yaml title="docker-compose.yml (volume excerpt)"
services:
	core:
		volumes:
			- searxng-config:/etc/searxng/
			- core-data:/var/cache/searxng/
	valkey:
		volumes:
			- valkey-data:/data/

volumes:
	searxng-config: {}
	core-data: {}
	valkey-data: {}
```

Keep the other services and settings from the downloaded upstream file. The named volumes preserve SearXNG's configuration, cache, and Valkey data across container restarts and stack updates.

Edit `.env` to set the values used by the Compose file. The upstream example comments these variables out, so remove the leading `#`:

```dotenv title=".env"
SEARXNG_VERSION=latest
SEARXNG_PORT=8080
```

`SEARXNG_HOST` can remain unset. For production, use a specific SearXNG release tag instead of `latest` so that an image update does not change the version unexpectedly.

Before deploying, check that the CLI context points to the intended project. If it does not, set the project ID and check the context again:

```shellsession
user@local $ mw context get
user@local $ mw context set --project-id <PROJECT_ID>
user@local $ mw context get
```

From the directory containing `docker-compose.yml`, deploy the stack:

```shellsession
user@local $ mw stack deploy
```

	</TabItem>
</Tabs>

## Configure SearXNG for agentic search {#search-configuration}

### Enable JSON responses {#json-responses}

Agentic runtimes need machine-readable search results. Enable `json` in the `search.formats` list of SearXNG's `settings.yml`, keeping any formats you also need for browser-based searches:

```yaml title="settings.yml (excerpt)"
search:
	formats:
		- html
		- json
```

Merge this excerpt into the existing configuration rather than replacing the entire file. Apply the updated configuration and restart SearXNG before testing the integration.

:::note Pending verification

The configuration volume, file-editing workflow, and restart steps for each deployment method still need to be documented and tested.

:::

### Make the search endpoint reachable {#search-endpoint}

The agentic runtime must be able to reach SearXNG's `/search` endpoint. If Open WebUI and SearXNG run in the same mittwald project, use the project-internal service address, for example `http://core:8080/search?q=<query>&format=json`. The Compose service name `core` is the internal hostname.

For a runtime outside the project, connect a domain to SearXNG in mStudio:

1. Open the project in mStudio and select **Domains**.
2. Add a subdomain, or select a domain that already belongs to the project.
3. Set the domain target to **Container**, then select the SearXNG `core` container and port `8080`.
4. Save the domain configuration.

Use the resulting HTTPS domain as the search endpoint. Publishing a container port does not by itself make it publicly accessible. See the [container networking documentation](/docs/v2/platform/workloads/containers/#ingress-http), and avoid exposing an unrestricted public search endpoint.

## Connecting to Open WebUI {#openwebui}

First, [connect Open WebUI to mittwald AI Hosting](./openwebui.md). Then configure web search in Open WebUI:

1. Open **Admin Panel**, then **Settings**, and locate the **Web Search** settings.
2. Enable web search and select **SearXNG** as the search engine.
3. Set the SearXNG query URL to your reachable search endpoint, using the pattern `https://your-search-domain.example/search?q=<query>&format=json`. Use the project-internal address instead when both services run in the same project.
4. Save the settings and enable the **Web Search** capability for the model you intend to use.
5. Start a chat, activate web search, and ask a question that requires current information. Check that search results are retrieved and that the answer includes relevant sources.

:::note Pending verification

Exact setting labels and model capability controls depend on the Open WebUI version. This walkthrough and the query URL syntax still need to be verified against the version used for this guide.

:::

## Operation notes {#operation-notes}

- Keep the SearXNG configuration on a persistent volume so that updates or redeployments do not discard your settings.
- Use separate Open WebUI workspaces where appropriate to organize model configurations, knowledge bases, and tools for different workflows. Workspace organization does not replace access controls.
- Web-search queries and page retrieval can disclose information to external services. Do not include confidential information in queries unless your data-handling requirements allow it.

## Troubleshooting {#troubleshooting}

### Web search fails in Open WebUI {#web-search-fails}

- Inspect the error shown in the chat and the logs of both services.
- Check that Open WebUI can reach the configured SearXNG endpoint from its backend, not just from your browser.
- Check that SearXNG allows `json` responses and that the query URL requests `format=json`. A disabled response format can result in a forbidden response.
- For an **Unauthorized** response, check any authentication or access controls in front of SearXNG. Enabling JSON responses does not resolve an authentication failure.

### The model does not use web search {#model-search-disabled}

- Check that web search is enabled in the admin settings, available for the selected model, and activated for the chat.
- Confirm that the model connection to mittwald AI Hosting works independently of web search.

## Further resources {#further-resources}

- [SearXNG documentation](https://docs.searxng.org/)
- [SearXNG search API](https://docs.searxng.org/dev/search_api.html)
- [SearXNG container image on Docker Hub](https://hub.docker.com/r/searxng/searxng)
- [Open WebUI SearXNG integration](https://docs.openwebui.com/tutorials/web-search/searxng/)
- [mittwald AI Hosting](/docs/v2/platform/aihosting/)
- [Container workloads](/docs/v2/platform/workloads/containers)