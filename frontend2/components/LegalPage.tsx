'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';

interface Section {
  title: string;
  body: string;
}

export default function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Section[];
}) {
  const { t } = useLang();
  return (
    <div>
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-10 lg:py-14">
          <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
            <span>/</span>
            <span className="text-[--color-ink-800]">{title}</span>
          </nav>
          <Reveal>
            <h1 className="display text-4xl sm:text-5xl">{title}</h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-[--color-ink-700]">{intro}</p>
          </Reveal>
        </div>
      </section>

      <article className="sec pt-10!">
        <div className="wrap max-w-3xl">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <section>
                  <h2 className="display text-xl sm:text-2xl text-[--color-ink-900]">{`${i + 1}. ${s.title}`}</h2>
                  <p className="mt-4 text-base text-[--color-ink-700] leading-relaxed whitespace-pre-line">
                    {s.body}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-[--color-ink-100] text-sm text-[--color-ink-500]">
            Oxirgi yangilanish: 2026-yil yanvar. Savollar uchun:{' '}
            <Link href="/contacts" className="text-[--color-brand-700] font-semibold hover:underline">
              {t('nav.contacts')}
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
