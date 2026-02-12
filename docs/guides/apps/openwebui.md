---
sidebar_label: Open WebUI
description: Learn how to set up and run Open WebUI in a containerized environment
---

# Running Open WebUI

## Introduction

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted web interface designed to operate entirely offline. It supports various LLM runners, including Ollama and OpenAI-compatible APIs.

> Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate entirely offline. It supports various LLM runners, including Ollama and OpenAI-compatible APIs.
> – [Open WebUI GitHub](https://github.com/open-webui/open-webui)

Open WebUI can be used as a ChatGPT-like interface within mittwald's container hosting. It can be automatically installed and configured when an API key is created for [mittwald AI Hosting](/docs/v2/platform/aihosting/) if your hosting product supports containers.

## Prerequisites

- Access to a mittwald mStudio project
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- (Optional) A [mittwald AI Hosting API key](/docs/v2/platform/aihosting/access-and-usage/access) for connecting to hosted AI models

## How do I start the container?

We use the `ghcr.io/open-webui/open-webui:main` image from [GitHub Container Registry](https://github.com/open-webui/open-webui/pkgs/container/open-webui) for the container.

### Using the mStudio UI

In mStudio, go to your project and select **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description – this is a free text field used to identify the container. For example, enter **"Open WebUI"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `ghcr.io/open-webui/open-webui:main` and confirm with **"Next"**.

#### Entrypoint and Command

- **Entrypoint:** No changes required
- **Command:** No changes required

#### Volumes

For persistent data storage, configure the following volume:

- `/app/backend/data` - This volume stores all Open WebUI data including conversations, configurations, and uploaded documents.

:::note
You can add new volumes via the mStudio UI. The path above should be set as a mount point.
:::

#### Environment Variables

Open WebUI can be configured with various environment variables. For basic operation, no environment variables are strictly required, but you may want to configure some settings:

```
# Optional: Custom port (default is 8080)
PORT=8080

# Optional: WebUI name
WEBUI_NAME=mittwald AI Chat

# Optional: Disable signup for new users
ENABLE_SIGNUP=false
```

Once you've entered all the environment variables, click **"Next"**. In the final dialog, you'll be asked for the **port** – enter `8080`. Click **"Create container"** to create and start the container.

### Alternative: Using the `mw container run` command

You can also use the `mw container run` command to directly create and start an Open WebUI container from the command line. This approach is similar to using the Docker CLI and allows you to specify all container parameters in a single command.

```bash
mw container run \
  --name openwebui \
  --description "Open WebUI - AI Chat Interface" \
  --publish 8080:8080 \
  --volume "openwebui-data:/app/backend/data" \
  --create-volumes \
  ghcr.io/open-webui/open-webui:main
```

After creating the container, you'll still need to assign a domain to it.

### Alternative: Using the `mw stack deploy` command

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. This approach allows you to define your container configuration in a YAML file and deploy it with a single command.

First, create a `docker-compose.yml` file with the following content:

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "8080:8080"
    volumes:
      - "openwebui-data:/app/backend/data"
    environment:
      PORT: "8080"
      WEBUI_NAME: "mittwald AI Chat"
volumes:
  openwebui-data: {}
```

Then, deploy the container using the `mw stack deploy` command:

```bash
mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack.

## Connecting to mittwald AI Hosting

If you have a [mittwald AI Hosting](/docs/v2/platform/aihosting/) API key, you can connect Open WebUI to use the hosted AI models.

After Open WebUI is running and you've created an account, follow these steps:

1. Open the Open WebUI admin panel by clicking on your profile icon
2. Navigate to **"Settings"** and choose **"Connections"**
3. In the **"OpenAI API"** section, add a new connection
4. Enter the base URL:
   ```
   https://llm.aihosting.mittwald.de/v1
   ```
5. Enter your API key from mittwald AI Hosting
6. Save the configuration

Open WebUI will automatically detect all available models from mittwald AI Hosting. You can now select these models in your conversations.

### Optimizing Model Parameters

For optimal results, you may need to adjust the default parameters for each model. You can modify these parameters in the **"Models"** section:

1. Select the model you want to configure
2. Under **"Advanced Params"**, apply the recommended parameters documented in the [models section](/docs/v2/platform/aihosting/models/), such as `top_p`, `top_k`, and `temperature`

:::note
We recommend hiding embedding models in the model selection, as they are automatically detected by Open WebUI but cannot be used for chat conversations.
:::

## Using Retrieval-Augmented Generation (RAG)

Open WebUI offers the ability to store knowledge in the form of documents, which can be accessed as needed using retrieval-augmented generation (RAG).

### Uploading Documents

1. In the left menu bar, navigate to **"Workspace"**
2. Select the **"Knowledge"** tab
3. Upload documents that you want to make available
4. In your chats, you can access these documents using a hashtag reference

### Configuring an Embedding Model

To enable more efficient document processing, you can configure an embedding model:

1. In the Admin Panel under **"Settings"**, go to the **"Documents"** menu item
2. In the **"Embedding"** section, select **"OpenAI"** in the dropdown menu as the embedding model engine
3. Enter the endpoint: `https://llm.aihosting.mittwald.de/v1`
4. Enter your mittwald AI Hosting API key
5. Select one of the available [embedding models](/docs/v2/platform/aihosting/models/) (such as Qwen3-Embedding-8B)
6. In the **"Retrieval"** section, adjust **"Top K"** and **"RAG Template"** for optimal results

## Configuring Speech-to-Text

Whisper-Large-V3-Turbo can be configured in Open WebUI for speech-to-text (STT) functionality. This model supports over 99 languages and is optimized for audio transcription.

### Admin Panel Configuration

In the Admin Panel under **"Settings"** > **"Audio"**, configure the following:

- **Engine**: Select "OpenAI"
- **API Base URL**: `https://llm.aihosting.mittwald.de/v1`
- **API Key**: Enter your mittwald AI Hosting API key
- **STT Model**: Enter the model name `whisper-large-v3-turbo`

### Hiding Whisper from Chat Models

Whisper will appear in the model list after connection, but it should be hidden from chat model selection since it's designed for audio transcription, not conversational AI:

1. Navigate to **"Workspace"** > **"Models"**
2. Select **Whisper-Large-V3-Turbo**
3. Choose **"Hide"** to prevent it from appearing as a chat option

### User Settings

You can further specify how Open WebUI interacts with the Whisper model in the user settings (not Administrator panel) under **"Audio"**:

- **Language**: Explicitly set the language code (e.g., "en" for English, "de" for German)
- **Directly Send Speech**: Enable to send transcriptions directly without confirmation

### Recommended Parameters

For optimal transcription quality, configure these parameters in the admin panel or chat settings:

- **Additional Parameters**: Set `temperature=1.0`, `top_p=1.0`

### Testing Speech-to-Text

To test the speech-to-text functionality:

1. Click the microphone icon in a chat interface
2. Speak in the configured language
3. The transcription will use the `/v1/audio/transcriptions` endpoint with support for MP3, OGG, WAV, and FLAC formats (maximum 25 MB file size)

:::note
Always set the language parameter explicitly for best accuracy, especially for non-German audio inputs.
:::

## Operation

To make your Open WebUI instance reachable from the public internet, it needs to be connected to a domain. After that, you can access Open WebUI via `https://<your-domain>/`.

As part of the project backup, the data from your volumes is secured and can be restored if needed.

## Further Resources

- [Open WebUI GitHub Repository](https://github.com/open-webui/open-webui)
- [Open WebUI Documentation](https://docs.openwebui.com/)
- [mittwald AI Hosting Documentation](/docs/v2/platform/aihosting/)
- [Container Workloads Documentation](/docs/v2/platform/workloads/containers)
