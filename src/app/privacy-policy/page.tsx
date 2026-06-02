'use client';

import React from 'react';
import { useBrand } from '../../../lib/brand-context';

function Section({ title, children, borderColor }: { title: string; children: React.ReactNode; borderColor: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111', borderLeft: `4px solid ${borderColor}`, paddingLeft: 14, marginBottom: 14, lineHeight: 1.3 }}>{title}</h2>
      <div style={{ fontSize: 14, color: '#444', lineHeight: 1.85 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  const { theme } = useBrand();

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ background: '#0f0f0f', padding: '60px 32px', borderBottom: `3px solid ${theme.primary}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 14 }}>✦ Legal</span>
          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", lineHeight: 1 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>Effective Date: 1 January 2024 · atulyamedilinkpvtltd.com</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '48px 52px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>

          <Section title="1. Introduction" borderColor={theme.primary}>
            <p>Atulya Medilink Pvt. Ltd. (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information through our platform <strong>atulyamedilinkpvtltd.com</strong> when you browse, access, or purchase from us.</p>
            <p style={{ marginTop: 12 }}>We do not publish, sell, or rent client details to third parties for marketing purposes without explicit consent. By accessing or using our Platform, you agree to the terms of this Privacy Policy.</p>
          </Section>

          <Section title="2. Information We Collect" borderColor={theme.primary}>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Name, contact details (email, phone), shipping &amp; billing address</li>
              <li>Order history and product preferences</li>
              <li>Payment information (processed via secure third-party services — we do not store card details)</li>
              <li>Device and browser information collected via cookies</li>
              <li>Communications you send us (enquiry forms, emails)</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information" borderColor={theme.primary}>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>To process and fulfil your orders</li>
              <li>To contact you regarding your order status or delivery</li>
              <li>To provide after-sale support and service reminders</li>
              <li>To improve our website and product offerings</li>
              <li>To send promotional communications (with your consent — you can opt out at any time)</li>
            </ul>
          </Section>

          <Section title="4. Information Sharing" borderColor={theme.primary}>
            <p>We may share your information with:</p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Delivery and logistics partners (to fulfil your order)</li>
              <li>Payment gateway providers (under strict confidentiality agreements)</li>
              <li>Law enforcement or regulatory authorities, when required by law</li>
            </ul>
            <p style={{ marginTop: 12 }}>We do not sell or rent your personal data to third parties.</p>
          </Section>

          <Section title="5. Cookies" borderColor={theme.primary}>
            <p>We use cookies to improve your browsing experience and analyse site traffic. You can disable cookies through your browser settings, though some features of the site may not function correctly without them.</p>
          </Section>

          <Section title="6. Children&apos;s Privacy" borderColor={theme.primary}>
            <p>Our platform is not intended for use by minors under 18 years of age. We do not knowingly collect personal information from children.</p>
          </Section>

          <Section title="7. Data Security" borderColor={theme.primary}>
            <p>We employ SSL encryption and follow IT Act 2000 standards to protect your personal data. However, no transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="8. Your Rights" borderColor={theme.primary}>
            <p>You may request access to, correction of, or deletion of your personal data by contacting us at <strong>info@atulyamedilinkpvtltd.com</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Changes to This Policy" borderColor={theme.primary}>
            <p>We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised effective date. Continued use of the platform constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="10. Contact Us" borderColor={theme.primary}>
            <p>For privacy-related queries, contact us at:</p>
            <ul style={{ paddingLeft: 0, marginTop: 10, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li><strong>Company:</strong> Atulya Medilink Pvt. Ltd. (CIN: U52390DL2019PTC352625)</li>
              <li><strong>Email:</strong> info@atulyamedilinkpvtltd.com</li>
              <li><strong>Phone:</strong> 011 4144 7223</li>
              <li><strong>Address:</strong> Unit-604, Ring Road Mall, Manglam Place Plot 21, Sector-3, Rohini, Delhi – 110085</li>
            </ul>
          </Section>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          div[style*="padding: '48px 52px'"] { padding: 28px 20px !important; }
        }
      `}</style>
    </div>
  );
}
