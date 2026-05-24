'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { CONTACTS, CATEGORIES } from '@/lib/data';
import Logo from './Logo';

const PHONE_DISPLAY = '+998 (78) 777-05-05';
const PHONE_HREF = 'tel:+998787770505';

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
    <footer className="bg-[--color-brand-800] text-[--color-brand-50]/85">
      {/* CTA strip */}
      <div className="border-b border-white/10 bg-[--color-brand-700]">
        <div className="wrap py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-semibold">
              {t('top.phone')}
            </div>
            <a
              href={PHONE_HREF}
              className="display text-2xl sm:text-3xl text-white hover:text-[--color-amber-300] transition-colors block mt-1"
            >
              {PHONE_DISPLAY}
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacts" className="btn btn-accent">{t('cta.callback')}</Link>
            <Link href="/products" className="btn btn-ghost text-white! border! border-white/30! hover:bg-white/10!">
              {t('cta.catalog')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="wrap pt-14 lg:pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
        {/* Brand block */}
        <div className="md:col-span-4">
          <div className="bg-white rounded-xl inline-flex p-4 sm:p-5">
            <Logo size="lg" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/80">
            {t('footer.tagline')}
          </p>

          {/* Social */}
          <div className="mt-6 flex items-center gap-2.5">
            {[
              { href: 'https://t.me/chilonuz', label: 'Telegram', icon: <TelegramIcon /> },
              { href: 'https://www.instagram.com/chilon.uz', label: 'Instagram', icon: <InstagramIcon /> },
              { href: 'https://www.facebook.com/chilon.uz', label: 'Facebook', icon: <FacebookIcon /> },
              { href: 'https://www.youtube.com/@chilonuz', label: 'YouTube', icon: <YoutubeIcon /> },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex items-center justify-center size-9 rounded-md border border-white/15 bg-white/5 text-white/80 hover:bg-[--color-amber-500] hover:border-[--color-amber-500] hover:text-[#1a0e00] transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Made in UZ */}
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
            <li>
              <Link
                href="/products"
                className="text-sm font-semibold text-[--color-amber-300] hover:text-[--color-amber-200] inline-flex items-center gap-1.5 transition-colors"
              >
                {t('cta.allProducts')}
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/55 mb-4">
            {t('footer.contacts')}
          </div>
          <ul className="space-y-3.5 text-sm">
            <li>
              <div className="text-white/55 text-xs mb-1">{t('contacts.address')}</div>
              <div className="text-white/90 leading-relaxed">{pick(CONTACTS.address)}</div>
            </li>
            <li>
              <div className="text-white/55 text-xs mb-1">{t('contacts.email')}</div>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="text-white/90 hover:text-white transition-colors"
              >
                {CONTACTS.email}
              </a>
            </li>
            <li>
              <div className="text-white/55 text-xs mb-1">{t('top.workhours')}</div>
              <div className="text-white/90">{pick(CONTACTS.workingHours)}</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="wrap py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/60">
          <div>© {year} Chilon Lubricants. {t('footer.rights')}</div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TelegramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.95 2.42 1.4 7.27c-.86.34-.85.83-.16 1.04l3.22 1 7.46-4.7c.35-.22.67-.1.41.13l-6.04 5.45.23.09 2.99 2.21c.4.22.69.1.79-.37l1.43-6.74c.15-.71-.25-1.03-.78-.96Z"/>
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3.2" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="11.7" cy="4.3" r="0.7" fill="currentColor"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.5 14V8.5h1.85l.28-2.1H9.5V5.07c0-.61.17-1.03 1.06-1.03h1.12V2.16C11.49 2.13 10.83 2 10.06 2c-1.62 0-2.73.98-2.73 2.8v1.6H5.5v2.1h1.83V14H9.5Z"/>
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
      <path d="M14.2 4.6c-.16-.62-.63-1.1-1.24-1.27C11.85 3 8 3 8 3s-3.85 0-4.96.33C2.43 3.5 1.96 3.98 1.8 4.6 1.5 5.74 1.5 8 1.5 8s0 2.26.3 3.4c.16.62.63 1.1 1.24 1.27C4.15 13 8 13 8 13s3.85 0 4.96-.33c.61-.17 1.08-.65 1.24-1.27.3-1.14.3-3.4.3-3.4s0-2.26-.3-3.4ZM6.8 10.1V5.9L10.4 8 6.8 10.1Z"/>
    </svg>
  );
}
