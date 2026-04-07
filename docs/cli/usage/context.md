---
title: Saving objects as context for subsequent commands
sidebar_label: Persistent context
sidebar_position: 25
description: How to persist certain objects as context for subsequent commands
---

Many commands of the CLI act in the context of a certain app installation, project, server or organization, and as such require a `--installation-id`, `--project-id`, `--server-id` or `--org-id` flag. You can either pass these flags to each command, or set them globally using the `mw context` command:

```bash
$ mw context set --installation-id=...
$ mw context set --project-id=...
$ mw context set --server-id=...
$ mw context set --org-id=...
```

Some commands that _create_ one of these resources also have a `--update-context` flag that will automatically set the context to the newly created resource:

```bash
$ mw project create --description="..." --update-context
```

## Directory-scoped context with `.mw-context.json` {#dotfile-context}

When working on multiple mittwald projects in parallel, switching context with `mw context set` can be tedious because the context is stored globally in `~/.config/mw/context.json`. To avoid this, you can create a `.mw-context.json` file in your project directory (or any parent directory) to set context values that apply only when working in that directory.

Create a `.mw-context.json` file with the context keys you need:

```json
{
  "project-id": "p-xxxxx",
  "server-id": "s-xxxxx",
  "org-id": "o-xxxxx"
}
```

The CLI will automatically search upward from your current working directory for this file. When found, the values in `.mw-context.json` take priority over the global context.

This approach is useful for:

- **Multi-project workflows**: Each project directory can have its own context without manual switching.
- **Team collaboration**: Commit the `.mw-context.json` file to your repository so team members automatically use the correct context.
- **Avoiding race conditions**: Multiple terminals in different directories won't interfere with each other's context.
