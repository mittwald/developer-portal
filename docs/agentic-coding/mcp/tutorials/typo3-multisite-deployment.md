---
title: TYPO3 Multi-Site Deployment
description: Roll out TYPO3 sites across multiple domains with controlled prompts
useCases:
  - apps-004-migrate-application
  - project-002-configure-ssh
  - databases-001-provision-mysql
  - domains-004-ssl-certificate
destructive: true
---

This tutorial covers controlled rollout of TYPO3 variants across multiple domains.

## Copy-paste prompt {#copy-paste-prompt}

```text
Set up a TYPO3 multi-site rollout for my mittwald project.

Workflow:
1) inspect existing TYPO3 app baseline,
2) create/add required database resources,
3) configure domain/virtualhost and SSL coverage,
4) prepare deployment SSH access,
5) return a site-by-site summary with IDs.

Do read-only validation first, then ask for approval before each write.
```

## What the agent will do automatically {#what-agent-will-do}

- Discover existing app and project context.
- Plan resource creation for each site variant.
- Execute approved setup operations.
- Return domain/app/database/access mappings.

## What you (human) must still do {#what-you-must-do}

- Confirm target domains and language/site mapping.
- Approve each write step.
- Validate TYPO3-level config after infra setup.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which project is the base installation in? -> `Project <project-id>.`
- Should each site have its own DB? -> `No, TYPO3 multisite uses a single shared database.`
- Include `www` + apex for SSL? -> `Yes, both.`

## Verification prompt {#verification-prompt}

```text
Verify each configured site: app ID, database ID, domain/virtualhost ID, certificate status, and SSH access state.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
List resources created for this rollout and remove only those that belong to this session after I confirm IDs.
```

## Resume after failure {#resume-after-failure}

```text
Resume multi-site rollout from the first incomplete site and skip sites already marked as complete.
```
