'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, productImage, pickLang } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { NewsItem } from '@/lib/types';

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang, t } = useLang();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.newsItem(slug, lang).then((d) => {
      if (cancelled) return;
      setItem(d);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 container-x max-w-3xl space-y-4">
        <div className="h-8 w-32 rounded-xl bg-ink-100 animate-pulse" />
        <div className="h-14 w-full rounded-xl bg-ink-100 animate-pulse" />
        <div className="aspect-[16/9] rounded-3xl bg-ink-100 animate-pulse" />
      </div>
    );
  }
  if (!item) return <div className="pt-32 pb-20 container-x text-center text-ink-500">404</div>;

  const title = pickLang(item.title as any, lang);
  const content = pickLang(item.content as any, lang);
  const img = productImage({ id: item.slug });

  return (
    <div className="bg-white">
      <article className="container-x max-w-3xl pt-28 pb-20 lg:pt-36">
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-brand-600 mb-8">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('news.back')}
        </Link>

        <motion.time
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="block text-sm font-medium text-brand-600 uppercase tracking-wider"
        >
          {new Date(item.date).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </motion.time>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-brand-100 grid place-items-center"
        >
          <img
            src={img}
            alt={title}
            className="max-h-[80%] max-w-[60%] object-contain"
          />
        </motion.div>

        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg mt-10 max-w-none text-ink-700 leading-relaxed whitespace-pre-line"
          >
            {content}
          </motion.div>
        )}
      </article>
    </div>
  );
}
