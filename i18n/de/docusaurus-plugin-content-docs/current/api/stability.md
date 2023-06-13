---
title: API-Stabilitätsgarantien
sidebar_position: 3
description: |
  Diese Seite enthält Informationen zu den Stabilitätsgarantien der mStudio v2 API.
---

Unsere API ist versioniert. Das bedeutet, dass wir garantieren, dass die API keine grundlegenden Änderungen innerhalb einer Hauptversion einführt. Wir werden neue Funktionen und Endpunkte einführen, und bestehende Endpunkte können sich ändern, aber immer so, dass die Abwärtskompatibilität erhalten bleibt.

Allerdings gibt es einige (vorübergehende) Einschränkungen, da wir noch einige technische Schulden aus früheren Entwicklungsphasen bereinigen:

1. Die Operation-IDs in der OpenAPI-Spezifikation gelten (noch) nicht als Teil des API-Vertrags. Sie können jederzeit geändert werden.
2. Einige Operationen sind in der OpenAPI-Spezifikation explizit als "veraltet" gekennzeichnet. Diese Operationen können jederzeit und ohne vorherige Ankündigung entfernt werden. In der Regel wurden sie erstellt, um einen API-Endpunkt auf eine neue URL zu verschieben und vorübergehende Abwärtskompatibilität aufrechtzuerhalten.
