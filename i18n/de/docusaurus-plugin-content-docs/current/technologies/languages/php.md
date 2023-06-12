---
title: PHP
---

## Deine PHP-Konfiguration anpassen

### Für das gesamte Projekt

Wenn Du Deine PHP-Konfiguration für das gesamte Projekt anpassen möchtest, kannst Du Änderungen an der Datei `~/.config/php/php.ini` vornehmen oder eine neue `.ini`-Datei zum Verzeichnis `~/.config/php/php.d` hinzufügen. Änderungen an diesen Dateien werden automatisch erkannt, und der PHP-FPM-Dienst wird neu gestartet.

### Pro Verzeichnis

Wenn Du Deine PHP-Konfiguration für ein bestimmtes Verzeichnis anpassen möchtest, erstelle eine `.user.ini`-Datei in diesem Verzeichnis.[^1] Diese Datei wird von PHP automatisch eingelesen und überschreibt die Standardkonfiguration.

:::caution

Beachte bitte, dass PHP die `.user.ini`-Datei für den Wert speichert, der in der Einstellung `user_ini.cache_ttl` festgelegt ist (der standardmäßig 5 Minuten beträgt).

:::

[^1]: https://www.php.net/manual/de/configuration.file.per-user.php
