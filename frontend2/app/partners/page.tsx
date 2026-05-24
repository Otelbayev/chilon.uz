'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { PARTNERS, DEALERS } from '@/lib/data';
import { Reveal } from '@/components/Reveal';

export default function PartnersPage() {
  const { t, pick } = useLang();

  return (
    <div>
      {/* Hero */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-14 lg:py-20">
          <Reveal>
            <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[--color-ink-800]">{t('nav.partners')}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="eyebrow">{t('sec.partners.eyebrow')}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl">{t('partners.title')}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-[--color-ink-700]">
              {t('partners.sub')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Partner grid */}
      <section className="sec">
        <div className="wrap">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-[--color-ink-500] font-semibold mb-5">
              Bizning hamkorlar · {PARTNERS.length}
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[--color-ink-100] rounded-2xl overflow-hidden border border-[--color-ink-100] shadow-soft">
            {PARTNERS.map((p, i) => (
              <div
                key={p.id}
                className="bg-white aspect-[4/3] grid place-items-center p-6 transition-colors hover:bg-[--color-paper] group"
              >
                {p.logo ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-[60%] max-w-[80%] object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <span className="text-center font-display font-semibold text-sm sm:text-base text-[--color-ink-700] group-hover:text-[--color-brand-700] transition-colors line-clamp-2">
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional dealers */}
      {DEALERS.length > 0 && (
        <section className="sec pt-0!">
          <div className="wrap">
            <div className="max-w-2xl mb-10">
              <Reveal><span className="eyebrow">{t('contacts.dealers')}</span></Reveal>
              <Reveal delay={0.05}>
                <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
                  Mintaqaviy dilerlar tarmog‘i
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-base text-[--color-ink-700]">
                  O‘zbekistonning barcha viloyatlarida — sizga eng yaqin diler bilan to‘g‘ridan-to‘g‘ri bog‘laning.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEALERS.map((d, i) => (
                <Reveal key={i} delay={i * 0.03}>
                  <div className="card p-5 sm:p-6 hover:border-[--color-brand-200] transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-2 text-xs text-[--color-ink-500] mb-2">
                          <PinIcon /> Viloyat
                        </div>
                        <div className="font-display font-semibold text-[--color-ink-900] text-base sm:text-lg">
                          {pick(d.region)}
                        </div>
                        <a
                          href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                          className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[--color-brand-700] hover:text-[--color-brand-800]"
                        >
                          <PhoneIcon />
                          {d.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Become a partner */}
      <section className="sec pt-0!">
        <div className="wrap">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[--color-brand-700] text-white p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="absolute -top-20 -right-20 size-80 rounded-full bg-[--color-amber-500]/20 blur-3xl pointer-events-none" />
              <div className="lg:col-span-8 relative">
                <span className="inline-block text-xs uppercase tracking-widest font-semibold text-white/70">
                  {t('partners.become')}
                </span>
                <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                  Bizning dilerlar tarmog‘iga qo‘shiling
                </h2>
                <p className="mt-4 max-w-2xl text-white/85 text-base sm:text-lg">
                  {t('partners.becomeSub')}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end relative">
                <Link href="/contacts" className="btn btn-accent btn-lg">{t('cta.callback')}<ArrowR /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M7 13s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M5.5 2.5l1.5 3-1 1c.5 1.8 2.2 3.5 4 4l1-1 3 1.5v3a1.5 1.5 0 0 1-1.5 1.5C7.6 15.5 2.5 10.4 2.5 4a1.5 1.5 0 0 1 1.5-1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function ArrowR() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
