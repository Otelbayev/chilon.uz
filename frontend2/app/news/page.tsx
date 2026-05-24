'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { NEWS, productImage } from '@/lib/data';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';

export default function NewsPage() {
  const { t, pick } = useLang();
  const items = NEWS;

  return (
    <div className="relative pt-28 lg:pt-36 pb-24 noise overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap">
        <Reveal>
          <div className="flex items-center gap-3 sec-num">
            <span>/ news</span>
            <span className="block h-px w-12 bg-[--color-line-2]" />
            <span className="text-[--color-amber-400]">{items.length} articles</span>
          </div>
        </Reveal>

        <h1 className="display mt-5 text-[clamp(2.75rem,9vw,10rem)] leading-[0.88]">
          <SplitReveal text={t('nav.news')} />
        </h1>

        {/* Feature card */}
        {items[0] && (
          <div className="mt-12">
            <Reveal>
              <Tilt3D intensity={4}>
                <Link
                  href={`/news/${items[0].slug}`}
                  className="bento group block relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden"
                >
                  <img
                    src={productImage({ id: items[0].slug }, 0)}
                    alt={pick(items[0].title)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-0] via-[--color-bg-0]/85 to-transparent" />
                  <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-[--color-bg-0]/90 backdrop-blur border border-[--color-line] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[--color-fg-1]">
                    <span className="size-1.5 rounded-full bg-[--color-amber-500] animate-pulse" />
                    {new Date(items[0].date).toLocaleDateString()} · featured
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col p-8 sm:p-12 lg:p-16">
                    <h2 className="display text-3xl sm:text-5xl lg:text-6xl text-[--color-fg-0] max-w-3xl leading-[0.95]">
                      {pick(items[0].title)}
                    </h2>
                    {items[0].excerpt && (
                      <p className="mt-4 max-w-xl text-sm sm:text-base text-[--color-fg-2]">
                        {pick(items[0].excerpt)}
                      </p>
                    )}
                    <span className="arrow-link mt-6">
                      {t('news.read')} <Arrow />
                    </span>
                  </div>
                </Link>
              </Tilt3D>
            </Reveal>
          </div>
        )}

        {/* Rest grid */}
        {items.length > 1 && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {items.slice(1).map((n, i) => (
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
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                      <h3 className="font-display font-semibold text-lg sm:text-2xl text-[--color-fg-0] leading-tight line-clamp-3">
                        {pick(n.title)}
                      </h3>
                      <span className="arrow-link mt-4 text-xs">
                        {t('news.read')} <Arrow />
                      </span>
                    </div>
                  </Link>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
