"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { NewsItem } from "@/lib/types";
import ArrowRight from "@/components/icons/ArrowRight";
import NewsCard from "./NewsCard";
import RevealOnView from "./RevealOnView";
import SlideShell from "./SlideShell";

type Props = { news: NewsItem[] };

/** Slide 4 — latest news grid + final CTA. */
export default function CtaSlide({ news }: Props) {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <SlideShell
      sectionKey="cta"
      bgClass="bg-gradient-to-br from-white via-[#f6fcf9] to-[#e6f7ef]"
      pattern={
        <>
          <div className="absolute top-[10%] right-[10%] size-[22rem] sm:size-[32rem] rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute bottom-[5%] left-[5%] size-[18rem] sm:size-[24rem] rounded-full bg-brand-100/50 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 24px)",
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center pb-10 lg:pb-14">
        <header className="max-w-2xl">
          <RevealOnView>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
              04 — {t("news.subtitle")}
            </span>
          </RevealOnView>
          <RevealOnView delay={0.08}>
            <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
              {t("news.title")}
            </h2>
          </RevealOnView>
        </header>

        <RevealOnView delay={0.16}>
          <div className="mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n, i) => (
              <NewsCard key={n.id} item={n} idx={i} />
            ))}
          </div>
        </RevealOnView>

        <RevealOnView delay={0.28}>
          <div className="mt-7 sm:mt-9 flex flex-wrap gap-2.5 sm:gap-3">
            <Link href="/news" className="btn-ghost">
              {t("news.title")}
            </Link>
            <Link href="/contacts" className="btn-primary">
              {t("hero.cta.contact")}
              <ArrowRight />
            </Link>
          </div>
        </RevealOnView>

        <div className="mt-8 lg:absolute lg:bottom-4 lg:inset-x-0 text-center text-[10px] sm:text-[11px] text-ink-500 px-4">
          © {year} Chilon. {t("footer.rights")}.
        </div>
      </div>
    </SlideShell>
  );
}
