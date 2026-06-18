'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Pill, Leaf } from 'lucide-react';
import { useBrand, BrandMode } from '../lib/brand-context';

const BRAND_CATEGORIES: {
  type: BrandMode;
  label: string;
  description: string;
  icon: React.FC<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  href: string;
}[] = [
  {
    type: 'cosmetics',
    label: 'Cosmetics',
    description: 'Skincare, creams & personal care',
    icon: Sparkles,
    color: '#ff5f1f',
    bg: '#fff8f5',
    href: '/shop?type=cosmetics',
  },
  {
    type: 'nutraceuticals',
    label: 'Nutraceuticals',
    description: 'Vitamins, capsules & health supplements',
    icon: Pill,
    color: '#0d9488',
    bg: '#f0fdf9',
    href: '/shop?type=nutraceuticals',
  },
  {
    type: 'ayurveda',
    label: 'Ayurveda',
    description: 'Herbal products & natural formulations',
    icon: Leaf,
    color: '#008000',
    bg: '#f0fdf4',
    href: '/shop?type=ayurveda',
  },
];

interface CategoriesProps {
  productCounts?: Record<string, number>;
  title?: string;
}

export default function Categories({ productCounts }: CategoriesProps) {
  // title prop accepted but not rendered in compact row layout
  const { mode, setMode } = useBrand();

  return (
    <section style={{ background: '#faf7f2', borderBottom: '1px solid #ece8e0' }} className="categories-section">
      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="categories-wrapper">

        <div className="categories-row" style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9ca3af', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Shop by:
          </span>

          {BRAND_CATEGORIES.map(({ type, label, description, icon: Icon, color, bg, href }) => {
            const count = productCounts?.[type];
            const active = mode === type;
            return (
              <Link
                key={type}
                href={href}
                onClick={() => setMode(type)}
                style={{ textDecoration: 'none', flexShrink: 0 }}
              >
                <div
                  className="cat-chip"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderRadius: 50,
                    border: `2px solid ${active ? color : '#e5e7eb'}`,
                    background: active ? bg : '#fff',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: active ? `0 2px 10px ${color}28` : '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.borderColor = color;
                      (e.currentTarget as HTMLElement).style.background = bg;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                      (e.currentTarget as HTMLElement).style.background = '#fff';
                    }
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: active ? color : bg, border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                    <Icon size={15} style={{ color: active ? '#fff' : color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: active ? color : '#111', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{label}</p>
                    <p className="cat-chip-sub" style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                      {count !== undefined ? `${count} products` : description}
                    </p>
                  </div>
                  {active && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .categories-row::-webkit-scrollbar { display: none; }
        .categories-row { -ms-overflow-style: none; scrollbar-width: none; }

        /* Desktop */
        .categories-section { padding: 24px 0; }
        .categories-wrapper { padding: 0 32px; }
        .cat-chip { padding: 10px 18px; }

        /* Mobile — bigger touch targets, tighter padding */
        @media (max-width: 639px) {
          .categories-section { padding: 0; }
          .categories-wrapper { padding: 0; }
          .categories-row { padding: 14px 16px; gap: 8px; }
          .cat-chip { padding: 9px 14px; }
          .cat-chip-sub { display: none; }
        }
      `}</style>
    </section>
  );
}
