'use client';

import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#fff',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>

        {/* Logo */}
        <div style={{ animation: 'atulya-pulse 2s ease-in-out infinite' }}>
          <Image
            src="/atulya-logo.png"
            alt="Atulya Medilink"
            width={160}
            height={52}
            style={{ height: 52, width: 'auto', objectFit: 'contain', display: 'block' }}
            priority
          />
        </div>

        {/* Animated dots */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%', background: '#ff5f1f',
                animation: `atulya-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>

        <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600 }}>
          Natural · Pure · Effective
        </p>
      </div>

      <style>{`
        @keyframes atulya-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
        @keyframes atulya-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
