<?php
$ids = $args['ids'] ?? '';

if (empty($ids)) return;

$images = [];
$ids = explode(',', $ids);

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
<!-- visible gallery -->
<div class="gallery-list">
  <?php foreach ($images as $index => $img): ?>
    <div class="gallery-item" data-index="<?php echo $index; ?>">

      <div class="gallery-thumb">
        <img
          src="<?php echo esc_url(wp_get_attachment_image_url($ids[$index], 'thumbnail')); ?>"
          alt="<?php echo esc_attr($img['alt']); ?>"
          class="rounded-img">
      </div>

      <div class="gallery-text">
        <?php if (!empty($img['caption'])): ?>
          <strong><?php echo esc_html($img['caption']); ?></strong>
        <?php endif; ?>

        <?php if (!empty($img['description'])): ?>
          <p><?php echo esc_html($img['description']); ?></p>
        <?php endif; ?>
      </div>

    </div>
  <?php endforeach; ?>
</div>

<!-- modal -->
<div id="gallery-modal" class="modal hidden">
  <button id="gallery-close" style="display:none">×</button>

  <div class="swiper gallery-swiper">
    <div class="swiper-wrapper"></div>
  </div>
  <div class="gallery-filmstrip"></div>

</div>

<script>
  window.galleryData = <?php echo json_encode($images); ?>;
</script>