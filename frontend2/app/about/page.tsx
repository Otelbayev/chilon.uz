'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';
import Magnetic from '@/components/Magnetic';
import Marquee from '@/components/Marquee';

export default function AboutPage() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <div className="relative pt-28 lg:pt-36 noise overflow-hidden">
      {/* Hero */}
      <section className="relative pb-24">
        <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

        <div className="relative wrap">
          <Reveal>
            <div className="flex items-center gap-3 sec-num">
              <span>00</span>
              <span className="block h-px w-12 bg-[--color-line-2]" />
              <span>/ about</span>
            </div>
          </Reveal>

          <h1 className="display mt-6 text-[clamp(3rem,10vw,11rem)] leading-[0.88] text-grad-amber">
            <SplitReveal text={t('about.title')} />
          </h1>

          <Reveal delay={0.3}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-[--color-fg-2]">
              {t('about.sub')}
            </p>
          </Reveal>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[--color-line] border border-[--color-line] rounded-3xl overflow-hidden">
            {[
              { v: '9000+', k: 'tons / yr' },
              { v: '356+', k: 'products' },
              { v: '2013', k: 'since' },
              { v: '9', k: 'regions' },
            ].map((m, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05} className="bg-[--color-bg-1]">
                <div className="p-6 sm:p-8">
                  <div className="kv-num text-4xl sm:text-5xl">{m.v}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                    {m.k}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story split */}
      <section ref={ref} className="relative sec border-t border-[--color-line]">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <Reveal>
              <div className="rule-mono">/ story</div>
              <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
                <SplitReveal text={t('about.story.title')} />
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-[--color-fg-2] leading-[1.7]">
            <Reveal delay={0.1}>
              <p>{t('about.story.body')}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p>
                Bizning maqsadimiz — O‘zbekiston sanoati va transportiga jahon andozalariga mos keluvchi yuqori sifatli moylash mahsulotlarini taqdim etish. Har bir formulamiz xalqaro standartlar bo‘yicha sertifikatlangan.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                Zavodimiz Toshkent shahridagi Bektemir tumanida joylashgan bo‘lib, yiliga 9000 tonnadan ortiq mahsulot ishlab chiqaradi. Bizning hamkorlarimiz orasida — O‘zbekiston temir yo‘llari, GM Uzbekistan, KamAZ va boshqalar.
              </p>
            </Reveal>

            {/* Big quote */}
            <motion.div style={{ y }} className="mt-12 relative">
              <Tilt3D intensity={3}>
                <div className="bento p-8 sm:p-10">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-[--color-amber-500] mb-4" fill="currentColor">
                    <path d="M0 22V14c0-5 3-9 9-9v4c-3 0-5 2-5 5h5v8H0Zm18 0V14c0-5 3-9 9-9v4c-3 0-5 2-5 5h5v8h-9Z"/>
                  </svg>
                  <p className="display text-2xl sm:text-3xl text-[--color-fg-0] leading-tight">
                    Sifat — bu bizning birinchi formulamiz. Innovatsiya — bu bizning kelajagimiz.
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-[--color-amber-500]/20 grid place-items-center font-display font-semibold text-[--color-amber-400]">
                      CL
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[--color-fg-0]">Chilon Lubricants</div>
                      <div className="text-xs text-[--color-fg-3] font-mono uppercase tracking-widest">/ company motto</div>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="sec border-t border-[--color-line] relative">
        <div className="wrap">
          <Reveal>
            <div className="rule-mono">/ journey</div>
            <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              <SplitReveal text={t('about.timeline.title')} />
            </h2>
          </Reveal>

          <div className="mt-16 relative">
            {/* vertical line for desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[--color-line] -translate-x-1/2" />

            <div className="space-y-12 lg:space-y-20">
              {[
                { y: '2013', t: 'Tashkil etilgan', d: 'Toshkent, Bektemir tumanida zavod ishga tushirildi. O‘zbekistondagi birinchi yuqori texnologiyali moylash zavodi.' },
                { y: '2016', t: 'Sintetik liniya', d: 'Yangi avlod sintetik moylash mahsulotlari ishlab chiqarish liniyasi ishga tushirildi.' },
                { y: '2019', t: 'Temir yo‘l moylari', d: 'O‘zbekiston temir yo‘llari uchun maxsus moylash materiallari ishlab chiqarish boshlandi.' },
                { y: '2022', t: 'NVI® texnologiyasi', d: 'Patentlangan NVI® base oil texnologiyasi joriy etildi.' },
                { y: '2026', t: 'Global ekspansiya', d: 'Mintaqaviy bozorlarga kengayish — MDH va Janubiy Osiyo.' },
              ].map((step, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${i % 2 ? 'lg:[direction:rtl]' : ''}`}>
                    <div className={`relative ${i % 2 ? 'lg:[direction:ltr]' : ''}`}>
                      <div className="bento p-6 sm:p-8">
                        <div className="display text-[clamp(3rem,8vw,7rem)] leading-none text-grad-amber">{step.y}</div>
                        <h3 className="mt-4 font-display font-semibold text-xl sm:text-2xl text-[--color-fg-0]">{step.t}</h3>
                        <p className="mt-2 text-sm sm:text-base text-[--color-fg-2] leading-relaxed">{step.d}</p>
                      </div>
                    </div>
                    <div className="hidden lg:flex justify-center">
                      <div className="size-3 rounded-full bg-[--color-amber-500] shadow-[0_0_0_8px_rgba(255,138,31,0.15)]" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="sec border-t border-[--color-line] relative overflow-hidden">
        <div className="absolute -bottom-20 right-0 w-[40rem] h-[40rem] bg-[--color-cyan-500]/10 blur-3xl rounded-full pointer-events-none" />
        <div className="wrap relative">
          <Reveal>
            <div className="rule-mono">/ values</div>
            <h2 className="display mt-4 text-3xl sm:text-4xl lg:text-5xl">
              <SplitReveal text={t('about.values.title')} />
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {[
              { t: 'Sifat birinchi', d: 'Har bir mahsulot xalqaro standartlar bo‘yicha sertifikatlangan va sinovdan o‘tkazilgan.' },
              { t: 'Innovatsiya', d: 'NVI® bazaviy moylar, 12 bosqichli sintez va doimiy R&D.' },
              { t: 'Mustaqillik', d: '100% O‘zbekistonda ishlab chiqarilgan, import o‘rnini bosish strategiyasi.' },
              { t: 'Hamkorlik', d: 'Yetakchi sanoat brendlari bilan uzoq muddatli munosabatlar.' },
              { t: 'Ekologiya', d: 'ISO 14001 — atrof-muhitni boshqarish bo‘yicha sertifikatlangan.' },
              { t: 'Insonlar', d: '200+ malakali xodim — har biri o‘z sohasining mutaxassisi.' },
            ].map((v, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <Tilt3D intensity={5}>
                  <div className="bento p-6 sm:p-7 h-full">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">// 0{i + 1}</span>
                    <h3 className="mt-4 font-display font-semibold text-xl sm:text-2xl text-[--color-fg-0]">{v.t}</h3>
                    <p className="mt-2 text-sm text-[--color-fg-2] leading-relaxed">{v.d}</p>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing marquee */}
      <section className="border-y border-[--color-line] bg-[--color-bg-1] overflow-hidden py-6">
        <Marquee reverse>
          {['INNOVATION', 'QUALITY', 'TASHKENT', 'SINCE 2013', 'NVI® BASE OILS', 'PERFORMANCE'].map((it, i) => (
            <span key={i} className="inline-flex items-center gap-6 font-display text-3xl sm:text-5xl lg:text-6xl text-[--color-fg-1]">
              {it}<span className="text-[--color-amber-500]">/</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* CTA */}
      <section className="sec">
        <div className="wrap text-center">
          <Reveal>
            <h2 className="display text-3xl sm:text-5xl">Bizga qo‘shiling.</h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <Link href="/contacts" className="btn btn-primary">{t('hero.cta.contact')}</Link>
              </Magnetic>
              <Magnetic>
                <Link href="/products" className="btn btn-ghost">{t('hero.cta.explore')}</Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
