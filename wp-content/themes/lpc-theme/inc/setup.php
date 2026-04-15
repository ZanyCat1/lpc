<?php
function lpc_theme_setup()
{
  register_nav_menus([
    'primary' => 'Primary Menu',
  ]);
}
add_action('after_setup_theme', 'lpc_theme_setup');
add_action('after_setup_theme', function () {
  add_image_size('medium-large-s', 512, 512, false);
  add_image_size('medium-large-m', 640, 640, false);
  add_image_size('medium-large-l', 900, 900, false);
});
