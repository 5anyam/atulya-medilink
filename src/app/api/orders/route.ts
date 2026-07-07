import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE     = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const WC_KEY       = process.env.WC_CONSUMER_KEY    || process.env.CONSUMER_KEY    || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const WC_SECRET    = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function decodeToken(token: string): { id?: number; email?: string } | null {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    // ── Try WordPress plugin first ─────────────────────────────────────────
    try {
      const pluginRes = await fetch(`${CMS_BASE}/atulya/v1/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(7000),
      });
      if (pluginRes.ok || pluginRes.status !== 404) {
        const data = await pluginRes.json();
        return NextResponse.json(data, { status: pluginRes.ok ? 200 : pluginRes.status });
      }
    } catch { /* fall through */ }

    // ── Fallback: decode token → fetch WC orders by customer ID ───────────
    const payload = decodeToken(token);
    if (!payload?.id) return NextResponse.json({ success: false, message: 'Invalid token.' }, { status: 401 });

    const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const wcRes  = await fetch(
      `${CMS_BASE}/wc/v3/orders?customer=${payload.id}&per_page=20&orderby=date&order=desc`,
      { headers: { Authorization: `Basic ${wcAuth}` }, cache: 'no-store' }
    );

    if (!wcRes.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: wcRes.status });
    }

    const orders = await wcRes.json();
    return NextResponse.json({ success: true, orders });
  } catch (e) {
    console.error('[Orders GET]', e);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 503 });
  }
}
