'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useBrand } from '../../../lib/brand-context';
import {
  Leaf, ShieldCheck, Heart, Award, Users, Package, Building2,
  ChevronRight, Sparkles, Pill, FlaskConical, Baby, Star, BadgeCheck, Truck
} from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('visible'); }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const stats = [
  { num: '2005', label: 'Year Founded' },
  { num: '20,000+', label: 'Happy Customers' },
  { num: '150+', label: 'Products' },
  { num: '21', label: 'Team Members' },
];

const values = [
  {
    icon: ShieldCheck,
    title: 'Purity First',
    desc: 'We never compromise on the purity and integrity of our formulations. Every product is tested to the highest standards before it reaches you.',
  },
  {
    icon: Heart,
    title: 'Customer Trust',
    desc: 'We believe in maintaining the trust our clients place in us. Transparent labelling, honest claims, and consistent quality build lasting relationships.',
  },
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    desc: 'Our formulations are rooted in nature — plant-based, Ayurvedic and scientifically validated ingredients free from harmful chemicals.',
  },
  {
    icon: Award,
    title: 'Proven Efficacy',
    desc: 'Every product in our range is backed by science, clinical research and decades of Ayurvedic wisdom to ensure you see real, measurable results.',
  },
  {
    icon: Truck,
    title: 'Reliable Delivery',
    desc: 'Pan-India delivery within 3–5 business days. Your health products arrive safely packaged, on time, every time.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Assured',
    desc: '100% quality assurance on every product. GMP-certified manufacturing with third-party testing for complete peace of mind.',
  },
];

const categories = [
  { icon: Sparkles, label: 'Cosmetics', desc: 'Dermatologist-tested skincare, hair care and body care made with natural ingredients.', color: '#ff5f1f', bg: '#fff8f5' },
  { icon: Pill, label: 'Nutraceuticals', desc: 'Clinical-grade vitamins, omega-3, biotin and wellness supplements backed by science.', color: '#0d9488', bg: '#f0fdfa' },
  { icon: FlaskConical, label: 'Ayurvedic', desc: 'Traditional Ayurvedic formulations including capsules, syrups and tablets for holistic health.', color: '#7c3aed', bg: '#faf5ff' },
  { icon: Baby, label: 'Baby Care', desc: 'Gentle, safe and pure baby care products formulated for delicate infant skin and health.', color: '#0891b2', bg: '#f0f9ff' },
];

export default function AboutPage() {
  const { theme } = useBrand();
  const ref1 = useReveal();
  const ref2 = useReveal();
  const ref3 = useReveal();
  const ref4 = useReveal();

  return (
    <main style={{ minHeight: '100vh', background: '#fff' }}>

      {/* ── HERO ── */}
      <section style={{ background: '#0f0f0f', padding: '80px 32px 72px', borderBottom: `3px solid ${theme.primary}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(${theme.primaryRgb},0.04) 1px,transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle,rgba(${theme.primaryRgb},0.14) 0%,transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 20 }}>✦ Our Story</span>
          <h1 style={{ fontSize: 'clamp(52px,9vw,108px)', fontWeight: 900, color: '#fff', lineHeight: 0.9, marginBottom: 24, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            ABOUT<br /><span style={{ color: theme.primary }}>ATULYA.</span>
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.9 }}>
            Your trusted partner in natural health and holistic wellness since 2005. Manufacturers, traders and exporters of cosmetics, nutraceuticals, Ayurvedic medicines and baby care products — serving 20,000+ customers across India.
          </p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: theme.primary, padding: '48px 40px', borderBottom: '2px solid #111' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ width: 1, height: 44, background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.num}</span>
                <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginTop: 6, fontWeight: 500 }}>{s.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section style={{ padding: '80px 32px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={ref1} className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

            {/* Left: Text */}
            <div>
              <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 14 }}>✦ Established 2005</span>
              <h2 style={{ fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.025em', marginBottom: 24, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
                TWO DECADES OF<br /><span style={{ color: theme.primary }}>WELLNESS.</span>
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.9, marginBottom: 20 }}>
                Founded in 2005, Atulya Medilink Pvt Ltd began with a simple belief — that effective healthcare should be accessible, affordable and rooted in nature. From our base in Delhi, we have grown into a trusted manufacturer, trader and exporter of health and wellness products across India.
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.9, marginBottom: 20 }}>
                Our product range spans cosmetics, nutraceuticals, Ayurvedic medicines, and baby care — each formulated with the finest natural ingredients and backed by rigorous quality testing. We operate two offices, serve over 20,000 happy customers and work with 19 trusted company partners.
              </p>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.9 }}>
                We believe in maintaining the trust our clients have placed in us, and we never compromise on the purity and integrity of our medicines and health supplements.
              </p>
            </div>

            {/* Right: Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { icon: Building2, title: '2 Offices', sub: 'Delhi & Haryana' },
                { icon: Users, title: '21 Experts', sub: 'Dedicated team' },
                { icon: Package, title: '150+ Products', sub: 'Across categories' },
                { icon: Star, title: '20,000+ Customers', sub: 'Across India' },
              ].map((item, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '28px 22px', textAlign: 'center', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 8px 24px rgba(${theme.primaryRgb},0.1)`; el.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
                >
                  <div style={{ width: 44, height: 44, background: theme.bgLight, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <item.icon style={{ width: 20, height: 20, color: theme.primary }} />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 4 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section style={{ padding: '80px 32px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={ref2} className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 14 }}>✦ What Drives Us</span>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              MISSION &amp;<br /><span style={{ color: theme.primary }}>VISION.</span>
            </h2>
          </div>

          <div className="mv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: '#0f0f0f', borderRadius: 20, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle,rgba(${theme.primaryRgb},0.15) 0%,transparent 70%)`, pointerEvents: 'none' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 16 }}>OUR MISSION</span>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 20, lineHeight: 1.2, letterSpacing: '-0.015em' }}>
                To make natural wellness accessible to every Indian household.
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.85 }}>
                We create safe, effective and affordable health and beauty products — formulated with the best of nature and science — so every family can live healthier, look better and feel their best.
              </p>
            </div>

            <div style={{ background: theme.bgLight, borderRadius: 20, padding: '48px 40px', border: `1px solid ${theme.border}`, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle,rgba(${theme.primaryRgb},0.12) 0%,transparent 70%)`, pointerEvents: 'none' }} />
              <span style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 16 }}>OUR VISION</span>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: '#111', marginBottom: 20, lineHeight: 1.2, letterSpacing: '-0.015em' }}>
                To be India's most trusted natural health and beauty brand by 2030.
              </h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.85 }}>
                We aspire to build a brand that stands for unwavering quality, transparency and innovation — where every product earns the trust of millions of customers through genuine results and ethical practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: '80px 32px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={ref3} className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 14 }}>✦ Our Principles</span>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              WHAT WE<br /><span style={{ color: theme.primary }}>STAND FOR.</span>
            </h2>
          </div>

          <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {values.map((v, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '32px 28px', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.1)`; el.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
              >
                <div style={{ width: 46, height: 46, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <v.icon style={{ width: 21, height: 21, color: theme.primary }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 10, letterSpacing: '-0.01em' }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ── */}
      <section style={{ padding: '80px 32px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div ref={ref4} className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 14 }}>✦ What We Make</span>
            <h2 style={{ fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              OUR<br /><span style={{ color: theme.primary }}>CATEGORIES.</span>
            </h2>
          </div>

          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {categories.map((c, i) => (
              <div key={i} style={{ background: c.bg, borderRadius: 16, padding: '32px 24px', border: `1px solid ${c.color}22`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 8px 24px ${c.color}22`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 48, height: 48, background: `${c.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <c.icon style={{ width: 22, height: 22, color: c.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 10 }}>{c.label}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0f0f0f', padding: '72px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,rgba(${theme.primaryRgb},0.1) 0%,transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 20 }}>✦ Get In Touch</span>
          <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, marginBottom: 20, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            QUESTIONS?<br /><span style={{ color: theme.primary }}>WE'RE HERE.</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.85 }}>
            Have a question about our products, a bulk order enquiry or anything else? Our team is happy to help.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme.primary, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: `0 4px 18px rgba(${theme.primaryRgb},0.4)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.5)`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 4px 18px rgba(${theme.primaryRgb},0.4)`; }}
            >
              CONTACT US <ChevronRight size={14} />
            </Link>
            <Link href="/shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.75)', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `rgba(${theme.primaryRgb},0.5)`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)')}
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        @media (max-width: 900px) {
          .mv-grid  { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr 1fr !important; }
          .cat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .reveal > div { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .cat-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .cat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
