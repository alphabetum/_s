<?php
/**
 * Helpers
 *
 * @package wordpress-theme-boilerplate
 */

/**
 * Return the path of a file in the 'images' directory with the theme version
 * appended at the end.
 */
function get_theme_image_uri( $theme_image ) {
	$image_uri = get_theme_file_uri( 'assets/images/' . $theme_image );
	return $image_uri . '?v=' . wp_get_theme()->get( 'Version' );
}

