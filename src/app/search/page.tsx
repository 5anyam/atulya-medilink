'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS } from '../../../lib/products-data';
import { Star } from 'lucide-react';
import { useBrand } from '../../../lib/brand-context';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const { theme } = useBrand();

  const results = useMemo(() => {
    if (!query) return PRODUCTS;
    const q = query.toLowerCase();
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-500 mb-6 text-sm">
        {query ? (
          <>Showing <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for &quot;<strong>{query}</strong>&quot;</>
        ) : (
          <>Showing all products</>
        )}
      </p>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No products found for &quot;{query}&quot;.</p>
          <Link href="/shop" className="text-sm font-semibold underline" style={{ color: theme.primary }}>
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {results.map(p => {
            const discount = p.regularPrice > p.price
              ? Math.round(((p.regularPrice - p.price) / p.regularPrice) * 100)
              : 0;
            return (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight }}>
                  <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'contain', padding: 16 }} sizes="(max-width: 640px) 50vw, 25vw" />
                  {discount > 0 && (
                    <span style={{ position: 'absolute', top: 8, right: 8, background: '#111', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4 }}>{discount}% OFF</span>
                  )}
                  {p.badge && (
                    <span style={{ position: 'absolute', top: 8, left: 8, background: theme.primary, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase' }}>{p.badge}</span>
                  )}
                </div>
                <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: theme.primary, marginBottom: 4, fontWeight: 600 }}>{p.category}</p>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 6, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} style={{ width: 10, height: 10, fill: i <= Math.round(p.rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(p.rating) ? theme.primary : '#e5e7eb' }} />
                    ))}
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>({p.reviewCount})</span>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {p.regularPrice > p.price && (
                      <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>₹{p.regularPrice.toLocaleString('en-IN')}</span>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-8 text-gray-500 text-sm">Loading results…</div>}>
      <SearchResults />
    </Suspense>
  );
}
