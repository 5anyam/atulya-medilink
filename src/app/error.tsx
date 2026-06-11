'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf7f2', padding: 32 }}>
      <div style={{ border: '3px solid #0f1117', background: '#fff', boxShadow: '6px 6px 0 #0f1117', padding: '48px 40px', textAlign: 'center', maxWidth: 440, width: '100%' }}>
        <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 72, color: '#0f1117', lineHeight: 1 }}>OOPS.</div>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: '#0D9488', letterSpacing: '0.06em', margin: '8px 0 16px' }}>SOMETHING WENT WRONG</h2>
        <p style={{ fontSize: 13, color: 'rgba(15,17,23,0.55)', marginBottom: 28, lineHeight: 1.6 }}>
          We hit an unexpected error. Please try again or go back to the shop.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{ background: '#0D9488', color: '#fff', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', padding: '12px 24px', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            TRY AGAIN
          </button>
          <Link
            href="/shop"
            style={{ display: 'inline-block', background: '#faf7f2', color: '#0f1117', border: '2.5px solid #0f1117', boxShadow: '4px 4px 0 #0f1117', padding: '12px 24px', fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            GO TO SHOP
          </Link>
        </div>
      </div>
    </div>
  );
}
