---
title: Deployer
description: >
  Deployer is a deployment tool written in PHP. It can be used to deploy PHP applications, but also other types of applications.
---

[Deployer](https://deployer.org/) is a deployment tool for PHP applications. This guide will show you how to deploy a PHP application to a mittwald cloud project with Deployer.

## Prerequisites

For this guide, we assume that you already have a PHP/Composer project in a Git repository that you want to deploy, and that you are familiar with the basics of Deployer (see the [getting started](https://deployer.org/docs/7.x/getting-started) guide, otherwise).

## Deploy an application with Deployer

### Create the application in the mittwald platform

First, you need to create a new custom application in a mittwald cloud project of your choice. You can do this via the mittwald Studio UI, or alternatively using the CLI. In any case, set the application's document root to the `/current` symlink (or a subdirectory thereof) that will be created by Deployer.

```shell-session
$ # use one of these:
$ mw app create php --document-root /current/public
$ mw app create node --document-root /current
$ mw app create static --document-root /current/public
```

:::note

You can omit the `--document-root` setting when you are using the [mittwald deployer recipe][mw-deployer] to deploy your application. In that case, the recipe will automatically set the document root to `/current`, and the configured `public_path` variable.

:::

Make sure to take note of the application's ID, as you will need it later. In the following examples, we will refer to that application ID as `<app-id>`.

### Configure your deployment

#### Fully managed: Using the mittwald deployer recipe

:::warning

The [mittwald deployer recipe][mw-deployer] is currently in a beta state. We welcome any feedback and suggestions for improvement. Please use the [issue tracker][mw-deployer-issues] to report any issues you encounter. 💙

:::

The easiest way to deploy your application to a mittwald cloud project is to use the [mittwald deployer recipe][mw-deployer]. To do so, install the recipe via Composer:

```bash
$ composer require --dev mittwald/deployer-recipes
```

To define the deployment target in your application, include the recipe in your `deploy.php` file, and use the `mittwald_app` function to define a host:

```php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/vendor/mittwald/deployer-recipes/recipes/deploy.php';

mittwald_app('<app-id>')
    ->set('public_path', '/');
```

:::note

The `mittwald_app('<app-id>')` call is equivalent to the following code:

```php
host('mittwald')
    ->set('mittwald_app_id', '<app-id>')
```

:::

When running `dep deploy`, make sure that a `MITTWALD_API_TOKEN` environment variable is set, containing a valid API token for the mittwald API.

The recipe will automatically configure the following things:

- The `deploy_path` will be set to the application's installation path.
- An SSH user will be created for the application, and the `remote_user` will be set to that user. By default, the SSH key configured in the `ssh_copy_id` variable will be used for authentication. To use a different SSH key pair, set the `mittwald_ssh_public_key` and `mittwald_ssh_private_key` variables (alternative, set the `mittwald_ssh_public_key_file` and `mittwald_ssh_private_key_file` variables to the path of the respective files).

#### Alternative: Without the mittwald deployer recipe

After creating the application, retrieve its installation path from the mittwald Studio UI, or via the CLI (in the following examples, we will refer to that installation path as `<app-installation-path>`).

```shell-session
$ mw app get <app-id>
```

Use the app installation directory as the `deploy_path` in your `deploy.php` file. For example:

```php
host('ssh.fiestel.project.host') // you can determine your SSH host via the "mw project get" command
    ->set('remote_user', 'ssh-XXXXXX@<app-id>')
    ->set('deploy_path', '/html/<app-installation-path>');
```

The rest of your Deployer configuration depends on your project, and for this reason, will not be covered by this guide. For example, if you are deploying a TYPO3 project, you might want to use the [TYPO3 Deployer recipe](https://deployer.org/docs/7.x/recipe/typo3).

## Advanced recipe how-tos

The [mittwald deployer recipe][mw-deployer] provides some additional features that might be useful for your deployment.

### Deploying to multiple environments

Often, you will want to deploy your application to multiple environments, e.g. a staging and a production environment. To do so, you can create multiple apps on the mittwald platform:

```
$ mw app create php \
    --document-root /current/public \
    --site-title "My project (PROD)"
$ mw app create php \
    --document-root /current/public \
    --site-title "My project (STAGING)"
```

You can then define multiple hosts in your `deploy.php` file, and set the `mittwald_app_id` variable for each host:

```php
mittwald_app('<prod-app-id>', hostname: 'mittwald-prod')
    ->set('branch', 'main');

mittwald_app('<staging-app-id>', hostname: 'mittwald-staging')
    ->set('branch', 'develop');
```

:::warning

Make sure to specify the `hostname` parameter when using the `mittwald_app` shortcut function, since otherwise the host definitions would overwrite each other.

:::

### Configuring domains

The recipe will respect the `domain` setting of your application, and will automatically look for a matching virtual host configured for your project. If a matching virtual host is found, the recipe will automatically link the virtual host with your application and its document root. You can also override the domain name(s) by setting the `mittwald_domains` variable:

    ```php
    // default:
    // set('mittwald_domains', ['{{domain}}']);
    set('mittwald_domains', ['mittwald.example', 'www.mittwald.example']);
    ```

### Configuring PHP version and other dependencies

You can also set the `mittwald_app_dependencies` value. This value may contain an associative list of system software names and versions that your application depends on. The recipe will automatically install the required software packages in the application's runtime environment. For example:

    ```php
    set('mittwald_app_dependencies', [
        'php' => '~8.2',
        'composer' => '>=2.0',
    ]);
    ```
  
:::tip
Use the `mw app dependency list` command to get an overview of available dependencies.
:::

## CI integration

### Github Actions

To use this recipe in a Github actions workflow, you should first configure the following secrets in your repository settings:

- `MITTWALD_API_TOKEN` should contain your mittwald API token
- `MITTWALD_APP_ID` should contain the ID of the mittwald application you want to deploy to.
- `MITTWALD_SSH_PRIVATE_KEY` should contain the private key of the SSH key pair that should be used for deployment.
- `MITTWALD_SSH_PUBLIC_KEY` should contain the public key of the SSH key pair that should be used for deployment.

Then, you can use the following workflow to deploy your application:

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

This Gitlab CI workflow uses the same repository variables as the Github actions example above:

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
    - ./vendor/bin/dep deploy \
        -o mittwald_app_id=$MITTWALD_APP_ID \
        -o mittwald_ssh_public_key_file=.mw-deploy/id_rsa.pub \
        -o mittwald_ssh_private_key_file=.mw-deploy/id_rsa
  environment:
    name: production
```

## Common issues

### unix_listener: path "[...]" too long for Unix domain socket.

This issue is caused by Deployers [SSH multiplexing feature](https://deployer.org/docs/7.x/hosts#ssh_multiplexing) -- or more precisely, by the name of the generated UNIX socket, which is based on the host name and username and might be too long in some cases. There are several different workarounds for this issue:

- Disable SSH multiplexing by setting `ssh_multiplexing` to `false` in your `deploy.php` file.
- Define a shorter host name in your SSH configuration (usually `~/.ssh/config`). Such a configuration might look like this:

  ```
  Host fiestel
      Hostname ssh.fiestel.project.host
      User ssh-XXXXXX@<app-id>
  ```

[mw-deployer]: https://packagist.org/packages/mittwald/deployer-recipes
[mw-deployer-issues]: https://github.com/mittwald/deployer-recipes/issues