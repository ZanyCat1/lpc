<?php

function theme_enqueue_assets() {

  wp_enqueue_style(
    'theme-base',
    get_template_directory_uri() . '/assets/css/base.css',
    [],
    '1.0'
  );

  wp_enqueue_style(
    'theme-header-nav',
    get_template_directory_uri() . '/assets/css/header-nav.css',
    ['theme-base'],
    '1.0'
  );

  wp_enqueue_script(
    'theme-header-nav',
    get_template_directory_uri() . '/assets/js/header-nav.js',
    [],
    '1.0',
    true
  );
}

add_action('wp_enqueue_scripts', 'theme_enqueue_assets');