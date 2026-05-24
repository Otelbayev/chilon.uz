'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { productImage } from '@/lib/data';
import type { Product } from '@/lib/types';
import Tilt3D from './Tilt3D';

export default function ProductCard({ product, idx = 0, compact = false }: { product: Product; idx?: number; compact?: boolean }) {
  const { t } = useLang();
  const img = productImage(product, idx);
  const tier = (product.tier as string | undefined) || (product.specs?.tier as string | undefined);

  return (
    <Tilt3D intensity={8} className="block h-full">
      <Link href={`/products/${product.id}`} className="pc block h-full">
        <div className="relative aspect-[3/4] flex flex-col">
          {/* Top bar */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3] leading-relaxed">
              <div>/ {product.category_id.replace(/-/g, ' ')}</div>
              {product.code && <div className="text-[--color-amber-400] mt-0.5">{product.code}</div>}
            </div>
            {tier && (
              <span className={`chip ${tier === 'premium' ? '!border-[--color-amber-500] !text-[--color-amber-300]' : ''}`}>
                {String(tier)}
              </span>
            )}
          </div>

          {/* Bottle */}
          <div className="pedestal relative flex-1 grid place-items-center px-6 pt-12">
            <img
              src={img}
              alt={product.name}
              className="pc-img max-h-[78%] max-w-[70%] object-contain drop-shadow-[0_24px_36px_rgba(255,138,31,0.18)]"
              loading="lazy"
            />
          </div>

          {/* Title block */}
          <div className="relative z-10 p-4 sm:p-5 border-t border-[--color-line]">
            <h3 className={`font-display font-semibold leading-tight tracking-tight text-[--color-fg-0] line-clamp-2 ${compact ? 'text-sm' : 'text-base sm:text-lg'}`}>
              {product.name}
            </h3>
            {!compact && product.applications && (
              <p className="mt-1.5 text-xs text-[--color-fg-3] line-clamp-2">{product.applications}</p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-amber-400]">
                {t('news.read')}
              </span>
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-[--color-line-2] text-[--color-fg-1] group-hover:border-[--color-amber-500]">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Tilt3D>
  );
}
