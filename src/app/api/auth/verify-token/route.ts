import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CMS_BASE     = process.env.CMS_API_BASE || 'https://cms.atulyamedilinkpvtltd.shop/wp-json';
const TOKEN_SECRET = process.env.AUTH_SECRET  || 'atulya-medilink-auth-2024';

function verifyLocal(token: string): { valid: boolean; payload?: Record<string, unknown> } {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return { valid: false };
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    if (sig !== expected) return { valid: false };
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided.' }, { status: 400 });
    }

    // ── Try WordPress plugin first ───────────────────────────────────────────
    try {
      const pluginRes = await fetch(`${CMS_BASE}/atulya/v1/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      });
      if (pluginRes.ok || pluginRes.status !== 404) {
        const data = await pluginRes.json();
        return NextResponse.json(data, { status: pluginRes.ok ? 200 : pluginRes.status });
      }
    } catch { /* fall through */ }

    // ── Fallback: verify HMAC locally ────────────────────────────────────────
    const { valid, payload } = verifyLocal(token);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });
    }
    return NextResponse.json({ success: true, user: payload });
  } catch (e) {
    console.error('[Auth Verify]', e);
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
