FROM httpd:2.4-alpine

RUN echo -e "<Directory /usr/local/apache2/htdocs>\n  AllowOverride All\n</Directory>" >> /usr/local/apache2/conf/httpd.conf