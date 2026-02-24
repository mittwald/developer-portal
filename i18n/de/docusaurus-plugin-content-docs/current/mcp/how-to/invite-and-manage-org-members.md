---
title: Organisationsmitglieder einladen und verwalten
description: Teammitglieder hinzufügen und Organisationszugriff prüfen
useCases:
  - organization-001-invite-team-member
  - organization-002-manage-memberships
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Help me manage mittwald organization memberships.

Workflow:
1) list current members and pending invites,
2) invite the specified new member,
3) show role/access posture after invite,
4) flag risky access patterns.

Do not modify existing memberships beyond sending the invite unless I approve.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Mitgliedschaften und Einladungen aufzählen.
- Einladung nach Genehmigung erstellen.
- Post-Change-Zugriffsstatus zusammenfassen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Eingeladene E-Mail und Rolle bestätigen.
- Zusätzliche Mitgliedschaftsänderungen genehmigen.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list members and pending invites and confirm the invited user appears with the intended role state.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Cancel the invite(s) created in this session if needed and return the final invite/membership status.
```
