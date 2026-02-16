---
sidebar_label: Listmonk
description: Learn how to set up and run Listmonk in a containerized environment
---

# Running Listmonk

## Introduction

Listmonk is a self-hosted newsletter and mailing list manager. It is a standalone, self-contained application that you can deploy on your own server. It offers a modern web interface for managing subscribers, creating campaigns, and tracking metrics. Listmonk is designed to be fast, efficient, and feature-rich, making it an excellent open-source alternative to commercial email marketing platforms.

> listmonk is a standalone, self-hosted, newsletter and mailing list manager. It is fast, feature-rich and packed into a single binary. It uses a PostgreSQL (⩾ v12) database as its data store.  
> – [Listmonk Documentation](https://listmonk.app/docs/)

## Prerequisites

To run Listmonk, you will need:

- Access to a mittwald mStudio project
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- A PostgreSQL database (version 12 or higher)

:::note

You can create a PostgreSQL database using a separate container. For instructions on setting up PostgreSQL in a container, refer to the [PostgreSQL guide](../databases/postgresql).

:::

## How do I start the container?

We use the `listmonk/listmonk` image from [Docker Hub](https://hub.docker.com/r/listmonk/listmonk) for the container.

### Using Terraform (Recommended)

The most convenient way to provision a production-ready Listmonk instance is using [Terraform](/docs/v2/guides/deployment/terraform). The following example shows how you can deploy Listmonk along with a PostgreSQL database as a container stack:

```hcl
data "mittwald_container_image" "postgres" {
  name = "postgres:17"
}

data "mittwald_container_image" "listmonk" {
  name = "listmonk/listmonk:latest"
}

variable "project_id" {
  type = string
}

resource "random_password" "postgres_password" {
  length  = 24
  special = true
}

resource "mittwald_container_stack" "listmonk" {
  project_id    = var.project_id
  default_stack = true

  containers = {
    database = {
      description = "PostgreSQL database for Listmonk"
      image       = data.mittwald_container_image.postgres.name

      entrypoint = data.mittwald_container_image.postgres.entrypoint
      command    = data.mittwald_container_image.postgres.command

      environment = {
        POSTGRES_DB       = "listmonk"
        POSTGRES_USER     = "listmonk"
        POSTGRES_PASSWORD = random_password.postgres_password.result
      }

      volumes = [
        {
          volume     = "database"
          mount_path = "/var/lib/postgresql/data"
        }
      ]

      ports = [
        {
          container_port = 5432
          protocol       = "tcp"
        }
      ]
    }

    listmonk = {
      description = "Listmonk newsletter application"
      image       = data.mittwald_container_image.listmonk.name

      entrypoint = data.mittwald_container_image.listmonk.entrypoint
      command    = ["sh", "-c", "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"]

      environment = {
        LISTMONK_app__address = "0.0.0.0:9000"
        LISTMONK_db__host     = "database"
        LISTMONK_db__port     = "5432"
        LISTMONK_db__user     = "listmonk"
        LISTMONK_db__password = random_password.postgres_password.result
        LISTMONK_db__database = "listmonk"
      }

      volumes = [
        {
          volume     = "uploads"
          mount_path = "/listmonk/uploads"
        }
      ]

      ports = [
        {
          container_port = 9000
          public_port    = 9000
          protocol       = "tcp"
        }
      ]
    }
  }

  volumes = {
    database = {}
    uploads  = {}
  }
}
```

:::note

This configuration uses the `--install --idempotent` flag, which ensures that database installation happens only once on an empty database during the first startup. The `--upgrade` flag automatically runs any database migrations when a new image is pulled.

:::

### Using the mStudio UI

In mStudio, go to your project and select **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description – this is a free text field used to identify the container. For example, enter **"Listmonk"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `listmonk/listmonk` and confirm with **"Next"**.

#### Entrypoint and Command {#ui-entrypoint-and-command}

Configure Listmonk to start with automatic database initialization and upgrades:

- **Entrypoint:** No changes required
- **Command:** Select **"Custom"** and enter `sh -c "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"`

:::note

This command uses the `--install --idempotent` flag, which ensures that database installation happens only once on an empty database during the first startup. The `--upgrade` flag automatically runs any database migrations when the container is updated. This approach eliminates the need to manually initialize the database or change the command after the first run.

:::

#### Volumes {#ui-volumes}

To persist uploaded files and media, add a volume:

- **Path in container:** `/listmonk/uploads`

:::caution

Without this volume, any files uploaded through Listmonk (such as images for campaigns) will be lost when the container is recreated or restarted.

:::

#### Environment Variables {#ui-environment-variables}

Configure Listmonk to connect to your PostgreSQL database. Click on **"Text input"** and enter the following environment variables:

```
# Application settings
LISTMONK_app__address=0.0.0.0:9000

# Database configuration
LISTMONK_db__host=<DB_HOST>
LISTMONK_db__port=5432
LISTMONK_db__user=<DB_USER>
LISTMONK_db__password=<DB_PASSWORD>
LISTMONK_db__database=<DB_NAME>
```

Replace the placeholders (`<DB_HOST>`, `<DB_USER>`, `<DB_PASSWORD>`, `<DB_NAME>`) with your PostgreSQL database connection details.

:::caution

Make sure to use a secure password for your database connection. The database password will be stored in plain text in the container configuration.

:::

Once you've entered all the environment variables, click **"Next"**. In the final dialog, you'll be asked for the **port** – you can leave this unchanged at `9000`. Click **"Create container"** to create and start the container.

### Alternative: Using the `mw container run` command

You can also use the `mw container run` command to directly create and start a Listmonk container from the command line. This approach is similar to using the Docker CLI and allows you to specify all container parameters in a single command.

```shellsession
user@local $ mw container run \
  --name listmonk \
  --description "Listmonk Newsletter Manager" \
  --publish 9000:9000 \
  --env "LISTMONK_app__address=0.0.0.0:9000" \
  --env "LISTMONK_db__host=<DB_HOST>" \
  --env "LISTMONK_db__port=5432" \
  --env "LISTMONK_db__user=<DB_USER>" \
  --env "LISTMONK_db__password=<DB_PASSWORD>" \
  --env "LISTMONK_db__database=<DB_NAME>" \
  --volume "listmonk-uploads:/listmonk/uploads" \
  --create-volumes \
  -- \
  listmonk/listmonk \
  sh -c "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''"
```

Make sure to replace the placeholder values with your actual database configuration details. After creating the container, you'll still need to assign a domain to it.

### Alternative: Using the `mw stack deploy` command

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. This approach allows you to define your container configuration in a YAML file and deploy it with a single command.

First, create a `docker-compose.yml` file with the following content:

```yaml
services:
  listmonk:
    image: listmonk/listmonk
    command:
      [
        "sh",
        "-c",
        "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''",
      ]
    ports:
      - "9000:9000"
    volumes:
      - "listmonk-uploads:/listmonk/uploads"
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: "<DB_HOST>"
      LISTMONK_db__port: "5432"
      LISTMONK_db__user: "<DB_USER>"
      LISTMONK_db__password: "<DB_PASSWORD>"
      LISTMONK_db__database: "<DB_NAME>"

volumes:
  listmonk-uploads: {}
```

Make sure to replace the placeholder values with your actual database configuration details.

Then, deploy the container using the `mw stack deploy` command:

```shellsession
user@local $ mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack.

## Assign a Domain {#assign-domain}

To make Listmonk accessible from the public internet, you need to connect it to a domain:

1. In mStudio, navigate to **"Domains"** in the left sidebar
2. Select the domain you want to use (e.g., `listmonk.example.com`)
3. Under **"Set domain target"**, select **"Container"**
4. Choose your Listmonk container from the dropdown menu
5. The port will be automatically set to `9000`
6. Click the green **"Save"** button to apply the changes

After a few moments, you should be able to access Listmonk at your configured domain.

:::danger

**IMPORTANT: Secure your installation immediately!**

Upon first access to the Listmonk web interface, you will be prompted to create an administrator account. **You must do this immediately** after connecting the domain, before anyone else can access your instance.

Until you create an administrator account, your Listmonk installation is completely unsecured and anyone who discovers the URL can set up the admin account and gain full control over your newsletter system, including access to all subscriber data.

Make sure to:

- Access the web interface immediately after domain assignment
- Use a strong, unique password for the administrator account
- Complete the setup process without delay

:::

## Operation

### Database Setup {#database-setup}

If you're deploying Listmonk alongside a PostgreSQL database in a container stack, you can use the following example to deploy both containers together:

```yaml
services:
  database:
    image: postgres:17
    ports:
      - "5432:5432"
    volumes:
      - "listmonk-database:/var/lib/postgresql/data"
    environment:
      POSTGRES_DB: "listmonk"
      POSTGRES_USER: "listmonk"
      POSTGRES_PASSWORD: "<SECURE_PASSWORD>"

  listmonk:
    image: listmonk/listmonk
    command:
      [
        "sh",
        "-c",
        "./listmonk --install --idempotent --yes --config '' && ./listmonk --upgrade --yes --config '' && ./listmonk --config ''",
      ]
    ports:
      - "9000:9000"
    volumes:
      - "listmonk-uploads:/listmonk/uploads"
    environment:
      LISTMONK_app__address: "0.0.0.0:9000"
      LISTMONK_db__host: "database"
      LISTMONK_db__port: "5432"
      LISTMONK_db__user: "listmonk"
      LISTMONK_db__password: "<SECURE_PASSWORD>"
      LISTMONK_db__database: "listmonk"
    depends_on:
      - database

volumes:
  listmonk-database: {}
  listmonk-uploads: {}
```

:::caution

Replace `<SECURE_PASSWORD>` with a strong, randomly generated password. Do not use default passwords in production environments.

:::

### Backups {#backups}

Your Listmonk data is stored in two places:

1. **PostgreSQL database**: Contains subscribers, campaigns, and settings
2. **Uploads volume**: Contains media files uploaded through the web interface

Both are included in the regular project backups and can be restored if needed. For additional protection, consider setting up automated database backups using PostgreSQL's built-in tools.

## Further Resources

- [Official Listmonk Website](https://listmonk.app/)
- [Listmonk Documentation](https://listmonk.app/docs/)
- [Listmonk on Docker Hub](https://hub.docker.com/r/listmonk/listmonk)
- [Listmonk GitHub Repository](https://github.com/knadh/listmonk)
- [Container Workloads Documentation](/docs/v2/platform/workloads/containers)
