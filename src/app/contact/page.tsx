'use client';

import React, { useState } from 'react';
import { useBrand } from '../../../lib/brand-context';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, Twitter, Send, CheckCircle } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Facebook,  label: 'Facebook',  url: 'https://facebook.com/people/Atulyaofficial', color: '#1877f2' },
  { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/officialatulya',        color: '#e1306c' },
  { icon: Youtube,   label: 'YouTube',   url: 'https://youtube.com/@atulyamedilink4119',     color: '#ff0000' },
  { icon: Twitter,   label: 'X / Twitter', url: 'https://x.com/officialatulya',              color: '#000'    },
  { icon: Linkedin,  label: 'LinkedIn',  url: 'https://linkedin.com/in/atulya-medilink-877408101', color: '#0a66c2' },
];

export default function ContactPage() {
  const { theme } = useBrand();
  const [form, setForm]           = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]     = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: '100%', padding: '13px 16px',
    border: `1.5px solid ${focused === name ? theme.primary : '#e5e7eb'}`,
    borderRadius: 8, fontSize: 14, color: '#111', background: '#fff',
    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* ─── Hero ─── */}
      <section className="contact-hero" style={{ background: theme.primary, borderBottom: `3px solid rgba(0,0,0,0.15)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -80, right: -80, width: 380, height: 380, borderRadius: '50%', background: `radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 14 }}>✦ Atulya Medilink</span>
          <h1 className="contact-hero-title" style={{ fontWeight: 900, color: '#fff', lineHeight: 0.92, marginBottom: 16, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            GET IN<br /><span style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>TOUCH.</span>
          </h1>
          <p className="contact-hero-sub" style={{ fontWeight: 400, color: 'rgba(255,255,255,0.82)', maxWidth: 420, margin: '0 auto', lineHeight: 1.85 }}>
            Have a question, bulk inquiry, or need guidance on the right product? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ─── Quick-info strip ─── */}
      <section style={{ background: theme.primary, borderBottom: '2px solid rgba(0,0,0,0.12)' }}>
        <div className="contact-info-strip" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {([
            { icon: Phone,   text: '+91 011 4144 7223',                   href: 'tel:01141447223' },
            { icon: Mail,    text: 'info@atulyamedilinkpvtltd.com',       href: 'mailto:info@atulyamedilinkpvtltd.com' },
            { icon: MapPin,  text: 'Ring Road Mall, Rohini, Delhi – 110085', href: undefined },
          ] as { icon: React.ElementType; text: string; href: string | undefined }[]).map(({ icon: Icon, text, href }) => (
            href
              ? <a key={text} href={href} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, flexShrink: 0 }}><Icon size={15} strokeWidth={2.5} /><span>{text}</span></a>
              : <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontSize: 13, fontWeight: 600 }}><Icon size={15} strokeWidth={2.5} /><span>{text}</span></span>
          ))}
        </div>
      </section>

      {/* ─── Main grid: info + form ─── */}
      <div className="contact-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Left — contact details */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.primary, marginBottom: 10 }}>Contact Details</p>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#111', marginBottom: 8, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", lineHeight: 1.1 }}>
            We&apos;re here<br />to help.
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 28 }}>
            Reach out for product questions, wholesale or distributor inquiries, or any feedback about Atulya Medilink products.
          </p>

          {/* Contact cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {([
              { icon: Phone,  title: 'Phone',          lines: ['+91 011 4144 7223'],                                    href: 'tel:01141447223' },
              { icon: Mail,   title: 'Email',           lines: ['info@atulyamedilinkpvtltd.com'],                       href: 'mailto:info@atulyamedilinkpvtltd.com' },
              { icon: MapPin, title: 'Office Address',  lines: ['Unit-604, Ring Road Mall', 'Manglam Place Plot 21, Sector-3', 'Rohini, Delhi – 110085'], href: undefined },
            ] as { icon: React.ElementType; title: string; lines: string[]; href: string | undefined }[]).map(({ icon: Icon, title, lines, href }) => (
              <div key={title} style={{ display: 'flex', gap: 14, padding: '16px 18px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: theme.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={theme.primary} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 3 }}>{title}</p>
                  {lines.map((line, i) => (
                    <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                      {i === 0 && href
                        ? <a href={href} style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>{line}</a>
                        : line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 12 }}>Follow Us</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SOCIAL_LINKS.map(({ icon: Icon, label, url, color }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', color: '#374151' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = color;
                    el.style.borderColor = color;
                    (el.querySelector('svg') as SVGElement | null)?.setAttribute('color', '#fff');
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = '#fff';
                    el.style.borderColor = '#e5e7eb';
                    (el.querySelector('svg') as SVGElement | null)?.setAttribute('color', '#374151');
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', alignSelf: 'start' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={52} color={theme.primary} strokeWidth={1.5} style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 10 }}>Message Sent!</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
                Thank you for reaching out. Our team will get back to you within 1–2 business days.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                style={{ background: theme.primary, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 4, letterSpacing: '-0.01em' }}>Send a Message</h3>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>Fill in the form and we&apos;ll respond promptly.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Full Name *</label>
                    <input type="text" name="name" required placeholder="Your name" value={form.name} onChange={handleChange}
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} style={inputStyle('name')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Phone</label>
                    <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange}
                      onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} style={inputStyle('phone')} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Email Address *</label>
                  <input type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} style={inputStyle('email')} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 5 }}>Message *</label>
                  <textarea name="message" required rows={5} placeholder="Tell us how we can help…" value={form.message} onChange={handleChange}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 120 }} />
                </div>

                <button
                  type="submit"
                  style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
                >
                  <Send size={13} /> SEND MESSAGE
                </button>

                <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', lineHeight: 1.6 }}>
                  We typically respond within 1–2 business days.
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ─── Bottom CTA bar ─── */}
      <section className="contact-cta" style={{ background: '#0f0f0f', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 12 }}>✦ Prefer to Call?</span>
          <h2 className="contact-cta-title" style={{ fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 14, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            CALL US<br /><span style={{ color: theme.primary }}>ANYTIME.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24, lineHeight: 1.7 }}>
            Our team is available to guide you through our products and answer any questions.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:01141447223"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme.primary, color: '#fff', padding: '13px 24px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
            >
              <Phone size={13} /> +91 011 4144 7223
            </a>
            <a href="mailto:info@atulyamedilinkpvtltd.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', padding: '13px 24px', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `rgba(${theme.primaryRgb},0.6)`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)')}
            >
              <Mail size={13} /> EMAIL US
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer note ─── */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          <strong style={{ color: '#374151' }}>Atulya Medilink Pvt. Ltd.</strong><br />
          Unit-604, Ring Road Mall, Manglam Place Plot 21, Sector-3, Rohini, Delhi – 110085<br />
          CIN: U52390DL2019PTC352625
        </p>
      </div>

      <style>{`
        /* ── Desktop ── */
        .contact-hero { padding: 68px 32px 56px; }
        .contact-hero-title { font-size: clamp(48px, 8vw, 96px); }
        .contact-hero-sub { font-size: 14px; }
        .contact-info-strip { padding: 20px 32px; display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
        .contact-grid { padding: 56px 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 44px; }
        .contact-form-row { grid-template-columns: 1fr 1fr; }
        .contact-cta { padding: 52px 32px; }
        .contact-cta-title { font-size: clamp(36px, 5vw, 60px); }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 639px) {
          .contact-hero { padding: 40px 20px 32px; }
          .contact-hero-title { font-size: 34px !important; }
          .contact-hero-sub { font-size: 13px; }

          .contact-info-strip { padding: 14px 16px; gap: 12px; flex-direction: column; align-items: flex-start; }

          .contact-grid { padding: 32px 16px; gap: 24px !important; }
          .contact-form-row { grid-template-columns: 1fr !important; }

          .contact-cta { padding: 40px 20px; }
          .contact-cta-title { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}
