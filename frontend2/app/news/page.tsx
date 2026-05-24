'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { NEWS, productImage } from '@/lib/data';
import { Reveal } from '@/components/Reveal';

export default function NewsPage() {
  const { t, pick, lang } = useLang();
  const items = NEWS;
  const [feature, ...rest] = items;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div>
      {/* Hero */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-12 lg:py-16">
          <Reveal>
            <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[--color-ink-800]">{t('nav.news')}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="eyebrow">{t('sec.news.eyebrow')}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl">{t('sec.news.title')}</h1>
          </Reveal>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          {/* Featured */}
          {feature && (
            <Reveal>
              <Link
                href={`/news/${feature.slug}`}
                className="card card-hover grid grid-cols-1 lg:grid-cols-12 overflow-hidden mb-10 lg:mb-14"
              >
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-[--color-paper] to-[--color-cream] grid place-items-center overflow-hidden">
                  <img
                    src={productImage({ id: feature.slug }, 0)}
                    alt={pick(feature.title)}
                    className="max-h-[80%] max-w-[65%] object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="tag tag-amber">★ Asosiy</span>
                    <span className="text-xs text-[--color-ink-500]">{fmt(feature.date)}</span>
                  </div>
                  <h2 className="display text-2xl sm:text-3xl lg:text-4xl text-[--color-ink-900] leading-tight">
                    {pick(feature.title)}
                  </h2>
                  {feature.excerpt && (
                    <p className="mt-4 text-base text-[--color-ink-600] line-clamp-3">
                      {pick(feature.excerpt)}
                    </p>
                  )}
                  <span className="arrow-link mt-6">
                    {t('news.read')}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((n, i) => (
                <Reveal key={n.id} delay={i * 0.05}>
                  <Link
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
                      <h3 className="font-display font-semibold text-base sm:text-lg text-[--color-ink-900] leading-snug line-clamp-3 flex-1">
                        {pick(n.title)}
                      </h3>
                      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand-700]">
                        {t('news.read')}
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
