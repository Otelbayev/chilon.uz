"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { SECTIONS, type SectionKey } from "./sections";

type Props = { activeIdx: number };

/**
 * Vertical "01 / 04 — Section name" label pinned to the left edge on xl+.
 * Animates the section name when the active slide changes.
 */
export default function SlideLabel({ activeIdx }: Props) {
  const { t } = useLang();
  const labels: Record<SectionKey, string> = {
    hero: t("nav.home"),
    categories: t("categories.title"),
    partners: t("nav.partners"),
    cta: t("nav.news"),
  };
  const key = SECTIONS[activeIdx];
  const isHero = activeIdx === 0;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none hidden xl:flex flex-col items-center gap-3">
      <span className={`block w-px h-12 ${isHero ? "bg-white/40" : "bg-ink-300"}`} />

      <span
        className={`text-[10px] uppercase tracking-[0.3em] font-medium ${
          isHero ? "text-white/70" : "text-ink-500"
        }`}
        style={{ writingMode: "vertical-rl" }}
      >
        0{activeIdx + 1} / 0{SECTIONS.length}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={`text-xs font-semibold ${isHero ? "text-brand-300" : "text-brand-700"}`}
          style={{ writingMode: "vertical-rl" }}
        >
          {labels[key]}
        </motion.span>
      </AnimatePresence>

      <span className={`block w-px h-12 ${isHero ? "bg-white/40" : "bg-ink-300"}`} />
    </div>
  );
}
