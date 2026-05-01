<?php
$ids = $args['ids'] ?? '';
if (empty($ids)) return;

$ids = explode(',', $ids);

$images = [];

foreach ($ids as $id) {
  $images[] = [
    'src' => wp_get_attachment_image_url($id, 'large'),
    'thumb' => wp_get_attachment_image_url($id, 'thumbnail'),
    'srcset' => wp_get_attachment_image_srcset($id, 'large'),
    'sizes' => '(max-width: 768px) 100vw, 80vw',
    'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
    'caption' => wp_get_attachment_caption($id),
    'description' => get_post_field('post_content', $id),
  ];
}
?>

<div class="gallery-grid">

  <?php foreach ($images as $index => $img): ?>
    <a class="gallery-card" data-index="<?php echo $index; ?>">


      <div class="gallery-thumb">
        <?php
        $id = $ids[$index];

        $thumb150 = wp_get_attachment_image_url($id, 'thumbnail');
        $thumb300 = wp_get_attachment_image_url($id, 'medium');
        $thumb512 = wp_get_attachment_image_url($id, 'medium-large-s');
        $alt = esc_attr($img['alt']);

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

          <!-- tablet  -->
          <source
            media="(min-width: 451px)"
            srcset="<?php echo esc_url($thumb300); ?> 300w"
            sizes=" 33vw">

          <img
            src="<?php echo esc_url($thumb150); ?>"
            alt="<?php echo $alt; ?>"
            loading="lazy"
            decoding="async"
            width="<?php echo $w; ?>"
            height="<?php echo $h; ?>"
            class="rounded-img">
        </picture>
      </div>

      <div class="gallery-text">
        <?php if ($img['caption']): ?>
          <strong><?php echo esc_html($img['caption']); ?></strong>
        <?php endif; ?>

        <?php if ($img['description']): ?>
          <p><?php echo esc_html($img['description']); ?></p>
        <?php endif; ?>
      </div>

    </a>
  <?php endforeach; ?>

</div>
<script>
  window.galleryData = <?php echo json_encode($images); ?>;
</script>