'use client';

import { motion } from 'motion/react';
import Reveal from '@/components/Reveal';
import { useLang } from '@/lib/i18n';
import { FOUNDED_YEAR, getStats } from '@/lib/stats';

export default function AboutPage() {
  const { t } = useLang();
  const years = new Date().getFullYear() - FOUNDED_YEAR;

  return (
    <div className="bg-white">
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 size-[28rem] rounded-full bg-brand-100/60 blur-3xl" />
        </div>
        <div className="container-x relative max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700"
          >
            {t('about.subtitle')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="display mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight"
          >
            {t('about.title')}
          </motion.h1>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid lg:grid-cols-3 gap-12">
          <Reveal as="div" className="lg:col-span-2 space-y-5 text-lg text-ink-700 leading-relaxed">
            <p>
              Chilon — O&apos;zbekiston bo&apos;ylab moylash mahsulotlari sohasidagi ishonchli yetkazib beruvchi. Bizning maqsadimiz — har bir mijozga eng yaxshi sifat va xizmatni taklif qilish.
            </p>
            <p>
              {FOUNDED_YEAR}-yildan beri — {years} yildan ortiq tajriba davomida biz dunyodagi yetakchi brendlar bilan hamkorlik qildik, mahalliy bozorda mustahkam mavqega ega bo&apos;ldik va minglab mijozlarning ishonchini qozondik.
            </p>
            <p>
              Bizning portfelimizda 130 dan ortiq mahsulot mavjud — motor moylari, transmissiya suyuqliklari, sanoat smazkalari va boshqa kerakli yechimlar.
            </p>
          </Reveal>

          {/* Same source as the home page's numbers slide, so the two pages
              can never disagree about how long Chilon has been trading. */}
          <Reveal as="div" className="space-y-4" stagger={0.12}>
            {getStats().map((s) => (
              <div key={s.labelKey} className="rounded-2xl border border-ink-100 p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all">
                <div className="text-3xl font-bold text-brand-600">
                  {s.approx && <span className="text-ink-300">~</span>}
                  {s.value}
                  {s.suffix && <span className="text-lg ml-1">{s.suffix}</span>}
                </div>
                <div className="text-sm text-ink-500 mt-1">{t(s.labelKey)}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
