---
sidebar_label: Node.js-App zu Container migrieren
description: Schritt-für-Schritt-Anleitung für die Migration einer mittwald mStudio Node.js-App zu einem Container
---

# Node.js-App in einem Container betreiben – Migration-Guide

## Einführung

Dieser Guide zeigt dir, wie du deine bestehende Node.js-Anwendung im mittwald mStudio von der klassischen Node.js-App-Umgebung in einen Container migrieren kannst.

### Vorteile der Container-Migration

- **System-Abhängigkeiten**: Alle benötigten System-Binaries und -Tools sind verfügbar
- **Reproduzierbare Umgebung**: Identische Entwicklungs- und Produktionsumgebung
- **Flexibilität**: Freie Wahl des Base-Images und der Konfiguration

## Voraussetzungen

- Zugriff auf dein mittwald mStudio-Projekt
- SSH-Zugang zu deiner bestehenden Node.js-App
- Ein Hosting-Tarif, der [Container-Workloads](/docs/v2/platform/workloads/containers) unterstützt

## Migrationsprozess

### Schritt 1: Aktuelle Node.js-App stoppen

Verbinde dich per SSH mit deiner Node.js-App und stoppe die laufende Anwendung:

```bash
# Prozesse anzeigen
mittnitectl job list

# Ausgabe:
# The following processes are managed, and controllable:
#   ▶︎ node (running; reason=started; pid=203)

# Node.js-Prozess stoppen
mittnitectl job stop node

# Ausgabe:
# ⏸️  stopping job node
# 🕑 waiting for job node to stop
# 😵 job node stopped
```

### Schritt 2: Anwendungscode vorbereiten

Du hast zwei Möglichkeiten, deinen Anwendungscode für den Container bereitzustellen:

#### Option A: Code im Projekt duplizieren

Verbinde dich per SSH mit deiner Node.js-App und kopiere das Verzeichnis:

```bash
# Beispiel: Kopieren des Anwendungsverzeichnisses
# Hinweis: Pfade müssen an deine tatsächliche Verzeichnisstruktur angepasst werden
cp -r /html/nodejs-app /html/nodejs-container
```

#### Option B: Code neu deployen

Übertrage die Dateien auf deine gewohnte Weise, z.B. per Git, CI/CD-Pipeline oder manuell via `scp`/`rsync`:

```bash
# Beispiel mit rsync
rsync -avz ./my-app/ user@server:/html/nodejs-container/
```

### Schritt 3: Container konfigurieren und starten

1. **Öffne das mStudio** und navigiere zu deinem Projekt

2. **Gehe in die Container-Oberfläche** innerhalb deines mStudio-Projekts, lege einen neuen Stack an oder öffne einen bestehenden und wähle im Container-Bereich des Stacks "Anlegen". Konfiguriere dann:

   **Container-Image:**
   - `node:24` für eine spezifische Version
   - `node:lts` für die aktuelle LTS-Version
   - Oder deine gewünschte Versionsnummer

   **Command:**

   ```bash
   # Falls Code dupliziert wurde (und yarn install bereits durchgeführt wurde):
   sh -c "cd /app && yarn start"

   # Falls Code neu deployed wurde (und noch kein yarn install durchgeführt wurde):
   sh -c "cd /app && yarn install && yarn start"
   ```

   **Volume-Konfiguration:**
   - **Pfad im Projekt**: `/html/nodejs-container` (oder dein gewähltes Verzeichnis)
   - **Mount Point im Container**: `/app`

   **Umgebungsvariablen:**

   ```env
   NODE_ENV=production
   PORT=3000  # Port deiner Wahl
   ```

   **Port-Konfiguration:**
   - Füge den gleichen Port wie bei den Umgebungsvariablen hinzu

### Schritt 4: Domain umstellen

Nach erfolgreichem Start des Containers:

1. Navigiere zu den Domain-Einstellungen im mStudio
2. Ändere das Ziel deiner Domain von der Node.js-App zum neuen Container

### Schritt 5: Verifizierung und Aufräumen

1. **Teste deine Anwendung** über die Domain
2. **Überprüfe die Logs** des Containers auf Fehler
3. **Monitoring**: Beobachte die Anwendung für einige Zeit

Wenn alles einwandfrei funktioniert:

- Lösche die alte Node.js-App aus deinem Projekt
- Entferne nicht mehr benötigte Dateien

## Fehlerbehebung

### Container startet nicht

- Überprüfe die Logs im mStudio
- Stelle sicher, dass alle Umgebungsvariablen korrekt gesetzt sind
- Verifiziere, dass der Startbefehl korrekt ist

### Anwendung ist nicht erreichbar

- Überprüfe die Port-Konfiguration
- Stelle sicher, dass die Anwendung auf dem konfigurierten Port lauscht
- Kontrolliere die Domain-Einstellungen

### Abhängigkeiten fehlen

Falls System-Dependencies fehlen, erwäge:

- Ein anderes Base-Image zu verwenden
- Ein eigenes Dockerfile zu erstellen mit den benötigten Dependencies

## Weiterführende Ressourcen

- [Container Workloads Dokumentation](/docs/v2/platform/workloads/containers)
- [Node.js Apps Dokumentation](/docs/v2/platform/workloads/nodejs)
- [mittwald CLI Referenz](/docs/v2/cli/reference/container)
