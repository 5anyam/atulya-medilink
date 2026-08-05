<?php
/**
 * Plugin Name:       Atulya Banner Manager
 * Description:        Banner manager for the Atulya Medilink website. Upload up to 4 banners per placement (Banner 1–4); each saves to a FIXED URL the website already points to, so the front-end never changes. The site rotates through whatever banners you upload.
 * Version:           2.0.0
 * Author:            Atulya Medilink
 * License:           GPL-2.0-or-later
 * Requires at least: 5.5
 * Requires PHP:      7.2
 *
 * HOW IT WORKS
 * ------------
 * Every placement ("slot") can hold up to 4 banners saved at fixed paths, e.g.
 *     wp-content/uploads/atulya-banners/home-cosmetics-1.jpg  (Banner 1)
 *     wp-content/uploads/atulya-banners/home-cosmetics-2.jpg  (Banner 2)  … up to -4
 * The website probes these URLs and shows (in a rotating carousel) whichever
 * banners exist. Uploading replaces the same file, so links never change and no
 * website code has to be touched.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Atulya_Banner_Manager {

	const DIR         = 'atulya-banners';
	const MAX_WIDTH   = 1920;
	const JPG_QUALITY = 82;
	const MAX_BANNERS = 4;

	/** Placements. key = filename base; seed = original image used as default. */
	public static function slots() {
		return array(
			'home-cosmetics'      => array( 'label' => 'Home Page — Cosmetics',      'group' => 'Home Page',          'seed' => '2026/07/cosmetics-banner.png' ),
			'home-nutraceuticals' => array( 'label' => 'Home Page — Nutraceuticals', 'group' => 'Home Page',          'seed' => '2026/07/nutra-banner.png' ),
			'home-ayurveda'       => array( 'label' => 'Home Page — Ayurveda',       'group' => 'Home Page',          'seed' => '2026/07/ayurveda-banner.png' ),
			'shop-cosmetics'      => array( 'label' => 'Category Page — Cosmetics',      'group' => 'Category Pages', 'seed' => '2026/07/cosmetics-banner.png' ),
			'shop-nutraceuticals' => array( 'label' => 'Category Page — Nutraceuticals', 'group' => 'Category Pages', 'seed' => '2026/07/nutra-banner.png' ),
			'shop-ayurveda'       => array( 'label' => 'Category Page — Ayurveda',       'group' => 'Category Pages', 'seed' => '2026/07/ayurveda-banner.png' ),
		);
	}

	public static function init() {
		register_activation_hook( __FILE__, array( __CLASS__, 'activate' ) );
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_atulya_upload_banner', array( __CLASS__, 'handle_upload' ) );
		add_action( 'admin_post_atulya_delete_banner', array( __CLASS__, 'handle_delete' ) );
	}

	public static function dir_path() {
		$up = wp_upload_dir();
		return trailingslashit( $up['basedir'] ) . self::DIR;
	}
	public static function dir_url() {
		$up = wp_upload_dir();
		return trailingslashit( $up['baseurl'] ) . self::DIR;
	}
	/** Path/URL of banner N (1..4) for a slot. */
	public static function slot_path( $key, $n ) { return trailingslashit( self::dir_path() ) . $key . '-' . intval( $n ) . '.jpg'; }
	public static function slot_url( $key, $n )  { return trailingslashit( self::dir_url() ) . $key . '-' . intval( $n ) . '.jpg'; }

	public static function activate() {
		$dir = self::dir_path();
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}

		$htaccess = trailingslashit( $dir ) . '.htaccess';
		if ( ! file_exists( $htaccess ) ) {
			$rules = "<IfModule mod_headers.c>\n"
				. "  <FilesMatch \"\\.(jpg|jpeg|png|gif|webp)$\">\n"
				. "    Header set Cache-Control \"no-cache, must-revalidate, max-age=0\"\n"
				. "  </FilesMatch>\n"
				. "</IfModule>\n";
			@file_put_contents( $htaccess, $rules );
		}

		// Migrate/seed Banner 1 for every slot so nothing is ever blank.
		$up = wp_upload_dir();
		foreach ( self::slots() as $key => $slot ) {
			$banner1 = self::slot_path( $key, 1 );
			if ( file_exists( $banner1 ) ) {
				continue;
			}
			// Prefer the single banner uploaded by the old version (<slot>.jpg).
			$legacy = trailingslashit( self::dir_path() ) . $key . '.jpg';
			if ( file_exists( $legacy ) ) {
				@copy( $legacy, $banner1 );
				continue;
			}
			// Otherwise seed from the original source image.
			$source = trailingslashit( $up['basedir'] ) . ltrim( $slot['seed'], '/' );
			if ( file_exists( $source ) ) {
				self::save_as_jpg( $source, $banner1 );
			}
		}
	}

	public static function menu() {
		add_menu_page( 'Atulya Banners', 'Atulya Banners', 'upload_files', 'atulya-banners', array( __CLASS__, 'render' ), 'dashicons-format-image', 26 );
	}

	private static function save_as_jpg( $source_path, $target_path ) {
		$editor = wp_get_image_editor( $source_path );
		if ( is_wp_error( $editor ) ) {
			return @copy( $source_path, $target_path );
		}
		$size = $editor->get_size();
		if ( ! empty( $size['width'] ) && $size['width'] > self::MAX_WIDTH ) {
			$editor->resize( self::MAX_WIDTH, 9999, false );
		}
		$editor->set_quality( self::JPG_QUALITY );
		$saved = $editor->save( $target_path, 'image/jpeg' );
		return ! is_wp_error( $saved );
	}

	/** Read + validate slot key and banner index from the request. */
	private static function read_target() {
		$slots = self::slots();
		$key   = isset( $_POST['slot'] ) ? sanitize_key( wp_unslash( $_POST['slot'] ) ) : '';
		$idx   = isset( $_POST['idx'] ) ? intval( $_POST['idx'] ) : 0;
		if ( ! isset( $slots[ $key ] ) || $idx < 1 || $idx > self::MAX_BANNERS ) {
			return null;
		}
		return array( $key, $idx );
	}

	public static function handle_upload() {
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_die( 'You are not allowed to upload banners.' );
		}
		$redirect = admin_url( 'admin.php?page=atulya-banners' );

		$key = isset( $_POST['slot'] ) ? sanitize_key( wp_unslash( $_POST['slot'] ) ) : '';
		$idx = isset( $_POST['idx'] ) ? intval( $_POST['idx'] ) : 0;
		check_admin_referer( 'atulya_upload_' . $key . '_' . $idx );

		$target = self::read_target();
		if ( ! $target ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'badslot', $redirect ) );
			exit;
		}

		if ( empty( $_FILES['banner'] ) || ! isset( $_FILES['banner']['tmp_name'] ) || ! is_uploaded_file( $_FILES['banner']['tmp_name'] ) ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'nofile', $redirect ) );
			exit;
		}
		$tmp  = $_FILES['banner']['tmp_name'];
		$name = isset( $_FILES['banner']['name'] ) ? sanitize_file_name( $_FILES['banner']['name'] ) : '';
		$check = wp_check_filetype( $name );
		$allowed = array( 'jpg', 'jpeg', 'png', 'gif', 'webp' );
		if ( ! in_array( strtolower( $check['ext'] ), $allowed, true ) || false === @getimagesize( $tmp ) ) {
			wp_safe_redirect( add_query_arg( 'atulya_msg', 'notimage', $redirect ) );
			exit;
		}

		if ( ! file_exists( self::dir_path() ) ) {
			self::activate();
		}

		list( $k, $n ) = $target;
		$ok = self::save_as_jpg( $tmp, self::slot_path( $k, $n ) );
		wp_safe_redirect( add_query_arg( 'atulya_msg', $ok ? 'ok' : 'fail', $redirect ) );
		exit;
	}

	public static function handle_delete() {
		if ( ! current_user_can( 'upload_files' ) ) {
			wp_die( 'Not allowed.' );
		}
		$redirect = admin_url( 'admin.php?page=atulya-banners' );

		$key = isset( $_POST['slot'] ) ? sanitize_key( wp_unslash( $_POST['slot'] ) ) : '';
		$idx = isset( $_POST['idx'] ) ? intval( $_POST['idx'] ) : 0;
		check_admin_referer( 'atulya_delete_' . $key . '_' . $idx );

		$target = self::read_target();
		if ( $target ) {
			list( $k, $n ) = $target;
			$path = self::slot_path( $k, $n );
			if ( file_exists( $path ) ) {
				@unlink( $path );
			}
		}
		wp_safe_redirect( add_query_arg( 'atulya_msg', 'deleted', $redirect ) );
		exit;
	}

	public static function render() {
		if ( ! current_user_can( 'upload_files' ) ) {
			return;
		}

		$msg = isset( $_GET['atulya_msg'] ) ? sanitize_key( $_GET['atulya_msg'] ) : '';
		$notices = array(
			'ok'       => array( 'success', 'Banner saved! It is live on the same link — no website changes needed.' ),
			'deleted'  => array( 'success', 'Banner removed.' ),
			'fail'     => array( 'error',   'Could not save the image. Please try a different file.' ),
			'nofile'   => array( 'error',   'Please choose an image file first.' ),
			'notimage' => array( 'error',   'That file is not a valid image. Use JPG, PNG, WEBP or GIF.' ),
			'badslot'  => array( 'error',   'Unknown banner slot.' ),
		);
		if ( isset( $notices[ $msg ] ) ) {
			printf( '<div class="notice notice-%s is-dismissible"><p>%s</p></div>', esc_attr( $notices[ $msg ][0] ), esc_html( $notices[ $msg ][1] ) );
		}

		$slots   = self::slots();
		$grouped = array();
		foreach ( $slots as $key => $slot ) {
			$grouped[ $slot['group'] ][ $key ] = $slot;
		}
		?>
		<div class="wrap">
			<h1>Atulya Banners</h1>
			<p style="max-width:820px;font-size:14px;">
				Each spot can show up to <strong>4 banners</strong> that rotate automatically on the website.
				Upload Banner 1, 2, 3, 4 — whatever you fill in will appear. Uploading replaces that banner on the same link,
				so <strong>nothing needs to be done on the website side.</strong> Best size: about <strong>1920 × 700 px</strong>.
			</p>

			<?php foreach ( $grouped as $group => $group_slots ) : ?>
				<h2 style="margin-top:30px;border-bottom:1px solid #dcdcde;padding-bottom:8px;"><?php echo esc_html( $group ); ?></h2>

				<?php foreach ( $group_slots as $key => $slot ) : ?>
					<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px 18px;margin-bottom:18px;">
						<h3 style="margin:0 0 14px;font-size:15px;"><?php echo esc_html( $slot['label'] ); ?></h3>
						<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">
							<?php for ( $n = 1; $n <= self::MAX_BANNERS; $n++ ) :
								$url    = self::slot_url( $key, $n );
								$path   = self::slot_path( $key, $n );
								$exists = file_exists( $path );
								$bust   = $exists ? ( '?t=' . filemtime( $path ) ) : '';
								?>
								<div style="border:1px solid #e6e6e8;border-radius:6px;padding:12px;background:#fafafa;">
									<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
										<strong style="font-size:12px;">Banner <?php echo (int) $n; ?></strong>
										<?php if ( $exists ) : ?>
											<span style="font-size:10px;color:#00844a;">● live</span>
										<?php else : ?>
											<span style="font-size:10px;color:#999;">empty</span>
										<?php endif; ?>
									</div>

									<div style="background:#f0f0f1;border-radius:4px;overflow:hidden;aspect-ratio:1920/700;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
										<?php if ( $exists ) : ?>
											<img src="<?php echo esc_url( $url . $bust ); ?>" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
										<?php else : ?>
											<span style="color:#888;font-size:11px;">No image</span>
										<?php endif; ?>
									</div>

									<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" enctype="multipart/form-data" style="margin:0 0 6px;">
										<input type="hidden" name="action" value="atulya_upload_banner" />
										<input type="hidden" name="slot" value="<?php echo esc_attr( $key ); ?>" />
										<input type="hidden" name="idx" value="<?php echo (int) $n; ?>" />
										<?php wp_nonce_field( 'atulya_upload_' . $key . '_' . $n ); ?>
										<input type="file" name="banner" accept="image/*" required style="width:100%;font-size:11px;margin-bottom:6px;" />
										<button type="submit" class="button button-primary" style="width:100%;">Save Banner <?php echo (int) $n; ?></button>
									</form>

									<?php if ( $exists ) : ?>
										<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" onsubmit="return confirm('Remove this banner?');" style="margin:0;">
											<input type="hidden" name="action" value="atulya_delete_banner" />
											<input type="hidden" name="slot" value="<?php echo esc_attr( $key ); ?>" />
											<input type="hidden" name="idx" value="<?php echo (int) $n; ?>" />
											<?php wp_nonce_field( 'atulya_delete_' . $key . '_' . $n ); ?>
											<button type="submit" class="button button-link-delete" style="width:100%;color:#b32d2e;">Remove</button>
										</form>
									<?php endif; ?>
								</div>
							<?php endfor; ?>
						</div>
					</div>
				<?php endforeach; ?>
			<?php endforeach; ?>

			<hr style="margin:30px 0;" />
			<p style="color:#646970;font-size:12px;max-width:820px;">
				Tip: after uploading, if you still see the old image, hard refresh (Ctrl/Cmd + Shift + R). Visitors see the new one within a minute.
				To show fewer banners, just leave the extra slots empty or click "Remove".
			</p>
		</div>
		<?php
	}
}

Atulya_Banner_Manager::init();
