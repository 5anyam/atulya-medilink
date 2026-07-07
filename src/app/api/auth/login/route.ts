import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE     = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const WC_KEY       = process.env.WC_CONSUMER_KEY    || process.env.CONSUMER_KEY    || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const WC_SECRET    = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function makeToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // ── Try WordPress plugin endpoint first ──────────────────────────────────
    try {
      const pluginRes = await fetch(`${CMS_BASE}/atulya/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(6000),
      });
      if (pluginRes.ok) {
        const data = await pluginRes.json();
        return NextResponse.json(data);
      }
      if (pluginRes.status !== 404) {
        const data = await pluginRes.json();
        return NextResponse.json({ message: data?.message || 'Login failed.' }, { status: pluginRes.status });
      }
    } catch { /* plugin not available — fall through to WC */ }

    // ── Fallback: verify password via WP Basic Auth, then look up WC customer ─
    // WordPress validates username+password via /wp/v2/users/me with Basic Auth
    const wpBasic = Buffer.from(`${email}:${password}`).toString('base64');
    const meRes = await fetch(`${CMS_BASE}/wp/v2/users/me`, {
      headers: { Authorization: `Basic ${wpBasic}` },
      signal: AbortSignal.timeout(8000),
    });

    if (!meRes.ok) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const me = await meRes.json();

    // Get WooCommerce customer record (for billing info etc)
    const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const searchRes = await fetch(
      `${CMS_BASE}/wc/v3/customers?email=${encodeURIComponent(email)}&role=all`,
      { headers: { Authorization: `Basic ${wcAuth}` }, signal: AbortSignal.timeout(6000) }
    );

    let customerId = me.id;
    if (searchRes.ok) {
      const customers = await searchRes.json();
      if (customers.length) customerId = customers[0].id;
    }

    const fullName = me.name || email.split('@')[0];
    const token = makeToken({ id: customerId, email, name: fullName, iat: Date.now() });

    return NextResponse.json({ success: true, token, user: { id: customerId, name: fullName, email } });
  } catch (e) {
    console.error('[Auth Login]', e);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 503 });
  }
}
