---
title: Deployer
description: >
  Deployer is a deployment tool written in PHP. It can be used to deploy PHP applications, but also other types of applications.
---

[Deployer](https://deployer.org/) is a deployment tool for PHP applications. This guide will show you how to deploy a PHP application to a mittwald cloud project with Deployer.

## Prerequisites

For this guide, we assume that you already have a PHP/Composer project in a Git repository that you want to deploy, and that you are familiar with the basics of Deployer (see the [getting started](https://deployer.org/docs/7.x/getting-started) guide, otherwise).

## Deploy a PHP application with Deployer

### Create the application in the mittwald platform

First, you need to create a new custom PHP application in a mittwald cloud project of your choice. You can do this via the mittwald Studio UI, or alternatively using the CLI. In any case, set the application's document root to the `/current` symlink (or a subdirectory thereof) that will be created by Deployer.

```bash
$ mw app create php --document-root /current/public
```

Make sure to take note of the application's ID, as you will need it later. In the following examples, we will refer to that application ID as `<app-id>`.

After that, retrieve the application's installation path from the mittwald Studio UI, or via the CLI (in the following examples, we will refer to that installation path as `<app-installation-path>`).

```bash
$ mw app get <app-id>
```

### Configure your deployment recipe

Use the app installation directory as the `deploy_path` in your `deploy.php` file. For example:

```php
host('ssh.fiestel.project.host') // you can determine your SSH host via the "mw project get" command
    ->set('remote_user', 'ssh-XXXXXX@<app-id>')
    ->set('deploy_path', '/html/<app-installation-path>');
```

The rest of your Deployer configuration depends on your project, and for this reason, will not be covered by this guide. For example, if you are deploying a TYPO3 project, you might want to use the [TYPO3 Deployer recipe](https://deployer.org/docs/7.x/recipe/typo3).

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
