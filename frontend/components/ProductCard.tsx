'use client';

import Link from 'next/link';
import { pickLang, productImage } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import type { Product } from '@/lib/types';

export default function ProductCard({ product, idx }: { product: Product; idx?: number }) {
  const { lang, t } = useLang();
  const img = productImage(product, idx);
  const desc = pickLang(product.description as any, lang);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-ink-100 transition-all duration-500 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.code && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-ink-700 shadow-sm">
            {product.code}
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center p-6">
          <img
            src={img}
            alt={product.name}
            className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Bottom strip */}
      <div className="flex flex-col gap-1.5 p-4 sm:p-5">
        <h3 className="font-semibold text-sm sm:text-base text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {desc && (
          <p className="text-xs sm:text-sm text-ink-500 line-clamp-2">{desc}</p>
        )}
        <div className="mt-1 flex items-center gap-1 text-xs sm:text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <span>{t('news.readMore')}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
