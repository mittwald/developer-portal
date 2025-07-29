---
sidebar_label: Directus
description: Learn how to run the open-source platform Directus in a containerized environment and connect it to a database.
---

# Running Directus

## Introduction

Directus is an open-source data platform that provides an intuitive no-code and low-code interface for managing databases. It acts as an API wrapper for SQL databases and allows content to be served through an automatically generated REST and GraphQL API. With Directus, users can create data models, manage user permissions, and optimize workflows—all without complex backend development. The platform is suitable for both developers and non-developers and is often used for CMS, data-driven applications, and headless architectures.

> Directus is a backend for building projects. Connect it to your database, asset storage, and external services, and you instantly get extensive developer tools (Data Engine) and a comprehensive web application (Data Studio) for working with your data. Granular and powerful access control means that users can only see, interact with, and create the data that corresponds to their role, as used by the Engine and the Studio.  
> – [Directus Documentation](https://directus.io/docs/getting-started/overview)

## Prerequisites

For optimal production performance, it is strongly recommended to use a managed MySQL database instead of SQLite. A managed database offers several advantages like improved performance and scalability and automatic backups and maintenance.

You can create a managed MySQL database directly in the mittwald mStudio UI before setting up Directus. Alternatively, you can use CLI commands like `mw database mysql create`.

The connection details provided after creation will be needed for configuring Directus.

## How do I start the container?

We use the `directus/directus` image from [Docker Hub](https://hub.docker.com/r/directus/directus) for the container.

### Using the mStudio UI

In mStudio, go to your project and select **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description – this is a free text field used to identify the container. For example, enter **"Directus"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `directus/directus` and confirm with **"Next"**.

#### Entrypoint and Command

- **Entrypoint:** No changes required
- **Command:** No changes required

#### Volumes

For persistent data, you store various paths as volumes. These can be set optionally, depending on your setup:

- `/directus/uploads`
- `/directus/extensions`
- `/directus/templates`
- `/directus/database` (only when **not** using a managed MySQL database, or a database running within another container)

:::note  
You can add new volumes via the mStudio UI. Each path above should be set as a mount point.  
:::

#### Environment Variables

For connecting to a mittwald managed MySQL database, you need to set several environment variables. These include authentication parameters and database connection details.

For a proper setup with a mittwald managed MySQL database, set the following parameters:

```
# Admin account configuration
ADMIN_EMAIL=user@domain.example
ADMIN_PASSWORD=your_secret_password
SECRET=your_secret_value

# MySQL database configuration
DB_CLIENT=mysql
DB_HOST=mysql-XXXXXX.pg-YYYYYY.db.project.host
DB_PORT=3306
DB_DATABASE=mysql_XXXXXX
DB_USER=dbu_XXXXXX
DB_PASSWORD=your_database_password
```

Once you've entered all the environment variables, click **"Next"**. In the final dialog, you'll be asked for the **port** – you can leave this unchanged. Click **"Create container"** to create and start the container.

### Alternative: Using the `mw container run` command

You can also use the `mw container run` command to directly create and start a Directus container from the command line. This approach is similar to using the Docker CLI and allows you to specify all container parameters in a single command.

```bash
mw container run \
  --name directus \
  --description "Directus Headless CMS" \
  --publish 8055:8055 \
  --env "ADMIN_EMAIL=user@domain.example" \
  --env "ADMIN_PASSWORD=your_secret_password" \
  --env "SECRET=your_secret_value" \
  --env "DB_CLIENT=mysql" \
  --env "DB_HOST=mysql-XXXXXX.pg-YYYYYY.db.project.host" \
  --env "DB_PORT=3306" \
  --env "DB_DATABASE=mysql_XXXXXX" \
  --env "DB_USER=dbu_XXXXXX" \
  --env "DB_PASSWORD=your_database_password" \
  --volume "uploads:/directus/uploads" \
  --volume "extensions:/directus/extensions" \
  --volume "templates:/directus/templates" \
  directus/directus
```

Make sure to replace the placeholder values with your actual configuration details. After creating the container, you'll still need to assign a domain to it.

### Alternative: Using the `mw stack deploy` command

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. This approach allows you to define your container configuration in a YAML file and deploy it with a single command.

First, create a `docker-compose.yml` file with the following content:

```yaml
services:
  directus:
    image: directus/directus
    ports:
      - 8055:8055
    volumes:
      - "uploads:/directus/uploads"
      - "extensions:/directus/extensions"
      - "templates:/directus/templates"
    environment:
      # Admin account configuration
      ADMIN_EMAIL: "user@domain.example"
      ADMIN_PASSWORD: "your_secret_password"
      SECRET: "your_secret_value"

      # MySQL database configuration
      DB_CLIENT: "mysql"
      DB_HOST: "mysql-XXXXXX.pg-YYYYYY.db.project.host"
      DB_PORT: "3306"
      DB_DATABASE: "mysql_XXXXXX"
      DB_USER: "dbu_XXXXXX"
      DB_PASSWORD: "your_database_password"
volumes:
  uploads: {}
  extensions: {}
  templates: {}
```

Make sure to replace the placeholder values with your actual configuration details. Then, deploy the container using the `mw stack deploy` command:

```bash
mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack.

## Operation

To make your directus backend reachable from the public internet, it needs to be connected to a domain. After that, you can reach the Directus backend via `https://<domain>/admin`.

As part of the project backup, the data from your volumes is secured and can be restored if needed.
