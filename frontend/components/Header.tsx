'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import Logo from './Logo';
import LangSwitcher from './LangSwitcher';
import { useLang } from '@/lib/i18n';
import { api, pickLang } from '@/lib/api';
import type { Category, Product, NewsItem } from '@/lib/types';

type NavItem = {
  href: string;
  key: string;
  dropdown?: 'products';
};

const NAV: NavItem[] = [
  { href: '/about', key: 'nav.about' },
  { href: '/news', key: 'nav.news' },
  { href: '/products', key: 'nav.products', dropdown: 'products' },
  { href: '/buy', key: 'nav.buy' },
  { href: '/specialists', key: 'nav.specialists' },
];

export default function Header() {
  const path = usePathname();
  const { lang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const dropdownTimeout = useRef<number | null>(null);

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

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setSearchOpen(false);
  }, [path]);

  useEffect(() => {
    let cancelled = false;
    api.categories(lang).then((cats) => {
      if (!cancelled) setCategories(cats || []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  const openDropdown = () => {
    if (dropdownTimeout.current) {
      window.clearTimeout(dropdownTimeout.current);
      dropdownTimeout.current = null;
    }
    setProductsOpen(true);
  };

  const closeDropdown = () => {
    if (dropdownTimeout.current) window.clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = window.setTimeout(() => setProductsOpen(false), 120);
  };

  // White-on-video look only while on hero AND not scrolled
  const light = onHero && !scrolled;

  return (
    <>
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
              const active = path === item.href || (item.href !== '/' && path.startsWith(item.href));
              const isDropdown = item.dropdown === 'products';
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={isDropdown ? openDropdown : undefined}
                  onMouseLeave={isDropdown ? closeDropdown : undefined}
                >
                  <Link
                    href={item.href}
                    className={`relative inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      active
                        ? light ? 'text-white' : 'text-brand-700'
                        : light ? 'text-white/85 hover:text-white' : 'text-ink-700 hover:text-brand-600'
                    }`}
                  >
                    {t(item.key)}
                    {isDropdown && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        className={`transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {active && (
                      <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${light ? 'bg-white' : 'bg-brand-500'}`} />
                    )}
                  </Link>

                  {isDropdown && productsOpen && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(40rem,90vw)] z-50"
                      onMouseEnter={openDropdown}
                      onMouseLeave={closeDropdown}
                    >
                      <div className="rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-black/10 overflow-hidden">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                          {categories.map((c) => {
                            const name = pickLang(c.name as any, lang);
                            const desc = pickLang(c.description as any, lang);
                            return (
                              <li key={c.id}>
                                <Link
                                  href={`/products?category=${c.id}`}
                                  className="group flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
                                >
                                  <span className="text-sm font-medium text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                                    {name}
                                  </span>
                                  {desc && (
                                    <span className="text-xs text-ink-500 line-clamp-1">{desc}</span>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="border-t border-ink-100 px-3 py-2.5 bg-ink-50/50">
                          <Link
                            href="/products"
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                          >
                            {t('hero.cta.products')}
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`grid place-items-center w-10 h-10 rounded-full border transition-colors ${
                light
                  ? 'border-white/40 text-white hover:bg-white/10'
                  : 'border-ink-300 text-ink-900 hover:border-brand-500 hover:text-brand-600'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
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
                const active = path === item.href || (item.href !== '/' && path.startsWith(item.href));
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
              {categories.length > 0 && (
                <div className="mt-2 pt-3 border-t border-ink-100">
                  <div className="px-4 pb-2 text-xs uppercase tracking-wider text-ink-500 font-semibold">
                    {t('categories.title')}
                  </div>
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/products?category=${c.id}`}
                      className="block px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-100 rounded-xl"
                    >
                      {pickLang(c.name as any, lang)}
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}

/* ===================================================== */
/* Search modal                                           */
/* ===================================================== */
function SearchModal({ onClose }: { onClose: () => void }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.products(lang, { limit: 50 }),
      api.categories(lang),
      api.news(lang, { limit: 12 }),
    ]).then(([p, c, n]) => {
      if (cancelled) return;
      setProducts((Array.isArray(p) ? p : p.items) || []);
      setCategories(c || []);
      setNews((Array.isArray(n) ? n : n.items) || []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  const q = query.trim().toLowerCase();

  const matchedCategories = useMemo(() => {
    if (!q) return [] as Category[];
    return categories.filter((c) => {
      const name = pickLang(c.name as any, lang).toLowerCase();
      const desc = pickLang(c.description as any, lang).toLowerCase();
      return name.includes(q) || desc.includes(q);
    }).slice(0, 5);
  }, [q, categories, lang]);

  const matchedProducts = useMemo(() => {
    if (!q) return [] as Product[];
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q)
    ).slice(0, 8);
  }, [q, products]);

  const matchedNews = useMemo(() => {
    if (!q) return [] as NewsItem[];
    return news.filter((n) => pickLang(n.title as any, lang).toLowerCase().includes(q)).slice(0, 5);
  }, [q, news, lang]);

  const hasResults = matchedCategories.length + matchedProducts.length + matchedNews.length > 0;

  const submit = () => {
    if (!q) return;
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
        <form
          onSubmit={(e) => { e.preventDefault(); submit(); }}
          className="flex items-center gap-3 px-5 py-4 border-b border-ink-100"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-ink-500 shrink-0">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent outline-none text-base sm:text-lg text-ink-900 placeholder:text-ink-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-8 h-8 rounded-full hover:bg-ink-100 text-ink-500"
            aria-label={t('common.close')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!q && (
            <div className="px-3 py-8 text-center text-sm text-ink-500">
              {t('search.placeholder')}
            </div>
          )}
          {q && !hasResults && (
            <div className="px-3 py-8 text-center text-sm text-ink-500">
              {t('search.empty')}
            </div>
          )}

          {matchedCategories.length > 0 && (
            <Section title={t('categories.title')}>
              {matchedCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50"
                >
                  <span className="grid place-items-center size-8 rounded-lg bg-brand-100 text-brand-700">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                      <rect x="8" y="1.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                      <rect x="1.5" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                      <rect x="8" y="8" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-ink-900">{pickLang(c.name as any, lang)}</span>
                </Link>
              ))}
            </Section>
          )}

          {matchedProducts.length > 0 && (
            <Section title={t('nav.products')}>
              {matchedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50"
                >
                  <span className="text-sm font-medium text-ink-900 line-clamp-1">{p.name}</span>
                  {p.code && (
                    <span className="text-[10px] uppercase tracking-wider text-ink-500 shrink-0">{p.code}</span>
                  )}
                </Link>
              ))}
            </Section>
          )}

          {matchedNews.length > 0 && (
            <Section title={t('nav.news')}>
              {matchedNews.map((n) => (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  onClick={onClose}
                  className="block px-3 py-2.5 rounded-xl hover:bg-brand-50 text-sm text-ink-900 line-clamp-1"
                >
                  {pickLang(n.title as any, lang)}
                </Link>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        {title}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
