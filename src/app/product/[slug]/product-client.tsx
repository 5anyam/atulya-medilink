'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Star, ShieldCheck, Truck, Check, RotateCcw,
  ChevronRight, Package, Zap
} from 'lucide-react';
import { StaticProduct } from '../../../../lib/products-data';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';
import { useBrand } from '../../../../lib/brand-context';

const ProductReviews = dynamic(() => import('../../../../components/ProductReviews'), { ssr: false });
const ProductFAQ = dynamic(() => import('../../../../components/ProductFaq'), { ssr: false });

function StarRating({ rating }: { rating: number }) {
  const { theme } = useBrand();
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} style={{ width: 14, height: 14, fill: i <= Math.round(rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(rating) ? theme.primary : '#e5e7eb' }} />
      ))}
    </div>
  );
}

function ImageGallery({ images, bgLight, border, primaryRgb }: { images: string[]; bgLight: string; border: string; primaryRgb: string }) {
  const [main, setMain] = useState(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', aspectRatio: '1', background: bgLight, overflow: 'hidden', border: `1px solid ${border}`, borderRadius: 14, boxShadow: `0 4px 24px rgba(${primaryRgb},0.1)` }}>
        <Image
          src={images[main]}
          alt="Product"
          fill
          style={{ objectFit: 'contain', padding: 24, transition: 'opacity 0.3s' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setMain(i)}
              style={{
                position: 'relative', flexShrink: 0, width: 72, height: 72,
                border: `2px solid ${i === main ? `rgba(${primaryRgb},0.6)` : '#e5e7eb'}`,
                borderRadius: 8,
                overflow: 'hidden', opacity: i === main ? 1 : 0.55,
                cursor: 'pointer', background: bgLight, padding: 0,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              <Image src={src} alt="" fill style={{ objectFit: 'contain', padding: 6 }} sizes="72px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TABS = ['Benefits', 'Ingredients', 'How to Use', 'FAQs'];

function Tabs({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  const [active, setActive] = useState(0);

  return (
    <div style={{ marginTop: 40, borderTop: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', overflowX: 'auto', gap: 2 }}>
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: '12px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer',
              background: i === active ? theme.primary : 'transparent',
              color: i === active ? '#fff' : '#9ca3af',
              border: 'none', borderRadius: i === active ? '6px 6px 0 0' : 0,
              transition: 'background 0.2s, color 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        {active === 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.benefits.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 20, height: 20, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check style={{ width: 10, height: 10, color: theme.primary }} />
                </span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.65 }}>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {active === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {product.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                <div style={{ minWidth: 72, textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: theme.primary, lineHeight: 1.1 }}>{ing.dose}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 3 }}>{ing.name}</p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{ing.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {active === 2 && (
          <div>
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: '16px 20px', marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.8 }}>{product.howToUse}</p>
            </div>
            <div style={{ padding: '12px 16px', background: theme.bgLight, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: theme.primaryDark, fontWeight: 600 }}>
                Always consult your physician before use. If any adverse reaction occurs, discontinue immediately.
              </p>
            </div>
          </div>
        )}
        {active === 3 && (
          <ProductFAQ productSlug={product.slug} productName={product.name} />
        )}
      </div>
    </div>
  );
}

function RelatedCard({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(${theme.primaryRgb},0.12)`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: 16 }} sizes="300px" />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, marginBottom: 4 }}>{product.category}</p>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.2 }}>{product.name}</h4>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>₹{product.price.toLocaleString('en-IN')}</span>
          {product.regularPrice > product.price && (
            <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProductClient({ product, relatedProducts = [] }: { product: StaticProduct; relatedProducts?: StaticProduct[] }) {
  const { theme } = useBrand();
  const router = useRouter();
  const { addToCart } = useCart();
  const reviewsRef = useRef<HTMLDivElement>(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [selectedSize, setSelectedSize] = useState(0);

  const discount = product.regularPrice > product.price
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;


  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart({ id: product.id, name: product.name, price: product.price.toString(), regular_price: product.regularPrice.toString(), images: product.images.map((src) => ({ src })) });
    toast({ title: 'Added to Cart', description: `${product.shortName} added to your cart.` });
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    addToCart({ id: product.id, name: product.name, price: product.price.toString(), regular_price: product.regularPrice.toString(), images: product.images.map((src) => ({ src })) });
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 120 }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 32px' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = theme.primary)} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = theme.primary)} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Products</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span style={{ color: '#374151' }}>{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Main layout */}
      <div className="product-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px' }}>
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 60px' }}>

          {/* LEFT: Images */}
          <div className="product-image-sticky" style={{ position: 'sticky', top: 24, alignSelf: 'start' }}>
            <ImageGallery images={product.images} bgLight={theme.bgLight} border={theme.border} primaryRgb={theme.primaryRgb} />
          </div>

          {/* RIGHT: Info */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              <span style={{ background: theme.bgLight, color: theme.primary, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', border: `1px solid ${theme.border}`, borderRadius: 4 }}>
                {product.category}
              </span>
              {product.badge && (
                <span style={{ background: theme.primary, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4 }}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: '#111', color: '#fff', fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 4 }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1.05, marginBottom: 14, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <button
              onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 12, color: '#9ca3af', borderBottom: '1px solid #e5e7eb' }}>
                {product.rating.toFixed(1)} ({product.reviewCount} Reviews)
              </span>
            </button>

            {/* Tagline */}
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>{product.tagline}</p>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>
                  SIZE / QUANTITY
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(i)}
                      style={{
                        padding: '8px 18px',
                        border: `1.5px solid ${i === selectedSize ? theme.primary : '#e5e7eb'}`,
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: i === selectedSize ? 700 : 500,
                        color: i === selectedSize ? theme.primary : '#6b7280',
                        background: i === selectedSize ? theme.bgLight : '#fff',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Key benefits */}
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {product.benefits.slice(0, 4).map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 18, height: 18, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Check style={{ width: 9, height: 9, color: theme.primary }} />
                  </span>
                  <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{b}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: 42, fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.02em' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.regularPrice > product.price && (
                <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{
                  flex: 1, padding: '14px 20px', background: '#fff', color: '#111',
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: isAddingToCart ? 'not-allowed' : 'pointer', opacity: isAddingToCart ? 0.7 : 1,
                  transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => { if (!isAddingToCart) { (e.currentTarget as HTMLElement).style.borderColor = theme.primary; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
              >
                {isAddingToCart ? 'ADDED ✓' : 'ADD TO CART'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                style={{
                  flex: 1, padding: '14px 20px', background: theme.primary, color: '#fff',
                  border: 'none', borderRadius: 10,
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: isBuyingNow ? 'not-allowed' : 'pointer', opacity: isBuyingNow ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                  boxShadow: `0 4px 16px rgba(${theme.primaryRgb},0.35)`,
                }}
                onMouseEnter={e => { if (!isBuyingNow) { (e.currentTarget as HTMLElement).style.background = theme.primaryDark; }}}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = theme.primary; }}
              >
                <Zap style={{ width: 14, height: 14 }} />
                {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
              </button>
            </div>

            {/* Delivery note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', marginBottom: 20, padding: '10px 14px', background: theme.bgLight, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
              <Truck style={{ width: 15, height: 15, color: theme.primary, flexShrink: 0 }} />
              <span><strong>Free delivery</strong> · Dispatched within 24 hours · Pan-India</span>
            </div>

            {/* Trust Grid */}
            <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { icon: ShieldCheck, title: '100% Genuine', sub: 'Certified authentic' },
                { icon: RotateCcw, title: 'Easy Returns', sub: '7-day return policy' },
                { icon: Package, title: 'Safe Packaging', sub: 'Tamper-proof delivery' },
                { icon: Truck, title: 'Pan-India Delivery', sub: '3–5 business days' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8 }}>
                  <item.icon style={{ width: 14, height: 14, color: theme.primary, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111', marginBottom: 1 }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Tabs product={product} />
          </div>
        </div>

        {/* Reviews */}
        <div ref={reviewsRef} style={{ marginTop: 80, scrollMarginTop: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, display: 'block', marginBottom: 12 }}>✦ Verified Reviews</span>
            <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              WHAT CUSTOMERS<br /><span style={{ color: theme.primary }}>ARE SAYING.</span>
            </h2>
          </div>
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, display: 'block', marginBottom: 12 }}>✦ You May Also Like</span>
              <h2 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
                MORE FROM<br /><span style={{ color: theme.primary }}>{product.type === 'cosmetics' ? 'COSMETICS.' : 'NUTRACEUTICALS.'}</span>
              </h2>
            </div>
            <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
              {relatedProducts.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <div className="mobile-cta-outer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '10px 12px', zIndex: 500, boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', display: 'none' }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto' }}>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{ flex: '0 0 auto', padding: '13px 14px', background: '#fff', color: '#111', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {isAddingToCart ? '✓ ADDED' : 'ADD TO CART'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            style={{ flex: 1, background: theme.primary, color: '#fff', padding: '13px 12px', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', boxShadow: `0 4px 14px rgba(${theme.primaryRgb},0.3)`, minWidth: 0 }}
          >
            <Zap style={{ width: 13, height: 13, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {isBuyingNow ? 'PROCESSING...' : `BUY NOW — ₹${product.price.toLocaleString('en-IN')}`}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-cta-outer { display: block !important; }
          .product-container { padding: 16px 14px 100px !important; }
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .product-image-sticky { position: relative !important; top: auto !important; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr !important; }
          .product-container { padding: 12px 12px 100px !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
