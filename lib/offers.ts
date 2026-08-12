// "Buy 1 Get 1 Free" (Buy 1 Get 2) offer — applies to all face washes plus a
// few specific products. Eligibility is computed when a product is added to the
// cart (from its slug / name / category) and stored on the cart item.

export const BOGO_LABEL = 'Buy 1 Get 1 Free';
export const BOGO_SHORT = 'B1G1 FREE';

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

/** Free units the customer receives for a given paid quantity (1 free per 1 paid). */
export function bogoFreeQty(paidQty: number): number {
  return paidQty;
}
