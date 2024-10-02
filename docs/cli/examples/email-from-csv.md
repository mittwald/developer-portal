---
title: Creating many email addresses from a CSV file
description: |
  This example demonstrates how to create many email addresses from a CSV file.
---

# Creating many email addresses from a CSV file

## Context

Imagine you have a CSV file with a list of users and email addresses that you want to import into your project. This example demonstrates how to do that using the mittwald CLI.

For the purposes of this example, we will assume that the CSV file has the following structure:

```csv
Alice,Müller,alice@mueller.example,secret
Bob,Meier,bob@meier.example,secret
```

## Setting the project context

1. Obtain the ID of the project into which you want to import the email addresses, for example using the `mw project list` command.
2. Set the project context by running `mw context set --project-id <INSERT ID>`.

## Importing the CSV file

Use the [`mw mail address create` command](../../reference/mail#mw-mail-address-create) to create email addresses from a CSV file:

```bash
#        (1)       (2)
while IFS=, read -r first_name last_name email password < users.csv ; do
  mw mail address create -q \
    --address "$email" \
    --password "$password" \
done
```

Some customizations that may be needed:

1. Adjust the `IFS` variable to the separator character used in your CSV file (usually `,` or `;`).
2. Adjust the arguments to `read -r` to match the actual columns in your CSV file.
