#!/bin/sh

set -e

export MITTWALD_APP_ID="$1"
export LOCAL_DIR="$2"
export MITTWALD_DOMAIN="$3"
export MITTWALD_SSH_PUBLIC_KEY="$4"
export MITTWALD_SSH_PRIVATE_KEY="$5"

if [ -z "${MITTWALD_APP_ID}" ] ; then
  echo "MITTWALD_APP_ID must be set"
  exit 1
fi

cd /github/workspace

if [ ! -f ./deploy.php ] ; then
  echo "no deploy.php file found; using distributed default deploy.php..."
  cp /deploy.php .
else
  echo "using deploy.php from project root"
fi

mkdir -p .mw-deployer/

echo "${MITTWALD_SSH_PUBLIC_KEY}" > ./.mw-deployer/deployer.pub
echo "${MITTWALD_SSH_PRIVATE_KEY}" > ./.mw-deployer/deployer

chmod 0600 ./.mw-deployer/deployer

echo "::group::Deploying application ${MITTWALD_APP_ID}"
dep --ansi --no-interaction ${INPUT_VERBOSITY} deploy \
  -o mittwald_app_id="${MITTWALD_APP_ID}" \
  -o mittwald_ssh_public_key_file=./.mw-deployer/deployer.pub \
  -o mittwald_ssh_private_key_file=./.mw-deployer/deployer \
  -o rsync_src="${LOCAL_DIR}" \
  -o domain="${MITTWALD_DOMAIN}"
echo "::endgroup::"