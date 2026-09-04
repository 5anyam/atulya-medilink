import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE  = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const WC_KEY    = process.env.WC_CONSUMER_KEY    || process.env.CONSUMER_KEY    || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
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

// Customer requests a return/refund on a delivered order. This records an order
// note in WooCommerce so the team sees it on the order and can process the refund.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const reason = (typeof body.reason === 'string' ? body.reason : '').trim().slice(0, 500) || 'No reason provided';

    const payload = decodeToken(token);
    if (!payload?.id) return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });

    const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    // Verify the order belongs to this customer.
    const orderRes = await fetch(`${CMS_BASE}/wc/v3/orders/${id}`, { headers: { Authorization: `Basic ${wcAuth}` } });
    if (!orderRes.ok) return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    const order = await orderRes.json();
    if (order.customer_id !== payload.id) {
      return NextResponse.json({ success: false, message: 'Not authorized.' }, { status: 403 });
    }
    const returnable = ['completed', 'shipped', 'processing'];
    if (!returnable.includes(order.status)) {
      return NextResponse.json({ success: false, message: `Return not available for this order (status: ${order.status}).` }, { status: 400 });
    }

    // Record the request as an order note (visible to the team in WooCommerce).
    const noteRes = await fetch(`${CMS_BASE}/wc/v3/orders/${id}/notes`, {
      method: 'POST',
      headers: { Authorization: `Basic ${wcAuth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ note: `🔁 RETURN/REFUND REQUESTED by customer.\nReason: ${reason}`, customer_note: false }),
    });
    if (!noteRes.ok) {
      return NextResponse.json({ success: false, message: 'Could not submit return request.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Return request submitted. Our team will contact you.' });
  } catch (e) {
    console.error('[Orders Return]', e);
    return NextResponse.json({ success: false, message: 'Failed to submit return request.' }, { status: 503 });
  }
}
