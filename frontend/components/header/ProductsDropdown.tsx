"use client";

import Link from "next/link";
import { pickLang } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import ArrowRight from "@/components/icons/ArrowRight";

type Props = {
  categories: Category[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

/**
 * Panel that drops down under the "Products" nav item.
 * Lists categories in two columns + a "view all" link at the bottom.
 */
export default function ProductsDropdown({ categories, onMouseEnter, onMouseLeave }: Props) {
  const { lang, t } = useLang();

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[min(40rem,90vw)] z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-black/10 overflow-hidden">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
          {categories.map((c) => {
            const name = pickLang(c.name as any, lang);
            const desc = pickLang(c.description as any, lang);
            return (
              <li key={c.id}>
                <Link
                  href={`/products?category=${c.id}`}
                  className="group flex flex-col gap-0.5 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition-colors"
                >
                  <span className="text-sm font-medium text-ink-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                    {name}
                  </span>
                  {desc && <span className="text-xs text-ink-500 line-clamp-1">{desc}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-ink-100 px-3 py-2.5 bg-ink-50/50">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {t("hero.cta.products")}
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
