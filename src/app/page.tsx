'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBrand } from '../../lib/brand-context';
import { PRODUCTS, StaticProduct } from '../../lib/products-data';
import {
  Star, ChevronRight, Leaf, ShieldCheck, Truck, Award, Sparkles, Pill,
  FlaskConical, Heart, Package, BadgeCheck
} from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  const { theme } = useBrand();
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{
            width: size, height: size,
            fill: i <= Math.round(rating) ? theme.primary : '#e5e7eb',
            color: i <= Math.round(rating) ? theme.primary : '#e5e7eb',
          }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  const discount = product.regularPrice > product.price
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px rgba(${theme.primaryRgb},0.15)`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: 'contain', padding: '20px', transition: 'transform 0.5s' }}
          sizes="(max-width: 768px) 100vw, 33vw"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
        />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: theme.primary, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#1a1a1a', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.primary, marginBottom: 6, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.25 }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.tagline}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <StarRating rating={product.rating} size={12} />
          <span style={{ fontSize: 11, color: '#9ca3af' }}>({product.reviewCount})</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.regularPrice > product.price && (
              <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div
            style={{ background: theme.primary, color: '#fff', textAlign: 'center', padding: '11px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
          >
            VIEW PRODUCT <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeroSection() {
  const { theme, mode } = useBrand();

  const heroData = {
    cosmetics: {
      eyebrow: '✦ Natural Skincare Collection',
      heading: ['SKINCARE', 'THAT', 'WORKS.'],
      sub: 'Dermatologist-tested cosmetics crafted with natural ingredients. No harmful chemicals — just skin that looks and feels its best.',
      chips: ['Cruelty Free', 'No Parabens', 'Dermatologist Tested'],
      cta: 'Shop Cosmetics',
    },
    nutraceuticals: {
      eyebrow: '✦ Clinical-Grade Supplements',
      heading: ['WELLNESS', 'STARTS', 'INSIDE.'],
      sub: 'Science-backed nutraceuticals formulated for daily health. GMP-certified, third-party tested — for nutrition you can trust.',
      chips: ['GMP Certified', 'Third-Party Tested', 'No Artificial Colours'],
      cta: 'Shop Supplements',
    },
  }[mode];

  const featuredProduct = PRODUCTS.filter(p => p.type === mode).find(p => p.badge === 'Best Seller') || PRODUCTS.filter(p => p.type === mode)[0];

  return (
    <section
      style={{
        background: '#0f0f0f',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 580,
      }}
    >
      {/* Glow blob */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 560, height: 560, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.primaryRgb},0.18) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -60, width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(circle, rgba(${theme.primaryRgb},0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div className="hero-grid" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 40px 80px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* Left */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${theme.primaryRgb},0.12)`, border: `1px solid rgba(${theme.primaryRgb},0.3)`, color: theme.primary, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 4, marginBottom: 28 }}>
            {heroData.eyebrow}
          </div>

          <h1 style={{ fontSize: 'clamp(56px, 8vw, 112px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: 28, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            {heroData.heading.map((line, i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  color: i === 1 ? theme.primary : '#fff',
                  WebkitTextStroke: i === 2 ? `2px rgba(255,255,255,0.2)` : undefined,
                }}
              >
                {line}
              </span>
            ))}
          </h1>

          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: 440, marginBottom: 36 }}>
            {heroData.sub}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
            <Link href="/shop"
              style={{ background: theme.primary, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: `0 4px 20px rgba(${theme.primaryRgb},0.4)` }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.5)`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 4px 20px rgba(${theme.primaryRgb},0.4)`; }}
            >
              {heroData.cta} <ChevronRight size={14} />
            </Link>
            <Link href="/about"
              style={{ color: 'rgba(255,255,255,0.8)', padding: '14px 28px', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'border-color 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `rgba(${theme.primaryRgb},0.5)`)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)')}
            >
              Our Story
            </Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {heroData.chips.map((chip) => (
              <span key={chip} style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 20, letterSpacing: '0.06em' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Featured Product Card */}
        <div className="hero-right" style={{ display: 'flex', justifyContent: 'center' }}>
          {featuredProduct && (
            <Link
              href={`/product/${featuredProduct.slug}`}
              style={{ textDecoration: 'none', width: '100%', maxWidth: 320 }}
            >
              <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${theme.primaryRgb},0.2)`, borderRadius: 20, padding: 24, backdropFilter: 'blur(10px)', transition: 'border-color 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = `rgba(${theme.primaryRgb},0.5)`)}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = `rgba(${theme.primaryRgb},0.2)`)}
              >
                <div style={{ background: theme.bgLight, borderRadius: 14, padding: 28, marginBottom: 18, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image src={featuredProduct.images[0]} alt={featuredProduct.name} width={240} height={240} style={{ objectFit: 'contain', width: '100%', height: 'auto' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.primary }}>{featuredProduct.category}</span>
                  {featuredProduct.badge && (
                    <span style={{ background: theme.primary, color: '#fff', fontSize: 8, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{featuredProduct.badge}</span>
                  )}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>{featuredProduct.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <StarRating rating={featuredProduct.rating} size={11} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>({featuredProduct.reviewCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>₹{featuredProduct.price}</span>
                  {featuredProduct.regularPrice > featuredProduct.price && (
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>₹{featuredProduct.regularPrice}</span>
                  )}
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 48px 20px 56px !important; gap: 36px !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function OffersBanner() {
  const { theme } = useBrand();

  const offers = [
    {
      icon: '🎁',
      title: 'UP TO 30% OFF',
      sub: 'Limited-period offers on selected products',
      tag: 'Limited Time',
    },
    {
      icon: '🚚',
      title: 'FREE DELIVERY',
      sub: 'On all orders above ₹499 — pan-India',
      tag: 'Always On',
    },
    {
      icon: '🔒',
      title: '100% AUTHENTIC',
      sub: 'GMP certified, cruelty-free & lab-tested',
      tag: 'Guaranteed',
    },
  ];

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {offers.map((offer, i) => (
            <div
              key={i}
              style={{
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                borderRight: i < 2 ? '1px solid #f0f0f0' : 'none',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{offer.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#111', letterSpacing: '-0.01em' }}>{offer.title}</p>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: theme.bgLight, color: theme.primary, padding: '2px 8px', borderRadius: 3, border: `1px solid ${theme.border}` }}>{offer.tag}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{offer.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .offers-grid { grid-template-columns: 1fr !important; }
          .offers-grid > div { border-right: none !important; border-bottom: 1px solid #f0f0f0; padding: 20px 16px !important; }
          .offers-grid > div:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}

function MarqueeBelt() {
  const { theme, mode } = useBrand();

  const line1 = mode === 'cosmetics'
    ? ['CLEAN BEAUTY', 'SKIN FIRST', 'CRUELTY FREE', 'DERMATOLOGIST TESTED', 'NO PARABENS']
    : ['CLINICAL GRADE', 'SCIENCE BACKED', 'GMP CERTIFIED', 'THIRD-PARTY TESTED', 'NO ARTIFICIAL COLOURS'];

  const line2 = mode === 'cosmetics'
    ? ['NATURAL INGREDIENTS', 'DAILY SKINCARE', 'GLOWING SKIN', 'TRUSTED FORMULAS', 'MADE IN INDIA']
    : ['DAILY WELLNESS', 'IMMUNITY BOOST', 'PURE FORMULAS', 'TRUSTED QUALITY', 'MADE IN INDIA'];

  return (
    <div style={{ borderTop: '2px solid #111', borderBottom: '2px solid #111', overflow: 'hidden' }}>
      {/* Line 1 — theme color bg */}
      <div style={{ background: theme.primary, padding: '10px 0', overflow: 'hidden', borderBottom: '2px solid #111' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-fwd 22s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {line1.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>
                  {t} <span style={{ fontSize: 10, opacity: 0.5 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      {/* Line 2 — dark bg */}
      <div style={{ background: '#111', padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-rev 18s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {line2.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: theme.primary }}>
                  {t} <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>▶</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  const { theme, mode } = useBrand();
  const items = mode === 'cosmetics'
    ? [
        { icon: Leaf, label: 'Natural Ingredients' },
        { icon: ShieldCheck, label: 'Dermatologist Tested' },
        { icon: Heart, label: 'Cruelty Free' },
        { icon: Truck, label: 'Free Delivery ₹499+' },
        { icon: Award, label: 'No Harmful Chemicals' },
      ]
    : [
        { icon: FlaskConical, label: 'Clinical Grade' },
        { icon: ShieldCheck, label: 'GMP Certified' },
        { icon: BadgeCheck, label: 'Third-Party Tested' },
        { icon: Truck, label: 'Free Delivery ₹499+' },
        { icon: Package, label: 'Pure Formulas' },
      ];

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 36px', alignItems: 'center' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151' }}>
              <item.icon style={{ width: 14, height: 14, color: theme.primary }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const { theme, mode } = useBrand();
  const ref = useReveal();
  const products = PRODUCTS.filter(p => p.type === mode).slice(0, 4);

  return (
    <section style={{ padding: '80px 0', background: '#fafafa' }} id="products">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        <div ref={ref} className="reveal" style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, display: 'block', marginBottom: 10 }}>
            ✦ {mode === 'cosmetics' ? 'Skincare & Beauty' : 'Health & Wellness'}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              {mode === 'cosmetics' ? 'TOP PICKS FOR' : 'BESTSELLING'}<br />
              <span style={{ color: theme.primary }}>{mode === 'cosmetics' ? 'YOUR SKIN.' : 'SUPPLEMENTS.'}</span>
            </h2>
            <Link href="/shop"
              style={{ background: '#111', color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#111')}
            >
              VIEW ALL →
            </Link>
          </div>
        </div>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function CategoryBanner() {
  const { mode, setMode } = useBrand();
  const ref = useReveal();

  return (
    <section ref={ref} className="reveal" style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
      <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', maxWidth: 1280, margin: '0 auto' }}>

        {/* Cosmetics block */}
        <div
          onClick={() => setMode('cosmetics')}
          style={{
            padding: '64px 48px',
            background: mode === 'cosmetics' ? '#ff5f1f' : '#fff',
            cursor: 'pointer',
            transition: 'background 0.35s ease',
            borderRight: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: mode === 'cosmetics' ? 'rgba(255,255,255,0.1)' : 'rgba(255,95,31,0.06)', transition: 'all 0.35s' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 48, height: 48, background: mode === 'cosmetics' ? 'rgba(255,255,255,0.15)' : 'rgba(255,95,31,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Sparkles style={{ color: mode === 'cosmetics' ? '#fff' : '#ff5f1f' }} size={22} />
            </div>
            <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: mode === 'cosmetics' ? 'rgba(255,255,255,0.7)' : '#9ca3af', marginBottom: 10 }}>CATEGORY</p>
            <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: mode === 'cosmetics' ? '#fff' : '#111', lineHeight: 1, marginBottom: 14, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              Cosmetics
            </h3>
            <p style={{ fontSize: 14, color: mode === 'cosmetics' ? 'rgba(255,255,255,0.75)' : '#6b7280', lineHeight: 1.7, maxWidth: 280, marginBottom: 28 }}>
              Natural skincare, face care, hair care and body care — dermatologist tested, cruelty-free.
            </p>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: mode === 'cosmetics' ? '#fff' : '#ff5f1f',
                border: `1.5px solid ${mode === 'cosmetics' ? 'rgba(255,255,255,0.4)' : '#ff5f1f'}`,
                padding: '10px 20px', borderRadius: 8,
              }}
            >
              SHOP COSMETICS <ChevronRight size={13} />
            </span>
          </div>
        </div>

        {/* Nutraceuticals block */}
        <div
          onClick={() => setMode('nutraceuticals')}
          style={{
            padding: '64px 48px',
            background: mode === 'nutraceuticals' ? '#0d9488' : '#fff',
            cursor: 'pointer',
            transition: 'background 0.35s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: mode === 'nutraceuticals' ? 'rgba(255,255,255,0.1)' : 'rgba(13,148,136,0.06)', transition: 'all 0.35s' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 48, height: 48, background: mode === 'nutraceuticals' ? 'rgba(255,255,255,0.15)' : 'rgba(13,148,136,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Pill style={{ color: mode === 'nutraceuticals' ? '#fff' : '#0d9488' }} size={22} />
            </div>
            <p style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, color: mode === 'nutraceuticals' ? 'rgba(255,255,255,0.7)' : '#9ca3af', marginBottom: 10 }}>CATEGORY</p>
            <h3 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 900, color: mode === 'nutraceuticals' ? '#fff' : '#111', lineHeight: 1, marginBottom: 14, letterSpacing: '-0.02em', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              Nutraceuticals
            </h3>
            <p style={{ fontSize: 14, color: mode === 'nutraceuticals' ? 'rgba(255,255,255,0.75)' : '#6b7280', lineHeight: 1.7, maxWidth: 280, marginBottom: 28 }}>
              Clinical-grade vitamins, supplements and Ayurvedic formulations — science-backed, GMP certified.
            </p>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: mode === 'nutraceuticals' ? '#fff' : '#0d9488',
                border: `1.5px solid ${mode === 'nutraceuticals' ? 'rgba(255,255,255,0.4)' : '#0d9488'}`,
                padding: '10px 20px', borderRadius: 8,
              }}
            >
              SHOP SUPPLEMENTS <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function AllProductsPreview() {
  const { mode } = useBrand();
  const ref = useReveal();
  const otherMode = mode === 'cosmetics' ? 'nutraceuticals' : 'cosmetics';
  const otherProducts = PRODUCTS.filter(p => p.type === otherMode).slice(0, 4);

  return (
    <section style={{ padding: '80px 0', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div ref={ref} className="reveal" style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: 10 }}>✦ Also Available</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              EXPLORE<br />
              <span style={{ color: otherMode === 'cosmetics' ? '#ff5f1f' : '#0d9488' }}>
                {otherMode === 'cosmetics' ? 'COSMETICS.' : 'NUTRACEUTICALS.'}
              </span>
            </h2>
            <Link href="/shop"
              style={{ background: otherMode === 'cosmetics' ? '#ff5f1f' : '#0d9488', color: '#fff', padding: '12px 24px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              SEE ALL →
            </Link>
          </div>
        </div>
        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {otherProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { theme, mode } = useBrand();
  const ref = useReveal();

  const features = mode === 'cosmetics'
    ? [
        { icon: Leaf, title: 'Natural Formulas', desc: 'Each product is crafted with plant-based, natural ingredients free from harmful chemicals, sulphates and parabens.' },
        { icon: ShieldCheck, title: 'Dermatologist Tested', desc: 'Every product undergoes rigorous dermatological testing to ensure it is safe for all skin types, including sensitive skin.' },
        { icon: Heart, title: 'Cruelty Free', desc: 'We never test on animals. Our products are certified cruelty-free and ethically produced from start to finish.' },
      ]
    : [
        { icon: FlaskConical, title: 'Clinical Grade', desc: 'Our nutraceuticals are formulated using clinical-grade ingredients with scientifically validated dosages for real results.' },
        { icon: ShieldCheck, title: 'GMP Certified', desc: 'All our supplements are manufactured in GMP-certified facilities under strict quality control protocols.' },
        { icon: BadgeCheck, title: 'Third-Party Tested', desc: 'Each batch is independently tested for purity, potency and safety — you get exactly what is on the label.' },
      ];

  return (
    <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, display: 'block', marginBottom: 12 }}>✦ The Atulya Difference</span>
          <h2 style={{ fontSize: 'clamp(32px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            WHY CHOOSE<br /><span style={{ color: theme.primary }}>ATULYA?</span>
          </h2>
        </div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{ background: '#fff', borderRadius: 14, padding: '36px 30px', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 8px 24px rgba(${theme.primaryRgb},0.1)`; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
            >
              <div style={{ width: 48, height: 48, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon style={{ width: 22, height: 22, color: theme.primary }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 12, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { theme } = useBrand();
  const ref = useReveal();
  const stats = [
    { num: '5,000+', label: 'Happy Customers' },
    { num: '50+', label: 'Products' },
    { num: '100%', label: 'Natural' },
    { num: '4.7★', label: 'Avg. Rating' },
  ];

  return (
    <section style={{ background: theme.primary, padding: '52px 40px', borderTop: '2px solid #111', borderBottom: '2px solid #111' }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.num}</span>
              <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginTop: 6, fontWeight: 500 }}>{s.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  const { theme, mode } = useBrand();
  return (
    <section style={{ background: '#0f0f0f', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: `radial-gradient(circle, rgba(${theme.primaryRgb},0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${theme.primaryRgb},0.1)`, border: `1px solid rgba(${theme.primaryRgb},0.3)`, color: theme.primary, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', padding: '6px 14px', borderRadius: 4, marginBottom: 24, textTransform: 'uppercase' }}>
          ✦ Start Your Journey
        </div>
        <h2 style={{ fontSize: 'clamp(40px,6.5vw,80px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, marginBottom: 20, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
          {mode === 'cosmetics' ? 'YOUR BEST SKIN' : 'YOUR BEST HEALTH'}<br />
          <span style={{ color: theme.primary }}>STARTS TODAY.</span>
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.85 }}>
          {mode === 'cosmetics'
            ? 'Discover skincare that works with your skin, not against it. Made with love, backed by science.'
            : 'Give your body the nutrition it deserves. Clinical-grade supplements for a healthier you.'}
        </p>
        <Link href="/shop"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme.primary, color: '#fff', padding: '15px 32px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: `0 4px 20px rgba(${theme.primaryRgb},0.4)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.5)`; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 4px 20px rgba(${theme.primaryRgb},0.4)`; }}
        >
          EXPLORE ALL PRODUCTS →
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginTop: 36 }}>
          {['Free Delivery', 'Natural Ingredients', 'Secure Payment', 'Easy Returns'].map((t) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, display: 'inline-block' }} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflow: 'hidden' }}>
      <HeroSection />
      <OffersBanner />
      <MarqueeBelt />
      <TrustBar />
      <ProductsSection />
      <CategoryBanner />
      <AllProductsPreview />
      <WhySection />
      <StatsBar />
      <CTASection />

      <style>{`
        @keyframes mq-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mq-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        @media (max-width: 960px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .cat-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 420px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
