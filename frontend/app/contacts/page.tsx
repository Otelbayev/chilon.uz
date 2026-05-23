'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { api, pickLang } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { SiteContacts, ContactDealer } from '@/lib/types';
import { REGIONS } from '@/components/UzbekistanMap';

const UzbekistanMap = dynamic(() => import('@/components/UzbekistanMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/10] rounded-2xl bg-ink-100 grid place-items-center text-ink-500 text-sm">
      Xarita yuklanmoqda...
    </div>
  ),
});

export default function ContactsPage() {
  const { lang, t } = useLang();
  const [contacts, setContacts] = useState<SiteContacts | null>(null);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    api.contacts(lang).then(setContacts).catch(() => {});
  }, [lang]);

  // Map selected region id → dealers
  const dealers = contacts?.dealers || [];
  const selectedRegion = useMemo(() => REGIONS.find((r) => r.id === selectedId), [selectedId]);
  const selectedDealers = useMemo(() => {
    if (!selectedRegion) return [];
    return dealers.filter((d) => {
      const text = typeof d.region === 'string'
        ? d.region
        : (d.region as any)?.uz || (d.region as any)?.ru || '';
      return selectedRegion.match.test(text);
    });
  }, [selectedRegion, dealers]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setStatus('sending');
    try {
      await api.submitCallback({ ...form, source: 'contacts_page' });
      setStatus('success');
      setForm({ name: '', phone: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-28 pb-8 sm:pt-32 sm:pb-12 relative overflow-hidden border-b border-ink-100">
        <div className="pointer-events-none absolute -top-20 right-0 size-[28rem] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="container-x relative">
          <nav className="text-xs text-ink-500 flex items-center gap-1.5 mb-3">
            <a href="/" className="hover:text-brand-600">{t('nav.home')}</a>
            <span>/</span>
            <span className="text-ink-900 font-medium">{t('nav.contacts')}</span>
          </nav>
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-brand-700">
              {t('contacts.subtitle')}
            </span>
            <h1 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {t('contacts.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Form + Departments */}
      <section className="container-x py-10 lg:py-14">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Callback form — compact */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={submit}
            className="lg:col-span-3 rounded-3xl border border-ink-100 p-6 lg:p-8 bg-gradient-to-br from-white via-brand-50/40 to-white"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-ink-900">
              {t('contacts.title')}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {t('contacts.subtitle')}
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {t('contacts.form.name')} *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">
                  {t('contacts.form.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              className="btn-primary mt-5 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? t('common.loading') : t('contacts.form.submit')}
            </button>

            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 font-medium"
              >
                ✓ {t('contacts.form.success')}
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {t('contacts.form.error')}
              </motion.div>
            )}
          </motion.form>

          {/* Departments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {contacts?.departments && contacts.departments.length > 0 && (
              <>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-3">
                  {t('contacts.departments')}
                </h3>
                <ul className="space-y-2.5">
                  {contacts.departments.map((d) => (
                    <li key={d.id} className="rounded-2xl border border-ink-100 p-4 hover:border-brand-300 hover:shadow-md hover:shadow-brand-500/5 transition-all">
                      <div className="font-medium text-ink-900">{pickLang(d.name, lang)}</div>
                      <div className="mt-1.5 space-y-0.5">
                        {d.phones.map((p) => (
                          <a
                            key={p}
                            href={`tel:${p.replace(/\s/g, '')}`}
                            className="block text-sm text-brand-600 hover:text-brand-700 font-medium"
                          >
                            {p}
                          </a>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Map section */}
      <section className="bg-gradient-to-b from-[#f6fcf9] to-white border-t border-ink-100">
        <div className="container-x py-12 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-brand-700">
              {t('contacts.dealers')}
            </span>
            <h2 className="display mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {t('contacts.dealers')} —{' '}
              <span className="text-brand-600">{dealers.length} ta viloyat</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-500">
              Xaritada yashil rangda belgilangan viloyatlarni bosib, diler ma'lumotlarini ko'ring.
            </p>
          </div>

          <div className="mt-6 lg:mt-10 grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 rounded-3xl border border-ink-100 bg-white p-4 sm:p-6 lg:p-8 overflow-hidden">
              <UzbekistanMap
                dealers={dealers}
                lang={lang}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </div>

            {/* Info panel */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AnimatePresence mode="wait">
                {selectedRegion ? (
                  <motion.div
                    key={selectedRegion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.21, 1, 0.36, 1] }}
                    className="relative rounded-3xl border border-brand-200 bg-white p-6 shadow-xl shadow-brand-500/10"
                  >
                    <button
                      onClick={() => setSelectedId(null)}
                      aria-label="Close"
                      className="absolute top-4 right-4 grid place-items-center size-8 rounded-full hover:bg-ink-100 text-ink-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </button>

                    <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                      <span className="size-1.5 rounded-full bg-brand-500" />
                      Mintaqaviy diler
                    </div>

                    <h3 className="mt-3 text-xl sm:text-2xl font-bold text-ink-900">
                      {selectedRegion.name[lang] || selectedRegion.name.uz}
                    </h3>

                    <div className="mt-5 space-y-3">
                      {selectedDealers.map((d, i) => {
                        const phone = d.phone;
                        const region = typeof d.region === 'string'
                          ? d.region
                          : pickLang(d.region as any, lang);
                        return (
                          <div key={i} className="rounded-2xl bg-brand-50/60 p-4 border border-brand-100">
                            <div className="text-xs text-ink-500 mb-1.5">
                              Filial — {region}
                            </div>
                            <a
                              href={`tel:${phone.replace(/\s|\(|\)/g, '')}`}
                              className="inline-flex items-center gap-2 text-lg sm:text-xl font-semibold text-brand-700 hover:text-brand-800 transition-colors"
                            >
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                  d="M5 2.5l1.5 3.5-1.7 1.2c.8 1.8 2.2 3.2 4 4l1.2-1.7 3.5 1.5v3a1 1 0 0 1-1 1A12 12 0 0 1 1 3a1 1 0 0 1 1-1h3z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                              {phone}
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 pt-5 border-t border-ink-100 text-xs text-ink-500">
                      Tanlangan viloyatdagi rasmiy diler bilan to'g'ridan-to'g'ri bog'laning.
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-dashed border-ink-200 p-6 lg:p-8 text-center"
                  >
                    <div className="mx-auto size-12 rounded-full bg-brand-50 grid place-items-center mb-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2C6.7 2 4 4.7 4 8c0 5 6 10 6 10s6-5 6-10c0-3.3-2.7-6-6-6z" stroke="#10b981" strokeWidth="1.6" />
                        <circle cx="10" cy="8" r="2" stroke="#10b981" strokeWidth="1.6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-ink-700">
                      Diler tanlang
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      Xaritadagi yashil viloyatni bosing — diler ma'lumotlari shu yerda chiqadi.
                    </p>

                    {/* Quick list of regions with dealers */}
                    <div className="mt-5 pt-5 border-t border-ink-100">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-500 mb-2">
                        Mavjud viloyatlar
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {dealers.map((d, i) => {
                          const text = typeof d.region === 'string'
                            ? d.region
                            : pickLang(d.region as any, lang);
                          const region = REGIONS.find((r) => r.match.test(text));
                          return (
                            <button
                              key={i}
                              onClick={() => region && setSelectedId(region.id)}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                            >
                              {region ? (region.name[lang] || region.name.uz) : text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
