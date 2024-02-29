---
title: Running PHP apps locally with DDEV
sidebar_label: DDEV
tags:
  - PHP
  - Deployment
description: >
  DDEV is a local development environment for PHP applications. It's a great way to run PHP apps locally, and it's easy to use.
---

## Prerequisites

For this guide, you need to following tools installed on your local machine:

- [DDEV](https://ddev.readthedocs.io/en/stable/)
- [Docker](https://www.docker.com/)
- [mittwald CLI][cli] (optional)

## Setting up a DDEV environment

### Using the mittwald CLI

If you have the [mittwald CLI][cli] installed, you can use it to create a new DDEV environment for your PHP app. To do this, run the following command (with `<app-id>` being your application ID, which is usually formatted as `a-xxxxx`):

```bash
$ mw ddev init <app-id> --project-name <project-name>
```

This command runs non-interactively (it might prompt for project name if not provided) and creates a new DDEV environment for your PHP app. The DDEV project will be pre-configured to match your existing mittwald app as closely as possible (regarding PHP and MySQL version, and the application's document root). It also installs and configures the [mittwald DDEV addon][ddev-addon], allowing you to use the integration without any further setup.

:::tip

You can re-run the `mw ddev init` command at any time to update your DDEV environment to match your mittwald app's configuration.

:::

### Manually

If you don't have the mittwald CLI installed, you can create a new DDEV environment manually. To do this, run the following commands (while supplying suitable values for the `<placeholders>`):

```bash
$ ddev config \
    --project-type <type> \
    --php-version <php-version> \
    --database mysql:<mysql-version>
$ ddev get mittwald/ddev
```

This creates a new DDEV environment and installs the [mittwald DDEV addon][ddev-addon] for you. The `ddev get` command will prompt you for a [mittwald API token][apitoken] and the application ID of your mittwald app (typically formatted as `a-xxxxx`).

When connecting your DDEV project to an existing mittwald project, pay attention to configure your environment to match the PHP and MySQL versions of your mittwald app.

## Features

### Pulling and pushing your code and database

You can run the command `ddev pull mittwald` to download your mittwald app's code and database to your local DDEV environment.

Similarly, you can run `ddev push mittwald` to upload your local code and database to your mittwald app.

:::warning

Using `ddev push` will overwrite your mittwald app's code and database with the data from your local DDEV environment. The command **DOES NOT** implement a production-ready zero-downtime deployment strategy and should be used with caution and for development purposes only.

:::

### Using the mittwald CLI

The [DDEV addon][ddev-addon] allows you to run the [mittwald CLI][cli] inside your DDEV web container. You can invoke the CLI as follows (with `<command>` being any command that is supported by the mittwald CLI):

```
$ ddev mw <command>
```

[cli]: /docs/v2/api/sdks/cli
[apitoken]: /docs/v2/api/intro
[ddev-addon]: https://github.com/mittwald/ddev
