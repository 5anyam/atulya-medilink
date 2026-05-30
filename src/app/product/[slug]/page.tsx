import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductClient from './product-client';
import { fetchProductBySlug } from '../../../../lib/woocommerceApi';
import { wcProductToStatic } from '../../../../lib/wc-mapper';
import { getProductBySlug } from '../../../../lib/products-data';

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let product;
  try {
    const wcProduct = await fetchProductBySlug(slug);
    product = wcProduct ? wcProductToStatic(wcProduct) : getProductBySlug(slug);
  } catch {
    product = getProductBySlug(slug);
  }

  if (!product) {
    return {
      title: 'Product Not Found | Atulya Medilink',
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | Atulya Medilink`;
  const description = product.tagline || `Buy ${product.name} online. Free delivery across India.`;
  const imageUrl = product.images[0];
  const canonical = `https://atulyamedilinkpvtltd.shop/product/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: 'Atulya Medilink',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://atulyamedilinkpvtltd.shop'),
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  let product;
  try {
    const wcProduct = await fetchProductBySlug(slug);
    product = wcProduct ? wcProductToStatic(wcProduct) : getProductBySlug(slug);
  } catch {
    product = getProductBySlug(slug);
  }

  if (!product) notFound();

  const canonical = `https://atulyamedilinkpvtltd.shop/product/${product.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.tagline,
    image: product.images,
    url: canonical,
    brand: {
      '@type': 'Brand',
      name: 'Atulya Medilink',
    },
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'INR',
      price: product.price.toString(),
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
