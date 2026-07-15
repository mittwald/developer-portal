---
title: Entwickler-Onboarding
description: Teammitglieder einladen und SSH/SFTP-Zugriff mit nachvollziehbaren Prompts bereitstellen
useCases:
  - organization-001-invite-team-member
  - organization-002-manage-memberships
  - access-001-create-sftp-user
  - access-002-manage-ssh-access
  - project-002-configure-ssh
destructive: true
---

Dieses Tutorial standardisiert das Setup für neuen Entwicklerzugriff mit Least Privilege und Verifizierung.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Onboard a new developer into mittwald with least-privilege access.

Flow:
1) List organization memberships and pending invites.
2) Send invite to the new user.
3) Create SSH/SFTP access only for the required project(s).
4) Return all created IDs and access summary.

Ask for explicit approval before sending invites or creating users.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Mitgliedschaften inventarisieren und Zugriffs-Baseline erkennen.
- Einladungs- und Zugriffsaktionen vorbereiten.
- Genehmigten Zugriff bereitstellen und IDs zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- E-Mail, Projekte und Rollenumfang bestätigen.
- Einladungs-/Zugriffserstellung genehmigen.
- Anmeldedaten/Public-Key-Anforderungen sicher verteilen.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which organization/project should I use? → `Organization <org-id>, project <project-id>.`
- What role/access level is required? → `Developer role, project-limited access.`
- Should I create both SSH and SFTP now? → `Yes, both.`

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list memberships, invites, SSH users, and SFTP users for the target project and confirm the new developer has only the approved access.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Revoke or delete the invite/user objects created in this session by ID and confirm access removal.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume onboarding from the first incomplete step (invite, SSH, or SFTP) and avoid repeating already successful steps.
```
