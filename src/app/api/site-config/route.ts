import { NextResponse } from 'next/server';
import { getSiteConfig } from '../../../../lib/site-config';

// Same-origin proxy so the browser can read the WordPress-managed site config
// without cross-origin (CORS) issues. Cached for a minute at the edge.
export const revalidate = 60;

export async function GET() {
  const config = await getSiteConfig();
  return NextResponse.json(config, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
