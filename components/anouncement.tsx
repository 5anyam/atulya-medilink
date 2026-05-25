'use client';

import { useState, useEffect } from 'react';
import { useBrand } from '../lib/brand-context';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme, mode } = useBrand();

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, 30000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const message = mode === 'cosmetics'
    ? '✦ Free Delivery on orders above ₹499 &nbsp;|&nbsp; Dermatologist Tested &nbsp;|&nbsp; Cruelty Free'
    : '✦ Free Delivery on orders above ₹499 &nbsp;|&nbsp; GMP Certified &nbsp;|&nbsp; Third-Party Tested';

  return (
    <div
      style={{
        background: theme.primary,
        color: '#fff',
        padding: '9px 16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'opacity 0.3s, transform 0.3s',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }} />
        <p
          style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', letterSpacing: '0.04em' }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleClose}
            style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#fff', flexShrink: 0 }}
            aria-label="Close"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
