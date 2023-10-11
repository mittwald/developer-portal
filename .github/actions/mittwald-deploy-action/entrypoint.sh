#!/bin/sh

export MITTWALD_APP_ID="$1"
export LOCAL_DIR="$2"
export MITTWALD_DOMAIN="$3"

set -e

cd /github/workspace

if [ ! -f ./deploy.php ] ; then
  cp /deploy.php .
fi

dep deploy \
  -o mittwald_app_id="${MITTWALD_APP_ID}" \
  -o rsync_src="${LOCAL_DIR}" \
  -o domain="${MITTWALD_DOMAIN}"