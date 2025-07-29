---
sidebar_label: Directus
description: Erfahre, wie du die Open-Source-Plattform Directus in einer containerisierten Umgebung betreibst und sie mit einer Datenbank verbindest.
---

# Directus ausführen

## Einführung

Directus ist eine Open-Source-Datenplattform, die eine intuitive No-Code- und Low-Code-Oberfläche zur Verwaltung von Datenbanken bietet. Es fungiert als API-Wrapper für SQL-Datenbanken und ermöglicht es, Inhalte über eine automatisch generierte REST- und GraphQL-API bereitzustellen. Mit Directus können Benutzer Datenmodelle erstellen, Benutzerberechtigungen verwalten und Workflows optimieren – alles ohne komplexe Backend-Entwicklung. Die Plattform eignet sich sowohl für Entwickler als auch für Nicht-Entwickler und wird häufig für CMS, datengestützte Anwendungen und Headless-Architekturen verwendet.

> Directus ist ein Backend zum Erstellen von Projekten. Verbinde es mit deiner Datenbank, deinem Asset-Speicher und externen Diensten, und du erhältst sofort umfangreiche Entwickler-Tools (Data Engine) und eine umfassende Webanwendung (Data Studio) zur Arbeit mit deinen Daten. Granulare und leistungsstarke Zugriffskontrollen sorgen dafür, dass Benutzer nur die Daten sehen, mit denen sie interagieren und die sie erstellen können, die ihrer Rolle entsprechen, wie sie von der Engine und dem Studio verwendet werden.  
> – [Directus Dokumentation](https://directus.io/docs/getting-started/overview)

## Voraussetzungen

Für optimale Leistung für einen Produktiveinsatz wird dringend empfohlen, eine Managed MySQL-Datenbank anstelle von SQLite zu verwenden. Eine managed Datenbank bietet Vorteile wie verbesserte Leistung und Skalierbarkeit sowie automatische Backups und Wartung.

Du kannst eine managed MySQL-Datenbank direkt in der mittwald mStudio UI erstellen, bevor du Directus einrichtest. Alternativ kannst du CLI-Befehle wie `mw database mysql create` verwenden.

Die nach der Erstellung bereitgestellten Verbindungsdetails werden für die Konfiguration von Directus benötigt.

## Wie starte ich den Container?

Wir verwenden das `directus/directus` Image von [Docker Hub](https://hub.docker.com/r/directus/directus) für den Container.

### Verwendung der mStudio UI

Gehe im mStudio zu deinem Projekt und wähle **"Container erstellen"**. Ein geführter Dialog öffnet sich, um dir bei der Container-Einrichtung zu helfen.

Zuerst gib eine Beschreibung ein – dies ist ein Freitextfeld, das zur Identifizierung des Containers verwendet wird. Gib zum Beispiel **"Directus"** ein und klicke auf **"Weiter"**.

Als Nächstes wirst du nach dem Image-Namen gefragt. Gib `directus/directus` ein und bestätige mit **"Weiter"**.

#### Entrypoint und Befehl

- **Entrypoint:** Keine Änderungen erforderlich
- **Befehl:** Keine Änderungen erforderlich

#### Volumes

Für persistente Daten speicherst du verschiedene Pfade als Volumes. Diese können optional festgelegt werden, abhängig von deiner Einrichtung:

- `/directus/uploads`
- `/directus/extensions`
- `/directus/templates`
- `/directus/database` (nur wenn **keine** verwaltete MySQL-Datenbank oder eine Datenbank, die in einem anderen Container läuft, verwendet wird)

:::note  
Du kannst neue Volumes über die mStudio UI hinzufügen. Jeder oben genannte Pfad sollte als Mount-Punkt festgelegt werden.  
:::

#### Umgebungsvariablen

Um eine Verbindung zu einer von mittwald verwalteten MySQL-Datenbank herzustellen, musst du mehrere Umgebungsvariablen festlegen. Dazu gehören Authentifizierungsparameter und Datenbankverbindungsdetails.

Für eine ordnungsgemäße Einrichtung mit Managed MySQL-Datenbank setze die folgenden Parameter:

```
# Admin-Konto-Konfiguration
ADMIN_EMAIL=user@domain.example
ADMIN_PASSWORD=your_secret_password
SECRET=your_secret_value

# MySQL-Datenbankkonfiguration
DB_CLIENT=mysql
DB_HOST=mysql-XXXXXX.pg-YYYYYY.db.project.host
DB_PORT=3306
DB_DATABASE=mysql_XXXXXX
DB_USER=dbu_XXXXXX
DB_PASSWORD=your_database_password
```

Sobald du alle Umgebungsvariablen eingegeben hast, klicke auf **"Weiter"**. Im letzten Dialog wirst du nach dem **Port** gefragt – du kannst dies unverändert lassen. Klicke auf **"Container erstellen"**, um den Container zu erstellen und zu starten.

### Alternative: Verwendung des `mw container run` Befehls

Du kannst auch den `mw container run`-Befehl verwenden, um direkt einen Directus-Container über die Befehlszeile zu erstellen und zu starten. Dieser Ansatz ähnelt der Verwendung der Docker CLI und ermöglicht es dir, alle Containerparameter in einem einzigen Befehl anzugeben.

```bash
mw container run \
  --name directus \
  --description "Directus Headless CMS" \
  --publish 8055:8055 \
  --env "ADMIN_EMAIL=user@domain.example" \
  --env "ADMIN_PASSWORD=your_secret_password" \
  --env "SECRET=your_secret_value" \
  --env "DB_CLIENT=mysql" \
  --env "DB_HOST=mysql-XXXXXX.pg-YYYYYY.db.project.host" \
  --env "DB_PORT=3306" \
  --env "DB_DATABASE=mysql_XXXXXX" \
  --env "DB_USER=dbu_XXXXXX" \
  --env "DB_PASSWORD=your_database_password" \
  --volume "uploads:/directus/uploads" \
  --volume "extensions:/directus/extensions" \
  --volume "templates:/directus/templates" \
  directus/directus
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Konfigurationsdetails ersetzt. Nach der Erstellung des Containers musst du ihm noch eine Domain zuweisen.

### Alternative: Verwendung des `mw stack deploy` Befehls

Alternativ kannst du den `mw stack deploy` Befehl verwenden, der mit Docker Compose kompatibel ist. Dieser Ansatz ermöglicht es dir, deine Containerkonfiguration in einer YAML-Datei zu definieren und sie mit einem einzigen Befehl bereitzustellen.

Erstelle zuerst eine `docker-compose.yml` Datei mit folgendem Inhalt:

```yaml
services:
  directus:
    image: directus/directus
    ports:
      - 8055:8055
    volumes:
      - "uploads:/directus/uploads"
      - "extensions:/directus/extensions"
      - "templates:/directus/templates"
    environment:
      # Admin-Konto-Konfiguration
      ADMIN_EMAIL: "user@domain.example"
      ADMIN_PASSWORD: "your_secret_password"
      SECRET: "your_secret_value"

      # MySQL-Datenbankkonfiguration
      DB_CLIENT: "mysql"
      DB_HOST: "mysql-XXXXXX.pg-s-bymcdc.db.project.host"
      DB_PORT: "3306"
      DB_DATABASE: "mysql_XXXXXX"
      DB_USER: "dbu_XXXXXX"
      DB_PASSWORD: "your_database_password"
volumes:
  uploads: {}
  extensions: {}
  templates: {}
```

Stelle sicher, dass du die Platzhalterwerte durch deine tatsächlichen Konfigurationsdetails ersetzt. Dann kannst du den Container mit dem `mw stack deploy` Befehl bereitstellen:

```bash
mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml` Datei aus dem aktuellen Verzeichnis und stellt sie in deinem Standard-Stack bereit.

### Betrieb

Um deine Directus-Instanz aus dem öffentlichen Internet erreichbar zu machen, muss sie mit einer Domain verknüopft werden. Im Anschluss kannst du dein Directus-Backend über `https://<domain>/admin` erreichen.

Im Rahmen des Projekt-Backups sind die Daten aus deinen Volumes gesichert und können bei Bedarf wiederhergestellt werden.

### Integration

Directus kann mit einer Vielzahl von Datenbank-Clients arbeiten, aber wir empfehlen die Verwendung einer mittwald verwalteten MySQL-Datenbank für optimale Leistung und Zuverlässigkeit.

#### Verbindung zu einer mittwald MySQL-Datenbank

Um Directus mit deiner mittwald verwalteten MySQL-Datenbank zu verbinden:

1. Erstelle eine MySQL-Datenbank in der mittwald mStudio UI
2. Notiere die bereitgestellten Verbindungsdetails (Host, Port, Datenbankname, Benutzername und Passwort)
3. Konfiguriere die Umgebungsvariablen wie im obigen Abschnitt gezeigt
4. Starte deinen Directus-Container

Die für eine mittwald MySQL-Datenbank erforderlichen Verbindungsparameter sind:

- `DB_CLIENT=mysql` (gibt an, dass du MySQL verwendest)
- `DB_HOST` (der Hostname deines mittwald MySQL-Servers, folgt dem Muster `mysql-XXXXXX.pg-s-bymcdc.db.project.host`)
- `DB_PORT` (typischerweise 3306 für MySQL)
- `DB_DATABASE` (der Name deiner Datenbank, folgt typischerweise dem Muster `mysql_XXXXXX`)
- `DB_USER` (dein Datenbankbenutzername, folgt typischerweise dem Muster `dbu_XXXXXX`)
- `DB_PASSWORD` (dein Datenbankpasswort)
