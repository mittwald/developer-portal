---
title: Profiling PHP applications with Tideways
sidebar_label: Tideways profiling
tags:
  - PHP
  - Containers
description: |
  Learn how to profile and monitor your PHP applications with Tideways, using the bundled PHP extension and a containerized Tideways daemon.
---

[Tideways](https://tideways.com/) is a commercial application performance monitoring (APM) and profiling service for PHP. It continuously records how long your requests take, where that time is spent, and which errors occur, down to individual function calls and database queries.

Tideways consists of three parts:

1. A **PHP extension** that instruments your application and collects traces. This extension is already bundled with mittwald's PHP builds, so you only need to enable it.
2. The **Tideways daemon**, a small background service that buffers the collected traces and forwards them to the Tideways backend. You run it yourself, as a container in your project.
3. The **Tideways backend** at [app.tideways.io](https://app.tideways.io/), where you analyze the collected data.

This guide walks you through enabling the extension and running the daemon on the mittwald platform.

## Prerequisites {#prerequisites}

To follow this guide, you will need:

- Access to a mittwald mStudio project with a [PHP app](/docs/v2/platform/workloads/php) (or [PHP worker](/docs/v2/platform/workloads/php-worker))
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers), because the Tideways daemon runs as a container
- A [Tideways account](https://tideways.com/) and the API key of a Tideways project (you will find it in the Tideways UI under the project's settings)
- One of the following PHP versions, which are the first mittwald builds to ship the Tideways extension:
  - PHP 8.3.33 or newer
  - PHP 8.4.24 or newer
  - PHP 8.5.9 or newer

You can look up the PHP version of your app in the mStudio UI, or from the CLI:

```shellsession title="Local shell session"
user@local $ mw app get <app-id>
```

If your app runs an older PHP version, update it before you continue:

```shellsession title="Local shell session"
user@local $ mw app dependency update <app-id> --set php=~8.4
```

See [Managing and deploying PHP applications](/docs/v2/platform/workloads/php#auto-updates) for more details on PHP version management.

## Step 1: Running the Tideways daemon {#daemon}

The PHP extension does not talk to the Tideways backend directly. Instead, it sends its data to the Tideways daemon over a TCP connection, and the daemon takes care of buffering and transmitting it. This means you need exactly one daemon container per project, which all of your PHP apps can share.

We use the `ghcr.io/tideways/daemon:latest` image from the [GitHub Container Registry](https://github.com/tideways/daemon/pkgs/container/daemon) for this container. The daemon listens on TCP port `9135` and needs no persistent storage, so no volumes are required.

:::note

The daemon does **not** need your API key. The key is configured on the PHP side and passed along with every trace, which is why a single daemon can serve multiple Tideways projects.

:::

### Using the mStudio UI {#daemon-ui}

In mStudio, go to your project, select **"Containers"** and click **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description — this is a free text field used to identify the container. For example, enter **"Tideways daemon"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `ghcr.io/tideways/daemon:latest` and confirm with **"Next"**.

#### Entrypoint and Command {#daemon-ui-command}

- **Entrypoint:** No changes required
- **Command:** No changes required for a default setup. To control how the daemon registers itself in the Tideways UI, you can pass `--env=production --hostname=tideways-daemon` (see [Daemon options](#daemon-options) below).

#### Volumes {#daemon-ui-volumes}

No volumes are required. The daemon only buffers data in memory and forwards it.

#### Environment Variables {#daemon-ui-env}

No environment variables are required.

Once you're through the dialog, you'll be asked for the **port**. Enter `9135` so that the daemon becomes reachable for the other workloads in your project. Click **"Create container"** to create and start the container.

:::note

Take note of the container's internal DNS name, which is displayed in mStudio after creation. It is derived from the container name — a container named `Tideways daemon` gets the DNS name `tideways-daemon`. You will need this name in [step 2](#php-config).

:::

### Alternative: Using the `mw container run` command {#daemon-cli-run}

You can also create and start the daemon container directly from the command line:

```shellsession title="Local shell session"
user@local $ mw container run \
  --name tideways-daemon \
  --description "Tideways daemon" \
  --publish 9135:9135 \
  ghcr.io/tideways/daemon:latest
```

The `--name` flag determines the internal DNS name under which the daemon will be reachable from your apps.

To pass options to the daemon itself, add them after the image name. Because these options look like CLI flags, separate them from the `mw` flags with a `--`:

```shellsession title="Local shell session"
user@local $ mw container run \
  --name tideways-daemon \
  --description "Tideways daemon" \
  --publish 9135:9135 \
  -- ghcr.io/tideways/daemon:latest --env=production --hostname=tideways-daemon
```

### Alternative: Using the `mw stack deploy` command {#daemon-cli-stack}

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. Create a `docker-compose.yml` file with the following content:

```yaml
services:
  tideways-daemon:
    image: ghcr.io/tideways/daemon:latest
    command: "--env=production --hostname=tideways-daemon"
    ports:
      - "9135:9135/tcp"
```

Then deploy it:

```shellsession title="Local shell session"
user@local $ mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack.

### Daemon options {#daemon-options}

The daemon runs fine with its defaults, but two options are worth setting explicitly:

- `--env=<name>` sets the environment name that traces are reported under, for example `production` or `staging`. It defaults to `production`.
- `--hostname=<name>` sets the server name that the daemon registers itself with in the Tideways UI. Inside containers, the daemon appends the container ID to the detected hostname by default, which means that every recreation of the container shows up as a new server. Setting a fixed hostname avoids this.

The [daemon configuration reference](https://support.tideways.com/documentation/reference/daemon/configuration-reference.html) documents all available options.

:::note

Publishing port `9135` only makes the daemon reachable from _within_ your hosting environment, meaning from other containers and managed apps in the same project. It is not exposed to the internet, and the platform's network policies prevent access from other projects.

:::

## Step 2: Configuring the PHP extension {#php-config}

The Tideways extension is part of your app's PHP installation, but it is disabled by default. To enable and configure it, add a new configuration file to your project's PHP configuration directory. Connect to your app via SSH:

```shellsession title="Local shell session"
user@local $ mw app ssh <app-id>
```

Then create the file `~/.config/php/php.d/20-tideways.ini` with the following content:

```ini title="~/.config/php/php.d/20-tideways.ini"
extension=tideways.so

; The API key of your Tideways project
tideways.api_key=YOUR_API_KEY

; The internal DNS name and port of your daemon container
tideways.connection=tcp://tideways-daemon:9135

; Groups the collected data within your Tideways project
tideways.service=web

; Percentage of requests that are recorded with the timeline profiler
tideways.trace_sample_rate=25
```

Replace `YOUR_API_KEY` with the API key of your Tideways project, and `tideways-daemon` with the internal DNS name of the container you created in [step 1](#daemon).

The settings have the following meaning:

- `tideways.api_key` (**required**) authenticates your traces against your Tideways project.
- `tideways.connection` (**required** in this setup) points the extension at your daemon. Without it, the extension looks for a daemon on a local Unix socket, which does not exist on the mittwald platform.
- `tideways.service` groups monitoring data into independent units within a project, each with its own performance and error statistics. Use it to tell your web frontend, your API and your background workers apart. It defaults to `app`.
- `tideways.trace_sample_rate` controls the percentage of requests that are recorded with the full timeline profiler. It defaults to `25`. All other requests are still covered by performance and error monitoring.

See the [Tideways configuration documentation](https://support.tideways.com/documentation/setup/configuration/configure-tideways-globally-via-php-ini.html) for the complete list of settings.

:::caution

Your API key is a credential. Anyone with filesystem access to your project can read it from this file, so do not commit `20-tideways.ini` to version control or copy it into publicly readable directories.

:::

:::note

Changes to files in `~/.config/php/php.d` are detected automatically, and the PHP-FPM service is restarted for you. There is no need to restart anything manually.

The configuration applies to the whole project, so all PHP apps in it will report to Tideways. This includes PHP running on the command line, which means cron jobs, queue workers and console commands are profiled as well, without any additional configuration.

Loading a PHP extension is a system-level setting and therefore cannot be done in a per-directory `.user.ini` file.

:::

## Step 3: Verifying the setup {#verification}

First, check that the extension is loaded. In an SSH session on your app, run:

```shellsession title="SSH shell session"
user@ssh $ php -m | grep -i tideways
```

The output should contain `tideways`. To also confirm that your settings were picked up, run:

```shellsession title="SSH shell session"
user@ssh $ php -i | grep tideways
```

Next, check that the daemon is running and accepting connections:

```shellsession title="Local shell session"
user@local $ mw container logs tideways-daemon
```

Finally, send some traffic to your application and open your project in [app.tideways.io](https://app.tideways.io/). The first data points usually appear within a few minutes.

## Profiling on demand with the browser extension {#browser-extension}

Sampling covers your average traffic, but sometimes you want a full trace of one specific page load. The [Tideways browser extension](https://support.tideways.com/documentation/reference/browser-extension/chrome-extension.html) lets you trigger this from your browser: it sets a signed `TIDEWAYS_SESSION` cookie that instructs the PHP extension to record a complete timeline and callgraph trace for your own requests.

After installing it and logging in with your Tideways account, click the Tideways icon and select **"Take Profile"** to reload the current page with profiling enabled, or **"Profile for 15 seconds"** to capture a sequence of interactions such as a form submission or a series of AJAX calls.

## Troubleshooting {#troubleshooting}

### No data appears in Tideways {#troubleshooting-no-data}

- Verify that the daemon container is running and that port `9135` is published. Without a published port, the container is not reachable from your app.
- Check that `tideways.connection` uses the container's internal DNS name, not its display name or container ID. You can look up the DNS name in the mStudio UI or with `mw container list`.
- Inspect the PHP error logs at `/var/log/php_errors.log` and the daemon logs with `mw container logs tideways-daemon` for connection or authentication errors.
- Make sure the API key belongs to the Tideways project you are looking at.

### The extension is not loaded {#troubleshooting-extension}

- Confirm that your app runs a PHP version that includes the extension (see [Prerequisites](#prerequisites)).
- Make sure the configuration file is located in `~/.config/php/php.d/` and has an `.ini` extension. `extension=tideways.so` has no effect in a per-directory `.user.ini` file.
- Check the PHP error log of your app at `/var/log/php_errors.log` for messages about a failed extension load.

### Profiling a containerized PHP application {#troubleshooting-containers}

This guide covers managed PHP apps, where mittwald provides the PHP build including the Tideways extension. If you run PHP in your own container instead, you need to install the extension into your image yourself, following the [Tideways Docker installation instructions](https://support.tideways.com/documentation/setup/installation/docker-with-compose.html). The daemon setup described in [step 1](#daemon) stays the same.

## Further resources {#further-resources}

- [Tideways documentation](https://support.tideways.com/documentation/)
- [Configuring Tideways via php.ini](https://support.tideways.com/documentation/setup/configuration/configure-tideways-globally-via-php-ini.html)
- [Tideways daemon configuration reference](https://support.tideways.com/documentation/reference/daemon/configuration-reference.html)
- [Tideways browser extension](https://support.tideways.com/documentation/reference/browser-extension/chrome-extension.html)
- [Managing and deploying PHP applications](/docs/v2/platform/workloads/php)
- [Managing and deploying containerized applications](/docs/v2/platform/workloads/containers)
