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

<div class="gallery-container"
  data-gallery='<?php echo esc_attr(json_encode($images)); ?>'>
  <div>THE DIV</div>
  <div class="gallery-list">
    <?php foreach ($images as $index => $img): ?>
      <div class="gallery-item" data-index="<?php echo $index; ?>">

        <div class="gallery-thumb">
          <?php echo wp_get_attachment_image($ids[$index], 'thumbnail', false, ['sizes' => '25vw']); ?>
        </div>

        <div class="gallery-text">
          <?php if ($img['caption']): ?>
            <strong><?php echo esc_html($img['caption']); ?></strong>
          <?php endif; ?>

          <?php if ($img['description']): ?>
            <p><?php echo esc_html($img['description']); ?></p>
          <?php endif; ?>
        </div>

      </div>
    <?php endforeach; ?>
  </div>

</div>
<script>
  window.galleryData = <?php echo json_encode($images); ?>;
</script>