---
title: Developer Onboarding
description: Invite team members and provision SSH/SFTP access with auditable prompts
useCases:
  - organization-001-invite-team-member
  - organization-002-manage-memberships
  - access-001-create-sftp-user
  - access-002-manage-ssh-access
  - project-002-configure-ssh
destructive: true
---

This tutorial standardizes new developer access setup with least privilege and verification.

## Copy-paste prompt {#copy-paste-prompt}

```text
Onboard a new developer into mittwald with least-privilege access.

Flow:
1) List organization memberships and pending invites.
2) Send invite to the new user.
3) Create SSH/SFTP access only for the required project(s).
4) Return all created IDs and access summary.

Ask for explicit approval before sending invites or creating users.
```

## What the agent will do automatically {#what-agent-will-do}

- Inventory memberships and detect access baseline.
- Prepare invite and access actions.
- Provision approved access and return IDs.

## What you (human) must still do {#what-you-must-do}

- Confirm email, projects, and role scope.
- Approve invite/access creation.
- Distribute credentials/public-key requirements securely.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which organization/project should I use? -> `Organization <org-id>, project <project-id>.`
- What role/access level is required? -> `Developer role, project-limited access.`
- Should I create both SSH and SFTP now? -> `Yes, both.`

## Verification prompt {#verification-prompt}

```text
Re-list memberships, invites, SSH users, and SFTP users for the target project and confirm the new developer has only the approved access.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Revoke or delete the invite/user objects created in this session by ID and confirm access removal.
```

## Resume after failure {#resume-after-failure}

```text
Resume onboarding from the first incomplete step (invite, SSH, or SFTP) and avoid repeating already successful steps.
```
