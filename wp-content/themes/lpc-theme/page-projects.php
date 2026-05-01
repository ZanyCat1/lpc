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
        <?php if (has_term(['Construction'], 'project_tag', $project->ID)): ?>

          <a class="project-card" href="<?php echo get_permalink($project->ID); ?>">

            <div class="project-image">
              <?php if (has_post_thumbnail($project->ID)):

                $id = get_post_thumbnail_id($project->ID);

                $thumb150 = wp_get_attachment_image_url($id, 'thumbnail');
                $thumb300 = wp_get_attachment_image_url($id, 'medium');
                $thumb512 = wp_get_attachment_image_url($id, 'medium-large-s');

                $alt = esc_attr(get_post_meta($id, '_wp_attachment_image_alt', true));

                $meta = wp_get_attachment_metadata($id);
                $w = $meta['width'] ?? 150;
                $h = $meta['height'] ?? 150;
              ?>

                <picture>
                  <!-- mobile -->
                  <source
                    media="(max-width: 450px)"
                    srcset="<?php echo esc_url($thumb150); ?> 150w"
                    sizes="33vw">

                  <!-- desktop -->
                  <source
                    media="(min-width: 1024px)"
                    srcset="<?php echo esc_url($thumb512); ?> 512w"
                    sizes="33vw">

                  <!-- tablet -->
                  <source
                    media="(min-width: 451px)"
                    srcset="<?php echo esc_url($thumb300); ?> 300w"
                    sizes="33vw">

                  <img
                    src="<?php echo esc_url($thumb150); ?>"
                    alt="<?php echo $alt; ?>"
                    loading="lazy"
                    decoding="async"
                    width="<?php echo $w; ?>"
                    height="<?php echo $h; ?>">
                </picture>

              <?php endif; ?>
            </div>

            <div class="project-info">
              <h2 class="project-title"><?php echo esc_html($project->post_title); ?></h2>
            </div>

          </a>

        <?php endif; ?>
      <?php endforeach; ?>
    </div>
  <?php else : ?>
    <p>No projects found.</p>
  <?php endif; ?>

</main>

<?php get_footer(); ?>