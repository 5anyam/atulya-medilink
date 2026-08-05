'use client';

import BannerCarousel, { useValidBanners } from './BannerCarousel';
import { bannerCandidates, legacyBanner, BannerType } from '../lib/banners';

// The homepage hero shows every banner from all three categories together
// (Cosmetics first, then Nutraceuticals, then Ayurveda). Each category can have
// up to 4 banners (managed from the "Atulya Banner Manager" WordPress plugin).
const HOME_ORDER: BannerType[] = ['cosmetics', 'nutraceuticals', 'ayurveda'];

const HOME_CANDIDATES = HOME_ORDER.flatMap((t) => bannerCandidates(`home-${t}`));
const HOME_FALLBACKS = HOME_ORDER.map((t) => legacyBanner(`home-${t}`));

export default function HeroCarousel() {
  const images = useValidBanners(HOME_CANDIDATES, HOME_FALLBACKS);
  return <BannerCarousel images={images} alt="Atulya Medilink" />;
}
