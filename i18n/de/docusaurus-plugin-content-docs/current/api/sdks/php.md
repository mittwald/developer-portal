---
title: Zugriff auf die API mit PHP
sidebar_label: PHP
description: Ein Überblick über verfügbare PHP-Bibliotheken zur Nutzung mit der mittwald-API.
---

Für PHP bieten wir die [**mittwald API-Client**-Bibliothek `mittwald/api-client`](https://github.com/mittwald/api-client-php) an. Diese Bibliothek ist ein automatisch generierter Client für die mStudio-v2-API und kann über Composer installiert werden.

## Schnellstart

Installiere dieses Paket mit [Composer](https://getcomposer.org):

```
$ composer require mittwald/api-client
```

Um den Client zu verwenden, importiere die Klasse `Mittwald\ApiClient\MittwaldAPIV2Client` und instanziiere sie über eine der Factory-Funktionen:

- `MittwaldAPIClient::newUnauthenticated()`
- `MittwaldAPIClient::newWithToken(string $apiToken)` (empfohlen)
- `MittwaldAPIClient::newWithCredentials(string $email, string $password)` (führt einen "echten" Nutzerlogin im Hintergrund aus; funktioniert nicht, wenn der Benutzer Multifaktor-Authentifizierung aktiviert hat)

Wirf einen Blick auf unsere [API-Einführung](../../intro), um mehr Informationen darüber zu erhalten, wie du ein API-Token erhältst und wie du mit der API loslegen kannst.

## Weitere Quellen

Für eine vollständige Dokumentation wirf einen Blick auf die [`README`-Datei](https://github.com/mittwald/api-client-php) der Bibliothek (auf Englisch).
