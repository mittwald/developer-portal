---
title: Redis einrichten und MySQL-Benutzer verwalten
description: Cache-Services und Least-Privilege-Datenbankbenutzer hinzufügen
useCases:
  - databases-003-setup-redis-cache
  - databases-004-manage-users
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Set up Redis caching and a least-privilege MySQL user for my mittwald project.

Steps:
1) inspect existing Redis/MySQL resources,
2) create missing Redis instance if needed,
3) create read-only MySQL user for reporting,
4) return connection details and security notes.

Ask before creating users/resources.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Bestehendes Redis/MySQL-Setup prüfen.
- Genehmigte Ressourcen erstellen.
- Relevante IDs und Verbindungsmetadaten zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Ressourcen-/Benutzererstellung genehmigen.
- Anmeldedaten in Secret-Manager ablegen.
- App/Plugin-Integration validieren.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list Redis instances and MySQL users for this project and confirm the new resources exist with intended permissions.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Delete only the Redis/MySQL user resources created in this session and confirm they are no longer active.
```
