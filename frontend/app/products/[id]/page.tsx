'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, productImage, pickLang } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang, t } = useLang();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.product(id, lang).then(async (p) => {
      if (cancelled) return;
      setProduct(p);
      try {
        const rel = await api.products(lang, { category: p.category_id, limit: 5 });
        if (cancelled) return;
        const arr = Array.isArray(rel) ? rel : rel.items;
        setRelated((arr || []).filter((x) => x.id !== p.id).slice(0, 4));
      } catch {}
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [id, lang]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-x">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl bg-ink-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-12 w-3/4 rounded-xl bg-ink-100 animate-pulse" />
            <div className="h-6 w-1/2 rounded-xl bg-ink-100 animate-pulse" />
            <div className="h-32 rounded-2xl bg-ink-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 container-x text-center text-ink-500">
        {t('products.empty')}
      </div>
    );
  }

  const desc = pickLang(product.description as any, lang);
  const img = productImage(product);
  const specs = product.specs && typeof product.specs === 'object' ? product.specs : {};

  return (
    <div className="bg-white">
      <div className="container-x pt-24 sm:pt-28 pb-12 lg:pt-36">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-600 mb-6 sm:mb-8">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('common.back')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image — XL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100"
          >
            <div className="absolute inset-0 grid place-items-center p-8">
              <motion.img
                src={img}
                alt={product.name}
                className="max-h-[85%] max-w-[85%] object-contain"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="absolute -top-20 -left-20 size-64 rounded-full bg-brand-300/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 size-72 rounded-full bg-brand-400/20 blur-3xl" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:py-8"
          >
            {product.code && (
              <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                {t('product.code')}: {product.code}
              </span>
            )}
            <h1 className="display mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight">
              {product.name}
            </h1>
            {desc && (
              <p className="mt-5 text-base sm:text-lg text-ink-500 leading-relaxed">{desc}</p>
            )}

            {product.applications && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-2">
                  {t('products.detail.applications')}
                </h3>
                <p className="text-ink-700">{product.applications}</p>
              </div>
            )}

            {Object.keys(specs).length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-3">
                  {t('products.detail.specs')}
                </h3>
                <dl className="divide-y divide-ink-100 rounded-2xl border border-ink-100">
                  {Object.entries(specs).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 px-5 py-3.5 text-sm">
                      <dt className="text-ink-500 uppercase tracking-wide text-xs">{k}</dt>
                      <dd className="text-ink-900 font-medium">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-10 flex gap-3">
              <Link href="/contacts" className="btn-primary">
                {t('hero.cta.contact')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="section">
          <div className="container-x">
            <h2 className="display text-2xl sm:text-3xl font-bold mb-8">
              {t('products.detail.related')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
