---
title: AI-assisted development
sidebar_label: AI-assisted development
---

# AI-assisted development

You can use mittwald's [AI models](/docs/v2/platform/aihosting) to assist you in your development process. The models are GDPR-compliant and are hosted in Germany without storing user data or using it for training.

To use the models, you need to set up a proxy service on your local machine to handle authentication and forward requests to the mittwald API.

## Setup

Clone the [LLM proxy](https://github.com/mittwald/llm-proxy) and configure it with your mittwald API credentials:

```bash
git clone https://github.com/mittwald/llm-proxy.git
cd llm-proxy
```

Get your API key from [mittwald mStudio](https://studio.mittwald.de) and configure the environment:

```bash
cp .env.example .env
# Edit .env and add your API key
```

Start the proxy service:

```bash
docker compose up
```

The proxy will run at `http://localhost:4000/v1` and provides an OpenAI-compatible API interface.

## Available models

The service offers several AI models optimized for different development tasks. For a complete list of available models and their specifications, see the [AI models documentation](/docs/v2/platform/aihosting/models).

## IDE integration

For detailed instructions on integrating the proxy with your IDE, refer to the [IDE integration section](https://github.com/mittwald/llm-proxy#ide-setup) in the project's README.

## Usage limits

During the beta phase, each API key is limited to 300 requests per minute. The service is currently free while in beta, with full release expected in 2025.
