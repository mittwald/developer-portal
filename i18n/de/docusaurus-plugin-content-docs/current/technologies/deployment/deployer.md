---
title: Deployer
description: >
  Deployer ist ein in PHP geschriebenes Deployment-Tool. Es kann sowohl für PHP-Anwendungen, als auch für andere Anwendungen verwendet werden.
---

[Deployer](https://deployer.org/) ist ein Deployment-Tool für PHP-Anwendungen. Diese Anleitung zeigt dir, wie du eine PHP-Anwendung in ein mittwald Cloud-Projekt mit Deployer deployen kannst.

## Voraussetzungen

Für diese Anleitung gehen wir davon aus, dass du bereits ein PHP/Composer-Projekt in einem Git-Repository hast, das du deployen möchtest, und dass du mit den Grundlagen von Deployer vertraut bist (ansonsten sei auf die [Getting Started](https://deployer.org/docs/7.x/getting-started)-Anleitung verwiesen).

## Eine Anwendung mit Deployer deployen

### Die Anwendung auf der mittwald-Plattform erstellen

Zunächst musst du eine neue benutzerdefinierte Anwendung in einem mittwald Cloud-Projekt deiner Wahl erstellen. Dies kannst du über die mittwald mStudio-UI tun, oder alternativ über die CLI. In jedem Fall solltest du den Document Root der Anwendung auf den `/current`-Symlink (oder ein Unterverzeichnis davon) setzen, der von Deployer erstellt wird.

```shell-session
$ # use one of these:
$ mw app create php --document-root /current/public
$ mw app create node --document-root /current
$ mw app create static --document-root /current/public
```

:::note

Du kannst die `--document-root`-Einstellung weglassen, wenn du das [mittwald Deployer-Rezept][mw-deployer] verwendest, um deine Anwendung zu deployen. In diesem Fall wird das Rezept automatisch das Document Root auf `/current`, verkettet mit der konfigurierten `public_path`-Variablen setzen.

:::

Merke dir die ID der installierten Anwendung, da du sie später benötigen wirst. In den folgenden Beispielen werden wir uns auf diese Anwendungs-ID als `<app-id>` beziehen.

### Das Deployment konfigurieren

#### Vollständig verwaltet: Das mittwald Deployer-Rezept verwenden

Der einfachste Weg, deine Anwendung in ein mittwald Cloud-Projekt zu deployen, ist die Verwendung des [mittwald Deployer-Rezepts][mw-deployer]. Installiere das Rezept über Composer:

```bash
$ composer require --dev mittwald/deployer-recipes
```

Um ein Deployment-Ziel in deiner Anwendung zu definieren, füge das Rezept in deiner `deploy.php`-Datei ein, und verwende die `mittwald_app`-Funktion, um einen Host zu definieren:

```php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/mittwald/deployer-recipes/recipes/deploy.php';

mittwald_app('<app-id>')
    ->set('public_path', '/');
```

:::note

Der Aufruf von `mittwald_app('<app-id>')` ist gleichbedeutend mit dem Aufruf von `host('mittwald')` und dem Setzen der `mittwald_app_id`-Variable. Wenn du das Rezept in einem anderen Host-Block verwenden möchtest, kannst du die `mittwald_app_id`-Variable auch manuell setzen:

```php
host('mittwald')
    ->set('mittwald_app_id', '<app-id>')
```

:::

Wenn du `dep deploy` ausführst, stelle sicher, dass eine `MITTWALD_API_TOKEN`-Umgebungsvariable gesetzt ist, die einen gültigen API-Token für die mittwald-API enthält.

Das Rezept wird automatisch die folgenden Dinge konfigurieren:

- Der `deploy_path` wird auf den Installationspfad der Anwendung gesetzt.
- Ein SSH-Benutzer wird für die Anwendung erstellt, und der `remote_user` wird auf diesen Benutzer gesetzt. Standardmäßig wird der in der `ssh_copy_id`-Variable konfigurierte SSH-Schlüssel für die Authentifizierung verwendet. Um ein anderes SSH-Schlüsselpaar zu verwenden, setze die `mittwald_ssh_public_key`- und `mittwald_ssh_private_key`-Variablen (alternativ setze die `mittwald_ssh_public_key_file`- und `mittwald_ssh_private_key_file`-Variablen auf den Pfad der entsprechenden Dateien).

#### Alternative: Ohne das mittwald Deployer-Rezept

Nachdem du die Anwendung erstellt hast, musst du den Installationspfad der Anwendung aus der mittwald Studio-UI oder über die CLI abrufen (in den folgenden Beispielen werden wir uns auf diesen Installationspfad als `<app-installation-path>` beziehen).

```shell-session
$ mw app get <app-id>
```

Verwende das Installationsverzeichnis der Anwendung als `deploy_path` in deiner `deploy.php`-Datei. Zum Beispiel:

```php
host('ssh.fiestel.project.host') // you can determine your SSH host via the "mw project get" command
    ->set('remote_user', 'ssh-XXXXXX@<app-id>')
    ->set('deploy_path', '/html/<app-installation-path>');
```

Der Rest deiner Deployer-Konfiguration hängt von deinem Projekt ab und wird daher nicht von dieser Anleitung abgedeckt. Wenn du beispielsweise ein TYPO3-Projekt deployen möchtest, könntest du das [TYPO3 Deployer-Rezept](https://deployer.org/docs/7.x/recipe/typo3) verwenden.

## Fortgeschrittene Anleitungen

Das [mittwald Deployer-Rezept][mw-deployer] bietet einige zusätzliche Funktionen, die für dein Deployment nützlich sein könnten.

### In mehrere Umgebungen deployen

Womöglich möchtest du deine Anwendung in mehrere Umgebungen deployen, z.B. eine Staging- und eine Produktionsumgebung. Dazu kannst du mehrere Anwendungen auf der mittwald-Plattform erstellen:

```
$ mw app create php \
    --document-root /current/public \
    --site-title "My project (PROD)"
$ mw app create php \
    --document-root /current/public \
    --site-title "My project (STAGING)"
```

Im Anschluss kannst du mehrere Hosts in deiner `deploy.php`-Datei definieren, und die `mittwald_app_id`-Variable für jeden Host setzen:

```php
mittwald_app('<prod-app-id>', hostname: 'mittwald-prod')
    ->set('branch', 'main');

mittwald_app('<staging-app-id>', hostname: 'mittwald-staging')
    ->set('branch', 'develop');
```

:::warning

Stelle sicher, dass du den `hostname`-Parameter angibst, wenn du die `mittwald_app`-Shortcut-Funktion verwendest, da die Host-Definitionen sich andernfalls gegenseitig überschreiben würden.

:::

### Domains konfigurieren

Das Rezept berücksichtigt die `domain`-Einstellung deiner Anwendung, und sucht automatisch nach einem passenden virtuellen Host, der für dein Projekt konfiguriert ist. Wenn ein passender virtueller Host gefunden wird, verlinkt das Rezept automatisch den virtuellen Host mit deiner Anwendung und ihrem Document Root. Du kannst die Domainnamen auch überschreiben, indem du die `mittwald_domains`-Variable setzt:

```php
// default:
// set('mittwald_domains', ['{{domain}}']);
set('mittwald_domains', ['mittwald.example', 'www.mittwald.example']);
```

### PHP-Version und andere Abhängigkeiten konfigurieren

Weiterhin kannst du die `mittwald_app_dependencies`-Variable setzen. Dieser Wert kann eine assoziative Liste von Systemsoftware-Namen und -Versionen enthalten, von denen deine Anwendung abhängt. Das Rezept installiert automatisch die erforderlichen Softwarepakete in der Laufzeitumgebung deiner Anwendung. Zum Beispiel:

```php
set('mittwald_app_dependencies', [
    'php' => '~8.2',
    'composer' => '>=2.0',
]);
```

:::tip Verwende das `mw app dependency list`-Kommando, um einen Überblick über verfügbare Abhängigkeiten zu erhalten. :::

## CI-Integration

### Github Actions

Um dieses Rezept in einem Github-Actions-Workflow zu verwenden, solltest du zunächst die folgenden Secrets in den Einstellungen deines Repositorys konfigurieren:

- `MITTWALD_API_TOKEN` sollte dein mittwald API-Token enthalten
- `MITTWALD_APP_ID` sollte die ID der mittwald-Anwendung enthalten, in die du deployen möchtest.
- `MITTWALD_SSH_PRIVATE_KEY` sollte den privaten Schlüssel des SSH-Schlüsselpaares enthalten, das für das Deployment verwendet werden soll.
- `MITTWALD_SSH_PUBLIC_KEY` sollte den öffentlichen Schlüssel des SSH-Schlüsselpaares enthalten, das für das Deployment verwendet werden soll.

Im Anschluss kannst du den folgenden Workflow verwenden, um deine Anwendung zu deployen:

```yaml
steps:
  - uses: actions/checkout@v4

  - name: Setup PHP
    uses: shivammathur/setup-php@v2
    with:
      php-version: 8.2

  - name: Install dependencies
    run: composer install --prefer-dist --no-progress --no-suggest

  - name: Deploy SSH keys
    env:
      MITTWALD_SSH_PRIVATE_KEY: ${{ secrets.MITTWALD_SSH_PRIVATE_KEY }}
      MITTWALD_SSH_PUBLIC_KEY: ${{ secrets.MITTWALD_SSH_PUBLIC_KEY }}
    run: |
      mkdir -p .mw-deploy
      echo "${MITTWALD_SSH_PRIVATE_KEY}" > .mw-deploy/id_rsa
      echo "${MITTWALD_SSH_PUBLIC_KEY}" > .mw-deploy/id_rsa.pub
      chmod 600 .mw-deploy/id_rsa*

  - name: Run deployer
    run: |
      ./vendor/bin/dep deploy \
        -o mittwald_app_id={{ secrets.MITTWALD_APP_ID }} \
        -o mittwald_ssh_public_key_file=.mw-deploy/id_rsa.pub \
        -o mittwald_ssh_private_key_file=.mw-deploy/id_rsa
    env:
      MITTWALD_API_TOKEN: ${{ secrets.MITTWALD_API_TOKEN }}
```

### Gitlab CI

Dieser Gitlab-CI-Workflow verwendet dieselben Repository-Variablen wie das obige Github-Actions-Beispiel:

```yaml
deploy:
  image: php:8.2-cli
  stage: deploy
  before_script:
    - wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet
    - apt-get update && apt-get install -y git openssh-client
    - mkdir -p .mw-deploy
    - echo "$MITTWALD_SSH_PRIVATE_KEY" > .mw-deploy/id_rsa
    - echo "$MITTWALD_SSH_PUBLIC_KEY" > .mw-deploy/id_rsa.pub
    - chmod 600 .mw-deploy/id_rsa*
  script:
    - ./vendor/bin/dep deploy \ -o mittwald_app_id=$MITTWALD_APP_ID \ -o mittwald_ssh_public_key_file=.mw-deploy/id_rsa.pub \ -o mittwald_ssh_private_key_file=.mw-deploy/id_rsa
  environment:
    name: production
```

## Häufige Probleme

### unix_listener: path "[...]" too long for Unix domain socket.

Dieses Problem wird durch das [SSH-Multiplexing-Feature](https://deployer.org/docs/7.x/hosts#ssh_multiplexing) von Deployer verursacht - oder genauer gesagt, durch den Namen des generierten UNIX-Sockets, der auf dem Hostnamen und dem Benutzernamen basiert und in einigen Fällen zu lang sein könnte. Es gibt verschiedene Workarounds für dieses Problem:

- Deaktiviere das SSH-Multiplexing, indem du `ssh_multiplexing` in deiner `deploy.php`-Datei auf `false` setzt.
- Definiere einen kürzeren Hostnamen in deiner SSH-Konfiguration (normalerweise `~/.ssh/config`). Eine solche Konfiguration könnte so aussehen:

  ```
  Host fiestel
      Hostname ssh.fiestel.project.host
      User ssh-XXXXXX@<app-id>
  ```

[mw-deployer]: https://packagist.org/packages/mittwald/deployer-recipes
[mw-deployer-issues]: https://github.com/mittwald/deployer-recipes/issues
