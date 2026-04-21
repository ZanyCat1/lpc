<?php
add_action('init', function () {
  register_post_type('project', [
    'labels' => [
      'name' => 'Projects',
      'singular_name' => 'Project',
      'add_new_item' => 'Add New Project',
      'edit_item' => 'Edit Project',
    ],
    'public' => true,
    'has_archive' => true,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => ['title', 'editor', 'thumbnail'],
    'rewrite' => ['slug' => 'projects'],
    'show_in_rest' => true,
  ]);
});

add_action('init', function () {
  register_taxonomy('project_tag', 'project', [
    'label' => 'Project Tags',
    'public' => true,
    'hierarchical' => false,
    'show_in_rest' => true,
  ]);
});
