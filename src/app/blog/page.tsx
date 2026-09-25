import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPosts, fetchCategories, formatDate, BlogPost, SITE_URL } from '../../../lib/blog';

export const revalidate = 300; // new WordPress posts appear within 5 minutes

export const metadata: Metadata = {
  title: 'Blog — Health, Skincare & Wellness Tips | Atulya Medilink',
  description: 'Expert tips on skincare, nutrition, supplements and Ayurveda from the Atulya Medilink team.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: 'website',
    title: 'Atulya Medilink Blog',
    description: 'Expert tips on skincare, nutrition, supplements and Ayurveda.',
    url: `${SITE_URL}/blog`,
    siteName: 'Atulya Medilink',
  },
};

type Props = { searchParams: Promise<{ page?: string; category?: string }> };

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      <div className="blog-card-img">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={post.imageAlt} loading="lazy" />
        ) : (
          <div className="blog-card-placeholder">🌿</div>
        )}
      </div>
      <div className="blog-card-body">
        {post.categories[0] && <span className="blog-tag">{post.categories[0].name}</span>}
        <h3>{post.title}</h3>
        <p className="blog-excerpt">{post.excerpt}</p>
        <p className="blog-meta">{formatDate(post.date)} · {post.readingMinutes} min read</p>
      </div>
    </Link>
  );
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const categories = await fetchCategories();
  const activeCat = categories.find((c) => c.slug === sp.category);
  const { posts, totalPages } = await fetchPosts({ page, perPage: 9, category: activeCat?.id });

  const showFeatured = page === 1 && !activeCat && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const rest = showFeatured ? posts.slice(1) : posts;

  const pageHref = (p: number) => {
    const q = new URLSearchParams();
    if (p > 1) q.set('page', String(p));
    if (activeCat) q.set('category', activeCat.slug);
    const s = q.toString();
    return `/blog${s ? `?${s}` : ''}`;
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#fff4ef 0%,#ffe9dd 100%)', borderBottom: '1px solid #fde2d3' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '56px 24px 44px' }}>
          <span style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#ff5f1f', fontWeight: 700 }}>✦ The Atulya Journal</span>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, letterSpacing: '-0.025em', color: '#111', lineHeight: 1.05, margin: '12px 0 12px', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
            Health, Beauty &amp; <span style={{ color: '#ff5f1f' }}>Wellness</span> Tips
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 560, lineHeight: 1.7 }}>
            Practical guides on skincare, nutrition, supplements and Ayurveda — written by the Atulya Medilink team.
          </p>

          {categories.length > 0 && (
            <nav className="blog-cats" aria-label="Blog categories">
              <Link href="/blog" className={`blog-chip ${!activeCat ? 'active' : ''}`}>All</Link>
              {categories.map((c) => (
                <Link key={c.id} href={`/blog?category=${c.slug}`} className={`blog-chip ${activeCat?.id === c.id ? 'active' : ''}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 24px 72px' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 18 }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>📝</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', marginBottom: 8 }}>New articles coming soon</h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>We&apos;re writing helpful guides for you. Check back shortly!</p>
            <Link href="/shop" style={{ background: '#111', color: '#fff', padding: '12px 26px', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Shop Products →
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="blog-featured">
                <div className="blog-featured-img">
                  {featured.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={featured.image} alt={featured.imageAlt} />
                  ) : (
                    <div className="blog-card-placeholder">🌿</div>
                  )}
                </div>
                <div className="blog-featured-body">
                  <span className="blog-tag">★ Featured{featured.categories[0] ? ` · ${featured.categories[0].name}` : ''}</span>
                  <h2>{featured.title}</h2>
                  <p className="blog-excerpt">{featured.excerpt}</p>
                  <p className="blog-meta">{formatDate(featured.date)} · {featured.readingMinutes} min read</p>
                  <span className="blog-read">Read article →</span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="blog-grid">
                {rest.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="blog-pager" aria-label="Pagination">
                {page > 1 && <Link href={pageHref(page - 1)}>← Newer</Link>}
                <span>Page {page} of {totalPages}</span>
                {page < totalPages && <Link href={pageHref(page + 1)}>Older →</Link>}
              </nav>
            )}
          </>
        )}
      </div>

      <style>{`
        .blog-cats { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 26px; }
        .blog-chip { font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 999px; background: #fff; color: #374151; border: 1px solid #f3d6c6; text-decoration: none; transition: all .2s; }
        .blog-chip:hover { border-color: #ff5f1f; color: #ff5f1f; }
        .blog-chip.active { background: #ff5f1f; color: #fff; border-color: #ff5f1f; }

        .blog-featured { display: grid; grid-template-columns: 1.2fr 1fr; background: #fff; border: 1px solid #f0f0f0; border-radius: 20px; overflow: hidden; text-decoration: none; margin-bottom: 36px; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: transform .25s, box-shadow .25s; }
        .blog-featured:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(255,95,31,.14); }
        .blog-featured-img { position: relative; min-height: 320px; background: #fff4ef; }
        .blog-featured-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .blog-featured-body { padding: 36px 34px; display: flex; flex-direction: column; justify-content: center; }
        .blog-featured-body h2 { font-size: clamp(22px,2.6vw,32px); font-weight: 900; color: #111; line-height: 1.15; letter-spacing: -.02em; margin: 12px 0; font-family: 'Plus Jakarta Sans','Inter',sans-serif; }
        .blog-read { margin-top: 18px; font-size: 13px; font-weight: 800; color: #ff5f1f; }

        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .blog-card { display: flex; flex-direction: column; background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; text-decoration: none; box-shadow: 0 1px 4px rgba(0,0,0,.04); transition: transform .25s, box-shadow .25s; }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 14px 32px rgba(255,95,31,.12); }
        .blog-card-img { position: relative; aspect-ratio: 16/10; background: #fff4ef; overflow: hidden; }
        .blog-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
        .blog-card:hover .blog-card-img img { transform: scale(1.05); }
        .blog-card-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 44px; }
        .blog-card-body { padding: 20px 22px 22px; display: flex; flex-direction: column; flex: 1; }
        .blog-card-body h3 { font-size: 17px; font-weight: 800; color: #111; line-height: 1.3; margin: 10px 0 8px; }

        .blog-tag { align-self: flex-start; font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #c2410c; background: #fff4ef; padding: 4px 10px; border-radius: 6px; }
        .blog-excerpt { font-size: 13.5px; color: #6b7280; line-height: 1.65; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .blog-meta { margin-top: auto; padding-top: 14px; font-size: 12px; color: #9ca3af; }

        .blog-pager { display: flex; align-items: center; justify-content: center; gap: 18px; margin-top: 44px; font-size: 13px; color: #6b7280; }
        .blog-pager a { padding: 10px 18px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; color: #111; font-weight: 700; text-decoration: none; }
        .blog-pager a:hover { border-color: #ff5f1f; color: #ff5f1f; }

        @media (max-width: 900px) {
          .blog-featured { grid-template-columns: 1fr; }
          .blog-featured-img { min-height: 220px; }
          .blog-featured-body { padding: 24px 22px; }
          .blog-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
        }
        @media (max-width: 560px) { .blog-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
