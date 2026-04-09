<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  <header class="site-header">

    <div id="nav-wrap-dock">
      <div class="nav-wrap nav-show nav-fixed">

        <nav class="nav-left-gap"></nav>
        <div class="nav-center-gap"></div>

        <nav class="navbar" id="header-navbar">
          <?php
          wp_nav_menu([
            'theme_location' => 'primary',
            'container' => false,
            'menu_class' => 'nav-list',
          ]);
          ?>

          <div id="theme-toggle">
            <span class="icon">🌙</span>
          </div>
        </nav>

      </div>
    </div>

  </header>