'use client';

import Link from 'next/link';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { findNews, NEWS, productImage } from '@/lib/data';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const item = findNews(slug);
  if (!item) notFound();

  const { t, pick } = useLang();
  const related = NEWS.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <div className="relative pt-28 lg:pt-36 pb-24 noise overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap max-w-4xl">
        <Reveal>
          <Link href="/news" className="arrow-link mb-8 inline-flex">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="rotate-180">
              <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('news.back')}
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rule-mono">{new Date(item!.date).toLocaleDateString()}</div>
        </Reveal>

        <h1 className="display mt-4 text-[clamp(2.25rem,7vw,6rem)] leading-[0.92]">
          <SplitReveal text={pick(item!.title)} />
        </h1>

        <Reveal delay={0.3}>
          <div className="mt-10 relative aspect-[16/9] rounded-3xl overflow-hidden border border-[--color-line] bg-[--color-bg-2]">
            <img
              src={productImage({ id: item!.slug }, 0)}
              alt={pick(item!.title)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 prose-styles text-[--color-fg-1]">
            {item!.excerpt && (
              <p className="text-lg sm:text-xl text-[--color-fg-1] leading-relaxed font-display">
                {pick(item!.excerpt)}
              </p>
            )}
            {item!.content && (
              <div className="mt-6 space-y-5 text-base sm:text-lg text-[--color-fg-2] leading-[1.7]">
                {String(pick(item!.content)).split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="relative wrap mt-24">
          <div className="rule-mono">/ related</div>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{t('news.related')}</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            {related.map((n, i) => (
              <Reveal key={n.id} delay={i * 0.06}>
                <Tilt3D intensity={5}>
                  <Link href={`/news/${n.slug}`} className="bento block aspect-[4/5] overflow-hidden relative group">
                    <img
                      src={productImage({ id: n.slug }, i + 1)}
                      alt={pick(n.title)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-0] via-[--color-bg-0]/85 via-50% to-transparent" />
                    <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-[--color-bg-0]/90 backdrop-blur border border-[--color-line] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[--color-fg-1]">
                      {new Date(n.date).toLocaleDateString()}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <h3 className="font-display font-semibold text-lg sm:text-xl text-[--color-fg-0] line-clamp-3">
                        {pick(n.title)}
                      </h3>
                    </div>
                  </Link>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
