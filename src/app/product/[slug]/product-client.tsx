'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Star, ShieldCheck, Truck, Check, RotateCcw,
  ChevronRight, Package, Zap, ZoomIn, ChevronDown
} from 'lucide-react';
import { StaticProduct } from '../../../../lib/products-data';
import { useCart } from '../../../../lib/cart';
import { toast } from '../../../../hooks/use-toast';
import { useBrand } from '../../../../lib/brand-context';

const ProductReviews = dynamic(() => import('../../../../components/ProductReviews'), { ssr: false });

function StarRating({ rating }: { rating: number }) {
  const { theme } = useBrand();
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: 16, height: 16, fill: i <= Math.round(rating) ? theme.primary : '#e5e7eb', color: i <= Math.round(rating) ? theme.primary : '#e5e7eb' }} />
      ))}
    </div>
  );
}

/* ─── IMAGE GALLERY WITH ZOOM ─── */
function ImageGallery({ images, bgLight, border, primaryRgb }: { images: string[]; bgLight: string; border: string; primaryRgb: string }) {
  const [main, setMain] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col gap-3 min-w-0 w-full">
      {/* Main image with zoom */}
      <div
        ref={imgRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: '1',
          maxHeight: 'min(80vw, 420px)',
          background: bgLight,
          border: `1px solid ${border}`,
          borderRadius: 16,
          boxShadow: `0 4px 24px rgba(${primaryRgb},0.1)`,
          cursor: zoomed ? 'zoom-out' : 'zoom-in',
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[main]}
          alt="Product"
          fill
          style={{
            objectFit: 'contain',
            padding: zoomed ? 0 : 20,
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: zoomed ? 'scale(2.2)' : 'scale(1)',
            transition: zoomed ? 'none' : 'transform 0.35s ease, padding 0.2s',
          }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {/* Zoom hint - desktop only */}
        {!zoomed && (
          <div className="hidden lg:flex absolute bottom-3 right-3 items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded-md" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
            <ZoomIn size={12} /> Hover to zoom
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 min-w-0 w-full" style={{ scrollbarWidth: 'none' }}>
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setMain(i)}
              className="flex-shrink-0 relative overflow-hidden"
              style={{
                width: 68, height: 68,
                border: `2px solid ${i === main ? `rgba(${primaryRgb},0.8)` : '#e5e7eb'}`,
                borderRadius: 10,
                opacity: i === main ? 1 : 0.6,
                cursor: 'pointer', background: bgLight, padding: 0,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              <Image src={src} alt="" fill style={{ objectFit: 'contain', padding: 6 }} sizes="68px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ACCORDION SECTION ─── */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const { theme } = useBrand();

  return (
    <div style={{ borderTop: '1px solid #f0f0f0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>{title}</span>
        <ChevronDown size={18} style={{ color: theme.primary, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ paddingBottom: 20 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function RelatedCard({ product }: { product: StaticProduct }) {
  const { theme } = useBrand();
  return (
    <Link
      href={`/product/${product.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(${theme.primaryRgb},0.12)`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ position: 'relative', aspectRatio: '1', background: theme.bgLight, overflow: 'hidden' }}>
        <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'contain', padding: 16, transition: 'transform 0.3s' }} sizes="300px"
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.06)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'none')}
        />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.primary, fontWeight: 600, marginBottom: 4 }}>{product.category}</p>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.25 }}>{product.name}</h4>
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
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 14px' }} className="lg:!px-8">
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#9ca3af' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = theme.primary)} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => (e.currentTarget.style.color = theme.primary)} onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>Products</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="breadcrumb-product-name" style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{product.shortName}</span>
          </nav>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 14px 100px' }} className="lg:!p-[40px_32px_120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">

          {/* LEFT: Images */}
          <div className="w-full min-w-0 lg:sticky lg:top-6 lg:self-start">
            <ImageGallery images={product.images} bgLight={theme.bgLight} border={theme.border} primaryRgb={theme.primaryRgb} />
          </div>

          {/* RIGHT: Info */}
          <div>
            {/* Category + Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <span style={{ background: theme.bgLight, color: theme.primary, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '5px 12px', border: `1px solid ${theme.border}`, borderRadius: 4 }}>
                {product.category}
              </span>
              {product.badge && (
                <span style={{ background: theme.primary, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4 }}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: '#111', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 4 }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 style={{ fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1.1, marginBottom: 14, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <button
              onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <StarRating rating={product.rating} />
              <span style={{ fontSize: 13, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>
                {product.rating.toFixed(1)} · {product.reviewCount} Reviews
              </span>
            </button>

            {/* Tagline */}
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 20 }}>{product.tagline}</p>

            {/* ── PRICE (prominent) ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '16px 20px', background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.primary, marginBottom: 4 }}>PRICE</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontSize: 44, fontWeight: 900, color: '#111', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.regularPrice > product.price && (
                    <span style={{ fontSize: 18, color: '#9ca3af', textDecoration: 'line-through' }}>₹{product.regularPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <div style={{ marginLeft: 'auto', background: '#111', color: '#fff', fontSize: 16, fontWeight: 900, padding: '8px 14px', borderRadius: 8, textAlign: 'center', lineHeight: 1.2 }}>
                  {discount}%<br /><span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em' }}>OFF</span>
                </div>
              )}
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 10 }}>
                  SIZE / QUANTITY
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map((size, i) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(i)}
                      style={{
                        padding: '9px 20px', border: `1.5px solid ${i === selectedSize ? theme.primary : '#e5e7eb'}`,
                        borderRadius: 8, fontSize: 14, fontWeight: i === selectedSize ? 700 : 500,
                        color: i === selectedSize ? theme.primary : '#6b7280',
                        background: i === selectedSize ? theme.bgLight : '#fff',
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── KEY BENEFITS (visible above fold) ── */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b7280', marginBottom: 12 }}>KEY BENEFITS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {product.benefits.slice(0, 5).map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ width: 20, height: 20, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Check style={{ width: 10, height: 10, color: theme.primary }} />
                    </span>
                    <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTA Buttons (BUY NOW above fold) ── */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{
                  flex: 1, padding: '15px 20px', background: '#fff', color: '#111',
                  border: '1.5px solid #e5e7eb', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: isAddingToCart ? 'not-allowed' : 'pointer', opacity: isAddingToCart ? 0.7 : 1,
                  transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
                onMouseEnter={e => { if (!isAddingToCart) (e.currentTarget as HTMLElement).style.borderColor = theme.primary; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
              >
                {isAddingToCart ? 'ADDED ✓' : 'ADD TO CART'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                style={{
                  flex: 1, padding: '15px 20px', background: theme.primary, color: '#fff',
                  border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: isBuyingNow ? 'not-allowed' : 'pointer', opacity: isBuyingNow ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s, box-shadow 0.15s', fontFamily: 'inherit',
                  boxShadow: `0 4px 16px rgba(${theme.primaryRgb},0.35)`,
                }}
                onMouseEnter={e => { if (!isBuyingNow) (e.currentTarget as HTMLElement).style.background = theme.primaryDark; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = theme.primary; }}
              >
                <Zap style={{ width: 15, height: 15 }} />
                {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
              </button>
            </div>

            {/* Delivery note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', marginBottom: 20, padding: '12px 16px', background: theme.bgLight, border: `1px solid ${theme.border}`, borderRadius: 10 }}>
              <Truck style={{ width: 16, height: 16, color: theme.primary, flexShrink: 0 }} />
              <span><strong>Free delivery</strong> · Dispatched within 24 hours · Pan-India</span>
            </div>

            {/* Trust Grid */}
            <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              {[
                { icon: ShieldCheck, title: '100% Genuine', sub: 'Certified authentic' },
                { icon: RotateCcw, title: 'Easy Returns', sub: '7-day return policy' },
                { icon: Package, title: 'Safe Packaging', sub: 'Tamper-proof delivery' },
                { icon: Truck, title: 'Pan-India Delivery', sub: '3–5 business days' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 10 }}>
                  <item.icon style={{ width: 16, height: 16, color: theme.primary, flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 2 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── ACCORDION SECTIONS ── */}
            <div style={{ marginTop: 8 }}>
              {/* How to Use */}
              <Accordion title="How to Use" defaultOpen>
                <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 10, padding: '16px 20px', marginBottom: 12 }}>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.9 }}>{product.howToUse}</p>
                </div>
                <div style={{ padding: '12px 16px', background: theme.bgLight, border: `1px solid ${theme.border}`, borderRadius: 8 }}>
                  <p style={{ fontSize: 13, color: theme.primaryDark, fontWeight: 600 }}>
                    Always consult your physician before use. Discontinue if any adverse reaction occurs.
                  </p>
                </div>
              </Accordion>

              {/* Ingredients */}
              <Accordion title="Ingredients">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 10 }}>
                      <div style={{ minWidth: 64, textAlign: 'center', flexShrink: 0 }}>
                        <p style={{ fontSize: 16, fontWeight: 800, color: theme.primary, lineHeight: 1.1 }}>{ing.dose}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>{ing.name}</p>
                        <p style={{ fontSize: 13, color: '#6b7280' }}>{ing.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>

              {/* All Benefits */}
              <Accordion title="All Benefits">
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {product.benefits.map((b, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ width: 20, height: 20, background: theme.bgLight, border: `1.5px solid ${theme.border}`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check style={{ width: 10, height: 10, color: theme.primary }} />
                      </span>
                      <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.65 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER REVIEWS ── */}
        <div ref={reviewsRef} style={{ marginTop: 80, scrollMarginTop: 96 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ Verified Reviews</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              WHAT CUSTOMERS<br /><span style={{ color: theme.primary }}>ARE SAYING.</span>
            </h2>
          </div>
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: theme.primary, fontWeight: 700, display: 'block', marginBottom: 12 }}>✦ You May Also Like</span>
              <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111', lineHeight: 1, fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
                MORE FROM<br /><span style={{ color: theme.primary }}>{product.type === 'cosmetics' ? 'COSMETICS.' : 'NUTRACEUTICALS.'}</span>
              </h2>
            </div>
            <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 960, margin: '0 auto' }}>
              {relatedProducts.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE STICKY BUY NOW ── */}
      <div className="mobile-cta-outer" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '10px 14px', zIndex: 500, boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', display: 'none' }}>
        <div style={{ display: 'flex', gap: 10, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Price</span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#111', lineHeight: 1 }}>₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            style={{ padding: '13px 16px', background: '#fff', color: '#111', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            {isAddingToCart ? '✓ ADDED' : 'ADD TO CART'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            style={{ flex: 2, background: theme.primary, color: '#fff', padding: '13px 14px', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', boxShadow: `0 4px 16px rgba(${theme.primaryRgb},0.3)` }}
          >
            <Zap style={{ width: 14, height: 14, flexShrink: 0 }} />
            {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
          </button>
        </div>
      </div>

      <style>{`
        .mobile-cta-outer { display: none; }
        @media (max-width: 1023px) {
          .mobile-cta-outer { display: block; }
          .related-grid { grid-template-columns: 1fr 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .related-grid { grid-template-columns: 1fr 1fr !important; }
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
