<?php
/**
 * Plugin Name:       Atulya Control Panel
 * Description:        One place for the team to control the Atulya Medilink website (shipping, GST, announcement bar, WhatsApp, COD, offers…) without touching code. Settings are exposed as a REST API that the Next.js front-end reads and applies.
 * Version:           1.0.0
 * Author:            Atulya Medilink
 * License:           GPL-2.0-or-later
 * Requires at least: 5.5
 * Requires PHP:      7.2
 *
 * The front-end reads:  GET /wp-json/atulya/v1/config
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Atulya_Control_Panel {

	const OPTION = 'atulya_control_panel';

	/** Default settings (used until the team saves their own). */
	public static function defaults() {
		return array(
			'shipping_delivery_charge' => 99,
			'shipping_free_above'      => 999,
			'gst_enabled'              => 1,
			'gst_rate'                 => 5,
			'announcement_enabled'     => 1,
			'announcement_text'        => '',
			'whatsapp_enabled'         => 1,
			'whatsapp_number'          => '918851180015',
			'whatsapp_message'         => 'Hi, I need help with my order',
			'cod_enabled'              => 0,
			'new_packaging'            => 'omega-3-fish-oil, multivitamin-tablets',
			'popup_enabled'            => 0,
			'popup_title'              => 'Get 20% OFF your first order',
			'popup_text'               => 'Use code WELCOME20 at checkout.',
			'popup_code'               => 'WELCOME20',
			'offers'                   => self::default_offers(),
		);
	}

	/** Default offer(s) — used until the team configures their own. */
	public static function default_offers() {
		return array(
			array(
				'enabled' => 1,
				'label'   => 'Buy 1 Get 2 Free',
				'match'   => 'face wash, aqua-gel-sunscreen-spf-50, atulya-cucumber-toner, sun-protector-moisturizer',
				'buy'     => 1,
				'free'    => 2,
			),
		);
	}

	const OFFER_SLOTS = 6;

	public static function get() {
		$saved = get_option( self::OPTION, array() );
		if ( ! is_array( $saved ) ) {
			$saved = array();
		}
		return array_merge( self::defaults(), $saved );
	}

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_post_atulya_save_config', array( __CLASS__, 'handle_save' ) );
		add_action( 'admin_post_atulya_generate_coupon', array( __CLASS__, 'handle_generate_coupon' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_rest' ) );
	}

	/* ── REST API the front-end reads ─────────────────────────────── */

	public static function register_rest() {
		register_rest_route( 'atulya/v1', '/config', array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => array( __CLASS__, 'rest_config' ),
		) );
	}

	public static function rest_config() {
		$c = self::get();
		// Public, non-sensitive config — allow the Next.js site (any origin) to read it.
		header( 'Access-Control-Allow-Origin: *' );

		$data = array(
			'shipping' => array(
				'delivery_charge' => (float) $c['shipping_delivery_charge'],
				'free_above'      => (float) $c['shipping_free_above'],
			),
			'gst' => array(
				'enabled' => (bool) $c['gst_enabled'],
				'rate'    => (float) $c['gst_rate'],
			),
			'announcement' => array(
				'enabled' => (bool) $c['announcement_enabled'],
				'text'    => (string) $c['announcement_text'],
			),
			'whatsapp' => array(
				'enabled' => (bool) $c['whatsapp_enabled'],
				'number'  => (string) $c['whatsapp_number'],
				'message' => (string) $c['whatsapp_message'],
			),
			'cod' => array(
				'enabled' => (bool) $c['cod_enabled'],
			),
			'new_packaging' => self::clean_slugs( $c['new_packaging'] ),
			'popup' => array(
				'enabled' => (bool) $c['popup_enabled'],
				'title'   => (string) $c['popup_title'],
				'text'    => (string) $c['popup_text'],
				'code'    => (string) $c['popup_code'],
			),
			'offers' => self::offers_for_api( $c ),
		);
		return rest_ensure_response( $data );
	}

	/** "slug", "product/slug" or a full URL → just the slug. */
	private static function clean_slugs( $csv ) {
		$out = array();
		foreach ( explode( ',', strtolower( (string) $csv ) ) as $item ) {
			$item  = trim( preg_replace( '#^https?://[^/]+#', '', trim( $item ) ) );
			$item  = strtok( $item, '?' );
			$parts = array_values( array_filter( explode( '/', (string) $item ) ) );
			if ( $parts ) {
				$out[] = sanitize_title( end( $parts ) );
			}
		}
		return array_values( array_unique( array_filter( $out ) ) );
	}

	/** Normalize stored offers into a clean list for the API. */
	private static function offers_for_api( $c ) {
		$out  = array();
		$rows = isset( $c['offers'] ) && is_array( $c['offers'] ) ? $c['offers'] : array();
		foreach ( $rows as $row ) {
			$match = array_values( array_filter( array_map( 'trim', explode( ',', strtolower( (string) ( $row['match'] ?? '' ) ) ) ) ) );
			if ( empty( $match ) ) {
				continue;
			}
			$out[] = array(
				'enabled' => (bool) ( $row['enabled'] ?? 0 ),
				'label'   => (string) ( $row['label'] ?? '' ),
				'match'   => $match,
				'buy'     => max( 1, (int) ( $row['buy'] ?? 1 ) ),
				'free'    => max( 0, (int) ( $row['free'] ?? 0 ) ),
			);
		}
		return $out;
	}

	/* ── Admin page ───────────────────────────────────────────────── */

	public static function menu() {
		add_menu_page(
			'Atulya Control Panel',
			'Atulya Control Panel',
			'manage_options',
			'atulya-control-panel',
			array( __CLASS__, 'render' ),
			'dashicons-admin-settings',
			25
		);
	}

	public static function handle_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed.' );
		}
		check_admin_referer( 'atulya_save_config' );

		$in = wp_unslash( $_POST );
		$clean = array(
			'shipping_delivery_charge' => max( 0, (float) ( $in['shipping_delivery_charge'] ?? 99 ) ),
			'shipping_free_above'      => max( 0, (float) ( $in['shipping_free_above'] ?? 999 ) ),
			'gst_enabled'              => isset( $in['gst_enabled'] ) ? 1 : 0,
			'gst_rate'                 => max( 0, min( 100, (float) ( $in['gst_rate'] ?? 5 ) ) ),
			'announcement_enabled'     => isset( $in['announcement_enabled'] ) ? 1 : 0,
			'announcement_text'        => sanitize_text_field( $in['announcement_text'] ?? '' ),
			'whatsapp_enabled'         => isset( $in['whatsapp_enabled'] ) ? 1 : 0,
			'whatsapp_number'          => preg_replace( '/[^0-9]/', '', (string) ( $in['whatsapp_number'] ?? '' ) ),
			'whatsapp_message'         => sanitize_text_field( $in['whatsapp_message'] ?? '' ),
			'cod_enabled'              => isset( $in['cod_enabled'] ) ? 1 : 0,
			'new_packaging'            => sanitize_text_field( $in['new_packaging'] ?? '' ),
			'popup_enabled'            => isset( $in['popup_enabled'] ) ? 1 : 0,
			'popup_title'              => sanitize_text_field( $in['popup_title'] ?? '' ),
			'popup_text'               => sanitize_text_field( $in['popup_text'] ?? '' ),
			'popup_code'               => sanitize_text_field( $in['popup_code'] ?? '' ),
		);

		// Offers (fixed rows) — keep only rows that have a match value.
		$offers = array();
		$rows   = isset( $in['offers'] ) && is_array( $in['offers'] ) ? $in['offers'] : array();
		foreach ( $rows as $row ) {
			$match = sanitize_text_field( $row['match'] ?? '' );
			if ( trim( $match ) === '' ) {
				continue;
			}
			$offers[] = array(
				'enabled' => isset( $row['enabled'] ) ? 1 : 0,
				'label'   => sanitize_text_field( $row['label'] ?? '' ),
				'match'   => $match,
				'buy'     => max( 1, (int) ( $row['buy'] ?? 1 ) ),
				'free'    => max( 0, (int) ( $row['free'] ?? 0 ) ),
			);
		}
		$clean['offers'] = $offers;

		update_option( self::OPTION, $clean );

		wp_safe_redirect( add_query_arg( 'atulya_saved', '1', admin_url( 'admin.php?page=atulya-control-panel' ) ) );
		exit;
	}

	/** Generate a random WooCommerce coupon (for a "lucky customer" giveaway). */
	public static function handle_generate_coupon() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Not allowed.' );
		}
		check_admin_referer( 'atulya_generate_coupon' );
		$redirect = admin_url( 'admin.php?page=atulya-control-panel' );

		if ( ! class_exists( 'WC_Coupon' ) ) {
			wp_safe_redirect( add_query_arg( 'atulya_coupon_err', 'nowoo', $redirect ) );
			exit;
		}

		$type   = ( ( $_POST['lc_type'] ?? 'percent' ) === 'fixed_cart' ) ? 'fixed_cart' : 'percent';
		$amount = max( 0, (float) ( $_POST['lc_amount'] ?? 0 ) );
		$limit  = max( 1, (int) ( $_POST['lc_limit'] ?? 1 ) );
		$days   = max( 0, (int) ( $_POST['lc_days'] ?? 0 ) );
		$prefix = strtoupper( preg_replace( '/[^A-Za-z0-9]/', '', (string) ( $_POST['lc_prefix'] ?? 'LUCKY' ) ) );
		if ( $amount <= 0 ) {
			wp_safe_redirect( add_query_arg( 'atulya_coupon_err', 'amount', $redirect ) );
			exit;
		}

		$code = $prefix . strtoupper( wp_generate_password( 6, false, false ) );

		$coupon = new WC_Coupon();
		$coupon->set_code( $code );
		$coupon->set_discount_type( $type );
		$coupon->set_amount( $amount );
		$coupon->set_usage_limit( $limit );
		$coupon->set_individual_use( true );
		if ( $days > 0 ) {
			$coupon->set_date_expires( time() + ( $days * DAY_IN_SECONDS ) );
		}
		$coupon->save();

		wp_safe_redirect( add_query_arg( 'atulya_coupon', rawurlencode( $code ), $redirect ) );
		exit;
	}

	public static function render() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$c = self::get();
		if ( isset( $_GET['atulya_saved'] ) ) {
			echo '<div class="notice notice-success is-dismissible"><p>Settings saved. Changes go live on the website within a minute.</p></div>';
		}
		if ( isset( $_GET['atulya_coupon'] ) ) {
			$gen = sanitize_text_field( wp_unslash( $_GET['atulya_coupon'] ) );
			echo '<div class="notice notice-success"><p>🎉 Coupon created: <code style="font-size:16px;font-weight:700;">' . esc_html( $gen ) . '</code> — share it with your lucky customer. It works at checkout right away.</p></div>';
		}
		if ( isset( $_GET['atulya_coupon_err'] ) ) {
			$err = ( $_GET['atulya_coupon_err'] === 'nowoo' ) ? 'WooCommerce is not active.' : 'Please enter a valid discount amount.';
			echo '<div class="notice notice-error"><p>Could not create coupon: ' . esc_html( $err ) . '</p></div>';
		}
		$num  = function ( $k ) use ( $c ) { return esc_attr( $c[ $k ] ); };
		$txt  = function ( $k ) use ( $c ) { return esc_attr( $c[ $k ] ); };
		$chk  = function ( $k ) use ( $c ) { return checked( $c[ $k ], 1, false ); };
		?>
		<div class="wrap">
			<h1>Atulya Control Panel</h1>
			<p style="max-width:760px;">Change your website settings here — no coding needed. Once you save, the website (front-end) updates automatically within about a minute.</p>

			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="atulya_save_config" />
				<?php wp_nonce_field( 'atulya_save_config' ); ?>

				<h2 class="title">🚚 Shipping / Delivery</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label>Delivery charge (₹)</label></th>
						<td><input type="number" step="1" min="0" name="shipping_delivery_charge" value="<?php echo $num( 'shipping_delivery_charge' ); ?>" class="regular-text" />
						<p class="description">Delivery charge applied to every order (₹99).</p></td>
					</tr>
					<tr>
						<th scope="row"><label>Free delivery above (₹)</label></th>
						<td><input type="number" step="1" min="0" name="shipping_free_above" value="<?php echo $num( 'shipping_free_above' ); ?>" class="regular-text" />
						<p class="description">Orders at or above this amount get FREE delivery. (0 = never free.)</p></td>
					</tr>
				</table>

				<h2 class="title">🧾 GST</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Apply GST</th>
						<td><label><input type="checkbox" name="gst_enabled" value="1" <?php echo $chk( 'gst_enabled' ); ?> /> Add GST at checkout</label></td>
					</tr>
					<tr>
						<th scope="row"><label>GST rate (%)</label></th>
						<td><input type="number" step="0.1" min="0" max="100" name="gst_rate" value="<?php echo $num( 'gst_rate' ); ?>" class="small-text" /> %</td>
					</tr>
				</table>

				<h2 class="title">📢 Announcement Bar (top strip)</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Show bar</th>
						<td><label><input type="checkbox" name="announcement_enabled" value="1" <?php echo $chk( 'announcement_enabled' ); ?> /> Show the top announcement bar</label></td>
					</tr>
					<tr>
						<th scope="row"><label>Message</label></th>
						<td><input type="text" name="announcement_text" value="<?php echo $txt( 'announcement_text' ); ?>" class="large-text" placeholder="e.g. ✦ Rakhi Special — Flat 20% Off!" />
						<p class="description">Leave empty to use the default message.</p></td>
					</tr>
				</table>

				<h2 class="title">💬 WhatsApp Button</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Show button</th>
						<td><label><input type="checkbox" name="whatsapp_enabled" value="1" <?php echo $chk( 'whatsapp_enabled' ); ?> /> Show the floating WhatsApp button</label></td>
					</tr>
					<tr>
						<th scope="row"><label>WhatsApp number</label></th>
						<td><input type="text" name="whatsapp_number" value="<?php echo $txt( 'whatsapp_number' ); ?>" class="regular-text" placeholder="918851180015" />
						<p class="description">With country code, no + or spaces (e.g. 918851180015).</p></td>
					</tr>
					<tr>
						<th scope="row"><label>Default message</label></th>
						<td><input type="text" name="whatsapp_message" value="<?php echo $txt( 'whatsapp_message' ); ?>" class="large-text" /></td>
					</tr>
				</table>

				<h2 class="title">💵 Cash on Delivery (COD)</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Enable COD</th>
						<td><label><input type="checkbox" name="cod_enabled" value="1" <?php echo $chk( 'cod_enabled' ); ?> /> Show the Cash on Delivery option at checkout</label>
						<p class="description">When enabled, customers can place an order with Cash on Delivery instead of paying online.</p></td>
					</tr>
				</table>

				<h2 class="title">📦 "New Packaging Coming Soon" Products</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label>Product slugs</label></th>
						<td><input type="text" name="new_packaging" value="<?php echo $txt( 'new_packaging' ); ?>" class="large-text" placeholder="omega-3-fish-oil, multivitamin-tablets" />
						<p class="description">Comma-separated product <b>slugs</b> (you can also paste the product URL — e.g. <code>/product/omega-3-fish-oil</code> — it is cleaned automatically). These products show a "📦 New Packaging Coming Soon" badge, and a popup opens instead of the product page. Leave empty for none.</p></td>
					</tr>
				</table>

				<h2 class="title">🎉 First-order Popup</h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row">Show popup</th>
						<td><label><input type="checkbox" name="popup_enabled" value="1" <?php echo $chk( 'popup_enabled' ); ?> /> Show a discount popup to each new visitor (once)</label></td>
					</tr>
					<tr>
						<th scope="row"><label>Title</label></th>
						<td><input type="text" name="popup_title" value="<?php echo $txt( 'popup_title' ); ?>" class="large-text" /></td>
					</tr>
					<tr>
						<th scope="row"><label>Text</label></th>
						<td><input type="text" name="popup_text" value="<?php echo $txt( 'popup_text' ); ?>" class="large-text" /></td>
					</tr>
					<tr>
						<th scope="row"><label>Coupon code</label></th>
						<td><input type="text" name="popup_code" value="<?php echo $txt( 'popup_code' ); ?>" class="regular-text" placeholder="WELCOME20" /></td>
					</tr>
				</table>

				<h2 class="title">🎁 Offers (Buy X Get Y Free)</h2>
				<p style="max-width:820px;">For each offer: in <b>Match</b>, enter product <b>slugs</b> or <b>keywords</b> (comma-separated — e.g. <code>face wash, atulya-cucumber-toner</code>). <b>Buy</b> = units the customer pays for, <b>Free</b> = extra units free. Example: Buy 1, Free 2 = "pay for 1, get 3". Empty rows are ignored.</p>
				<table class="widefat striped" style="max-width:1000px;">
					<thead><tr>
						<th style="width:60px;">On</th><th>Label</th><th>Match (slugs / keywords, comma-separated)</th><th style="width:70px;">Buy</th><th style="width:70px;">Free</th>
					</tr></thead>
					<tbody>
						<?php
						$offers = ( isset( $c['offers'] ) && is_array( $c['offers'] ) ) ? array_values( $c['offers'] ) : array();
						for ( $i = 0; $i < self::OFFER_SLOTS; $i++ ) :
							$o = isset( $offers[ $i ] ) ? $offers[ $i ] : array();
							?>
							<tr>
								<td style="text-align:center;"><input type="checkbox" name="offers[<?php echo $i; ?>][enabled]" value="1" <?php checked( ! empty( $o['enabled'] ) ); ?> /></td>
								<td><input type="text" name="offers[<?php echo $i; ?>][label]" value="<?php echo esc_attr( $o['label'] ?? '' ); ?>" class="regular-text" placeholder="Buy 1 Get 2 Free" /></td>
								<td><input type="text" name="offers[<?php echo $i; ?>][match]" value="<?php echo esc_attr( $o['match'] ?? '' ); ?>" style="width:100%;" placeholder="face wash, atulya-cucumber-toner" /></td>
								<td><input type="number" min="1" name="offers[<?php echo $i; ?>][buy]" value="<?php echo esc_attr( $o['buy'] ?? 1 ); ?>" class="small-text" /></td>
								<td><input type="number" min="0" name="offers[<?php echo $i; ?>][free]" value="<?php echo esc_attr( $o['free'] ?? 0 ); ?>" class="small-text" /></td>
							</tr>
						<?php endfor; ?>
					</tbody>
				</table>

				<?php submit_button( 'Save Settings' ); ?>
			</form>

			<hr style="margin:30px 0;" />

			<h2 class="title">🍀 Lucky Customer Coupon Generator</h2>
			<p style="max-width:820px;">Create a limited-use discount code to give a lucky customer. The code works at checkout immediately (no extra setup).</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="atulya_generate_coupon" />
				<?php wp_nonce_field( 'atulya_generate_coupon' ); ?>
				<table class="form-table" role="presentation" style="max-width:640px;">
					<tr>
						<th scope="row"><label>Discount type</label></th>
						<td>
							<select name="lc_type">
								<option value="percent">Percentage (%)</option>
								<option value="fixed_cart">Fixed amount (₹)</option>
							</select>
						</td>
					</tr>
					<tr>
						<th scope="row"><label>Amount</label></th>
						<td><input type="number" name="lc_amount" step="0.01" min="0" class="small-text" placeholder="20" /> <span class="description">e.g. 20 for 20% off, or 200 for ₹200 off</span></td>
					</tr>
					<tr>
						<th scope="row"><label>Usage limit</label></th>
						<td><input type="number" name="lc_limit" value="1" min="1" class="small-text" /> <span class="description">how many times it can be used (1 = single lucky customer)</span></td>
					</tr>
					<tr>
						<th scope="row"><label>Expires in</label></th>
						<td><input type="number" name="lc_days" value="0" min="0" class="small-text" /> <span class="description">days (0 = never expires)</span></td>
					</tr>
					<tr>
						<th scope="row"><label>Code prefix</label></th>
						<td><input type="text" name="lc_prefix" value="LUCKY" class="small-text" /> <span class="description">e.g. LUCKY → LUCKYAB12CD</span></td>
					</tr>
				</table>
				<?php submit_button( 'Generate Coupon', 'secondary' ); ?>
			</form>

			<hr />
			<p style="color:#646970;font-size:12px;">Front-end reads: <code><?php echo esc_html( rest_url( 'atulya/v1/config' ) ); ?></code></p>
		</div>
		<?php
	}
}

Atulya_Control_Panel::init();
