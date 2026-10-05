---
sidebar_label: SearXNG
description: Learn how to set up and run SearXNG in a containerized environment and connect it to Open WebUI for web search
---

# Running SearXNG

:::note Draft

This guide is under development. Deployment and integration instructions will be added after verification.

:::

## Introduction {#introduction}

Use searxng as search delegate - either for privacy-focussed human search or even agentic search capabilities.

## Prerequisites {#prerequisites}

- mStudio account
- mittwald API token
- CLI installed

## How do I start the container? {#start-container}

NOT ONE container, but a composite create via docker compose file. Deployed to mittwald via mittwald CLI, then adjust configuration to allow JSON search responses for agentic usage.

### Using the `mw stack deploy` command {#stack-deploy}

#### Configuration

## Connecting to Open WebUI {#openwebui}

First activate search service. Then assign search capabilities to models to be used.

- Admin Panel -> Settings -> Capabilites

### Operation notes {#operation-notes}

Creating separate workspaces in OpenWebUI is strongly recommended as it allows separating different user environments, knowledge bases and tools.

### Troubleshooting {#troubleshooting}

**Web search fails in OpenWebUI**

Check Responses in chat directly in OpenWebUI. If `Unauthorized` errors occur, double-check `searXNG` configuration to allow `json` responses.

## Further resources {#further-resources}