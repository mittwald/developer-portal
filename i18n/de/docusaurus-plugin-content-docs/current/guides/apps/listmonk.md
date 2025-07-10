---
sidebar_label: Listmonk
description: Installiere und betreibe Listmonk containerisiert als Self-hosted Newsletter-Tool.
---

# Listmonk ausführen

## Einführung

**Listmonk** ist ein leistungsfähiges Self-Hosted-Tool zur Verwaltung und zum Versand von Newslettern. Es bietet eine eigenständige Alternative zu kommerziellen Plattformen wie Mailchimp oder Sendinblue.

Die Anwendung kombiniert eine moderne Weboberfläche mit einem performanten Backend und nutzt PostgreSQL als Datenbank.

### Voraussetzungen

1. **mStudio-Projekt mit spaceServer oder proSpace dedicated**
2. **Laufender PostgreSQL-Container**  
   → Beachte die Anleitung im Abschnitt [PostgreSQL](./postgresql.md) und halte DB-Zugangsdaten bereit.
3. **Angelegte Subdomain** für den Webzugriff (z. B. `listmonk.meine-domain.de`)

### Weiterführende Links

- [Offizielle Website – Listmonk](https://listmonk.app/)
- [Listmonk Dokumentation](https://listmonk.app/docs/configuration/)
- [Docker Hub – listmonk](https://hub.docker.com/r/listmonk/listmonk)

---

## Wie starte ich den Container?

### 1. Container anlegen

- Öffne dein Projekt in **mStudio**
- Navigiere zu **"Container" → "Neu anlegen"**
- Als Beschreibung kannst du z. B. `"listmonk"` angeben
- Im nächsten Schritt gibst du folgendes Image an:

`listmonk/listmonk`

### 2. Entrypoint für Erstinstallation setzen

Für die erste Ausführung muss Listmonk initialisiert werden. Wähle bei _Command_ die Option **"Benutzerdefiniert"** und trage ein:

`./listmonk --install --yes`

> Dieser Befehl legt die nötigen Tabellen in der PostgreSQL-Datenbank an und startet die Weboberfläche.

### 3. Volume anlegen

Füge ein neues Volume hinzu:

- **Pfad im Container:** `/listmonk/uploads`

> :::warning
> Der Container verhält sich wie ein temporärer Speicher. Verwende das Volume unbedingt, um Uploads dauerhaft zu sichern.
> :::

### 4. Umgebungsvariablen definieren

Klicke auf **"Texteingabe"** und gib folgende Umgebungsvariablen ein:

```
LISTMONK_app__address=0.0.0.0:9000
LISTMONK_db__host=<DB_HOST>
LISTMONK_db__port=5432
LISTMONK_db__user=<DB_USER>
LISTMONK_db__password=<DB_PASSWORD>
LISTMONK_db__database=<DB_NAME>
```

> Ersetze `<...>` mit den Werten deines PostgreSQL-Containers.

### 5. Port festlegen

Der Standardport `9000/tcp` wird automatisch gesetzt und kann so belassen werden.

### 6. Container starten

Abschließend wird der Container erstellt. Nach kurzer Zeit sollte der Status auf **"läuft"** stehen. Die Datenbank-Initialisierung ist damit abgeschlossen.

---

## Weitere Einstellungen

### Entrypoint ändern

Nach der erfolgreichen Installation muss der Entrypoint auf den regulären Startbefehl geändert werden:

```
./listmonk
```

Der Container wird anschließend **neu erstellt (recreated)**.

### Domain mit dem Container verknüpfen

Damit der Aufruf funktioniert, muss die angelegte Domain mit dem Container verknüpft werden:

1.  Klicke im Menü auf der linken Seite auf **"Domains"**.
    
2.  Wähle die entsprechende Domain, z. B. `listmonk.meine-domain.de`.
    
3.  Es öffnet sich ein Menü – wähle unter **"Domainziel einstellen"** den Eintrag **"Container"** aus.
    
4.  Wähle im Dropdown-Menü den Namen des Containers (standardmäßig `"listmonk"`).
    
5.  Der Port wird automatisch gesetzt.
    
6.  Bestätige die Einstellung mit dem grünen **"Speichern"**-Button unten rechts.
    

Kurz darauf kannst du den Aufruf testen und solltest die Login-Seite von Listmonk sehen. Lege nun über die Weboberfläche den **Admin-User** an und führe die weiteren Einstellungen direkt dort durch.
