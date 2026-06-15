'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Phone, Mail, User } from 'lucide-react';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
async function saveLead(data: { name?: string; email?: string; phone?: string; source: string; message?: string }) {
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Lead save failed', e);
  }
}

function alreadySeen(key: string) {
  return sessionStorage.getItem(key) === '1';
}
function markSeen(key: string) {
  sessionStorage.setItem(key, '1');
}

/* ─────────────────────────────────────────────
   1. Exit-Intent Popup
───────────────────────────────────────────── */
function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const triggered = useRef(false);

  useEffect(() => {
    if (alreadySeen('exit_popup')) return;

    // Desktop: mouse leaves viewport from top
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered.current || e.clientY > 10) return;
      triggered.current = true;
      markSeen('exit_popup');
      setTimeout(() => setOpen(true), 200);
    };

    // Mobile / all devices: show after 30 seconds
    const timer = setTimeout(() => {
      if (triggered.current) return;
      triggered.current = true;
      markSeen('exit_popup');
      setOpen(true);
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) return;
    await saveLead({ email, phone, source: 'exit_intent' });
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div style={{ background: '#fff', borderRadius: 20, maxWidth: 480, width: '100%', padding: '40px 36px', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', animation: 'fadeSlideUp 0.35s ease' }}>
        <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
          <X size={16} />
        </button>

        {!submitted ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', lineHeight: 1.15, marginBottom: 10, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
                Wait! Don&apos;t miss<br /><span style={{ color: '#ff5f1f' }}>20% OFF</span> your first order
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
                Enter your details below and we&apos;ll send you an exclusive discount code.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              <input
                type="tel"
                placeholder="Mobile number (optional)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              <button type="submit" style={{ background: '#ff5f1f', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#e04e10')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#ff5f1f')}
              >
                CLAIM MY 20% OFF
              </button>
              <button type="button" onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: 13, color: '#9ca3af', cursor: 'pointer', padding: '4px' }}>
                No thanks, I&apos;ll pay full price
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 10 }}>You&apos;re in!</h3>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 24 }}>
              Check your email for your exclusive <strong style={{ color: '#ff5f1f' }}>20% discount code</strong>. Happy shopping!
            </p>
            <button onClick={() => setOpen(false)} style={{ background: '#ff5f1f', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              SHOP NOW
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   2. Enquiry / Contact Form Popup
───────────────────────────────────────────── */
export function EnquiryPopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    await saveLead({ ...form, source: 'enquiry_form' });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 20, maxWidth: 520, width: '100%', padding: '36px 32px', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.22)', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeSlideUp 0.35s ease' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
          <X size={16} />
        </button>

        {!submitted ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 8, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>Send an Enquiry</h2>
              <p style={{ fontSize: 14, color: '#6b7280' }}>We&apos;ll get back to you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input required name="name" type="text" placeholder="Full Name *" value={form.name} onChange={handleChange}
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input required name="phone" type="tel" placeholder="Phone Number *" value={form.phone} onChange={handleChange}
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 14, top: '16px', color: '#9ca3af' }} />
                <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange}
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>
              <textarea name="message" placeholder="Your message or query..." value={form.message} onChange={handleChange} rows={3}
                style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#ff5f1f')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
              <button type="submit" disabled={loading}
                style={{ background: '#ff5f1f', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Send size={15} />
                {loading ? 'SENDING...' : 'SEND ENQUIRY'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#111', marginBottom: 10 }}>Thank you!</h3>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
              We&apos;ve received your enquiry. Our team will contact you within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. WhatsApp Floating Button + Popup
───────────────────────────────────────────── */
function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const WA_NUMBER = '918851180015';
  const WA_MESSAGE = encodeURIComponent('Hi Atulya Medilink! I have a query about your products.');

  useEffect(() => {
    if (alreadySeen('wa_bubble')) return;
    const t = setTimeout(() => {
      setOpen(true);
      markSeen('wa_bubble');
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 8000,
          width: 56, height: 56, borderRadius: '50%',
          background: '#25d366', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        aria-label="WhatsApp"
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.08)'; el.style.boxShadow = '0 8px 28px rgba(37,211,102,0.55)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)'; }}
      >
        <MessageCircle size={26} fill="#fff" color="#fff" />
        {!open && (
          <span style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, background: '#ff5f1f', borderRadius: '50%', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
        )}
      </button>

      {/* Popup card */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 8001,
          background: '#fff', borderRadius: 16, width: 300,
          boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          animation: 'fadeSlideUp 0.28s ease',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ background: '#25d366', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Atulya Medilink</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Typically replies within minutes</p>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          {/* Chat bubble */}
          <div style={{ padding: '16px 18px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px 12px 12px 4px', padding: '12px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                👋 Hi there! Welcome to <strong>Atulya Medilink</strong>.<br />
                How can we help you today?
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#25d366', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', justifyContent: 'center' }}
              >
                <MessageCircle size={15} /> Chat on WhatsApp
              </a>
              <button
                onClick={() => { setShowEnquiry(true); setOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: 10, padding: '11px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                <Mail size={15} /> Send an Enquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {showEnquiry && <EnquiryPopup onClose={() => setShowEnquiry(false)} />}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────
   Root export — mount all lead-capture widgets
───────────────────────────────────────────── */
export default function LeadCapture() {
  return (
    <>
      <ExitIntentPopup />
      <WhatsAppWidget />
    </>
  );
}
