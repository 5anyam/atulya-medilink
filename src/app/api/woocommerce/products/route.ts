import { NextRequest, NextResponse } from 'next/server';

const WC_BASE = (process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3');
const KEY = process.env.WC_CONSUMER_KEY || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const SECRET = process.env.WC_CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';

function authHeader() {
  return { Authorization: `Basic ${Buffer.from(`${KEY}:${SECRET}`).toString('base64')}` };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get('per_page') || '100';
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const slug = searchParams.get('slug') || '';

    let url = `${WC_BASE}/products?per_page=${perPage}&page=${page}&status=publish`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (slug) url += `&slug=${encodeURIComponent(slug)}`;

    const res = await fetch(url, { headers: authHeader() });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[products-api] WC error:', res.status, text.slice(0, 200));
      return NextResponse.json({ error: `WooCommerce error ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[products-api] error:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
