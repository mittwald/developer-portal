---
title: Ein Projekt erstellen
description:
  Dieser Artikel beschreibt, wie ein neues Projekt in verschiedenen
  Deployment-Szenarien erstellt werden kann
tags:
  - Projects
---

## Über Projekt-Platzierungen

Es gibt verschiedene Möglichkeiten, ein neues Projekt zu erstellen:

1. Wenn du Zugriff auf eine _Project Placement Group_ hast (zum Beispiel, wenn
   du den "Space Server"-Tarif[^1] verwendest), kannst du ein neues Projekt in
   dieser Placement Group erstellen. Alle Projekte, die in einer Placement Group
   erstellt werden, verwenden denselben gemeinsamen Ressourcen-Pool. Da du für
   die Placement Group bezahlst, kannst du ohne zusätzliche Kosten so viele
   Projekte erstellen, wie die Ressourcen-Verwendung zulässt.
2. Für die Zukunft behalten wir uns die Option vor, die Erstellung von
   Standalone-Projekten anzubieten. Das werden Projekte sein, die _nicht_ Teil
   einer Placement Group sind und auf einem gemeinsamen Ressourcen-Pool erstellt
   werden. Du wirst für die von dem Projekt genutzten Ressourcen bezahlen und so
   viele Projekte erstellen können, wie du möchtest.

## Ein Projekt erstellen...

### ...in einer Placement Group

Voraussetzung dafür, ein Projekt in einer bestehenden Placement Group zu
erstellen, ist die ID dieser Placement Group. Du kannst alle Placement Groups
finden, auf die du Zugriff hast, indem du den
`GET /v2/placementgroups`-API-Endpunkt verwendest.

Um ein neues Projekt zu erstellen, sende eine `POST`-Anfrage an den
`/v2/placementgroups/{placementGroupID}/projects`-Endpunkt. Der Anfragetext muss
ein JSON-Objekt mit den folgenden Eigenschaften enthalten:

- `description` (String, Pflichtfeld) sollte eine menschenlesbare Beschreibung
  des Projekts enthalten.

Die Antwort im Erfolgsfall enthält ein JSON-Objekt mit den folgenden
Eigenschaften:

- `id` ist die ID des neu erstellten Projekts.

### ...als Standalone-Projekt

:::note

Das Erstellen von Standalone-Projekten wird derzeit nicht unterstützt.

:::

## Überprüfen der Projekt-Verfügbarkeit

Ein neu erstelltes Projekt ist nicht sofort verfügbar (sollte es jedoch
innerhalb weniger Sekunden sein). Um zu überprüfen, ob ein Projekt bereit ist,
sende eine `GET`-Anfrage an den `/v2/projects/{projectID}`-Endpunkt. Unter
anderem enthält die Antwort eine `isReady`-Eigenschaft. Diese Eigenschaft ist
`true`, wenn das Projekt bereitgestellt und verfügbar ist, und andernfalls
`false`.

[^1]: https://www.mittwald.de/space-server
