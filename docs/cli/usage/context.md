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
