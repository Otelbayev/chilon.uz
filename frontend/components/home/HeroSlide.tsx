"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import ArrowRight from "@/components/icons/ArrowRight";
import ScrollHint from "./ScrollHint";
import SeasonsBackdrop from "./hero/SeasonsBackdrop";
import HeroVideo from "./hero/HeroVideo";
import CanisterShowcase from "./hero/CanisterShowcase";

type Props = {
  /** True while the hero is the active slide — lets the video pause off-screen. */
  active: boolean;
};

/**
 * Hero — three layers that are separated in *space*, not stacked on top of
 * each other (client brief 15.07.26: "не перегружено... текст ничего не
 * перекрывал", "канистра не должна загораживаться"):
 *
 *   z-0   SeasonsBackdrop  — vector scene, poster frame + reduced-motion view
 *   z-0   HeroVideo        — the four-season footage, fades in over the vector
 *   z-10  copy column      — tag, headline, subtitle, CTAs (left)
 *   z-10  canister column  — CanisterShowcase (right, its own grid cell)
 *
 * The two content columns are siblings in a grid, so nothing can ever
 * overlap the product shot.
 */
export default function HeroSlide({ active }: Props) {
  const { t } = useLang();

  return (
    <section
      data-snap-section
      data-section="hero"
      className="relative w-full overflow-hidden min-h-[100svh] lg:h-[100svh] lg:snap-start lg:snap-always bg-white"
    >
      <SeasonsBackdrop />
      <HeroVideo active={active} />

      <div className="relative z-10 min-h-[100svh] lg:h-full flex items-center">
        <div className="container-x w-full grid gap-10 lg:gap-12 pt-24 pb-24 lg:py-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center">
          {/* ---- Copy column ---- */}
          <div className="max-w-xl text-center lg:text-left">
            <span
              data-hero-tag
              className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700"
            >
              {t("hero.tag")}
            </span>

            <h1 className="display mt-4 text-ink-900 text-[2rem] sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold leading-[1.06] tracking-tight">
              <span data-hero-line className="block">
                {t("hero.title")}
              </span>
            </h1>

            <p
              data-hero-sub
              className="mt-4 sm:mt-5 text-base sm:text-lg text-ink-700 leading-relaxed"
            >
              {t("hero.subtitle")}
            </p>

            <div
              data-hero-cta
              className="mt-7 sm:mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link href="/products" className="btn-primary">
                {t("hero.cta.products")}
                <ArrowRight />
              </Link>
              <Link href="/contacts" className="btn-ghost">
                {t("hero.cta.contact")}
              </Link>
            </div>
          </div>

          {/* ---- Canister column — kept clear of every other element ---- */}
          <div className="relative flex justify-center lg:justify-end">
            <CanisterShowcase />
          </div>
        </div>
      </div>

      {/* Left-aligned so it stays outside the canister column. */}
      <ScrollHint className="hidden lg:flex bottom-6 left-12" />
    </section>
  );
}
