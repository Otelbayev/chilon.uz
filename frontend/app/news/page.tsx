'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, productImage, pickLang } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { NewsItem } from '@/lib/types';

export default function NewsPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.news(lang, { limit: 50 }).then((d) => {
      if (cancelled) return;
      const arr = Array.isArray(d) ? d : d.items;
      setItems(arr || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [lang]);

  return (
    <div className="bg-white">
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 size-[28rem] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="container-x relative">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            {t('news.subtitle')}
          </span>
          <h1 className="display mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {t('news.title')}
          </h1>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container-x">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-3xl bg-ink-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((n, i) => {
                const title = pickLang(n.title as any, lang);
                const excerpt = pickLang(n.excerpt as any, lang);
                const img = productImage({ id: n.slug }, i);
                return (
                  <motion.article
                    key={n.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: (i % 6) * 0.05 }}
                  >
                    <Link
                      href={`/news/${n.slug}`}
                      className="group block overflow-hidden rounded-3xl border border-ink-100 bg-white hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-50/70 via-white to-brand-100/60 grid place-items-center p-6">
                        <img
                          src={img}
                          alt={title}
                          className="max-h-[85%] max-w-[70%] object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 sm:p-6">
                        <time className="text-[11px] sm:text-xs text-brand-600 font-medium uppercase tracking-wider">
                          {new Date(n.date).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </time>
                        <h3 className="mt-2 text-base sm:text-lg lg:text-xl font-semibold text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
                          {title}
                        </h3>
                        {excerpt && (
                          <p className="mt-2 text-sm text-ink-500 line-clamp-3">{excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
