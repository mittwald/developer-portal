#!/bin/sh

export MITTWALD_APP_ID="$1"
export LOCAL_DIR="$2"
export MITTWALD_DOMAIN="$3"

set -e

if [ -z "${MITTWALD_APP_ID}" ] ; then
  echo "MITTWALD_APP_ID must be set"
  exit 1
fi

cd /github/workspace

if [ ! -f ./deploy.php ] ; then
  cp /deploy.php .
fi

echo "::group::Deploying application ${MITTWALD_APP_ID}"
dep deploy \
  -o mittwald_app_id="${MITTWALD_APP_ID}" \
  -o rsync_src="${LOCAL_DIR}" \
  -o domain="${MITTWALD_DOMAIN}"
echo "::endgroup::"