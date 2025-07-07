---
sidebar_label: Collabora
description: Learn how to set up and run Collabora Online Development Edition (CODE) with Nextcloud for collaborative document editing
---

# Running Collabora

## Introduction

The **Collabora Online Development Edition (CODE)** is a server that provides online document editing. It allows collaborative editing of common office documents and serves as an open-source alternative to Office365.

This guide demonstrates the installation using a Nextcloud example – from initial setup to creating and opening your first document.

### Requirements

1. Installed and configured Nextcloud version 29 or higher, with [Nextcloud Office](https://apps.nextcloud.com/apps/richdocuments) installed
2. mStudio with a hosting plan that supports [containerized workloads](/docs/platform/workloads/containers)
3. Sufficient free RAM (see dashboard)
4. An already existing subdomain for CODE (e.g. `code.my-domain.tld`)

### Further Resources

- [Nextcloud](https://nextcloud.com/)
- [Collabora](https://www.collaboraonline.com/de/code/)
- [Collabora Docker Docs](https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html#how-to-grab-the-code-image-from-docker-image)
- [Docker Hub CODE](https://hub.docker.com/r/collabora/code)

:::note

We assume that a working Nextcloud is already installed and configured. It is important that the [Nextcloud Office](https://apps.nextcloud.com/apps/richdocuments) app is also installed in the backend of Nextcloud. If it's not installed yet, you can add it via the Nextcloud App Store.

Collabora/CODE can be operated either as a separate instance in its own project or per Nextcloud instance, depending on your use case. Both setups are possible: either one CODE instance per Nextcloud or one centralized CODE instance for multiple Nextclouds.

:::

## How do I start the container?

### Using the mStudio UI

In mStudio, go to your project and select **“Create container”**. A guided dialog will open to assist you with the container setup.

First, enter a description – this is a free text field used to identify the container. For example, enter **“collabora/code”** and click **“Next”**.

Next, you'll be asked for the image name. You can find this on [Docker Hub](https://hub.docker.com/r/collabora/code), in this case it is `collabora/code`. Enter this value and confirm with **“Next”**.

#### Entrypoint and Volume

- The **Entrypoint** can remain unchanged → **“Next”**
- In the next step, you can create a **Volume** (persistent storage). This is not strictly required for `collabora/code`, so you can skip this step → **“Next”**

#### Environment Variables

In the next step **“Add environment variables”**, we need to make some adjustments. Click **“Add variable”** – two input fields (Key & Value) will appear.

Now it depends on whether `collabora/code` will be used for **a single** Nextcloud instance in the same project or for **multiple** Nextcloud instances. Replace `code.my-domain.tld` with your actual subdomain.

**For a single Nextcloud instance in the same project:**

```
extra_params=--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld
```

**For multiple Nextcloud instances:**

```
extra_params=--o:aliasgroup1=https://.*:443 --o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld
```

:::note

`aliasgroup1=https://.*:443` allows access from **all** external domains. For better security, you can use a more restrictive domain pattern – see the [documentation](https://sdk.collaboraonline.com/docs/installation/CODE_Docker_image.html#how-to-grab-the-code-image-from-docker-image).

:::

Once you've entered the desired value, click **“Next”**. In the final dialog, you’ll be asked for the **port** – you can leave this unchanged. Click **“Create container”** to create and start the container.

### Alternative: Using the `mw container run` command

You can also use the `mw container run` command to directly create and start a Collabora container from the command line. This approach is similar to using the Docker CLI and allows you to specify all container parameters in a single command.

For a single Nextcloud instance in the same project:

```bash
mw container run \
  --name collabora \
  --description "Collabora Online Development Edition" \
  --publish 9980/tcp \
  --env "extra_params=--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld" \
  collabora/code
```

For multiple Nextcloud instances:

```bash
mw container run \
  --name collabora \
  --description "Collabora Online Development Edition" \
  --publish 9980/tcp \
  --env "extra_params=--o:aliasgroup1=https://.*:443 --o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld" \
  collabora/code
```

Make sure to replace `code.my-domain.tld` with your actual subdomain. The `--publish` flag exposes port 9980, which is the default port used by Collabora. The `--name` flag sets the container name, which will also be used as the internal DNS name.

After creating the container, you'll still need to assign a domain to it as described in the "Assign Domain" section below.

### Alternative: Using the `mw stack deploy` command

Alternatively, you can use the `mw stack deploy` command, which is compatible with Docker Compose. This approach allows you to define your container configuration in a YAML file and deploy it with a single command.

First, create a `docker-compose.yml` file with the following content:

```yaml
services:
  collabora:
    image: collabora/code
    ports:
      - "9980/tcp"
    environment:
      # For a single Nextcloud instance in the same project:
      extra_params: "--o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld"
      # For multiple Nextcloud instances (uncomment this line and comment the line above):
      # extra_params: "--o:aliasgroup1=https://.*:443 --o:ssl.enable=false --o:ssl.termination=true --o:net.post_allow.host[0]=.+ --o:storage.wopi.host[0]=.+ --o:server_name=code.my-domain.tld"
```

Make sure to replace `code.my-domain.tld` with your actual subdomain. Choose the appropriate `extra_params` configuration based on your use case (single or multiple Nextcloud instances).

Then, deploy the container using the `mw stack deploy` command:

```bash
mw stack deploy
```

This command will read the `docker-compose.yml` file from the current directory and deploy it to your default stack. If you want to specify a different file or stack, you can use the following options:

```bash
mw stack deploy --compose-file=/path/to/docker-compose.yml --stack-id=your-stack-id
```

After deploying the container, you'll still need to assign a domain to it. You can do this through the mStudio UI as described in the "Assign Domain" section above.

### Assign Domain

Now switch to the **Domains** section and link `code.my-domain.tld` with your container. Select the domain and set the target to the container you just created.

Alternatively, use the `mw domain virtualhost create` CLI command with the `--path-to-container` flag.

## Integration in Nextcloud

In order for Nextcloud to communicate with `collabora/code`, you need to configure it in the backend of Nextcloud. Log in to your Nextcloud as an **admin user** (admin rights required!).

Navigate to **Administration Settings** > **Office**. Select **“Use your own server”** and fill in the field as follows:

### Single instance in the same project

In the **“URL (and port) of Collabora Online server”** field, enter the container hostname – for example `http://collabora:9980` (the hostname matches the container name). Enable the checkbox **“Disable certificate verification”**.

You should now see a green confirmation message:

```
Collabora Online server is reachable.
Collabora Online Development Edition 24.04.13.2 ded56d8ff7
URL used by browser: https://code.your-domain.tld
Nextcloud URL used by Collabora: https://nextcloud.your-domain.tld
```

### Instance for multiple Nextclouds

Enter the publicly accessible URL of the Collabora server, e.g., `https://code.my-domain.tld`. The certificate verification checkbox **does not need to be enabled** if a valid SSL certificate (e.g. Let’s Encrypt) is in place.

You'll also get the green success message if everything is correct:

```
Collabora Online server is reachable.
Collabora Online Development Edition 24.04.13.2 ded56d8ff7
URL used by browser: https://code.my-domain.tld
Nextcloud URL used by Collabora: https://nextcloud.other-domain.tld
```

## Create a document

You can create a new document directly within Nextcloud: go to the **Files** section and click **“+ New”** to create and start editing your first document.

If you want to collaborate with other users on the same document, you can do so directly in the browser – simply open the document.
