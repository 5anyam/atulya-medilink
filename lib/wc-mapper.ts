import { Product } from './woocommerceApi';
import { StaticProduct } from './products-data';

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

// Slugs that should map to each brand type
const AYURVEDA_SLUGS = [
  'ayurveda', 'ayurvedic', 'herbal', 'herb', 'churna', 'kadha',
  'rasayana', 'triphala', 'ashwagandha', 'shatavari', 'brahmi', 'natural',
];
const COSMETICS_SLUGS = [
  'cosmetics', 'skin-care', 'skincare', 'face-care', 'hair-care',
  'body-care', 'bath-body', 'bath', 'soap', 'shampoo', 'serum',
  'face-wash', 'moisturizer', 'foot-care', 'beauty', 'cream', 'gel',
  'lotion', 'oil', 'scrub', 'toner', 'lip', 'eye',
];
const NUTRA_SLUGS = [
  'nutraceuticals', 'vitamins', 'supplements', 'capsules', 'tablets',
  'softgels', 'health', 'immunity', 'joint-health', 'fatty-acids',
  'hair-health', 'omega', 'multivitamin',
];

function detectType(product: Product): 'cosmetics' | 'nutraceuticals' | 'ayurveda' {
  const cats = (product.categories ?? []).map(c => c.slug.toLowerCase());
  const tags = (product.tags ?? []).map(t => t.slug.toLowerCase());
  const all = [...cats, ...tags];

  // Check each slug against our keyword lists (slug must CONTAIN the keyword)
  if (all.some(s => AYURVEDA_SLUGS.some(a => s.includes(a)))) return 'ayurveda';
  if (all.some(s => COSMETICS_SLUGS.some(c => s.includes(c)))) return 'cosmetics';
  if (all.some(s => NUTRA_SLUGS.some(n => s.includes(n)))) return 'nutraceuticals';

  // Fallback: check product name and description
  const text = (product.name + ' ' + stripHtml(product.description ?? '') + ' ' + stripHtml(product.short_description ?? '')).toLowerCase();
  if (text.match(/ayurved|herbal|churna|kadha|natural|organic/)) return 'ayurveda';
  if (text.match(/cream|gel|serum|shampoo|soap|face|skin|hair|wash|lotion|body|foot|lip|eye|scrub/)) return 'cosmetics';
  if (text.match(/capsule|tablet|vitamin|supplement|omega|protein|probiotic|mineral/)) return 'nutraceuticals';

  return 'nutraceuticals'; // final fallback
}

export function wcProductToStatic(p: Product): StaticProduct {
  const price = parseFloat(p.price) || 0;
  const regularPrice = parseFloat(p.regular_price) || price;
  const images = (p.images ?? []).map(img => img.src).filter(Boolean);

  // Decode HTML entities in category name
  const rawCategory = p.categories?.[0]?.name ?? 'General';
  const category = stripHtml(rawCategory);

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
