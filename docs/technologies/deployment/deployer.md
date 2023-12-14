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

## Additional recipe features

The [mittwald deployer recipe][mw-deployer] provides some additional features that might be useful for your deployment:

- The recipe will respect the `domain` setting of your application, and will automatically look for a matching virtual host configured for your project. If a matching virtual host is found, the recipe will automatically link the virtual host with your application and its document root. You can also override the domain name(s) by setting the `mittwald_domains` variable:

    ```php
    // default:
    // set('mittwald_domains', ['{{domain}}']);
    set('mittwald_domains', ['mittwald.example', 'www.mittwald.example']);
    ```

- You can also set the `mittwald_app_dependencies` value. This value may contain an associative list of system software names and versions that your application depends on. The recipe will automatically install the required software packages on the application's host. For example:

    ```php
    set('mittwald_app_dependencies', [
        'php' => '~8.2',
        'composer' => '>=2.0',
    ]);
    ```
  
:::tip
Use the `mw app dependency list` command to get an overview of available dependencies.
:::

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