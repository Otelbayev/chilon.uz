"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLang } from "@/lib/i18n";
import { SECTIONS, type SectionKey } from "./sections";

type Props = { activeIdx: number };

/**
 * Vertical "01 / 05 — Section name" label pinned to the left edge on xl+.
 * Animates the section name when the active slide changes.
 */
export default function SlideLabel({ activeIdx }: Props) {
  const { t } = useLang();
  const labels: Record<SectionKey, string> = {
    hero: t("nav.home"),
    categories: t("categories.title"),
    stats: t("stats.title"),
    partners: t("nav.partners"),
    cta: t("nav.news"),
  };
  const key = SECTIONS[activeIdx];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none hidden xl:flex flex-col items-center gap-3">
      <span className="block w-px h-12 bg-ink-300" />

      <span
        className="text-[10px] uppercase tracking-[0.3em] font-medium text-ink-500"
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
          className="text-xs font-semibold text-brand-700"
          style={{ writingMode: "vertical-rl" }}
        >
          {labels[key]}
        </motion.span>
      </AnimatePresence>

      <span className="block w-px h-12 bg-ink-300" />
    </div>
  );
}
