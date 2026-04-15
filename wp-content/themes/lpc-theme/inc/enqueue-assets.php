<?php

function theme_enqueue_assets()
{

  wp_enqueue_style(
    'theme-base',
    get_template_directory_uri() . '/assets/css/base.css',
    [],
    filemtime(get_template_directory() . '/assets/css/base.css')
  );

  wp_enqueue_style(
    'theme-header-nav-css',
    get_template_directory_uri() . '/assets/css/header-nav.css',
    ['theme-base'],
    filemtime(get_template_directory() . '/assets/css/header-nav.css')
  );

  wp_enqueue_script(
    'theme-header-nav-js',
    get_template_directory_uri() . '/assets/js/header-nav.js',
    [],
    filemtime(get_template_directory() . '/assets/js/header-nav.js'),
    true
  );

  wp_enqueue_style(
    'theme-components',
    get_template_directory_uri() . '/assets/css/components.css',
    ['theme-base'],
    filemtime(get_template_directory() . '/assets/css/components.css')
  );

  wp_enqueue_script(
    'theme-gallery-js',
    get_template_directory_uri() . '/assets/js/gallery.js',
    [],
    filemtime(get_template_directory() . '/assets/js/gallery.js'),
    true
  );

  wp_enqueue_style(
    'theme-gallery-css',
    get_template_directory_uri() . '/assets/css/gallery.css',
    ['theme-base'],
    filemtime(get_template_directory() . '/assets/css/gallery.css')
  );
}

wp_enqueue_script('swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', [], null, true);
wp_enqueue_style('swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');

add_action('wp_enqueue_scripts', 'theme_enqueue_assets');
