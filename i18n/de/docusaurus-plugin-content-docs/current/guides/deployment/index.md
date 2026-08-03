---
title: Deployment-Anleitungen
sidebar_label: Überblick
sidebar_position: 1
description: >
  Ein Überblick über die verfügbaren Deployment-Strategien für die mittwald Cloud-Plattform und eine Hilfestellung, welche davon zu deinem Anwendungsfall passt.
tags:
  - Deployment
---

Es gibt mehr als einen Weg, eine Anwendung auf die mittwald Cloud-Plattform zu bringen. Diese Seite gibt dir einen Überblick über die verfügbaren Strategien und hilft dir dabei, die passende für dein Projekt auszuwählen.

## Zwei Laufzeitmodelle {#runtime-models}

Der größte Teil der Entscheidung ergibt sich aus einer einzigen Frage: **Soll deine Anwendung als Managed App oder als Container laufen?**

- **Managed Apps** laufen in einem Webspace, auf einer Laufzeitumgebung, die von mittwald bereitgestellt und gepflegt wird (PHP, Node.js oder statische Dateien). Du deployst _Quellcode_, in der Regel über SSH, und die Plattform kümmert sich um Webserver, Sprachlaufzeit, TLS-Zertifikate und Ähnliches. Das ist das klassische Modell für PHP-Anwendungen wie TYPO3, Shopware oder WordPress.
- **Container** führen ein Docker-Image aus, das du selbst baust. Du kontrollierst die komplette Laufzeitumgebung. Das ist die richtige Wahl für alles, was die Managed Runtimes nicht abdecken, oder wenn du reproduzierbare Builds möchtest. Die zugrundeliegenden Konzepte findest du unter [Container](/docs/v2/platform/workloads/containers/).

Wenn du dir unsicher bist, wie das zusammenhängt, wirf einen Blick auf den [Plattform-Überblick](/docs/v2/platform/overview/).

## Welche Strategie sollte ich verwenden? {#which-strategy}

| Deine Situation                                                                               | Empfohlene Strategie                                                                                                        |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Du hast Quellcode in Git, kein Dockerfile, und willst schnell einen laufenden Service         | [Zero-Conf-Deployment](#zero-conf)                                                                                          |
| Du hast eine App mit einem KI-Tool gebaut (Replit, Lovable, Cursor) und willst sie live sehen | [Zero-Conf-Deployment](#zero-conf) plus die [plattformspezifischen Hinweise](/docs/v2/guides/deployment/ai_developed_apps/) |
| Du baust bereits ein Docker-Image und pflegst eine `stack.yaml`                               | [`mittwald/deploy-container-action`](/docs/v2/guides/deployment/container-actions/#deploy-mit-deploy-container-action)      |
| Du deployst eine PHP/Composer-Anwendung in ein Managed Hosting                                | [Deployer](/docs/v2/guides/deployment/deployer/)                                                                            |
| Du deployst ein TYPO3- oder Neos-Projekt und nutzt bereits Surf                               | [TYPO3 Surf](/docs/v2/guides/deployment/typo3surf/)                                                                         |
| Du möchtest Projekte, Apps, Datenbanken und Domains als Code verwalten                        | [Terraform](/docs/v2/guides/deployment/terraform/)                                                                          |

## Die Strategien im Detail {#strategies}

### Zero-Conf-Container-Deployment {#zero-conf}

**Verwende es, wenn:** du mit möglichst wenig Konfiguration von einem Git-Repository zu einer laufenden Anwendung kommen willst, ohne ein Dockerfile oder eine Stack-Definition zu schreiben.

Das Zero-Conf-Deployment analysiert deinen Quellcode, leitet daraus ab, wie er gebaut und gestartet wird, und deployt das Ergebnis in das Container-Hosting. Du kannst es manuell von deinem Rechner aus ausführen:

```shellsession
user@local $ mw project create --description=my-project --update-context
user@local $ mw experimental deploy
```

Sobald das funktioniert, kannst du es mit der [`mittwald/zerodeploy-action`](/docs/v2/guides/deployment/container-actions/#deploy-mit-zerodeploy-action) automatisieren, die denselben Build bei jedem Push ausführt.

**Abwägung:** Komfort vor Kontrolle. Das Build-Verhalten wird abgeleitet, deshalb brauchen ungewöhnliche Projektstrukturen (Monorepos, exotische Paketmanager) unter Umständen ein paar Umgebungsvariablen, um den Build in die richtige Richtung zu lenken.

Weiterlesen:

- [Deployment von containerisierten Anwendungen mit GitHub Actions](/docs/v2/guides/deployment/container-actions/) für die automatisierte Variante.
- [Deployment von mit KI entwickelten Apps](/docs/v2/guides/deployment/ai_developed_apps/) für die manuelle Anleitung mit der CLI. Trotz des Titels ist das die Referenz für den Zero-Conf-Workflow im Allgemeinen; die Anleitung geht lediglich zusätzlich auf Exporte aus KI-Entwicklungstools ein, weil der Workflow dort am häufigsten eingesetzt wird.

### Container-Deployment mit expliziter Stack-Definition {#explicit-stack}

**Verwende es, wenn:** dein Team den Build bereits selbst verantwortet. Du hast ein `Dockerfile`, pushst Images in eine Registry und willst Services, Ports und Volumes selbst beschreiben.

Ein GitHub-Actions-Workflow baut das Image, pusht es und übergibt anschließend deine Stack-Definition an mStudio. Du behältst die volle Kontrolle darüber, welche Services bei einem Rollout neu erstellt werden, und kannst denselben Stack in mehrere Umgebungen deployen.

**Abwägung:** mehr bewegliche Teile, die gepflegt werden wollen, dafür ist nichts an der Laufzeitumgebung implizit.

Weiterlesen: [Deployment von containerisierten Anwendungen mit GitHub Actions](/docs/v2/guides/deployment/container-actions/)

### Deployer {#deployer}

**Verwende es, wenn:** du eine PHP-Anwendung in eine Managed App deployst und atomare Releases möchtest, die sich zurückrollen lassen.

[Deployer](https://deployer.org/) kopiert jedes Release in ein eigenes Verzeichnis und schwenkt anschließend einen `current`-Symlink um. Damit ist ein Deployment atomar und umkehrbar. Das [mittwald-Recipe](https://packagist.org/packages/mittwald/deployer-recipes) übernimmt zusätzlich das Anlegen des SSH-Users, das Verknüpfen von Domains, die Installation von Laufzeitabhängigkeiten und das Leeren des OPcache.

**Abwägung:** Der Ansatz ist PHP-lastig und benötigt SSH-Zugriff, ist dafür aber der ausgereifteste Weg für klassisches PHP-Hosting und lässt sich sowohl in GitHub Actions als auch in GitLab CI einbinden.

Weiterlesen: [PHP-Anwendungen mit Deployer deployen](/docs/v2/guides/deployment/deployer/)

### TYPO3 Surf {#surf}

**Verwende es, wenn:** du TYPO3 oder Neos deployst und dein Projekt bereits Surf nutzt.

Surf erfüllt denselben Zweck wie Deployer, mit Werkzeugen, die speziell auf TYPO3 und Neos zugeschnitten sind. Wenn du neu anfängst und keine starke Präferenz hast, bietet Deployer die tiefere mittwald-Integration.

Weiterlesen: [PHP-Anwendungen mit TYPO3 Surf deployen](/docs/v2/guides/deployment/typo3surf/)

### Terraform {#terraform}

**Verwende es, wenn:** du deine _Infrastruktur_ (Projekte, Apps, Datenbanken, Domains, Container) als Code beschreiben und über Umgebungen hinweg reproduzierbar machen willst.

Terraform ergänzt die oben genannten Strategien, statt sie zu ersetzen: Es stellt die Ressourcen bereit und verwaltet sie, in denen deine Anwendung läuft, und du kannst es mit jeder der Deployment-Methoden für den Anwendungscode kombinieren. Außerdem kannst du mittwald-Ressourcen zusammen mit denen anderer Anbieter, etwa DNS oder Monitoring, in einer einzigen Konfiguration verwalten.

Weiterlesen: [Infrastructure as Code mit Terraform](/docs/v2/guides/deployment/terraform/)

## Was du in jedem Fall brauchst {#prerequisites}

- Ein **mStudio-API-Token** für alles, was mit der mittwald-API spricht; siehe [API-Token erhalten](/docs/v2/api/intro#obtaining-an-api-token).
- Die **mittwald CLI** (`mw`) für die meisten manuellen Schritte; siehe die [CLI-Dokumentation](/docs/v2/cli/).
- Ein **Git-Repository**, denn alle hier beschriebenen Strategien deployen aus der Versionsverwaltung.

## Wie geht es weiter {#next-steps}

- [Container](/docs/v2/platform/workloads/containers/): Stack-Dateien, Registries, Ingress und Volumes
- [Webserver](/docs/v2/platform/workloads/webservers/): einen eigenen Webserver in einer Managed App betreiben
- [`mw stack`-Kommandoreferenz](/docs/v2/cli/reference/stack/): deklaratives Stack-Deployment über die CLI
- [Agentic Integration](/docs/v2/agentic-integration/): MCP-Server und Agent Skills, falls ein KI-Agent deine Deployments übernehmen soll
