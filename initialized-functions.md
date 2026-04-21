// NOTE: state_regions option initialized once via temporary code (April 2026)
// Stored in wp_options table. Edit via admin UI (future) or update_option().
add_action('after_setup_theme', function () {
if (!get_option('state_regions')) {
update_option('state_regions', [
'Region 1' => ['CA'],
'Region 2' => ['GA', 'FL'],
'Region 3' => ['NY']
]);
}
});