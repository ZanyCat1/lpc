<?php
wp_nav_menu([
    'theme_location' => 'primary',
]);
?>

<?php
if (have_posts()) :
  while (have_posts()) : the_post();
    the_title('<h1>', '</h1>');
    the_post_thumbnail();
    the_content();
  endwhile;
endif;
?>

