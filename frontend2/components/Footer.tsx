'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { CONTACTS, CATEGORIES } from '@/lib/data';
import Logo from './Logo';

export default function Footer() {
  const { t, pick } = useLang();
  const year = new Date().getFullYear();

  const nav = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/partners', label: t('nav.partners') },
    { href: '/news', label: t('nav.news') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  const cats = CATEGORIES.slice(0, 6);

  return (
    <footer className="bg-[--color-brand-800] text-[--color-brand-50]/85 mt-10">
      <div className="wrap pt-14 lg:pt-20 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
        {/* Brand block */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-lg inline-flex p-4">
            <Logo size="lg" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80">
            {t('footer.tagline')}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs">
            <span className="size-2 rounded-full bg-[--color-amber-400]" />
            {t('footer.madeIn')}
          </div>
        </div>

        {/* Nav */}
        <div className="md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55 mb-4">
            {t('footer.nav')}
          </div>
          <ul className="space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-sm text-white/85 hover:text-white transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Catalog */}
        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55 mb-4">
            {t('footer.catalog')}
          </div>
          <ul className="space-y-2.5">
            {cats.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/products?cat=${c.id}`}
                  className="text-sm text-white/85 hover:text-white transition-colors line-clamp-1"
                >
                  {pick(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacts */}
        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55 mb-4">
            {t('footer.contacts')}
          </div>
          <ul className="space-y-3 text-sm">
            <li>
              <div className="text-white/55 text-xs mb-0.5">{t('contacts.address')}</div>
              <div className="text-white/90">{pick(CONTACTS.address)}</div>
            </li>
            <li>
              <div className="text-white/55 text-xs mb-0.5">{t('contacts.email')}</div>
              <a href={`mailto:${CONTACTS.email}`} className="text-white/90 hover:text-white">{CONTACTS.email}</a>
            </li>
            <li>
              <div className="text-white/55 text-xs mb-0.5">{t('top.workhours')}</div>
              <div className="text-white/90">{pick(CONTACTS.workingHours)}</div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/60">
          <div>© {year} Chilon Lubricants. {t('footer.rights')}</div>
          <div className="flex items-center gap-5">
            <Link href="/contacts" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link href="/contacts" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
