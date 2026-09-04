'use client';

import { useEffect, useState } from 'react';
import { useSiteConfig } from '../lib/use-site-config';
import { X } from 'lucide-react';

const SEEN_KEY = 'atulya_popup_seen';

// First-order discount popup. Content + on/off managed from the "Atulya Control
// Panel" plugin. Shows once per visitor (remembered in localStorage).
export default function FirstOrderPopup() {
  const { popup } = useSiteConfig();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!popup.enabled) return;
    let seen = false;
    try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, [popup.enabled]);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
  };

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(popup.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!open) return null;

  return (
    <div
      onClick={close}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', width: '100%', maxWidth: 400, background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}
        >
          <X size={16} />
        </button>

        <div style={{ background: 'linear-gradient(135deg,#ff5f1f,#ff8a4c)', padding: '34px 28px 26px', textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎁</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{popup.title}</h2>
        </div>

        <div style={{ padding: '24px 28px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginBottom: 18 }}>{popup.text}</p>

          {popup.code && (
            <button
              onClick={copyCode}
              style={{ width: '100%', border: '2px dashed #ff5f1f', background: '#fff4ef', color: '#c2410c', fontSize: 18, fontWeight: 900, letterSpacing: '0.15em', padding: '12px', borderRadius: 10, cursor: 'pointer', marginBottom: 14 }}
            >
              {copied ? 'COPIED! ✓' : popup.code}
            </button>
          )}

          <button
            onClick={close}
            style={{ width: '100%', background: '#111', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '13px', borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
