---
title: Using the mittwald CLI non-interactively
sidebar_label: Non-interactive usage
sidebar_position: 30
description: How to use the mittwald CLI non-interactively, for example in scripts or in CI/CD pipelines
---

If you intend to use `mw` non-interactively (for example in scripts, or CI/CD pipelines), many commands support a `--output|-o` flag that allows you to specify the output format. The default is `text`, which is a human-readable format, but you can also use `json` to get machine-readable output, which you can then easily process using tools like `jq`:

```bash
PROJECT_ID=$(mw project get -ojson | jq -r '.id')
```

Many mutating commands also print progress information about long-running operations. To suppress this output, you can use the `--quiet|-q` flag. In these cases, most commands will fall back to printing the ID of the created resource, which you can then use to retrieve the full resource information:

```bash
PROJECT_ID=$(mw project create --quiet --description="...")
```
