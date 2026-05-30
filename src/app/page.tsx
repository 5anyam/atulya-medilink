import { fetchProducts } from '../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../lib/wc-mapper';
import { PRODUCTS } from '../../lib/products-data';
import Homepage from './HomeClient';

export const revalidate = 300;

export default async function Page() {
  let products;
  try {
    const wcProducts = await fetchProducts(1, 100);
    products = wcProducts.length > 0 ? wcProductsToStatic(wcProducts) : PRODUCTS;
  } catch {
    products = PRODUCTS;
  }
  return <Homepage products={products} />;
}
