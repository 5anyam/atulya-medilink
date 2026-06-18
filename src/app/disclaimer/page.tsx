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

export default function DisclaimerPage() {
  const { theme } = useBrand();

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="legal-hero" style={{ background: '#0f0f0f', borderBottom: `3px solid ${theme.primary}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 14 }}>✦ Legal</span>
          <h1 className="legal-title" style={{ fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", lineHeight: 1 }}>Disclaimer</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>atulyamedilinkpvtltd.com · Natural Cosmetics &amp; Nutraceuticals</p>
        </div>
      </div>

      {/* Content */}
      <div className="legal-outer" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="legal-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>

          {/* Alert banner */}
          <div style={{ background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 10, padding: '16px 20px', marginBottom: 36 }}>
            <p style={{ fontSize: 14, color: theme.primaryDark, fontWeight: 600 }}>
              Important: Our nutraceutical supplements are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before starting any supplement, especially if pregnant, nursing, or on medication.
            </p>
          </div>

          <Section title="1. Health &amp; Medical Disclaimer" borderColor={theme.primary}>
            <p>The information provided on atulyamedilinkpvtltd.com is for general informational and educational purposes only and does not constitute medical advice. Product descriptions, ingredient benefits, and use-case information are based on available research and should not replace consultation with a licensed physician or healthcare provider.</p>
            <p style={{ marginTop: 12 }}>Results from cosmetic and nutraceutical products vary by individual. Atulya Medilink makes no guarantee of specific outcomes.</p>
          </Section>

          <Section title="2. Cosmetics Disclaimer" borderColor={theme.primary}>
            <p>All cosmetic products are for external use only unless specifically directed otherwise. Perform a patch test before full application, especially if you have sensitive skin. Discontinue use immediately if irritation, redness, or adverse reaction occurs. Keep away from eyes unless the product is specifically formulated for eye use.</p>
          </Section>

          <Section title="3. Nutraceuticals Disclaimer" borderColor={theme.primary}>
            <p>Atulya Medilink nutraceuticals are dietary supplements. They are not medicines and are not regulated as drugs. Statements on this website have not been evaluated by the Food Safety and Standards Authority of India (FSSAI) as drug claims. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
            <p style={{ marginTop: 12 }}>Always read the product label before use. Do not exceed the recommended daily dose. Store as directed on the packaging.</p>
          </Section>

          <Section title="4. Accuracy of Information" borderColor={theme.primary}>
            <p>While we strive to keep product information, pricing, and availability accurate, we do not warrant that all content on the website is error-free. Prices, specifications, and availability are subject to change without notice. Product images are for illustration purposes and may differ slightly from the actual product.</p>
          </Section>

          <Section title="5. Third-Party Links" borderColor={theme.primary}>
            <p>Our website may contain links to third-party websites for reference purposes. Atulya Medilink does not endorse or take responsibility for the content or practices of any linked external sites.</p>
          </Section>

          <Section title="6. Limitation of Liability" borderColor={theme.primary}>
            <p>To the maximum extent permitted by law, Atulya Medilink Pvt. Ltd. shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of products purchased through our platform beyond the purchase value of the product.</p>
          </Section>

          <Section title="7. Contact" borderColor={theme.primary}>
            <p>If you have questions about this disclaimer, contact us:</p>
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
        .legal-hero { padding: 60px 32px; }
        .legal-title { font-size: clamp(32px, 6vw, 72px); }
        .legal-outer { padding: 56px 24px 80px; }
        .legal-card { padding: 48px 52px; }
        @media (max-width: 639px) {
          .legal-hero { padding: 36px 20px; }
          .legal-title { font-size: 26px !important; }
          .legal-outer { padding: 24px 16px 48px; }
          .legal-card { padding: 24px 20px; border-radius: 12px; }
        }
      `}</style>
    </div>
  );
}
