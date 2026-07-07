import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const WC_KEY    = process.env.WC_CONSUMER_KEY    || process.env.CONSUMER_KEY    || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const WC_SECRET = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function makeToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig  = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Name, email and password are required.' }, { status: 400 });
    }

    // ── Try WordPress plugin endpoint first ──────────────────────────────────
    try {
      const pluginRes = await fetch(`${CMS_BASE}/atulya/v1/register`, {
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
        return NextResponse.json({ message: data?.message || 'Registration failed.' }, { status: pluginRes.status });
      }
    } catch { /* plugin not available — fall through to WC */ }

    // ── Fallback: WooCommerce Customers API ──────────────────────────────────
    const wcAuth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const wcRes  = await fetch(`${CMS_BASE}/wc/v3/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${wcAuth}` },
      body: JSON.stringify({
        email,
        password,
        first_name: name.split(' ')[0] ?? name,
        last_name:  name.split(' ').slice(1).join(' ') || '',
        username:   email.split('@')[0] + '_' + Date.now().toString(36),
        role:       'customer',
      }),
    });

    const wcData = await wcRes.json();
    if (!wcRes.ok) {
      const msg = wcData?.message || 'Registration failed. Email may already be in use.';
      return NextResponse.json({ message: msg }, { status: wcRes.status });
    }

    const fullName = `${wcData.first_name} ${wcData.last_name}`.trim() || name;
    const token = makeToken({ id: wcData.id, email: wcData.email, name: fullName, iat: Date.now() });
    return NextResponse.json({ success: true, token, user: { id: wcData.id, name: fullName, email: wcData.email } });
  } catch (e) {
    console.error('[Auth Register]', e);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 503 });
  }
}
