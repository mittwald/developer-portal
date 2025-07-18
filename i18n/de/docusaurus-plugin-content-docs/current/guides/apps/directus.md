---
sidebar_label: Directus
description: Erfahre, wie du die Open-Source-Plattform Directus containerisiert betreibst und mit einer Datenbank verbindest.
---

# Directus ausführen

## Einführung

> Directus ist eine Open-Source-Datenplattform, die eine intuitive No-Code- und Low-Code-Oberfläche für die Verwaltung von Datenbanken bietet. Es fungiert als API-Wrapper für SQL-Datenbanken und ermöglicht es, Inhalte über eine automatisch generierte REST- und GraphQL-API bereitzustellen. Mit Directus können Benutzer Datenmodelle erstellen, Benutzerrechte verwalten und Workflows optimieren – alles ohne komplexe Backend-Entwicklung. Die Plattform eignet sich sowohl für Entwickler als auch für Nicht-Entwickler und wird häufig für CMS, datengetriebene Anwendungen und Headless-Architekturen genutzt.  
> – ChatGPT

> Directus ist ein Backend für die Erstellung von Projekten. Verbinden Sie es mit Ihrer Datenbank, Ihrem Asset-Speicher und externen Diensten, und Sie erhalten sofort umfangreiche Entwicklerwerkzeuge (Data Engine) und eine umfassende Webanwendung (Data Studio) für die Arbeit mit Ihren Daten. Eine granulare und leistungsstarke Zugriffskontrolle bedeutet, dass Benutzer nur die Daten sehen, interagieren und erstellen können, die ihrer Rolle entsprechen, die von der Engine und dem Studio verwendet wird.  
> – [Directus Dokumentation](https://directus.io/docs/getting-started/overview)

## Wie starte ich den Container?

Als Image für den Container verwenden wir `directus/directus` von [Docker Hub](https://hub.docker.com/r/directus/directus).

- **Entrypoint:** Unverändert lassen  
- **Command:** Keine Änderung erforderlich

### Volumes

Für persistente Daten speicherst du verschiedene Pfade als Volumes. Diese können optional gesetzt werden – je nach Setup:

- `/directus/database` (nur erforderlich, wenn SQLite verwendet wird)
- `/directus/uploads`
- `/directus/extensions`
- `/directus/templates`

> :::note  
> Du kannst neue Volumes über die mStudio UI hinzufügen. Jeder Pfad oben sollte als Mount Point gesetzt werden.  
> :::

### Umgebungsvariablen

Für eine einfache Erstinbetriebnahme sind keine Umgebungsvariablen erforderlich. Ohne Konfiguration wird allerdings keine Datenbank angebunden.

Für einen sinnvolleren Betrieb solltest du mindestens folgende Parameter setzen:

```
ADMIN_EMAIL=mail@mail.de
ADMIN_PASSWORD=secretpassword
SECRET=12343abcdef
```

### Betrieb

Erreichbar ist der Container, wenn man ihn als Ziel einer Domain definiert. Der Aufruf erfolgt dann über domain.tld/admin, da Directus das Backend darstellt.

Im Rahmen des Projektbackups werden die Daten deiner Volumes gesichert und können bei Bedarf zurückgespielt werden.

### Integration

Directus kann mit den unterschiedlichsten DB-Clients arbeiten. Genauer ist das in der Dokumentation von Directus beschrieben. Hierbei gibt es zwei wesentliche Unterschiede:

-   DB-file: Wenn als `DB-CLient=sqlite3` gesetzt ist, wird die Datenbank aus einer Datei geladen. Den Pfad zu dieser Datei muss man dann über den Parameter `DB_FILENAME` gesetzt werden.
-   DB-Connection: Wird eine Datenbankverbindung zu einem DB-Server benötigt, sind folgende Parameter erforderlich:
    -   `DB_HOST`
    -   `DB_USER`
    -   `DB_DATABASE`
    -   `DB_PASSWORD`
    -   `DB_PORT`
