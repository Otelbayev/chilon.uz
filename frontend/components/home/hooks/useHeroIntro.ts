"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * GSAP intro animation for the hero — fires once on mount.
 * Targets `[data-hero-line]` and `[data-hero-sub]` in the HeroSlide.
 */
export function useHeroIntro() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-line]", {
        y: 60,
        opacity: 0,
        duration: 1.0,
        stagger: 0.14,
        delay: 0.2,
      }).from("[data-hero-sub]", { y: 30, opacity: 0, duration: 0.8 }, "-=0.55");
    });
    return () => ctx.revert();
  }, []);
}
