'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'motion/react';
import { findProduct, findCategory, PRODUCTS, productImage } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = findProduct(id);
  if (!product) notFound();
  return <ProductView product={product!} />;
}

function ProductView({ product }: { product: Product }) {
  const { t, pick } = useLang();
  const img = productImage(product);
  const category = findCategory(product.category_id);
  const related = PRODUCTS.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);

  const sae = product.specs?.sae as string | undefined;
  const api = product.specs?.api as string | undefined;
  const iso = product.specs?.['iso-vg'] as string | undefined;
  const nlgi = product.specs?.nlgi as string | undefined;
  const tier = (product.tier as string | undefined) || (product.specs?.tier as string | undefined);

  const specEntries = Object.entries(product.specs || {}).filter(
    ([k]) => k !== 'image' && k !== 'tier'
  );

  const [pack, setPack] = useState('5L');
  const PACK_SIZES = ['1L', '4L', '5L', '20L', '200L'];

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-5">
          <nav className="text-xs text-[--color-ink-500] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[--color-brand-700]">{t('nav.products')}</Link>
            {category && (
              <>
                <span>/</span>
                <Link
                  href={`/products?cat=${category.id}`}
                  className="hover:text-[--color-brand-700] line-clamp-1"
                >
                  {pick(category.name)}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-[--color-ink-800] line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Hero — image + info */}
      <section className="sec pt-10! sm:pt-14!">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Image */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 self-start">
            <Reveal>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative bg-gradient-to-br from-[--color-cream] to-[--color-paper] rounded-2xl border border-[--color-ink-100] overflow-hidden aspect-square"
              >
                <div className="absolute inset-0 paper-texture opacity-30" />
                <div className="absolute -top-12 -right-12 size-64 rounded-full bg-[--color-amber-100]/60 blur-2xl" />
                <div className="absolute inset-0 bottle-stage">
                  <img
                    src={img}
                    alt={product.name}
                    className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_40px_40px_rgb(31_84_57/0.18)]"
                  />
                </div>
                {tier && (
                  <span className="absolute top-5 left-5 inline-flex items-center rounded-md bg-[--color-amber-500] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-soft">
                    {tier}
                  </span>
                )}
                {product.code && (
                  <span className="absolute top-5 right-5 inline-flex items-center rounded-md bg-white/90 backdrop-blur border border-[--color-ink-100] px-3 py-1 text-xs font-mono text-[--color-ink-700]">
                    {product.code}
                  </span>
                )}
              </motion.div>
            </Reveal>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                {category && (
                  <Link href={`/products?cat=${category.id}`} className="tag">{pick(category.name)}</Link>
                )}
                {sae && <span className="tag tag-amber">SAE {sae}</span>}
                {api && <span className="tag tag-neutral">API {api}</span>}
                {iso && <span className="tag tag-neutral">ISO VG {iso}</span>}
                {nlgi && <span className="tag tag-neutral">NLGI {nlgi}</span>}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="display text-3xl sm:text-4xl lg:text-5xl text-[--color-ink-900] leading-[1.05]">
                {product.name}
              </h1>
            </Reveal>

            {product.applications && (
              <Reveal delay={0.1}>
                <p className="mt-4 text-base sm:text-lg text-[--color-ink-700] leading-relaxed max-w-xl">
                  {product.applications}
                </p>
              </Reveal>
            )}

            {/* Packaging selector */}
            <Reveal delay={0.15}>
              <div className="mt-7">
                <div className="text-xs uppercase tracking-widest text-[--color-ink-500] font-semibold mb-3">
                  {t('products.packaging')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {PACK_SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPack(s)}
                      className={`px-4 py-2 rounded-md border text-sm font-semibold font-display transition-all ${
                        pack === s
                          ? 'border-[--color-brand-600] bg-[--color-brand-50] text-[--color-brand-700]'
                          : 'border-[--color-ink-200] bg-white text-[--color-ink-800] hover:border-[--color-brand-300]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contacts" className="btn btn-primary btn-lg">
                  {t('cta.requestFull')}
                  <ArrowR />
                </Link>
                <Link href="/contacts" className="btn btn-outline btn-lg">
                  {t('cta.consult')}
                </Link>
              </div>
            </Reveal>

            {/* Advantages */}
            <Reveal delay={0.25}>
              <div className="mt-9 card p-6">
                <h3 className="font-display font-semibold text-base text-[--color-ink-900]">
                  {t('products.advantages')}
                </h3>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    t('products.adv.1'),
                    t('products.adv.2'),
                    t('products.adv.3'),
                    t('products.adv.4'),
                  ].map((adv, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[--color-ink-800]">
                      <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[--color-brand-100] text-[--color-brand-700] shrink-0">
                        <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                          <path d="M2 5.5l2.2 2.5L9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Specs sheet */}
      {specEntries.length > 0 && (
        <section className="sec pt-0!">
          <div className="wrap">
            <Reveal>
              <div className="card p-6 sm:p-10">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="display text-2xl sm:text-3xl text-[--color-ink-900]">
                    {t('products.specs')}
                  </h2>
                  <span className="text-xs text-[--color-ink-500]">{specEntries.length} parametr</span>
                </div>
                <dl className="spec-list grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                  {specEntries.map(([k, v]) => (
                    <div key={k}>
                      <dt className="capitalize">{k.replace(/-/g, ' ')}</dt>
                      <dd>{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="sec pt-0!">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <h2 className="display text-2xl sm:text-3xl lg:text-4xl">{t('products.related')}</h2>
              <Link href="/products" className="btn btn-outline btn-sm">
                {t('cta.viewAll')}<ArrowR />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} idx={i} showApplications={false} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function ArrowR() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
