"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * GSAP intro animation for the hero — fires once on mount.
 *
 * Targets the `data-hero-*` hooks in HeroSlide. The stagger is deliberately
 * short and the elements overlap heavily, so the entrance reads as one calm
 * move rather than four separate ones ("не перегружено").
 *
 * Skipped entirely when the user prefers reduced motion.
 */
export function useHeroIntro() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-tag]", { y: 20, opacity: 0, duration: 0.6, delay: 0.15 })
        .from("[data-hero-line]", { y: 50, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.35")
        .from("[data-hero-sub]", { y: 26, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-hero-cta]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45")
        .from("[data-hero-canister]", { y: 40, opacity: 0, duration: 1.0 }, "-=0.85");
    });
    return () => ctx.revert();
  }, []);
}
