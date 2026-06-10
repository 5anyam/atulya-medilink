'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { useBrand } from '../../../lib/brand-context';
import { StaticProduct } from '../../../lib/products-data';

interface Props {
  products: StaticProduct[];
  query: string;
}

export default function SearchClient({ products, query }: Props) {
  const { theme } = useBrand();

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 8 }}>Search Results</h1>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
        {query ? (
          <><strong style={{ color: '#111' }}>{products.length}</strong> result{products.length !== 1 ? 's' : ''} for &quot;<strong style={{ color: theme.primary }}>{query}</strong>&quot;</>
        ) : (
          <>Showing all <strong style={{ color: '#111' }}>{products.length}</strong> products</>
        )}
      </p>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 32px' }}>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>No products found for &quot;{query}&quot;.</p>
          <Link
            href="/shop"
            style={{ display: 'inline-block', padding: '12px 28px', background: theme.primary, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          {products.map(p => {
            const discount = p.regularPrice > p.price
              ? Math.round(((p.regularPrice - p.price) / p.regularPrice) * 100)
              : 0;
            const imgSrc = p.images?.[0] && p.images[0] !== '/placeholder.png'
              ? p.images[0]
              : null;

            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                style={{
                  textDecoration: 'none', display: 'flex', flexDirection: 'column',
                  background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12,
                  overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 10px 28px rgba(${theme.primaryRgb},0.14)`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
              >
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={p.name}
                      fill
                      style={{ objectFit: 'contain', padding: 16 }}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>No image</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <span style={{ position: 'absolute', top: 8, right: 8, background: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4 }}>
                      {discount}% OFF
                    </span>
                  )}
                  {p.badge && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: theme.primary, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase' }}>
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '12px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.primary, marginBottom: 4, fontWeight: 600 }}>
                    {p.category}
                  </p>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.name}
                  </h3>
                  {p.reviewCount > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} style={{ width: 10, height: 10, fill: i <= Math.round(p.rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(p.rating) ? theme.primary : '#e5e7eb' }} />
                      ))}
                      <span style={{ fontSize: 10, color: '#9ca3af' }}>({p.reviewCount})</span>
                    </div>
                  )}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    {p.regularPrice > p.price && (
                      <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                        ₹{p.regularPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
