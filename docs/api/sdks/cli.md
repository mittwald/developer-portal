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

Retrieve the latest release package (`*.pkg` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer. Pay attention to the processor architecture, and load the `mw-*-arm64.pkg` file when your'e using an ARM Mac, and the `mw-*-amd64.pkg` file when using an Intel Mac.

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
$ docker run \
    --rm \
    -it \
    -v $HOME:/.config/mw:/app/.config/mw \
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

For non-interactive usage (for example in CI/CD pipelines), you can also pass the token via the `MW_API_TOKEN` environment variable:

```
$ export MW_API_TOKEN=********
$ mw login status
```
