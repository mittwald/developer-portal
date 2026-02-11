---
applyTo: "docs/guides/apps/*.md,docs/guides/apps/*.mdx,docs/platform/databases/*.md,docs/platform/databases/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/guides/apps/*.md,i18n/de/docusaurus-plugin-content-docs/**/guides/apps/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/platform/databases/*.md,i18n/de/docusaurus-plugin-content-docs/**/platform/databases/*.mdx"
---

These guidelines apply specifically to app and database deployment guides in the `docs/guides/apps` and `docs/platform/databases` directories. Follow the general documentation guidelines in `DOCS.instructions.md` as well.

## Front Matter

Deployment guides must include the following front matter properties:

```yaml
---
sidebar_label: App Name
description: Learn how to set up and run [App Name] in a containerized environment
---
```

- **sidebar_label**: Use the application name (e.g., "Directus", "Collabora") or a short action phrase for migration guides (e.g., "Migrate Node.js App to Container")
- **description**: Start with "Learn how to..." or "Step-by-step guide for..." followed by the main action
- Do NOT include a `title` field in front matter; use a markdown H1 heading instead

## Document Structure

App deployment guides should follow this structure:

### 1. Title (H1)

Use "Running [App Name]" for standard deployment guides or a descriptive title for migration/specialized guides:

```markdown
# Running Directus

# Running a Node.js App in a Container – Migration Guide
```

### 2. Introduction Section

Provide a brief explanation of what the application does:

```markdown
## Introduction

[App Name] is [brief description of what it does and its main use cases].
```

Include a blockquote from official documentation when available:

```markdown
> [Quote from official documentation]
> – [Official Documentation Link](https://...)
```

### 3. Prerequisites/Requirements Section

List what the reader needs before starting:

```markdown
## Prerequisites

- Access to a mittwald mStudio project
- A hosting plan that supports [containerized workloads](/docs/v2/platform/workloads/containers)
- [Other specific requirements]
```

Or use "Requirements" as the heading with a numbered list for more complex setups.

### 4. Container Deployment Section

Use "How do I start the container?" as the main section heading. Document deployment methods in this order:

1. **Terraform** (if a module exists) - Mark as "(Recommended)"
2. **mStudio UI** - Detailed walkthrough
3. **CLI `mw container run`** - Mark as "Alternative"
4. **CLI `mw stack deploy`** - Mark as "Alternative"

```markdown
## How do I start the container?

### Using Terraform (Recommended)

[Terraform example if available]

### Using the mStudio UI

[UI walkthrough]

### Alternative: Using the `mw container run` command

[CLI example]

### Alternative: Using the `mw stack deploy` command

[Docker Compose example]
```

### 5. Post-Deployment Sections

Include sections for:

- Domain assignment ("Assign Domain")
- Integration with other services if applicable
- Operation notes

### 6. Troubleshooting Section (Optional)

For migration guides or complex setups, include common problems and solutions.

### 7. Further Resources Section

Link to relevant external documentation:

```markdown
## Further Resources

- [Official Documentation](https://...)
- [Docker Hub](https://hub.docker.com/r/...)
- [Container Workloads Documentation](/docs/v2/platform/workloads/containers)
```

## UI Walkthrough Format

When documenting the mStudio UI workflow, use this pattern:

```markdown
### Using the mStudio UI

In mStudio, go to your project and select **"Create container"**. A guided dialog will open to assist you with the container setup.

First, enter a description – this is a free text field used to identify the container. For example, enter **"[App Name]"** and click **"Next"**.

Next, you'll be asked for the image name. Enter `[image/name]` and confirm with **"Next"**.

#### Entrypoint and Command

- **Entrypoint:** [Instructions or "No changes required"]
- **Command:** [Instructions or "No changes required"]

#### Volumes

[Volume configuration instructions]

#### Environment Variables

[Environment variable instructions with code block]

Once you've entered all the environment variables, click **"Next"**. In the final dialog, you'll be asked for the **port** – you can leave this unchanged. Click **"Create container"** to create and start the container.
```

Key formatting rules:

- Use **bold** for UI element names and button labels
- Use subsections (H4) for Entrypoint, Volumes, Environment Variables
- Include notes about optional vs required configurations

## Environment Variables Format

Document environment variables in code blocks with comments grouping them by purpose:

```markdown

```

# Admin account configuration

ADMIN_EMAIL=user@domain.example
ADMIN_PASSWORD=your_secret_password

# Database configuration

DB_HOST=mysql-XXXXXX.pg-YYYYYY.db.project.host
DB_PORT=3306

```

```

- Use placeholder values that are clearly recognizable (e.g., `your_secret_password`, `XXXXXX`)
- Group related variables with comments
- Document which variables are required vs optional

## CLI Command Examples

### `mw container run` Format

````markdown
### Alternative: Using the `mw container run` command

You can also use the `mw container run` command to directly create and start a [App Name] container from the command line. This approach is similar to using the Docker CLI and allows you to specify all container parameters in a single command.

```bash
mw container run \
  --name [app-name] \
  --description "[App Description]" \
  --publish [port]:[port] \
  --env "KEY=value" \
  --volume "name:/path" \
  --create-volumes \
  [image/name]
```
````

Make sure to replace the placeholder values with your actual configuration details. After creating the container, you'll still need to assign a domain to it.

````

### `mw stack deploy` Format

```markdown
### Alternative: Using the `mw stack deploy` command

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. This approach allows you to define your container configuration in a YAML file and deploy it with a single command.

First, create a `docker-compose.yml` file with the following content:

```yaml
services:
  [service-name]:
    image: [image/name]
    ports:
      - "[port]:[port]"
    volumes:
      - "name:/path"
    environment:
      KEY: "value"
volumes:
  name: {}
````

Make sure to replace the placeholder values with your actual configuration details. Then, deploy the container using the `mw stack deploy` command:

```bash
mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack.

````

## Docker Image References

Always reference Docker images with:
- A link to the Docker Hub page
- The full image name as used in commands

```markdown
We use the `directus/directus` image from [Docker Hub](https://hub.docker.com/r/directus/directus) for the container.
````

## Terraform Examples

For some applications, there might be a mittwald Terraform module available. These can usually be found on Github, following the format `mittwald/terraform-mittwald-[app]` (e.g., `mittwald/terraform-mittwald-directus`), and on the Terraform Registry under `mittwald/[app]/mittwald`.

When a Terraform module exists, document it as the recommended approach:

````markdown
### Using Terraform (Recommended)

The most convenient way to provision a production-ready [App Name] instance is using [Terraform](/docs/v2/guides/deployment/terraform) with our [[App Name] module](https://registry.terraform.io/modules/mittwald/[app]/mittwald/latest). The following example shows how you can use this module in your own Terraform deployment:

```hcl
[Complete Terraform example]
```
````

````

Include domain/virtualhost configuration in the Terraform example when applicable.

## Troubleshooting Section Format

Use H3 headings for problem categories with bullet-point solutions:

```markdown
## Troubleshooting

### Container Won't Start

- Check the logs in mStudio
- Ensure all environment variables are correctly set
- Verify that the start command is correct

### Application Not Reachable

- Check the port configuration
- Ensure the application listens on the configured port
- Verify domain settings
````

## Notes and Callouts

Use `:::note` callouts for:

- Important configuration details
- Security considerations
- Optional steps or alternative configurations

```markdown
:::note

We assume that [prerequisite condition]. If not, [instructions to resolve].

:::
```

## Technical constraints

Consider the following technical constraints which might be relevant for container commands:

- Exposing a port only makes that port accessible from _within_ the hosting environment (meaning, Containers or managed Apps running within the same project). To access the port from outside the hosting environment, a user can either use the `mw container port-forward` command to forward the port to their local machine, or connect a domain to the port. The latter only supports HTTP ports.
- Exposing a port _within_ the hosting environment is NOT a security issue. The platform has network policies that ensure that no unauthorized access is possible.

## Linking Conventions

- Link to platform documentation using absolute paths: `/docs/v2/platform/workloads/containers`
- Link to CLI reference: `/docs/v2/cli/reference/container`
- Link to external documentation with descriptive text
- Use inline links for Docker Hub image references
