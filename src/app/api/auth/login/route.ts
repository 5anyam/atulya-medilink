import { NextRequest, NextResponse } from 'next/server';

const CMS_BASE = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/atulya/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${CMS_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error('[Auth Login Proxy]', e);
    return NextResponse.json({ message: 'Unable to connect to authentication server. Please try again later.' }, { status: 503 });
  }
}
