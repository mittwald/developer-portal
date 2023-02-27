---
title: Creating a project
description: This article describes how to create a new project in various deployment scenarios.
tags:
  - Projects
---

## On project placements

There are different ways to deploy a new project:

1. When you have access to a _project placement group_ (which you will get for example when using the "Space Server" plan[^1]), you can create a new project in that group. Any projects deployed on a placement group will utilize the same shared resource pool. Since you pay for the placement group, you can deploy as many projects as resource utilization allows, without additional costs.
2. For the future, we reserve the option to offer the creation of stand-alone projects. These will be projects that are _not_ part of a placement group, and will be deployed on a shared resource pool. You will pay for the resources used by the project, and you will be able to deploy as many projects as you want.

## Creating a project...

### ...in a placement group

To create a project in an existing placement group, you will require that placement group's ID. You can find all placement groups you have access to using the `GET /v2/placementgroups` API endpoint.

To create a new project, send a `POST` request to the `/v2/placementgroups/{placementGroupID}/projects` endpoint. The request body must contain a JSON object with the following properties:

- `description` should contain a human-readable description of the project. This is a required value.

The response, when successful, will contain a JSON object with the following properties:

- `id` is the ID of the newly created project.

### ...as a stand-alone project

:::note

Creating stand-alone projects is not supported, as of yet.

:::

## Observing project readiness

A newly created project will not be available immediately (however, it should be available within a few seconds). To check whether a project is ready, send a `GET` request to the `/v2/projects/{projectID}` endpoint. Among other properties, the response will contain an `isReady` property. This property will be `true` when the project is ready, and `false` otherwise.

[^1]: https://www.mittwald.de/space-server