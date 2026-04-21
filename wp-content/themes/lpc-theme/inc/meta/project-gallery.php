<?php add_action('add_meta_boxes', function () {
  add_meta_box(
    'project_gallery',
    'Project Gallery',
    'render_project_gallery_meta_box',
    'project',
    'normal',
    'default'
  );
});

function render_project_gallery_meta_box($post)
{
  $image_ids = get_post_meta($post->ID, 'project_gallery', true);
  if (!is_array($image_ids)) $image_ids = [];

  echo '<div id="project-gallery-container">';

  foreach ($image_ids as $id) {
    $img = wp_get_attachment_image($id, 'thumbnail');
    echo "<div class='gallery-item' data-id='$id'>$img</div>";
  }

  echo '</div>';

  echo '<input type="hidden" id="project-gallery-input" name="project_gallery" value="' . esc_attr(implode(',', $image_ids)) . '" />';

  echo '<button type="button" class="button" id="project-gallery-add">Add Images</button>';
}

add_action('save_post', function ($post_id) {

  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
  if (wp_is_post_revision($post_id)) return;
  if (get_post_type($post_id) !== 'project') return;

  if (isset($_POST['project_gallery'])) {
    $ids = array_filter(array_map('intval', explode(',', $_POST['project_gallery'])));
    update_post_meta($post_id, 'project_gallery', $ids);
  } else {
    delete_post_meta($post_id, 'project_gallery');
  }
});

add_action('admin_enqueue_scripts', function ($hook) {
  global $post;

  if ($post && $post->post_type === 'project') {
    wp_enqueue_media();

    wp_add_inline_script('jquery-core', "
      jQuery(document).ready(function($) {
        let frame;

        $('#project-gallery-add').on('click', function(e) {
          e.preventDefault();

          if (frame) {
            frame.open();
            return;
          }

          frame = wp.media({
            title: 'Select Images',
            button: { text: 'Use Images' },
            multiple: true
          });

          frame.on('select', function() {
            const selection = frame.state().get('selection');
            let ids = $('#project-gallery-input').val() ? $('#project-gallery-input').val().split(',') : [];

            selection.each(function(attachment) {
              attachment = attachment.toJSON();
              ids.push(attachment.id);

              $('#project-gallery-container').append(
                `<div class='gallery-item' data-id='\${attachment.id}'>
                  <img src='\${attachment.sizes.thumbnail.url}' />
                </div>`
              );
            });

            $('#project-gallery-input').val(ids.join(','));
          });

          frame.open();
        });
      });
    ");
  }
});
