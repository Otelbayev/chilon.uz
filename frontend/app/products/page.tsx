'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { api, pickLang, productImage } from '@/lib/api';
import type { Category, Product } from '@/lib/types';

type ViewMode = 'grid' | 'list';
type SortMode = 'default' | 'az' | 'za';
const PAGE_SIZE = 24;

export default function ProductsPage() {
  const { lang, t } = useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<string>('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('default');
  const [view, setView] = useState<ViewMode>('grid');
  const [shown, setShown] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.categories(lang),
      api.products(lang, { limit: 500 }),
    ]).then(([cats, prods]) => {
      if (cancelled) return;
      setCategories(cats);
      const arr = Array.isArray(prods) ? prods : prods.items;
      setProducts(arr || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [lang]);

  // Reset pagination when filters change
  useEffect(() => { setShown(PAGE_SIZE); }, [activeCat, search, sort]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat) list = list.filter((p) => p.category_id === activeCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q)
      );
    }
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [products, activeCat, search, sort]);

  // Category counts
  const catCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.category_id, (map.get(p.category_id) || 0) + 1);
    return map;
  }, [products]);

  const visible = filtered.slice(0, shown);
  const hasFilters = !!activeCat || !!search.trim();

  const resetFilters = () => {
    setActiveCat('');
    setSearch('');
    setSort('default');
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumbs */}
      <section className="pt-28 pb-6 sm:pt-32 sm:pb-8 border-b border-ink-100">
        <div className="container-x">
          <nav className="text-xs text-ink-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-brand-600">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-ink-900 font-medium">{t('nav.products')}</span>
          </nav>
          <div className="mt-3 flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {t('products.title')}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-ink-500">{t('products.subtitle')}</p>
            </div>
            <div className="text-sm text-ink-700">
              <span className="font-semibold text-brand-700">{filtered.length}</span>{' '}
              <span className="text-ink-500">{t('products.found')}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x py-6 lg:py-8 grid lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block">
          <FiltersPanel
            t={t}
            lang={lang}
            categories={categories}
            catCount={catCount}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            hasFilters={hasFilters}
            onReset={resetFilters}
          />
        </aside>

        {/* Main */}
        <main>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 mb-5">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('products.search')}
                className="w-full rounded-xl border border-ink-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500"
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm font-medium hover:border-brand-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {t('products.filter')}
                {hasFilters && <span className="size-1.5 rounded-full bg-brand-500" />}
              </button>

              {/* Sort */}
              <SortSelect t={t} value={sort} onChange={setSort} />

              {/* View toggle */}
              <div className="flex items-center rounded-xl border border-ink-200 overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  aria-label={t('products.view.grid')}
                  className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:text-ink-900'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-label={t('products.view.list')}
                  className={`p-2.5 transition-colors ${view === 'list' ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:text-ink-900'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="6.5" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="2" y="10" width="12" height="2.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(activeCat || search.trim()) && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {activeCat && (
                <FilterChip
                  label={pickLang(categories.find((c) => c.id === activeCat)?.name, lang) || activeCat}
                  onRemove={() => setActiveCat('')}
                />
              )}
              {search.trim() && (
                <FilterChip
                  label={`"${search}"`}
                  onRemove={() => setSearch('')}
                />
              )}
              <button
                onClick={resetFilters}
                className="text-xs font-medium text-ink-500 hover:text-brand-600 transition-colors underline underline-offset-4"
              >
                {t('products.reset')}
              </button>
            </div>
          )}

          {/* Grid / list */}
          {loading ? (
            <div className={view === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-3'
            }>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={view === 'grid'
                    ? 'aspect-[4/5] rounded-3xl bg-ink-100 animate-pulse'
                    : 'h-32 rounded-2xl bg-ink-100 animate-pulse'
                  }
                />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-3xl border border-ink-200 p-16 text-center">
              <div className="mx-auto size-14 rounded-full bg-ink-100 grid place-items-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6" stroke="#6b6b6b" strokeWidth="1.6" />
                  <path d="M13.5 13.5L18 18" stroke="#6b6b6b" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-ink-700 font-medium">{t('products.empty')}</p>
              {hasFilters && (
                <button onClick={resetFilters} className="btn-ghost mt-4">
                  {t('products.reset')}
                </button>
              )}
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {visible.map((p, i) => (
                <ShopGridCard key={p.id} product={p} idx={i} t={t} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:gap-4">
              {visible.map((p, i) => (
                <ShopListCard key={p.id} product={p} idx={i} t={t} lang={lang} />
              ))}
            </div>
          )}

          {/* Load more */}
          {!loading && visible.length < filtered.length && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="text-xs text-ink-500">
                {t('products.showing')} {visible.length} {t('products.of')} {filtered.length}
              </div>
              <button
                onClick={() => setShown((s) => s + PAGE_SIZE)}
                className="btn-ghost"
              >
                {t('products.loadMore')}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileFilters(false)}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-ink-100 bg-white">
                <h2 className="font-semibold text-base">{t('products.filter')}</h2>
                <button
                  onClick={() => setMobileFilters(false)}
                  aria-label={t('common.close')}
                  className="grid place-items-center size-8 rounded-full hover:bg-ink-100"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <FiltersPanel
                  t={t}
                  lang={lang}
                  categories={categories}
                  catCount={catCount}
                  activeCat={activeCat}
                  setActiveCat={(v) => { setActiveCat(v); setMobileFilters(false); }}
                  hasFilters={hasFilters}
                  onReset={() => { resetFilters(); setMobileFilters(false); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ====================================================== */
/* Filters Panel (used in sidebar + mobile drawer)        */
/* ====================================================== */
function FiltersPanel({
  t, lang, categories, catCount, activeCat, setActiveCat, hasFilters, onReset,
}: {
  t: (k: string) => string;
  lang: 'uz' | 'en' | 'ru';
  categories: Category[];
  catCount: Map<string, number>;
  activeCat: string;
  setActiveCat: (v: string) => void;
  hasFilters: boolean;
  onReset: () => void;
}) {
  const allCount = Array.from(catCount.values()).reduce((a, b) => a + b, 0);
  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
            {t('products.filterCategories')}
          </h3>
          {hasFilters && (
            <button
              onClick={onReset}
              className="text-[11px] font-medium text-brand-600 hover:text-brand-700"
            >
              {t('products.reset')}
            </button>
          )}
        </div>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveCat('')}
              className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                !activeCat
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-700 hover:bg-ink-100'
              }`}
            >
              <span>{t('products.all')}</span>
              <span className="text-[11px] text-ink-500 tabular-nums">{allCount}</span>
            </button>
          </li>
          {categories.map((c) => {
            const count = catCount.get(c.id) || 0;
            const isActive = activeCat === c.id;
            return (
              <li key={c.id}>
                <button
                  onClick={() => setActiveCat(c.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-left transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  <span className="truncate pr-2">{pickLang(c.name, lang)}</span>
                  <span className="text-[11px] text-ink-500 tabular-nums shrink-0">{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ====================================================== */
/* Sort dropdown                                          */
/* ====================================================== */
function SortSelect({
  t, value, onChange,
}: { t: (k: string) => string; value: SortMode; onChange: (v: SortMode) => void }) {
  const [open, setOpen] = useState(false);
  const labels: Record<SortMode, string> = {
    default: t('products.sort.default'),
    az: t('products.sort.az'),
    za: t('products.sort.za'),
  };
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-3.5 py-2.5 text-sm font-medium hover:border-brand-400 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 4h10M3 7h8M5 10h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">{labels[value]}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-xl z-30">
          {(['default', 'az', 'za'] as SortMode[]).map((opt) => (
            <li key={opt}>
              <button
                onMouseDown={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  opt === value ? 'bg-brand-50 text-brand-700 font-medium' : 'hover:bg-ink-100'
                }`}
              >
                {labels[opt]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ====================================================== */
/* Filter chip (active filter removable)                  */
/* ====================================================== */
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
      {label}
      <button
        onClick={onRemove}
        aria-label="Remove filter"
        className="grid place-items-center size-4 rounded-full hover:bg-brand-100"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M2 2l5 5M7 2l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

/* ====================================================== */
/* Grid card — marketplace style                          */
/* ====================================================== */
function ShopGridCard({
  product, idx, t, lang,
}: {
  product: Product;
  idx: number;
  t: (k: string) => string;
  lang: 'uz' | 'en' | 'ru';
}) {
  const img = productImage(product, idx);
  const desc = pickLang(product.description as any, lang);
  const specs = product.specs && typeof product.specs === 'object' ? product.specs : {};
  const specChips = Object.entries(specs).slice(0, 2);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-ink-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-500"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-50/50 via-white to-brand-100/30">
        {product.code && (
          <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-ink-900/90 px-1.5 py-0.5 text-[9px] font-semibold text-white tracking-wide">
            {product.code}
          </span>
        )}
        <button
          aria-label="Quick view"
          className="absolute top-2.5 right-2.5 z-10 grid place-items-center size-8 rounded-full bg-white/90 backdrop-blur shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
          onClick={(e) => e.preventDefault()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7s2-4 6-4 6 4 6 4-2 4-6 4-6-4-6-4z" stroke="#10b981" strokeWidth="1.4" />
            <circle cx="7" cy="7" r="2" stroke="#10b981" strokeWidth="1.4" />
          </svg>
        </button>
        <div className="absolute inset-0 grid place-items-center p-5">
          <img
            src={img}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-[15px] text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {desc && (
          <p className="text-xs text-ink-500 line-clamp-1">{desc}</p>
        )}
        {specChips.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {specChips.map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-700"
              >
                {String(v)}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center justify-between pt-2 border-t border-ink-100">
          <span className="text-xs text-ink-500">{t('products.detail.specs')}</span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 group-hover:gap-1.5 transition-all">
            <span>{t('news.readMore')}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ====================================================== */
/* List card — horizontal marketplace style               */
/* ====================================================== */
function ShopListCard({
  product, idx, t, lang,
}: {
  product: Product;
  idx: number;
  t: (k: string) => string;
  lang: 'uz' | 'en' | 'ru';
}) {
  const img = productImage(product, idx);
  const desc = pickLang(product.description as any, lang);
  const specs = product.specs && typeof product.specs === 'object' ? product.specs : {};
  const specChips = Object.entries(specs).slice(0, 4);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex gap-4 sm:gap-5 overflow-hidden rounded-2xl bg-white border border-ink-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500 p-3 sm:p-4"
    >
      {/* Image */}
      <div className="shrink-0 relative w-24 sm:w-32 lg:w-40 aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand-50/60 via-white to-brand-100/40">
        <div className="absolute inset-0 grid place-items-center p-3">
          <img
            src={img}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-2">
              {product.name}
            </h3>
            {product.code && (
              <span className="shrink-0 rounded-md bg-ink-900/90 px-1.5 py-0.5 text-[9px] font-semibold text-white tracking-wide">
                {product.code}
              </span>
            )}
          </div>
          {desc && (
            <p className="mt-1 text-xs sm:text-sm text-ink-500 line-clamp-2">{desc}</p>
          )}
          {specChips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {specChips.map(([k, v]) => (
                <span
                  key={k}
                  className="inline-flex items-center rounded-md bg-ink-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-ink-700"
                >
                  <span className="text-ink-500 uppercase mr-1">{k}:</span>
                  {String(v)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-1 text-xs sm:text-sm font-medium text-brand-600 group-hover:gap-2 transition-all">
          <span>{t('news.readMore')}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
