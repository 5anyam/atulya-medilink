'use client';

import { ShieldAlert } from 'lucide-react';

export default function SecurityBar() {
  return (
    <div style={{
      background: '#1a1a1a',
      color: '#fff',
      padding: '7px 16px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
        <ShieldAlert size={13} color="#ff5f1f" strokeWidth={2.5} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.5 }}>
          <strong style={{ color: '#ff5f1f' }}>Beware:</strong> No one from our team will call you for offers, free gifts or payments.
        </p>
      </div>
    </div>
  );
}
