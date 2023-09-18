---
title: Accessing the API from Javascript (Node.js or a browser)
sidebar_label: JavaScript (Node.js/Browser)
description: An overview of available JavaScript libraries for interacting with the mittwald API.
---

Currently, we offer the following libraries:

- The [**mittwald API client** library `@mittwald/api-client`]([https://github.com/mittwald/api-client-js](https://github.com/mittwald/api-client-js/tree/master/packages/mittwald#mittwald-api-javascript-client)) is an auto-generated client for the mStudio v2 API. It can be used in both Node.js and browser applications.
- The [**mittwald API React client** library `@mittwald/api-client`](https://github.com/mittwald/api-client-js/tree/master/packages/mittwald#usage-in-react) is an auto-generated React client for the mStudio v2 API. The React client has an equivalent for every GET method of the regular client. The methods returning an [AsyncResource](https://www.npmjs.com/package/@mittwald/react-use-promise#async-resource-1) that can be used to get the API responses.

Coming soon:

- A higher-level library of functionalities building on `@mittwald/api-client`
