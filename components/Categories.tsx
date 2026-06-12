'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Pill, Leaf, ChevronRight } from 'lucide-react';

const BRAND_CATEGORIES = [
  {
    type: 'cosmetics',
    label: 'Cosmetics',
    description: 'Skincare, creams, foot care & personal care products',
    icon: Sparkles,
    color: '#ff5f1f',
    bg: '#fff8f5',
    href: '/shop?type=cosmetics',
  },
  {
    type: 'nutraceuticals',
    label: 'Nutraceuticals',
    description: 'Vitamins, capsules, omega & health supplements',
    icon: Pill,
    color: '#0d9488',
    bg: '#f0fdf9',
    href: '/shop?type=nutraceuticals',
  },
  {
    type: 'ayurveda',
    label: 'Ayurveda',
    description: 'Herbal products, natural oils & traditional formulations',
    icon: Leaf,
    color: '#008000',
    bg: '#f0fdf4',
    href: '/shop?type=ayurveda',
  },
];

interface CategoriesProps {
  /** Products from WooCommerce — used to show live count per category */
  productCounts?: Record<string, number>;
  title?: string;
}

export default function Categories({ productCounts, title = 'SHOP BY CATEGORY' }: CategoriesProps) {
  return (
    <section style={{ padding: '64px 0', background: '#faf7f2' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#0D9488', display: 'block', marginBottom: 10 }}>
            ✦ Our Collections
          </span>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(36px,6vw,64px)', letterSpacing: '0.04em', color: '#0f1117', lineHeight: 1 }}>
            {title}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="categories-grid">
          {BRAND_CATEGORIES.map(({ type, label, description, icon: Icon, color, bg, href }) => {
            const count = productCounts?.[type];
            return (
              <Link
                key={type}
                href={href}
                style={{ textDecoration: 'none', display: 'block', background: '#fff', border: `3px solid #0f1117`, boxShadow: '5px 5px 0 #0f1117', padding: '36px 32px', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translate(-3px,-3px)'; el.style.boxShadow = '8px 8px 0 #0f1117'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '5px 5px 0 #0f1117'; }}
              >
                {/* Background accent */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: bg, opacity: 0.8 }} />

                {/* Icon */}
                <div style={{ width: 52, height: 52, background: bg, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  <Icon size={22} style={{ color }} />
                </div>

                {/* Text */}
                <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, letterSpacing: '0.06em', color: '#0f1117', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                  {label}
                </h3>
                <p style={{ fontSize: 12, color: 'rgba(15,17,23,0.55)', lineHeight: 1.7, marginBottom: 20, position: 'relative', zIndex: 1 }}>
                  {description}
                </p>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  {count !== undefined && (
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color, background: bg, border: `1.5px solid ${color}`, padding: '4px 10px' }}>
                      {count} product{count !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0f1117', marginLeft: 'auto' }}>
                    SHOP NOW <ChevronRight size={12} />
                  </span>
                </div>

                {/* Bottom color bar */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: color }} />
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .categories-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .categories-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
