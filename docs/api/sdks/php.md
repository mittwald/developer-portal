---
title: Accessing the API from PHP
sidebar_label: PHP
description: An overview of available PHP libraries for interacting with the mittwald API.
---

For PHP, we offer the [**mittwald API client** library `mittwald/api-client`](https://github.com/mittwald/api-client-php). This library is an auto-generated client for the mStudio v2 API and can be installed via Composer.

## Quickstart

Install this package using [Composer](https://getcomposer.org):

```
$ composer require mittwald/api-client
```

To use the client, import the `Mittwald\ApiClient\MittwaldAPIV2Client` class, and instantiate it via one of the factory functions:

- `MittwaldAPIV2Client::newUnauthenticated()`
- `MittwaldAPIV2Client::newWithToken(string $apiToken)` (recommended)
- `MittwaldAPIV2Client::newWithCredentials(string $email, string $password)` (does actually perform a login in the background; does not work when using 2FA)

Have a look at our [API introduction](../../intro) for more information on how to obtain an API token and how to get started with the API.

## Further reading

For a complete documentation, have a look at the libraries [`README` file](https://github.com/mittwald/api-client-php).
