'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { Reveal } from '@/components/Reveal';

export default function AboutPage() {
  const { t } = useLang();

  const timeline = [
    { year: '2013', title: 'Zavod ishga tushdi', body: 'Toshkent shahri Bektemir tumanida Chilon Lubricants zavodi ishga tushirildi.' },
    { year: '2016', title: 'Sintetik liniya', body: 'Sintetik motor moylari ishlab chiqarish liniyasi qo‘shildi.' },
    { year: '2019', title: 'Temir yo‘l moylari', body: 'O‘zbekiston temir yo‘llari uchun maxsus moylash mahsulotlari liniyasi.' },
    { year: '2022', title: 'NVI base oils', body: 'Patentlangan NVI bazaviy moylar texnologiyasi joriy qilindi.' },
    { year: '2026', title: 'Mintaqaviy ekspansiya', body: 'Mintaqa bozorlariga eksportni kengaytirish strategiyasi.' },
  ];

  const values = [
    { t: 'Sifat', d: 'Har bir partiya kirish va chiqishda sinovdan o‘tkaziladi. Xalqaro standartlar — bizning bazaviy daraja.' },
    { t: 'Mahalliylik', d: '100% O‘zbekistonda ishlab chiqaramiz. Import o‘rnini bosish — bizning missiyamiz.' },
    { t: 'Innovatsiya', d: 'Doimiy R&D, yangi formulalar va NVI bazaviy moylar texnologiyasi.' },
    { t: 'Hamkorlik', d: 'Yetakchi sanoat brendlari bilan uzoq muddatli, ishonchli munosabatlar.' },
    { t: 'Ekologiya', d: 'ISO 14001 sertifikatlangan ishlab chiqarish jarayonlari.' },
    { t: 'Odamlar', d: '200+ malakali xodim. Bizning eng katta investitsiyamiz — jamoa.' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-14 lg:py-20">
          <Reveal>
            <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[--color-ink-800]">{t('nav.about')}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="eyebrow">{t('about.eyebrow')}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display mt-3 text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-3xl">
              {t('about.title')}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-[--color-ink-700]">
              {t('about.sub')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="sec">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="eyebrow">{t('about.mission.eyebrow')}</span>
              <h2 className="display mt-3 text-2xl sm:text-3xl text-[--color-ink-900] leading-tight">
                {t('about.mission.title')}
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <Reveal delay={0.05}>
              <p className="text-lg sm:text-xl text-[--color-ink-800] leading-relaxed">
                {t('about.mission.body')}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { v: '12+', k: 'yillik tajriba' },
                  { v: '9 000+', k: 'tonna / yil' },
                  { v: '350+', k: 'tur mahsulot' },
                  { v: '9', k: 'mintaqaviy diler' },
                ].map((s, i) => (
                  <div key={i} className="card p-5">
                    <div className="display text-2xl sm:text-3xl text-[--color-brand-700]">{s.v}</div>
                    <div className="mt-1.5 text-xs sm:text-sm text-[--color-ink-500] leading-snug">{s.k}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Manufacturing video block */}
      <section className="sec pt-0!">
        <div className="wrap">
          <Reveal>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[--color-ink-100] shadow-soft">
              <video
                src="/chilon.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-brand-900]/55 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-md bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-[--color-ink-900]">
                <span className="size-1.5 rounded-full bg-[--color-amber-500] animate-pulse" />
                Bektemir / Toshkent
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/70">Quvvat</div>
                  <div className="display text-3xl sm:text-4xl mt-1">9000 tonna / yil</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-widest text-white/70">Faoliyat</div>
                  <div className="display text-3xl sm:text-4xl mt-1">2013-yildan</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec bg-[--color-cream]">
        <div className="wrap">
          <div className="max-w-2xl">
            <Reveal><span className="eyebrow">{t('about.history.eyebrow')}</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
                {t('about.history.title')}
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {timeline.map((s, i) => (
              <Reveal key={s.year} delay={i * 0.05}>
                <div className="card p-6 h-full">
                  <div className="inline-flex size-10 items-center justify-center rounded-md bg-[--color-brand-50] text-[--color-brand-700] font-display font-bold text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="display text-3xl text-[--color-brand-700] mt-4">{s.year}</div>
                  <h3 className="mt-2 font-display font-semibold text-base text-[--color-ink-900]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[--color-ink-600] leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="sec">
        <div className="wrap">
          <div className="max-w-2xl">
            <Reveal><span className="eyebrow">{t('about.values.eyebrow')}</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
                {t('about.values.title')}
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="card p-6 sm:p-7 h-full hover:border-[--color-brand-200] transition-colors">
                  <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[--color-brand-50] text-[--color-brand-700] font-display font-bold">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-display font-semibold text-lg text-[--color-ink-900]">{v.t}</h3>
                  <p className="mt-2 text-sm text-[--color-ink-600] leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="sec pt-0!">
        <div className="wrap">
          <Reveal>
            <div className="card p-8 sm:p-12">
              <span className="eyebrow">{t('about.certs.eyebrow')}</span>
              <h2 className="display mt-3 text-2xl sm:text-3xl text-[--color-ink-900]">
                {t('about.certs.title')}
              </h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {t('about.certs.list').split('·').map((c) => c.trim()).filter(Boolean).map((c) => (
                  <span key={c} className="tag tag-amber text-sm!">{c}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="sec pt-0!">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-3xl bg-[--color-brand-700] text-white p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <h2 className="display text-3xl sm:text-4xl leading-tight">Bizning jamoaga qo‘shiling.</h2>
              <p className="mt-3 text-white/85 max-w-2xl">Hamkorlikni boshlash uchun bog‘laning yoki mahsulotlarimiz katalogini ko‘ring.</p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contacts" className="btn btn-accent">{t('cta.consult')}<ArrowR /></Link>
              <Link href="/products" className="btn btn-ghost text-white! border! border-white/30! hover:bg-white/10!">{t('cta.catalog')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowR() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
