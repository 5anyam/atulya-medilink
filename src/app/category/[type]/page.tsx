import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { fetchProducts } from '../../../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../../../lib/wc-mapper';
import { PRODUCTS, StaticProduct } from '../../../../lib/products-data';

export const revalidate = 300; // re-fetch from WooCommerce every 5 minutes

type CatType = 'cosmetics' | 'nutraceuticals' | 'ayurveda';

type CatDef = {
  parentType: CatType;
  label: string;
  eyebrow: string;
  tagline: string;
  // If set, this is a sub-category filtered by keywords (matched against the
  // product name + category). If not set, it's a main type filtered by p.type.
  keywords?: string[];
};

// slug → definition. Main types + header sub-categories (Face Care, etc.).
const CATEGORIES: Record<string, CatDef> = {
  cosmetics: {
    parentType: 'cosmetics', label: 'Cosmetics & Skincare', eyebrow: 'Skincare & Beauty',
    tagline: 'Premium skincare, creams & personal care for radiant skin',
  },
  nutraceuticals: {
    parentType: 'nutraceuticals', label: 'Nutraceuticals & Supplements', eyebrow: 'Health & Wellness',
    tagline: 'Vitamins, capsules & health supplements for your daily wellness',
  },
  ayurveda: {
    parentType: 'ayurveda', label: 'Ayurveda & Herbal', eyebrow: 'Herbal & Natural',
    tagline: 'Time-tested herbal formulations rooted in ancient Indian wisdom',
  },
  'face-care': {
    parentType: 'cosmetics', label: 'Face Care', eyebrow: 'Skincare & Beauty',
    tagline: 'Face toners, sunscreens & moisturizers for clear, glowing skin',
    keywords: ['face', 'toner', 'sunscreen', 'sun protector', 'serum', 'cleanser', 'moistur'],
  },
  'body-care': {
    parentType: 'cosmetics', label: 'Bath & Body', eyebrow: 'Body & Skin',
    tagline: 'Body washes, creams & personal care for soft, nourished skin',
    keywords: ['bath', 'body', 'foot', 'soap', 'lotion', 'cream', 'wash', 'hygiene'],
  },
  vitamins: {
    parentType: 'nutraceuticals', label: 'Vitamins & Supplements', eyebrow: 'Health & Wellness',
    tagline: 'Vitamins, capsules & supplements for your daily wellness',
    keywords: ['vitamin', 'supplement', 'capsule', 'tablet', 'softgel', 'omega', 'immunity', 'joint', 'multivitamin'],
  },
  protein: {
    parentType: 'nutraceuticals', label: 'Protein & Fitness', eyebrow: 'Health & Wellness',
    tagline: 'Whey protein, BCAA, pre-workout & fitness supplements',
    keywords: ['protein', 'whey', 'isolate', 'bcaa', 'pre workout', 'pre-workout', 'carnitine', 'gainer', 'creatine'],
  },
};

function filterProducts(def: CatDef, products: StaticProduct[]): StaticProduct[] {
  if (!def.keywords) {
    return products.filter((p) => p.type === def.parentType);
  }
  const kws = def.keywords;
  return products.filter((p) => {
    const hay = `${p.name} ${p.category}`.toLowerCase();
    return kws.some((k) => hay.includes(k));
  });
}

type Props = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const def = CATEGORIES[type];
  if (!def) {
    return { title: 'Not Found | Atulya Medilink', robots: { index: false, follow: false } };
  }
  return {
    title: `${def.label} | Atulya Medilink`,
    description: `${def.tagline}. Fast delivery across India.`,
    alternates: { canonical: `https://atulyamedilinkpvtltd.com/category/${type}` },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { type } = await params;
  const def = CATEGORIES[type];
  if (!def) notFound();

  let products;
  try {
    const wc = await fetchProducts(1, 100);
    products = wc.length > 0 ? wcProductsToStatic(wc) : PRODUCTS;
  } catch {
    products = PRODUCTS;
  }

  const filtered = filterProducts(def, products);

  return (
    <CategoryPageClient
      parentType={def.parentType}
      label={def.label}
      eyebrow={def.eyebrow}
      tagline={def.tagline}
      products={filtered}
    />
  );
}
