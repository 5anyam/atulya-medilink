'use client';

import React from 'react';
import Image from 'next/image';

export default function Preloader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#ffffff',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div style={{ animation: 'atulya-fade 2s ease-in-out infinite' }}>
          <Image
            src="/atulya-logo.png"
            alt="Atulya Medilink"
            width={160}
            height={52}
            style={{ height: 52, width: 'auto', objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Loading bar */}
        <div style={{ width: 140, height: 2, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: '40%', borderRadius: 99,
            background: 'linear-gradient(90deg, #ff5f1f, #0d9488)',
            animation: 'atulya-bar 1.1s infinite linear',
          }} />
        </div>

        <p style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#d1d5db', fontWeight: 600 }}>
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes atulya-bar  { 0% { transform: translateX(-140%); } 100% { transform: translateX(380%); } }
        @keyframes atulya-fade { 0%,100% { opacity:1; } 50% { opacity:0.65; } }
      `}</style>
    </div>
  );
}
