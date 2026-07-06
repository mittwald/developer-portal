---
title: OAuth-Consent und Refresh-Verhalten
description: Erwarteter Lebenszyklus von erster Zustimmung bis zur Hintergrund-Token-Erneuerung
---

## Erwarteter Lebenszyklus {#expected-lifecycle}

1. Client entdeckt OAuth-Metadaten vom MCP-Endpoint.
2. Benutzer schließt Browser-Zustimmung ab.
3. Client speichert Access-Token und Refresh-Token.
4. Client erneuert Access-Token vor/bei Ablauf.
5. Benutzer wird nur erneut aufgefordert, wenn Refresh fehlschlägt oder Zustimmung widerrufen wurde.

## Was sollte automatisch sein {#what-should-be-automatic}

- Access-Token-Erneuerung ohne zusätzliche Benutzerinteraktion.
- Wiederholung fehlgeschlagener Aufrufe nach erfolgreicher Erneuerung.
- Stabile Sitzung über lang laufende Agent-Workflows.

## Anzeichen eines Bugs {#signals-of-a-bug}

- Re-Auth trotz aktiver Nutzung zu häufig erforderlich.
- Refresh erfolgreich, aber nachfolgende Tool-Aufrufe verwenden immer noch abgelaufenen Token.
- Verschiedene Clients verhalten sich inkonsistent gegenüber demselben Server.

## Verifizierungs-Prompt {#verification-prompt}

```text
Show me authentication state for this MCP connection: whether OAuth is active, whether refresh has recently succeeded, and whether a new consent is required.
```
