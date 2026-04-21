<?php
add_action('admin_menu', function () {
  add_menu_page(
    'State Regions',
    'State Regions',
    'manage_options',
    'state-regions',
    'render_state_regions_page'
  );
});
function render_state_regions_page()
{
  // Handle form submit
  if (isset($_POST['state_regions_text'])) {
    $raw = trim($_POST['state_regions_text']);
    $lines = explode("\n", $raw);

    $regions = [];

    foreach ($lines as $line) {
      if (strpos($line, ':') === false) continue;

      list($region, $states) = explode(':', $line, 2);

      $region = trim($region);
      $states = array_map('trim', explode(',', $states));

      // normalize states (uppercase, remove empties)
      $states = array_filter(array_map('strtoupper', $states));

      if ($region && $states) {
        $regions[$region] = $states;
      }
    }

    update_option('state_regions', $regions);

    echo '<div class="updated"><p>Saved!</p></div>';
  }

  // Load existing data
  $regions = get_option('state_regions', []);

  // Convert to textarea format
  $text = '';
  foreach ($regions as $region => $states) {
    $text .= $region . ': ' . implode(', ', $states) . "\n";
  }
?>

  <div class="wrap">
    <h1>State Regions</h1>

    <form method="post">
      <textarea name="state_regions_text" rows="10" style="width:100%;"><?php echo esc_textarea($text); ?></textarea>
      <p>
        <button type="submit" class="button button-primary">Save</button>
      </p>
    </form>

    <p>Format: <code>Region Name: GA, FL, NY</code></p>
  </div>


<?php
}
?>