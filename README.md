# ${COMPOSE_PROJECT_NAME} WordPress Project Setup (Professional Workflow)

## Overview

This project is structured as a **professional WordPress development environment** with:

- Docker-based local development
- Clean theme architecture
- Separation of concerns (code, database, media)
- Dev → Prod deployment pipeline
- LAN + localhost access during development

---

---

# 0. Setup on Remote:

On remote:

```
docker volume create ${COMPOSE_PROJECT_NAME}_db_data
```

On dev:

```
./init.sh
```

Now any changes you make in dev, you will be able to run

```
./deploy.sh
```

to propagate them to prod

---

# 1. Project Structure

## Root Project Layout

```
${COMPOSE_PROJECT_NAME}-site/
├── compose.yml
├── README.md
├── .dockerignore
├── .gitignore
├── php/
│   └── uploads.ini/
├── wp-content/
│   └── themes/
│       └── ${COMPOSE_PROJECT_NAME}-theme/
```

You may optionally include full WordPress files, but best practice is:

- Let Docker manage WordPress core
- Only version control your theme + config
- php/uploads.ini increases max upload file size

---

# 2. Docker Setup

## compose.yml

```
version: "3.9"

services:
  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_DATABASE: ${MARIADB_DATABASE}
      MARIADB_USER: ${MARIADB_USER}
      MARIADB_PASSWORD: ${MARIADB_PASSWORD}
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

  wordpress:
    user: "1000:1000"
    image: wordpress:php8.2-apache
    restart: unless-stopped
    depends_on:
      - db
    ports:
      - "${WP_PORT}:80"
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${WORDPRESS_DB_USER}
      WORDPRESS_DB_PASSWORD: ${WORDPRESS_DB_PASSWORD}
      WORDPRESS_DB_NAME: ${WORDPRESS_DB_NAME}
    volumes:
      - ./wp-content:/var/www/html/wp-content
      - ./php/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini

volumes:
  db_data:
    external: true
    name: ${COMPOSE_PROJECT_NAME}_db_data
```

---

# 3. Theme Architecture

```
${COMPOSE_PROJECT_NAME}-theme/
├── style.css
├── functions.php
├── index.php
├── header.php
├── footer.php

├── inc/
│   ├── enqueue.php
│   ├── setup.php
│   ├── helpers.php

├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── pages/
│   │       ├── home.css
│   │       └── about.css
│   ├── js/
│   │   ├── main.js
│   │   └── pages/
│   │       ├── home.js
│   │       └── about.js
│   └── images/

├── template-parts/
│   ├── components/
│   └── sections/

├── templates/
    ├── page-home.php
    ├── page-about.php
```

---

# 4. CSS Strategy

## Structure

- base.css → typography, resets, variables
- layout.css → containers, header/footer, layout
- components.css → buttons, forms, UI elements
- pages/\*.css → only when necessary

## style.css

```
@import url("assets/css/base.css");
@import url("assets/css/layout.css");
@import url("assets/css/components.css");
```

## Rule

Reuse global styles first. Only create page-specific CSS when necessary.

---

# 5. JavaScript Strategy

## functions.php (minimal)

```
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/setup.php';
```

## enqueue.php

```
function ${COMPOSE_PROJECT_NAME}_enqueue_assets() {
    wp_enqueue_style('main-style', get_stylesheet_uri());

    wp_enqueue_script(
        'main-js',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        null,
        true
    );

    if (is_page('home')) {
        wp_enqueue_script(
            'home-js',
            get_template_directory_uri() . '/assets/js/pages/home.js',
            [],
            null,
            true
        );
    }
}
add_action('wp_enqueue_scripts', '${COMPOSE_PROJECT_NAME}_enqueue_assets');
```

---

# 6. Page Templates

Templates live in /templates/ and must include:

```
<?php
/*
Template Name: Home Page
*/
```

---

# 7. LAN + Localhost Access

## wp-config.php (dynamic environment detection)

```
$host = $_SERVER['HTTP_HOST'];

if (strpos($host, 'localhost') !== false || strpos($host, '192.168.') !== false) {
    define('WP_HOME', 'http://' . $host);
    define('WP_SITEURL', 'http://' . $host);
} else {
    define('WP_HOME', 'https://yourdomain.com');
    define('WP_SITEURL', 'https://yourdomain.com');
}
```

## Result

- localhost:8080 → works
- LAN (192.168.x.x:8080) → works
- production domain → works

---

# 8. Version Control

## Do NOT commit:

wp-config.php

## Instead:

wp-config.php.example

```
## .gitignore

wp-config.php
node_modules/
vendor/
.env
```

---

# 9. Database Strategy

Do NOT share DB between dev and prod.

Reasons:

- URL conflicts
- risk of breaking production
- serialized data corruption
- security concerns

---

# 10. Database Sync Workflow

```
## Export

wp db export dump.sql
```

```
## Replace URLs safely

wp search-replace 'http://dev-url' 'https://prod-url' --export=dump-prod.sql
```

```
## Import (prod)

wp db import dump-prod.sql
```

---

# 11. Media (Uploads)

## Rule

- Files live in /wp-content/uploads/
- DB stores metadata only

```
## Sync

rsync -avz wp-content/uploads/ user@server:/var/www/html/wp-content/uploads/
```

## Important

- Do NOT manually insert media into DB
- Do NOT re-upload unless necessary

```
## Optional

wp media regenerate
```

---

# 12. Deployment Workflow

## One-way flow

DEV → PROD

## Deploy Script Example

```
#!/bin/bash

DEV_URL="http://192.168.1.100:8080"
PROD_URL="https://yourdomain.com"

echo "Exporting DB..."
wp db export dump.sql

echo "Replacing URLs..."
wp search-replace "$DEV_URL" "$PROD_URL" --export=dump-prod.sql

echo "Copying DB..."
scp dump-prod.sql user@server:/tmp/

echo "Importing DB..."
ssh user@server "wp db import /tmp/dump-prod.sql"

echo "Syncing uploads..."
rsync -avz wp-content/uploads/ user@server:/var/www/html/wp-content/uploads/

echo "Deploying theme..."
rsync -avz wp-content/themes/${COMPOSE_PROJECT_NAME}-theme/ user@server:/var/www/html/wp-content/themes/${COMPOSE_PROJECT_NAME}-theme/

echo "Done."
```

---

# 13. Separation of Concerns

Theme → Git  
DB → WP-CLI  
Media → rsync  
WP Core→ Docker

---

# 14. Core Principles

- functions.php = bootstrap only
- inc/ = logic
- template-parts/ = reusable UI
- templates/ = page composition
- assets/ = frontend code
- page-specific assets only when necessary

---

# Final Summary

- Use Docker Compose for dev
- Use dynamic wp-config for LAN + localhost
- Never share DB between dev and prod
- Use WP-CLI for safe DB sync
- Use rsync for uploads and theme files
- Keep theme in Git, everything else external
