'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import { useBrand } from '../lib/brand-context';

export default function Footer() {
  const { theme } = useBrand();

  return (
    <footer style={{ background: theme.primary }}>

      {/* ── Marquee belt ── */}
      <div style={{ overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.15)', padding: '11px 0' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'mq-fwd 26s linear infinite' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'inline-flex' }}>
              {['ATULYA MEDILINK', 'NATURAL COSMETICS', 'CLINICAL NUTRACEUTICALS', 'CRUELTY FREE', 'GMP CERTIFIED', 'MADE IN INDIA'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 24px', fontSize: 9, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
                  {t}
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 6 }}>◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 44px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: '40px 32px' }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 20 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: '10px 18px', display: 'inline-block' }}>
                <Image
                  src="/atulya-logo.png"
                  alt="Atulya Medilink"
                  width={160}
                  height={48}
                  style={{ height: 40, width: 'auto', objectFit: 'contain', display: 'block' }}
                />
              </div>
            </Link>
            <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.85, marginBottom: 10, maxWidth: 260 }}>
              Natural cosmetics and clinical-grade nutraceuticals — formulated for your health and beauty.
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxWidth: 260, marginBottom: 24 }}>
              Unit-604, Ring Road Mall Manglam Place Plot 21,<br />Sector-3 Rohini, Delhi — 110085
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { href: 'https://www.facebook.com/profile.php?id=100082480930383&sk=reels_tab', icon: <FaFacebookF size={12} />, label: 'Facebook' },
                { href: 'https://instagram.com/officialatulya', icon: <FaInstagram size={12} />, label: 'Instagram' },
                { href: 'https://youtube.com/@atulyamedilink4119', icon: <FaYoutube size={12} />, label: 'YouTube' },
                { href: 'https://linkedin.com/in/atulya-medilink-877408101', icon: <FaLinkedinIn size={12} />, label: 'LinkedIn' },
                { href: 'https://wa.me/911141447223', icon: <FaWhatsapp size={12} />, label: 'WhatsApp' },
              ].map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ width: 34, height: 34, border: '1px solid rgba(255,255,255,0.35)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s, background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', marginBottom: 20, fontWeight: 700 }}>PRODUCTS</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Cosmetics', to: '/shop?type=cosmetics' },
                { name: 'Nutraceuticals', to: '/shop?type=nutraceuticals' },
                { name: 'Face Care', to: '/shop?cat=face' },
                { name: 'Hair Care', to: '/shop?cat=hair' },
                { name: 'Vitamins & Supplements', to: '/shop?cat=vitamins' },
                { name: 'All Products', to: '/shop' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link
                    href={to}
                    style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', marginBottom: 20, fontWeight: 700 }}>COMPANY</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'About Us', to: '/about' },
                { name: 'Contact Us', to: '/contact' },
                { name: 'Privacy Policy', to: '/privacy-policy' },
                { name: 'Terms & Conditions', to: '/terms-and-conditions' },
                { name: 'Returns & Refunds', to: '/returns-and-refunds-policy' },
                { name: 'Disclaimer', to: '/disclaimer' },
              ].map(({ name, to }) => (
                <li key={name}>
                  <Link
                    href={to}
                    style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', marginBottom: 20, fontWeight: 700 }}>CONTACT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Phone', val: '+91 88511 80015' },
                { label: 'WhatsApp', val: '+91 11414 47223' },
                { label: 'Email', val: 'info@atulyamedilinkpvtltd.com' },
                { label: 'Address', val: 'Rohini, Delhi – 110085' },
              ].map((item) => (
                <li key={item.label}>
                  <span style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 3 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: theme.primaryDark, padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ fontSize: 11, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.7)' }}>
          © {new Date().getFullYear()} Atulya Medilink Pvt Ltd. All rights reserved.
        </p>
        <p style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
          NATURAL · PURE · EFFECTIVE ◆
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
          Developed by{' '}
          <Link
            href="https://proshala.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, transition: 'opacity 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.75')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            Proshala
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes mq-fwd { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
