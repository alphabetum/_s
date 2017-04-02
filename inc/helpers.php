<?php
/**
 * Helpers
 *
 * @package wordpress-theme-boilerplate
 */

/**
 * Print the path of a file in the 'images' directory with the theme version
 * appended at the end.
 */
function get_theme_image( $theme_image ) {
	$image_uri = get_theme_file_uri( 'assets/images/' . $theme_image );
	echo $image_uri . '?v=' . wp_get_theme()->get( 'Version' );
}

