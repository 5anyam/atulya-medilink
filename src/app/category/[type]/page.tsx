import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';
import { fetchProducts } from '../../../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../../../lib/wc-mapper';
import { PRODUCTS } from '../../../../lib/products-data';

export const revalidate = 300; // re-fetch from WooCommerce every 5 minutes

const VALID = ['cosmetics', 'nutraceuticals', 'ayurveda'] as const;
type CatType = (typeof VALID)[number];

const META: Record<CatType, { title: string; description: string }> = {
  cosmetics: {
    title: 'Cosmetics & Skincare | Atulya Medilink',
    description: 'Premium skincare, creams & personal care for radiant skin. Free delivery across India.',
  },
  nutraceuticals: {
    title: 'Nutraceuticals & Supplements | Atulya Medilink',
    description: 'Vitamins, capsules & health supplements for your daily wellness. Free delivery across India.',
  },
  ayurveda: {
    title: 'Ayurveda & Herbal | Atulya Medilink',
    description: 'Time-tested herbal formulations rooted in ancient Indian wisdom. Free delivery across India.',
  },
};

type Props = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!VALID.includes(type as CatType)) {
    return { title: 'Not Found | Atulya Medilink', robots: { index: false, follow: false } };
  }
  const m = META[type as CatType];
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://atulyamedilinkpvtltd.com/category/${type}` },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { type } = await params;
  if (!VALID.includes(type as CatType)) notFound();

  let products;
  try {
    const wc = await fetchProducts(1, 100);
    products = wc.length > 0 ? wcProductsToStatic(wc) : PRODUCTS;
  } catch {
    products = PRODUCTS;
  }

  const filtered = products.filter((p) => p.type === type);
  return <CategoryPageClient type={type as CatType} products={filtered} />;
}
