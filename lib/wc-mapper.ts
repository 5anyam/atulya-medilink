import { Product, WCVariation } from './woocommerceApi';
import { StaticProduct, ProductVariation } from './products-data';

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

function mapWCVariation(v: WCVariation, parentImages: string[]): ProductVariation {
  const images = v.image?.src ? [v.image.src] : parentImages;
  return {
    id: v.id,
    price: parseFloat(v.price) || 0,
    regularPrice: parseFloat(v.regular_price) || parseFloat(v.price) || 0,
    images,
    attributes: v.attributes.map(a => ({ name: a.name, option: a.option })),
    sku: v.sku,
    inStock: v.stock_status !== 'outofstock',
  };
}

function getMeta(p: Product, key: string): string {
  return p.meta_data?.find(m => m.key === key)?.value?.trim() ?? '';
}

function parseBenefits(raw: string): string[] {
  if (!raw) return [];
  return raw.split('|').map(b => b.trim()).filter(Boolean);
}

function parseIngredients(raw: string): { name: string; dose: string; benefit: string }[] {
  if (!raw) return [];
  return raw.split('||').map(entry => {
    const parts = entry.split(':::').map(p => p.trim());
    return { name: parts[0] ?? '', dose: parts[1] ?? '', benefit: parts[2] ?? '' };
  }).filter(i => i.name);
}

export function wcProductToStatic(p: Product, wcVariations?: WCVariation[]): StaticProduct {
  const price = parseFloat(p.price) || 0;
  const regularPrice = parseFloat(p.regular_price) || price;
  const images = (p.images ?? []).map(img => img.src).filter(Boolean);

  // Decode HTML entities in category name
  const rawCategory = p.categories?.[0]?.name ?? 'General';
  const category = stripHtml(rawCategory);

  const parentImages = images.length > 0 ? images : ['/placeholder.png'];
  const variations: ProductVariation[] | undefined = wcVariations && wcVariations.length > 0
    ? wcVariations.map(v => mapWCVariation(v, parentImages))
    : undefined;

  const basePrice = variations
    ? Math.min(...variations.map(v => v.price).filter(Boolean))
    : price;
  const baseRegularPrice = variations
    ? Math.min(...variations.map(v => v.regularPrice).filter(Boolean))
    : regularPrice;

  const metaHowToUse = getMeta(p, 'product_how_to_use');
  const metaBenefits = parseBenefits(getMeta(p, 'product_benefits'));
  const metaIngredients = parseIngredients(getMeta(p, 'product_ingredients'));

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortName: p.name,
    tagline: stripHtml(p.short_description ?? p.description ?? '').slice(0, 200),
    price: basePrice || price,
    regularPrice: baseRegularPrice || regularPrice,
    images: parentImages,
    benefits: metaBenefits,
    ingredients: metaIngredients,
    howToUse: metaHowToUse || stripHtml(p.description ?? ''),
    category,
    type: detectType(p),
    sizes: [],
    badge: p.on_sale ? 'Sale' : undefined,
    rating: parseFloat(p.average_rating ?? '4.5') || 4.5,
    reviewCount: p.rating_count ?? 0,
    capsules: 0,
    variations,
  };
}

export function wcProductsToStatic(products: Product[]): StaticProduct[] {
  return products.map(p => wcProductToStatic(p));
}
