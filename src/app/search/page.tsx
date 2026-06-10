import { Suspense } from 'react';
import { fetchProducts } from '../../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../../lib/wc-mapper';
import { PRODUCTS } from '../../../lib/products-data';
import SearchClient from './SearchClient';

export const revalidate = 300;

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  let products;
  try {
    const wcProducts = await fetchProducts(1, 100, query || undefined);
    products = wcProducts.length > 0 ? wcProductsToStatic(wcProducts) : PRODUCTS;
  } catch {
    // If WooCommerce is unreachable, fall back to static data and filter locally
    products = query
      ? PRODUCTS.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        )
      : PRODUCTS;
  }

  return (
    <Suspense>
      <SearchClient products={products} query={query} />
    </Suspense>
  );
}
