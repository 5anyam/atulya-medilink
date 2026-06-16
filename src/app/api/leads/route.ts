import { NextRequest, NextResponse } from 'next/server';

const WC_BASE = (process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3');
const CK = process.env.WC_CONSUMER_KEY || process.env.CONSUMER_KEY || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const CS = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const AUTH = Buffer.from(`${CK}:${CS}`).toString('base64');

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, source, message } = await req.json();

    if (!phone && !email) {
      return NextResponse.json({ error: 'Phone or email required' }, { status: 400 });
    }

    const generatedEmail = email || `lead.${phone.replace(/\D/g, '')}@atulyamedilinkpvtltd.com`;
    const firstName = name ? name.split(' ')[0] : 'Lead';
    const lastName = name ? name.split(' ').slice(1).join(' ') : '';

    const customerPayload = {
      email: generatedEmail,
      first_name: firstName,
      last_name: lastName,
      username: generatedEmail,
      billing: {
        first_name: firstName,
        last_name: lastName,
        email: generatedEmail,
        phone: phone || '',
      },
      meta_data: [
        { key: 'lead_source', value: source || 'website' },
        { key: 'lead_phone', value: phone || '' },
        { key: 'lead_message', value: message || '' },
        { key: 'lead_captured_at', value: new Date().toISOString() },
      ],
    };

    const res = await fetch(`${WC_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${AUTH}`,
      },
      body: JSON.stringify(customerPayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // If customer already exists (code: registration-error-email-exists), that's fine
      if (err?.code === 'registration-error-email-exists') {
        return NextResponse.json({ ok: true, existing: true });
      }
      console.error('[Leads API] WooCommerce error:', err);
      return NextResponse.json({ error: err?.message || 'Failed to save lead' }, { status: 500 });
    }

    const customer = await res.json();
    return NextResponse.json({ ok: true, customerId: customer.id });
  } catch (e) {
    console.error('[Leads API] Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
