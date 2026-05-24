'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { CONTACTS, DEPARTMENTS, DEALERS } from '@/lib/data';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';
import Magnetic from '@/components/Magnetic';

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
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="relative pt-28 lg:pt-36 pb-24 noise overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[40rem] mesh-bg pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[40rem] bg-grid bg-grid-fade pointer-events-none" />

      <div className="relative wrap">
        {/* Hero */}
        <Reveal>
          <div className="flex items-center gap-3 sec-num">
            <span>/ contact</span>
            <span className="block h-px w-12 bg-[--color-line-2]" />
            <span className="text-[--color-amber-400]">live · 24/7</span>
          </div>
        </Reveal>
        <h1 className="display mt-5 text-[clamp(2.75rem,9vw,10rem)] leading-[0.88]">
          <SplitReveal text={t('contacts.title')} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-[--color-fg-2]">{t('contacts.sub')}</p>
        </Reveal>

        {/* Top quick cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {[
            { label: t('contacts.address'), value: pick(CONTACTS.address), icon: <PinIcon /> },
            { label: t('contacts.email'), value: CONTACTS.email, icon: <MailIcon />, href: `mailto:${CONTACTS.email}` },
            { label: t('contacts.hours'), value: pick(CONTACTS.workingHours), icon: <ClockIcon /> },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <Tilt3D intensity={5}>
                {c.href ? (
                  <a href={c.href} className="bento block p-6 sm:p-7 h-full">
                    <CardBody {...c} />
                  </a>
                ) : (
                  <div className="bento p-6 sm:p-7 h-full">
                    <CardBody {...c} />
                  </div>
                )}
              </Tilt3D>
            </Reveal>
          ))}
        </div>

        {/* Form + Departments */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="bento p-7 sm:p-10">
                <div className="rule-mono">/ send a message</div>
                <h2 className="display mt-3 text-2xl sm:text-3xl text-[--color-fg-0]">
                  Bizga yozing
                </h2>

                <form onSubmit={onSubmit} className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      name="name"
                      placeholder={t('contacts.form.name')}
                      className="input"
                    />
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder={t('contacts.form.phone')}
                      className="input"
                    />
                  </div>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder={t('contacts.form.message')}
                    className="input resize-none"
                  />
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                      sha256-encrypted · stored locally
                    </span>
                    <Magnetic>
                      <button type="submit" className="btn btn-primary">
                        {t('contacts.form.send')}
                        <Arrow />
                      </button>
                    </Magnetic>
                  </div>
                </form>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-[--color-amber-500]/40 bg-[--color-amber-500]/10 px-4 py-3 text-sm text-[--color-amber-300]"
                  >
                    ✓ {t('contacts.form.ok')}
                  </motion.div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Departments */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="rule-mono">/ {t('contacts.departments')}</div>
              <h2 className="display mt-3 text-2xl sm:text-3xl">{t('contacts.departments')}</h2>
              <ul className="mt-6 space-y-3">
                {DEPARTMENTS.map((d, i) => (
                  <Reveal key={d.id} delay={i * 0.05}>
                    <li className="bento p-5">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                        // {String(i + 1).padStart(2, '0')}
                      </div>
                      <div className="mt-1 font-display font-semibold text-[--color-fg-0]">{pick(d.name)}</div>
                      <div className="mt-3 flex flex-col gap-1.5">
                        {d.phones.map((ph) => (
                          <a
                            key={ph}
                            href={`tel:${ph.replace(/[^\d+]/g, '')}`}
                            className="font-mono text-sm text-[--color-amber-400] hover:text-[--color-amber-300] transition-colors inline-block"
                          >
                            {ph}
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

        {/* Dealers map list */}
        {DEALERS.length > 0 && (
          <section className="mt-20 lg:mt-28">
            <Reveal>
              <div className="rule-mono">/ {t('contacts.dealers')}</div>
              <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl">
                <SplitReveal text={t('contacts.dealers')} />
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEALERS.map((d, i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <div className="bento p-5 group">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-display font-medium text-[--color-fg-0]">{pick(d.region)}</div>
                        <a
                          href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                          className="font-mono text-sm text-[--color-amber-400] inline-block mt-1"
                        >
                          {d.phone}
                        </a>
                      </div>
                      <span className="inline-flex size-10 items-center justify-center rounded-full border border-[--color-line-2] group-hover:border-[--color-amber-500] transition-colors text-[--color-fg-1]">
                        <PinIcon small />
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CardBody({ label, value, icon }: { label: string; value?: string | React.ReactNode; icon?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="rule-mono">/ {label}</div>
        <span className="size-10 rounded-xl bg-[--color-amber-500]/10 text-[--color-amber-400] grid place-items-center">
          {icon}
        </span>
      </div>
      <div className="mt-6 font-display font-medium text-lg sm:text-xl text-[--color-fg-0] leading-tight">
        {value}
      </div>
    </>
  );
}

function PinIcon({ small }: { small?: boolean }) {
  const s = small ? 13 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
      <path d="M10 18s6-6 6-10a6 6 0 1 0-12 0c0 4 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 5l7 6 7-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
