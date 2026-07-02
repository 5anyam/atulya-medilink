import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const TOKEN_SECRET = process.env.AUTH_SECRET || 'atulya-medilink-auth-2024';

function verifyToken(token: string): object | null {
  try {
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString());
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ success: false }, { status: 400 });

    const payload = verifyToken(token) as { id: number; email: string; name: string; iat: number } | null;
    if (!payload) return NextResponse.json({ success: false, message: 'Invalid or expired token.' }, { status: 401 });

    return NextResponse.json({ success: true, user: { id: payload.id, email: payload.email, name: payload.name } });
  } catch (e) {
    console.error('[Auth Verify]', e);
    return NextResponse.json({ success: false }, { status: 503 });
  }
}
