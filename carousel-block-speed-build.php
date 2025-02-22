<?php
/**
 * Plugin Name:       Carousel Block – Speed Build Challenge
 * Description:       A custom carousel block plugin for the WordCamp Asia 2025 Speed Build Challenge.
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            Nick Diego
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       carousel-block
 *
 * @package           carousel-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function carousel_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'carousel_block_init' );

/**
 * Enqueue frontend scripts for the carousel
 */
function carousel_block_enqueue_scripts() {
	// Check for block in content, reusable blocks, and widget areas
	if ( has_block( 'carousel-block/carousel' ) || 
		 is_active_widget( false, false, 'block' ) ||
		 ( function_exists( 'has_blocks' ) && has_blocks( get_the_ID() ) ) ) {
		
		$asset_file_path = plugin_dir_path( __FILE__ ) . 'build/carousel.asset.php';
		$asset_file = file_exists( $asset_file_path )
			? include( $asset_file_path )
			: array(
				'dependencies' => array(),
				'version'     => filemtime( plugin_dir_path( __FILE__ ) . 'build/carousel.js' ),
			);

		// Enqueue Splide CSS
		wp_enqueue_style(
			'splide',
			plugins_url( 'node_modules/@splidejs/splide/dist/css/splide.min.css', __FILE__ ),
			array(),
			'4.1.4'
		);

		// Enqueue our styles
		wp_enqueue_style(
			'carousel-block-style',
			plugins_url( 'build/style-index.css', __FILE__ ),
			array('splide'),
			$asset_file['version']
		);

		// Enqueue Splide JS
		wp_enqueue_script(
			'splide',
			plugins_url( 'node_modules/@splidejs/splide/dist/js/splide.min.js', __FILE__ ),
			array(),
			'4.1.4',
			true
		);

		// Enqueue our carousel script
		wp_enqueue_script(
			'carousel-block-script',
			plugins_url( 'build/carousel.js', __FILE__ ),
			array_merge($asset_file['dependencies'], array('wp-element', 'splide')),
			$asset_file['version'],
			true
		);
	}
}
add_action( 'wp_enqueue_scripts', 'carousel_block_enqueue_scripts' ); 
