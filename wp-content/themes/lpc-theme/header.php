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
    <div class="nav-wrap">

      <nav class="nav-breadcrumbs"></nav>
      <div class="nav-gap"></div>

      <nav class="navbar" id="header-navbar">
        <?php
        wp_nav_menu([
          'theme_location' => 'primary',
          'container' => false,
          'menu_class' => 'nav-list',
        ]);
        ?>

        <div class="theme-toggle" id="theme-toggle">
          <span class="icon">🌙</span>
        </div>
      </nav>

    </div>
  </div>

</header>