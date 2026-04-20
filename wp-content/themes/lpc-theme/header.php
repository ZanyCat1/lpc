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
        <div class="nav-left-gap"><?php the_custom_logo() ?></div>
        <div class="nav-center-gap"></div>
        <nav class="navbar" id="header-navbar">
          <?php
          // normal wordpress nav
          // wp_nav_menu([
          //   'theme_location' => 'primary',
          //   'container' => false,
          //   'menu_class' => 'nav-list',
          // ]);
          // our custom nav
          $locations = get_nav_menu_locations();
          $menu = wp_get_nav_menu_object($locations['primary']);
          $items = wp_get_nav_menu_items($menu->term_id);

          $tree = [];
          $lookup = [];

          // first pass: index all items
          foreach ($items as $item) {
            $item->children = [];
            $lookup[$item->ID] = $item;
          }

          // second pass: assign children
          foreach ($items as $item) {
            if ($item->menu_item_parent) {
              $lookup[$item->menu_item_parent]->children[] = $item;
            } else {
              $tree[] = $item;
            }
          }

          echo '<ul class="nav-list">';
          foreach ($tree as $item) {
            echo '<li class="menu-item">';
            echo '<div>';
            echo '<a href="' . esc_url($item->url) . '">' . esc_html($item->title) . '</a>';

            if (!empty($item->children)) {
              echo '<div class="sub-menu-wrap">';
              echo '<ul class="sub-menu">';

              foreach ($item->children as $child) {
                echo '<li class="menu-item">';
                echo '<a href="' . esc_url($child->url) . '">' . esc_html($child->title) . '</a>';
                echo '</li>';
              }

              echo '</ul>';
              echo '</div>';
            }

            echo '</div>';
            echo '</li>';
          }
          echo '</ul>';
          ?>

          <div>
            <div id="theme-toggle">
              <span class="icon">🌙</span>
            </div>
          </div>
        </nav>

      </div>
    </div>

  </header>