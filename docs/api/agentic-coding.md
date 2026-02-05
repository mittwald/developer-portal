---
title: Usage in coding agents
sidebar_position: 4
description: |
  Learn how to effectively use the mStudio v2 API in coding agents like GitHub Copilot or Claude Code. This page provides guidance on how to prompt these agents for code generation and how to structure your code for optimal results.
---

If you are using a coding agent like GitHub Copilot or Claude Code to generate code that interacts with the mStudio v2 API, you can use the Context7 MCP server to provide the agent with access to the API specification and documentation. This allows the agent to generate code that is accurate and up-to-date with the latest API changes.

## Available libraries on Context7 {#context7-libraries}

- [OpenAPI specification for the mStudio v2 API](https://context7.com/openapi/api_mittwald_de_v2_openapi_json)
- [mittwald Developer documentation](https://context7.com/mittwald/developer-portal) (this site)
- [mittwald Flow design system](https://context7.com/websites/mittwald_github_io_flow)
- more to follow...

## Using Context7 in coding agents {#context7-usage}

Refer to the [official documentation of Context7](https://github.com/upstash/context7#installation) to learn how to use the Context7 MCP server in your coding agent.

For example, in Claude Code you might use the following command to enable the MCP server:

```shellsession
claude mcp add --header "CONTEXT7_API_KEY: YOUR_API_KEY" --transport http context7 https://mcp.context7.com/mcp
```

To force the agent to use the mStudio v2 API specification for code generation, you can include the following instruction in your prompt:

```
Always use the `/openapi/api_mittwald_de_v2_openapi_json` library from Context7 for any code generation related to the mStudio v2 API. This library contains the latest OpenAPI specification for the API, and ensures that your generated code is accurate and up-to-date with the latest API changes.
```
