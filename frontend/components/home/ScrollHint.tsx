"use client";

import { motion } from "motion/react";

/** "scroll ↓" chip pinned to the bottom of a slide. */
export default function ScrollHint({ light = false }: { light?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className={`absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none ${
        light ? "text-white/75" : "text-ink-500"
      }`}
    >
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium">
        scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className={`size-7 sm:size-8 rounded-full border grid place-items-center ${
          light ? "border-white/40" : "border-ink-300"
        }`}
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
