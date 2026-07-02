import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WC_BASE = process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3';
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || process.env.CONSUMER_KEY || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function makeToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Name, email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const wcAuth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const res = await fetch(`${WC_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${wcAuth}`,
      },
      body: JSON.stringify({
        email,
        password,
        first_name: name.split(' ')[0] ?? name,
        last_name: name.split(' ').slice(1).join(' ') || '',
        username: email.split('@')[0] + '_' + Date.now().toString(36),
        role: 'customer',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.message || 'Registration failed. Email may already be in use.';
      return NextResponse.json({ message: msg }, { status: res.status });
    }

    const token = makeToken({ id: data.id, email: data.email, name: `${data.first_name} ${data.last_name}`.trim(), iat: Date.now() });

    return NextResponse.json({
      success: true,
      token,
      user: { id: data.id, name: `${data.first_name} ${data.last_name}`.trim() || name, email: data.email },
    });
  } catch (e) {
    console.error('[Auth Register]', e);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 503 });
  }
}
