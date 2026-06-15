'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBrand } from '../../lib/brand-context';
import { StaticProduct } from '../../lib/products-data';
import HeroCarousel from '../../components/HeroCarousel';
import Categories from '../../components/Categories';
import {
  Star, ChevronRight, Leaf, ShieldCheck, Truck, Award,
  FlaskConical, Heart, Package, BadgeCheck
} from 'lucide-react';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('visible'); },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
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
      className="product-card"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 14, overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px)'; el.style.boxShadow = `0 16px 36px rgba(${theme.primaryRgb},0.15)`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: 'contain', padding: '20px', transition: 'transform 0.5s' }}
          sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
        />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: theme.primary, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' }}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#1a1a1a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>
            {discount}% OFF
          </span>
        )}
      </div>

      <div style={{ padding: '18px 18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.primary, marginBottom: 6, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.tagline}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <StarRating rating={product.rating} size={13} />
          <span style={{ fontSize: 12, color: '#9ca3af' }}>({product.reviewCount})</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.regularPrice > product.price && (
              <span style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div
            style={{ background: theme.primary, color: '#fff', textAlign: 'center', padding: '12px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
          >
            VIEW PRODUCT <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── BEST SELLERS SECTION ─── */
function BestSellersSection({ products }: { products: StaticProduct[] }) {
  const { theme, mode } = useBrand();
  const ref = useReveal();
  const bestSellers = products.filter(p => p.badge === 'Best Seller').slice(0, 4);
  const fallback = products.filter(p => p.type === mode).slice(0, 4);
  const displayProducts = bestSellers.length >= 2 ? bestSellers : fallback;

  return (
    <section className="home-section" style={{ padding: '72px 0', background: '#fff' }} id="bestsellers">
      <div className="section-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div ref={ref} className="reveal" style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>
            ✦ Customer Favourites
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              BEST<br /><span style={{ color: theme.primary }}>SELLERS.</span>
            </h2>
            <Link href="/shop"
              style={{ background: '#111', color: '#fff', padding: '13px 26px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#111')}
            >
              VIEW ALL →
            </Link>
          </div>
        </div>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── OFFERS BANNER ─── */
function OffersBanner() {
  const { theme } = useBrand();

  const offers = [
    { icon: '🎁', title: 'UP TO 30% OFF', sub: 'Limited-period offers on selected products', tag: 'Limited Time' },
    { icon: '🚚', title: 'FREE DELIVERY', sub: 'On all orders above ₹499 — pan-India', tag: 'Always On' },
    { icon: '🔒', title: '100% AUTHENTIC', sub: 'GMP certified, cruelty-free & lab-tested', tag: 'Guaranteed' },
  ];

  return (
    <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {offers.map((offer, i) => (
            <div key={i} style={{ padding: '24px 28px', display: 'flex', alignItems: 'flex-start', gap: 14, borderRight: i < 2 ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{offer.icon}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{offer.title}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: theme.bgLight, color: theme.primary, padding: '2px 8px', borderRadius: 3, border: `1px solid ${theme.border}` }}>{offer.tag}</span>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{offer.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .offers-grid { grid-template-columns: 1fr !important; }
          .offers-grid > div { border-right: none !important; border-bottom: 1px solid #f0f0f0; padding: 18px 16px !important; }
          .offers-grid > div:last-child { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}

/* ─── MARQUEE BELT ─── */
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
      <div style={{ background: theme.primary, padding: '11px 0', overflow: 'hidden', borderBottom: '2px solid #111' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-fwd 22s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {line1.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#fff' }}>
                  {t} <span style={{ fontSize: 10, opacity: 0.5 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: '#111', padding: '11px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-rev 18s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {line2.map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '0 22px', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', color: theme.primary }}>
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

/* ─── TRUST BAR ─── */
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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px' }}>
        <div className="trust-items" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 32px', alignItems: 'center' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151' }}>
              <item.icon style={{ width: 15, height: 15, color: theme.primary }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SHOP BY CONCERN ─── */
const CONCERNS = [
  { label: 'Acne & Pimples', emoji: '🫧', color: '#fef3c7', accent: '#d97706', query: 'acne' },
  { label: 'Dry Skin', emoji: '💧', color: '#dbeafe', accent: '#2563eb', query: 'dry-skin' },
  { label: 'Oily Skin', emoji: '✨', color: '#d1fae5', accent: '#059669', query: 'oily-skin' },
  { label: 'Pigmentation', emoji: '🌗', color: '#ede9fe', accent: '#7c3aed', query: 'pigmentation' },
  { label: 'Sun Protection', emoji: '☀️', color: '#fff7ed', accent: '#ea580c', query: 'sun-protection' },
  { label: 'Hair Fall', emoji: '🌿', color: '#f0fdf4', accent: '#16a34a', query: 'hair-fall' },
  { label: 'Anti-Aging', emoji: '⏳', color: '#fdf2f8', accent: '#9d174d', query: 'anti-aging' },
];

function ShopByConcern() {
  const { theme } = useBrand();
  const ref = useReveal();

  return (
    <section style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '72px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ Find What You Need</span>
          <h2 style={{ fontSize: 'clamp(30px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            SHOP BY<br /><span style={{ color: theme.primary }}>CONCERN.</span>
          </h2>
        </div>

        <div className="concern-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14 }}>
          {CONCERNS.map((c) => (
            <Link
              key={c.label}
              href={`/shop?concern=${c.query}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="concern-card"
                style={{
                  background: c.color,
                  borderRadius: 16,
                  padding: '28px 12px 22px',
                  textAlign: 'center',
                  border: `1.5px solid transparent`,
                  transition: 'transform 0.22s, box-shadow 0.22s, border-color 0.22s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-5px)';
                  el.style.boxShadow = `0 12px 28px rgba(0,0,0,0.1)`;
                  el.style.borderColor = c.accent;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'none';
                  el.style.boxShadow = 'none';
                  el.style.borderColor = 'transparent';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>{c.emoji}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .concern-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .concern-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; }
          .concern-card { padding: 20px 8px 16px !important; }
          .concern-card .emoji { font-size: 28px !important; }
        }
        @media (max-width: 380px) {
          .concern-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── ALL PRODUCTS SECTION ─── */
function ProductsSection({ products }: { products: StaticProduct[] }) {
  const { theme, mode } = useBrand();
  const ref = useReveal();
  const displayProducts = products.filter(p => p.type === mode).slice(0, 8);

  return (
    <section className="home-section" style={{ padding: '72px 0', background: '#fafafa' }} id="products">
      <div className="section-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div ref={ref} className="reveal" style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>
            ✦ {mode === 'cosmetics' ? 'Skincare & Beauty' : 'Health & Wellness'}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <h2 style={{ fontSize: 'clamp(30px,5vw,60px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              {mode === 'cosmetics' ? 'TOP PICKS FOR' : 'BESTSELLING'}<br />
              <span style={{ color: theme.primary }}>{mode === 'cosmetics' ? 'YOUR SKIN.' : 'SUPPLEMENTS.'}</span>
            </h2>
            <Link href="/shop"
              style={{ background: '#111', color: '#fff', padding: '13px 26px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#111')}
            >
              VIEW ALL →
            </Link>
          </div>
        </div>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {displayProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── SOCIAL MEDIA VIDEOS ─── */
const SOCIAL_VIDEOS = [
  { src: '/video-1.mp4', label: 'Vitamin C Serum Results' },
  { src: '/video-2.mp4', label: 'Crack Heel Cream Before/After' },
  { src: '/video-3.mp4', label: 'Daily Skincare Routine' },
  { src: '/video-4.mp4', label: 'Customer Testimonial' },
];

function SocialVideosSection() {
  const { theme } = useBrand();
  const ref = useReveal();

  return (
    <section style={{ background: '#0f0f0f', padding: '72px 0', borderTop: '2px solid #111' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ Follow Us</span>
          <h2 style={{ fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#fff', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            AS SEEN ON<br /><span style={{ color: theme.primary }}>SOCIAL MEDIA.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginTop: 16, maxWidth: 480, margin: '16px auto 0' }}>
            Real results from real customers. Follow us on Instagram & YouTube for more.
          </p>
        </div>

        <div className="videos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {SOCIAL_VIDEOS.map((v, i) => (
            <div
              key={i}
              style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '9/16', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.25s, box-shadow 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = `0 20px 48px rgba(${theme.primaryRgb},0.25)`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
            >
              <video
                src={v.src}
                autoPlay
                muted
                loop
                playsInline
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)', zIndex: 1 }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px', zIndex: 2 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: theme.primary, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>@atulya_medilink</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{v.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <a
            href="https://www.instagram.com/atulya_medilink/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff', padding: '14px 32px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'opacity 0.2s, transform 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '0.85'; el.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.transform = 'none'; }}
          >
            📸 Follow on Instagram
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .videos-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .videos-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── WHY SECTION ─── */
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
    <section style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
      <div className="why-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ The Atulya Difference</span>
          <h2 style={{ fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            WHY CHOOSE<br /><span style={{ color: theme.primary }}>ATULYA?</span>
          </h2>
        </div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{ background: '#fafafa', borderRadius: 16, padding: '36px 28px', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s, transform 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.1)`; el.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}
            >
              <div style={{ width: 52, height: 52, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon style={{ width: 24, height: 24, color: theme.primary }} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 12, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BAR ─── */
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
      <div ref={ref} className="reveal" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 28 }}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="stats-bar-divider" style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 'clamp(40px,5vw,68px)', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.num}</span>
              <p style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginTop: 8, fontWeight: 500 }}>{s.label}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ─── CTA SECTION ─── */
function CTASection() {
  const { theme, mode } = useBrand();
  return (
    <section className="cta-section" style={{ background: '#0f0f0f', padding: '80px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: `radial-gradient(circle, rgba(${theme.primaryRgb},0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `rgba(${theme.primaryRgb},0.1)`, border: `1px solid rgba(${theme.primaryRgb},0.3)`, color: theme.primary, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', padding: '6px 14px', borderRadius: 4, marginBottom: 24, textTransform: 'uppercase' }}>
          ✦ Start Your Journey
        </div>
        <h2 style={{ fontSize: 'clamp(36px,6.5vw,80px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, marginBottom: 20, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
          {mode === 'cosmetics' ? 'YOUR BEST SKIN' : 'YOUR BEST HEALTH'}<br />
          <span style={{ color: theme.primary }}>STARTS TODAY.</span>
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.85 }}>
          {mode === 'cosmetics'
            ? 'Discover skincare that works with your skin, not against it. Made with love, backed by science.'
            : 'Give your body the nutrition it deserves. Clinical-grade supplements for a healthier you.'}
        </p>
        <Link href="/shop"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme.primary, color: '#fff', padding: '16px 36px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', boxShadow: `0 4px 20px rgba(${theme.primaryRgb},0.4)`, transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.5)`; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = `0 4px 20px rgba(${theme.primaryRgb},0.4)`; }}
        >
          EXPLORE ALL PRODUCTS →
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginTop: 36 }}>
          {['Free Delivery', 'Natural Ingredients', 'Secure Payment', 'Easy Returns'].map((t) => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary, display: 'inline-block' }} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOME PAGE ─── */
export default function Homepage({ products }: { products: StaticProduct[] }) {
  const productCounts = {
    cosmetics: products.filter(p => p.type === 'cosmetics').length,
    nutraceuticals: products.filter(p => p.type === 'nutraceuticals').length,
    ayurveda: products.filter(p => p.type === 'ayurveda').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Categories */}
      <Categories productCounts={productCounts} />

      {/* 3. Best Sellers */}
      <BestSellersSection products={products} />

      {/* 3. Offers Banner */}
      <OffersBanner />

      {/* 4. Marquee Belt */}
      <MarqueeBelt />

      {/* 5. Trust Bar */}
      <TrustBar />

      {/* 6. Shop by Concern */}
      <ShopByConcern />

      {/* 7. Products Section */}
      <ProductsSection products={products} />

      {/* 8. Social Media Videos */}
      <SocialVideosSection />

      {/* 9. Why Atulya */}
      <WhySection />

      {/* 10. Stats Bar */}
      <StatsBar />

      {/* 11. CTA */}
      <CTASection />

      <style>{`
        @keyframes mq-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes mq-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }

        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        /* Responsive grid overrides */
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .home-section { padding: 52px 0 !important; }
          .section-inner { padding: 0 16px !important; }
          .why-inner { padding: 52px 16px !important; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .stats-bar-divider { display: none !important; }
          .cta-section { padding: 52px 16px !important; }
          .home-section { padding: 40px 0 !important; }
          .section-inner { padding: 0 12px !important; }
          .why-inner { padding: 40px 12px !important; }
          .trust-items { gap: 10px 18px !important; }
          .product-card { border-radius: 10px !important; }
        }
        @media (max-width: 360px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
