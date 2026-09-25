// Blog posts are written in WordPress (Posts → Add New) and fetched here from
// the WP REST API. Pages revalidate every 5 minutes, so a newly published post
// appears on the site automatically.

const WP_BASE =
  (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.atulyamedilinkpvtltd.shop').replace(/\/$/, '') +
  '/wp-json/wp/v2';

export const BLOG_REVALIDATE = 300;
export const SITE_URL = 'https://www.atulyamedilinkpvtltd.shop';

export type BlogCategory = { id: number; name: string; slug: string; count?: number };

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;        // plain text
  contentHtml: string;    // rendered HTML from WordPress
  date: string;
  modified: string;
  image: string | null;
  imageAlt: string;
  author: string;
  categories: BlogCategory[];
  readingMinutes: number;
  seo: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
  };
};

/* ── helpers ─────────────────────────────────────────────── */

const ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#039;': "'", '&apos;': "'",
  '&nbsp;': ' ', '&hellip;': '…', '&ndash;': '–', '&mdash;': '—',
  '&lsquo;': '‘', '&rsquo;': '’', '&ldquo;': '“', '&rdquo;': '”',
};

export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&[a-z]+;|&#0?39;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m);
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── mapping ─────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(p: any): BlogPost {
  const emb = p._embedded || {};
  const media = emb['wp:featuredmedia']?.[0];
  const terms: BlogCategory[] = (emb['wp:term']?.[0] || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((t: any) => ({ id: t.id, name: decodeEntities(t.name), slug: t.slug }))
    .filter((t: BlogCategory) => t.slug !== 'uncategorized');
  const contentHtml: string = p.content?.rendered || '';
  const words = stripHtml(contentHtml).split(' ').filter(Boolean).length;
  const yoast = p.yoast_head_json || {};
  const rank = p.rank_math || {};

  return {
    id: p.id,
    slug: p.slug,
    title: decodeEntities(p.title?.rendered || ''),
    excerpt: stripHtml(p.excerpt?.rendered || ''),
    contentHtml,
    date: p.date,
    modified: p.modified,
    image: media?.source_url || null,
    imageAlt: decodeEntities(media?.alt_text || p.title?.rendered || ''),
    author: emb.author?.[0]?.name || 'Atulya Medilink',
    categories: terms,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    seo: {
      title: yoast.title || rank.title || undefined,
      description: yoast.description || yoast.og_description || rank.description || undefined,
      ogImage: yoast.og_image?.[0]?.url || undefined,
      canonical: undefined,
    },
  };
}

/* ── fetchers (server-side) ─────────────────────────────── */

export async function fetchPosts(opts: { page?: number; perPage?: number; category?: number; exclude?: number } = {}):
  Promise<{ posts: BlogPost[]; totalPages: number; total: number }> {
  const { page = 1, perPage = 9, category, exclude } = opts;
  const params = new URLSearchParams({ _embed: '1', per_page: String(perPage), page: String(page), status: 'publish' });
  if (category) params.set('categories', String(category));
  if (exclude) params.set('exclude', String(exclude));
  try {
    const res = await fetch(`${WP_BASE}/posts?${params}`, { next: { revalidate: BLOG_REVALIDATE } });
    if (!res.ok) return { posts: [], totalPages: 0, total: 0 };
    const data = await res.json();
    return {
      posts: Array.isArray(data) ? data.map(mapPost) : [],
      totalPages: Number(res.headers.get('x-wp-totalpages') || 0),
      total: Number(res.headers.get('x-wp-total') || 0),
    };
  } catch {
    return { posts: [], totalPages: 0, total: 0 };
  }
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_embed=1`, { next: { revalidate: BLOG_REVALIDATE } });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data[0] ? mapPost(data[0]) : null;
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${WP_BASE}/categories?per_page=50&hide_empty=true`, { next: { revalidate: BLOG_REVALIDATE } });
    if (!res.ok) return [];
    const data = await res.json();
    return (Array.isArray(data) ? data : [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => ({ id: c.id, name: decodeEntities(c.name), slug: c.slug, count: c.count }))
      .filter((c: BlogCategory) => c.slug !== 'uncategorized');
  } catch {
    return [];
  }
}
