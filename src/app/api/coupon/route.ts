import { NextRequest, NextResponse } from 'next/server';

// Validates a coupon against WooCommerce coupons (server-side, keys stay secret).
const WC = {
  BASE: (process.env.WC_API_BASE || process.env.API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3').replace('/wp-json/wc/v3', ''),
  KEY: process.env.WC_CONSUMER_KEY || process.env.CONSUMER_KEY || '',
  SECRET: process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || '',
};

export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get('code') || '').trim();
  if (!code) return NextResponse.json({ valid: false, error: 'Enter a coupon code.' });

  try {
    const auth = Buffer.from(`${WC.KEY}:${WC.SECRET}`).toString('base64');
    const res = await fetch(
      `${WC.BASE}/wp-json/wc/v3/coupons?code=${encodeURIComponent(code.toLowerCase())}`,
      { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' },
    );
    if (!res.ok) return NextResponse.json({ valid: false, error: 'Could not validate coupon. Try again.' });

    const arr = await res.json();
    const c = Array.isArray(arr) ? arr[0] : null;
    if (!c) return NextResponse.json({ valid: false, error: 'Invalid coupon code.' });

    if (c.date_expires && new Date(c.date_expires).getTime() < Date.now()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired.' });
    }
    if (c.usage_limit && Number(c.usage_count) >= Number(c.usage_limit)) {
      return NextResponse.json({ valid: false, error: 'This coupon is no longer available.' });
    }
    if (!['percent', 'fixed_cart'].includes(c.discount_type)) {
      return NextResponse.json({ valid: false, error: 'This coupon cannot be applied here.' });
    }

    return NextResponse.json({
      valid: true,
      code: String(c.code),
      discount_type: c.discount_type as 'percent' | 'fixed_cart',
      amount: parseFloat(c.amount) || 0,
      minimum_amount: parseFloat(c.minimum_amount) || 0,
    });
  } catch {
    return NextResponse.json({ valid: false, error: 'Could not validate coupon. Try again.' });
  }
}
