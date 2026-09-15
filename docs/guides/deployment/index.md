---
title: Deployment guides
sidebar_label: Overview
sidebar_position: 1
description: >
  An overview of the available deployment strategies for the mittwald cloud platform, and guidance on which one to pick for your use case.
tags:
  - Deployment
---

There is more than one way to get an application onto the mittwald cloud platform. This page gives you an overview of the available strategies, and helps you pick the one that fits your project.

## Two runtime models {#runtime-models}

Most of the decision follows from one question: **should your application run in a managed environment, or as a container?**

- **Managed environments** (in the form of a custom PHP or Node.js app) run in a webspace, on a runtime that is provided and maintained by mittwald (PHP, Node.js, or static files). You deploy _source code_, usually over SSH, and the platform takes care of the webserver, the language runtime, TLS certificates and so on. This is the classic model for PHP applications like TYPO3, Shopware or WordPress.
- **Containers** run a Docker image that you build yourself. You control the entire runtime, which makes this the right choice for anything that the managed runtimes do not cover, or when you want reproducible builds. See [Containers](/docs/v2/platform/workloads/containers/) for the underlying concepts.

:::note

Note that actual **Managed apps** (like a managed TYPO3 or WordPress) are a special case of the managed environment model. They are not covered in this guide, because they are deployed and updated through the mittwald mStudio (or command-line tools like `mw app install wordpress`) rather than through Git or CI/CD.

:::

If you are unsure how these fit together, have a look at the [platform overview](/docs/v2/platform/overview/).

## Which strategy should I use? {#which-strategy}

| Your situation                                                              | Recommended strategy                                                                                                    |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| You have source code in Git, no Dockerfile, and want a running service fast | [Zero-conf deployment](#zero-conf)                                                                                      |
| You built an app with an AI tool (Replit, Lovable, Cursor) and want it live | [Zero-conf deployment](#zero-conf), plus the [platform-specific notes](/docs/v2/guides/deployment/ai_developed_apps/)   |
| You already build a Docker image and maintain a `stack.yaml`                | [`mittwald/deploy-container-action`](/docs/v2/guides/deployment/container-actions/#deploy-with-deploy-container-action) |
| You deploy a PHP/Composer application into managed hosting                  | [Deployer](/docs/v2/guides/deployment/deployer/)                                                                        |
| You deploy a TYPO3 or Neos project and already use Surf                     | [TYPO3 Surf](/docs/v2/guides/deployment/typo3surf/)                                                                     |
| You want to manage projects, apps, databases and domains as code            | [Terraform](/docs/v2/guides/deployment/terraform/)                                                                      |

## The strategies in detail {#strategies}

### Zero-conf container deployment {#zero-conf}

**Use it when:** you want to go from a Git repository to a running application with as little configuration as possible, without writing a Dockerfile or a stack definition.

Zero-conf deployment inspects your source code, infers how to build and start it, and deploys the result to container hosting. You can run it manually from your machine:

```shellsession
user@local $ mw project create --description=my-project --update-context
user@local $ mw experimental deploy
```

Once that works, automate it with the [`mittwald/zerodeploy-action`](/docs/v2/guides/deployment/container-actions/#deploy-with-zerodeploy-action), which runs the same build on every push.

**Trade-off:** convenience over control. The build behaviour is inferred, so unusual project layouts (monorepos, exotic package managers) may need a few environment variables to point the build in the right direction.

What to read next:

- [Deploying containerized applications with GitHub Actions](/docs/v2/guides/deployment/container-actions/) for the automated variant.
- [Deploying AI-developed apps](/docs/v2/guides/deployment/ai_developed_apps/) for the manual CLI walkthrough. Despite the title, that guide is the reference for the zero-conf workflow in general; it just spends extra time on exports from AI development tools, because that is where the workflow is most commonly used.

### Container deployment with an explicit stack {#explicit-stack}

**Use it when:** your team already owns the build. You have a `Dockerfile`, you push images to a registry, and you want to describe services, ports and volumes yourself.

A GitHub Actions workflow builds and pushes the image, then hands your stack definition to mStudio. You keep full control over which services are recreated on a rollout, and you can deploy the same stack into several environments.

**Trade-off:** more moving parts to maintain, but nothing about the runtime is implicit.

Further reading: [Deploying containerized applications with GitHub Actions](/docs/v2/guides/deployment/container-actions/)

### Deployer {#deployer}

**Use it when:** you deploy a PHP application into a managed app, and want atomic releases that you can roll back.

[Deployer](https://deployer.org/) copies each release into its own directory and then flips a `current` symlink, which makes a deployment atomic and revertible. The [mittwald recipe](https://packagist.org/packages/mittwald/deployer-recipes) additionally takes care of creating the SSH user, linking up domains, installing runtime dependencies and flushing the OPcache.

**Trade-off:** it is PHP-centric and requires SSH access. However, it is the most mature path for classic PHP hosting, and it integrates with both GitHub Actions and GitLab CI.

Further reading: [Deploying PHP applications with Deployer](/docs/v2/guides/deployment/deployer/)

### TYPO3 Surf {#surf}

**Use it when:** you deploy TYPO3 or Neos and your project already uses Surf.

Surf fills the same role as Deployer, with tooling built specifically around TYPO3 and Neos. If you are starting fresh and have no strong preference, Deployer offers the deeper mittwald integration.

Further reading: [Deploying PHP applications with TYPO3 Surf](/docs/v2/guides/deployment/typo3surf/)

### Terraform {#terraform}

**Use it when:** you want your _infrastructure_ (projects, apps, databases, domains, containers) described as code and reproducible across environments.

Terraform complements the strategies above rather than replacing them: it provisions and manages the resources your application runs in, and you can combine it with any of the deployment methods for the application code itself. It also lets you manage mittwald resources alongside those of other providers, such as DNS or monitoring, in a single configuration.

Read on: [Infrastructure as code with Terraform](/docs/v2/guides/deployment/terraform/)

## What you will need in any case {#prerequisites}

- An **mStudio API token** for everything that talks to the mittwald API; see [obtaining an API token](/docs/v2/api/intro#obtaining-an-api-token).
- The **mittwald CLI** (`mw`) for most manual steps; see the [CLI documentation](/docs/v2/cli/).
- A **Git repository**, since every strategy described here deploys from source control.

## Where to go next {#next-steps}

- [Containers](/docs/v2/platform/workloads/containers/): stack files, registries, ingress and volumes
- [Webservers](/docs/v2/platform/workloads/webservers/): running your own webserver inside a managed app
- [`mw stack` command reference](/docs/v2/cli/reference/stack/): declarative stack deployment from the CLI
- [Agentic integration](/docs/v2/agentic-integration/): MCP server and agent skills, if you want an AI agent to handle deployments for you
