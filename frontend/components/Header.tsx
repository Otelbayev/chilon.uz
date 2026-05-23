'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';
import { useLang } from '@/lib/i18n';

const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/about', key: 'nav.about' },
  { href: '/products', key: 'nav.products' },
  { href: '/partners', key: 'nav.partners' },
  { href: '/news', key: 'nav.news' },
  { href: '/contacts', key: 'nav.contacts' },
];

export default function Header() {
  const path = usePathname();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const homeScroll = document.documentElement.dataset.homeScrolled === '1';
      const heroActive = document.documentElement.dataset.heroActive === '1';
      setScrolled(window.scrollY > 12 || homeScroll);
      setOnHero(heroActive);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const interval = setInterval(onScroll, 120);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => { setMobileOpen(false); }, [path]);

  // When on hero AND not scrolled past it — show white text over the video.
  const light = onHero && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-ink-100'
          : light
          ? 'bg-gradient-to-b from-black/40 to-transparent'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 lg:h-20">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  active
                    ? light ? 'text-white' : 'text-brand-700'
                    : light ? 'text-white/85 hover:text-white' : 'text-ink-700 hover:text-brand-600'
                }`}
              >
                {t(item.key)}
                {active && (
                  <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${light ? 'bg-white' : 'bg-brand-500'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitcher light={light} />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden grid place-items-center w-10 h-10 rounded-full border ${
              light ? 'border-white/40 text-white' : 'border-ink-300 text-ink-900'
            }`}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {mobileOpen ? (
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M2 5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-ink-100">
          <nav className="container-x py-4 flex flex-col gap-1">
            {NAV.map((item) => {
              const active = item.href === '/' ? path === '/' : path.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                    active ? 'bg-brand-50 text-brand-700' : 'hover:bg-ink-100'
                  }`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
