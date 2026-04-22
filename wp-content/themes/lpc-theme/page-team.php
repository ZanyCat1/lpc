<?php

/**
 * Template Name: Team
 */
get_header();
?>

<main class="container">
  <?php
  // 1. Query the "Team" project
  $team_project = new WP_Query([
    'post_type' => 'project',
    'name' => 'team', // slug must be "team"
    'posts_per_page' => 1
  ]);

  if ($team_project->have_posts()) :
    while ($team_project->have_posts()) : $team_project->the_post();

      // 2. Get its gallery
      $image_ids = get_post_meta(get_the_ID(), 'project_gallery', true);
      if (!is_array($image_ids)) $image_ids = [];

      // 3. Render gallery
      if (!empty($image_ids)) {
        get_template_part('template-parts/gallery/team', null, [
          'ids' => implode(',', $image_ids)
        ]);
      }

    endwhile;
    wp_reset_postdata();
  endif;
  ?>

</main>

<?php get_footer(); ?>