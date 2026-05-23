'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { api, imageUrl } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { Partner } from '@/lib/types';

export default function PartnersPage() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.partners(lang).then((d) => {
      if (cancelled) return;
      setItems(d || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [lang]);

  return (
    <div className="bg-white">
      <section className="pt-32 pb-12 sm:pt-40 sm:pb-16 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="container-x relative max-w-3xl">
          <span className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            {t('partners.subtitle')}
          </span>
          <h1 className="display mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {t('partners.title')}
          </h1>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container-x">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/2] rounded-2xl bg-ink-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map((p, i) => {
                const card = (
                  <div className="group relative aspect-[3/2] grid place-items-center rounded-3xl border border-ink-100 bg-white p-6 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 transition-all duration-500">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-50/30 via-transparent to-brand-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative text-base sm:text-lg font-semibold text-ink-500 group-hover:text-brand-700 transition-colors text-center line-clamp-2">
                      {p.name}
                    </span>
                  </div>
                );
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 8) * 0.05 }}
                  >
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noreferrer">{card}</a>
                    ) : card}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
