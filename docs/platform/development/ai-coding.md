---
title: AI-assisted development
sidebar_label: AI-assisted development
---

# AI-assisted development

You can use mittwald's [AI models](/docs/v2/platform/aihosting) to assist you in your development process. The models are GDPR-compliant and are hosted in Germany without storing user data or using it for training.

## Available models

The service offers several AI models optimized for different development tasks. For a complete list of available models and their specifications, see the [AI models documentation](/docs/v2/platform/aihosting/models).

## IDE integration

### Overview

| IDE                                      | Integrations                                         |
| ---------------------------------------- | ---------------------------------------------------- |
| Jetbrains IDEs (IntelliJ, PHPStorm, ...) | [Continue](#continue), [Jetbrains AI](#jetbrains-ai) |
| Visual Studio Code                       | [Continue](#continue)                                |

### Jetbrains AI (for Jetbrains IDEs, like IntelliJ, PHPStorm, WebStorm, ...) {#jetbrains-ai}

To use the models, you need to set up a proxy service on your local machine to handle authentication and forward requests to the mittwald API.

For detailed instructions on integrating the proxy with your IDE, refer to the [IDE integration section](https://github.com/mittwald/llm-proxy#ide-setup) in the project's README.

### Continue (for Visual Studio Code or Jetbrains IDEs) {#continue}

[Continue](https://www.continue.dev) works with both Jetbrains IDEs and Visual Studio Code.

Start by installing the Plugin for your IDE:

- [Jetbrains IDEs](https://plugins.jetbrains.com/plugin/22707-continue)
- [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=Continue.continue)

Models are usually configured in the `config.yaml` file (usually found in the `~/.continue/` directory in your home directory). You can configure the mittwald models (`Qwen3-Coder-30B-Instruct` works well for code generation) using the following configuration:

```yaml
name: mittwald
version: 1.0.0
schema: v1
models:
  - name: Qwen3-Coder-30B-Instruct
    provider: openai
    model: Qwen3-Coder-30B-Instruct
    apiBase: https://llm.aihosting.mittwald.de/v1
    apiKey: <INSERT-API-KEY>
    roles:
      - chat
      - edit
      - apply
    capabilities:
      - tool_use
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
```

## Usage limits

During the beta phase, each API key is limited to 300 requests per minute. The service is currently free while in beta, with full release expected in 2025.
