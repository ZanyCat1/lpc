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

# Required vars check
: "${DEV_URL:?Need DEV_URL in .env}"
: "${PROD_URL:?Need PROD_URL in .env}"
: "${REMOTE_PATH:?Need REMOTE_PATH in .env}"
: "${DB_NAME:?Need DB_NAME in .env}"
: "${THEME_NAME:?Need THEME_NAME in .env}"
: "${MARIADB_ROOT_PASSWORD:?Need MARIADB_ROOT_PASSWORD in .env}"

DB_CONTAINER="${COMPOSE_PROJECT_NAME}-db-1"
WP_CONTAINER="${COMPOSE_PROJECT_NAME}-wordpress-1"
TMP_DB="${DB_NAME}_deploy"

echo "Cloning database inside dev container..."

docker exec ${DB_CONTAINER} mariadb -u root -p${MARIADB_ROOT_PASSWORD} \
  -e "DROP DATABASE IF EXISTS ${TMP_DB}; CREATE DATABASE ${TMP_DB};"

docker exec ${DB_CONTAINER} mariadb-dump -u root -p${MARIADB_ROOT_PASSWORD} ${DB_NAME} | \
docker exec -i ${DB_CONTAINER} mariadb -u root -p${MARIADB_ROOT_PASSWORD} ${TMP_DB}

echo "Running search-replace on cloned DB..."

docker run --rm \
  --network ${COMPOSE_PROJECT_NAME}_default \
  --volumes-from ${WP_CONTAINER} \
  -e WORDPRESS_DB_HOST=db:3306 \
  -e WORDPRESS_DB_USER=root \
  -e WORDPRESS_DB_PASSWORD=${MARIADB_ROOT_PASSWORD} \
  -e WORDPRESS_DB_NAME=${TMP_DB} \
  wordpress:cli \
  wp search-replace "$DEV_URL" "$PROD_URL" \
  --skip-columns=guid \
  --allow-root \
  --path=/var/www/html \
  --url="$DEV_URL"
  

echo "Exporting transformed DB..."

docker exec ${DB_CONTAINER} mariadb-dump \
  -u root -p${MARIADB_ROOT_PASSWORD} \
  --add-drop-table \
  --skip-add-locks \
  --no-tablespaces \
  ${TMP_DB} > dump-prod.sql

echo "Cleaning up temp DB..."

docker exec ${DB_CONTAINER} mariadb -u root -p${MARIADB_ROOT_PASSWORD} \
  -e "DROP DATABASE ${TMP_DB};"

echo "Copying DB..."

scp dump-prod.sql ${SSH_TARGET}:/tmp/

ssh -T ${SSH_TARGET} <<EOF

# wait for DB to be ready
until docker exec ${COMPOSE_PROJECT_NAME}-db-1 \
  mariadb -u ${WORDPRESS_DB_USER} -p"${WORDPRESS_DB_PASSWORD}" -e "SELECT 1" >/dev/null 2>&1; do
  sleep 1
done

# wipe tables
docker exec -i ${COMPOSE_PROJECT_NAME}-db-1 \
  mariadb -u ${WORDPRESS_DB_USER} -p"${WORDPRESS_DB_PASSWORD}" ${DB_NAME} \
  -e "SET FOREIGN_KEY_CHECKS=0; 
      DROP TABLE IF EXISTS wp_commentmeta, wp_comments, wp_links, wp_options, wp_postmeta, wp_posts, wp_termmeta, wp_terms, wp_term_taxonomy, wp_usermeta, wp_users; 
      SET FOREIGN_KEY_CHECKS=1;"

# import fresh DB
docker exec -i ${COMPOSE_PROJECT_NAME}-db-1 \
  mariadb -u ${WORDPRESS_DB_USER} -p"${WORDPRESS_DB_PASSWORD}" ${DB_NAME} \
  < /tmp/dump-prod.sql

EOF

echo "Syncing..."

rsync -avz --delete wp-content/ \
  ${SSH_TARGET}:${REMOTE_PATH}/wp-content/

echo "Importing DB on server..."

ssh ${SSH_TARGET} "bash -c 'docker exec -i ${COMPOSE_PROJECT_NAME}-db-1 mariadb -u ${WORDPRESS_DB_USER} -p\"${WORDPRESS_DB_PASSWORD}\" ${DB_NAME} < /tmp/dump-prod.sql'"
