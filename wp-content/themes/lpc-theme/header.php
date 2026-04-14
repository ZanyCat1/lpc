<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <script>
    (function() {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      const mode = saved || (prefersDark ? "dark" : "light");

      document.documentElement.classList.add(mode);
      document.documentElement.classList.add('no-transition');
      window.addEventListener('load', () => {
        document.documentElement.classList.remove('no-transition');
      });
    })();
  </script>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php bloginfo('name'); ?></title>
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

  <header class="site-header">

    <div id="nav-wrap-dock">
      <div class="nav-wrap">
        <div class="nav-left-gap"></div>
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