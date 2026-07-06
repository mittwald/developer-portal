---
title: Re-Auth-Fehlerbehebung und Wiederherstellung
description: Wiederholte Zustimmungs-Prompts diagnostizieren und sauber wiederherstellen
---

## Häufige Symptome {#common-symptoms}

- MCP-Aufrufe schlagen mit `invalid_token` fehl.
- Client fordert wiederholt Browser-Login an.
- Sitzung funktioniert kurz, schlägt dann bei langen Durchläufen fehl.

## Schnelle Wiederherstellung {#fast-recovery}

1. Bestätige, dass die MCP-Server-Konfiguration korrekt ist (`mcp list/get` in deinem Client).
2. Führe expliziten Re-Login für den Server aus.
3. Versuche zuerst einen schreibgeschützten Aufruf.
4. Setze den unterbrochenen Workflow ab dem fehlgeschlagenen Schritt fort.

## Was für Bug-Reports zu erfassen ist {#what-to-capture-for-bug-reports}

- Zeitstempel des Fehlers (UTC)
- Client und Version
- Server-Endpoint
- Fehler-Payload (geschwärzt)
- Ob Refresh erwartet wurde, aber nicht stattfand

## Fortsetzungs-Prompt {#resume-prompt}

```text
Resume from the failed step using existing successful results from this session. Do not rerun completed steps.
```
