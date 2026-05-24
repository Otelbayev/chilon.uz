'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'motion/react';
import { findProduct, PRODUCTS, productImage } from '@/lib/data';
import { useLang } from '@/lib/i18n';
import { Reveal, SplitReveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import Magnetic from '@/components/Magnetic';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = findProduct(id);
  if (!product) notFound();
  return <ProductView product={product!} />;
}

function ProductView({ product }: { product: Product }) {
  const { t } = useLang();
  const img = productImage(product);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setTilt({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const related = PRODUCTS.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);

  const specEntries = Object.entries(product.specs || {}).filter(([k]) => k !== 'image' && k !== 'tier');

  return (
    <div className="relative pt-28 lg:pt-36 pb-24 noise overflow-hidden">
      {/* page bg */}
      <div className="absolute inset-x-0 top-0 h-[50rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[50rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap">
        {/* Back */}
        <Reveal>
          <Link href="/products" className="arrow-link mb-8 inline-flex">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="rotate-180">
              <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('products.back')}
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: 3D bottle showcase */}
          <div className="lg:col-span-6 lg:sticky lg:top-32">
            <Reveal>
              <motion.div
                style={{ rotateY: tilt.x * 10, rotateX: tilt.y * -8 }}
                className="relative aspect-square w-full max-w-lg mx-auto"
              >
                <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(255,138,31,0.45),transparent_55%)] blur-2xl" />
                <div className="absolute inset-0 rounded-full border border-[--color-line-2] animate-[spin_70s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-[--color-line] animate-[spin_50s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-dashed border-[--color-amber-500]/30" />
                <div className="absolute inset-0 grid place-items-center">
                  <img
                    src={img}
                    alt={product.name}
                    className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_30px_50px_rgba(255,138,31,0.4)]"
                  />
                </div>
                {/* corner labels */}
                <div className="absolute top-0 left-0 font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                  / {product.category_id.replace(/-/g, ' ')}
                </div>
                <div className="absolute top-0 right-0 font-mono text-[10px] uppercase tracking-widest text-[--color-amber-400]">
                  {product.code || 'CHILON'}
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Right: details */}
          <div className="lg:col-span-6">
            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip chip-dot">/ {product.category_id.replace(/-/g, ' ')}</span>
                {product.code && <span className="chip">{product.code}</span>}
                {product.tier && <span className="chip !border-[--color-amber-500] !text-[--color-amber-300]">{product.tier}</span>}
              </div>
            </Reveal>

            <h1 className="display mt-5 text-[clamp(2.25rem,6vw,5rem)] leading-[0.95]">
              <SplitReveal text={product.name} />
            </h1>

            {product.applications && (
              <Reveal delay={0.3}>
                <p className="mt-5 max-w-xl text-base sm:text-lg text-[--color-fg-2] leading-relaxed">
                  {product.applications}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <Link href="/contacts" className="btn btn-primary">
                    {t('products.request')}
                    <ArrowR />
                  </Link>
                </Magnetic>
                <Link href="/products" className="btn btn-ghost">{t('products.back')}</Link>
              </div>
            </Reveal>

            {/* Specs */}
            {specEntries.length > 0 && (
              <Reveal delay={0.5}>
                <div className="mt-12">
                  <div className="rule-mono mb-4">/ {t('products.specs')}</div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[--color-line] border border-[--color-line] rounded-2xl overflow-hidden">
                    {specEntries.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-4 p-4 sm:p-5 bg-[--color-bg-1]">
                        <dt className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                          {k.replace(/-/g, ' ')}
                        </dt>
                        <dd className="font-display font-medium text-sm sm:text-base text-[--color-fg-0] text-right">
                          {String(v)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24 lg:mt-32">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <div className="rule-mono">/ related</div>
                <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl">{t('products.related')}</h2>
              </div>
              <Link href="/products" className="arrow-link">
                {t('sec.products.view')} <ArrowR />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05} className="h-full">
                  <ProductCard product={p} idx={i} compact />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
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
