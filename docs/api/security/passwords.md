# Passwortsicherheit

<!--
NOTE: This document is linked from various places with in the API reference.
DO NOT change the document ID or the header IDs
-->

Verschiedene API-Aufrufe erzwingen bestimmte Passwortrichtlinien. Dieses Dokument dient als Referenz für die verschiedenen Passwortrichtlinien, die von der mStudio-API durchgesetzt werden.

## MySQL-Benutzerpasswörter {#mysql}

Passwörter für MySQL-Benutzer müssen die folgenden Anforderungen erfüllen:

- mindestens 8 Zeichen lang
- mindestens einen Kleinbuchstaben
- mindestens einen Großbuchstaben
- mindestens eine Ziffer
- mindestens ein Sonderzeichen aus `#!~%^*_+-=?{}()<>|.,;`
- keine anderen Zeichen
- darf _nicht_ mit einem aus `-_;` beginnen

:::info

Einige dieser Passwort-Einschränkungen mögen auf den ersten Blick verwirrend wirken. Allerdings müssen MySQL-Benutzerpasswörter, die über das mStudio verwaltet werden, nicht nur den Anforderungen des mStudio selbst gerecht werden, sondern müssen auch kompatibel zu vielen CMSen und anderen Anwendungen sein, von denen einige ebenfalls ihre eigenen Anforderungen an Datenbankpasswörter anlegen.

:::
