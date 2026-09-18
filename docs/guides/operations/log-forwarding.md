---
title: Forwarding container logs to Grafana Cloud or Loki
sidebar_label: Log forwarding
tags:
  - Containers
  - Logging
  - Monitoring
description: |
  Learn how to ship the logs of containers running in your mittwald project to
  Grafana Cloud or a self-hosted Loki, using a Grafana Alloy container as a log
  collector.
---

Containers running on the mittwald platform write their output to `stdout` and `stderr`. The platform captures that output and makes it available in mStudio and through the [`mw container logs`](/docs/v2/cli/reference/container/) command. This is convenient for ad-hoc debugging, but it does not cover everything you might need logs for: searching across several containers at once, keeping log data for weeks or months, building dashboards, or getting alerted when errors start piling up.

This guide shows how to forward those logs to [Loki](https://grafana.com/oss/loki/), Grafana's log database — either as part of [Grafana Cloud](https://grafana.com/products/cloud/), the hosted version of the Grafana observability stack, or as a Loki instance you run yourself. Grafana Cloud offers a free tier that is sufficient for small setups; see the [Grafana Cloud pricing page](https://grafana.com/pricing/) for the current limits.

The component that collects and forwards the logs is [Grafana Alloy](https://grafana.com/docs/alloy/latest/), Grafana's OpenTelemetry-based collector. You run it as a regular container in your project.

:::caution Logs are personal data

Application and access logs regularly contain personal data, such as IP addresses, user agents or user names. Before forwarding them to a third-party service, make sure you have a data processing agreement with Grafana Labs in place, and select an EU region when you create your Grafana Cloud stack.

:::

## How this works {#how-it-works}

The setup consists of three pieces:

1. The platform writes the output of every container in your project to a log file in the project filesystem, below `/var/log/container/`.
2. A **Grafana Alloy container** runs in the same project. It mounts that directory, tails the log files, attaches labels derived from the file paths and pushes the lines to Loki.
3. **Loki** stores the logs, and Grafana queries them: in Explore, on dashboards and in alert rules.

```
Your containers
      │ stdout/stderr
      ▼
/var/log/container/<stack-id>/<service>.log   (project filesystem)
      │ mounted into
      ▼
Grafana Alloy container ──── HTTPS ────▶ Loki (Grafana Cloud or self-hosted)
```

Because Alloy reads from the project filesystem rather than from the containers themselves, a single Alloy container covers every container in the project, including ones you add later. There is nothing to change in your existing containers.

## Prerequisites {#prerequisites}

To follow this guide, you will need:

- A mittwald project on a plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- A place to send the logs to: either a [Grafana Cloud](https://grafana.com/products/cloud/) account, or a Loki instance of your own (see [step 1](#destination))
- The **mittwald CLI** (`mw`) installed and logged in (see the [CLI documentation](/docs/v2/cli/))
- SSH or SFTP access to your project, to place the configuration file (see [Uploading the configuration](#config-upload))

## Step 1: Preparing the log destination {#destination}

Alloy writes to any Loki-compatible endpoint. Whichever option you choose, you end up with the same set of values — a push URL, and credentials if the endpoint requires them — which you will pass into the container as environment variables in [step 3](#deploy).

### Option A: Grafana Cloud {#destination-cloud}

Grafana Cloud authenticates writes with an **access policy token**. Access policies are managed in the Grafana Cloud portal, not in your Grafana instance.

1. Open `https://grafana.com/orgs/<your-org>/access-policies` in your browser, where `<your-org>` is the name of your Grafana Cloud organization.
2. Click **"New access policy"**.
3. Give the policy a name (for example `mittwald-log-forwarding`), select the stack it should apply to and grant it the following scopes:
   - `logs:write` — required, this is what Alloy needs to push logs into Loki
   - `metrics:write` — only required if you want Alloy's [self-monitoring metrics](#config) as well
4. Click **"Create access policy"**.
5. The new policy now appears in the list. Click **"Add token"** on it, give the token a name, optionally set an expiration date, and confirm.
6. Copy the token — it starts with `glc_` and is displayed only once.

Next, look up the endpoints and user IDs that go with the token:

1. Open `https://grafana.com/orgs/<your-org>/stacks` and select your stack.
2. The stack page lists its components. Open the details of the **Loki** instance and note its **URL** and the numeric **user ID**.
3. Do the same for the **Prometheus** instance, if you want the self-monitoring metrics.
4. The **Grafana** instance on the same page is where you will query the logs later on.

You should end up with these five values — the token serves as the password for both endpoints, the user names differ because each instance has its own numeric ID:

```shell
# Loki (logs)
LOKI_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push
LOKI_USER=XXXXXXX
LOKI_PASSWORD=glc_XXX

# Prometheus (metrics, optional)
PROM_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push
PROM_USER=XXXXXXX
PROM_PASSWORD=glc_XXX
```

:::note

Alloy needs the complete push endpoints, as shown above. Depending on where in the portal you read them, you may get the base URL of an instance instead — in that case, append `/loki/api/v1/push` to the Loki URL and `/api/prom/push` to the Prometheus URL yourself.

:::

:::caution

The access policy token allows writing into your Grafana Cloud stack. Keep it out of version control, and do not place it in a directory that is served by a web server. If you suspect that it has leaked, delete it in the access policy settings and add a new one.

:::

### Option B: A self-hosted Loki {#destination-self-hosted}

If you already run Loki on your own infrastructure, you only need its push endpoint, which is the base URL of the instance plus `/loki/api/v1/push`:

```shell
# Loki (logs)
LOKI_URL=https://loki.example.com/loki/api/v1/push

# Only if your Loki is behind basic authentication
LOKI_USER=alloy
LOKI_PASSWORD=your_secret_password
```

Two things are worth checking before you continue:

- **Authentication.** A bare Loki has no authentication of its own and is usually protected by a reverse proxy in front of it. Never expose an unauthenticated Loki to the internet — anyone who finds it can write into it and read everything it holds.
- **Multi-tenancy.** If your Loki runs with `auth_enabled: true`, every write has to carry a tenant ID. Alloy sends it for you if you set `tenant_id` in the configuration (see [Writing to a self-hosted Loki](#config-self-hosted)).

:::note Host your Loki elsewhere

Loki is available as a container image, so it is technically possible to run it in the same mittwald project as the containers whose logs you are collecting. We recommend against it: log storage that shares the fate of the system it observes is of little use during exactly the incidents you keep logs for. When the project is unavailable, so are the logs that would explain why.

Run Loki somewhere separate from the workloads it observes — a different project, a different provider, or your own infrastructure.

:::

## Step 2: Writing the Alloy configuration {#config}

Alloy is configured with a `config.alloy` file. Create it locally first; you will upload it to the project filesystem [further down](#config-upload).

```hcl title="config.alloy"
// Grafana Alloy — container log shipping
//
// Watches: /mnt/logs/container/<stack-id>/<service-name>.log
// Labels:  job="container-logs", stack=<stack-id>, container=<service-name>,
//          host=$ALLOY_HOSTNAME
//
// Secrets are read from the environment (see the container setup below).

// 1. Discovery — expand the glob into one target per log file
local.file_match "container_logs" {
	path_targets = [{
		"__path__" = "/mnt/logs/container/*/*.log",
	}]

	// How often the filesystem is re-scanned for new and removed files.
	sync_period = "15s"
}

// 2. Labels — derive the stack ID and the service name from the file path.
//    Relabel regexes are fully anchored, so they have to match the whole path.
discovery.relabel "container_logs" {
	targets = local.file_match.container_logs.targets

	// /mnt/logs/container/<stack-id>/whatever.log -> stack="<stack-id>"
	rule {
		action        = "replace"
		source_labels = ["__path__"]
		regex         = "/mnt/logs/container/([^/]+)/[^/]+\\.log"
		target_label  = "stack"
		replacement   = "$1"
	}

	// /mnt/logs/container/whatever/<service-name>.log -> container="<service-name>"
	rule {
		action        = "replace"
		source_labels = ["__path__"]
		regex         = "/mnt/logs/container/[^/]+/(.+)\\.log"
		target_label  = "container"
		replacement   = "$1"
	}

	rule {
		action       = "replace"
		target_label = "job"
		replacement  = "container-logs"
	}

	// constants.hostname is the container ID inside Docker, so pass the real
	// host name in via the environment instead.
	rule {
		action       = "replace"
		target_label = "host"
		replacement  = sys.env("ALLOY_HOSTNAME")
	}
}

// 3. Tailing — read offsets are kept in --storage.path (persist that volume!)
loki.source.file "container_logs" {
	targets    = discovery.relabel.container_logs.output
	forward_to = [loki.process.container_logs.receiver]

	// false = read existing files from the beginning when they are first seen.
	// Set this to true if you only care about new lines and want to avoid a
	// large initial backfill.
	tail_from_end = false
}

// 4. Processing
loki.process "container_logs" {
	forward_to = [loki.write.default.receiver]

	// `filename` is 1:1 with `container`, so it only adds label cardinality.
	stage.label_drop {
		values = ["filename"]
	}
}

// 5. Loki endpoint
loki.write "default" {
	endpoint {
		url = sys.env("LOKI_URL")

		basic_auth {
			username = sys.env("LOKI_USER")
			password = sys.env("LOKI_PASSWORD")
		}
	}
}

// Self-monitoring (optional, but recommended)
// ===========================================

// Alloy's own logs, so that shipping problems can be debugged from Grafana.
logging {
	level    = "info"
	format   = "logfmt"
	write_to = [loki.process.alloy_logs.receiver]
}

loki.process "alloy_logs" {
	forward_to = [loki.write.default.receiver]

	stage.static_labels {
		values = {
			job  = "alloy",
			host = sys.env("ALLOY_HOSTNAME"),
		}
	}
}

// Alloy's own metrics: sent and dropped bytes, per-file read offsets, write errors.
prometheus.exporter.self "alloy" {}

prometheus.scrape "alloy" {
	targets         = prometheus.exporter.self.alloy.targets
	forward_to      = [prometheus.remote_write.default.receiver]
	job_name        = "integrations/alloy"
	scrape_interval = "60s"
}

prometheus.remote_write "default" {
	external_labels = {
		instance = sys.env("ALLOY_HOSTNAME"),
	}

	endpoint {
		url = sys.env("PROM_URL")

		basic_auth {
			username = sys.env("PROM_USER")
			password = sys.env("PROM_PASSWORD")
		}
	}
}
```

The pipeline reads from top to bottom: `local.file_match` turns the glob into one target per log file, `discovery.relabel` attaches labels to those targets, `loki.source.file` tails them, `loki.process` cleans up the label set, and `loki.write` ships the result to Loki.

The second half is optional. It forwards Alloy's own log output to Loki and its internal metrics — sent and dropped bytes, per-file read offsets, write errors — to Prometheus, which is what you will want to look at when logs stop arriving. If you have no Prometheus-compatible endpoint, delete the three `prometheus.*` blocks and keep the rest.

:::note Keep your label set small

Loki creates a separate stream for every combination of label values, and a large number of streams makes queries slower and, in Grafana Cloud, your bill higher. Labels that are stable and low in cardinality — `job`, `stack`, `container`, `host` — are a good fit. Never turn per-request values such as request IDs, URLs or user IDs into labels; query them with a [LogQL filter expression](https://grafana.com/docs/loki/latest/query/log_queries/) instead.

:::

### Writing to a self-hosted Loki {#config-self-hosted}

For a Loki of your own, only the `loki.write` block changes. Without authentication, drop the `basic_auth` block entirely:

```hcl title="config.alloy (excerpt)"
loki.write "default" {
	endpoint {
		url = sys.env("LOKI_URL")
	}
}
```

If your Loki runs in multi-tenant mode (`auth_enabled: true`), name the tenant that the logs should be written to. Alloy sends it as the `X-Scope-OrgID` header:

```hcl title="config.alloy (excerpt)"
loki.write "default" {
	endpoint {
		url       = sys.env("LOKI_URL")
		tenant_id = "my-tenant"
	}
}
```

The [`loki.write` reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/) documents the remaining options, including bearer token authentication and `tls_config` for a private certificate authority.

### Uploading the configuration {#config-upload}

The container reads its configuration from the project filesystem, so the file has to be there before the container starts. This guide uses the directory `/files/alloy`, which is mounted into the container at `/etc/alloy`.

You do not need a dedicated SFTP user for this: your own mStudio account can connect to the project filesystem directly. The user name for such a connection combines your mStudio email address with the short ID of the resource you want to connect to:

- `<your-email>@<project-short-id>@<ssh-host>` connects to the **project** — this is the one you need for `/files`
- `<your-email>@<container-short-id>@<ssh-host>` connects into a **container**

The SSH host and the short ID of your project are shown by `mw project get`; `mw container list` lists the short IDs of your containers. Authentication uses the SSH key or password that you have deposited in your mStudio account. For an interactive shell, [`mw project ssh`](/docs/v2/cli/reference/project/) assembles the connection for you.

Create the directory and upload the file:

```shellsession title="Local shell session"
user@local $ sftp jane.doe@example.com@p-XXXXXX@ssh.example.project.host
sftp> mkdir /files/alloy
sftp> put config.alloy /files/alloy/config.alloy
```

`scp` works just as well:

```shellsession title="Local shell session"
user@local $ scp config.alloy \
  jane.doe@example.com@p-XXXXXX@ssh.example.project.host:/files/alloy/config.alloy
```

:::tip Updating the configuration later

Alloy does not pick up configuration changes automatically. After you have replaced `/files/alloy/config.alloy`, restart the container with `mw container restart alloy`, or from the mStudio UI.

:::

### Checking where your log files actually are {#log-paths}

Before you deploy, it is worth confirming that the glob in the configuration matches. Open a shell in the project — the CLI assembles the connection for you:

```shellsession title="Local shell session"
user@local $ mw project ssh
```

Then list the log directory:

```shellsession title="SSH shell session"
user@ssh $ ls -l /var/log/container/
```

You should see one directory per container stack, each containing one `.log` file per service. If your layout differs, adjust the `__path__` glob and the two relabel regexes in `config.alloy` accordingly.

## Step 3: Starting the Alloy container {#deploy}

The container uses the [`grafana/alloy`](https://hub.docker.com/r/grafana/alloy) image from Docker Hub and needs three volumes:

| Volume                               | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `/files/alloy` → `/etc/alloy`        | The configuration file from [step 2](#config)                           |
| `/var/log` → `/mnt/logs`             | The container log files                                                 |
| `alloy-data` → `/var/lib/alloy/data` | Alloy's positions file, so it resumes where it left off after a restart |

:::caution Persist the data volume

Without the `alloy-data` volume, Alloy loses track of how far it has read into each file. After every restart it would start from the beginning again, which duplicates log lines in Loki and can produce a sizeable — and, in Grafana Cloud, expensive — backfill.

:::

### Deploying the stack {#deploy-stack}

The most convenient way to set this up is the [`mw stack deploy` command](/docs/v2/cli/reference/stack/), which is compatible with Docker Compose: the container definition stays in a file you can put under version control, and the credentials stay in a separate `.env` file next to it.

Create a `docker-compose.yml` file with the following content:

```yaml title="docker-compose.yml"
services:
  alloy:
    image: grafana/alloy:v1.19.2
    restart: unless-stopped
    command:
      - run
      - --server.http.listen-addr=0.0.0.0:12345
      - --storage.path=/var/lib/alloy/data
      - /etc/alloy/config.alloy
    ports:
      - "12345:12345/tcp"
    environment:
      ALLOY_HOSTNAME: ${ALLOY_HOSTNAME}
      LOKI_URL: ${LOKI_URL}
      LOKI_USER: ${LOKI_USER}
      LOKI_PASSWORD: ${LOKI_PASSWORD}
      PROM_URL: ${PROM_URL}
      PROM_USER: ${PROM_USER}
      PROM_PASSWORD: ${PROM_PASSWORD}
    volumes:
      # The configuration file you uploaded in step 2
      - /files/alloy:/etc/alloy
      # The container log files
      - /var/log:/mnt/logs
      # Positions file. Without this volume, Alloy re-reads every log file
      # from the beginning after each restart.
      - alloy-data:/var/lib/alloy/data
volumes:
  alloy-data: {}
```

Next to it, create a `.env` file with the values from [step 1](#destination):

```shell title=".env"
# Label value identifying this project in Loki and Prometheus
ALLOY_HOSTNAME=my-project

# Logs
LOKI_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push
LOKI_USER=XXXXXXX
LOKI_PASSWORD=glc_XXX

# Metrics (self-monitoring)
PROM_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push
PROM_USER=XXXXXXX
PROM_PASSWORD=glc_XXX
```

In Grafana Cloud, `LOKI_PASSWORD` and `PROM_PASSWORD` both hold the same access policy token; the user names differ, because each instance has its own numeric ID.

Whenever you leave a variable out of the `.env` file, remove the matching line from the `environment` section of the compose file as well — otherwise it is passed into the container as an empty string, and Alloy fails against an endpoint it thinks is configured. This applies to `LOKI_USER` and `LOKI_PASSWORD` for a self-hosted Loki without authentication (see [Writing to a self-hosted Loki](#config-self-hosted)), and to all three `PROM_*` variables if you drop the self-monitoring part of the configuration.

Then deploy the stack:

```shellsession title="Local shell session"
user@local $ mw stack deploy
```

This command reads `docker-compose.yml` from the current directory, resolves the variables from `.env` (use `--env-file` to point it at a different file) and deploys the result to your default stack.

:::caution

`.env` contains a credential. Add it to your `.gitignore`, and commit only the `docker-compose.yml`.

:::

:::note Pinning the image version

The example pins the image to a specific version. If you prefer to track the `latest` tag instead, remember that mutable tags are not re-pulled automatically: use `mw container recreate --pull alloy`, or set up a [recurring update schedule](/docs/v2/platform/workloads/containers#update-schedule) for the stack.

:::

### Other ways to create the container {#deploy-alternatives}

The stack above can be created just as well in the mStudio UI (**"Containers"** → **"Create container"**) or with a single [`mw container run`](/docs/v2/cli/reference/container/) command. Both need the same ingredients: the image `grafana/alloy:v1.19.2`, the command `run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy`, the three volumes from the table above, the environment variables from the `.env` file, and port `12345` if you want to reach the [Alloy UI](#alloy-ui). With `mw container run`, add `--create-volumes` so that the named `alloy-data` volume is created along with the container.

For this setup, the compose file is usually the better choice: it keeps the credentials out of your shell history, and re-deploying it after a configuration change is a single command.

## Step 4: Verifying the setup {#verification}

First, check that the container started and is not complaining about its configuration:

```shellsession title="Local shell session"
user@local $ mw container logs alloy
```

A healthy start logs a few `level=info` lines and then goes quiet. Errors about a missing configuration file or about the Loki endpoint show up here immediately.

Then query the logs in Grafana. Go to **Explore**, select the Loki data source and run:

```logql
{job="container-logs"}
```

You should see the output of your containers, labelled with `stack`, `container` and `host`. To narrow it down to a single container:

```logql
{job="container-logs", container="my-app"}
```

The first lines usually appear within a few seconds. If nothing shows up, see [Troubleshooting](#troubleshooting) below.

### Inspecting the Alloy UI {#alloy-ui}

Alloy ships a web UI that shows every component in the pipeline, its health and the targets it has discovered — which makes it the fastest way to tell whether your glob matches any files at all. Publishing port `12345` only makes it reachable from within your project, so forward it to your local machine to have a look:

```shellsession title="Local shell session"
user@local $ mw container port-forward alloy 12345
```

The UI is then available at `http://localhost:12345`.

:::caution

Alloy's web UI has no authentication of its own. Do not connect a domain to port `12345` — use port forwarding when you need access. Publishing the port within the project is not a problem: the platform's network policies prevent access from other projects or from the internet.

:::

## Forwarding other log files {#other-logs}

The same container can pick up other log files, too. The `/var/log` mount already contains more than the container logs — PHP apps, for example, write their errors to `/var/log/php_errors.log`. Have a look at what your project keeps there:

```shellsession title="SSH shell session"
user@ssh $ ls -l /var/log/
```

To ship those files as well, add a second pipeline to `config.alloy`:

```hcl title="config.alloy (excerpt)"
local.file_match "app_logs" {
	path_targets = [{
		"__path__" = "/mnt/logs/*.log",
		"job"      = "app-logs",
		"host"     = sys.env("ALLOY_HOSTNAME"),
	}]

	sync_period = "15s"
}

loki.source.file "app_logs" {
	targets    = local.file_match.app_logs.targets
	forward_to = [loki.write.default.receiver]
}
```

In this pipeline, the `filename` label is worth keeping — unlike in the container pipeline, it is what tells the individual files apart, and there are only a handful of them. For log files that live somewhere else in the project filesystem, mount that directory into the container as well and point another `__path__` at it.

If your containers emit structured logs, it is worth parsing them in `loki.process`: a [`stage.json`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagejson) block extracts fields from JSON lines, and [`stage.timestamp`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagetimestamp) makes Loki use the application's own timestamp instead of the time the line was read.

## Troubleshooting {#troubleshooting}

### The container does not start {#troubleshooting-start}

- Check `mw container logs alloy` for the exact error. A message about a missing or unreadable configuration file means that either the upload in [step 2](#config-upload) did not end up at `/files/alloy/config.alloy`, or the volume is not mounted at `/etc/alloy`.
- Syntax errors in `config.alloy` also abort the start and are reported with a line number.

### No logs arrive in Loki {#troubleshooting-no-logs}

- Open the [Alloy UI](#alloy-ui) and check the `local.file_match.container_logs` component. If it lists no targets, the glob does not match anything — verify the actual log paths as described in [Checking where your log files actually are](#log-paths).
- `401` or `403` responses point at the credentials: in Grafana Cloud, make sure `LOKI_PASSWORD` is the token itself (starting with `glc_`), not the name of the access policy, and that `LOKI_USER` is the numeric user ID of the Loki instance.
- A `404` usually means the URL is missing the `/loki/api/v1/push` suffix.
- On a self-hosted Loki, a `401` with the message `no org id` means that the instance runs in multi-tenant mode and expects a `tenant_id` (see [Writing to a self-hosted Loki](#config-self-hosted)).
- Permission errors while reading the log files are unlikely: the log files are owned by root, and the Alloy image runs as root by default. They can occur if you replace the image with one of your own that drops privileges.

### Log lines appear twice {#troubleshooting-duplicates}

- This is the classic symptom of a missing positions file: without the `alloy-data` volume, Alloy re-reads every file from the start each time the container is recreated. Check that the volume exists and is mounted at the path passed to `--storage.path`.

### Queries are slow, or the bill is higher than expected {#troubleshooting-cardinality}

- Look at the number of active streams. Too many of them almost always come from high-cardinality labels; keep the label set to the stable ones and filter on everything else in LogQL.
- Use `tail_from_end = true` when you add new, large log files that you do not need historical data for.

## Further resources {#further-resources}

- [Grafana Alloy documentation](https://grafana.com/docs/alloy/latest/)
- [`loki.source.file` component reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.file/)
- [`loki.write` component reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/)
- [`loki.process` stages reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/)
- [Grafana Cloud access policies](https://grafana.com/docs/grafana-cloud/security-and-account-management/authentication-and-permissions/access-policies/)
- [Installing Loki with Docker](https://grafana.com/docs/loki/latest/setup/install/docker/)
- [LogQL query language](https://grafana.com/docs/loki/latest/query/)
- [Managing and deploying containerized applications](/docs/v2/platform/workloads/containers)
- [`mw container` CLI reference](/docs/v2/cli/reference/container/)
- [`mw stack` CLI reference](/docs/v2/cli/reference/stack/)
