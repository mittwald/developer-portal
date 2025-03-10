---
title: Accessing the API from Go
sidebar_label: Go
description: An overview of available Go libraries for interacting with the mittwald API.
---

For Go, we offer the [**mittwald API client** library `github.com/mittwald/api-client-go`](https://github.com/mittwald/api-client-go). This library is an auto-generated client for the mStudio v2 (and any subsequent) API and can be installed via `go get`.

:::important Stability warning

Please note that the Go client library is currently released with a `0.x` tag, which means that it might still change significantly in the future. Since the API itself falls under our regular [stability guarantees][stability], these versions will continue to work, but you may encounter incompatibilities in your code when upgrading.

:::

## Quickstart

Install this package using `go get`:

```
$ go get github.com/mittwald/api-client-go
```

Then, import the version-specific client in your project:

```go
import "github.com/mittwald/api-client-go/mittwaldv2"
```

To use the client, invoke the `mittwaldv2.New` constructor, and configure it using the proved option methods:

1. Omit authentication option for unauthenticated access
2. `mittwaldv2.WithAccessToken` (recommended) to authenticate with an API token
3. `mittwaldv2.WithAccessTokenFromEnv` (recommended) to authenticate with an API token that is automatically retrieved from the process environment variables (`MITTWALD_API_TOKEN`).
4. `mittwaldv2.WithUsernamePassword` to authenticate with username and password; this does not work for users that have 2FA enabled
5. `mittwaldv2.WithAccessTokenRetrievalKey` to authenticate with an [access token retrieval key][atrek] (only relevant for mStudio extensions)
6. `mittwaldv2.WithExtensionSecret` to authenticate as an extension (only relevant for mStudio extensions)

Have a look at our [API introduction](../../intro) for more information on how to obtain an API token and how to get started with the API.

## Further reading

For a complete documentation, have a look at the libraries [`README` file](https://github.com/mittwald/api-client-go) or the [automatically generated package documentation][godoc].

[atrek]: /docs/v2/contribution/overview/concepts/authentication/#access-token-retrieval-key
[stability]: /docs/v2/api/stability/
[godoc]: https://pkg.go.dev/github.com/mittwald/api-client-go
