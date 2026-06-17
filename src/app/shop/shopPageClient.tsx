'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { StaticProduct } from '../../../lib/products-data';
import { Star, ChevronRight, Sparkles, Pill, Leaf } from 'lucide-react';
import { useBrand, BrandMode } from '../../../lib/brand-context';
import Categories from '../../../components/Categories';

const HERO_BANNERS: Record<string, string> = {
  all: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/Shop-Website-1920X700.jpg-1-scaled.jpeg',
  cosmetics: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/gLUTATHIONE-rICE-WATER-FACE-WASH.jpg.jpeg',
  nutraceuticals: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/Shop-Website-1920X700.jpg-1-scaled.jpeg',
  ayurveda: 'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/2026/06/Shop-Website-1920X700-Shilajit.jpg-2-scaled.jpeg',
};

interface Props {
  products: StaticProduct[];
}

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
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: '20px', transition: 'transform 0.5s' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        {product.badge && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: theme.primary, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', padding: '4px 10px', borderRadius: 4, textTransform: 'uppercase' }}>{product.badge}</span>
        )}
        {discount > 0 && (
          <span style={{ position: 'absolute', top: 12, right: 12, background: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>{discount}% OFF</span>
        )}
      </div>
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.primary, marginBottom: 6, fontWeight: 600 }}>{product.category}</p>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.25 }}>{product.name}</h3>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.tagline}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
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
            style={{ background: theme.primary, color: '#fff', textAlign: 'center', padding: '11px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 8, transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = theme.primaryDark)}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = theme.primary)}
          >
            VIEW DETAILS <ChevronRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPageClient({ products }: Props) {
  const { theme, mode, setMode } = useBrand();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'cosmetics' | 'nutraceuticals' | 'ayurveda'>('all');
  const [bannerKey, setBannerKey] = useState(0);

  const productCounts = {
    cosmetics: products.filter(p => p.type === 'cosmetics').length,
    nutraceuticals: products.filter(p => p.type === 'nutraceuticals').length,
    ayurveda: products.filter(p => p.type === 'ayurveda').length,
  };

  // Sync type filter with URL query param
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'cosmetics' || typeParam === 'nutraceuticals' || typeParam === 'ayurveda') {
      setActiveType(typeParam);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    const src = activeType === 'all' ? products : products.filter(p => p.type === activeType);
    return [...new Set(src.map(p => p.category))];
  }, [products, activeType]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeType !== 'all' && p.type !== activeType) return false;
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [products, searchTerm, selectedCategory, activeType]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* Hero with banner background */}
      <section className="shop-hero" style={{ position: 'relative', overflow: 'hidden', borderBottom: `3px solid ${theme.primary}` }}>
        {/* Banner image — fades in on category change */}
        <div
          key={bannerKey}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${HERO_BANNERS[activeType]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'bannerFadeIn 0.55s ease forwards',
          }}
        />
        {/* Dark overlay so text stays readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.68) 100%)' }} />
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '44px 44px', pointerEvents: 'none' }} />

        <div className="shop-hero-content" style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: theme.primary, display: 'block', marginBottom: 16 }}>✦ Atulya Medilink</span>
          <h1 className="shop-hero-title" style={{ fontWeight: 900, color: '#fff', lineHeight: 0.92, marginBottom: 16, letterSpacing: '-0.025em', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            {activeType === 'all' ? 'ALL' : activeType === 'cosmetics' ? 'COSMETICS' : activeType === 'nutraceuticals' ? 'SUPPLEMENTS' : 'AYURVEDA'}<br />
            <span style={{ color: theme.primary }}>PRODUCTS.</span>
          </h1>
          <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.75)', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.85 }}>
            Natural cosmetics and clinical-grade nutraceuticals — crafted for your health and beauty.
          </p>

          {/* Type toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: 4, gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {([['all', 'All Products', null], ['cosmetics', 'Cosmetics', Sparkles], ['nutraceuticals', 'Nutraceuticals', Pill], ['ayurveda', 'Ayurveda', Leaf]] as [string, string, React.ElementType | null][]).map(([val, label, Icon]) => {
              const isActive = activeType === val;
              const bg = val === 'cosmetics' ? '#ff5f1f' : val === 'nutraceuticals' ? '#0d9488' : val === 'ayurveda' ? '#008000' : '#fff';
              const textColor = isActive ? (val === 'all' ? '#111' : '#fff') : 'rgba(255,255,255,0.7)';
              return (
                <button
                  key={val}
                  onClick={() => { setActiveType(val as typeof activeType); setSelectedCategory(''); setBannerKey(k => k + 1); }}
                  style={{ padding: '8px 18px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none', cursor: 'pointer', background: isActive ? bg : 'transparent', color: textColor, transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 6, transform: isActive ? 'scale(1.04)' : 'scale(1)' }}
                >
                  {Icon && <Icon size={12} />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <Categories productCounts={productCounts} title="BROWSE BY CATEGORY" />

      <div className="shop-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '11px 16px 11px 40px', border: '1px solid #e5e7eb', background: '#fff', color: '#111', fontSize: 13, outline: 'none', borderRadius: 8, fontFamily: 'inherit' }}
              onFocus={e => (e.currentTarget.style.borderColor = theme.primary)}
              onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '11px 20px', border: '1px solid #e5e7eb', background: '#fff', color: '#111', fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', borderRadius: 8 }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 24 }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
        </p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px' }}>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>No products match your search.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory(''); setActiveType('all'); }}
              style={{ background: theme.primary, color: '#fff', padding: '12px 28px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="shop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bannerFadeIn {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        .shop-hero-content {
          padding: 64px 32px;
        }
        .shop-hero-title {
          font-size: clamp(48px, 8vw, 96px);
        }
        @media (max-width: 900px) {
          .shop-grid { grid-template-columns: 1fr 1fr !important; }
          .shop-inner { padding: 28px 20px !important; }
        }
        @media (max-width: 640px) {
          .shop-hero-content {
            padding: 36px 20px;
          }
          .shop-hero-title {
            font-size: clamp(30px, 9vw, 48px);
          }
        }
        @media (max-width: 480px) {
          .shop-grid { grid-template-columns: 1fr 1fr !important; }
          .shop-inner { padding: 20px 16px !important; }
          .shop-hero-content {
            padding: 28px 16px;
          }
          .shop-hero-title {
            font-size: 26px;
            letter-spacing: -0.01em;
          }
        }
        @media (max-width: 360px) {
          .shop-grid { grid-template-columns: 1fr !important; }
          .shop-hero-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
