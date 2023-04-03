---
title: Introduction and API concepts
sidebar_position: 2
---

## Base URLs

The mStudio v2 API uses `https://api.mittwald.de/v2/` as base URL for all API endpoints.

## Specification

You can find the full API specification in the [OpenAPI 3.0 format](https://spec.openapis.org/oas/v3.0.0) here:

1. [OpenAPI 3.0 specification](https://api.mittwald.de/openapi) (machine-readable)
2. [Swagger UI](https://api.mittwald.de/v2/docs/) (human-readable)

## Authentication

### Obtaining an API token

To authenticate to the API, you will need an **API Token**. You can obtain one either via the mittwald mStudio Web UI or via the API itself (if you already have another API token). 

1. **In the UI**, go to your user profile and choose the [API tokens](https://studio.mittwald.de/app/profile/api-tokens) menu item.
2. Alternatively, **via the API**, use the `/v2/signup/token/api` endpoint. This requires you to already have an existing API token:

    ```http
    POST /v2/signup/token/api HTTP/1.1
    Host: api.mittwald.de
    Content-Type: application/json
    Authorization: Bearer <EXISTING_API_TOKEN>
    
    {
      "description": "My API token",
      "expiresAt": "2021-12-31T23:59:59+00:00",
      "roles": ["api_read", "api_write"]
    }
    ```
   
    The response will contain a JSON document with a `token` key. This is your API token.

:::caution

Make sure to store your API token in a secure place. It is the only way to authenticate to the API. A lost token cannot be recovered.

:::

### Authenticating requests

Once you have obtained an API token, there are two ways to authenticate to the API:

1. Use the `X-Access-Token` HTTP header. The value of the header is just the API token itself.

    ```http {3}
    GET /v2/user HTTP/1.1
    Host: api.mittwald.de
    X-Access-Token: <API_TOKEN>
    ```
   
2. Use the `Authorization` HTTP header, providing the API token as a `Bearer` Token.

    ```http {3}
    GET /v2/user HTTP/1.1
    Host: api.mittwald.de
    Authorization: Bearer <API_TOKEN>
    ```

## Rate Limiting

Usage of the API is rate-limited to prevent abuse. You can inspect the rate limiting for your current user by observing the headers included in each response:

- `X-RateLimit-Limit`: The maximum number of requests you are allowed to make per period.
- `X-RateLimit-Remaining`: The number of requests remaining in the current period.
- `X-RateLimit-Reset`: The remaining time (in seconds) until the current rate limit period ends and a new one begins.

Some special routes may be exempt from rate limiting. These routes will respond with a `X-RateLimit-Exempt` header set to `yes`.