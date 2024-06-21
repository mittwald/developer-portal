# Introduction & API concepts

:::warning

**We do not provide support for the public API, all its components, and this documentation. We reserve the right to make changes at any time without notice or documentation.**
 
:::
 
## Authentication

### With username & password

To authenticate, a previously issued API token is required. This token can be passed within an `Authorization` header in requests:

```http
GET /v1/customers/123456 HTTP/1.1
Host: api.mittwald.de
Authorization: Bearer {INSERT-TOKEN-HERE}
```

Alternatively, the token can also be passed as a query parameter `access_token`:

```
GET /v1/customers/123456?access_token={INSERT-TOKEN-HERE} HTTP/1.1
Host: api.mittwald.de
```

To obtain a token, the `/authenticate` endpoint can be used. Here, authentication is done using the credentials of the mittwald customer center.

```
POST /v1/authenticate HTTP/1.1
Host: api.mittwald.de
Content-Type: application/json
Accept: application/jwt

{
    "username": "r1234",
    "password": "{INSERT-PASSWORD-HERE}"
}
```

Return value of this call is an API token. This token has a limited validity period.

:::important

Client applications should cache the API token for its validity period, and only *then* request a new token via the API.

:::

### With access token

For applications that require permanent access to the mittwald API, it is not recommended to store username and password permanently in the respective application. Instead, we recommend using an access token, which can be created after an (initial) login with username and password and can then be used instead.

For this, you need a regular API token first, which can be obtained by username and password. Neither username+password nor the API token obtained with it need to be stored permanently. They are only used to create an access token, which can then be stored permanently in the application:

```
POST /v1/authentication/tokens HTTP/1.1
Host: api.mittwald.de
Content-Type: application/json

{  
    "description": "My application"
}
```

The response to the above request contains the actual access token and its ID (with example data):

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "uuid": "2a91ce52-2058-404b-9959-ac7d2fbbbfbc",
    "token": "MW_aEQyz5j9YmTaamTq2N9X3d2sBDACLUoz",
    "crdate": "2021-08-23T14:06:17.580Z",
    "description": "My application"
}
```

`uuid` and `token` of this response can be used as username and password in subsequent authentication processes.

## Rate Limiting

To ensure system stability, some API endpoints are limited in the number of requests that can be made. The limitation always refers to a time window of 15 minutes.

Rate-limited API endpoints always include an `X-RateLimit` header in the HTTP responses, which contains the maximum number of requests that can be made. In addition, each response contains an `X-RateLimit-Remaining` header, which contains the currently available requests:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf8
Content-Length: 1234
X-RateLimit: 1000
X-RateLimit-Remaining: 712
```

## Caching

Some requests to the API can be answered from a server-side cache for better performance. If a request was answered from the cache, the response contains an `X-Cache: HIT` header.

A resource's cache is cleared when a `POST`, `PUT`, or `DELETE` request is sent to the same URI, or when a `Cache-Control: no-cache` header is sent with a `GET` request.