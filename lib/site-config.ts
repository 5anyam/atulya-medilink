// Site-wide settings managed from the "Atulya Control Panel" WordPress plugin.
// The front-end reads them and applies (shipping, GST, announcement, WhatsApp, COD).
// If the plugin/endpoint isn't reachable, DEFAULT_CONFIG keeps the site working.

export type Offer = { enabled: boolean; label: string; match: string[]; buy: number; free: number };

export type SiteConfig = {
  shipping: { delivery_charge: number; free_above: number };
  gst: { enabled: boolean; rate: number };
  announcement: { enabled: boolean; text: string };
  whatsapp: { enabled: boolean; number: string; message: string };
  cod: { enabled: boolean };
  new_packaging: string[];
  popup: { enabled: boolean; title: string; text: string; code: string };
  offers: Offer[];
};

// Kept in sync with the plugin's default_offers().
const DEFAULT_OFFERS: Offer[] = [
  {
    enabled: true,
    label: 'Buy 1 Get 2 Free',
    match: ['face wash', 'aqua-gel-sunscreen-spf-50', 'atulya-cucumber-toner', 'sun-protector-moisturizer'],
    buy: 1,
    free: 2,
  },
];

export const DEFAULT_CONFIG: SiteConfig = {
  shipping: { delivery_charge: 99, free_above: 999 },
  gst: { enabled: true, rate: 5 },
  announcement: { enabled: true, text: '' },
  whatsapp: { enabled: true, number: '918851180015', message: 'Hi, I need help with my order' },
  cod: { enabled: false },
  new_packaging: ['omega-3-fish-oil', 'multivitamin-tablets'],
  popup: { enabled: false, title: 'Get 20% OFF your first order', text: 'Use code WELCOME20 at checkout.', code: 'WELCOME20' },
  offers: DEFAULT_OFFERS,
};

const CONFIG_URL =
  (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.atulyamedilinkpvtltd.shop').replace(/\/$/, '') +
  '/wp-json/atulya/v1/config';

/** Merge a partial/unknown payload onto the defaults so shape is always valid. */
export function normalizeConfig(raw: unknown): SiteConfig {
  const c = (raw ?? {}) as Partial<SiteConfig>;
  return {
    shipping: {
      delivery_charge: num(c.shipping?.delivery_charge, DEFAULT_CONFIG.shipping.delivery_charge),
      free_above: num(c.shipping?.free_above, DEFAULT_CONFIG.shipping.free_above),
    },
    gst: {
      enabled: bool(c.gst?.enabled, DEFAULT_CONFIG.gst.enabled),
      rate: num(c.gst?.rate, DEFAULT_CONFIG.gst.rate),
    },
    announcement: {
      enabled: bool(c.announcement?.enabled, DEFAULT_CONFIG.announcement.enabled),
      text: str(c.announcement?.text, DEFAULT_CONFIG.announcement.text),
    },
    whatsapp: {
      enabled: bool(c.whatsapp?.enabled, DEFAULT_CONFIG.whatsapp.enabled),
      number: str(c.whatsapp?.number, DEFAULT_CONFIG.whatsapp.number),
      message: str(c.whatsapp?.message, DEFAULT_CONFIG.whatsapp.message),
    },
    cod: { enabled: bool(c.cod?.enabled, DEFAULT_CONFIG.cod.enabled) },
    new_packaging: Array.isArray(c.new_packaging)
      ? c.new_packaging.map(cleanSlug).filter(Boolean)
      : DEFAULT_CONFIG.new_packaging,
    popup: {
      enabled: bool(c.popup?.enabled, DEFAULT_CONFIG.popup.enabled),
      title: str(c.popup?.title, DEFAULT_CONFIG.popup.title),
      text: str(c.popup?.text, DEFAULT_CONFIG.popup.text),
      code: str(c.popup?.code, DEFAULT_CONFIG.popup.code),
    },
    // If the payload carries an offers array (even empty), respect it; else defaults.
    offers: Array.isArray(c.offers) ? c.offers.map(normalizeOffer).filter((o): o is Offer => o !== null) : DEFAULT_CONFIG.offers,
  };
}

function normalizeOffer(raw: unknown): Offer | null {
  const o = (raw ?? {}) as Partial<Offer>;
  const match = Array.isArray(o.match)
    ? o.match.map((m) => String(m).trim().toLowerCase()).filter(Boolean)
    : [];
  if (match.length === 0) return null;
  return {
    enabled: bool(o.enabled, true),
    label: str(o.label, 'Special Offer'),
    match,
    buy: Math.max(1, num(o.buy, 1)),
    free: Math.max(0, num(o.free, 0)),
  };
}

/** Accepts a slug, "product/slug" or a full product URL and returns just the slug. */
export function cleanSlug(v: unknown): string {
  const raw = String(v ?? '').trim().toLowerCase().replace(/^https?:\/\/[^/]+/, '').split('?')[0];
  return raw.split('/').filter(Boolean).pop() ?? '';
}

function num(v: unknown, d: number) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function bool(v: unknown, d: boolean) { return typeof v === 'boolean' ? v : d; }
function str(v: unknown, d: string) { return typeof v === 'string' && v.length ? v : d; }

/** Server-side fetch (used by the /api/site-config proxy and server components). */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(CONFIG_URL, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_CONFIG;
    return normalizeConfig(await res.json());
  } catch {
    return DEFAULT_CONFIG;
  }
}
