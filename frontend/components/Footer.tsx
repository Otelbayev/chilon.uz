'use client';

import Link from 'next/link';
import Logo from './Logo';
import { useLang } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-ink-500 max-w-sm">
              {t('hero.subtitle')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-ink-500">
              {t('nav.products')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-brand-600">{t('nav.products')}</Link></li>
              <li><Link href="/partners" className="hover:text-brand-600">{t('nav.partners')}</Link></li>
              <li><Link href="/news" className="hover:text-brand-600">{t('nav.news')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-ink-500">
              {t('nav.contacts')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-brand-600">{t('nav.about')}</Link></li>
              <li><Link href="/contacts" className="hover:text-brand-600">{t('nav.contacts')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-500">
          <span>© {year} Chilon. {t('footer.rights')}.</span>
          <span>Made with care in Uzbekistan</span>
        </div>
      </div>
    </footer>
  );
}
