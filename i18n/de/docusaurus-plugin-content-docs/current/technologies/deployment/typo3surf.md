---
title: TYPO3 Surf
description: >
  TYPO3 Surf ist ein Deployment-Tool, das speziell für TYPO3- und Neos-Projekte entwickelt wurde. Es kann jedoch auch für andere Arten von Anwendungen verwendet werden.
---

[TYPO3 surf][surf] ist ein Deployment-Tool für PHP-Anwendungen, das speziell für TYPO3 und Neos entwickelt wurde. In dieser Anleitung wird gezeigt, wie Du eine PHP-Anwendung mit Deployer in ein mittwald-Cloud-Projekt bereitstellst.

## Vorraussetzungen

Für diese Anleitung gehen wir davon aus, dass Du bereits ein TYPO3- oder Neos-Projekt in einem Git-Repository hast, das Du bereitstellen möchtest, und dass Du mit den Grundlagen von TYPO3 Surf vertraut bist (siehe die [Getting Started](https://docs.typo3.org/other/typo3/surf/main/en-us/Usage/Index.html) Anleitung, falls nicht).

## Eine Anwendung mit TYPO3 Surf deployen

### Die Anwendung auf der mittwald-Plattform erstellen

Zunächst musst Du eine neue benutzerdefinierte Anwendung in einem mittwald-Cloud-Projekt Deiner Wahl erstellen. Dies kannst Du über die mittwald Studio UI tun, oder alternativ über die CLI. Setze in jedem Fall das Dokumenten-Root der Anwendung auf den `/releases/current`-Symlink (oder ein Unterverzeichnis davon), der von TYPO3 Surf erstellt wird.

```shell-session
$ # use one of these:
$ mw app create php --document-root /releases/current/public
```

Merke dir die ID der installierten Anwendung, da du sie später benötigen wirst. In den folgenden Beispielen werden wir uns auf diese Anwendungs-ID als `<app-id>` beziehen.

Nachdem du die Anwendung erstellt hast, musst du den Installationspfad der Anwendung aus der mittwald Studio-UI oder über die CLI abrufen (in den folgenden Beispielen werden wir uns auf diesen Installationspfad als `<app-installation-path>` beziehen).

```shell-session
$ mw app get <app-id>
```

### Das Deployment konfigurieren

Verwende das Installationsverzeichnis der Anwendung als `deploy_path` in Deiner `deploy.php`-Datei. Zum Beispiel:

```php
$node = new \TYPO3\Surf\Domain\Model\Node('mittwald');
$node->setHostname('ssh.fiestel.project.host'); // you can determine your SSH host via the "mw project get" command
$node->setDeploymentPath('/html/<app-installation-path>');
$node->setOption('username', 'ssh-XXXXXX@<app-id>');
```

Der Rest Deiner TYPO3 Surf-Konfiguration hängt von Deinem Projekt ab und wird aus diesem Grund nicht in dieser Anleitung behandelt. Bitte beachte die [TYPO3 Surf-Dokumentation][surf] für weitere Informationen.

[surf]: https://docs.typo3.org/other/typo3/surf/main/en-us/Index.html
