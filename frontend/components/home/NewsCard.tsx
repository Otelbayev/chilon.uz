"use client";

import Link from "next/link";
import { pickLang, productImage } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import type { NewsItem } from "@/lib/types";

type Props = {
  item: NewsItem;
  /** Index in the list — used to pick a stable fallback image. */
  idx: number;
};

/** Single news card used inside CtaSlide. */
export default function NewsCard({ item, idx }: Props) {
  const { lang } = useLang();
  const title = pickLang(item.title as any, lang);
  const img = productImage({ id: item.slug }, idx);
  const formatted = new Date(item.date).toLocaleDateString(
    lang === "uz" ? "uz-UZ" : lang,
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <Link
      href={`/news/${item.slug}`}
      className="group block overflow-hidden rounded-3xl border border-ink-100 bg-white hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="aspect-[16/10] bg-gradient-to-br from-brand-50/70 to-brand-100/60 grid place-items-center p-6">
        <img
          src={img}
          alt={title}
          className="max-h-[85%] max-w-[70%] object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-4 sm:p-5">
        <time className="text-[10px] font-medium text-brand-600 uppercase tracking-wider">
          {formatted}
        </time>
        <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug">
          {title}
        </h3>
      </div>
    </Link>
  );
}
