import { Metadata } from 'next';
import OffersClient from './OffersClient';
import { fetchProducts } from '../../../lib/woocommerceApi';
import { wcProductsToStatic } from '../../../lib/wc-mapper';
import { PRODUCTS } from '../../../lib/products-data';

export const metadata: Metadata = {
  title: 'Offers & Deals — Atulya Medilink',
  description: 'Exclusive deals, discounts and limited-time offers on Atulya Medilink natural cosmetics and nutraceuticals.',
};

export const revalidate = 300;

export default async function OffersPage() {
  let saleProducts = PRODUCTS.filter(p => p.regularPrice > p.price);

  try {
    const raw = await fetchProducts(1, 100);
    const onSale = raw.filter(p => p.on_sale);
    if (onSale.length > 0) {
      saleProducts = wcProductsToStatic(onSale);
    }
  } catch {
    // fallback to static data
  }

  return <OffersClient products={saleProducts} />;
}
