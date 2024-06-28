---
title: Zugriff auf die API mit JavaScript (Node.js/Browser)
sidebar_label: JavaScript (Node.js/Browser)
description: Ein Überblick über verfügbare JavaScript-Bibliotheken zur Nutzung mit der mittwald-API.
---

# JavaScript (Node.js/Browser)

Aktuell bieten wir die folgenden Bibliotheken an:

- Die [**mittwald API-Client**-Bibliothek `@mittwald/api-client`](https://github.com/mittwald/api-client-js/tree/master/packages/mittwald#mittwald-api-javascript-client) ist eine automatisch generierte Client-Bibliothek für die mStudio-v2-API. Sie kann sowohl in Node.js- als auch in Browser-basierten Anwendungen genutzt werden.
- Die [**mittwald API-React-Client**-Bibliothek `@mittwald/api-client`](https://github.com/mittwald/api-client-js/tree/master/packages/mittwald#usage-in-react) ist eine automatisch generierte React-Client-Bibliothek für die mStudio-v2-API. Der React-Client hat eine Entsprechung für jede GET-Methode des regulären Clients. Die Methoden geben eine [AsyncResource](https://www.npmjs.com/package/@mittwald/react-use-promise#async-resource-1) zurück, die verwendet werden kann, um die API-Antworten zu erhalten.

Coming Soon:

- Eine Bibliothek mit grobgranulareren Funktionen, die auf der `@mittwald/api-client`-Bibliothek aufbaut.
