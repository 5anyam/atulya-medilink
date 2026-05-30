import { Product } from './woocommerceApi';
import { StaticProduct } from './products-data';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

const COSMETICS_SLUGS = ['cosmetics', 'skin-care', 'skincare', 'face-care', 'hair-care', 'body-care', 'soap', 'shampoo', 'serum', 'face-wash', 'moisturizer', 'foot-care', 'beauty'];
const NUTRA_SLUGS = ['nutraceuticals', 'vitamins', 'supplements', 'capsules', 'tablets', 'softgels', 'health', 'immunity', 'joint-health', 'fatty-acids', 'hair-health'];

function detectType(product: Product): 'cosmetics' | 'nutraceuticals' {
  const cats = (product.categories ?? []).map(c => c.slug.toLowerCase());
  const tags = (product.tags ?? []).map(t => t.slug.toLowerCase());
  const all = [...cats, ...tags];

  if (all.some(s => COSMETICS_SLUGS.some(c => s.includes(c)))) return 'cosmetics';
  if (all.some(s => NUTRA_SLUGS.some(n => s.includes(n)))) return 'nutraceuticals';

  // fallback: check name/description for keywords
  const text = (product.name + ' ' + (product.description ?? '')).toLowerCase();
  if (text.match(/cream|serum|shampoo|soap|face|skin|hair|wash|lotion|oil/)) return 'cosmetics';
  return 'nutraceuticals';
}

export function wcProductToStatic(p: Product): StaticProduct {
  const price = parseFloat(p.price) || 0;
  const regularPrice = parseFloat(p.regular_price) || price;
  const images = (p.images ?? []).map(img => img.src).filter(Boolean);
  const category = p.categories?.[0]?.name ?? 'General';

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortName: p.name,
    tagline: stripHtml(p.short_description ?? p.description ?? '').slice(0, 200),
    price,
    regularPrice,
    images: images.length > 0 ? images : ['/placeholder.png'],
    benefits: [],
    ingredients: [],
    howToUse: stripHtml(p.description ?? ''),
    category,
    type: detectType(p),
    sizes: [],
    badge: p.on_sale ? 'Sale' : undefined,
    rating: parseFloat(p.average_rating ?? '4.5') || 4.5,
    reviewCount: p.rating_count ?? 0,
    capsules: 0,
  };
}

export function wcProductsToStatic(products: Product[]): StaticProduct[] {
  return products.map(wcProductToStatic);
}
