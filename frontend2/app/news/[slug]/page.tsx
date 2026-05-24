'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { findNews, NEWS, productImage } from '@/lib/data';
import { Reveal } from '@/components/Reveal';

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const item = findNews(slug);
  if (!item) notFound();

  const { t, pick, lang } = useLang();
  const related = NEWS.filter((n) => n.slug !== slug).slice(0, 3);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-5">
          <nav className="text-xs text-[--color-ink-500] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
            <span>/</span>
            <Link href="/news" className="hover:text-[--color-brand-700]">{t('nav.news')}</Link>
            <span>/</span>
            <span className="text-[--color-ink-800] line-clamp-1">{pick(item!.title)}</span>
          </nav>
        </div>
      </section>

      <article className="sec pt-10!">
        <div className="wrap max-w-4xl">
          <Reveal>
            <Link href="/news" className="arrow-link mb-6 inline-flex">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="rotate-180">
                <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('news.back')}
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="text-sm text-[--color-ink-500] mb-3">{fmt(item!.date)}</div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display text-3xl sm:text-4xl lg:text-5xl text-[--color-ink-900] leading-[1.08]">
              {pick(item!.title)}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 aspect-[16/9] rounded-2xl overflow-hidden border border-[--color-ink-100] bg-gradient-to-br from-[--color-paper] to-[--color-cream] grid place-items-center">
              <img
                src={productImage({ id: item!.slug }, 0)}
                alt={pick(item!.title)}
                className="max-h-[80%] max-w-[55%] object-contain drop-shadow-md"
              />
            </div>
          </Reveal>

          {item!.excerpt && (
            <Reveal delay={0.2}>
              <p className="mt-8 text-lg sm:text-xl text-[--color-ink-800] leading-relaxed font-display font-medium">
                {pick(item!.excerpt)}
              </p>
            </Reveal>
          )}

          {item!.content && (
            <Reveal delay={0.25}>
              <div className="mt-6 space-y-5 text-base sm:text-lg text-[--color-ink-700] leading-[1.75]">
                {String(pick(item!.content))
                  .split('\n')
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            </Reveal>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="sec pt-0!">
          <div className="wrap">
            <div className="hairline mb-12" />
            <div className="flex items-end justify-between gap-6 flex-wrap mb-8">
              <h2 className="display text-2xl sm:text-3xl text-[--color-ink-900]">{t('news.related')}</h2>
              <Link href="/news" className="btn btn-outline btn-sm">{t('cta.viewAll')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((n, i) => (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  className="card card-hover overflow-hidden h-full flex flex-col"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-[--color-paper] to-[--color-cream] grid place-items-center overflow-hidden">
                    <img
                      src={productImage({ id: n.slug }, i + 1)}
                      alt={pick(n.title)}
                      className="max-h-[75%] max-w-[68%] object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="text-xs text-[--color-ink-500] mb-2">{fmt(n.date)}</div>
                    <h3 className="font-display font-semibold text-base text-[--color-ink-900] leading-snug line-clamp-3 flex-1">
                      {pick(n.title)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
