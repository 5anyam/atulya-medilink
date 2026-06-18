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

export default function TermsAndConditionsPage() {
  const { theme } = useBrand();

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="legal-hero" style={{ background: '#0f0f0f', borderBottom: `3px solid ${theme.primary}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 14 }}>✦ Legal</span>
          <h1 className="legal-title" style={{ fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", lineHeight: 1 }}>Terms &amp; Conditions</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>Last Updated: 1 January 2024 · atulyamedilinkpvtltd.com</p>
        </div>
      </div>

      {/* Content */}
      <div className="legal-outer" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="legal-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>

          <Section title="1. Agreement to Terms" borderColor={theme.primary}>
            <p>This website is owned and managed by <strong>Atulya Medilink Pvt. Ltd.</strong> (CIN: U52390DL2019PTC352625). By accessing or using <strong>atulyamedilinkpvtltd.com</strong>, you agree to be legally bound by these Terms &amp; Conditions. These terms may be updated at any time without prior notice. Continued use of the site constitutes acceptance of the updated terms.</p>
          </Section>

          <Section title="2. Products &amp; Pricing" borderColor={theme.primary}>
            <p>All prices listed on our website are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify product prices at any time. Product descriptions, images, and specifications are provided in good faith and may vary slightly from the physical product. Atulya Medilink offers natural cosmetics and clinical-grade nutraceuticals; product efficacy may vary by individual.</p>
          </Section>

          <Section title="3. Order Placement &amp; Confirmation" borderColor={theme.primary}>
            <p>Placing an order does not constitute a confirmed sale until we send you an order confirmation. We reserve the right to cancel any order in case of pricing errors, out-of-stock situations, or suspected fraudulent activity. All orders are prepaid — we do not offer Cash on Delivery (COD) at this time.</p>
          </Section>

          <Section title="4. Delivery" borderColor={theme.primary}>
            <p>We endeavour to dispatch all orders within 24 hours of confirmation. Delivery timelines of 3–5 business days apply to most locations across India and are estimates only. Atulya Medilink is not liable for delays caused by logistics partners, natural disasters, or circumstances beyond our control.</p>
          </Section>

          <Section title="5. Product Use" borderColor={theme.primary}>
            <p>Our cosmetic products are for external use only unless specifically stated otherwise. Nutraceutical supplements should be consumed as directed on the label and are not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any supplement regimen, especially if you are pregnant, nursing, or on medication.</p>
          </Section>

          <Section title="6. Limitation of Liability" borderColor={theme.primary}>
            <p>Atulya Medilink Pvt. Ltd. shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our liability is limited to the purchase value of the product in question. Individual results from cosmetic and nutraceutical products may vary.</p>
          </Section>

          <Section title="7. Intellectual Property" borderColor={theme.primary}>
            <p>All content on atulyamedilinkpvtltd.com — including text, images, logos, formulations, and design — is the intellectual property of Atulya Medilink Pvt. Ltd. and may not be reproduced without written permission.</p>
          </Section>

          <Section title="8. Governing Law" borderColor={theme.primary}>
            <p>These Terms &amp; Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Delhi, India.</p>
          </Section>

          <Section title="9. Contact" borderColor={theme.primary}>
            <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
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
