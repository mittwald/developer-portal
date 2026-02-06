---
applyTo: "docs/api/howtos/**/*.md,docs/api/howtos/**/*.mdx,i18n/de/docusaurus-plugin-content-docs/**/api/howtos/**/*.md,i18n/de/docusaurus-plugin-content-docs/**/api/howtos/**/*.mdx"
---

These guidelines apply specifically to API guides in the `docs/api/howtos` directory. Follow the general documentation guidelines in `DOCS.instructions.md` as well.

## Front Matter

API guides must include the following front matter properties:

```yaml
---
sidebar_label: Short action-oriented label (e.g., "Creating a project")
title: Full title with "using the API" or "via the API" suffix
description: Brief description starting with "Learn how to..." or "This article describes..."
tags:
  - RelevantTag
---
```

- **sidebar_label**: Use present participle form (e.g., "Creating a project", "Managing DNS records")
- **title**: Full descriptive title ending with "using the API" or "via the API" (e.g., "Creating a project using the API")
- **description**: Start with "Learn how to..." or "This article describes..." followed by the action and "via the mStudio API"
- **tags**: Include relevant technology tags (e.g., PHP, Node.js, Docker, DNS, Email)
- **sidebar_position**: Optional, use only when explicit ordering is needed

## Required Component Imports

API guides should import the necessary components at the top of the file, after the front matter:

```tsx
import OperationLink from "@site/src/components/OperationLink";
import OperationHint from "@site/src/components/OperationHint";
import OperationExample from "@site/src/components/OperationExample";
```

Import only the components you actually use in the document.

## Document Structure

### Prerequisites Section

Most API guides should start with a "Prerequisites" section that lists what the reader needs before following the guide:

```markdown
## Prerequisites

To [perform this action], you will need to have the following:

- The project ID of an existing project ([how to create a project](../create-project))
- [Other specific requirements]
```

- Always link to dependent guides (e.g., project creation) using relative paths
- List specific IDs, permissions, or resources needed

### Step-by-Step Workflow

Structure the guide as a logical workflow with clear section headings:

1. Prerequisites or requirements
2. Preparation steps (e.g., "Determine the app and version ID")
3. Main action (e.g., "Install the application")
4. Follow-up steps (e.g., "Observing installation status")
5. Optional: Variations or alternative approaches

## API Operation Components

### Linking to Operations

Use `<OperationLink />` to reference API operations. Never hardcode URLs to API reference documentation.

```tsx
// Basic usage
<OperationLink operation="project-create-project" />

// With explicit API version
<OperationLink operation="container-create-registry" apiVersion="v2" />

// With tag (for disambiguation)
<OperationLink tag="App" operation="app-get-appinstallation" />
```

### Operation Examples

Use `<OperationExample />` to show complete request examples:

```tsx
<OperationExample
  operation="app-request-appinstallation"
  example={{
    appVersionId: "ff45ad04-8589-46d7-a645-0566be3eaeec",
    description: "Your PHP app",
    updatePolicy: "none",
  }}
/>
```

For operations with path parameters:

```tsx
<OperationExample
  operation="dns-update-record-set"
  pathParameters={{ recordSet: "a", dnsZoneId: "ZONE_ID" }}
  example={{
    a: ["203.0.113.1"],
    settings: { ttl: { auto: true } },
  }}
/>
```

### Operation Hints

Use `<OperationHint />` at the end of sections to provide quick reference to the full API documentation:

```tsx
// Basic usage
<OperationHint operation="project-create-project" />

// With tag
<OperationHint tag="Database" operation="database-create-redis-database" />

// Multiple operations
<OperationHint
  tag="Mail"
  operation={["mail-delete-mail-address", "mail-delete-delivery-box"]}
/>
```

### Schema Documentation

For complex request/response schemas, use `<SchemaFromSpec />`:

```tsx
<SchemaFromSpec
  apiVersion="v2"
  path="#/components/schemas/de.mittwald.v1.mail.CreateMailAddress"
  withExample
/>
```

## Placeholder Conventions

When example values need to be substituted by the reader, use SCREAMING_SNAKE_CASE placeholders:

- `PROJECT_ID` - for project identifiers
- `ZONE_ID` - for DNS zone identifiers
- `<insert system software id>` - for values that need to be looked up

When using placeholders, add a note at the beginning of the section:

```markdown
:::note

In the following examples, substitute `PROJECT_ID` with your actual project ID. Please note that this needs to be the
**full id** (formatted as a UUID), and **not** the short ID (formatted as `p-XXXXX`).

:::
```

## Documenting Request and Response Properties

### Request Body Documentation

Document required request properties using either:

1. Inline bullet lists for simple schemas:

```markdown
The request body must contain a JSON object with the following properties:

- `description` (String, mandatory field) should contain a human-readable description
- `version` (String, mandatory field) should contain the version number
```

2. The `<SchemaFromSpec />` component for complex schemas

### Response Documentation

Document relevant response properties:

```markdown
The response will contain the following properties:

- `id` contains the ID of the created database.
- `hostname` and `port` contain the connection details.
```

Highlight fields that will be needed in subsequent steps.

## Listing Related Operations

When listing multiple related API operations, use a bulleted list with `<!-- prettier-ignore -->` to prevent formatting issues:

```markdown
<!-- prettier-ignore -->
- <OperationLink operation="container-create-registry" apiVersion="v2" /> to create a new container registry
- <OperationLink operation="container-update-registry" apiVersion="v2" /> to update a container registry
- <OperationLink operation="container-delete-registry" apiVersion="v2" /> to delete a registry
```

## Important Values and IDs

When documenting stable/well-known IDs (like application IDs), list them explicitly:

```markdown
The PHP or PHP worker applications should have the following IDs, respectively:

- PHP: `34220303-cb87-4592-8a95-2eb20a97b2ac`
- PHP Worker: `fcac178a-e606-4460-a5fd-b3ad0ae7a3cc`
```

## Security Warnings

Use `:::caution` callouts for security-relevant information, especially around credentials:

```markdown
:::caution

Take note of the password you set for the email account. You will not be able to retrieve it later.

:::
```

## Cross-References

- Link to other API guides using relative paths: `[how to create a project](../create-project)`
- Link to platform documentation when explaining concepts: `[container workloads](/docs/v2/platform/workloads/containers/)`
- Use footnotes for external references like pricing pages

## Idempotency and Side Effects

When an operation has important behavioral characteristics, document them clearly:

```markdown
:::important

The <OperationLink operation="container-declare-stack" /> operation is **idempotent** and will replace the existing stack definition with the new one. This means that any services or volumes that are not included in the new stack definition will be removed from the stack.

:::
```

## Planned or Unsupported Features

When a feature is planned but not yet available, document it briefly:

```markdown
## Starting a new container stack (planned)

Starting new container stacks next to the default stack is not supported at the moment.
```
