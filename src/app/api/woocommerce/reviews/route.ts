import { NextRequest, NextResponse } from 'next/server';

const WC_BASE = process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3';
const KEY = process.env.WC_CONSUMER_KEY || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const SECRET = process.env.WC_CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';

function auth() {
  return { Authorization: `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString('base64')}` };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product') || '';
    const perPage = searchParams.get('per_page') || '100';
    const status = searchParams.get('status') || 'approved';

    const url = `${WC_BASE}/products/reviews?product=${productId}&per_page=${perPage}&status=${status}`;
    const res = await fetch(url, { headers: auth() });

    if (!res.ok) return NextResponse.json([], { status: 200 });
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${WC_BASE}/products/reviews`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { ...auth(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: (err as { message?: string }).message || 'Failed' }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
