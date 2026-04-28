<?php get_header(); ?>

<main class="container project-single">

  <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

      <h1><?php the_title(); ?></h1>

      <div class="project-content">
        <?php the_content(); ?>
      </div>

      <?php
      $image_ids = get_post_meta(get_the_ID(), 'project_gallery', true);
      if (!is_array($image_ids)) $image_ids = [];
      ?>

      <?php if (!empty($image_ids)) : ?>
        <?php
        get_template_part('template-parts/gallery/project', null, [
          'ids' => implode(',', $image_ids)
        ]);
        ?>
      <?php endif; ?>

  <?php endwhile;
  endif; ?>

</main>

<?php get_footer(); ?>