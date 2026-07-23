"use client";

import { useLang } from "@/lib/i18n";
import { getStats } from "@/lib/stats";
import AdditivesStrip from "./AdditivesStrip";
import RevealOnView from "./RevealOnView";
import SlideShell from "./SlideShell";

/**
 * Slide 3 — "Chilon in numbers" plus the additive-supplier logos.
 * Answers the client's "не хватило цифр" and "добавить иконки" notes.
 */
export default function StatsSlide() {
  const { t } = useLang();
  const stats = getStats();

  return (
    <SlideShell
      sectionKey="stats"
      bgClass="bg-gradient-to-b from-white to-[#f5fbf8]"
      pattern={
        <>
          <div className="absolute -top-10 left-[10%] size-[18rem] sm:size-[26rem] rounded-full bg-brand-100/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #059669 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center">
        <header className="max-w-2xl">
          <RevealOnView>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
              03 — {t("stats.subtitle")}
            </span>
          </RevealOnView>
          <RevealOnView delay={0.08}>
            <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
              {t("stats.title")}
            </h2>
          </RevealOnView>
        </header>

        <RevealOnView delay={0.16}>
          <div className="mt-7 sm:mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {stats.map(({ labelKey, value, suffix, approx, icon: Icon }) => (
              <div
                key={labelKey}
                className="group rounded-3xl border border-ink-100 bg-white/85 backdrop-blur p-4 sm:p-5 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-500"
              >
                <span className="grid place-items-center size-10 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-500">
                  <Icon size={20} />
                </span>
                <div className="mt-3.5 flex items-baseline gap-1">
                  <span className="display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-900 tabular-nums">
                    {approx && <span className="text-ink-500">~</span>}
                    {value}
                  </span>
                  {suffix && (
                    <span className="text-sm font-semibold text-brand-600">{suffix}</span>
                  )}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-ink-500 leading-snug">
                  {t(labelKey)}
                </div>
              </div>
            ))}
          </div>
        </RevealOnView>

        <RevealOnView delay={0.26}>
          <div className="mt-5 sm:mt-7">
            <AdditivesStrip />
          </div>
        </RevealOnView>
      </div>
    </SlideShell>
  );
}
