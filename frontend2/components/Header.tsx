'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { CONTACTS } from '@/lib/data';
import LangSwitcher from './LangSwitcher';
import Logo from './Logo';

const PHONE_DISPLAY = '+998 (78) 777-05-05';
const PHONE_HREF = 'tel:+998787770505';

export default function Header() {
  const { t, pick } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const nav = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') },
    { href: '/partners', label: t('nav.partners') },
    { href: '/news', label: t('nav.news') },
    { href: '/contacts', label: t('nav.contacts') },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50">
        {/* Utility bar */}
        <div className="hidden md:block bg-[--color-brand-700] text-[--color-brand-50]/90 text-xs">
          <div className="wrap flex items-center justify-between py-2">
            <div className="flex items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <PinIcon />
                <span className="line-clamp-1">{pick(CONTACTS.address)}</span>
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5">
                <ClockIcon />
                {t('top.workhours')}
              </span>
              <span className="hidden lg:inline-flex items-center gap-1.5">
                <TruckIcon />
                {t('top.delivery')}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a href={`mailto:${CONTACTS.email}`} className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <MailIcon />
                {CONTACTS.email}
              </a>
              <LangSwitcher compact />
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className={`bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'shadow-soft border-b border-[--color-ink-100]' : 'border-b border-transparent'}`}>
          <div className="wrap flex items-center justify-between gap-6 py-3 lg:py-4">
            <Logo />

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3.5 py-2 text-[15px] font-medium font-display rounded-md transition-colors ${
                      active ? 'text-[--color-brand-700]' : 'text-[--color-ink-800] hover:text-[--color-brand-700]'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-3.5 right-3.5 h-0.5 rounded bg-[--color-brand-600]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <a href={PHONE_HREF} className="hidden sm:flex items-center gap-2 text-sm">
                <span className="inline-flex size-9 items-center justify-center rounded-md bg-[--color-brand-50] text-[--color-brand-700]">
                  <PhoneIcon />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] uppercase tracking-wider text-[--color-ink-500]">{t('top.phone')}</span>
                  <span className="font-semibold text-[--color-ink-900] font-display">{PHONE_DISPLAY}</span>
                </span>
              </a>

              <Link href="/contacts" className="hidden lg:inline-flex btn btn-primary btn-sm">
                {t('cta.callback')}
              </Link>

              <button
                aria-label={t('nav.menu')}
                onClick={() => setOpen(true)}
                className="lg:hidden inline-flex items-center justify-center size-11 rounded-md border border-[--color-ink-200] text-[--color-ink-900] hover:bg-[--color-cream] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-[--color-ink-900]/40 z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[min(20rem,86vw)] bg-white shadow-2xl flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[--color-ink-100]">
                <Logo />
                <button
                  onClick={() => setOpen(false)}
                  aria-label={t('nav.close')}
                  className="inline-flex items-center justify-center size-10 rounded-md text-[--color-ink-700] hover:bg-[--color-cream]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-3 rounded-md text-base font-medium font-display ${
                          isActive(item.href)
                            ? 'bg-[--color-brand-50] text-[--color-brand-700]'
                            : 'text-[--color-ink-900] hover:bg-[--color-cream]'
                        }`}
                      >
                        {item.label}
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="opacity-50">
                          <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[--color-ink-100] p-5 space-y-3">
                <a href={PHONE_HREF} className="flex items-center gap-3 text-sm">
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-[--color-brand-50] text-[--color-brand-700]">
                    <PhoneIcon />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-[--color-ink-500]">{t('top.phone')}</span>
                    <span className="font-semibold text-[--color-ink-900] font-display">{PHONE_DISPLAY}</span>
                  </span>
                </a>
                <Link href="/contacts" className="btn btn-primary w-full">{t('cta.callback')}</Link>
                <div className="pt-2 flex justify-center">
                  <LangSwitcher />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 13s5-4.5 5-8a5 5 0 1 0-10 0c0 3.5 5 8 5 8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
      <path d="M1 3h7v6H1zM8 5h3l2 2.5v1.5H8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="4" cy="11" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="11" cy="11" r="1.2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="1.5" y="3" width="11" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M2 4l5 4 5-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M5.5 2.5l1.5 3-1 1c.5 1.8 2.2 3.5 4 4l1-1 3 1.5v3a1.5 1.5 0 0 1-1.5 1.5C7.6 15.5 2.5 10.4 2.5 4a1.5 1.5 0 0 1 1.5-1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
