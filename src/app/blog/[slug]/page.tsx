import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPostBySlug, fetchPosts, formatDate, stripHtml, SITE_URL } from '../../../../lib/blog';

export const revalidate = 300; // edits in WordPress show up within 5 minutes

type Props = { params: Promise<{ slug: string }> };

// Metadata is generated automatically from the WordPress post. If an SEO plugin
// (Yoast / RankMath) is set on the post, its title/description/image win.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return { title: 'Article not found | Atulya Medilink', robots: { index: false, follow: false } };

  const title = post.seo.title || `${post.title} | Atulya Medilink Blog`;
  const description = (post.seo.description || post.excerpt || stripHtml(post.contentHtml)).slice(0, 160);
  const image = post.seo.ogImage || post.image || undefined;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: post.author }],
    keywords: post.categories.map((c) => c.name),
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Atulya Medilink',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
      images: image ? [{ url: image, alt: post.imageAlt }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: { index: true, follow: true },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) notFound();

  const primaryCat = post.categories[0];
  const { posts: relatedRaw } = await fetchPosts({ perPage: 4, category: primaryCat?.id, exclude: post.id });
  const related = relatedRaw.filter((p) => p.id !== post.id).slice(0, 3);

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo.description || post.excerpt,
    image: post.image ? [post.image] : undefined,
    datePublished: post.date,
    dateModified: post.modified,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Atulya Medilink',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        {/* Header */}
        <header style={{ background: 'linear-gradient(180deg,#fff4ef 0%,#fff 100%)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 22px 28px' }}>
            <nav style={{ fontSize: 12, color: '#9ca3af', marginBottom: 18 }}>
              <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
              {primaryCat && (<><span style={{ margin: '0 8px' }}>/</span>
                <Link href={`/blog?category=${primaryCat.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{primaryCat.name}</Link></>)}
            </nav>
            {primaryCat && (
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c2410c', background: '#ffe9dd', padding: '5px 11px', borderRadius: 6 }}>
                {primaryCat.name}
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(28px,4.4vw,46px)', fontWeight: 900, letterSpacing: '-0.025em', lineHeight: 1.12, color: '#111', margin: '16px 0 16px', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>
              {post.title}
            </h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>
              By <strong style={{ color: '#374151' }}>{post.author}</strong> · {formatDate(post.date)} · {post.readingMinutes} min read
            </p>
          </div>
        </header>

        {post.image && (
          <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 22px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.imageAlt} style={{ width: '100%', maxHeight: 520, objectFit: 'cover', borderRadius: 18, display: 'block' }} />
          </div>
        )}

        {/* Body (HTML written in WordPress) */}
        <div className="blog-content" style={{ maxWidth: 740, margin: '0 auto', padding: '36px 22px 20px' }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {/* CTA */}
        <div style={{ maxWidth: 740, margin: '12px auto 0', padding: '0 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '22px 24px', background: '#fff4ef', border: '1px solid #fde2d3', borderRadius: 16 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>Looking for the right product?</p>
              <p style={{ fontSize: 13, color: '#6b7280' }}>Explore Atulya&apos;s skincare, supplements &amp; Ayurveda range.</p>
            </div>
            <Link href="/shop" style={{ background: '#ff5f1f', color: '#fff', padding: '12px 22px', borderRadius: 10, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Shop Now →
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 22px 72px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#111', marginBottom: 20, letterSpacing: '-0.02em' }}>You may also like</h2>
          <div className="related-grid">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="related-card">
                <div className="related-img">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.imageAlt} loading="lazy" />
                  ) : <span>🌿</span>}
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111', lineHeight: 1.35, marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{formatDate(p.date)} · {p.readingMinutes} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ textAlign: 'center', paddingBottom: 56 }}>
        <Link href="/blog" style={{ fontSize: 13, fontWeight: 700, color: '#ff5f1f', textDecoration: 'none' }}>← Back to all articles</Link>
      </div>

      <style>{`
        .blog-content { font-size: 17px; line-height: 1.85; color: #374151; }
        .blog-content > * + * { margin-top: 1.1em; }
        .blog-content h2 { font-size: 26px; font-weight: 800; color: #111; line-height: 1.3; margin-top: 1.8em; letter-spacing: -.01em; }
        .blog-content h3 { font-size: 21px; font-weight: 800; color: #111; line-height: 1.35; margin-top: 1.5em; }
        .blog-content h4 { font-size: 18px; font-weight: 700; color: #111; margin-top: 1.3em; }
        .blog-content a { color: #ea580c; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content strong { color: #111; }
        .blog-content ul, .blog-content ol { padding-left: 1.4em; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li + li { margin-top: .4em; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 14px; }
        .blog-content figure { margin: 1.6em 0; }
        .blog-content figcaption { font-size: 13px; color: #9ca3af; text-align: center; margin-top: 8px; }
        .blog-content blockquote { border-left: 4px solid #ff5f1f; background: #fff4ef; padding: 14px 20px; border-radius: 0 12px 12px 0; font-style: italic; color: #4b5563; }
        .blog-content table { width: 100%; border-collapse: collapse; font-size: 15px; display: block; overflow-x: auto; }
        .blog-content th, .blog-content td { border: 1px solid #f0f0f0; padding: 10px 12px; text-align: left; }
        .blog-content th { background: #fafafa; font-weight: 700; }
        .blog-content iframe { max-width: 100%; border-radius: 12px; }
        .blog-content hr { border: none; border-top: 1px solid #f0f0f0; margin: 2em 0; }

        .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .related-card { display: block; background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; overflow: hidden; text-decoration: none; transition: transform .25s, box-shadow .25s; }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(255,95,31,.12); }
        .related-img { aspect-ratio: 16/10; background: #fff4ef; display: flex; align-items: center; justify-content: center; font-size: 36px; overflow: hidden; }
        .related-img img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 800px) { .related-grid { grid-template-columns: 1fr; } .blog-content { font-size: 16px; } }
      `}</style>
    </div>
  );
}
