# Einleitung & API-Konzepte

:::warning

**Für die öffentliche v1-API, alle Bestandteile und diese Dokumentation bieten wir keinen Support. Wir behalten uns vor, Änderungen jederzeit und ohne Ankündigung oder Dokumentation durchzuführen.**
 
:::
 
## Authentifizierung

### Mit Nutzername & Passwort

Zur Authentifizierung wird ein zuvor ausgestelltes API-Token benötigt. Bei Requests kann dieses Token innerhalb eines `Authorization`-Headers übergeben werden:

```http
GET /v1/customers/123456 HTTP/1.1
Host: api.mittwald.de
Authorization: Bearer {TOKEN-HIER-EINFÜGEN}
```

Alternativ dazu kann das Token auch in Form des Query-Parameters `access_token` übergeben werden:

```
GET /v1/customers/123456?access_token={TOKEN-HIER-EINFÜGEN} HTTP/1.1
Host: api.mittwald.de
```

Um ein Token zu beziehen, kann der `/authenticate`-Endpunkt genutzt werden. Hier erfolgt eine Authentifzierung über die Zugangsdaten des Mittwald-Kundencenters.

```
POST /v1/authenticate HTTP/1.1
Host: api.mittwald.de
Content-Type: application/json
Accept: application/jwt

{
    "username": "r1234",
    "password": "{PASSWORT-HIER-EINFÜGEN}"
}
```

Rückgabewert dieses Aufrufs ist ein API-Token. Dieses hat eine begrenzte Gültigkeitsdauer.

:::important

Client-Applikationen sollten das API-Token für seine Gültigkeitsdauer cachen, und erst *anschließend* ein neues Token über die API anfordern.

:::

### Mit Access-Token

Für Anwendungen, die dauerhaft Zugriff auf die Mittwald-API benötigen, wird nicht empfohlen, Nutzername und Passwort dauerhaft in der jeweiligen Anwendung zu speichern. Stattdessen empfehlen wir den Einsatz eines Access Tokens, welches nach einem (initialen) Login mit Nutzername und Passwort erstellt und im Anschluss anstelle dessen genutzt werden kann.

Hierzu wird zunächst ein reguläres API-Token benötigt, das per Nutzername und Passwort bezogen werden kann. Weder Nutzername+Passwort noch das damit bezogene API-Token müssen dauerhaft gespeichert werden. Sie dienen lediglich dazu, ein Access Token zu erstellen, welches im Anschluss dauerhaft in der Applikation gespeichert werden kann:

```
POST /v1/authentication/tokens HTTP/1.1
Host: api.mittwald.de
Content-Type: application/json

{  
    "description": "Meine Anwendung"
}
```

In der Antwort auf obige Anfrage ist das eigentliche Access Token und dessen ID enthalten (mit Beispiel-Daten):

```
HTTP/1.1 201 Created
Content-Type: application/json

{
    "uuid": "2a91ce52-2058-404b-9959-ac7d2fbbbfbc",
    "token": "MW_aEQyz5j9YmTaamTq2N9X3d2sBDACLUoz",
    "crdate": "2021-08-23T14:06:17.580Z",
    "description": "Meine Anwendung"
}
```

`uuid` und `token` dieser Antwort können bei nachfolgenden Authentifzierungs-Vorgängen als Nutzername und Passwort genutzt werden.

## Rate Limiting

Zur Sicherstellung der Systemstabilität sind einige API-Endpunkte in der Anzahl der durchführbaren Anfragen beschränkt. Die Limitierung bezieht sich dabei stets auf ein Zeitfenster von 15 Minuten.

Bei auf diese Weise zugriffsbeschränkten API-Endpunkten enthalten die HTTP-Antworten stets einen `X-RateLimit`-Header, welcher die maximale Anzahl der ausführbaren Anfragen enthält. Außerdem enthält jede Antwort einen `X-RateLimit-Remaining`-Header, welcher die aktuell noch verfügbaren Anfragen enthält:

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=utf8
Content-Length: 1234
X-RateLimit: 1000
X-RateLimit-Remaining: 712
```

## Caching

Einige Anfragen an die API können zwecks besserer Performance aus einem serverseitigen Cache beantwortet werden. Wurde eine Anfrage aus dem Cache beantwortet, enthält die Antwort einen `X-Cache: HIT`-Header.

Der Cache einer Ressource wird dann geleert, wenn ein `POST`-, `PUT`- oder `DELETE`-Request an dieselbe URI gesendet wird, oder bei einem `GET`-Request ein `Cache-Control: no-cache`-Header gesendet wird.