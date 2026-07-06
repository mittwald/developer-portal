---
title: Account-Sitzungen und Sicherheit überprüfen
description: Account-Details und aktive Sitzungen auf verdächtige Aktivität prüfen
useCases:
  - identity-003-check-account-settings
destructive: false
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Run a security review for my mittwald account.

I need:
1) account profile summary,
2) active session list,
3) suspicious-session highlights,
4) recommended follow-up actions.

Read-only mode.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Account-Details abrufen.
- Aktive Sitzungen abrufen.
- Ungewöhnliche Standorte/Geräte/Zeitstempel markieren.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Bestätigen, ob verdächtige Sitzungen legitim sind.
- Entscheiden, ob Sitzungen in einer Folgeaktion widerrufen werden sollen.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-run account and session checks and confirm findings are reproducible, with session IDs included.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
No rollback needed for read-only review. If any session was revoked accidentally, list impacted sessions and required re-login steps.
```
