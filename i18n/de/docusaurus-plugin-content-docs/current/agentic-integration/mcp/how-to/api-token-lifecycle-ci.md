---
title: API-Token-Lifecycle für CI/CD verwalten
description: mittwald API-Tokens, die von Pipelines verwendet werden, erstellen, validieren, rotieren und stilllegen
useCases:
  - identity-001-manage-api-tokens
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Help me manage mittwald API tokens for CI/CD.

Do this:
1) list existing API tokens,
2) identify stale or over-permissioned tokens,
3) create a new pipeline token with least privilege,
4) provide a rotation plan and retirement list.

Do not delete/revoke tokens until I approve.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Bestehende Tokens inventarisieren.
- Risiko markieren (Alter, Scope, Inaktivität).
- Einen genehmigten Ersatz-Token erstellen und Metadaten zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Neuen Token im CI-Secret-Manager speichern.
- Cutover-Timing bestätigen.
- Widerruf des alten Tokens genehmigen.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list API tokens and show which token is active for CI, which one is pending retirement, and whether scope is least-privilege.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
If the new token rollout failed, mark the new token as unused and keep the previous token active until a new cutover window.
```
