---
title: DNS, Forwarding, Mailbox und SSL konfigurieren
description: Vollständiges Domain- und Mail-Setup mit Zertifikatvalidierung
useCases:
  - domains-001-setup-email-forwarding
  - domains-002-configure-dns
  - domains-003-setup-mailbox
  - domains-004-ssl-certificate
destructive: true
---

## Copy-Paste-Prompt {#copy-paste-prompt}

```text
Set up domain operations for my mittwald project.

I need:
1) DNS record validation/update,
2) email forwarding and mailbox setup,
3) SSL certificate setup/validation,
4) final operational summary with IDs.

Ask before any write operation.
```

## Was der Agent automatisch tun wird {#what-agent-will-do}

- Domain/Mail/Zertifikat-Status entdecken.
- Genehmigte DNS/Mail/SSL-Änderungen ausführen.
- Eine vollständige betriebliche Zusammenfassung zurückgeben.

## Was du (Mensch) noch tun musst {#what-you-must-do}

- Autoritative Domain und Adressen bestätigen.
- Jeden Schreibvorgang genehmigen.
- Externe DNS-Propagationserwartungen validieren.

## Verifizierungs-Prompt {#verification-prompt}

```text
Re-list DNS records, mail addresses/forwarding, and certificate status for the target domain. Confirm all requested changes are active.
```

## Rollback/Cleanup-Prompt {#rollback-cleanup-prompt}

```text
Revert DNS/mail changes created in this session and restore the prior known-good state using the recorded IDs.
```
