<?php
function lpc_theme_setup() {
    register_nav_menus([
        'primary' => 'Primary Menu',
    ]);
}
add_action('after_setup_theme', 'lpc_theme_setup');