---
title: Deine SSH-Schlüssel verwalten
description: Benutzer-SSH-Schlüssel sicher prüfen und aktualisieren
useCases:
  - identity-002-ssh-key-management
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Audit my mittwald SSH keys and help me add/replace keys safely.

Process:
1) list current keys,
2) flag old/duplicate keys,
3) add my new public key,
4) prepare cleanup actions for obsolete keys.

Do not delete old keys until I confirm successful login with the new key.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Bestehende Schlüssel auflisten und klassifizieren.
- Den bereitgestellten neuen Schlüssel hinzufügen.
- Einen sicheren Stilllegungsplan für alte Schlüssel vorbereiten.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Den korrekten Public Key bereitstellen.
- Login mit neuem Schlüssel validieren.
- Entfernung alter Schlüssel genehmigen.

## Verifizierungs-Prompt {#verification-prompt}

```text
List my SSH keys again and confirm the new fingerprint is present and old keys are unchanged unless I approved removal.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
If new-key login fails, keep old keys active and remove only the newly added key by ID.
```
