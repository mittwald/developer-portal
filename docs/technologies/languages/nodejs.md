---
title: Node.JS
---

## Managing your process lifecycle

With a Node.JS application, the entire lifecycle of your process is managed
within the application itself. Within your hosting environment, your Node.JS
process is managed by the
[mittnite init system](https://github.com/mittwald/mittnite), a lightweight
process manager that is responsible for starting, stopping and restarting your
application.

Within your hosting environment, you can use the `mittnitectl` command to manage
your application:

- `mittnitectl start` starts your application
- `mittnitectl stop` stops your application
- `mittnitectl restart` restarts your application

You can also use `mittnitectl` to view the status of your application:

- `mittnitectl status` shows the status of your application
- `mittnitectl logs` shows the logs of your application
