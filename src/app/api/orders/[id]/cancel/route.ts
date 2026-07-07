import { NextRequest, NextResponse } from 'next/server';

const CMS_BASE = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/atulya/v1';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (!token) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

    const res = await fetch(`${CMS_BASE}/orders/${id}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error('[Orders Cancel]', e);
    return NextResponse.json({ success: false, message: 'Failed to cancel order.' }, { status: 503 });
  }
}
