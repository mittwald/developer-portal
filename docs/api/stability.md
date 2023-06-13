---
title: API stability guarantees
sidebar_position: 3
description: |
  This page contains information about the stability guarantees of the mStudio v2 API.
---

Our API is versioned. This means that we guarantee that the API will not introduce breaking changes within a major version. We will introduce new features and endpoints, and existing endpoints may change, but always in a way that maintains backwards compatibility.

However, since we are still cleaning up some technical debt from earlier development stages, there are a few (temporary) caveats:

1. The operation IDs in the OpenAPI specification are not (yet) considered part of the API contract. They may change at any time.
2. Some operations are explicitly marked as "deprecated" in the OpenAPI specification. These operations may be removed at any time without prior notice. Usually, these were created to move an API endpoint to a new URL and to maintain temporary backwards compatibility.
