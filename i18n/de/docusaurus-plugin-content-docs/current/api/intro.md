---
title: Einleitung und API-Konzepte
sidebar_position: 2
description: |
  Diese Seite bietet eine Einführung in die mStudio v2 API und ihre Konzepte.
---

## Basis-URLs

Die mStudio v2 API verwendet `https://api.mittwald.de/v2/` als Basis-URL für
alle API-Endpunkte.

## Spezifikation

Die vollständige API-Spezifikation im
[OpenAPI 3.0-Format](https://spec.openapis.org/oas/v3.0.0) findest du hier:

1. [OpenAPI 3.0-Spezifikation](https://api.mittwald.de/openapi)
   (maschinenlesbar)
2. [HTML-Dokumentation](/reference/v2) (menschenlesbar)

## Authentifizierung

### Ein API-Token beziehen

Um dich an der API zu authentifizieren, benötigst du ein **API-Token**. Du
kannst es entweder über die mittwald mStudio Web-UI oder über die API selbst
beziehen (wenn du bereits über ein anderes API-Token verfügst).

1. **In der Web-UI** gehe zu deinem Benutzerprofil und wähle den Menüpunkt
   [API-Tokens](https://studio.mittwald.de/app/profile/api-tokens) aus.
2. Alternativ, **über die API**, verwende den `/v2/signup/token/api`-Endpunkt.
   Dieser setzt voraus, dass du ein bereits bestehendes API-Token hast:

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

   The Antwort auf diese Anfrage wird ein JSON-Dokument mit einem
   `token`-Attribut enthalten. Dies ist dein API-Token.

:::caution

Stehe sicher, dass du dein API-Token an einem sicheren Ort speicherst. Er ist
die einzige Möglichkeit, dich an der API zu authentifizieren. Ein verlorenes
Token kann nicht wiederhergestellt werden.

:::

### API-Anfragen authentifizieren

Sobald du ein API-Token erhalten hast, gibt es zwei Möglichkeiten, sich an der
API zu authentifizieren:

1. Verwende den `X-Access-Token`-HTTP-Header. Der Wert dieses Headers ist
   einfach nur das API-Token.

   ```http {3}
   GET /v2/user HTTP/1.1
   Host: api.mittwald.de
   X-Access-Token: <API_TOKEN>
   ```

2. Verwende den `Authorization`-Header, und verwende das API-Token als
   `Bearer`-Token.

   ```http {3}
   GET /v2/user HTTP/1.1
   Host: api.mittwald.de
   Authorization: Bearer <API_TOKEN>
   ```

## Rate-Limiting

Die API ist auf eine bestimmte Anzahl von Anfragen pro Zeitraum begrenzt, um
Missbrauch zu verhindern. Du kannst die Rate-Limiting-Einstellungen für deinen
aktuellen Benutzer überprüfen, indem du die Header in der Antwort überprüfst:

- `X-RateLimit-Limit`: Die maximale Anzahl von Anfragen, die du pro Zeitraum
  tätigen darfst.
- `X-RateLimit-Remaining`: Die Anzahl der Anfragen, die noch im aktuellen
  Zeitraum verbleiben.
- `X-RateLimit-Reset`: Die verbleibende Zeit (in Sekunden), bis der aktuelle
  Zeitraum endet und ein neuer beginnt.

Einige spezielle Routen sind von der Limitierng ausgenommen. Diese Routen
antworten mit einem `X-RateLimit-Exempt` Header, der auf `yes` gesetzt ist.
