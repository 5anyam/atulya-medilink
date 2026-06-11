import ShopPageClient from './shopPageClient';
import { fetchProducts } from '../../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../../lib/wc-mapper';
import { PRODUCTS } from '../../../lib/products-data';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  let products;
  try {
    const wcProducts = await fetchProducts(1, 100);
    if (wcProducts.length > 0) {
      products = wcProductsToStatic(wcProducts);
    } else {
      console.warn('[ShopPage] WooCommerce returned 0 products, falling back to static data');
      products = PRODUCTS;
    }
  } catch (err) {
    console.error('[ShopPage] Failed to fetch WooCommerce products:', err);
    products = PRODUCTS;
  }
  return <ShopPageClient products={products} />;
}
