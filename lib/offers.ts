// Offer engine — offers are configured in WordPress ("Atulya Control Panel" →
// Offers) and read from the site config. Each offer is "Buy `buy` Get `free`
// Free" applied to products matched by slug or keyword.

import { Offer } from './site-config';

// What we store on a cart item (a snapshot of the matched offer).
export type CartOffer = { buy: number; free: number; label: string };

/** First enabled offer whose match tokens hit this product, or null. */
export function matchOffer(
  product: { name?: string; slug?: string; category?: string },
  offers: Offer[] | undefined,
): Offer | null {
  if (!offers || offers.length === 0) return null;
  const slug = (product.slug || '').toLowerCase();
  const hay = `${product.name || ''} ${product.slug || ''} ${product.category || ''}`.toLowerCase();
  for (const offer of offers) {
    if (!offer.enabled || offer.free <= 0) continue;
    const hit = offer.match.some((tok) => tok === slug || (tok.length > 0 && hay.includes(tok)));
    if (hit) return offer;
  }
  return null;
}

export function toCartOffer(offer: Offer): CartOffer {
  return { buy: offer.buy, free: offer.free, label: offer.label };
}

/** Free units received for a given paid quantity. */
export function offerFreeUnits(paidQty: number, offer?: CartOffer | null): number {
  if (!offer || offer.buy <= 0) return 0;
  return Math.floor(paidQty / offer.buy) * offer.free;
}

/** Total units delivered (paid + free). */
export function offerTotalUnits(paidQty: number, offer?: CartOffer | null): number {
  return paidQty + offerFreeUnits(paidQty, offer);
}

/** Short badge text, e.g. "BUY 1 GET 2 FREE". */
export function offerShort(offer: { buy: number; free: number }): string {
  return `BUY ${offer.buy} GET ${offer.free} FREE`;
}
