---
title: Installing the mittwald CLI
sidebar_label: Installation
sidebar_position: 20
description: How to install the mittwald command-line interface (CLI)
---

## On macOS

On macOS, the recommended way of installing the CLI is using [Homebrew](https://brew.sh):

```
$ brew tap mittwald/cli
$ brew install mw
$ mw --help
```

You can also use Homebrew to upgrade the CLI:

```
$ brew upgrade mw
```

## On Windows

Retrieve the latest release package (`*.exe` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer. After running the installer, you should be able to use the `mw` command on either the CMD prompt or PowerShell.

## On Linux

Currently, we do not provide a package for Linux distributions. However, you can use the NPM installation method, or run the CLI using Docker.

## On any operating system

### Using NPM

With a local Node.js installation, you can install the mittwald CLI using NPM:

```
$ npm install -g @mittwald/cli
$ mw --help
```

:::important

Please note that this method of installation will use the mw CLI with whatever version of Node.js you have installed on your local system. We cannot guarantee full compatibility with all Node.js versions, as the CLI is currently only tested against Node.js versions 18 and 20.

If you encounter any issues with a Node.js version greater than 20, please [file a bug report](https://github.com/mittwald/cli/issues) so we can fix it for future releases.

:::

### Using Docker

If you have [Docker](https://www.docker.com/) installed on your system, you can use the `mittwald/cli` Docker image instead of installing the CLI on your system. In case of the Docker container, authentication works a bit differently: Make sure that there is an environment variable `MITTWALD_API_TOKEN` present on your system; you can then pass that environment variable into your container:

```
$ export MITTWALD_API_TOKEN=xxx
$ docker run \
    --rm \
    -it \
    -e MITTWALD_API_TOKEN \
    mittwald/cli --help
```
