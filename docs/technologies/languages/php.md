---
title: PHP
---

## Customizing your PHP configuration

### For the entire project

To customize your PHP configuration for the entire project, you can make changes to the `~/.config/php/php.ini` file, or add a new `.ini` file to the `~/.config/php/php.d` directory. Changes to these files will be detected automatically, and the PHP-FPM service will be restarted.

### Per directory

To customize your PHP configuration for a specific directory, create a `.user.ini` file in that directory.[^1] This file will be parsed by PHP and will override the default configuration.

:::caution

Take note that PHP will cache the `.user.ini` file for whichever value is set in the `user_ini.cache_ttl` setting (which has a default value of 5 minutes).

:::

[^1]: https://www.php.net/manual/en/configuration.file.per-user.php
