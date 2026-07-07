<?php
/**
 * Plugin Name:  Atulya Medilink Auth
 * Description:  REST API endpoints for Next.js app login, register & order management.
 * Version:      1.2
 * Author:       Atulya Medilink
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* ─────────────────────────────────────────
   SECRET — must match AUTH_SECRET in Next.js
   ───────────────────────────────────────── */
define( 'ATULYA_SECRET', defined('ATULYA_AUTH_SECRET') ? ATULYA_AUTH_SECRET : 'atulya-medilink-auth-2024' );

/* ─── Base64url helpers ─── */
function atulya_b64_encode( $data ) {
    return rtrim( strtr( base64_encode( $data ), '+/', '-_' ), '=' );
}
function atulya_b64_decode( $data ) {
    return base64_decode( str_pad( strtr( $data, '-_', '+/' ), strlen($data) % 4, '=', STR_PAD_RIGHT ) );
}

/* ─── JWT make ─── */
function atulya_make_token( $payload ) {
    $header  = atulya_b64_encode( json_encode(['alg' => 'HS256', 'typ' => 'JWT']) );
    $body    = atulya_b64_encode( json_encode($payload) );
    $sig     = atulya_b64_encode( hash_hmac('sha256', "$header.$body", ATULYA_SECRET, true) );
    return "$header.$body.$sig";
}

/* ─── JWT verify ─── */
function atulya_verify_token( $token ) {
    $parts = explode('.', $token);
    if ( count($parts) !== 3 ) return false;
    [$header, $body, $sig] = $parts;
    $expected = atulya_b64_encode( hash_hmac('sha256', "$header.$body", ATULYA_SECRET, true) );
    if ( ! hash_equals($expected, $sig) ) return false;
    $payload = json_decode( atulya_b64_decode($body), true );
    if ( ! $payload ) return false;
    if ( isset($payload['exp']) && $payload['exp'] < time() ) return false;
    return $payload;
}

/* ─── Register all REST routes ─── */
add_action( 'rest_api_init', function () {

    $ns = 'atulya/v1';

    register_rest_route( $ns, '/register', [
        'methods'             => 'POST',
        'callback'            => 'atulya_handle_register',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route( $ns, '/login', [
        'methods'             => 'POST',
        'callback'            => 'atulya_handle_login',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route( $ns, '/verify-token', [
        'methods'             => 'POST',
        'callback'            => 'atulya_handle_verify',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route( $ns, '/orders', [
        'methods'             => 'GET',
        'callback'            => 'atulya_handle_orders',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route( $ns, '/orders/(?P<id>\d+)/cancel', [
        'methods'             => 'POST',
        'callback'            => 'atulya_handle_cancel',
        'permission_callback' => '__return_true',
        'args'                => [ 'id' => ['validate_callback' => fn($v) => is_numeric($v)] ],
    ]);
});

/* ══════════════════════════════════════════
   REGISTER
   ══════════════════════════════════════════ */
function atulya_handle_register( WP_REST_Request $req ) {
    $email    = sanitize_email( $req->get_param('email') );
    $password = $req->get_param('password');
    $name     = sanitize_text_field( $req->get_param('name') );

    if ( ! $email || ! $password || ! $name ) {
        return new WP_Error('missing_fields', 'Name, email and password are required.', ['status' => 400]);
    }
    if ( strlen($password) < 6 ) {
        return new WP_Error('weak_password', 'Password must be at least 6 characters.', ['status' => 400]);
    }
    if ( email_exists($email) ) {
        return new WP_Error('email_exists', 'An account with this email already exists.', ['status' => 409]);
    }

    $username = strtolower( explode('@', $email)[0] ) . '_' . substr(uniqid(), -5);
    $user_id  = wp_create_user( $username, $password, $email );

    if ( is_wp_error($user_id) ) {
        return new WP_Error('registration_failed', $user_id->get_error_message(), ['status' => 500]);
    }

    $parts = explode(' ', $name, 2);
    wp_update_user([
        'ID'           => $user_id,
        'display_name' => $name,
        'first_name'   => $parts[0],
        'last_name'    => $parts[1] ?? '',
    ]);

    $user = new WP_User( $user_id );
    $user->set_role('customer');

    $token = atulya_make_token([
        'id'    => $user_id,
        'email' => $email,
        'name'  => $name,
        'iat'   => time(),
        'exp'   => time() + ( 30 * DAY_IN_SECONDS ),
    ]);

    return new WP_REST_Response([
        'success' => true,
        'token'   => $token,
        'user'    => [ 'id' => $user_id, 'name' => $name, 'email' => $email ],
    ], 200);
}

/* ══════════════════════════════════════════
   LOGIN
   ══════════════════════════════════════════ */
function atulya_handle_login( WP_REST_Request $req ) {
    $email    = sanitize_email( $req->get_param('email') );
    $password = $req->get_param('password');

    if ( ! $email || ! $password ) {
        return new WP_Error('missing_fields', 'Email and password are required.', ['status' => 400]);
    }

    $user = get_user_by('email', $email);

    if ( ! $user ) {
        return new WP_Error('invalid_email', 'No account found with this email. Please register first.', ['status' => 401]);
    }

    if ( ! wp_check_password($password, $user->user_pass, $user->ID) ) {
        return new WP_Error('wrong_password', 'Incorrect password. Please try again.', ['status' => 401]);
    }

    $name  = trim( $user->display_name ?: ( $user->first_name . ' ' . $user->last_name ) ?: $user->user_login );
    $token = atulya_make_token([
        'id'    => $user->ID,
        'email' => $user->user_email,
        'name'  => $name,
        'iat'   => time(),
        'exp'   => time() + ( 30 * DAY_IN_SECONDS ),
    ]);

    return new WP_REST_Response([
        'success' => true,
        'token'   => $token,
        'user'    => [ 'id' => $user->ID, 'name' => $name, 'email' => $user->user_email ],
    ], 200);
}

/* ══════════════════════════════════════════
   VERIFY TOKEN
   ══════════════════════════════════════════ */
function atulya_handle_verify( WP_REST_Request $req ) {
    $token   = $req->get_param('token');
    $payload = $token ? atulya_verify_token($token) : false;

    if ( ! $payload ) {
        return new WP_REST_Response([ 'success' => false, 'message' => 'Invalid or expired token.' ], 401);
    }
    return new WP_REST_Response([
        'success' => true,
        'user'    => [ 'id' => $payload['id'], 'email' => $payload['email'], 'name' => $payload['name'] ],
    ], 200);
}

/* ══════════════════════════════════════════
   GET ORDERS  (token required)
   ══════════════════════════════════════════ */
function atulya_handle_orders( WP_REST_Request $req ) {
    $auth    = $req->get_header('Authorization') ?: $req->get_param('token');
    $token   = preg_replace('/^Bearer\s+/i', '', $auth ?? '');
    $payload = atulya_verify_token($token);

    if ( ! $payload ) {
        return new WP_Error('unauthorized', 'Please login to view orders.', ['status' => 401]);
    }

    if ( ! function_exists('wc_get_orders') ) {
        return new WP_Error('woo_missing', 'WooCommerce is required.', ['status' => 500]);
    }

    $wc_orders = wc_get_orders([
        'customer_id' => $payload['id'],
        'limit'       => 20,
        'orderby'     => 'date',
        'order'       => 'DESC',
    ]);

    $orders = array_map( function( $order ) {
        $items = array_map( function( $item ) {
            return [
                'name'     => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'price'    => number_format( $item->get_total() / max(1, $item->get_quantity()), 2 ),
            ];
        }, array_values( $order->get_items() ) );

        return [
            'id'           => $order->get_id(),
            'order_number' => $order->get_order_number(),
            'date_created' => $order->get_date_created()->format('c'),
            'status'       => $order->get_status(),
            'total'        => $order->get_total(),
            'items'        => $items,
        ];
    }, $wc_orders );

    return new WP_REST_Response([ 'success' => true, 'orders' => $orders ], 200);
}

/* ══════════════════════════════════════════
   CANCEL ORDER  (token required)
   ══════════════════════════════════════════ */
function atulya_handle_cancel( WP_REST_Request $req ) {
    $auth    = $req->get_header('Authorization') ?: $req->get_param('token');
    $token   = preg_replace('/^Bearer\s+/i', '', $auth ?? '');
    $payload = atulya_verify_token($token);

    if ( ! $payload ) {
        return new WP_Error('unauthorized', 'Please login first.', ['status' => 401]);
    }

    $order_id = (int) $req->get_param('id');
    $order    = wc_get_order($order_id);

    if ( ! $order ) {
        return new WP_Error('not_found', 'Order not found.', ['status' => 404]);
    }

    // Ownership check
    if ( (int) $order->get_customer_id() !== (int) $payload['id'] ) {
        return new WP_Error('forbidden', 'You cannot cancel this order.', ['status' => 403]);
    }

    $cancellable = ['pending', 'processing', 'on-hold'];
    if ( ! in_array( $order->get_status(), $cancellable, true ) ) {
        return new WP_Error('not_cancellable', 'This order cannot be cancelled.', ['status' => 400]);
    }

    $order->update_status('cancelled', 'Cancelled by customer via website.');

    return new WP_REST_Response([ 'success' => true, 'message' => 'Order cancelled successfully.' ], 200);
}
