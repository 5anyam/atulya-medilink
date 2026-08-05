// Central config for the WordPress-managed banners (Atulya Banner Manager plugin).
// Each "slot" can now hold up to 4 banners: <slot>-1.jpg … <slot>-4.jpg.
// The frontend probes those URLs and shows whichever exist (see useValidBanners).

export const BANNER_BASE =
  'https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/atulya-banners';

export const MAX_BANNERS_PER_SLOT = 4;

export type BannerType = 'cosmetics' | 'nutraceuticals' | 'ayurveda';

// The single banner uploaded earlier (pre multi-banner) — used as a safe
// fallback so a slot is never blank while the plugin is being upgraded.
export function legacyBanner(slot: string): string {
  return `${BANNER_BASE}/${slot}.jpg`;
}

// Candidate URLs for a slot: <slot>-1.jpg … <slot>-4.jpg (highest priority first).
export function bannerCandidates(slot: string): string[] {
  return Array.from(
    { length: MAX_BANNERS_PER_SLOT },
    (_, i) => `${BANNER_BASE}/${slot}-${i + 1}.jpg`,
  );
}
