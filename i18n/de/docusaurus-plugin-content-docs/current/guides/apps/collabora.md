---
sidebar_label: Collabora
description: Erfahre, wie du Collabora Online Development Edition (CODE) mit Nextcloud für die kollaborative Dokumentenbearbeitung einrichtest und betreibst
---

# Collabora ausführen

## Einführung

Die **Collabora Online Development Edition (CODE)** ist ein Server, der die Online-Dokumentenbearbeitung bereitstellt. Sie ermöglicht die kollaborative Bearbeitung gängiger Bürodokumente und dient als Open-Source-Alternative zu Office365.

Dieser Leitfaden zeigt die Installation anhand eines Nextcloud-Beispiels – von der ersten Einrichtung bis zum Erstellen und Öffnen deines ersten Dokuments.

### Anforderungen

1. Installierte und konfigurierte Nextcloud-Version 29 oder höher, mit [Nextcloud Office](https://apps.nextcloud.com/apps/richdocuments) installiert
2. mStudio mit einem Hosting-Plan, der [containerisierte Workloads](/docs/v2/platform/workloads/containers) unterstützt
3. Ausreichend freier RAM (siehe Dashboard)
4. Eine bereits vorhandene Subdomain für CODE (z.B. `code.meine-domain.tld`)

### Weitere Ressourcen

- [Nextcloud](https://nextcloud.com/)
- [Collabora](https://www.collaboraonline.com/de/code/)
- [Collabora Docker-Dokumentation](https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html#how-to-grab-the-code-image-from-docker-image)
- [Docker Hub CODE](https://hub.docker.com/r/collabora/code)

:::note

Wir gehen davon aus, dass ein funktionierendes Nextcloud bereits installiert und konfiguriert ist. Es ist wichtig, dass die App [Nextcloud Office](https://apps.nextcloud.com/apps/richdocuments) auch im Backend von Nextcloud installiert ist. Falls sie noch nicht installiert ist, kannst du sie über den Nextcloud App Store hinzufügen.

Collabora/CODE kann entweder als separate Instanz in einem eigenen Projekt oder pro Nextcloud-Instanz betrieben werden, je nach Anwendungsfall. Beide Setups sind möglich: entweder eine CODE-Instanz pro Nextcloud oder eine zentrale CODE-Instanz für mehrere Nextclouds.

:::

## Wie starte ich den Container?

### Mit der mStudio UI

Gehe im mStudio zu deinem Projekt und wähle **„Container erstellen“**. Ein geführter Dialog öffnet sich, um dir bei der Container-Einrichtung zu helfen.

Zuerst gib eine Beschreibung ein – dies ist ein Freitextfeld, das zur Identifizierung des Containers verwendet wird. Gib zum Beispiel **„collabora/code“** ein.

Als Nächstes wirst du nach dem Image-Namen gefragt. Du kannst diesen auf [Docker Hub](https://hub.docker.com/r/collabora/code) finden, in diesem Fall ist es `collabora/code`. Gib diesen Wert ein und bestätige mit **„Weiter“**.

#### Entrypoint und Volume

- Der **Entrypoint** kann unverändert bleiben
- Im nächsten Abschnitt kannst du ein **Volume** (persistente Speicherung) erstellen. Dies ist für `collabora/code` nicht zwingend erforderlich, daher kannst du diesen Schritt überspringen

#### Umgebungsvariablen

Im nächsten Abschnitt **„Umgebungsvariablen hinzufügen“** müssen wir einige Anpassungen vornehmen. Klicke auf **„Variable hinzufügen“** – zwei Eingabefelder (Key & Value) erscheinen.

Jetzt hängt es davon ab, ob `collabora/code` für **eine einzelne** Nextcloud-Instanz im selben Projekt oder für **mehrere** Nextcloud-Instanzen verwendet wird. Ersetze `code.meine-domain.tld` durch deine tatsächliche Subdomain.

**Für eine einzelne Nextcloud-Instanz im selben Projekt:**

```
extra_params=--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld
```

**Für mehrere Nextcloud-Instanzen:**

```
aliasgroup1=https://.*:443
```

```
extra_params=--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld
```

:::note

`aliasgroup1=https://.*:443` erlaubt den Zugriff von **allen** externen Domains. Für bessere Sicherheit kannst du ein restriktiveres Domain-Muster verwenden – siehe die [Dokumentation](https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html#how-to-grab-the-code-image-from-docker-image).

:::

Sobald du den gewünschten Wert eingegeben hast, klicke auf **„Speichern“**. Im letzten Abschnitt wirst du nach dem **Port** gefragt – du kannst dies unverändert lassen. Klicke auf **„Container erstellen“**, um den Container zu erstellen und zu starten.

### Alternative: Mit dem Befehl `mw container run`

Du kannst auch den Befehl `mw container run` verwenden, um direkt einen Collabora-Container über die Kommandozeile zu erstellen und zu starten. Dieser Ansatz ähnelt der Verwendung der Docker CLI und ermöglicht es dir, alle Containerparameter in einem einzigen Befehl anzugeben.

Für eine einzelne Nextcloud-Instanz im selben Projekt:

```bash
mw container run \
  --name collabora \
  --description "Collabora Online Development Edition" \
  --publish 9980/tcp \
  --env "extra_params=--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld" \
  --create-volumes \
  collabora/code
```

Für mehrere Nextcloud-Instanzen:

```bash
mw container run \
  --name collabora \
  --description "Collabora Online Development Edition" \
  --publish 9980/tcp \
  --env "extra_params=--o:aliasgroup1=https://.*:443 --o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld" \
  --create-volumes \
  collabora/code
```

Stelle sicher, dass du `code.meine-domain.tld` durch deine tatsächliche Subdomain ersetzt. Das `--publish`-Flag öffnet den Port 9980, der der Standardport für Collabora ist. Das `--name`-Flag legt den Containernamen fest, der auch als interner DNS-Name verwendet wird.

Nachdem du den Container erstellt hast, musst du ihm noch eine Domain zuweisen, wie im Abschnitt "Domain zuweisen" unten beschrieben.

### Alternative: Mit dem Befehl `mw stack deploy`

Alternativ kannst du den Befehl `mw stack deploy` verwenden, der mit Docker Compose kompatibel ist. Dieser Ansatz ermöglicht es dir, deine Containerkonfiguration in einer YAML-Datei zu definieren und sie mit einem einzigen Befehl bereitzustellen.

Erstelle zuerst eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
services:
  collabora:
    image: collabora/code
    ports:
      - "9980/tcp"
    environment:
      # Für eine einzelne Nextcloud-Instanz im selben Projekt:
      extra_params: "--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld"
      # Für mehrere Nextcloud-Instanzen (aktiviere diese zwei Zeilen und kommentiere die Zeile oben aus):
      # aliasgroup1: "https://.*:443"
      # extra_params: "--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.meine-domain.tld"
```

Stelle sicher, dass du `code.meine-domain.tld` durch deine tatsächliche Subdomain ersetzt. Wähle die entsprechende `extra_params`-Konfiguration basierend auf deinem Anwendungsfall (einzelne oder mehrere Nextcloud-Instanzen).

Dann stelle den Container mit dem Befehl `mw stack deploy` bereit:

```bash
mw stack deploy
```

Dieser Befehl liest die `docker-compose.yml`-Datei aus dem aktuellen Verzeichnis und stellt sie in deinem Standard-Stack bereit. Wenn du eine andere Datei oder einen anderen Stack angeben möchtest, kannst du die folgenden Optionen verwenden:

```bash
mw stack deploy --compose-file=/path/to/docker-compose.yml --stack-id=dein-stack-id
```

Nachdem du den Container bereitgestellt hast, musst du ihm noch eine Domain zuweisen. Du kannst dies über die mStudio UI tun, wie im Abschnitt "Domain zuweisen" oben beschrieben.

### Domain zuweisen

Wechsle jetzt zum Abschnitt **Domains** und verlinke `code.meine-domain.tld` mit deinem Container. Wähle die Domain aus und setze das Ziel auf den gerade erstellten Container.

Alternativ kannst du den CLI-Befehl `mw domain virtualhost create` mit dem Flag `--path-to-container` verwenden.

## Integration in Nextcloud

Damit Nextcloud mit `collabora/code` kommunizieren kann, musst du es im Backend von Nextcloud konfigurieren. Melde dich als **Admin-Benutzer** (Admin-Rechte erforderlich!) bei deinem Nextcloud an.

Navigiere zu **Verwaltungseinstellungen** > **Office**. Wähle **„Eigenen Server verwenden“** und fülle das Feld wie folgt aus:

### Einzelne Instanz im selben Projekt

Gib im Feld **„URL (und Port) des Collabora Online-Servers“** den Containernamen ein – zum Beispiel `http://collabora:9980` (der Hostname entspricht dem Containernamen). Aktiviere das Kontrollkästchen **„Zertifikatsüberprüfung deaktivieren“**.

Du solltest jetzt eine grüne Bestätigungsnachricht sehen:

```
Collabora Online server is reachable.
Collabora Online Development Edition 24.04.13.2 ded56d8ff7
URL used by browser: https://code.your-domain.tld
Nextcloud URL used by Collabora: https://nextcloud.your-domain.tld
```

### Instanz für mehrere Nextclouds

Gib die öffentlich zugängliche URL des Collabora-Servers ein, z.B. `https://code.meine-domain.tld`. Das Kontrollkästchen zur Zertifikatsüberprüfung **muss nicht aktiviert** werden, wenn ein gültiges SSL-Zertifikat (z.B. Let’s Encrypt) vorhanden ist.

Du erhältst auch die grüne Erfolgsmeldung, wenn alles korrekt ist:

```
Collabora Online server is reachable.
Collabora Online Development Edition 24.04.13.2 ded56d8ff7
URL used by browser: https://code.my-domain.tld
Nextcloud URL used by Collabora: https://nextcloud.other-domain.tld
```

## Dokument erstellen

Du kannst ein neues Dokument direkt in Nextcloud erstellen: Gehe zum Abschnitt **Dateien** und klicke auf **„+ Neu“**, um dein erstes Dokument zu erstellen und zu bearbeiten.

Wenn du mit anderen Benutzern an demselben Dokument zusammenarbeiten möchtest, kannst du dies direkt im Browser tun – öffne einfach das Dokument.
