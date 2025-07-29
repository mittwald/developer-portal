---
title: Ausschluss von Verzeichnissen aus dem Backup
sidebar_label: Backup-Ausschlüsse
tags:
  - Backups
description: |
  Erfahre, wie du bestimmte Verzeichnisse von deinem Backup ausschließen kannst.
---

Viele Anwendungen erzeugen große Mengen an **temporären oder wiederherstellbaren Cache-Daten** (z.B. `node_modules`, Thumbnail-Caches). Diese Daten müssen normalerweise **nicht** in Backups aufgenommen werden. Die [**Cache Directory Tagging Specification**](https://bford.info/cachedir/) existiert, um Verzeichnisse zu kennzeichnen, die solche Daten enthalten. Sie definiert eine kleine Tag-Datei namens `CACHEDIR.TAG`, die im Wurzelverzeichnis eines Cache-Baums gespeichert wird. Diese Verzeichnisse werden dann nicht mehr in unseren Backups enthalten sein.

Für die automatisch installierten Apps in mStudio haben wir die Datei bereits an entsprechenden Orten platziert.

:::caution

Dateien, die vom Backup ausgeschlossen sind, können nicht wiederhergestellt werden – nicht einmal von mittwald. Missbrauche diese Funktion nicht, um Speicherplatz zu sparen, indem du wichtige Dateien vom Backup ausschließt.

:::

## TL;DR

Erstelle eine Datei `CACHEDIR.TAG` in jedem Cache-Verzeichnis mit **genau** der folgenden ersten Zeile:

```
Signature: 8a477f597d28d172789f06886806bc55
```

## Anforderungen

Es gibt nur wenige Anforderungen für eine gültige `CACHEDIR.TAG`-Datei:

1. **Dateiname:** Muss genau `CACHEDIR.TAG` sein (Großschreibung wichtig)
2. **Signatur-Header:** Die erste Zeile _muss_ genau lauten: `Signature: 8a477f597d28d172789f06886806bc55`
3. **Platzierung:** Ein einzelnes `CACHEDIR.TAG` im obersten Cache-Verzeichnis reicht aus, um den _gesamten_ darunter liegenden Verzeichnisbaum als Cache zu kennzeichnen

## Wann solltest du ein Cache-Verzeichnis kennzeichnen?

Verwende `CACHEDIR.TAG` für Verzeichnisse, deren Inhalt **regenerierbar** ist – d.h. Daten, die aus anderen Quellen geladen oder jederzeit regeneriert werden können. Typische Beispiele:

- Paket-/Build-Caches (Composer, npm, Yarn)
- Anwendungs-Caches (wie das `var/cache`-Verzeichnis von TYPO3)
- Generierte Artefakte (Thumbnails)
- Backup-Verzeichnisse, die von der Anwendung verwaltet werden (z.B. Updraft)
