---
title: TYPO3 Surf
description: >
  TYPO3 Surf is a deployment tool written specifically with TYPO3 and Neos projects in mind. However, it can also be used to deploy other types of applications.
---

[TYPO3 surf][surf] is a deployment tool for PHP applications, specifically for TYPO3 and Neos. This guide will show you how to deploy a PHP application to a mittwald cloud project with Deployer.

## Prerequisites

For this guide, we assume that you already have a TYPO3 or Neos project in a Git repository that you want to deploy, and that you are familiar with the basics of TYPO3 Surf (see the [getting started](https://docs.typo3.org/other/typo3/surf/main/en-us/Usage/Index.html) guide, otherwise).

## Deploy an application with TYPO3 Surf

### Create the application in the mittwald platform

First, you need to create a new custom application in a mittwald cloud project of your choice. You can do this via the mittwald Studio UI, or alternatively using the CLI. In any case, set the application's document root to the `/releases/current` symlink (or a subdirectory thereof) that will be created by TYPO3 Surf.

```shell-session
$ # use one of these:
$ mw app create php --document-root /releases/current/public
```

Make sure to take note of the application's ID, as you will need it later. In the following examples, we will refer to that application ID as `<app-id>`.

After creating the application, retrieve its installation path from the mittwald Studio UI, or via the CLI (in the following examples, we will refer to that installation path as `<app-installation-path>`).

```shell-session
$ mw app get <app-id>
```

### Configure your deployment

Use the app installation directory as the `deploy_path` in your `deploy.php` file. For example:

```php
$node = new \TYPO3\Surf\Domain\Model\Node('mittwald');
$node->setHostname('ssh.fiestel.project.host'); // you can determine your SSH host via the "mw project get" command
$node->setDeploymentPath('/html/<app-installation-path>');
$node->setOption('username', 'ssh-XXXXXX@<app-id>');
```

The rest of your TYPO3 Surf configuration depends on your project, and for this reason, will not be covered by this guide. Please refer to the [TYPO3 Surf documentation][surf] for more information.


[surf]: https://docs.typo3.org/other/typo3/surf/main/en-us/Index.html