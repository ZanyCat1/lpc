#!/bin/bash

set -e

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Resolve SSH target
if [ -n "$SSH_ALIAS" ]; then
  SSH_TARGET="$SSH_ALIAS"
else
  : "${SSH_USER:?Need SSH_USER in .env}"
  : "${SSH_HOST:?Need SSH_HOST in .env}"
  SSH_TARGET="${SSH_USER}@${SSH_HOST}"
fi

: "${REMOTE_PATH:?Need REMOTE_PATH in .env}"

echo "Bootstrapping project to server..."

ssh ${SSH_TARGET} "mkdir -p ${REMOTE_PATH}"

rsync -avz \
  .dockerignore \
  .gitignore \
  README.md \
  compose.yaml \
  .env \
  ${SSH_TARGET}:${REMOTE_PATH}/

ssh ${SSH_TARGET} <<EOF
mkdir -p ${REMOTE_PATH}/wp-content ${REMOTE_PATH}/php
chown -R 1000:1000 ${REMOTE_PATH}/wp-content ${REMOTE_PATH}/php
EOF

echo "Done."