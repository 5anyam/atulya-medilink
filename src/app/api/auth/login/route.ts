import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WC_BASE = process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3';
const WP_BASE = 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wp/v2';
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
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // Step 1: look up customer by email using admin WC API keys
    const wcAuth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const searchRes = await fetch(`${WC_BASE}/customers?email=${encodeURIComponent(email)}&role=all`, {
      headers: { 'Authorization': `Basic ${wcAuth}` },
    });

    if (!searchRes.ok) {
      return NextResponse.json({ message: 'Unable to reach authentication server.' }, { status: 503 });
    }

    const customers: { id: number; email: string; first_name: string; last_name: string; username: string }[] = await searchRes.json();

    if (!customers || customers.length === 0) {
      return NextResponse.json({ message: 'No account found with this email. Please register first.' }, { status: 401 });
    }

    const customer = customers[0];

    // Step 2: verify password via WordPress REST API Basic Auth (username:password)
    const wpAuth = Buffer.from(`${customer.username}:${password}`).toString('base64');
    const verifyRes = await fetch(`${WP_BASE}/users/me`, {
      headers: { 'Authorization': `Basic ${wpAuth}` },
    });

    if (!verifyRes.ok) {
      return NextResponse.json({ message: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    const wpUser = await verifyRes.json();

    const fullName = `${customer.first_name} ${customer.last_name}`.trim() || wpUser.name || email.split('@')[0];
    const token = makeToken({ id: customer.id, email: customer.email, name: fullName, iat: Date.now() });

    return NextResponse.json({
      success: true,
      token,
      user: { id: customer.id, name: fullName, email: customer.email },
    });
  } catch (e) {
    console.error('[Auth Login]', e);
    return NextResponse.json({ message: 'Server error. Please try again.' }, { status: 503 });
  }
}
