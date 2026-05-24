'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { PARTNERS } from '@/lib/data';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';
import Marquee from '@/components/Marquee';
import Magnetic from '@/components/Magnetic';

export default function PartnersPage() {
  const { t } = useLang();

  return (
    <div className="relative pt-28 lg:pt-36 pb-24 noise overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap">
        <Reveal>
          <div className="flex items-center gap-3 sec-num">
            <span>/ partners</span>
            <span className="block h-px w-12 bg-[--color-line-2]" />
            <span className="text-[--color-amber-400]">{PARTNERS.length} brands</span>
          </div>
        </Reveal>

        <h1 className="display mt-5 text-[clamp(2.75rem,9vw,10rem)] leading-[0.88]">
          <SplitReveal text={t('partners.title')} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-[--color-fg-2]">{t('partners.sub')}</p>
        </Reveal>

        {/* Massive grid */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 12) * 0.04}>
              <Tilt3D intensity={6}>
                <div className="bento aspect-[4/3] grid place-items-center p-6 group">
                  <div className="relative text-center">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3] block mb-3">
                      // {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display font-semibold text-lg sm:text-2xl text-[--color-fg-1] group-hover:text-[--color-amber-400] transition-colors">
                      {p.name}
                    </span>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        {/* Trust band */}
        <section className="mt-20 lg:mt-32 border-y border-[--color-line] bg-[--color-bg-1] -mx-5 sm:-mx-8 lg:-mx-12 py-8 overflow-hidden">
          <Marquee>
            {['UZB.RAILWAYS', 'GM UZBEKISTAN', 'KAMAZ', 'UZAUTO', 'UZNEFTEPRODUKT', 'UZGEOLOGY'].map((b, i) => (
              <span key={i} className="font-display text-3xl sm:text-5xl lg:text-6xl text-[--color-fg-1] inline-flex items-center gap-6">
                {b}<span className="text-[--color-amber-500]">✦</span>
              </span>
            ))}
          </Marquee>
        </section>

        {/* CTA */}
        <section className="mt-20 lg:mt-32 text-center">
          <Reveal>
            <h2 className="display text-3xl sm:text-5xl">Hamkor bo‘ling.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-[--color-fg-2]">
              Bizning hamkor tarmog‘imizga qo‘shiling va premium moylash mahsulotlarini distribyutsiya qiling.
            </p>
            <div className="mt-8 inline-flex">
              <Magnetic>
                <Link href="/contacts" className="btn btn-primary">
                  {t('hero.cta.contact')}
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
