"use client";

import Link from "next/link";
import { pickLang, productImage } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import ArrowRight from "@/components/icons/ArrowRight";

type Props = {
  category: Category;
  /** Index in the list — used to pick a stable fallback image. */
  idx: number;
};

/** Single category tile used inside CategoriesSlide. */
export default function CategoryCard({ category, idx }: Props) {
  const { lang, t } = useLang();
  const name = pickLang(category.name as any, lang);
  const desc = pickLang(category.description as any, lang);
  const img = productImage(
    { id: category.id, name, image: category.image },
    idx,
  );

  return (
    <Link
      href={`/products?category=${category.id}`}
      className="group relative flex items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-3xl bg-white border border-ink-100 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-12 -right-10 size-40 rounded-full bg-brand-100/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative size-20 sm:size-24 shrink-0 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-brand-100/60 border border-ink-100 grid place-items-center p-2">
        <img
          src={img}
          alt={name}
          className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-ink-900 group-hover:text-brand-700 transition-colors leading-snug line-clamp-2">
          {name}
        </h3>
        {desc && <p className="mt-1 text-xs sm:text-sm text-ink-500 line-clamp-2">{desc}</p>}
        <div className="mt-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-brand-600">
          <span>{t("categories.view")}</span>
          <ArrowRight />
        </div>
      </div>
    </Link>
  );
}
