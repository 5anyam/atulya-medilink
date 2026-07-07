import { NextRequest, NextResponse } from 'next/server';

const CMS_BASE = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/atulya/v1';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    const res = await fetch(`${CMS_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error('[Orders GET]', e);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 503 });
  }
}
