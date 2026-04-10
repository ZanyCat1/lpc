<?php
$images = [];

$gallery = get_post_gallery(get_the_ID(), false);
if (!empty($gallery['ids'])) {
  $ids = explode(',', $gallery['ids']);

  foreach ($ids as $id) {
    $images[] = [
      'src' => wp_get_attachment_image_url($id, 'large'),
      'srcset' => wp_get_attachment_image_srcset($id, 'large'),
      'sizes' => '(max-width: 768px) 100vw, 80vw',
      'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
    ];
  }
}
?>

<div class="gallery">
  <?php foreach ($images as $index => $img): ?>
    <img
      src="<?php echo esc_url($img['src']); ?>"
      class="gallery-item"
      data-index="<?php echo $index; ?>">
  <?php endforeach; ?>
</div>

<!-- ONE modal -->
<div id="gallery-modal" class="modal hidden">
  <button id="gallery-close">×</button>

  <div class="swiper gallery-swiper">

    <div class="swiper-wrapper"></div>
  </div>
</div>

<!-- Pass data ONCE -->
<script>
  window.galleryData = <?php echo json_encode($images); ?>;
</script>