---
title: Viele E-Mail-Adressen aus einer CSV-Datei erstellen
description: |
  Dieses Beispiel zeigt, wie du viele E-Mail-Adressen aus einer CSV-Datei erstellen kannst.
---

# Viele E-Mail-Adressen aus einer CSV-Datei erstellen

## Kontext

Angenommen, du hast eine CSV-Datei mit einer Liste von Benutzern und E-Mail-Adressen, die du in dein Projekt importieren möchtest. Dieses Beispiel zeigt, wie du das mit der mittwald CLI machen kannst.

Für dieses Beispiel gehen wir davon aus, dass die CSV-Datei folgende Struktur hat:

```csv
Alice,Müller,alice@mueller.example,secret
Bob,Meier,bob@meier.example,secret
```

## Projekt-Kontext setzen

1. Ermittle die ID des Projekts, in das du die E-Mail-Adressen importieren möchtest, z.B. mit dem Befehl `mw project list`.
2. Setze den Projekt-Kontext, indem du `mw context set --project-id <ID EINFÜGEN>` ausführst.

## Die CSV-Datei importieren

Benutze den Befehl [`mw mail address create`](../../reference/mail#mw-mail-address-create), um E-Mail-Adressen aus einer CSV-Datei zu erstellen:

```bash
#        (1)       (2)
while IFS=, read -r first_name last_name email password < users.csv ; do
  mw mail address create -q \
    --address "$email" \
    --password "$password" \
done
```

Einige Anpassungen, die möglicherweise nötig sind:

1. Passe die `IFS`-Variable an das Trennzeichen an, das in deiner CSV-Datei verwendet wird (üblicherweise `,` oder `;`).
2. Passe die Argumente von `read -r` an die tatsächlichen Spalten in deiner CSV-Datei an.
