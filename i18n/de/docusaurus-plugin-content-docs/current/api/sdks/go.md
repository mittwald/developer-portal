---
title: Zugriff auf die API mit Go
sidebar_label: Go
sidebar_position: 40
description: Ein Überblick über verfügbare Go-Bibliotheken zur Interaktion mit der mittwald API.
---

Für Go bieten wir die [**mittwald API Client**-Bibliothek `github.com/mittwald/api-client-go`](https://github.com/mittwald/api-client-go) an. Diese Bibliothek ist ein automatisch generierter Client für die mStudio v2 API (und jede nachfolgende Version) und kann über `go get` installiert werden.

:::important Stabilitätswarnung

Bitte beachte, dass die Go-Client-Bibliothek derzeit mit einem `0.x`-Tag veröffentlicht wird. Das bedeutet, dass sich diese in Zukunft noch erheblich ändern kann. Da die API selbst unter unsere regulären [Stabilitätsgarantien][stability] fällt, werden diese Versionen weiterhin funktionieren. Dennoch könntest du bei Upgrades auf Inkompatibilitäten in deinem Code stoßen.

:::

## Schnellstart

Installiere dieses Paket mit `go get`:

```
$ go get github.com/mittwald/api-client-go
```

Importiere anschließend den versionsspezifischen Client in dein Projekt:

```go
import "github.com/mittwald/api-client-go/mittwaldv2"
```

Um den Client zu nutzen, rufe den `mittwaldv2.New`-Konstruktor auf und konfiguriere ihn mit den bereitgestellten Optionsmethoden:

1. Keine Authentifizierungsoption für nicht authentifizierten Zugriff
2. `mittwaldv2.WithAccessToken` (empfohlen), um dich mit einem API-Token zu authentifizieren
3. `mittwaldv2.WithAccessTokenFromEnv` (empfohlen), um dich mit einem API-Token zu authentifizieren, das automatisch aus den Umgebungsvariablen des Prozesses (`MITTWALD_API_TOKEN`) abgerufen wird
4. `mittwaldv2.WithUsernamePassword`, um dich mit Benutzername und Passwort zu authentifizieren; funktioniert nicht, wenn du die Zwei-Faktor-Authentifizierung (2FA) aktiviert hast
5. `mittwaldv2.WithAccessTokenRetrievalKey`, um dich mit einem [Access Token Retrieval Key][atrek] zu authentifizieren (nur relevant für mStudio-Extension)
6. `mittwaldv2.WithExtensionSecret`, um dich als Extension zu authentifizieren (nur relevant für mStudio-Extension)

Schau dir unsere [API-Einführung](../../intro) an, um mehr darüber zu erfahren, wie du ein API-Token erhältst und wie du mit der API loslegen kannst.

## Weiterführende Informationen

Eine vollständige Dokumentation findest du in der [`README`-Datei](https://github.com/mittwald/api-client-go) der Bibliothek oder in der [automatisch generierten Paketdokumentation][godoc].

[atrek]: /docs/v2/contribution/overview/concepts/authentication/#access-token-retrieval-key
[stability]: /docs/v2/api/stability/
[godoc]: https://pkg.go.dev/github.com/mittwald/api-client-go
