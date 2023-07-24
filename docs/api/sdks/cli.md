---
title: Using the mittwald CLI
sidebar_label: CLI
description: An introduction on how to use the mittwald command-line interface (CLI)
---

## Installing

### Any OS, using NPM

With a local Node.js installation, you can install the mittwald CLI using NPM:

```
$ npm install -g @mittwald/cli
$ mw --help
```

### macOS, using the installer package

Retrieve the latest release package (`*.pkg` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer. Pay attention to the processor architecture, and load the `mw-*-arm64.pkg` file when you're using an ARM Mac, and the `mw-*-amd64.pkg` file when using an Intel Mac.

### macOS, using Homebrew

```
$ brew tap mittwald/cli
$ brew install mittwald-cli
$ mw --help
```

### Windows, using the installer package

Retrieve the latest release package (`*.exe` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer.

### Using Docker

```
$ export MITTWALD_API_TOKEN=xxx
$ docker run \
    --rm \
    -it \
    -e MITTWALD_API_TOKEN \
    mittwald/cli --help
```

## Authenticating

To use the CLI, you first need to authenticate your client using an API token. Have a look at the ["Obtaining an API token" section](../../intro#obtaining-an-api-token) of the introduction for details on how to obtain an API token.

:::note

Additional authentication mechanisms (like an OAuth2 flow in which you can use your browser to authenticate) are planned for the future.

:::

Having a token, you can authenticate like this:

```
$ mw login token
Enter your mStudio API token: ********
```

For non-interactive usage (for example in CI/CD pipelines), you can also pass the token via the `MITTWALD_API_TOKEN` environment variable:

```
$ export MITTWALD_API_TOKEN=********
$ mw login status
```

## General usage

### Project/Server/Organization contexts

Many commands of the CLI act in the context of a certain project, server or organization, and as such require a `--project-id`, `--server-id` or `--org-id` flag. You can either pass these flags to each command, or set them globally using the `mw context` command:

```bash
$ mw context set --project-id=...
$ mw project set --server-id=...
$ mw project set --org-id=...
```

Some commands that _create_ one of these resources also have a `--update-context` flag that will automatically set the context to the newly created resource:

```bash
$ mw project create --description="..." --update-context
```

### Non-interactive usage

If you intend to use `mw` non-interactively (for example in scripts, or CI/CD pipelines), many commands support a `--output|-o` flag that allows you to specify the output format. The default is `text`, which is a human-readable format, but you can also use `json` to get machine-readable output, which you can then easily process using tools like `jq`:

```bash
PROJECT_ID=$(mw project get -ojson | jq -r '.id')
```

Many mutating commands also print progress information about long-running operations. To suppress this output, you can use the `--quiet|-q` flag. In these cases, most commands will fall back to printing the ID of the created resource, which you can then use to retrieve the full resource information:

```bash
PROJECT_ID=$(mw project create --quiet --description="...")
```
