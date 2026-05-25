"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Category } from "@/lib/types";
import ArrowRight from "@/components/icons/ArrowRight";
import CategoryCard from "./CategoryCard";
import RevealOnView from "./RevealOnView";
import SlideShell from "./SlideShell";

type Props = { categories: Category[] };

/** Slide 2 — "Product catalog" grid of category cards. */
export default function CategoriesSlide({ categories }: Props) {
  const { t } = useLang();

  return (
    <SlideShell
      sectionKey="categories"
      bgClass="bg-gradient-to-b from-[#fafdf8] to-white"
      pattern={
        <>
          <div className="absolute top-20 right-[15%] size-[20rem] sm:size-[26rem] rounded-full bg-brand-100/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle, #059669 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <RevealOnView>
              <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
                02 — {t("categories.subtitle")}
              </span>
            </RevealOnView>
            <RevealOnView delay={0.08}>
              <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
                {t("categories.title")}
              </h2>
            </RevealOnView>
            <RevealOnView delay={0.14}>
              <p className="mt-2.5 text-sm sm:text-base text-ink-700 max-w-xl">
                {t("categories.subtitle")}
              </p>
            </RevealOnView>
          </div>
          <RevealOnView delay={0.18}>
            <Link href="/products" className="btn-primary shrink-0">
              {t("hero.cta.products")}
              <ArrowRight />
            </Link>
          </RevealOnView>
        </header>

        <RevealOnView delay={0.22}>
          <div className="mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {categories.slice(0, 6).map((c, i) => (
              <CategoryCard key={c.id} category={c} idx={i} />
            ))}
          </div>
        </RevealOnView>
      </div>
    </SlideShell>
  );
}
