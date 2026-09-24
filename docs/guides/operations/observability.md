---
title: Shipping logs and metrics to Grafana
sidebar_label: Observability
tags:
  - Containers
  - Logging
  - Metrics
  - Monitoring
description: |
  Learn how to ship the logs and metrics of workloads running in your mittwald
  project to Grafana Cloud or to a Loki and Prometheus of your own, using a
  Grafana Alloy container as a collector.
---

Containers running on the mittwald platform write their output to `stdout` and `stderr`. The platform captures that output and makes it available in mStudio and through the [`mw container logs`](/docs/v2/cli/reference/container/) command. This is convenient for ad-hoc debugging, but it does not cover everything you might need telemetry for: searching across several containers at once, keeping data for weeks or months, building dashboards, or getting alerted when errors start piling up or a queue runs full.

For that you need your own observability stack. This guide shows how to ship both **logs** and **metrics** there with a single collector: [Grafana Alloy](https://grafana.com/docs/alloy/latest/), Grafana's OpenTelemetry-based collector, which runs as a regular container in your project. The destination can be [Grafana Cloud](https://grafana.com/products/cloud/), the hosted version of the Grafana stack, or a [Loki](https://grafana.com/oss/loki/) and [Prometheus](https://prometheus.io/) you run yourself. Grafana Cloud offers a free tier that is sufficient for small setups; see the [Grafana Cloud pricing page](https://grafana.com/pricing/) for the current limits.

This is about the telemetry your own workloads produce. CPU and memory usage of your apps is already collected by the platform and can be queried through the [metrics API](/docs/v2/api/howtos/query-usage-metrics); you do not need a collector for that. For request-level profiling of PHP applications, see [Profiling PHP applications with Tideways](/docs/v2/guides/operations/tideways-profiling).

:::caution Logs are personal data

Application and access logs regularly contain personal data, such as IP addresses, user agents or user names. Before forwarding them to a third-party service, make sure you have a data processing agreement with Grafana Labs in place, and select an EU region when you create your Grafana Cloud stack.

:::

## How this works {#how-it-works}

One Alloy container collects both signals, each in its own way:

1. **Logs** come from the project filesystem. The platform writes the output of every container in your project to a log file below `/var/log/container/`. Alloy mounts that directory, tails the files, attaches labels derived from the file paths and pushes the lines to Loki.
2. **Metrics** are scraped over the network. Alloy calls the `/metrics` endpoints of the workloads in your project on an interval, and pushes the result to Prometheus with remote write. For workloads that do not speak Prometheus, such as databases, Alloy runs the matching exporter itself.

```mermaid
graph LR
    subgraph project["Your mittwald project"]
        WORKLOADS["Containers and apps"]
        LOGFILES[("/var/log/container/")]
        ALLOY["Grafana Alloy"]
    end

    subgraph backend["Grafana Cloud, or your own stack"]
        LOKI["Loki"]
        PROM["Prometheus"]
    end

    WORKLOADS -->|"stdout/stderr"| LOGFILES
    LOGFILES -->|"tailed"| ALLOY
    ALLOY -->|"scrapes /metrics"| WORKLOADS
    ALLOY -->|"logs"| LOKI
    ALLOY -->|"metrics"| PROM
```

Because Alloy reads logs from the project filesystem rather than from the containers themselves, a single Alloy container covers every container in the project, including ones you add later. Scraping is the part you extend as you add workloads.

The steps below build the setup up in that order: destinations first, then a configuration skeleton, then one step per signal. If you only care about one of the two signals, skip the other step; nothing later depends on it.

## Prerequisites {#prerequisites}

To follow this guide, you will need:

- A mittwald project on a plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- A place to send the data to: either a [Grafana Cloud](https://grafana.com/products/cloud/) account, or a Loki and Prometheus of your own (see [step 1](#destinations))
- The **mittwald CLI** (`mw`) installed and logged in (see the [CLI documentation](/docs/v2/cli/))
- SSH or SFTP access to your project, to place the configuration file (see [Uploading the configuration](#config-upload))

## Step 1: Preparing the destinations {#destinations}

Alloy writes logs to any Loki-compatible endpoint and metrics to any endpoint that accepts Prometheus remote write. Whichever option you choose, you end up with the same set of values: a push URL per signal, and credentials if the endpoint requires them. You will pass them into the container as environment variables in [step 5](#deploy).

The two destinations are independent. Sending logs to Grafana Cloud while keeping metrics in a Prometheus of your own is a perfectly valid combination.

### Option A: Grafana Cloud {#destinations-cloud}

Grafana Cloud authenticates writes with an **access policy token**. Access policies are managed in the Grafana Cloud portal, not in your Grafana instance. One policy and one token cover both signals.

1. Open `https://grafana.com/orgs/<your-org>/access-policies` in your browser, where `<your-org>` is the name of your Grafana Cloud organization.
2. Click **"New access policy"**.
3. Give the policy a name (for example `mittwald-telemetry`), select the stack it should apply to and grant it the following scopes:
   - `logs:write` for pushing logs into Loki
   - `metrics:write` for pushing metrics into Prometheus
4. Click **"Create access policy"**.
5. The new policy now appears in the list. Click **"Add token"** on it, give the token a name, optionally set an expiration date, and confirm.
6. Copy the token. It starts with `glc_` and is displayed only once.

Next, look up the endpoints and user IDs that go with the token:

1. Open `https://grafana.com/orgs/<your-org>/stacks` and select your stack.
2. The stack page lists its components. Open the details of the **Loki** instance and note its **URL** and the numeric **user ID**.
3. Do the same for the **Prometheus** instance.
4. The **Grafana** instance on the same page is where you will query both signals later on.

You should end up with these six values. The token serves as the password for both endpoints; the user names differ, because each instance has its own numeric ID:

```shell
# Loki (logs)
LOKI_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push
LOKI_USER=XXXXXXX
LOKI_PASSWORD=glc_XXX

# Prometheus (metrics)
PROM_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push
PROM_USER=XXXXXXX
PROM_PASSWORD=glc_XXX
```

:::note

Alloy needs the complete push endpoints, as shown above. Depending on where in the portal you read them, you may get the base URL of an instance instead. In that case, append `/loki/api/v1/push` to the Loki URL and `/api/prom/push` to the Prometheus URL yourself.

:::

:::caution

The access policy token allows writing into your Grafana Cloud stack. Keep it out of version control, and do not place it in a directory that is served by a web server. If you suspect that it has leaked, delete it in the access policy settings and add a new one.

:::

### Option B: Your own Loki and Prometheus {#destinations-self-hosted}

If you run the stack yourself, you need one push endpoint per signal.

**Loki** accepts writes at the base URL of the instance plus `/loki/api/v1/push`:

```shell
# Loki (logs)
LOKI_URL=https://loki.example.com/loki/api/v1/push

# Only if your Loki is behind basic authentication
LOKI_USER=alloy
LOKI_PASSWORD=your_secret_password
```

Two things are worth checking before you continue:

- **Authentication.** A bare Loki has no authentication of its own and is usually protected by a reverse proxy in front of it. Never expose an unauthenticated Loki to the internet: anyone who finds it can write into it and read everything it holds.
- **Multi-tenancy.** If your Loki runs with `auth_enabled: true`, every write has to carry a tenant ID. Alloy sends it for you if you set `tenant_id` in the configuration (see [Writing to your own endpoints](#config-self-hosted)).

**Prometheus** accepts remote write at `/api/v1/write`, but only if it was started with the `--web.enable-remote-write-receiver` flag:

```shell
# Prometheus (metrics)
PROM_URL=https://prometheus.example.com/api/v1/write

# Only if your Prometheus is behind basic authentication
PROM_USER=alloy
PROM_PASSWORD=your_secret_password
```

:::caution Prometheus rejects remote write by default

A stock Prometheus answers remote write requests with `404 remote write receiver needs to be enabled` until it is started with `--web.enable-remote-write-receiver`. This is a command-line flag, not a setting in `prometheus.yml`, so a configuration reload is not enough; the process has to be restarted.

Note also that the path differs from Grafana Cloud's: `/api/v1/write` for Prometheus, `/api/prom/push` for Grafana Cloud.

:::

Receivers built for ingest, such as [Mimir](https://grafana.com/oss/mimir/), [Thanos](https://thanos.io/) or [VictoriaMetrics](https://victoriametrics.com/), accept remote write without that flag and are the better choice if you collect from more than a handful of projects.

:::note Host your stack elsewhere

Loki and Prometheus are both available as container images, so it is technically possible to run them in the same mittwald project as the workloads they observe. We recommend against it: telemetry storage that shares the fate of the system it observes is of little use during exactly the incidents you keep it for. When the project is unavailable, so is the data that would explain why.

Run them somewhere separate: a different project, a different provider, or your own infrastructure.

:::

## Step 2: The base configuration {#config}

Alloy is configured with a `config.alloy` file. Create it locally first; you will upload it to the project filesystem [further down](#config-upload).

Start with the two endpoints. Everything you add in the following steps forwards into one of these two components, so they are the backbone of the file:

```hcl title="config.alloy"
// Grafana Alloy — telemetry collection for a mittwald project
//
// Credentials are read from the environment; see the container setup below.

// Where logs go
loki.write "default" {
  endpoint {
    url = sys.env("LOKI_URL")

    basic_auth {
      username = sys.env("LOKI_USER")
      password = sys.env("LOKI_PASSWORD")
    }
  }
}

// Where metrics go
prometheus.remote_write "default" {
  // Attached to every metric, so you can tell projects apart. This is the
  // same `host` label the log pipeline sets, which makes it possible to
  // line logs and metrics up in one dashboard.
  external_labels = {
    host = sys.env("ALLOY_HOSTNAME"),
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

If you only collect one of the two signals, leave the other component out, and remember to drop its environment variables from the container setup as well, as described in [step 5](#deploy-stack).

### Writing to your own endpoints {#config-self-hosted}

For endpoints of your own, only the two `endpoint` blocks change. Without authentication, drop `basic_auth` entirely:

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

The [`loki.write`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/) and [`prometheus.remote_write`](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.remote_write/) references document the remaining options, including bearer token authentication and `tls_config` for a private certificate authority.

### Uploading the configuration {#config-upload}

The container reads its configuration from the project filesystem, so the file has to be there before the container starts. This guide uses the directory `/files/alloy`, which is mounted into the container at `/etc/alloy`.

Your own mStudio account can connect to the project filesystem over SSH and SFTP. The user name for such a connection combines your mStudio email address with the short ID of the resource you want to connect to:

- `<your-email>@<project-short-id>@<ssh-host>` connects to the **project**, which is the one you need for `/files`
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

You will do this a few times while working through the next two steps, so it is worth keeping the file in a local directory next to your `docker-compose.yml`.

:::

## Step 3: Collecting container logs {#logs}

This pipeline tails the log files that the platform writes for every container in your project, and forwards them into the `loki.write` component from [step 2](#config). Append it to `config.alloy`:

```hcl title="config.alloy (continued)"
// Watches: /mnt/logs/container/<stack-id>/<service-name>.log
// Labels:  job="container-logs", stack=<stack-id>, container=<service-name>,
//          host=$ALLOY_HOSTNAME

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
```

The pipeline reads from top to bottom: `local.file_match` turns the glob into one target per log file, `discovery.relabel` attaches labels to those targets, `loki.source.file` tails them, and `loki.process` cleans up the label set before handing the lines to `loki.write`.

:::note Keep your label set small

Loki creates a separate stream for every combination of label values, and a large number of streams makes queries slower and, in Grafana Cloud, your bill higher. Labels that are stable and low in cardinality (`job`, `stack`, `container`, `host`) are a good fit. Never turn per-request values such as request IDs, URLs or user IDs into labels; query them with a [LogQL filter expression](https://grafana.com/docs/loki/latest/query/log_queries/) instead.

:::

### Checking where your log files actually are {#log-paths}

Before you deploy, it is worth confirming that the glob in the configuration matches. Open a shell in the project; the CLI assembles the connection for you:

```shellsession title="Local shell session"
user@local $ mw project ssh
```

Then list the log directory:

```shellsession title="SSH shell session"
user@ssh $ ls -l /var/log/container/
```

You should see one directory per container stack, each containing one `.log` file per service. If your layout differs, adjust the `__path__` glob and the two relabel regexes in `config.alloy` accordingly.

## Step 4: Collecting metrics {#metrics}

Metrics work the other way around: instead of reading files, Alloy calls your workloads over the network and forwards what it gets to the `prometheus.remote_write` component from [step 2](#config).

### Scraping your own workloads {#metrics-scrape}

Anything in your project that exposes a Prometheus endpoint can be scraped directly. Two properties of the platform decide how the target is spelled:

- The **internal DNS name** of a container is its service key in the compose file, or the slugified name if you created it in the UI. A container named `My app` is reachable as `my-app`. See [network connectivity between containers and apps](/docs/v2/platform/workloads/containers#stack-network-connectivity).
- The **port has to be published** in the container's `ports` declaration. An unpublished port is not reachable from another container, not even inside the same project. Publishing it does not expose anything to the internet: the platform's network policies keep it within the project.

With that, a scrape target is simply `<service-name>:<port>`:

```hcl title="config.alloy (continued)"
prometheus.scrape "workloads" {
  targets = [
    {
      "__address__" = "my-app:8080",
      "container"   = "my-app",
    },
    {
      // Non-default metrics path, if your app uses one
      "__address__"      = "worker:9100",
      "__metrics_path__" = "/internal/metrics",
      "container"        = "worker",
    },
  ]

  forward_to      = [prometheus.remote_write.default.receiver]
  job_name        = "workloads"
  scrape_interval = "60s"
}
```

The extra `container` label is worth setting: it is the same label the log pipeline attaches, so a dashboard can put the logs and the metrics of one workload side by side. `metrics_path` defaults to `/metrics`, and `scrape_interval` to `60s`.

:::note Scrape interval and cost

Every scrape of every series is a data point. Halving the interval doubles the ingest volume, and in Grafana Cloud the number of active series and the data points per minute are what you pay for. `60s` is a good default; go lower only for the handful of metrics where you actually need the resolution.

:::

:::caution Managed apps are a special case

PHP, Node.js and Python apps are reachable from a container at `<app-short-id>:8080`, but the request is only routed to the app if its `Host` header matches one of the app's virtual hosts, the same detail that makes the [caching proxy setup](/docs/v2/platform/workloads/varnish) rewrite that header. Scraping a managed app directly is therefore brittle.

If your app exposes metrics, the more reliable route is to scrape it through a virtual host of its own, as `https://<hostname>/metrics`. Keep in mind that a managed app serves only one port, so that path is publicly reachable: protect it with authentication and pass the credentials to Alloy with a `basic_auth` block in `prometheus.scrape`.

:::

### Exporters for workloads that do not speak Prometheus {#metrics-exporters}

Databases and similar services have no `/metrics` endpoint of their own. Alloy bundles the common Prometheus exporters, so you do not need a sidecar container for them: the exporter runs inside Alloy, and exposes its targets to `prometheus.scrape`.

A MariaDB or MySQL container is reachable inside the project as `mysql://mariadb:3306` (see the [MariaDB guide](/docs/v2/platform/databases/mariadb)). Wiring an exporter to it looks like this:

```hcl title="config.alloy (continued)"
prometheus.exporter.mysql "mariadb" {
  data_source_name = sys.env("MYSQL_EXPORTER_DSN")
}

prometheus.scrape "mariadb" {
  targets         = prometheus.exporter.mysql.mariadb.targets
  forward_to      = [prometheus.remote_write.default.receiver]
  job_name        = "mariadb"
  scrape_interval = "60s"
}
```

with the data source name in the `.env` file rather than in the configuration:

```shell title=".env"
MYSQL_EXPORTER_DSN=exporter:your_secret_password@(mariadb:3306)/
```

The other exporters follow the same shape. [`prometheus.exporter.postgres`](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.exporter.postgres/) takes a list in `data_source_names` (`postgresql://exporter:password@postgresql:5432/mydb?sslmode=disable`), and [`prometheus.exporter.redis`](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.exporter.redis/) takes `redis_addr` plus optional `redis_user` and `redis_password`. The full list is in the [Alloy component reference](https://grafana.com/docs/alloy/latest/reference/components/).

:::caution Give the exporter its own database user

Do not reuse the root or application credentials. Create a dedicated user with the least privileges the exporter needs. For MySQL and MariaDB, that is `PROCESS`, `REPLICATION CLIENT` and `SELECT`:

```sql
CREATE USER 'exporter'@'%' IDENTIFIED BY 'your_secret_password' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
```

:::

:::note Managed Redis is not a container

The [Redis documentation](/docs/v2/platform/databases/redis) describes the _managed_ Redis database, which is not part of your container stack. Its host name and port come from mStudio or the API, not from a service name; use those in `redis_addr`.

:::

### Alloy's own logs and metrics {#metrics-self}

The collector is a workload too, and it is the one you will want to look at when data stops arriving. This block sends Alloy's own log output to Loki and its internal metrics (sent and dropped bytes, per-file read offsets, write errors) to Prometheus:

```hcl title="config.alloy (continued)"
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

// Alloy's own metrics
prometheus.exporter.self "alloy" {}

prometheus.scrape "alloy" {
  targets         = prometheus.exporter.self.alloy.targets
  forward_to      = [prometheus.remote_write.default.receiver]
  job_name        = "integrations/alloy"
  scrape_interval = "60s"
}
```

## Step 5: Deploying the collector {#deploy}

The container uses the [`grafana/alloy`](https://hub.docker.com/r/grafana/alloy) image from Docker Hub and needs three volumes:

| Volume                               | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `/files/alloy` → `/etc/alloy`        | The configuration file from [step 2](#config)                           |
| `/var/log` → `/mnt/logs`             | The container log files                                                 |
| `alloy-data` → `/var/lib/alloy/data` | Alloy's positions file, so it resumes where it left off after a restart |

:::caution Persist the data volume

Without the `alloy-data` volume, Alloy loses track of how far it has read into each log file. After every restart it would start from the beginning again, which duplicates log lines in Loki and can produce a sizeable backfill that, in Grafana Cloud, is expensive.

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
      MYSQL_EXPORTER_DSN: ${MYSQL_EXPORTER_DSN}
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

Next to it, create a `.env` file with the values from [step 1](#destinations), plus anything the exporters need:

```shell title=".env"
# Label value identifying this project in Loki and Prometheus
ALLOY_HOSTNAME=my-project

# Logs
LOKI_URL=https://logs-prod-XXX.grafana.net/loki/api/v1/push
LOKI_USER=XXXXXXX
LOKI_PASSWORD=glc_XXX

# Metrics
PROM_URL=https://prometheus-prod-XX-prod-REGION.grafana.net/api/prom/push
PROM_USER=XXXXXXX
PROM_PASSWORD=glc_XXX

# Exporters
MYSQL_EXPORTER_DSN=exporter:your_secret_password@(mariadb:3306)/
```

In Grafana Cloud, `LOKI_PASSWORD` and `PROM_PASSWORD` both hold the same access policy token; the user names differ, because each instance has its own numeric ID.

Whenever you leave a variable out of the `.env` file, remove the matching line from the `environment` section of the compose file as well. Otherwise it is passed into the container as an empty string, and Alloy fails against an endpoint it thinks is configured. This applies to `LOKI_USER` and `LOKI_PASSWORD` for endpoints without authentication (see [Writing to your own endpoints](#config-self-hosted)), to the `PROM_*` variables if you collect no metrics, and to `MYSQL_EXPORTER_DSN` if you run no exporter.

Then deploy the stack:

```shellsession title="Local shell session"
user@local $ mw stack deploy
```

This command reads `docker-compose.yml` from the current directory, resolves the variables from `.env` (use `--env-file` to point it at a different file) and deploys the result to your default stack.

:::caution

`.env` contains credentials. Add it to your `.gitignore`, and commit only the `docker-compose.yml`.

:::

:::note Pinning the image version

The example pins the image to a specific version. If you prefer to track the `latest` tag instead, remember that mutable tags are not re-pulled automatically: use `mw container recreate --pull alloy`, or set up a [recurring update schedule](/docs/v2/platform/workloads/containers#update-schedule) for the stack.

:::

### Other ways to create the container {#deploy-alternatives}

The stack above can be created just as well in the mStudio UI (**"Containers"** → **"Create container"**) or with a single [`mw container run`](/docs/v2/cli/reference/container/) command. Both need the same ingredients: the image `grafana/alloy:v1.19.2`, the command `run --server.http.listen-addr=0.0.0.0:12345 --storage.path=/var/lib/alloy/data /etc/alloy/config.alloy`, the three volumes from the table above, the environment variables from the `.env` file, and port `12345` if you want to reach the [Alloy UI](#alloy-ui). With `mw container run`, add `--create-volumes` so that the named `alloy-data` volume is created along with the container.

For this setup, the compose file is usually the better choice: it keeps the credentials out of your shell history, and re-deploying it after a configuration change is a single command.

## Step 6: Verifying the setup {#verification}

First, check that the container started and is not complaining about its configuration:

```shellsession title="Local shell session"
user@local $ mw container logs alloy
```

A healthy start logs a few `level=info` lines and then goes quiet. Errors about a missing configuration file, an unreachable endpoint or a failing scrape target show up here immediately.

Then query both signals in Grafana. Go to **Explore**, select the Loki data source and run:

```logql
{job="container-logs"}
```

You should see the output of your containers, labelled with `stack`, `container` and `host`. To narrow it down to a single container:

```logql
{job="container-logs", container="my-app"}
```

Switch to the Prometheus data source for the metrics. The `up` metric is the quickest check, because Alloy generates it for every scrape target: `1` means the last scrape succeeded, `0` that the target was unreachable:

```promql
up{host="my-project"}
```

Alloy's own metrics are a good second look, for example the number of log entries it has sent:

```promql
sum by (job) (rate(loki_write_sent_entries_total[5m]))
```

The first data usually appears within a minute. If nothing shows up, see [Troubleshooting](#troubleshooting) below.

### Inspecting the Alloy UI {#alloy-ui}

Alloy ships a web UI that shows every component in the pipeline, its health and the targets it has discovered, which makes it the fastest way to tell whether your glob matches any files and whether a scrape target answers at all. Publishing port `12345` only makes it reachable from within your project, so forward it to your local machine to have a look:

```shellsession title="Local shell session"
user@local $ mw container port-forward alloy 12345
```

The UI is then available at `http://localhost:12345`.

:::caution

Alloy's web UI has no authentication of its own. Do not connect a domain to port `12345`; use port forwarding when you need access. Publishing the port within the project is not a problem: the platform's network policies prevent access from other projects or from the internet.

:::

## Extending the collector {#extending}

### Other log files {#other-logs}

The `/var/log` mount contains more than the container logs. PHP apps, for example, write their errors to `/var/log/php_errors.log`. Have a look at what your project keeps there:

```shellsession title="SSH shell session"
user@ssh $ ls -l /var/log/
```

To ship those files as well, add a second log pipeline to `config.alloy`:

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

In this pipeline, the `filename` label is worth keeping: unlike in the container pipeline, it is what tells the individual files apart, and there are only a handful of them. For log files that live somewhere else in the project filesystem, mount that directory into the container as well and point another `__path__` at it.

If your containers emit structured logs, it is worth parsing them in `loki.process`: a [`stage.json`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagejson) block extracts fields from JSON lines, and [`stage.timestamp`](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.process/#stagetimestamp) makes Loki use the application's own timestamp instead of the time the line was read.

### Traces {#traces}

Traces are the third signal Alloy handles, and the setup stays the same container: [`otelcol.receiver.otlp`](https://grafana.com/docs/alloy/latest/reference/components/otelcol/otelcol.receiver.otlp/) accepts OTLP data from your instrumented applications on ports `4317` (gRPC) and `4318` (HTTP), and [`otelcol.exporter.otlphttp`](https://grafana.com/docs/alloy/latest/reference/components/otelcol/otelcol.exporter.otlphttp/) forwards it, with credentials from an `otelcol.auth.basic` component. The destination is a Tempo of your own, or Grafana Cloud's OTLP gateway at `https://otlp-gateway-<region>.grafana.net/otlp`, whose connection details you find under the **OpenTelemetry** tile in the Cloud portal. Publish the two ports in the compose file so that the other workloads in your project can reach the collector.

Instrumenting your applications is the larger part of that job and out of scope here; see [Collect OpenTelemetry data](https://grafana.com/docs/alloy/latest/collect/opentelemetry-data/) in the Alloy documentation.

## Troubleshooting {#troubleshooting}

### The container does not start {#troubleshooting-start}

- Check `mw container logs alloy` for the exact error. A message about a missing or unreadable configuration file means that either the upload in [step 2](#config-upload) did not end up at `/files/alloy/config.alloy`, or the volume is not mounted at `/etc/alloy`.
- Syntax errors in `config.alloy` also abort the start and are reported with a line number.
- A component that references one that does not exist, such as a `forward_to` pointing at a receiver you left out, is reported the same way. Every pipeline in this guide forwards into `loki.write.default` or `prometheus.remote_write.default`, so both have to be present in the file.

### No logs arrive in Loki {#troubleshooting-no-logs}

- Open the [Alloy UI](#alloy-ui) and check the `local.file_match.container_logs` component. If it lists no targets, the glob does not match anything; verify the actual log paths as described in [Checking where your log files actually are](#log-paths).
- `401` or `403` responses point at the credentials: in Grafana Cloud, make sure `LOKI_PASSWORD` is the token itself (starting with `glc_`), not the name of the access policy, and that `LOKI_USER` is the numeric user ID of the Loki instance.
- A `404` usually means the URL is missing the `/loki/api/v1/push` suffix.
- On a self-hosted Loki, a `401` with the message `no org id` means that the instance runs in multi-tenant mode and expects a `tenant_id` (see [Writing to your own endpoints](#config-self-hosted)).
- Permission errors while reading the log files are unlikely: the log files are owned by root, and the Alloy image runs as root by default. They can occur if you replace the image with one of your own that drops privileges.

### Log lines appear twice {#troubleshooting-duplicates}

- This is the classic symptom of a missing positions file: without the `alloy-data` volume, Alloy re-reads every file from the start each time the container is recreated. Check that the volume exists and is mounted at the path passed to `--storage.path`.

### No metrics arrive, or a target stays down {#troubleshooting-no-metrics}

- Query `up` in Grafana. A target with value `0` was unreachable; a target that does not appear at all was never configured, or its component failed to load.
- The most common cause of an unreachable target is a port that is not published. Check the `ports` declaration of the container you are scraping: inside the project, only published ports are reachable.
- Check the spelling of the internal DNS name. It is the compose service key, or the slugified container name from the UI, not the description you typed.
- If the scrape succeeds but nothing is stored, look at the remote write side: a `404` from a self-hosted Prometheus usually means `--web.enable-remote-write-receiver` is missing or the URL uses the wrong push path (`/api/v1/write` rather than Grafana Cloud's `/api/prom/push`).
- For an exporter, the Alloy UI shows the component's health with the connection error attached. A failing MySQL exporter is almost always a wrong data source name, a missing grant, or a database that is not reachable under that service name.

### Queries are slow, or the bill is higher than expected {#troubleshooting-cardinality}

- Look at the number of active log streams and active metric series. Too many of them almost always come from high-cardinality labels; keep the label set to the stable ones and filter on everything else in LogQL or PromQL.
- Check your scrape intervals. An interval of a few seconds across many targets multiplies the data points per minute you are billed for.
- Use `tail_from_end = true` when you add new, large log files that you do not need historical data for.

## Further resources {#further-resources}

- [Grafana Alloy documentation](https://grafana.com/docs/alloy/latest/)
- [Alloy component reference](https://grafana.com/docs/alloy/latest/reference/components/)
- [`loki.source.file` component reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.file/)
- [`loki.write` component reference](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.write/)
- [`prometheus.scrape` component reference](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.scrape/)
- [`prometheus.remote_write` component reference](https://grafana.com/docs/alloy/latest/reference/components/prometheus/prometheus.remote_write/)
- [Grafana Cloud access policies](https://grafana.com/docs/grafana-cloud/security-and-account-management/authentication-and-permissions/access-policies/)
- [LogQL query language](https://grafana.com/docs/loki/latest/query/)
- [PromQL query language](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Querying CPU and RAM usage metrics over the API](/docs/v2/api/howtos/query-usage-metrics)
- [Managing and deploying containerized applications](/docs/v2/platform/workloads/containers)
- [`mw container` CLI reference](/docs/v2/cli/reference/container/)
- [`mw stack` CLI reference](/docs/v2/cli/reference/stack/)
