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

export default function ReturnsRefundPolicyPage() {
  const { theme } = useBrand();

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* Hero */}
      <div className="legal-hero" style={{ background: '#0f0f0f', borderBottom: `3px solid ${theme.primary}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 14 }}>✦ Legal</span>
          <h1 className="legal-title" style={{ fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", lineHeight: 1 }}>Returns &amp; Refunds</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>Please read carefully · atulyamedilinkpvtltd.com</p>
        </div>
      </div>

      {/* Content */}
      <div className="legal-outer" style={{ maxWidth: 840, margin: '0 auto' }}>
        <div className="legal-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>

          {/* Info banner */}
          <div style={{ background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 10, padding: '16px 20px', marginBottom: 36 }}>
            <p style={{ fontSize: 14, color: theme.primaryDark, fontWeight: 600 }}>All shipments are carefully inspected before dispatch. If you receive a defective or incorrect product, please contact us within 7 days of delivery.</p>
          </div>

          <Section title="1. Acceptable Reasons for Returns" borderColor={theme.primary}>
            <p style={{ marginBottom: 10 }}>We accept returns only under the following circumstances:</p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Damaged / Broken Product:</strong> Visibly damaged unit or packaging upon delivery</li>
              <li><strong>Wrong Product Delivered:</strong> You received a different product than what was ordered</li>
              <li><strong>Manufacturing Defect:</strong> Product fails to function or appears to be defective upon first use</li>
              <li><strong>Incomplete Order:</strong> Missing items or components as listed in the order</li>
            </ul>
          </Section>

          <Section title="2. Non-Returnable Conditions" borderColor={theme.primary}>
            <div style={{ background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 8, padding: '14px 18px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, marginBottom: 8 }}>The following situations are NOT eligible for return or refund:</p>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Opened, used, or partially consumed products (for hygiene reasons)</li>
                <li>Products without original packaging, seals, or documentation</li>
                <li>Returns requested after 7 days of delivery date</li>
                <li>Change of mind or incorrect product selection by the customer</li>
                <li>Products damaged due to improper storage or misuse</li>
                <li>Cosmetics where packaging seal has been broken after delivery</li>
              </ul>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', fontStyle: 'italic' }}>Note: Due to the nature of cosmetic and nutraceutical products, opened items cannot be accepted for return unless they are defective.</p>
          </Section>

          <Section title="3. How to Initiate a Return" borderColor={theme.primary}>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Contact us within <strong>7 days</strong> of delivery at <strong>info@atulyamedilinkpvtltd.com</strong> or call <strong>011 4144 7223</strong></li>
              <li>Share your order number, a description of the issue, and clear photographs of the product and packaging</li>
              <li>Our team will review and respond within 48 hours</li>
              <li>If approved, we will arrange a pickup or guide you on returning the item</li>
            </ol>
          </Section>

          <Section title="4. Refund Process" borderColor={theme.primary}>
            <p>Once the returned product is received and inspected:</p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Approved refunds are processed within <strong>7–10 business days</strong></li>
              <li>Refunds are credited to the original payment method (bank account, UPI, or card)</li>
              <li>Shipping charges are non-refundable unless the return is due to our error</li>
              <li>All payments are prepaid; we do not offer Cash on Delivery (COD)</li>
            </ul>
          </Section>

          <Section title="5. Exchanges" borderColor={theme.primary}>
            <p>We currently do not offer direct product exchanges. If you need a different product, please initiate a return (if eligible) and place a new order for the desired item.</p>
          </Section>

          <Section title="6. Contact for Returns" borderColor={theme.primary}>
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
