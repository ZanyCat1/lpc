<?php
$ids = $args['ids'] ?? '';

if (empty($ids)) return;

$images = [];
$ids = explode(',', $ids);

foreach ($ids as $id) {
  $images[] = [
    'src' => wp_get_attachment_image_url($id, 'large'),
    'srcset' => wp_get_attachment_image_srcset($id, 'large'),
    'sizes' => '(max-width: 768px) 100vw, 80vw',
    'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
    'caption' => wp_get_attachment_caption($id),
    'description' => get_post_field('post_content', $id),
  ];
}

// first image = poster
$poster = $images[0] ?? null;
?>

<?php if ($poster): ?>
  <div class="gallery">
    <img
      src="<?php echo esc_url($poster['src']); ?>"
      class="gallery-item"
      srcset="<?php echo esc_attr($poster['srcset'] ?? ''); ?>"
      sizes="(max-width: 768px) 100vw, 80vw""
      alt=" <?php echo esc_attr($psoter['alt'] ?? ''); ?>"
      data-index="0"
      style="cursor:pointer;">
  </div>
<?php endif; ?>

<!-- modal -->
<div id="gallery-modal" class="modal hidden">
  <button id="gallery-close" style="display:none">×</button>

  <div class="swiper gallery-swiper">
    <div class="swiper-wrapper"></div>
  </div>

</div>

<script>
  window.galleryData = <?php echo json_encode($images); ?>;
</script>