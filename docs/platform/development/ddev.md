---
title: Running PHP apps locally with DDEV
sidebar_label: DDEV
tags:
  - PHP
  - Deployment
description: DDEV is a local development environment for PHP applications. It provides an easy way to run PHP apps locally, facilitating development and testing.
---

## Prerequisites

### Required tools

Before getting started, make sure you have the necessary tools installed on your local machine:

- [DDEV](https://ddev.readthedocs.io/en/stable/): DDEV is a local development environment that simplifies setting up and managing PHP applications on your computer.
- [Docker](https://www.docker.com/): Docker is a platform for developing, shipping, and running applications inside containers.

It's also recommended to have the [mittwald CLI][cli] installed, although it's optional for this setup.

### Setting up SSH connectivity

To use the `ddev pull` and `ddev push` commands, you need to set up SSH connectivity between your local machine and your mittwald app. To do this, follow the ["SSH authentication" section][cli-ssh] of the mittwald CLI documentation.

Additionally, the DDEV integration with mittwald requires SSH connectivity to work correctly from within the DDEV web container. Typically, all your SSH keys are passed into the DDEV container using an SSH agent when you run `ddev auth ssh`. However, if you encounter issues like `too many authentication failures`, you may need to manually configure your SSH keys inside the DDEV container. Have a look at the ["common issues"](#common-issues) section for more information.

## Setting up a DDEV environment for a mittwald project

The following instructions guide you through setting up a DDEV environment for your mittwald app. You can choose between using the mittwald CLI or manually configuring your DDEV environment.

These instructions work both for setting up a new DDEV environment, and also for connecting a mittwald app to an existing DDEV environment.

It's also up to you if you want to initialize an empty project and pull code and database from an already installed app on the server, or if you want to setup a DDEV environment for an already existing codebase on your local machine.

### Using the mittwald CLI

If you already have the [mittwald CLI][cli] installed, you can set up a DDEV project for your mittwald app with a single command.

To initiate the setup, run the following command in your terminal, replacing `<app-id>` with your application ID (usually formatted as `a-xxxxx`), and `<project-name>` with a suitable name for your project:

```shell-session
$ # Create and enter project directory; alternatively, this may also be an
    existing project, for example cloned from a Git repository
$ mkdir project-dir && cd project-dir

$ # Initialize DDEV environment
$ mw ddev init <app-id> --project-name <project-name>

$ # Optional: Pull code and database from server
$ ddev pull mittwald
```

This command automatically configures a DDEV environment to closely match the environment of your existing mittwald app, including PHP and MySQL versions and the document root. Additionally, it installs and configures the [mittwald DDEV addon][ddev-addon], which integrates seamlessly with DDEV.

:::tip

You can update your DDEV environment to match any changes in your mittwald app's configuration at any time by running `mw ddev init` again.

:::

### Manual Setup

If you don't have the mittwald CLI installed or prefer a manual approach, you can still set up a DDEV environment for your PHP app. Here's how:

```shell-session
$ ddev config \
    --project-type <type> \
    --php-version <php-version> \
    --database mysql:<mysql-version>
$ ddev get mittwald/ddev
```

Replace `<type>`, `<php-version>`, and `<mysql-version>` with the appropriate values for your project. After running these commands, your DDEV environment will be configured, and the [mittwald DDEV addon][ddev-addon] will be installed.

During this setup, you'll be prompted for a [mittwald API token][apitoken] and your mittwald app's application ID (typically formatted as `a-xxxxx`).

## Features

### Pulling and pushing your code and database

DDEV simplifies the process of synchronizing code and databases between your local environment and your mittwald app.

To pull the code and database from your mittwald app to your local DDEV environment, use:

```shell-session
$ ddev pull mittwald
```

Conversely, to push your local code and database changes to your mittwald app, run the following command:

```shell-session
$ ddev push mittwald
```

:::warning

Be cautious when using `ddev push` as it overwrites your mittwald app's code and database with data from your local environment. This command is intended for development purposes and doesn't implement a production-ready deployment strategy.

:::

### Using the mittwald CLI

The [mittwald DDEV addon][ddev-addon] enables you to run the [mittwald CLI][cli] directly within your DDEV web container. This integration allows you to execute various mittwald CLI commands seamlessly.

To utilize the mittwald CLI inside your DDEV environment, use the following syntax:

```shell-session
$ ddev mw <command>
```

Replace `<command>` with any supported command from the mittwald CLI.

## Common issues

### SSH connections fail with `too many authentication failures`

This error may occur when you have a lot of SSH key pairs configured on your local machine. In this case, the remote server may reject the connection after too many failed authentication attempts.

To circumvent this issue, you can manually configure your SSH keys inside the DDEV web container. To do this, follow these steps:

0. Find the SSH key pair that you want to use for the connection, and make sure that the public key is added to your mStudio user profile. For the following steps, we'll assume that the SSH key is named `mstudio` and the private key is stored in `~/.ssh/mstudio`.

1. Add the required SSH key directly to the DDEV web container by symlinking it into `.ddev/homeadditions`:[^1]

   ```shell-session
   $ mkdir -p .ddev/homeadditions/.ssh
   $ ln -s ~/.ssh/mstudio ~/.ddev/homeadditions/.ssh/mstudio
   ```

2. Set the `MITTWALD_SSH_IDENTITY_FILE` environment variable to point to the symlinked SSH key:

   ```shell-session
   $ ddev config --web-environment-add MITTWALD_SSH_IDENTITY_FILE=~/.ssh/mstudio
   ```

[cli]: /docs/v2/api/sdks/cli
[cli-ssh]: /docs/v2/api/sdks/cli/#ssh
[apitoken]: /docs/v2/api/intro
[ddev-addon]: https://github.com/mittwald/ddev

[^1]: DDEV `homeadditions` are a mechanism to extend your home directory within the web container. Have a look at the [manual](https://ddev.readthedocs.io/en/stable/users/extend/in-container-configuration/) for more information.
