---
title: Using the mittwald CLI
sidebar_label: CLI
description: An introduction on how to use the mittwald command-line interface (CLI)
---

:::danger

Please note that the CLI is currently in an experimental state, and may change without prior notice. We're happy to receive feedback and feature requests via [GitHub issues](https://github.com/mittwald/cli/issues).

:::

## Installing

### Any OS, using NPM

With a local Node.js installation, you can install the mittwald CLI using NPM:

```
$ npm install -g @mittwald/cli
$ mw --help
```

### macOS, using Homebrew

```
$ brew tap mittwald/cli
$ brew install mw
$ mw --help
```

### macOS, using the installer package

Retrieve the latest release package (`*.pkg` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer. Pay attention to the processor architecture, and load the `mw-*-arm64.pkg` file when you're using an ARM Mac, and the `mw-*-amd64.pkg` file when using an Intel Mac.

:::info

Currently, our alpha release packages are not signed with a developer certificate. You may need to allow the installer to run in your system preferences.

:::

### Windows, using the installer package

Retrieve the latest release package (`*.exe` file) from our [releases page](https://github.com/mittwald/cli/releases), and run the installer.

### Using Docker

```
$ export MITTWALD_API_TOKEN=xxx
$ docker run \
    --rm \
    -it \
    -e MITTWALD_API_TOKEN \
    mittwald/cli --help
```

## Authenticating

### API access

To use the CLI, you first need to authenticate your client using an API token. Have a look at the ["Obtaining an API token" section](../../intro#obtaining-an-api-token) of the introduction for details on how to obtain an API token.

:::note

Additional authentication mechanisms (like an OAuth2 flow in which you can use your browser to authenticate) are planned for the future.

:::

Having a token, you can authenticate like this:

```
$ mw login token
Enter your mStudio API token: ********
```

For non-interactive usage (for example in CI/CD pipelines), you can also pass the token via the `MITTWALD_API_TOKEN` environment variable:

```
$ export MITTWALD_API_TOKEN=********
$ mw login status
```

### SSH

A few commands (like `mw [app|project] download`, `mw [app|project] ssh` and some of the subcomands for `mw database`) connect to your actual hosting environment via SSH. For these commands, your local environment needs to be set up with an SSH keypair to authenticate against the remote server without prompting for your password.

1. **If you already have an existing SSH private key**, you can import the public key to your mStudio account with the following command:

   ```
   $ mw user ssh-key import
   ```

2. **To create and import a new SSH keypair**, you can use the following command:

   ```
   $ mw user ssh-key create
   ```

Usually, the key pair should be used automatically by the CLI. To explicitly specify the key pair to use (for example, if you receive a `too many authentication failures` error), you have a few options:

1. All commands that require an SSH connection respect your systems [SSH configuration](https://linux.die.net/man/5/ssh_config) (typically in `~/.ssh/config`). You can specify the key to use for a specific host like this:

   ```txt title="~/.ssh/config"
   Host *.project.host
     IdentityFile ~/.ssh/mstudio-cli
   ```

2. Alternatively, all commands that require an SSH connection accept a `--ssh-identity-file` flag that you can use to specify the key to use:

   ```
   $ mw app download ... --ssh-identity-file="~/.ssh/mstudio-cli"
   ```

3. Instead of the `--ssh-identity-file` flag, you can also set the `MITTWALD_SSH_IDENTITY_FILE` environment variable to specify the key to use:

   ```
   $ export MITTWALD_SSH_IDENTITY_FILE=~/.ssh/mstudio-cli
   $ mw app download ...
   ```

   You can also set the `MITTWALD_SSH_IDENTITY_FILE` environment variable in your shell profile (`~/.zshrc` or `~/.bashrc`) to make it available in every shell session:

   ```
   $ echo 'export MITTWALD_SSH_IDENTITY_FILE=~/.ssh/mstudio-cli' >> ~/.zshrc
   ```

## General usage

### App Installation/Project/Server/Organization contexts

Many commands of the CLI act in the context of a certain app installation, project, server or organization, and as such require a `--installation-id`, `--project-id`, `--server-id` or `--org-id` flag. You can either pass these flags to each command, or set them globally using the `mw context` command:

```bash
$ mw context set --installation-id=...
$ mw context set --project-id=...
$ mw context set --server-id=...
$ mw context set --org-id=...
```

Some commands that _create_ one of these resources also have a `--update-context` flag that will automatically set the context to the newly created resource:

```bash
$ mw project create --description="..." --update-context
```

### Non-interactive usage

If you intend to use `mw` non-interactively (for example in scripts, or CI/CD pipelines), many commands support a `--output|-o` flag that allows you to specify the output format. The default is `text`, which is a human-readable format, but you can also use `json` to get machine-readable output, which you can then easily process using tools like `jq`:

```bash
PROJECT_ID=$(mw project get -ojson | jq -r '.id')
```

Many mutating commands also print progress information about long-running operations. To suppress this output, you can use the `--quiet|-q` flag. In these cases, most commands will fall back to printing the ID of the created resource, which you can then use to retrieve the full resource information:

```bash
PROJECT_ID=$(mw project create --quiet --description="...")
```
