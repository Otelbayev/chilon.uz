"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import type { Partner } from "@/lib/types";
import ArrowRight from "@/components/icons/ArrowRight";
import RevealOnView from "./RevealOnView";
import SlideShell from "./SlideShell";

type Props = { partners: Partner[] };

/** Slide 3 — partner logo wall. */
export default function PartnersSlide({ partners }: Props) {
  const { t } = useLang();

  return (
    <SlideShell
      sectionKey="partners"
      bgClass="bg-gradient-to-b from-[#f5fbf8] via-white to-[#f9fdfa]"
      pattern={
        <>
          <div className="absolute top-[15%] -left-20 size-[20rem] sm:size-[28rem] rounded-full bg-brand-100/45 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center">
        <header className="max-w-2xl">
          <RevealOnView>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
              03 — {t("partners.subtitle")}
            </span>
          </RevealOnView>
          <RevealOnView delay={0.08}>
            <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
              {t("partners.title")}
            </h2>
          </RevealOnView>
        </header>

        <RevealOnView delay={0.18}>
          <div className="mt-7 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {partners.map((p) => (
              <PartnerLogo key={p.id} partner={p} />
            ))}
          </div>
        </RevealOnView>

        <RevealOnView delay={0.28}>
          <div className="mt-7 sm:mt-9">
            <Link href="/partners" className="btn-ghost">
              {t("news.readMore")}
              <ArrowRight />
            </Link>
          </div>
        </RevealOnView>
      </div>
    </SlideShell>
  );
}

function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="group aspect-[3/2] grid place-items-center rounded-2xl border border-ink-100 bg-white/90 backdrop-blur p-4 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500">
      <span className="text-[10px] sm:text-xs font-semibold text-ink-500 group-hover:text-brand-600 text-center line-clamp-2 transition-colors">
        {partner.name}
      </span>
    </div>
  );
}
