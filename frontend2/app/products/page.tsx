'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PRODUCTS, productImage } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';

type Sort = 'default' | 'az' | 'za';
type View = 'grid' | 'list';

export default function ProductsPage() {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [view, setView] = useState<View>('grid');
  const [mobileFilters, setMobileFilters] = useState(false);

  // hydrate ?cat= from url
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const c = p.get('cat');
    if (c) setCat(c);
  }, []);

  const filtered = useMemo(() => {
    let list = PRODUCTS;
    if (cat !== 'all') list = list.filter((p) => p.category_id === cat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.code || '').toLowerCase().includes(q) ||
          (p.applications || '').toLowerCase().includes(q)
      );
    }
    const out = [...list];
    if (sort === 'az') out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') out.sort((a, b) => b.name.localeCompare(a.name));
    return out;
  }, [cat, query, sort]);

  const reset = () => {
    setQuery('');
    setCat('all');
    setSort('default');
  };

  return (
    <div>
      {/* Page header */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-10 sm:py-14 lg:py-16">
          <Reveal>
            <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[--color-ink-800]">{t('nav.products')}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-4xl sm:text-5xl lg:text-6xl">{t('products.title')}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-[--color-ink-600] text-base sm:text-lg">
              {t('products.sub', { n: PRODUCTS.length })}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main */}
      <section className="sec pt-8! sm:pt-10! lg:pt-12!">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-7">
              <FiltersPanel
                cat={cat}
                setCat={setCat}
                onReset={reset}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
              <div className="relative flex-1 sm:max-w-md">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--color-ink-400]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('products.search')}
                  className="input pl-10 py-3!"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3 py-2.5 border border-[--color-ink-200] rounded-md text-sm font-medium text-[--color-ink-800] hover:bg-[--color-cream]"
                >
                  <FilterIcon /> {t('products.filters')}
                </button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="input py-2.5! w-auto! pr-8 cursor-pointer text-sm"
                  aria-label={t('products.sort')}
                >
                  <option value="default">{t('products.sort.default')}</option>
                  <option value="az">{t('products.sort.az')}</option>
                  <option value="za">{t('products.sort.za')}</option>
                </select>

                <div className="hidden sm:inline-flex rounded-md border border-[--color-ink-200] bg-white p-0.5">
                  <button
                    onClick={() => setView('grid')}
                    aria-label={t('products.view.grid')}
                    className={`size-9 grid place-items-center rounded ${
                      view === 'grid' ? 'bg-[--color-brand-600] text-white' : 'text-[--color-ink-600]'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="2" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="8" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="2" y="8" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
                      <rect x="8" y="8" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.4"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    aria-label={t('products.view.list')}
                    className={`size-9 grid place-items-center rounded ${
                      view === 'list' ? 'bg-[--color-brand-600] text-white' : 'text-[--color-ink-600]'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 4h8M3 7h8M3 10h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Count + reset */}
            <div className="flex items-center justify-between text-sm text-[--color-ink-500] mb-5">
              <span><span className="font-semibold text-[--color-ink-900]">{filtered.length}</span> {t('products.found')}</span>
              {(cat !== 'all' || query) && (
                <button onClick={reset} className="text-[--color-brand-700] hover:underline font-medium">
                  {t('products.reset')}
                </button>
              )}
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <Reveal>
                <div className="card p-12 text-center">
                  <div className="display text-2xl text-[--color-ink-900]">{t('products.empty')}</div>
                  <p className="mt-2 text-sm text-[--color-ink-600]">{t('products.empty.sub')}</p>
                  <button onClick={reset} className="btn btn-primary mt-6">{t('products.reset')}</button>
                </div>
              </Reveal>
            ) : (
              <AnimatePresence mode="wait">
                {view === 'grid' ? (
                  <motion.div
                    key={`grid-${cat}-${query}-${sort}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5"
                  >
                    {filtered.map((p, i) => (
                      <ProductCard key={p.id} product={p} idx={i} showApplications={false} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.ul
                    key={`list-${cat}-${query}-${sort}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="card overflow-hidden divide-y divide-[--color-ink-100]"
                  >
                    {filtered.map((p, i) => {
                      const sae = p.specs?.sae as string | undefined;
                      const api = p.specs?.api as string | undefined;
                      return (
                        <li key={p.id}>
                          <Link
                            href={`/products/${p.id}`}
                            className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-5 hover:bg-[--color-paper] transition-colors"
                          >
                            <span className="text-xs text-[--color-ink-400] hidden sm:block w-10 shrink-0">
                              {String(i + 1).padStart(3, '0')}
                            </span>
                            <div className="size-16 sm:size-20 shrink-0 grid place-items-center rounded-md bg-[--color-cream] overflow-hidden">
                              <img
                                src={productImage(p, i)}
                                alt={p.name}
                                className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display font-semibold text-base sm:text-lg text-[--color-ink-900] line-clamp-1 group-hover:text-[--color-brand-700] transition-colors">
                                {p.name}
                              </h3>
                              {p.applications && (
                                <p className="text-xs sm:text-sm text-[--color-ink-500] line-clamp-1">{p.applications}</p>
                              )}
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                {sae && <span className="tag tag-amber text-[10px]! py-0.5! px-1.5!">SAE {sae}</span>}
                                {api && <span className="tag tag-neutral text-[10px]! py-0.5! px-1.5!">API {api}</span>}
                                {p.code && <span className="text-[10px] text-[--color-ink-500]">{p.code}</span>}
                              </div>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand-700] shrink-0 group-hover:translate-x-1 transition-transform">
                              {t('cta.details')}
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 bg-[--color-ink-900]/40 z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[min(20rem,86vw)] bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[--color-ink-100]">
                <h3 className="font-display font-semibold text-lg">{t('products.filters')}</h3>
                <button
                  onClick={() => setMobileFilters(false)}
                  className="inline-flex items-center justify-center size-9 rounded-md text-[--color-ink-700] hover:bg-[--color-cream]"
                  aria-label={t('nav.close')}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FiltersPanel cat={cat} setCat={(c) => { setCat(c); setMobileFilters(false); }} onReset={reset} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FiltersPanel({
  cat,
  setCat,
  onReset,
}: {
  cat: string;
  setCat: (c: string) => void;
  onReset: () => void;
}) {
  const { t, pick } = useLang();
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-[--color-ink-900]">
          {t('products.filters')}
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-[--color-brand-700] hover:underline font-medium"
        >
          {t('products.reset')}
        </button>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-[--color-ink-500] font-semibold mb-3">
          {t('products.all')}
        </div>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => setCat('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                cat === 'all'
                  ? 'bg-[--color-brand-50] text-[--color-brand-700] font-semibold'
                  : 'text-[--color-ink-800] hover:bg-[--color-cream]'
              }`}
            >
              <span>{t('products.all')}</span>
              <span className="text-xs opacity-60">{PRODUCTS.length}</span>
            </button>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setCat(c.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left ${
                  cat === c.id
                    ? 'bg-[--color-brand-50] text-[--color-brand-700] font-semibold'
                    : 'text-[--color-ink-800] hover:bg-[--color-cream]'
                }`}
              >
                <span className="line-clamp-1">{pick(c.name)}</span>
                <span className="text-xs opacity-60 shrink-0">{c.products.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="hairline my-7" />

      <div className="bg-[--color-cream] rounded-xl p-5">
        <h4 className="font-display font-semibold text-sm text-[--color-ink-900]">Yordam kerakmi?</h4>
        <p className="mt-1.5 text-xs text-[--color-ink-600] leading-relaxed">
          Texnikangiz uchun aniq formulani topishga mutaxassislar yordam beradi.
        </p>
        <Link href="/contacts" className="btn btn-primary btn-sm mt-4 w-full">
          {t('cta.consult')}
        </Link>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M3.5 7h7M5 10h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}
