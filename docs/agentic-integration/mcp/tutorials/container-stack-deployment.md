---
title: Container Stack Deployment
description: Deploy and validate a Docker stack with clear verification and rollback prompts
useCases:
  - containers-001-manage-resources
  - containers-003-deploy-docker-stack
  - containers-004-manage-volumes
destructive: true
---

Use this tutorial when you want an agent to perform a stack rollout with explicit checkpoints.

## Copy-paste prompt {#copy-paste-prompt}

```text
Deploy or update my container stack on mittwald and validate runtime health.

Flow:
1) Inspect existing stacks, containers, and volumes.
2) Deploy/update the target stack.
3) Verify service health, ports, and persistent volumes.
4) Report rollout status and any failing service IDs.

Do not delete resources unless I approve.
```

## What the agent will do automatically {#what-agent-will-do}

- Inventory existing stack/container resources.
- Execute deployment/update steps.
- Validate runtime and persistence status.
- Produce a rollout summary with IDs.

## What you (human) must still do {#what-you-must-do}

- Approve deletion changes.
- Provide missing env or secret values.
- Decide rollback if health checks fail.

## Likely questions the agent will ask and good answers {#likely-questions}

- Which stack should I deploy? -> `Use stack <stack-name> in project <project-id>.`
- Should I prune unused resources? -> `No, report only.`

## Verification prompt {#verification-prompt}

```text
List stacks, containers, and volumes for this project and confirm health status after deployment.
Return IDs and failing checks, if any.
```

## Rollback/cleanup prompt {#rollback-cleanup-prompt}

```text
Rollback the stack to the previous known-good configuration and confirm container health after rollback.
```

## Resume after failure {#resume-after-failure}

```text
Resume the deployment from the failed stack step only. Keep already successful validation steps as complete.
```
