---
title: Forwarding container logs to Grafana Cloud
sidebar_label: Log forwarding
tags:
  - Containers
  - Logging
  - Monitoring
description: |
  Learn how to ship the logs of containers running in your mittwald project to
  Grafana Cloud, using a Grafana Alloy container as a log collector.
---

Containers running on the mittwald platform write their output to `stdout` and `stderr`. The platform captures that output and makes it available in mStudio and through the [`mw container logs`](/docs/v2/cli/reference/container/) command. This is convenient for ad-hoc debugging, but it does not cover everything you might need logs for: searching across several containers at once, keeping log data for weeks or months, building dashboards, or getting alerted when errors start piling up.

This guide shows how to do that with [Grafana Cloud](https://grafana.com/products/cloud/), the hosted version of the Grafana observability stack. Grafana Cloud bundles [Loki](https://grafana.com/oss/loki/) for logs, Prometheus-compatible storage for metrics and Grafana itself for querying, dashboards and alerting. It offers a free tier that is sufficient for small setups; see the [Grafana Cloud pricing page](https://grafana.com/pricing/) for the current limits.

The component that collects and forwards the logs is [Grafana Alloy](https://grafana.com/docs/alloy/latest/), Grafana's OpenTelemetry-based collector. You run it as a regular container in your project.

:::caution Logs are personal data

Application and access logs regularly contain personal data, such as IP addresses, user agents or user names. Before forwarding them to a third-party service, make sure you have a data processing agreement with Grafana Labs in place, and select an EU region when you create your Grafana Cloud stack.

:::

## How this works {#how-it-works}

The setup consists of three pieces:

1. The platform writes the output of every container in your project to a log file in the project filesystem, below `/var/log/container/`.
2. A **Grafana Alloy container** runs in the same project. It mounts that directory, tails the log files, attaches labels derived from the file paths and pushes the lines to Grafana Cloud.
3. **Grafana Cloud** stores the logs in Loki, where you can query them in Explore, put them on dashboards and alert on them.

```
Your containers
      │ stdout/stderr
      ▼
/var/log/container/<stack-id>/<service>.log   (project filesystem)
      │ mounted into
      ▼
Grafana Alloy container ──── HTTPS ────▶ Grafana Cloud (Loki)
```

Because Alloy reads from the project filesystem rather than from the containers themselves, a single Alloy container covers every container in the project, including ones you add later. There is nothing to change in your existing containers.

## Prerequisites {#prerequisites}

To follow this guide, you will need:

- A mittwald project on a plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- A [Grafana Cloud](https://grafana.com/products/cloud/) account, with permissions to create access policy tokens
- The **mittwald CLI** (`mw`) installed and logged in (see the [CLI documentation](/docs/v2/cli/)) — most steps also work entirely in the mStudio UI
- Access to your project's filesystem via SSH or SFTP, to place the configuration file (see [step 2](#config-upload))

## Step 1: Creating a Grafana Cloud token {#grafana-token}

Grafana Cloud authenticates writes with an access policy token. The quickest way to get one — together with the endpoint URLs you need — is the collector onboarding in your Grafana Cloud stack:

1. Open `https://<your-stack>.grafana.net/a/grafana-collector-app/alloy` in your browser, where `<your-stack>` is the name of your Grafana Cloud stack.
2. Select any **Linux** platform. The actual instructions do not matter; you are only after the credentials on that page.
3. Create a new access token. Grafana Cloud assigns it the `set:alloy-data-write` scope set, which contains the `logs:write` and `metrics:write` scopes this setup needs.
4. From the **"Install and run Grafana Alloy"** section, copy the generated `GCLOUD_HOSTED_*` environment variables and the `GCLOUD_RW_API_KEY`. You will need them in [step 3](#deploy).

You should end up with five values:

```shell
# Loki (logs)
GCLOUD_HOSTED_LOGS_ID=XXXXXXX
GCLOUD_HOSTED_LOGS_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push

# Prometheus (metrics, used for Alloy's self-monitoring)
GCLOUD_HOSTED_METRICS_ID=XXXXXXX
GCLOUD_HOSTED_METRICS_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push

# Access policy token with logs:write and metrics:write
GCLOUD_RW_API_KEY=glc_XXX
```

:::caution

`GCLOUD_RW_API_KEY` is a credential that allows writing into your Grafana Cloud stack. Keep it out of version control, and do not paste it into files that are served by a web server. If you suspect it has leaked, revoke the token in the Grafana Cloud access policy settings and create a new one.

:::

If you prefer to create the token by hand, use the [access policies documentation](https://grafana.com/docs/grafana-cloud/security-and-account-management/authentication-and-permissions/access-policies/) and grant it the `logs:write` and `metrics:write` scopes. The endpoint URLs and the numeric user IDs are listed under **"Details"** for the Loki and Prometheus services in your Grafana Cloud account.

## Step 2: Writing the Alloy configuration {#config}

Alloy is configured with a `config.alloy` file. Create it locally first; you will upload it to the project filesystem in the [next step](#config-upload).

```alloy title="config.alloy"
// Grafana Alloy — container log shipping to Grafana Cloud
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
	forward_to = [loki.write.grafana_cloud_logs.receiver]

	// `filename` is 1:1 with `container`, so it only adds label cardinality.
	stage.label_drop {
		values = ["filename"]
	}
}

// 5. Loki endpoint (Grafana Cloud)
loki.write "grafana_cloud_logs" {
	endpoint {
		url = sys.env("GCLOUD_HOSTED_LOGS_URL")

		basic_auth {
			username = sys.env("GCLOUD_HOSTED_LOGS_ID")
			password = sys.env("GCLOUD_RW_API_KEY")
		}
	}
}

// Self-monitoring (optional, but recommended — you already have the credentials)
// ============================================================================

// Alloy's own logs, so that shipping problems can be debugged from Grafana.
logging {
	level    = "info"
	format   = "logfmt"
	write_to = [loki.process.alloy_logs.receiver]
}

loki.process "alloy_logs" {
	forward_to = [loki.write.grafana_cloud_logs.receiver]

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
	forward_to      = [prometheus.remote_write.grafana_cloud_metrics.receiver]
	job_name        = "integrations/alloy"
	scrape_interval = "60s"
}

prometheus.remote_write "grafana_cloud_metrics" {
	external_labels = {
		instance = sys.env("ALLOY_HOSTNAME"),
	}

	endpoint {
		url = sys.env("GCLOUD_HOSTED_METRICS_URL")

		basic_auth {
			username = sys.env("GCLOUD_HOSTED_METRICS_ID")
			password = sys.env("GCLOUD_RW_API_KEY")
		}
	}
}
```

The pipeline reads from top to bottom: `local.file_match` turns the glob into one target per log file, `discovery.relabel` attaches labels to those targets, `loki.source.file` tails them, `loki.process` cleans up the label set, and `loki.write` ships the result to Grafana Cloud.

:::note Keep your label set small

Loki creates a separate stream for every combination of label values, and a large number of streams makes queries slower and your bill higher. Labels that are stable and low in cardinality — `job`, `stack`, `container`, `host` — are a good fit. Never turn per-request values such as request IDs, URLs or user IDs into labels; query them with a [LogQL filter expression](https://grafana.com/docs/loki/latest/query/log_queries/) instead.

:::

### Uploading the configuration {#config-upload}

The container reads its configuration from the project filesystem, so the file has to be there before the container starts. This guide uses the directory `/files/alloy`, which is mounted into the container at `/etc/alloy`.

The most direct way to upload it is SFTP. In mStudio, go to your project, select **"Access"** and create an SFTP user with access to the `/files` directory — or use the CLI:

```shellsession title="Local shell session"
user@local $ mw sftp-user create \
  --description "Alloy config upload" \
  --directories /files \
  --access-level full \
  --public-key "$(cat ~/.ssh/id_ed25519.pub)"
```

You can then copy the file into place (the SFTP host name of your project is shown in mStudio and by `mw project get`):

```shellsession title="Local shell session"
user@local $ sftp <sftp-user>@ssh.<project>.project.host
sftp> mkdir /files/alloy
sftp> put config.alloy /files/alloy/config.alloy
```

If you already have an SSH user for the project, `scp` works just as well:

```shellsession title="Local shell session"
user@local $ ssh <ssh-user>@ssh.<project>.project.host mkdir -p /files/alloy
user@local $ scp config.alloy <ssh-user>@ssh.<project>.project.host:/files/alloy/config.alloy
```

:::tip Updating the configuration later

Alloy does not pick up configuration changes automatically. After you have replaced `/files/alloy/config.alloy`, restart the container with `mw container restart alloy` (or reload it from the mStudio UI).

If another container in your project already mounts `/files`, you can also push updates with [`mw container cp`](/docs/v2/cli/reference/container/) instead of using SFTP.

:::

### Checking where your log files actually are {#log-paths}

Before you deploy, it is worth confirming that the glob in the configuration matches. With an SSH user, list the log directory:

```shellsession title="SSH shell session"
user@ssh $ ls -l /var/log/container/
```

You should see one directory per container stack, each containing one `.log` file per service. If your layout differs, adjust the `__path__` glob and the two relabel regexes in `config.alloy` accordingly.

## Step 3: Starting the Alloy container {#deploy}

The container uses the [`grafana/alloy`](https://hub.docker.com/r/grafana/alloy) image from Docker Hub and needs three volumes:

| Volume                               | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `/files/alloy` → `/etc/alloy`        | The configuration file from [step 2](#config)                           |
| `/var/log` → `/mnt/logs`             | The container log files, mounted read-only                              |
| `alloy-data` → `/var/lib/alloy/data` | Alloy's positions file, so it resumes where it left off after a restart |

:::caution Persist the data volume

Without the `alloy-data` volume, Alloy loses track of how far it has read into each file. After every restart it would start from the beginning again, which duplicates log lines in Loki and can produce a sizeable, and expensive, backfill.

:::

### Using the mStudio UI {#deploy-ui}

In mStudio, go to your project, select **"Containers"** and click **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description — this is a free text field used to identify the container. For example, enter **"Grafana Alloy"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `grafana/alloy:v1.19.2` and confirm with **"Next"**.

#### Entrypoint and Command {#deploy-ui-command}

- **Entrypoint:** No changes required; the image's entrypoint is `/bin/alloy`.
- **Command:** `run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy`

#### Volumes {#deploy-ui-volumes}

Add the three volumes from the table above:

- Project path `/files/alloy`, mounted at `/etc/alloy`
- Project path `/var/log`, mounted at `/mnt/logs`
- A new volume named `alloy-data`, mounted at `/var/lib/alloy/data`

#### Environment Variables {#deploy-ui-env}

Enter the credentials from [step 1](#grafana-token), plus a host name that identifies this project in Grafana:

```shell
# Label value identifying this project in Loki and Prometheus
ALLOY_HOSTNAME=my-project

# Logs
GCLOUD_HOSTED_LOGS_ID=XXXXXXX
GCLOUD_HOSTED_LOGS_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push

# Metrics (self-monitoring)
GCLOUD_HOSTED_METRICS_ID=XXXXXXX
GCLOUD_HOSTED_METRICS_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push

# Access policy token with logs:write and metrics:write
GCLOUD_RW_API_KEY=glc_XXX
```

Once you've entered all the environment variables, click **"Next"**. In the final dialog, you'll be asked for the **port**. Enter `12345` if you want to use Alloy's web UI (see [Inspecting the Alloy UI](#alloy-ui)); otherwise leave it empty. Click **"Create container"** to create and start the container.

### Alternative: Using the `mw container run` command {#deploy-cli-run}

You can also create and start the container directly from the command line. Because the Alloy options look like CLI flags themselves, separate them from the `mw` flags with a `--`:

```shellsession title="Local shell session"
user@local $ mw container run \
  --name alloy \
  --description "Grafana Alloy" \
  --publish 12345:12345 \
  --volume /files/alloy:/etc/alloy \
  --volume /var/log:/mnt/logs:ro \
  --volume alloy-data:/var/lib/alloy/data \
  --create-volumes \
  --env "ALLOY_HOSTNAME=my-project" \
  --env "GCLOUD_HOSTED_LOGS_ID=XXXXXXX" \
  --env "GCLOUD_HOSTED_LOGS_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push" \
  --env "GCLOUD_HOSTED_METRICS_ID=XXXXXXX" \
  --env "GCLOUD_HOSTED_METRICS_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push" \
  --env "GCLOUD_RW_API_KEY=glc_XXX" \
  -- grafana/alloy:v1.19.2 \
  run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy
```

Make sure to replace the placeholder values with the credentials from [step 1](#grafana-token).

### Alternative: Using the `mw stack deploy` command {#deploy-cli-stack}

Alternatively, you can use the [`mw stack deploy` command](/docs/v2/cli/reference/stack/), which is compatible with Docker Compose. This keeps the credentials out of your shell history and out of the compose file. Create a `docker-compose.yml` file with the following content:

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
      GCLOUD_HOSTED_LOGS_ID: ${GCLOUD_HOSTED_LOGS_ID}
      GCLOUD_HOSTED_LOGS_URL: ${GCLOUD_HOSTED_LOGS_URL}
      GCLOUD_HOSTED_METRICS_ID: ${GCLOUD_HOSTED_METRICS_ID}
      GCLOUD_HOSTED_METRICS_URL: ${GCLOUD_HOSTED_METRICS_URL}
      GCLOUD_RW_API_KEY: ${GCLOUD_RW_API_KEY}
    volumes:
      # The configuration file you uploaded in step 2
      - /files/alloy:/etc/alloy
      # The container log files; read-only, because Alloy only tails them
      - /var/log:/mnt/logs:ro
      # Positions file. Without this volume, Alloy re-reads every log file
      # from the beginning after each restart.
      - alloy-data:/var/lib/alloy/data
volumes:
  alloy-data: {}
```

Next to it, create a `.env` file with the credentials from [step 1](#grafana-token):

```shell title=".env"
# Label value identifying this project in Loki and Prometheus
ALLOY_HOSTNAME=my-project

# Logs
GCLOUD_HOSTED_LOGS_ID=XXXXXXX
GCLOUD_HOSTED_LOGS_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push

# Metrics (self-monitoring)
GCLOUD_HOSTED_METRICS_ID=XXXXXXX
GCLOUD_HOSTED_METRICS_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push

# Access policy token with logs:write and metrics:write
GCLOUD_RW_API_KEY=glc_XXX
```

Then deploy the stack:

```shellsession title="Local shell session"
user@local $ mw stack deploy
```

This command reads `docker-compose.yml` from the current directory, resolves the variables from `.env` (use `--env-file` to point it at a different file) and deploys the result to your default stack.

:::note Pinning the image version

The examples pin the image to a specific version. If you prefer to track the `latest` tag instead, remember that mutable tags are not re-pulled automatically: use `mw container recreate --pull`, or set up a [recurring update schedule](/docs/v2/platform/workloads/containers#update-schedule) for the stack.

:::

## Step 4: Verifying the setup {#verification}

First, check that the container started and is not complaining about its configuration:

```shellsession title="Local shell session"
user@local $ mw container logs alloy
```

A healthy start logs a few `level=info` lines and then goes quiet. Errors about a missing configuration file or about the Loki endpoint show up here immediately.

Then query the logs in Grafana Cloud. Open your stack, go to **Explore**, select the Loki data source and run:

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

The same container can pick up any other log file in the project filesystem. Managed apps, for example, write their access and error logs to the `/logs` directory of the project. Mount that directory into the container as well — for example at `/mnt/app-logs` — and add a second pipeline to `config.alloy`:

```alloy title="config.alloy (excerpt)"
local.file_match "app_logs" {
	path_targets = [{
		"__path__" = "/mnt/app-logs/*.log",
		"job"      = "app-logs",
		"host"     = sys.env("ALLOY_HOSTNAME"),
	}]

	sync_period = "15s"
}

loki.source.file "app_logs" {
	targets    = local.file_match.app_logs.targets
	forward_to = [loki.write.grafana_cloud_logs.receiver]
}
```

If your containers emit structured logs, it is worth parsing them in `loki.process`: a [`stage.json`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagejson) block extracts fields from JSON lines, and [`stage.timestamp`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagetimestamp) makes Loki use the application's own timestamp instead of the time the line was read.

## Troubleshooting {#troubleshooting}

### The container does not start {#troubleshooting-start}

- Check `mw container logs alloy` for the exact error. A message about a missing or unreadable configuration file means that either the upload in [step 2](#config-upload) did not end up at `/files/alloy/config.alloy`, or the volume is not mounted at `/etc/alloy`.
- Syntax errors in `config.alloy` also abort the start and are reported with a line number.

### No logs arrive in Grafana Cloud {#troubleshooting-no-logs}

- Open the [Alloy UI](#alloy-ui) and check the `local.file_match.container_logs` component. If it lists no targets, the glob does not match anything — verify the actual log paths as described in [Checking where your log files actually are](#log-paths).
- `401` or `403` responses from Loki point at the token: make sure `GCLOUD_RW_API_KEY` is the token itself (starting with `glc_`), not the access policy name, and that `GCLOUD_HOSTED_LOGS_ID` is the numeric user ID of the Loki service.
- A `404` usually means the URL is missing the `/loki/api/v1/push` suffix.
- Permission errors while reading the log files are unlikely: the log files are owned by root, and the Alloy image runs as root by default. They can occur if you replace the image with one of your own that drops privileges.

### Log lines appear twice {#troubleshooting-duplicates}

- This is the classic symptom of a missing positions file: without the `alloy-data` volume, Alloy re-reads every file from the start each time the container is recreated. Check that the volume exists and is mounted at the path passed to `--storage.path`.

### Queries are slow, or the bill is higher than expected {#troubleshooting-cardinality}

- Look at the number of active streams in Grafana Cloud. Too many of them almost always come from high-cardinality labels; keep the label set to the stable ones and filter on everything else in LogQL.
- Use `tail_from_end = true` when you add new, large log files that you do not need historical data for.

## Further resources {#further-resources}

- [Grafana Alloy documentation](https://grafana.com/docs/alloy/latest/)
- [`loki.source.file` component reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.file/)
- [`loki.process` stages reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/)
- [Grafana Cloud access policies](https://grafana.com/docs/grafana-cloud/security-and-account-management/authentication-and-permissions/access-policies/)
- [LogQL query language](https://grafana.com/docs/loki/latest/query/)
- [Managing and deploying containerized applications](/docs/v2/platform/workloads/containers)
- [`mw container` CLI reference](/docs/v2/cli/reference/container/)
- [`mw stack` CLI reference](/docs/v2/cli/reference/stack/)
