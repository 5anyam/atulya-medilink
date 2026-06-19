import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const WC_BASE = (process.env.WC_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json/wc/v3');
const CK = process.env.WC_CONSUMER_KEY || process.env.CONSUMER_KEY || 'ck_d4aff65e142f21beeb0ad648b90728553c99ee96';
const CS = process.env.WC_CONSUMER_SECRET || process.env.CONSUMER_SECRET || 'cs_d469c205bb3d56085ed79bbadaf344c243626277';
const AUTH = Buffer.from(`${CK}:${CS}`).toString('base64');

const NOTIFY_EMAIL = 'info.atulyamedilink@gmail.com';

function createTransporter() {
  const user = process.env.SMTP_USER || NOTIFY_EMAIL;
  const pass = process.env.SMTP_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendLeadEmail(data: {
  name?: string;
  email?: string;
  phone?: string;
  source: string;
  message?: string;
}) {
  const transporter = createTransporter();
  if (!transporter) return; // SMTP not configured — skip silently

  const sourceLabel: Record<string, string> = {
    exit_intent: 'Exit Intent Popup (20% OFF Offer)',
    enquiry_form: 'Enquiry Form',
    website: 'Website',
  };

  const subject = `New Lead: ${sourceLabel[data.source] || data.source}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      <div style="background:#168b3f;padding:20px 24px;">
        <h2 style="margin:0;color:#fff;font-size:18px;">New Lead — Atulya Medilink</h2>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">${sourceLabel[data.source] || data.source}</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
          ${data.name ? `<tr><td style="padding:8px 0;font-weight:600;width:110px;">Name</td><td>${data.name}</td></tr>` : ''}
          ${data.phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td>${data.phone}</td></tr>` : ''}
          ${data.email ? `<tr><td style="padding:8px 0;font-weight:600;">Email</td><td>${data.email}</td></tr>` : ''}
          ${data.message ? `<tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">Message</td><td>${data.message}</td></tr>` : ''}
          <tr><td style="padding:8px 0;font-weight:600;">Time</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
        </table>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Atulya Medilink Website" <${process.env.SMTP_USER || NOTIFY_EMAIL}>`,
    to: NOTIFY_EMAIL,
    subject,
    html,
  });
}

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

    const [wcRes] = await Promise.allSettled([
      fetch(`${WC_BASE}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${AUTH}`,
        },
        body: JSON.stringify(customerPayload),
      }),
      sendLeadEmail({ name, email, phone, source, message }),
    ]);

    if (wcRes.status === 'fulfilled' && !wcRes.value.ok) {
      const err = await wcRes.value.json().catch(() => ({}));
      if (err?.code === 'registration-error-email-exists') {
        return NextResponse.json({ ok: true, existing: true });
      }
      console.error('[Leads API] WooCommerce error:', err);
      return NextResponse.json({ error: err?.message || 'Failed to save lead' }, { status: 500 });
    }

    const customer = wcRes.status === 'fulfilled' ? await wcRes.value.json().catch(() => ({})) : {};
    return NextResponse.json({ ok: true, customerId: customer.id });
  } catch (e) {
    console.error('[Leads API] Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
