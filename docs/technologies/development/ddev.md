---
title: Running PHP apps locally with DDEV
sidebar_label: DDEV
tags:
  - PHP
  - Deployment
description: DDEV is a local development environment for PHP applications. It provides an easy way to run PHP apps locally, facilitating development and testing.
---

## Prerequisites

Before getting started, make sure you have the necessary tools installed on your local machine:

- [DDEV](https://ddev.readthedocs.io/en/stable/): DDEV is a local development environment that simplifies setting up and managing PHP applications on your computer.
- [Docker](https://www.docker.com/): Docker is a platform for developing, shipping, and running applications inside containers.

It's also recommended to have the [mittwald CLI][cli] installed, although it's optional for this setup.

## Setting up a DDEV environment

### Using the mittwald CLI

If you already have an existing application on the mittwald platform, and have the [mittwald CLI][cli] installed, you can streamline the setup process for your PHP application with DDEV. The mittwald CLI allows you to create a new DDEV environment tailored to your mittwald app quickly.

To initiate the setup, run the following command in your terminal, replacing `<app-id>` with your application ID (usually formatted as `a-xxxxx`), and `<project-name>` with a suitable name for your project:

```bash
$ mw ddev init <app-id> --project-name <project-name>
```

This command automatically configures a DDEV environment to closely match your existing mittwald app, including PHP and MySQL versions and the document root. Additionally, it installs and configures the [mittwald DDEV addon][ddev-addon], which integrates seamlessly with DDEV.

:::tip

You can update your DDEV environment to match any changes in your mittwald app's configuration at any time by running `mw ddev init` again.

:::

### Manual Setup

If you don't have the mittwald CLI installed or prefer a manual approach, you can still set up a DDEV environment for your PHP app. Here's how:

```bash
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

```bash
$ ddev pull mittwald
```

Conversely, to push your local code and database changes to your mittwald app, execute:

```bash
$ ddev push mittwald
```

:::warning

Be cautious when using `ddev push` as it overwrites your mittwald app's code and database with data from your local environment. This command is intended for development purposes and doesn't implement a production-ready deployment strategy.

:::

### Using the mittwald CLI

The [mittwald DDEV addon][ddev-addon] enables you to run the [mittwald CLI][cli] directly within your DDEV web container. This integration allows you to execute various mittwald CLI commands seamlessly.

To utilize the mittwald CLI inside your DDEV environment, use the following syntax:

```bash
$ ddev mw <command>
```

Replace `<command>` with any supported command from the mittwald CLI.

[cli]: /docs/v2/api/sdks/cli
[apitoken]: /docs/v2/api/intro
[ddev-addon]: https://github.com/mittwald/ddev
