'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { productImage } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function ProductCard({
  product,
  idx = 0,
  showApplications = true,
}: {
  product: Product;
  idx?: number;
  showApplications?: boolean;
}) {
  const { t } = useLang();
  const img = productImage(product, idx);
  const sae = product.specs?.sae as string | undefined;
  const api = product.specs?.api as string | undefined;
  const iso = product.specs?.['iso-vg'] as string | undefined;
  const nlgi = product.specs?.nlgi as string | undefined;
  const tier = (product.tier as string | undefined) || (product.specs?.tier as string | undefined);

  const chips: Array<{ label: string; tone?: 'amber' | 'brand' }> = [];
  if (sae) chips.push({ label: `SAE ${sae}`, tone: 'amber' });
  if (api) chips.push({ label: `API ${api}` });
  if (iso) chips.push({ label: `ISO VG ${iso}` });
  if (nlgi) chips.push({ label: `NLGI ${nlgi}` });

  return (
    <Link href={`/products/${product.id}`} className="product-card block group">
      {/* Top tier ribbon */}
      {tier && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center rounded-md bg-[--color-amber-500] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft">
          {String(tier)}
        </span>
      )}

      <div className="product-card-img">
        <img src={img} alt={product.name} loading="lazy" />
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-5">
        {product.code && (
          <div className="text-[11px] font-medium text-[--color-ink-500] mb-1.5 line-clamp-1">
            {t('products.code')}: {product.code}
          </div>
        )}
        <h3 className="font-display font-semibold text-[--color-ink-900] text-base sm:text-lg leading-snug line-clamp-2">
          {product.name}
        </h3>

        {showApplications && product.applications && (
          <p className="mt-1.5 text-xs text-[--color-ink-500] line-clamp-2 leading-relaxed">
            {product.applications}
          </p>
        )}

        {chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className={`tag ${c.tone === 'amber' ? 'tag-amber' : 'tag-neutral'} text-[10px]! py-0.5! px-2!`}
              >
                {c.label}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[--color-ink-100]">
          <span className="text-xs font-semibold text-[--color-brand-700] inline-flex items-center gap-1">
            {t('cta.details')}
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="transition-transform group-hover:translate-x-1">
              <path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="inline-flex items-center justify-center size-8 rounded-md bg-[--color-cream] text-[--color-ink-700] group-hover:bg-[--color-brand-500] group-hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 4h2l1.5 8h8L17 6H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="15" r="1.2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="15" r="1.2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
