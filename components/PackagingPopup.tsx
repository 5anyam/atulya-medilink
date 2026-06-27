'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, X, ArrowRight } from 'lucide-react';

interface Props {
  productName: string;
  productHref: string;
  onClose: () => void;
}

export default function PackagingPopup({ productName, productHref, onClose }: Props) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleContinue() {
    onClose();
    router.push(productHref);
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 20, maxWidth: 420, width: '100%', padding: '36px 32px', position: 'relative', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 14, right: 14, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={16} color="#6b7280" />
        </button>

        {/* Icon */}
        <div style={{ width: 72, height: 72, background: '#fef3c7', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Package size={36} color="#d97706" />
        </div>

        {/* Heading */}
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111', marginBottom: 10, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          New Packaging<br />Coming Soon!
        </h2>

        {/* Body */}
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
          <strong style={{ color: '#374151' }}>{productName}</strong> is getting a fresh new look.
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
          You may receive the current packaging while we transition. The product quality & formula remain exactly the same.
        </p>

        {/* Amber notice strip */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 24, fontSize: 12, color: '#92400e', fontWeight: 600 }}>
          ✦ Same trusted formula — only the box is changing
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleContinue}
            style={{ width: '100%', padding: '14px 20px', background: '#111', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#333')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#111')}
          >
            Got it, View Product <ArrowRight size={15} />
          </button>
          <button
            onClick={onClose}
            style={{ width: '100%', padding: '12px 20px', background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f3f4f6')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#f9fafb')}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
