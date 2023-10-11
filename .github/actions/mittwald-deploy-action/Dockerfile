FROM php:8.2-cli-alpine

RUN wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet && \
    mv composer.phar /usr/local/bin/composer
RUN adduser -D deployer

COPY entrypoint.sh /entrypoint.sh
COPY deploy.php /deploy.php

RUN ln -s /home/deployer/.composer/vendor/bin/dep /usr/local/bin/dep

USER deployer

RUN composer global config minimum-stability dev && \
    composer global require deployer/deployer=^7.3.1 mittwald/deployer-recipes=dev-master

ENTRYPOINT ["/entrypoint.sh"]
