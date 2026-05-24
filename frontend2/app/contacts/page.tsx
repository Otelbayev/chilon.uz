'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { CONTACTS, DEPARTMENTS, DEALERS } from '@/lib/data';
import { Reveal } from '@/components/Reveal';

export default function ContactsPage() {
  const { t, pick } = useLang();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    if (typeof window !== 'undefined') {
      const key = 'chilon2_callbacks';
      const prev = JSON.parse(localStorage.getItem(key) || '[]');
      prev.push({ ...payload, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(prev));
    }
    setSubmitted(true);
    form.reset();
    setTimeout(() => setSubmitted(false), 7000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[--color-cream] border-b border-[--color-ink-100]">
        <div className="wrap py-12 lg:py-16">
          <Reveal>
            <nav className="text-xs text-[--color-ink-500] mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-[--color-brand-700]">{t('nav.home')}</Link>
              <span>/</span>
              <span className="text-[--color-ink-800]">{t('nav.contacts')}</span>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display text-4xl sm:text-5xl lg:text-6xl">{t('contacts.title')}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-[--color-ink-700]">
              {t('contacts.sub')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Quick info cards */}
      <section className="sec pt-10! sm:pt-14!">
        <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {[
            { label: t('contacts.address'), value: pick(CONTACTS.address), icon: <PinIcon /> },
            { label: t('contacts.email'), value: CONTACTS.email, icon: <MailIcon />, href: `mailto:${CONTACTS.email}` },
            { label: t('contacts.hours'), value: pick(CONTACTS.workingHours), icon: <ClockIcon /> },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.05}>
              {c.href ? (
                <a href={c.href} className="card card-hover block p-6 sm:p-7 h-full">
                  <InfoBody {...c} />
                </a>
              ) : (
                <div className="card p-6 sm:p-7 h-full">
                  <InfoBody {...c} />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + Departments */}
      <section className="sec pt-0!">
        <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="card p-6 sm:p-10">
                <span className="eyebrow">{t('contacts.form.title')}</span>
                <h2 className="display mt-3 text-2xl sm:text-3xl text-[--color-ink-900]">
                  Biz bilan bog‘laning
                </h2>
                <p className="mt-2 text-sm sm:text-base text-[--color-ink-600]">
                  {t('contacts.form.sub')}
                </p>

                <form onSubmit={onSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label={t('contacts.form.name')}>
                      <input required name="name" placeholder={t('contacts.form.name')} className="input" />
                    </FormField>
                    <FormField label={t('contacts.form.phone')}>
                      <input required type="tel" name="phone" placeholder="+998 __ ___-__-__" className="input" />
                    </FormField>
                  </div>
                  <FormField label={t('contacts.form.email')}>
                    <input type="email" name="email" placeholder="email@example.com" className="input" />
                  </FormField>
                  <FormField label={t('contacts.form.message')}>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder={t('contacts.form.message')}
                      className="input resize-none"
                    />
                  </FormField>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-[--color-ink-500] max-w-sm">
                      Yuborganingiz bilan siz maxfiylik siyosatini qabul qilasiz.
                    </p>
                    <button type="submit" className="btn btn-primary btn-lg">
                      {t('contacts.form.send')}
                      <ArrowR />
                    </button>
                  </div>
                </form>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-md border border-[--color-brand-200] bg-[--color-brand-50] px-4 py-3 text-sm text-[--color-brand-700] inline-flex items-center gap-2"
                  >
                    <CheckIcon /> {t('contacts.form.ok')}
                  </motion.div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Departments */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow">{t('contacts.departments')}</span>
              <h2 className="display mt-3 text-2xl sm:text-3xl">{t('contacts.departments')}</h2>
              <ul className="mt-6 space-y-3">
                {DEPARTMENTS.map((d, i) => (
                  <Reveal key={d.id} delay={i * 0.05}>
                    <li className="card p-5 sm:p-6">
                      <div className="font-display font-semibold text-[--color-ink-900] text-base">
                        {pick(d.name)}
                      </div>
                      <div className="mt-3 flex flex-col gap-2">
                        {d.phones.map((ph) => (
                          <a
                            key={ph}
                            href={`tel:${ph.replace(/[^\d+]/g, '')}`}
                            className="inline-flex items-center gap-2 text-sm font-medium text-[--color-brand-700] hover:text-[--color-brand-800] transition-colors"
                          >
                            <PhoneIcon /> {ph}
                          </a>
                        ))}
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map placeholder + Address card */}
      <section className="sec pt-0!">
        <div className="wrap">
          <Reveal>
            <div className="card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-center">
                <span className="eyebrow">{t('contacts.address')}</span>
                <h3 className="display mt-3 text-2xl text-[--color-ink-900]">Bizning ofis</h3>
                <p className="mt-3 text-[--color-ink-700]">{pick(CONTACTS.address)}</p>
                <p className="mt-1.5 text-sm text-[--color-ink-500]">{pick(CONTACTS.workingHours)}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pick(CONTACTS.address))}`}
                  target="_blank"
                  rel="noopener"
                  className="btn btn-outline mt-6 self-start"
                >
                  Xaritada ko‘rish
                  <ArrowR />
                </a>
              </div>
              <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto bg-[--color-cream] relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[--color-ink-100]">
                {/* Subtle map-like grid bg */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(31,84,57,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,84,57,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <span className="absolute inset-0 rounded-full bg-[--color-brand-500]/30 animate-ping" />
                      <span className="relative size-12 rounded-full bg-[--color-brand-600] grid place-items-center text-white shadow-lg">
                        <PinIcon big />
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-display font-semibold text-[--color-ink-900]">Chilon Lubricants</div>
                    <div className="text-xs text-[--color-ink-500]">Bektemir / Toshkent</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dealers */}
      {DEALERS.length > 0 && (
        <section className="sec pt-0!">
          <div className="wrap">
            <div className="max-w-2xl mb-8">
              <Reveal><span className="eyebrow">{t('contacts.dealers')}</span></Reveal>
              <Reveal delay={0.05}>
                <h2 className="display mt-3 text-3xl sm:text-4xl">{t('contacts.dealers')}</h2>
              </Reveal>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEALERS.map((d, i) => (
                <Reveal key={i} delay={i * 0.03}>
                  <div className="card p-5">
                    <div className="text-xs text-[--color-ink-500] mb-1">Viloyat</div>
                    <div className="font-display font-semibold text-[--color-ink-900]">{pick(d.region)}</div>
                    <a
                      href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[--color-brand-700]"
                    >
                      <PhoneIcon /> {d.phone}
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function InfoBody({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs uppercase tracking-widest text-[--color-ink-500] font-semibold">{label}</span>
        <span className="size-10 rounded-md bg-[--color-brand-50] text-[--color-brand-700] grid place-items-center shrink-0">
          {icon}
        </span>
      </div>
      <div className="mt-5 font-display font-semibold text-base sm:text-lg text-[--color-ink-900] leading-snug">
        {value}
      </div>
    </>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-widest text-[--color-ink-500] mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function PinIcon({ big }: { big?: boolean }) {
  const s = big ? 18 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
      <path d="M9 16s5.5-5 5.5-9a5.5 5.5 0 1 0-11 0c0 4 5.5 9 5.5 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 5l6 5 6-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
