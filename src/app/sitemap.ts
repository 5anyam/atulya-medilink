import type { MetadataRoute } from 'next';
import { fetchProducts } from '../../lib/woocommerceApi';
import { fetchPosts } from '../../lib/blog';

export const revalidate = 3600;

const SITE = 'https://www.atulyamedilinkpvtltd.shop';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/category/cosmetics`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/category/nutraceuticals`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/category/ayurveda`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/offers`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE}/returns-and-refunds-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Live product pages from WooCommerce (best-effort — never break the sitemap).
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProducts(1, 100);
    productPages = products.map((p) => ({
      url: `${SITE}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {
    productPages = [];
  }

  // Blog posts from WordPress (best-effort).
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await fetchPosts({ perPage: 100 });
    blogPages = posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: new Date(p.modified),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    blogPages = [];
  }

  return [...staticPages, ...productPages, ...blogPages];
}
