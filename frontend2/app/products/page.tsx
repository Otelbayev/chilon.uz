'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PRODUCTS, productImage } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { Reveal, SplitReveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';

type Sort = 'default' | 'az' | 'za';
type View = 'grid' | 'list';

export default function ProductsPage() {
  const { t, pick } = useLang();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [sort, setSort] = useState<Sort>('default');
  const [view, setView] = useState<View>('grid');

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
      list = list.filter((p) =>
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

  return (
    <div className="relative min-h-screen pt-28 lg:pt-36 pb-24 noise">
      {/* page bg */}
      <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap">
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 sec-num">
            <span>/ catalog</span>
            <span className="block h-px w-12 bg-[--color-line-2]" />
            <span className="text-[--color-amber-400]">{filtered.length} items</span>
          </div>
        </Reveal>
        <h1 className="display mt-5 text-[clamp(2.75rem,8vw,7rem)] leading-[0.9]">
          <SplitReveal text={t('products.title')} />
        </h1>
        <Reveal delay={0.2}>
          <p className="mt-4 max-w-xl text-base text-[--color-fg-2]">
            {t('products.sub', { n: PRODUCTS.length })}
          </p>
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[--color-fg-3]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M14 14L11 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('products.search')}
                className="input pl-11"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="input !py-2.5 !w-auto pr-8 cursor-pointer text-sm"
              >
                <option value="default">{t('products.sort.default')}</option>
                <option value="az">{t('products.sort.az')}</option>
                <option value="za">{t('products.sort.za')}</option>
              </select>

              <div className="inline-flex rounded-full border border-[--color-line] bg-[--color-bg-2] p-1">
                <button
                  onClick={() => setView('grid')}
                  aria-pressed={view === 'grid'}
                  className={`px-3 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
                    view === 'grid' ? 'bg-[--color-amber-500] text-black' : 'text-[--color-fg-2]'
                  }`}
                >
                  {t('products.view.grid')}
                </button>
                <button
                  onClick={() => setView('list')}
                  aria-pressed={view === 'list'}
                  className={`px-3 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-colors ${
                    view === 'list' ? 'bg-[--color-amber-500] text-black' : 'text-[--color-fg-2]'
                  }`}
                >
                  {t('products.view.list')}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Category chips */}
        <Reveal delay={0.4}>
          <div className="mt-6 flex flex-wrap gap-2 -mx-1 px-1 overflow-x-auto pb-2">
            <CatChip active={cat === 'all'} onClick={() => setCat('all')}>
              {t('products.all')} <span className="opacity-50">/ {PRODUCTS.length}</span>
            </CatChip>
            {CATEGORIES.map((c) => (
              <CatChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {pick(c.name)} <span className="opacity-50">/ {c.products.length}</span>
              </CatChip>
            ))}
          </div>
        </Reveal>

        {/* Results */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <Reveal>
              <div className="grid place-items-center py-24 text-[--color-fg-3]">
                <div className="display text-3xl text-[--color-fg-1]">{t('products.empty')}</div>
                <button onClick={() => { setQuery(''); setCat('all'); }} className="mt-6 btn btn-ghost">
                  Reset
                </button>
              </div>
            </Reveal>
          ) : (
            <AnimatePresence mode="wait">
              {view === 'grid' ? (
                <motion.div
                  key={`grid-${cat}-${query}-${sort}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5"
                >
                  {filtered.map((p, i) => (
                    <Reveal key={p.id} delay={Math.min(i, 12) * 0.03} className="h-full">
                      <ProductCard product={p} idx={i} compact />
                    </Reveal>
                  ))}
                </motion.div>
              ) : (
                <motion.ul
                  key={`list-${cat}-${query}-${sort}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="border border-[--color-line] rounded-3xl overflow-hidden divide-y divide-[--color-line]"
                >
                  {filtered.map((p, i) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.id}`}
                        className="group flex items-center gap-4 sm:gap-6 p-4 sm:p-5 lg:p-6 hover:bg-[--color-bg-2] transition-colors"
                      >
                        <span className="font-mono text-[10px] text-[--color-fg-3] hidden sm:block">
                          {String(i + 1).padStart(3, '0')}
                        </span>
                        <div className="size-14 sm:size-16 shrink-0 grid place-items-center rounded-xl bg-[--color-bg-2] border border-[--color-line] overflow-hidden">
                          <img
                            src={productImage(p, i)}
                            alt={p.name}
                            className="max-h-[80%] max-w-[80%] object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-base sm:text-lg text-[--color-fg-0] truncate group-hover:text-[--color-amber-400] transition-colors">
                            {p.name}
                          </h3>
                          {p.applications && (
                            <p className="text-xs sm:text-sm text-[--color-fg-2] line-clamp-1">{p.applications}</p>
                          )}
                        </div>
                        {p.code && (
                          <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                            {p.code}
                          </span>
                        )}
                        <span className="inline-flex size-9 items-center justify-center rounded-full border border-[--color-line-2] group-hover:border-[--color-amber-500] transition-colors">
                          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function CatChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono uppercase tracking-widest border transition-all ${
        active
          ? 'bg-[--color-amber-500] text-black border-[--color-amber-500] shadow-[0_8px_28px_-8px_var(--color-amber-500)]'
          : 'bg-[--color-bg-1] text-[--color-fg-2] border-[--color-line] hover:border-[--color-amber-500] hover:text-[--color-amber-400]'
      }`}
    >
      {children}
    </button>
  );
}
