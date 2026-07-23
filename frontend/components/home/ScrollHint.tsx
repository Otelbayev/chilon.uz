"use client";

import { motion } from "motion/react";

type Props = {
  /**
   * Positioning classes. Defaults to bottom-centre, but the hero passes a
   * left-aligned variant so the hint never crosses the canister column.
   */
  className?: string;
};

/** "scroll ↓" chip pinned to the bottom of a slide. */
export default function ScrollHint({
  className = "bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2",
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className={`absolute flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none text-ink-500 ${className}`}
    >
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium">
        scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="size-7 sm:size-8 rounded-full border border-ink-300 grid place-items-center"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 5l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
