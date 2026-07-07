import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE     = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const WC_KEY       = process.env.WC_CONSUMER_KEY    || process.env.CONSUMER_KEY    || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const WC_SECRET    = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function decodeToken(token: string): { id?: number } | null {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch { return null; }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    // ── Try WordPress plugin first ─────────────────────────────────────────
    try {
      const pluginRes = await fetch(`${CMS_BASE}/atulya/v1/orders/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(7000),
      });
      if (pluginRes.ok || pluginRes.status !== 404) {
        const data = await pluginRes.json();
        return NextResponse.json(data, { status: pluginRes.ok ? 200 : pluginRes.status });
      }
    } catch { /* fall through */ }

    // ── Fallback: update WC order status to cancelled directly ────────────
    const payload = decodeToken(token);
    if (!payload?.id) return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });

    const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    // First verify this order belongs to this customer
    const orderRes = await fetch(`${CMS_BASE}/wc/v3/orders/${id}`, {
      headers: { Authorization: `Basic ${wcAuth}` },
    });
    if (!orderRes.ok) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }
    const order = await orderRes.json();
    if (order.customer_id !== payload.id) {
      return NextResponse.json({ success: false, message: 'Not authorized.' }, { status: 403 });
    }
    const cancelable = ['pending', 'processing', 'on-hold'];
    if (!cancelable.includes(order.status)) {
      return NextResponse.json({ success: false, message: `Order cannot be cancelled (status: ${order.status}).` }, { status: 400 });
    }

    const updateRes = await fetch(`${CMS_BASE}/wc/v3/orders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Basic ${wcAuth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (!updateRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to cancel order.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (e) {
    console.error('[Orders Cancel]', e);
    return NextResponse.json({ success: false, message: 'Failed to cancel order.' }, { status: 503 });
  }
}
