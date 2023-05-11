---
title: Redis
---

For an online shop, good performance is a real competitive advantage. To further minimize loading times, the Space Server now supports Redis. Read on to learn what you can use the database for and how to set it up.

# What is Redis?

Redis (short for Remote Dictionary Server) is an **in-memory database** and **key-value store** in one. This means that instead of being stored on a hard drive, your data is stored in memory. Each entry gets its own key, which allows for very fast access times.

# Why do I need Redis?

In general, Redis makes your projects faster when data is written and queried quickly. Thanks to its outstanding performance, Redis is ideal for use as a cache. The database is also popular as a session storage for shop systems.

# How do I set up Redis on the Space Server?

Setting up Redis is easy. Depending on your CMS or shop system, however, you need to keep a few things in mind. I will explain step by step how to do it.

## General settings

First, create a Redis database in mStudio, the management environment of your Space Server. Then, in the details under connection information, you will find both the host and port. You need both for the configuration of your system.

## Adjust php.ini

The file is located in your project under `.config/php/php.ini`. Insert the following code:

```ini
extension=redis.so
session.save_handler = redis
session.save_path = "tcp://HOST:PORT?database=15"
```

Now change the `HOST` and `PORT` variables. Use the information from the connection information.

Each Redis database has 16 session databases by default, which can be addressed from 0 to 15.

## Set up common applications

### Shopware 6

You enter the configuration for Redis in your Shopware 6 installation in `services.yaml`. It is located in the `/config` directory. If there is no file there yet, simply create one. Add the following lines at the end of the file:

```yaml
parameters:
  app.redis.cache.host: "%env(REDIS_CACHE_HOST)%"
  app.redis.cache.port: "%env(int:REDIS_CACHE_PORT)%"
  app.redis.cache.database: "%env(int:REDIS_CACHE_DATABASE)%"
services:
  Redis:
    class: Redis
    calls:
    - method: connect
      arguments:
        - "%env(REDIS_SESSION_HOST)%"
        - "%env(int:REDIS_SESSION_PORT)%"
    - method: select
      arguments:
        - "%env(int:REDIS_SESSION_DATABASE)%"
    Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler:
      arguments:
        - "@Redis"
```

Now create the `framework.yaml` file in the `config/packages` folder. Add the following to the file:

```yaml
framework:
  cache:
    app: cache.adapter.redis
    system: cache.adapter.redis
    default_redis_provider: "redis://%app.redis.cache.host%:%app.redis.cache.port%/%app.redis.cache.database%"
  session:
    handler_id: Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler
```

Finally, add the following to the end of the `.env` file:

```shell
REDIS_CACHE_HOST="HOST"
REDIS_CACHE_PORT="PORT"
REDIS_CACHE_DATABASE="1"

REDIS_SESSION_HOST="HOST"
REDIS_SESSION_PORT="PORT"
REDIS_SESSION_DATABASE="0"
```

### Shopware 5

In the Shopware directory, add the following to `config.php`:

```php
// Sessions for backend and frontend in Redis in DB2
'session' => [
    'save_handler' => 'redis',
    'save_path' => 'tcp://HOST:PORT