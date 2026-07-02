---
title: Agency Multi-Project Management
description: Run weekly multi-project operations review with agent execution and human approvals
useCases:
  - organization-002-manage-memberships
  - project-001-create-project
  - automation-002-manage-scheduled-tasks
destructive: false
---

This tutorial is for agency leads who want one repeatable weekly operations run across projects, memberships, and open work.

## Copy-paste prompt {#copy-paste-prompt}

```text
Prepare my weekly mittwald agency operations brief.

Do this in order:
1) Discover my organization and active projects.
2) Review memberships and pending invites.
3) Review automation/cron status for production projects.
4) Return a prioritized report with: critical issues, actions for this week, and owner suggestions.

Read-only mode first. Do not create/update/delete anything unless I explicitly approve.
```

## What the agent will do automatically {#what-agent-will-do}

- Resolve your organization and list active projects.
- Audit memberships and pending invites.
- Inspect automation status and recent execution outcomes.
- Produce one prioritized summary with IDs you can act on.

## What you (human) must still do {#what-you-must-do}

- Confirm the target organization if you have multiple.
- Approve any write actions.
- Decide ownership and priorities for flagged items.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which organization should I audit? -> `Use organization <org-id>.`
- Should I include staging projects? -> `Production first, then staging if time permits.`
- Should I create tickets/tasks automatically? -> `No, return recommendations only.`

## Verification prompt {#verification-prompt}

```text
Re-check the same organization and show me:
- project count,
- membership count,
- pending invite count,
- any failing automations.
Return the raw IDs used in the report.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
If you created anything in this session by mistake, list each created resource ID and delete only those resources after I confirm.
```

## Resume after failure {#resume-after-failure}

```text
Resume the weekly operations brief from the last completed step. Reuse previously discovered organization/project IDs and continue without re-running completed checks.
```
