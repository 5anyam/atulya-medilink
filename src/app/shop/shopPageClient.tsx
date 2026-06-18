'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { StaticProduct } from '../../../lib/products-data';
import { Star, ChevronRight, Sparkles, Pill, Leaf } from 'lucide-react';
import { useBrand, BrandMode } from '../../../lib/brand-context';
import Categories from '../../../components/Categories';


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

      {/* Type toggle */}
      <div style={{ background: '#fff', borderBottom: `3px solid ${theme.primary}`, padding: '14px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', background: '#f4f4f5', borderRadius: 10, padding: 4, gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {([['all', 'All Products', null], ['cosmetics', 'Cosmetics', Sparkles], ['nutraceuticals', 'Nutraceuticals', Pill], ['ayurveda', 'Ayurveda', Leaf]] as [string, string, React.ElementType | null][]).map(([val, label, Icon]) => {
            const isActive = activeType === val;
            const activeBg = val === 'cosmetics' ? '#ff5f1f' : val === 'nutraceuticals' ? '#0d9488' : val === 'ayurveda' ? '#008000' : theme.primary;
            return (
              <button
                key={val}
                onClick={() => { setActiveType(val as typeof activeType); setSelectedCategory(''); }}
                style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 7, border: 'none', cursor: 'pointer', background: isActive ? activeBg : 'transparent', color: isActive ? '#fff' : '#6b7280', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 6, transform: isActive ? 'scale(1.04)' : 'scale(1)' }}
              >
                {Icon && <Icon size={12} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

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
        @media (max-width: 900px) {
          .shop-grid { grid-template-columns: 1fr 1fr !important; }
          .shop-inner { padding: 28px 20px !important; }
        }
        @media (max-width: 480px) {
          .shop-grid { grid-template-columns: 1fr 1fr !important; }
          .shop-inner { padding: 20px 16px !important; }
        }
        @media (max-width: 360px) {
          .shop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
