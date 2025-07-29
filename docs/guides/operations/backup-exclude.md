---
title: Excluding directories from backup
sidebar_label: Backup exclusions
tags:
  - Backups
description: |
  Learn how to exclude certain directories from your backup.
---

Many applications generate large amounts of **temporary or recoverable cache data** (e.g. `node_modules`, thumbnail caches). This data usually **does not** need to be included in backups. The [**Cache Directory Tagging Specification**](https://bford.info/cachedir/) standard exists to tag directories that contain such data. It defines a small tag file called `CACHEDIR.TAG`, which is stored at the root of a cache tree. These directories will then no longer be included in our backups.

For the automatically installed apps in mStudio, we have already placed the file in useful locations.

:::caution

Files that are excluded from the backup cannot be restored – not even by mittwald. Do not abuse the feature to save disk space by excluding important files from the backup.

:::

## TL;DR

Create a file `CACHEDIR.TAG` in each cache directory with **exactly** the following first line:

```
Signature: 8a477f597d28d172789f06886806bc55
```

## Requirements

There are only a few requirements for a valid `CACHEDIR.TAG` file:

1. **Filename:** Must be exactly `CACHEDIR.TAG` (capitalisation important)
2. **Signature header:** The first line _must_ read exactly: `Signature: 8a477f597d28d172789f06886806bc55`
3. **Placement:** A single `CACHEDIR.TAG` in the top-level cache directory is sufficient to mark the _entire_ underlying directory tree as cache

## When should you tag a cache directory?

Use `CACHEDIR.TAG` for directories whose content is **regenerable** - i.e. data that can be loaded from other sources or regenerated at any time. Typical examples:

- Package/build caches (Composer, npm, Yarn)
- Application caches (like TYPO3's `var/cache` directory)
- Generated artefacts (thumbnails)
- Backup directories managed by the application (e.g. Updraft)
