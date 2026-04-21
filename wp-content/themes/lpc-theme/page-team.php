<?php get_header(); ?>

<main class="container">
  <?php
  if (have_posts()) :
    while (have_posts()) : the_post();
      the_title('<h1>', '</h1>');
  ?><div class="gallery-container">
        <div>Left div</div>
        <?php
        // the_content();

        // 👇 call your gallery component
        $gallery = get_post_gallery(get_the_ID(), false);

        if (!empty($gallery['ids'])) {
          get_template_part('template-parts/gallery-modal', null, [
            'ids' => $gallery['ids']
          ]);
        }
        ?>
      </div>
  <?php

    endwhile;
  endif;
  ?>
</main>

<?php get_footer(); ?>