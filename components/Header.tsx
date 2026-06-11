'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CartIcon from './CartIcon';
import { useAuth } from '../lib/auth-context';
import { useBrand, BrandMode } from '../lib/brand-context';
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { BiChevronDown } from 'react-icons/bi';
import { Sparkles, Pill, Leaf } from 'lucide-react';

type NavItem = { name: string; to: string; submenu?: { name: string; to: string }[]; highlight?: boolean };

const navItems: NavItem[] = [
  { name: 'Home', to: '/' },
  {
    name: 'Products',
    to: '/shop',
    submenu: [
      { name: 'Cosmetics', to: '/shop?type=cosmetics' },
      { name: 'Nutraceuticals', to: '/shop?type=nutraceuticals' },
      { name: 'Ayurveda', to: '/shop?type=ayurveda' },
      { name: 'Face Care', to: '/shop?cat=face' },
      { name: 'Hair Care', to: '/shop?cat=hair' },
      { name: 'Body Care', to: '/shop?cat=body' },
      { name: 'Vitamins & Supplements', to: '/shop?cat=vitamins' },
    ],
  },
  { name: 'Offers', to: '/offers', highlight: true },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
];

function BrandSwitcher() {
  const { mode, setMode, theme } = useBrand();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#f3f4f6',
        borderRadius: 8,
        padding: 3,
        gap: 2,
      }}
    >
      {(['cosmetics', 'nutraceuticals', 'ayurveda'] as BrandMode[]).map((m) => {
        const active = mode === m;
        const colors: Record<BrandMode, string> = {
          cosmetics: '#ff5f1f',
          nutraceuticals: '#0d9488',
          ayurveda: '#008000',
        };
        const icons: Record<BrandMode, React.ReactNode> = {
          cosmetics: <Sparkles size={11} />,
          nutraceuticals: <Pill size={11} />,
          ayurveda: <Leaf size={11} />,
        };
        const labels: Record<BrandMode, string> = {
          cosmetics: 'Cosmetics',
          nutraceuticals: 'Nutraceuticals',
          ayurveda: 'Ayurveda',
        };
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              fontSize: 11,
              fontWeight: active ? 700 : 500,
              letterSpacing: '0.03em',
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: active ? colors[m] : 'transparent',
              color: active ? '#fff' : '#6b7280',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {icons[m]}
            {labels[m]}
          </button>
        );
      })}
    </div>
  );
}

export default function Header() {
  const location = usePathname();
  const [search, setSearch] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopSubmenuOpen, setShopSubmenuOpen] = useState(false);
  const [mobileShopSubmenuOpen, setMobileShopSubmenuOpen] = useState(false);
  const router = useRouter();
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, logout } = useAuth();
  const { theme, mode, setMode } = useBrand();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setShopSubmenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowMobileSearch(false);
    }
  }

  return (
    <>
      {/* ── DESKTOP HEADER ── */}
      <header
        style={{
          borderBottom: '1px solid #f0f0f0',
          background: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 500,
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <Image
                src="/atulya-logo.png"
                alt="Atulya Medilink"
                width={160}
                height={48}
                style={{ height: 44, width: 'auto', objectFit: 'contain' }}
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="header-desktop" style={{ alignItems: 'center', gap: 0 }}>
                {navItems.map((item) => (
                  <div key={item.name} style={{ position: 'relative' }} ref={item.name === 'Products' ? shopMenuRef : undefined}>
                    {item.submenu ? (
                      <div
                        onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setShopSubmenuOpen(true); }}
                        onMouseLeave={() => { timeoutRef.current = setTimeout(() => setShopSubmenuOpen(false), 200); }}
                      >
                        <button
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 16px', fontSize: 13, fontWeight: 500,
                            color: location.startsWith(item.to) ? theme.primary : '#374151',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            borderBottom: location.startsWith(item.to) ? `2px solid ${theme.primary}` : '2px solid transparent',
                            transition: 'color 0.2s, border-color 0.2s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = theme.primary; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = location.startsWith(item.to) ? theme.primary : '#374151'; }}
                        >
                          {item.name}
                          <BiChevronDown style={{ transition: 'transform 0.2s', transform: shopSubmenuOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>

                        {shopSubmenuOpen && (
                          <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 8, zIndex: 100 }}>
                            <div style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 220, borderRadius: 10, overflow: 'hidden' }}>
                              {item.submenu.map((sub) => (
                                <Link
                                  key={sub.name}
                                  href={sub.to}
                                  style={{
                                    display: 'block', padding: '10px 16px', fontSize: 13, fontWeight: 500,
                                    color: '#374151', textDecoration: 'none',
                                    borderBottom: '1px solid rgba(0,0,0,0.04)',
                                    transition: 'background 0.15s, color 0.15s',
                                    borderLeft: '3px solid transparent',
                                  }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = theme.bgLight; (e.currentTarget as HTMLElement).style.color = theme.primary; (e.currentTarget as HTMLElement).style.borderLeftColor = theme.primary; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#374151'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.to}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: item.highlight ? '5px 14px' : '6px 16px',
                          fontSize: 13, fontWeight: item.highlight ? 700 : 500,
                          textDecoration: 'none',
                          color: item.highlight ? '#fff' : (location === item.to ? theme.primary : '#374151'),
                          background: item.highlight ? theme.primary : 'transparent',
                          borderBottom: !item.highlight && location === item.to ? `2px solid ${theme.primary}` : '2px solid transparent',
                          borderRadius: item.highlight ? 6 : 0,
                          transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                          letterSpacing: item.highlight ? '0.04em' : 'normal',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          if (item.highlight) { el.style.background = theme.primaryDark; }
                          else { el.style.color = theme.primary; }
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          if (item.highlight) { el.style.background = theme.primary; }
                          else { el.style.color = location === item.to ? theme.primary : '#374151'; }
                        }}
                      >
                        {item.highlight && <span>🏷️</span>}
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

              {/* Brand Switcher (Desktop) */}
              <div className="header-desktop"><BrandSwitcher /></div>

              {/* Desktop Search */}
              <form className="header-desktop" onSubmit={handleSearch} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', background: '#f9fafb', padding: '7px 12px', gap: 8, width: 200, borderRadius: 8 }}>
                  <FiSearch style={{ color: '#9ca3af', flexShrink: 0 }} size={14} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#374151', width: '100%' }}
                  />
                </div>
              </form>

              {/* User (Desktop) */}
              <div className="header-desktop" style={{ position: 'relative' }} ref={userMenuRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        style={{
                          width: 36, height: 36, background: theme.primary, color: '#fff',
                          border: 'none', borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </button>
                      {userMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: 180, zIndex: 200, borderRadius: 10 }}>
                          <div style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0' }}>
                            <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{user.name}</p>
                            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{user.email}</p>
                          </div>
                          <Link href="/my-account" onClick={() => setUserMenuOpen(false)}
                            style={{ display: 'block', padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#374151', textDecoration: 'none', borderBottom: '1px solid #f0f0f0' }}
                            onMouseEnter={e => (e.currentTarget.style.background = theme.bgLight)}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            My Account
                          </Link>
                          <button onClick={() => { logout(); setUserMenuOpen(false); }}
                            style={{ display: 'block', width: '100%', padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, border: '1px solid #e5e7eb', borderRadius: 8, color: '#374151', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = theme.bgLight; (e.currentTarget as HTMLElement).style.borderColor = theme.primary; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'; }}
                    >
                      <FiUser size={16} />
                    </Link>
                  )}
                </div>

              {/* Cart */}
              <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 10 }}>
                <CartIcon />
              </div>

              {/* Mobile Search toggle */}
              {!showMobileSearch && (
                <button className="header-mobile" onClick={() => setShowMobileSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 6 }}>
                  <FiSearch size={20} />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="header-mobile"
                onClick={() => setMobileMenuOpen(true)}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
              >
                <FiMenu size={20} />
              </button>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
              <div style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 50, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
                <form style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }} onSubmit={handleSearch}>
                  <FiSearch style={{ color: '#9ca3af' }} size={16} />
                  <input autoFocus type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent' }} />
                  <button type="button" onClick={() => setShowMobileSearch(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}>
                    <FiX size={20} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <>
        <div onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 600, opacity: mobileMenuOpen ? 1 : 0, visibility: mobileMenuOpen ? 'visible' : 'hidden', transition: 'opacity 0.3s' }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '85%', maxWidth: 340,
            background: '#fff', zIndex: 700, borderLeft: '1px solid #f0f0f0',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.32s cubic-bezier(.16,1,.3,1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
          }}>
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
              <Image src="/atulya-logo.png" alt="Atulya Medilink" width={140} height={40} style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: '#f3f4f6', border: 'none', color: '#374151', width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <FiX size={17} />
              </button>
            </div>

            {/* Brand switcher in mobile */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>SWITCH CATEGORY</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['cosmetics', 'nutraceuticals', 'ayurveda'] as BrandMode[]).map((m) => {
                  const active = mode === m;
                  const colors: Record<BrandMode, string> = { cosmetics: '#ff5f1f', nutraceuticals: '#0d9488', ayurveda: '#008000' };
                  const icons: Record<BrandMode, React.ReactNode> = { cosmetics: <Sparkles size={12} />, nutraceuticals: <Pill size={12} />, ayurveda: <Leaf size={12} /> };
                  const labels: Record<BrandMode, string> = { cosmetics: 'Cosmetics', nutraceuticals: 'Nutra', ayurveda: 'Ayurveda' };
                  return (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        flex: 1, padding: '10px 8px', fontSize: 11, fontWeight: 600,
                        borderRadius: 8, border: `1.5px solid ${active ? colors[m] : '#e5e7eb'}`,
                        background: active ? colors[m] : '#fff',
                        color: active ? '#fff' : '#6b7280',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      }}
                    >
                      {icons[m]}
                      {labels[m]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {navItems.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <div style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <button onClick={() => setMobileShopSubmenuOpen(!mobileShopSubmenuOpen)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', fontSize: 15, fontWeight: 500, color: '#111', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {item.name}
                        <BiChevronDown style={{ transition: 'transform 0.2s', transform: mobileShopSubmenuOpen ? 'rotate(180deg)' : 'none', color: '#9ca3af' }} />
                      </button>
                      {mobileShopSubmenuOpen && (
                        <div style={{ paddingLeft: 20, paddingBottom: 8 }}>
                          {item.submenu.map((sub) => (
                            <Link key={sub.name} href={sub.to} onClick={() => setMobileMenuOpen(false)}
                              style={{ display: 'block', padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#6b7280', textDecoration: 'none', borderLeft: `2px solid #e5e7eb`, marginBottom: 4 }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = theme.primary; (e.currentTarget as HTMLElement).style.borderLeftColor = theme.primary; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; (e.currentTarget as HTMLElement).style.borderLeftColor = '#e5e7eb'; }}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href={item.to} onClick={() => setMobileMenuOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '14px 20px', fontSize: 15, fontWeight: item.highlight ? 700 : 500,
                        color: item.highlight ? theme.primary : (location === item.to ? theme.primary : '#111'),
                        textDecoration: 'none', borderBottom: '1px solid #f0f0f0',
                        borderLeft: location === item.to ? `3px solid ${theme.primary}` : '3px solid transparent',
                        background: item.highlight ? theme.bgLight : 'transparent',
                      }}
                    >
                      {item.highlight && <span>🏷️</span>}
                      {item.name}
                      {item.highlight && <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: theme.primary, padding: '2px 8px', borderRadius: 10, letterSpacing: '0.08em' }}>SALE</span>}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Auth footer */}
            <div style={{ padding: 20, borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
              {user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                    <div style={{ width: 36, height: 36, background: theme.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, borderRadius: 8 }}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{user.name}</p>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                    style={{ width: '100%', padding: '12px 16px', fontSize: 13, fontWeight: 700, color: '#fff', background: theme.primary, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'block', padding: '14px 16px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: theme.primary, borderRadius: 8 }}
                >
                  LOG IN / SIGN UP
                </Link>
              )}
            </div>
          </div>
      </>
    </>
  );
}
