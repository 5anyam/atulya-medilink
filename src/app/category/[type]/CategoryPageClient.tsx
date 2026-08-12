'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import { StaticProduct } from '../../../../lib/products-data';
import { useBrand } from '../../../../lib/brand-context';
import BannerCarousel, { useValidBanners } from '../../../../components/BannerCarousel';
import { bannerCandidates, legacyBanner } from '../../../../lib/banners';
import { isBogoProduct, BOGO_SHORT } from '../../../../lib/offers';

type CatType = 'cosmetics' | 'nutraceuticals' | 'ayurveda';

function ProductCard({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  const discount = product.regularPrice > product.price
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px rgba(${theme.primaryRgb},0.15)`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: '20px' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: theme.primary, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>{discount}% OFF</span>
        )}
      </div>
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.25 }}>{product.name}</h3>
        {isBogoProduct(product) && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', background: '#fff4ef', border: '1px solid #ff5f1f', color: '#c2410c', fontSize: 9, fontWeight: 800, letterSpacing: '0.04em', padding: '2px 7px', borderRadius: 999, marginBottom: 8 }}>🎁 {BOGO_SHORT}</span>
        )}
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} style={{ width: 12, height: 12, fill: i <= Math.round(product.rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(product.rating) ? theme.primary : '#e5e7eb' }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>({product.reviewCount})</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
            {product.regularPrice > product.price && (
              <span style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <div
            style={{ background: theme.primary, color: '#fff', textAlign: 'center', padding: '11px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            VIEW DETAILS <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPageClient({ parentType, label, eyebrow, tagline, products }: { parentType: CatType; label: string; eyebrow: string; tagline: string; products: StaticProduct[] }) {
  const { theme, setMode } = useBrand();
  const cfg = { label, eyebrow, tagline };
  const banners = useValidBanners(bannerCandidates(`shop-${parentType}`), [legacyBanner(`shop-${parentType}`)]);

  // Colour the whole page in the parent category's theme.
  useEffect(() => {
    setMode(parentType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentType]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* ── Category banner(s) ── */}
      <BannerCarousel images={banners} alt={cfg.label} />

      {/* ── Heading ── */}
      <div style={{ background: '#fff', borderBottom: `3px solid ${theme.primary}` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>
          <nav style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#374151' }}>{cfg.label}</span>
          </nav>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 8 }}>
            ✦ {cfg.eyebrow}
          </span>
          <h1 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1.05, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            {cfg.label}
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginTop: 10, maxWidth: 560, lineHeight: 1.6 }}>{cfg.tagline}</p>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="cat-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 24 }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>No products in this category yet.</p>
            <Link href="/shop" style={{ background: theme.primary, color: '#fff', padding: '12px 28px', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              BROWSE ALL PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .cat-grid { grid-template-columns: 1fr 1fr !important; } .cat-inner { padding: 28px 20px !important; } }
        @media (max-width: 480px) { .cat-grid { grid-template-columns: 1fr 1fr !important; } .cat-inner { padding: 20px 16px !important; } }
        @media (max-width: 360px) { .cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
