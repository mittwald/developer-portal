# syntax=docker/dockerfile:1

# Serves the prebuilt site from ./build (run `npm run generate && npm run build`
# first). The resulting container
#
#   - runs as an unprivileged user (uid 101) and listens on port 8080,
#   - has no package manager and no image entrypoint scripts,
#   - only answers GET and HEAD requests,
#   - works with a read-only root filesystem, as long as /tmp is writable
#     (e.g. `docker run --read-only --tmpfs /tmp ...`).
#
# TLS and HSTS are expected to be handled by the reverse proxy in front of it.
#
# Pin NGINX_IMAGE to a digest for reproducible builds, e.g.
#   docker build --build-arg NGINX_IMAGE=nginxinc/nginx-unprivileged:stable-alpine-slim@sha256:... .
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:stable-alpine-slim

# -----------------------------------------------------------------------------
# Stage 1: prepare the site and turn the Apache redirects into nginx config
# -----------------------------------------------------------------------------
FROM ${NGINX_IMAGE} AS site

USER root
COPY build/ /site/

# static/.htaccess remains the single source of truth for redirects. Every
# `RedirectMatch <status> <regex> <target>` line becomes a regex location;
# nginx evaluates those in file order, first match wins, like mod_alias does.
# Any other directive fails the build, so new rules cannot be dropped silently.
RUN <<'EOF'
set -eu

awk '
  /^[[:space:]]*(#|$)/ { next }
  $1 == "RedirectMatch" && NF == 4 {
    target = $4
    # Keep the query string, unless the target ends in a fragment
    if (index(target, "#") == 0) target = target "$is_args$args"
    printf "location ~ \"%s\" { return %s \"%s\"; }\n", $3, $2, target
    next
  }
  { print "unsupported .htaccess directive: " $0 > "/dev/stderr"; exit 1 }
' /site/.htaccess > /redirects.conf

find /site \( -name '.htaccess' -o -name '.nojekyll' -o -name '.DS_Store' \) -delete
chmod -R u=rwX,go=rX /site
EOF

# -----------------------------------------------------------------------------
# Stage 2: runtime image
# -----------------------------------------------------------------------------
FROM ${NGINX_IMAGE}

USER root
RUN rm -rf \
      /docker-entrypoint.sh /docker-entrypoint.d \
      /etc/nginx/conf.d /usr/share/nginx/html \
      /sbin/apk /etc/apk /lib/apk /usr/share/apk /var/cache/apk

COPY <<"EOF" /etc/nginx/nginx.conf
daemon off;
worker_processes auto;
pid /tmp/nginx.pid;
error_log /dev/stderr warn;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  charset utf-8;
  charset_types text/css text/plain text/xml text/markdown application/javascript application/json;

  access_log /dev/stdout;
  server_tokens off;

  sendfile on;
  tcp_nopush on;
  keepalive_timeout 65;

  client_max_body_size 1k;
  client_body_timeout 10s;
  client_header_timeout 10s;
  send_timeout 10s;

  client_body_temp_path /tmp/client_temp;
  proxy_temp_path /tmp/proxy_temp;
  fastcgi_temp_path /tmp/fastcgi_temp;
  uwsgi_temp_path /tmp/uwsgi_temp;
  scgi_temp_path /tmp/scgi_temp;

  gzip on;
  gzip_vary on;
  gzip_comp_level 5;
  gzip_min_length 1024;
  gzip_types text/css text/plain text/xml text/markdown application/javascript application/json application/xml image/svg+xml;

  server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Emit relative Location headers; the container does not know the public
    # scheme, host and port
    absolute_redirect off;

    if ($request_method !~ ^(GET|HEAD)$) {
      return 405;
    }

    # Must come before all other regex locations
    include /etc/nginx/redirects.conf;

    error_page 404 /404.html;

    location / {
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "no-cache" always;
      try_files $uri $uri/ =404;
    }

    location /de/ {
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "no-cache" always;
      error_page 404 /de/404.html;
      try_files $uri $uri/ =404;
    }

    location ~ /\. {
      return 404;
    }

    # Docusaurus fingerprints everything below /assets/
    location ~ ^/(de/)?assets/ {
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "public, max-age=31536000, immutable" always;
      try_files $uri =404;
    }

    # Markdown copies of the docs for LLMs; not part of nginx's mime.types
    location ~ \.md$ {
      types { }
      default_type text/markdown;
      include /etc/nginx/security-headers.conf;
      add_header Cache-Control "no-cache" always;
      try_files $uri =404;
    }
  }
}
EOF

# Included in every location, because add_header in a location discards all
# add_header directives inherited from the server level
COPY <<"EOF" /etc/nginx/security-headers.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
EOF

COPY --from=site /redirects.conf /etc/nginx/redirects.conf
COPY --from=site /site/ /usr/share/nginx/html/

# Config and content stay owned by root and read-only for the nginx user
USER 101
RUN ["nginx", "-t"]

EXPOSE 8080
STOPSIGNAL SIGQUIT
ENTRYPOINT ["nginx"]
