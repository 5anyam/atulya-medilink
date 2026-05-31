'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBrand } from '../../lib/brand-context';
import { StaticProduct } from '../../lib/products-data';
import HeroCarousel from '../../components/HeroCarousel';
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

function HeroSection({ products }: { products: StaticProduct[] }) {
  const { theme, mode } = useBrand();

  const heroData = {
    cosmetics: {
      productSlug: 'atulya-vitamin-c-face-serum',
      eyebrow: 'Natural Cosmetics',
      accent: '15%',
      line1: 'VIT C BRIGHTENING',
      line2: 'FACE SERUM',
      claim: 'FADES DARK SPOTS IN 4 WEEKS',
      claimSub: 'TO REVEAL YOUR NATURAL GLOW',
      pills: ['No Parabens', 'Dermatologist Tested', 'All Skin Types'],
      ctaHref: '/shop?type=cosmetics',
    },
    nutraceuticals: {
      productSlug: 'atulya-vitamin-e-400-softgel',
      eyebrow: 'Clinical Nutraceuticals',
      accent: '400 IU',
      line1: 'NATURAL VITAMIN E',
      line2: 'SOFTGEL CAPSULES',
      claim: 'NOURISHES SKIN, HAIR & IMMUNITY',
      claimSub: 'POWERFUL ANTIOXIDANT — DAILY USE',
      pills: ['GMP Certified', 'Third-Party Tested', 'Daily Use Safe'],
      ctaHref: '/shop?type=nutraceuticals',
    },
  }[mode];

  const heroProduct = products.find(p => p.slug === heroData.productSlug) || products.find(p => p.type === mode) || products[0];

  const STATS = [
    { n: '5,000+', l: 'Happy Customers' },
    { n: '50+', l: 'Products' },
    { n: '4.7 ★', l: 'Avg Rating' },
    { n: 'Since 2005', l: 'Est. Delhi' },
    { n: 'Pan-India', l: 'Delivery' },
  ];

  return (
    <section style={{ background: '#fff', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Decorative circles — scattered */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 340, height: 340, borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.07)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-8%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.05)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '10%', right: '2%', width: 150, height: 150, borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.08)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '14%', right: '26%', width: 80, height: 80, borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.06)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '52%', left: '38%', width: 50, height: 50, borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.05)`, pointerEvents: 'none', zIndex: 0 }} />

      {/* Main grid */}
      <div className="hero-grid" style={{ maxWidth: 1320, margin: '0 auto', width: '100%', padding: '64px 48px 56px', display: 'grid', gridTemplateColumns: '0.92fr 1.08fr', gap: 56, alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* LEFT — Large product image */}
        <div className="hero-img-col" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {/* Soft circle behind product */}
          <div style={{ position: 'absolute', width: '78%', aspectRatio: '1', borderRadius: '50%', background: `rgba(${theme.primaryRgb},0.09)`, zIndex: 0 }} />
          <Link href={`/product/${heroProduct.slug}`} style={{ textDecoration: 'none', position: 'relative', zIndex: 1, display: 'block', width: '100%', maxWidth: 500 }}>
            <Image
              src={heroProduct.images[0]}
              alt={heroProduct.name}
              width={500}
              height={500}
              priority
              style={{ objectFit: 'contain', width: '100%', height: 'auto', filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.13)) drop-shadow(0 4px 12px rgba(0,0,0,0.07))', transition: 'transform 0.4s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'none')}
            />
          </Link>
        </div>

        {/* RIGHT — Text */}
        <div className="hero-text-col">

          {/* Eyebrow */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: theme.primary, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 22, borderBottom: `2px solid ${theme.primary}`, paddingBottom: 4 }}>
            ✦ {heroData.eyebrow}
          </div>

          {/* Headline — foxtale style: large accent number + product name */}
          <h1 style={{ fontFamily: "'Plus Jakarta Sans','Inter',sans-serif", marginBottom: 18, lineHeight: 0.9 }}>
            <span style={{ display: 'inline', fontSize: 'clamp(60px,8vw,108px)', fontWeight: 900, color: theme.primary, letterSpacing: '-0.04em' }}>
              {heroData.accent}&nbsp;
            </span>
            <span style={{ display: 'inline', fontSize: 'clamp(36px,4vw,62px)', fontWeight: 900, color: '#111', letterSpacing: '-0.025em' }}>
              {heroData.line1}
            </span>
            <span style={{ display: 'block', fontSize: 'clamp(36px,4vw,62px)', fontWeight: 900, color: '#111', letterSpacing: '-0.025em', marginTop: 4 }}>
              {heroData.line2}
            </span>
          </h1>

          {/* Claim */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 'clamp(14px,1.6vw,20px)', fontWeight: 800, color: '#111', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: 1.25, marginBottom: 4 }}>
              {heroData.claim}
            </p>
            <p style={{ fontSize: 'clamp(12px,1.3vw,16px)', fontWeight: 700, color: '#6b7280', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {heroData.claimSub}
            </p>
          </div>

          {/* Pipe-separated feature pills — exactly like foxtale */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0, marginBottom: 36, rowGap: 8 }}>
            {heroData.pills.map((pill, i) => (
              <React.Fragment key={pill}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#374151', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  {pill}
                </span>
                {i < heroData.pills.length - 1 && (
                  <span style={{ margin: '0 14px', color: theme.primary, fontWeight: 900, fontSize: 18, lineHeight: 1 }}>|</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* CTA — dark button like foxtale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href={heroData.ctaHref}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#111', color: '#fff', padding: '17px 44px', borderRadius: 4, fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s, transform 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = theme.primary; el.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#111'; el.style.transform = 'none'; }}
            >
              EXPLORE NOW <ChevronRight size={15} />
            </Link>
            <Link
              href="/shop"
              style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #e5e7eb', paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = theme.primary; el.style.borderColor = theme.primary; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#6b7280'; el.style.borderColor = '#e5e7eb'; }}
            >
              View All Products
            </Link>
          </div>

          {/* Trust micro-text */}
          <p style={{ marginTop: 18, fontSize: 12, color: '#9ca3af', letterSpacing: '0.03em' }}>
            ★ 4.7 rated &nbsp;·&nbsp; 5,000+ customers &nbsp;·&nbsp; Free delivery above ₹499
          </p>
        </div>
      </div>

      {/* Stats strip at bottom */}
      <div className="hero-stats-strip" style={{ borderTop: '1px solid #f0f0f0', background: `rgba(${theme.primaryRgb},0.03)`, padding: '18px 48px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {STATS.map(({ n, l }, i) => (
            <React.Fragment key={l}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 19, fontWeight: 900, color: theme.primary, lineHeight: 1, marginBottom: 3 }}>{n}</p>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9ca3af' }}>{l}</p>
              </div>
              {i < STATS.length - 1 && <div className="stat-div" style={{ width: 1, height: 28, background: '#e5e7eb' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 40px 24px 36px !important; gap: 32px !important; }
          .hero-img-col { max-width: 360px; margin: 0 auto; }
          .hero-text-col { text-align: center; }
          .hero-text-col div[style*="display: flex"] { justify-content: center; }
          .hero-stats-strip { padding: 14px 20px !important; }
        }
        @media (max-width: 560px) {
          .stat-div { display: none !important; }
          .hero-stats-strip { padding: 12px 16px !important; }
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

function ProductsSection({ products }: { products: StaticProduct[] }) {
  const { theme, mode } = useBrand();
  const ref = useReveal();
  const products4 = products.filter(p => p.type === mode).slice(0, 4);

  return (
    <section className="home-section" style={{ padding: '80px 0', background: '#fafafa' }} id="products">
      <div className="section-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

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
          {products4.map(p => <ProductCard key={p.id} product={p} />)}
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
          className="cat-panel"
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
          className="cat-panel"
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

function AllProductsPreview({ products }: { products: StaticProduct[] }) {
  const { mode } = useBrand();
  const ref = useReveal();
  const otherMode = mode === 'cosmetics' ? 'nutraceuticals' : 'cosmetics';
  const otherProducts = products.filter(p => p.type === otherMode).slice(0, 4);

  return (
    <section className="home-section" style={{ padding: '80px 0', background: '#fff' }}>
      <div className="section-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
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
      <div className="why-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
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
            {i > 0 && <div className="stats-bar-divider" style={{ width: 1, height: 48, background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
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
    <section className="cta-section" style={{ background: '#0f0f0f', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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

export default function Homepage({ products }: { products: StaticProduct[] }) {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflow: 'hidden' }}>
      <HeroCarousel />
      <OffersBanner />
      <MarqueeBelt />
      <TrustBar />
      <ProductsSection products={products} />
      <CategoryBanner />
      <AllProductsPreview products={products} />
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
          .cat-panel { padding: 40px 28px !important; }
          .home-section { padding: 56px 0 !important; }
          .section-inner { padding: 0 20px !important; }
          .why-inner { padding: 56px 20px !important; }
        }
        @media (max-width: 560px) {
          .products-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .cat-panel { padding: 32px 20px !important; }
          .stats-bar-divider { display: none !important; }
          .cta-section { padding: 52px 20px !important; }
          .home-section { padding: 44px 0 !important; }
          .section-inner { padding: 0 16px !important; }
          .why-inner { padding: 44px 16px !important; }
        }
        @media (max-width: 420px) {
          .products-grid { grid-template-columns: 1fr !important; }
          .cat-panel { padding: 28px 16px !important; }
        }
      `}</style>
    </div>
  );
}
