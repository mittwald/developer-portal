---
title: Container-Stack-Deployment
description: Deploye und validiere einen Docker-Stack mit klaren Verifizierungs- und Rollback-Prompts
useCases:
  - containers-001-manage-resources
  - containers-002-scale-app
  - containers-003-deploy-docker-stack
  - containers-004-manage-volumes
destructive: true
---

Verwende dieses Tutorial, wenn du möchtest, dass ein Agent ein Stack-Rollout mit expliziten Checkpoints durchführt.

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Deploy or update my container stack on mittwald and validate runtime health.

Flow:
1) Inspect existing stacks, containers, and volumes.
2) Deploy/update the target stack.
3) Verify service health, ports, and persistent volumes.
4) Report rollout status and any failing service IDs.

Do not scale or delete resources unless I approve.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Bestehende Stack/Container-Ressourcen inventarisieren.
- Deployment/Update-Schritte ausführen.
- Runtime- und Persistenzstatus validieren.
- Eine Rollout-Zusammenfassung mit IDs erstellen.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Skalierungs-/Löschänderungen genehmigen.
- Fehlende Umgebungs- oder Secret-Werte bereitstellen.
- Rollback entscheiden, falls Gesundheitschecks fehlschlagen.

## Wahrscheinliche Fragen, die der Agent stellen wird, und gute Antworten {#likely-questions}

- Which stack should I deploy? → `Use stack <stack-name> in project <project-id>.`
- Can I scale services? → `Scale only after initial health is green.`
- Should I prune unused resources? → `No, report only.`

## Verifizierungs-Prompt {#verification-prompt}

```text
List stacks, containers, and volumes for this project and confirm health status after deployment.
Return IDs and failing checks, if any.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Rollback the stack to the previous known-good configuration and confirm container health after rollback.
```

## Fortsetzung nach Fehler {#resume-after-failure}

```text
Resume the deployment from the failed stack step only. Keep already successful validation steps as complete.
```
