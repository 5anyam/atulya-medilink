import { NextRequest, NextResponse } from 'next/server';

const CMS_BASE = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/atulya/v1';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${CMS_BASE}/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error('[Auth Verify]', e);
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
