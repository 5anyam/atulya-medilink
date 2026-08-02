<?php
/**
 * Plugin Name:       Atulya Banner Manager
 * Description:        Simple banner manager for the Atulya Medilink website. Upload a banner and it is saved to a FIXED URL that the website already points to — so the front-end never has to change. Non-technical team members just pick a slot and upload.
 * Version:           1.0.0
 * Author:            Atulya Medilink
 * License:           GPL-2.0-or-later
 * Requires at least: 5.5
 * Requires PHP:      7.2
 *
 * HOW IT WORKS
 * ------------
 * Every banner "slot" maps to one fixed file on disk, e.g.
 *     wp-content/uploads/atulya-banners/home-cosmetics.jpg
 * The website's front-end already links to these exact URLs. When a team member
 * uploads a new image for a slot, this plugin OVERWRITES that same file, so the
 * public URL stays identical and the website shows the new image automatically.
 * Nobody has to touch the website code.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

class Atulya_Banner_Manager {

	/** Folder (inside uploads) where all managed banners live. */
	const DIR = 'atulya-banners';

	/** Downscale anything wider than this (keeps files light). */
	const MAX_WIDTH = 1920;

	/** Everything is stored as optimized JPG at this quality. */
	const JPG_QUALITY = 82;

	/**
	 * The banner slots.
	 *  key      => stable id (also the filename, minus .jpg)
	 *  label    => shown to the team
	 *  group    => section heading in the admin UI
	 *  seed     => an existing image (relative to uploads/) used as the default
	 *              the first time, so nothing is ever blank.
	 */
	public static function slots() {
		return array(
			'home-cosmetics'      => array( 'label' => 'Home Page — Cosmetics',      'group' => 'Home Page',       'seed' => '2026/07/cosmetics-banner.png' ),
			'home-nutraceuticals' => array( 'label' => 'Home Page — Nutraceuticals', 'group' => 'Home Page',       'seed' => '2026/07/nutra-banner.png' ),
			'home-ayurveda'       => array( 'label' => 'Home Page — Ayurveda',       'group' => 'Home Page',       'seed' => '2026/07/ayurveda-banner.png' ),
			'shop-cosmetics'      => array( 'label' => 'Shop Page — Cosmetics',      'group' => 'Shop Category Pages', 'seed' => '2026/07/cosmetics-banner.png' ),
			'shop-nutraceuticals' => array( 'label' => 'Shop Page — Nutraceuticals', 'group' => 'Shop Category Pages', 'seed' => '2026/07/nutra-banner.png' ),
			'shop-ayurveda'       => array( 'label' => 'Shop Page — Ayurveda',       'group' => 'Shop Category Pages', 'seed' => '2026/07/ayurveda-banner.png' ),
		);
	}

	public static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'activate' ) );
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_atulya_upload_banner', array( __CLASS__, 'handle_upload' ) );
	}

	/** Absolute path to the banners folder. */
	public static function dir_path() {
		$up = wp_upload_dir();
		return trailingslashit( $up['basedir'] ) . self::DIR;
	}

	/** Public base URL of the banners folder. */
	public static function dir_url() {
		$up = wp_upload_dir();
		return trailingslashit( $up['baseurl'] ) . self::DIR;
	}

	public static function slot_path( $key ) {
		return trailingslashit( self::dir_path() ) . $key . '.jpg';
	}

	public static function slot_url( $key ) {
		return trailingslashit( self::dir_url() ) . $key . '.jpg';
	}

	/** Create folder, protect against caching, and seed defaults. */
	public static function activate() {
		$dir = self::dir_path();
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}

		// Make the folder serve fresh images (so replacing a file shows up quickly).
		$htaccess = trailingslashit( $dir ) . '.htaccess';
		if ( ! file_exists( $htaccess ) ) {
			$rules = "<IfModule mod_headers.c>\n"
				. "  <FilesMatch \"\\.(jpg|jpeg|png|gif|webp)$\">\n"
				. "    Header set Cache-Control \"no-cache, must-revalidate, max-age=0\"\n"
				. "  </FilesMatch>\n"
				. "</IfModule>\n";
			@file_put_contents( $htaccess, $rules );
		}

		// Seed each slot from an existing image the first time only.
		$up = wp_upload_dir();
		foreach ( self::slots() as $key => $slot ) {
			$target = self::slot_path( $key );
			if ( file_exists( $target ) ) {
				continue;
			}
			$source = trailingslashit( $up['basedir'] ) . ltrim( $slot['seed'], '/' );
			if ( file_exists( $source ) ) {
				self::save_as_jpg( $source, $target );
			}
		}
	}

	public static function menu() {
		add_menu_page(
			'Atulya Banners',
			'Atulya Banners',
			'upload_files',
			'atulya-banners',
			array( __CLASS__, 'render' ),
			'dashicons-format-image',
			26
		);
	}

	/**
	 * Load an image (path), downscale if huge, and save it as a JPG at $target.
	 * Uses WordPress' built-in image editor (GD or Imagick) so no extra libs.
	 */
	private static function save_as_jpg( $source_path, $target_path ) {
		$editor = wp_get_image_editor( $source_path );
		if ( is_wp_error( $editor ) ) {
			// Last resort: copy the raw bytes so the slot is at least not empty.
			return @copy( $source_path, $target_path );
		}

		$size = $editor->get_size();
		if ( ! empty( $size['width'] ) && $size['width'] > self::MAX_WIDTH ) {
			// Constrain width only; large height + crop=false keeps aspect ratio.
			$editor->resize( self::MAX_WIDTH, 9999, false );
		}
		$editor->set_quality( self::JPG_QUALITY );

		$saved = $editor->save( $target_path, 'image/jpeg' );
		return ! is_wp_error( $saved );
	}

	/** Handle the upload form. */
	public static function handle_upload() {
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_die( 'You are not allowed to upload banners.' );
		}

		$key = isset( $_POST['slot'] ) ? sanitize_key( wp_unslash( $_POST['slot'] ) ) : '';
		$slots = self::slots();

		check_admin_referer( 'atulya_upload_' . $key );

		$redirect = admin_url( 'admin.php?page=atulya-banners' );

		if ( ! isset( $slots[ $key ] ) ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'badslot', $redirect ) );
			exit;
		}

		if ( empty( $_FILES['banner'] ) || ! isset( $_FILES['banner']['tmp_name'] ) || ! is_uploaded_file( $_FILES['banner']['tmp_name'] ) ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'nofile', $redirect ) );
			exit;
		}

		$tmp  = $_FILES['banner']['tmp_name'];
		$name = isset( $_FILES['banner']['name'] ) ? sanitize_file_name( $_FILES['banner']['name'] ) : '';

		// Validate it is really an image.
		$check = wp_check_filetype( $name );
		$allowed = array( 'jpg', 'jpeg', 'png', 'gif', 'webp' );
		$info = @getimagesize( $tmp );
		if ( ! in_array( strtolower( $check['ext'] ), $allowed, true ) || false === $info ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'notimage', $redirect ) );
			exit;
		}

		// Make sure the folder exists (in case activation didn't run).
		if ( ! file_exists( self::dir_path() ) ) {
			self::activate();
		}

		$ok = self::save_as_jpg( $tmp, self::slot_path( $key ) );

		wp_safe_redirect( add_query_arg( 'atulya_msg', $ok ? 'ok' : 'fail', $redirect ) );
		exit;
	}

	/** Admin page. */
	public static function render() {
		if ( ! current_user_can( 'upload_files' ) ) {
			return;
		}

		// Notices.
		$msg = isset( $_GET['atulya_msg'] ) ? sanitize_key( $_GET['atulya_msg'] ) : '';
		$notices = array(
			'ok'       => array( 'success', 'Banner updated! It is live on the same link — no website changes needed.' ),
			'fail'     => array( 'error',   'Could not save the image. Please try a different file.' ),
			'nofile'   => array( 'error',   'Please choose an image file first.' ),
			'notimage' => array( 'error',   'That file is not a valid image. Use JPG, PNG, WEBP or GIF.' ),
			'badslot'  => array( 'error',   'Unknown banner slot.' ),
		);
		if ( isset( $notices[ $msg ] ) ) {
			printf(
				'<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
				esc_attr( $notices[ $msg ][0] ),
				esc_html( $notices[ $msg ][1] )
			);
		}

		$slots   = self::slots();
		$grouped = array();
		foreach ( $slots as $key => $slot ) {
			$grouped[ $slot['group'] ][ $key ] = $slot;
		}
		?>
		<div class="wrap">
			<h1>Atulya Banners</h1>
			<p style="max-width:760px;font-size:14px;">
				Choose a spot, upload a new image, and it goes live instantly on the website —
				the link never changes, so <strong>nothing needs to be done on the website side.</strong>
				Best size: about <strong>1920 × 700 px</strong> (wide). Images are auto-optimized.
			</p>

			<?php foreach ( $grouped as $group => $group_slots ) : ?>
				<h2 style="margin-top:28px;"><?php echo esc_html( $group ); ?></h2>
				<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;">
					<?php foreach ( $group_slots as $key => $slot ) :
						$url    = self::slot_url( $key );
						$path   = self::slot_path( $key );
						$exists = file_exists( $path );
						$bust   = $exists ? ( '?t=' . filemtime( $path ) ) : '';
						?>
						<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;">
							<h3 style="margin:0 0 10px;font-size:14px;"><?php echo esc_html( $slot['label'] ); ?></h3>

							<div style="background:#f0f0f1;border-radius:6px;overflow:hidden;aspect-ratio:1920/700;display:flex;align-items:center;justify-content:center;margin-bottom:10px;">
								<?php if ( $exists ) : ?>
									<img src="<?php echo esc_url( $url . $bust ); ?>" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
								<?php else : ?>
									<span style="color:#787c82;font-size:12px;">No image yet</span>
								<?php endif; ?>
							</div>

							<label style="display:block;font-size:11px;color:#646970;margin-bottom:4px;">Fixed link (already used on website):</label>
							<input type="text" readonly value="<?php echo esc_attr( $url ); ?>" onclick="this.select();" style="width:100%;font-size:11px;margin-bottom:12px;" />

							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" enctype="multipart/form-data">
								<input type="hidden" name="action" value="atulya_upload_banner" />
								<input type="hidden" name="slot" value="<?php echo esc_attr( $key ); ?>" />
								<?php wp_nonce_field( 'atulya_upload_' . $key ); ?>
								<input type="file" name="banner" accept="image/*" required style="margin-bottom:10px;width:100%;" />
								<button type="submit" class="button button-primary" style="width:100%;">Update this banner</button>
							</form>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endforeach; ?>

			<hr style="margin:32px 0;" />
			<p style="color:#646970;font-size:12px;max-width:760px;">
				Tip: after uploading, if you still see the old image in your browser, do a hard refresh
				(Ctrl/Cmd + Shift + R). Visitors will see the new one within a minute.
			</p>
		</div>
		<?php
	}
}

Atulya_Banner_Manager::init();
