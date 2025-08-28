---
sidebar_label: PostgreSQL
description: Starte und betreibe eine PostgreSQL-Datenbank containerisiert im Projekt.
---

# PostgreSQL ausführen

## Einführung

PostgreSQL ist ein leistungsstarkes, objektrelationales Datenbankmanagementsystem (ORDBMS), das für seine Stabilität, Skalierbarkeit und Erweiterbarkeit bekannt ist. Es ist Open Source und unterstützt eine Vielzahl von SQL-Funktionen, einschließlich komplexer Abfragen, Transaktionen, Indizierung und JSON-Daten.

PostgreSQL eignet sich sowohl für kleine Anwendungen als auch für große, datenintensive Systeme und wird weltweit von Unternehmen und Entwicklern genutzt.

## Wie starte ich den Container?

Gehe in deinem Projekt im **mStudio** unter **Container** auf **Neu anlegen**. Die Bezeichnung des Containers ist frei wählbar.

Im nächsten Schritt steht dir PostgreSQL als **Kurzwahl-Button** zur Verfügung. Im Hintergrund wird das offizielle [PostgreSQL Docker Image](https://hub.docker.com/_/postgres) verwendet.

- **Entrypoint:** Standard belassen  
- **Command:** Standard belassen

### Volumes

Füge zwei Volumes hinzu:

- `/var/lib/postgresql/data`  
  > Speichert die Nutzdaten der Datenbank (wird von PostgreSQL automatisch genutzt)

- `/mnt`  
  > Dieser Pfad dient dazu, Datenbank-Dumps oder Backups im `/files`-Verzeichnis deines Projekts abzulegen

> :::note  
> `/mnt` muss mit einem Projektpfad verknüpft werden, z. B. `/files`  
> :::

### Umgebungsvariablen

Folgende Umgebungsvariablen sollten gesetzt werden:

```
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
```

## Betrieb

Deine PostgreSQL-Daten werden im Rahmen des regelmäßigen Projektbackups gesichert. Für Datenbanken wird jedoch **dringend empfohlen**, zusätzlich eigene Dumps zu erstellen, um Konsistenz und Wiederherstellbarkeit sicherzustellen.

Ein Dump kann direkt im Container abgelegt werden. Beispielbefehl für ein manuelles Backup per SSH:

```
ssh user@user.de@c-ywdpqz@ssh.gestringen.project.host 'pg_dump -U myuser mydatabase -f /mnt/mydatabase.sql'
```

Automatisierungen sind über Cronjobs problemlos möglich.

## Integration

Viele Anwendungen nutzen PostgreSQL als primäre Datenbank. Die Anbindung erfolgt in der Regel über Umgebungsvariablen mit folgenden Parametern:

- `DB_HOST`  
- `DB_PORT`  
- `DB_NAME`  
- `DB_USER`  
- `DB_PASSWORD`
