<?php

/**
 * Template Name: Projects
 */
get_header(); ?>

<main class="projects-page">

  <h1>Projects</h1>

  <?php
  $projects = get_posts([
    'post_type' => 'project',
    'numberposts' => -1,
    'post_status' => 'publish'
  ]);
  ?>

  <?php if (!empty($projects)) : ?>
    <div class="projects-grid">

      <?php foreach ($projects as $project) : ?>

        <a class="project-card" href="<?php echo get_permalink($project->ID); ?>">

          <div class="project-image">
            <?php
            if (has_post_thumbnail($project->ID)) {
              echo get_the_post_thumbnail($project->ID, 'medium');
            }
            ?>
          </div>

          <div class="project-info">
            <h2><?php echo esc_html($project->post_title); ?></h2>
          </div>

        </a>

      <?php endforeach; ?>

    </div>
  <?php else : ?>
    <p>No projects found.</p>
  <?php endif; ?>

</main>

<?php get_footer(); ?>