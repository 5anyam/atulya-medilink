// "Buy 1 Get 2 Free" offer — pay for 1, receive 3 of the same product. Applies
// to all face washes plus a few specific products. Eligibility is computed when
// a product is added to the cart (from slug / name / category) and stored on it.

// Free units received per paid unit (2 free per 1 paid → 3 total).
export const BOGO_FREE_PER_PAID = 2;

export const BOGO_LABEL = 'Buy 1 Get 2 Free';
export const BOGO_SHORT = 'BUY 1 GET 2 FREE';

// Specific non-facewash products that also get the offer.
export const BOGO_SLUGS = [
  'aqua-gel-sunscreen-spf-50',
  'atulya-cucumber-toner',
  'sun-protector-moisturizer',
];

/** True if the product qualifies for the Buy 1 Get 1 Free offer. */
export function isBogoProduct(p: { name?: string; slug?: string; category?: string }): boolean {
  const slug = (p.slug || '').toLowerCase();
  if (BOGO_SLUGS.includes(slug)) return true;
  const hay = `${p.name || ''} ${p.slug || ''} ${p.category || ''}`.toLowerCase();
  return /face[\s-]*wash/.test(hay);
}

/** Free units the customer receives for a given paid quantity. */
export function bogoFreeQty(paidQty: number): number {
  return paidQty * BOGO_FREE_PER_PAID;
}

/** Total units delivered (paid + free) for a given paid quantity. */
export function bogoTotalQty(paidQty: number): number {
  return paidQty + bogoFreeQty(paidQty);
}
