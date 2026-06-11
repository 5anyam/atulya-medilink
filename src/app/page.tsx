import { fetchProducts } from '../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../lib/wc-mapper';
import { PRODUCTS } from '../../lib/products-data';
import Homepage from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let products;
  try {
    const wcProducts = await fetchProducts(1, 100);
    if (wcProducts.length > 0) {
      products = wcProductsToStatic(wcProducts);
    } else {
      console.warn('[HomePage] WooCommerce returned 0 products, falling back to static data');
      products = PRODUCTS;
    }
  } catch (err) {
    console.error('[HomePage] Failed to fetch WooCommerce products:', err);
    products = PRODUCTS;
  }
  return <Homepage products={products} />;
}
