'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight, Tag, Clock, Truck, ShieldCheck } from 'lucide-react';
import { StaticProduct } from '../../../lib/products-data';
import { useBrand } from '../../../lib/brand-context';

const OFFER_BANNERS = [
  { emoji: '🎁', title: 'Flat 30% OFF', sub: 'On all face serums', tag: 'Limited Time', color: '#fff7ed', accent: '#ea580c' },
  { emoji: '🚚', title: 'Free Delivery', sub: 'Orders above ₹499', tag: 'Always On', color: '#f0fdf4', accent: '#16a34a' },
  { emoji: '💊', title: 'Buy 2 Get 1', sub: 'On nutraceutical range', tag: 'This Week', color: '#f0f9ff', accent: '#0284c7' },
  { emoji: '✨', title: 'New Arrivals', sub: '15% off on first order', tag: 'New Users', color: '#fdf4ff', accent: '#9333ea' },
];

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  const { theme } = useBrand();
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} style={{ width: size, height: size, fill: i <= Math.round(rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(rating) ? theme.primary : '#e5e7eb' }} />
      ))}
    </div>
  );
}

function SaleProductCard({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  const discount = product.regularPrice > product.price
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;
  const saving = product.regularPrice - product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'transform 0.22s, box-shadow 0.22s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px rgba(${theme.primaryRgb},0.14)`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: 20, transition: 'transform 0.4s' }} sizes="(max-width: 600px) 50vw, 25vw"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.06)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'none')}
        />
        {discount > 0 && (
          <div style={{ position: 'absolute', top: 0, left: 0, background: theme.primary, color: '#fff', fontSize: 13, fontWeight: 900, padding: '10px 14px', borderBottomRightRadius: 12 }}>
            {discount}%<br /><span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.06em' }}>OFF</span>
          </div>
        )}
        {product.badge && (
          <span style={{ position: 'absolute', top: 10, right: 10, background: '#111', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
            {product.badge}
          </span>
        )}
      </div>

      <div style={{ padding: '16px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, marginBottom: 5 }}>{product.category}</p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: 11, color: '#9ca3af' }}>({product.reviewCount})</span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.regularPrice > product.price && (
              <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          {saving > 0 && (
            <p style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 12 }}>
              You save ₹{saving.toLocaleString('en-IN')}
            </p>
          )}
          <div style={{ background: theme.primary, color: '#fff', textAlign: 'center', padding: '11px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
          >
            GRAB THIS DEAL <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function OffersClient({ products }: { products: StaticProduct[] }) {
  const { theme } = useBrand();

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* Hero */}
      <section style={{ background: '#0f0f0f', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '2px solid #111' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(${theme.primaryRgb},0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(${theme.primaryRgb},0.06) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `rgba(${theme.primaryRgb},0.12)`, border: `1px solid rgba(${theme.primaryRgb},0.3)`, color: theme.primary, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', padding: '6px 14px', borderRadius: 4, marginBottom: 20, textTransform: 'uppercase' }}>
            🏷️ Exclusive Deals
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,80px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, marginBottom: 16, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            OFFERS &<br /><span style={{ color: theme.primary }}>DEALS.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Limited-time discounts on premium natural cosmetics and clinical-grade nutraceuticals.
          </p>
        </div>
      </section>

      {/* Offer banners */}
      <section style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="offer-banners" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {OFFER_BANNERS.map((b, i) => (
              <div key={i} style={{ padding: '24px 20px', borderRight: i < 3 ? '1px solid #f0f0f0' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, background: b.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{b.emoji}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{b.title}</p>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: b.color, color: b.accent, padding: '2px 6px', borderRadius: 3 }}>{b.tag}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: '#fff', borderBottom: '2px solid #111' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { icon: Tag, text: 'Up to 30% OFF on select products' },
              { icon: Truck, text: 'Free delivery above ₹499' },
              { icon: ShieldCheck, text: '100% genuine & certified' },
              { icon: Clock, text: 'Limited time offers' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, color: '#374151', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <t.icon style={{ width: 14, height: 14, color: theme.primary }} />
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Products Grid */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 44, textAlign: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ On Sale Now</span>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              {products.length > 0 ? `${products.length} DEALS` : 'COMING SOON'}<br />
              <span style={{ color: theme.primary }}>AVAILABLE.</span>
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="offers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {products.map(p => <SaleProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎁</div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 12 }}>New Offers Coming Soon</h3>
              <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 28 }}>Stay tuned for exclusive deals. Browse all our products meanwhile.</p>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: theme.primary, color: '#fff', padding: '14px 28px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
                BROWSE PRODUCTS →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: theme.primary, padding: '52px 24px', textAlign: 'center', borderTop: '2px solid #111' }}>
        <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 12, fontWeight: 600 }}>Don&apos;t miss out</p>
        <h2 style={{ fontSize: 'clamp(24px,4vw,48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
          Subscribe for Exclusive Offers
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: 440, margin: '0 auto 32px' }}>
          Get early access to sales, new launches and member-only discounts.
        </p>
        <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: theme.primary, padding: '14px 32px', borderRadius: 8, fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'transform 0.2s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'none')}
        >
          CONTACT US →
        </Link>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .offers-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .offer-banners { grid-template-columns: repeat(2, 1fr) !important; }
          .offer-banners > div:nth-child(2) { border-right: none !important; }
          .offer-banners > div { border-bottom: 1px solid #f0f0f0; }
          .offer-banners > div:nth-child(3), .offer-banners > div:nth-child(4) { border-bottom: none; }
        }
        @media (max-width: 640px) {
          .offers-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .offer-banners { grid-template-columns: 1fr !important; }
          .offer-banners > div { border-right: none !important; border-bottom: 1px solid #f0f0f0 !important; }
          .offer-banners > div:last-child { border-bottom: none !important; }
        }
        @media (max-width: 380px) {
          .offers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
